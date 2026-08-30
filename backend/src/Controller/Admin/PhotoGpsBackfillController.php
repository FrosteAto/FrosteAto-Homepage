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
                        // The existing thumbnail (if any) may be a verbatim
                        // byte-for-byte copy of the pre-strip original - see
                        // PhotoThumbnailGenerator's orientation-1-and-narrow-
                        // enough fast path - so it needs regenerating from
                        // the now-clean original too. Without this, a photo
                        // can be marked GPS-checked while an old GPS-bearing
                        // copy stays publicly reachable at its own URL.
                        if ($this->thumbnailGenerator->generate($imageName)) {
                            $photo->setThumbnailGeneratedAt(new \DateTimeImmutable());
                        }
                    }
                    $photo->setGpsStrippedAt(new \DateTimeImmutable());
                    ++$succeeded;
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
