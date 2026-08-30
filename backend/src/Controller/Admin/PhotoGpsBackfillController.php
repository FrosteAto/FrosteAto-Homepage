<?php

namespace App\Controller\Admin;

use App\Repository\PhotoRepository;
use App\Service\PhotoGpsStripper;
use App\Service\PhotoThumbnailGenerator;
use Doctrine\ORM\EntityManagerInterface;
use League\Flysystem\FilesystemOperator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Target;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class PhotoGpsBackfillController extends AbstractController
{
    private const BATCH_SIZE = 20;
    private const CSRF_TOKEN_ID = 'gps-backfill';

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly PhotoRepository $photoRepository,
        private readonly PhotoGpsStripper $gpsStripper,
        private readonly PhotoThumbnailGenerator $thumbnailGenerator,
        #[Target('photos.storage')] private readonly FilesystemOperator $storage,
    ) {
    }

    #[Route(path: '/admin/photos/backfill-gps', name: 'admin_photos_backfill_gps', methods: ['GET'])]
    public function index(): Response
    {
        return $this->render('admin/photo_gps_backfill.html.twig', [
            'missing' => $this->photoRepository->count(['gpsStrippedAt' => null]),
            'total' => $this->photoRepository->count([]),
        ]);
    }

    /**
     * Same two-mode shape as the thumbnail backfill: "missing" (default)
     * only touches photos never checked for GPS data; "all" re-checks
     * everything, oldest first via afterId paging, for re-running after a
     * fix to the stripping logic itself.
     */
    #[Route(path: '/admin/photos/backfill-gps/run', name: 'admin_photos_backfill_gps_run', methods: ['POST'])]
    public function run(Request $request): JsonResponse
    {
        if (!$this->isCsrfTokenValid(self::CSRF_TOKEN_ID, (string) $request->request->get('_token'))) {
            throw $this->createAccessDeniedException('Invalid CSRF token.');
        }

        $checkAll = 'all' === $request->request->get('mode');
        $afterId = (int) $request->request->get('afterId', '0');

        if ($checkAll) {
            $photos = $this->photoRepository->createQueryBuilder('p')
                ->where('p.id > :afterId')
                ->setParameter('afterId', $afterId)
                ->orderBy('p.id', 'ASC')
                ->setMaxResults(self::BATCH_SIZE)
                ->getQuery()
                ->getResult();
        } else {
            $photos = $this->photoRepository->findBy(
                ['gpsStrippedAt' => null],
                ['id' => 'ASC'],
                self::BATCH_SIZE,
            );
        }

        $succeeded = 0;
        $lastId = $afterId;
        foreach ($photos as $photo) {
            $imageName = $photo->getImageName();
            if (null !== $imageName) {
                try {
                    $original = $this->storage->read($imageName);
                    $stripped = $this->gpsStripper->strip($original);
                    if ($stripped !== $original) {
                        $this->storage->write($imageName, $stripped);
                    }

                    // An existing thumbnail may be a verbatim byte-for-byte
                    // copy of the pre-strip original - see
                    // PhotoThumbnailGenerator's orientation-1-and-narrow-
                    // enough fast path - so it needs refreshing from the
                    // now-clean original too, whenever one already exists.
                    // Checked unconditionally (not just when this pass
                    // changed the original) so a retry after a prior
                    // thumbnail-only failure still fixes it: once the
                    // original is already clean, stripping it again is a
                    // no-op, and that alone gives no signal that the
                    // thumbnail is still stale from before.
                    //
                    // generate() never throws - it swallows every failure
                    // and returns false - so gpsStrippedAt is only set once
                    // it (or the absence of a thumbnail to worry about)
                    // confirms nothing GPS-bearing is left publicly
                    // reachable. Setting it unconditionally here would
                    // silently reopen this exact bug on a transient
                    // thumbnail-storage failure: the photo would be marked
                    // "checked" while a stale, GPS-bearing thumbnail stayed
                    // live at its own URL, with no future run ever
                    // retrying it.
                    $thumbnailOk = true;
                    if (null !== $photo->getThumbnailGeneratedAt()) {
                        $thumbnailOk = $this->thumbnailGenerator->generate($imageName);
                        if ($thumbnailOk) {
                            $photo->setThumbnailGeneratedAt(new \DateTimeImmutable());
                        }
                    }

                    if ($thumbnailOk) {
                        $photo->setGpsStrippedAt(new \DateTimeImmutable());
                        ++$succeeded;
                    }
                } catch (\Throwable) {
                    // Left with gpsStrippedAt still null - falls back into
                    // the next "missing" run, same as a thumbnail failure.
                }
            }
            $lastId = $photo->getId();
        }

        $this->entityManager->flush();

        return $this->json([
            'batchSize' => \count($photos),
            'succeeded' => $succeeded,
            'lastId' => $lastId,
        ]);
    }
}
