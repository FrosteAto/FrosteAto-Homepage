<?php

namespace App\Controller\Admin;

use App\Repository\PhotoRepository;
use App\Service\PhotoExifReader;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Backfills shooting settings (aperture, shutter speed, ISO, focal length)
 * for photos uploaded before that detection existed - mirrors
 * PhotoThumbnailBackfillController's two-mode, batched-with-progress shape.
 *
 * Deliberately scoped to just the settings fields, not camera/takenAt too:
 * those two already have an admin-form override, so silently overwriting a
 * manually-corrected value here would be a real regression, whereas the
 * settings fields have no such override to clash with.
 */
class PhotoMetadataBackfillController extends AbstractController
{
    private const BATCH_SIZE = 20;
    private const CSRF_TOKEN_ID = 'settings-backfill';

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly PhotoRepository $photoRepository,
        private readonly PhotoExifReader $exifReader,
    ) {
    }

    #[Route(path: '/admin/photos/backfill-settings', name: 'admin_photos_backfill_settings', methods: ['GET'])]
    public function index(): Response
    {
        return $this->render('admin/photo_settings_backfill.html.twig', [
            'missing' => $this->countMissing(),
            'total' => $this->photoRepository->count([]),
        ]);
    }

    /**
     * Two modes, same reasoning as the thumbnail backfill:
     *
     * - "missing" (default): only photos where all four settings fields are
     *   still null - the normal path, since a real photo's EXIF is read all
     *   at once, so these fields only ever go from "all null" to "all set"
     *   together, never partially.
     * - "all": every photo, oldest first via afterId paging - for
     *   re-running after a fix to the detection logic itself, since
     *   "missing" would skip anything already (even wrongly) filled in.
     */
    #[Route(path: '/admin/photos/backfill-settings/run', name: 'admin_photos_backfill_settings_run', methods: ['POST'])]
    public function run(Request $request): JsonResponse
    {
        if (!$this->isCsrfTokenValid(self::CSRF_TOKEN_ID, (string) $request->request->get('_token'))) {
            throw $this->createAccessDeniedException('Invalid CSRF token.');
        }

        $regenerateAll = 'all' === $request->request->get('mode');
        $afterId = (int) $request->request->get('afterId', '0');

        $query = $this->photoRepository->createQueryBuilder('p')
            ->where('p.id > :afterId')
            ->setParameter('afterId', $afterId)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(self::BATCH_SIZE);

        if (!$regenerateAll) {
            // Always paged by afterId, even in "missing" mode - not just
            // re-querying "still null" each round like the thumbnail
            // backfill does. A photo with no settings anywhere in its EXIF
            // (common for PNGs/screenshots/already-edited files) stays null
            // after processing too, so a re-query would keep reselecting it
            // forever and starve every photo after it in id order. Paging
            // past afterId guarantees the batch always moves forward
            // regardless of whether a given photo actually had settings to
            // find.
            $query->andWhere('p.aperture IS NULL')
                ->andWhere('p.shutterSpeed IS NULL')
                ->andWhere('p.iso IS NULL')
                ->andWhere('p.focalLength IS NULL');
        }

        $photos = $query->getQuery()->getResult();

        $succeeded = 0;
        $lastId = $afterId;
        foreach ($photos as $photo) {
            $lastId = $photo->getId();

            if (null === $photo->getImageName()) {
                continue;
            }

            $exif = $this->exifReader->readExif($photo->getImageName());
            if (null === $exif) {
                continue;
            }

            $photo->setAperture($this->exifReader->detectAperture($exif));
            $photo->setShutterSpeed($this->exifReader->detectShutterSpeed($exif));
            $photo->setIso($this->exifReader->detectIso($exif));
            $photo->setFocalLength($this->exifReader->detectFocalLength($exif));
            ++$succeeded;
        }

        $this->entityManager->flush();

        return $this->json([
            'batchSize' => \count($photos),
            'succeeded' => $succeeded,
            'lastId' => $lastId,
        ]);
    }

    private function countMissing(): int
    {
        return (int) $this->photoRepository->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->where('p.aperture IS NULL')
            ->andWhere('p.shutterSpeed IS NULL')
            ->andWhere('p.iso IS NULL')
            ->andWhere('p.focalLength IS NULL')
            ->getQuery()
            ->getSingleScalarResult();
    }
}
