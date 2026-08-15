<?php

namespace App\Controller\Admin;

use App\Repository\PhotoRepository;
use App\Service\PhotoThumbnailGenerator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class PhotoThumbnailBackfillController extends AbstractController
{
    private const BATCH_SIZE = 20;
    private const CSRF_TOKEN_ID = 'thumbnail-backfill';

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly PhotoRepository $photoRepository,
        private readonly PhotoThumbnailGenerator $thumbnailGenerator,
    ) {
    }

    #[Route(path: '/admin/photos/backfill-thumbnails', name: 'admin_photos_backfill_thumbnails', methods: ['GET'])]
    public function index(): Response
    {
        return $this->render('admin/photo_thumbnail_backfill.html.twig', [
            'missing' => $this->photoRepository->count(['thumbnailGeneratedAt' => null]),
            'total' => $this->photoRepository->count([]),
        ]);
    }

    /**
     * Two modes, both processing bounded batches so a run over ~1000
     * photos can't time out a single request:
     *
     * - "missing" (default): only photos with no thumbnail yet, queried
     *   directly via thumbnailGeneratedAt IS NULL - the normal path for
     *   new uploads and first-time backfills.
     * - "all": every photo, oldest first, regardless of
     *   thumbnailGeneratedAt - for regenerating after a fix to the
     *   generator itself (like the EXIF orientation bug), since "missing"
     *   would skip anything already (wrongly) marked done. Paged with
     *   afterId rather than re-querying thumbnailGeneratedAt IS NULL, since
     *   that'd match nothing once everything already has one.
     */
    #[Route(path: '/admin/photos/backfill-thumbnails/run', name: 'admin_photos_backfill_thumbnails_run', methods: ['POST'])]
    public function run(Request $request): JsonResponse
    {
        if (!$this->isCsrfTokenValid(self::CSRF_TOKEN_ID, (string) $request->request->get('_token'))) {
            throw $this->createAccessDeniedException('Invalid CSRF token.');
        }

        $regenerateAll = 'all' === $request->request->get('mode');
        $afterId = (int) $request->request->get('afterId', '0');

        if ($regenerateAll) {
            $photos = $this->photoRepository->createQueryBuilder('p')
                ->where('p.id > :afterId')
                ->setParameter('afterId', $afterId)
                ->orderBy('p.id', 'ASC')
                ->setMaxResults(self::BATCH_SIZE)
                ->getQuery()
                ->getResult();
        } else {
            $photos = $this->photoRepository->findBy(
                ['thumbnailGeneratedAt' => null],
                ['id' => 'ASC'],
                self::BATCH_SIZE,
            );
        }

        $succeeded = 0;
        $lastId = $afterId;
        foreach ($photos as $photo) {
            if (null !== $photo->getImageName() && $this->thumbnailGenerator->generate($photo->getImageName())) {
                $photo->setThumbnailGeneratedAt(new \DateTimeImmutable());
                ++$succeeded;
            }
            // Failures are left with thumbnailGeneratedAt still null rather
            // than marked done - they'll just keep falling back to
            // on-demand resizing, same as today. Not retried aggressively
            // either: any photo that succeeds elsewhere in the batch is
            // marked done and won't be picked up again, so a batch with one
            // persistently-failing photo still makes real progress on the
            // other 19 each round rather than getting stuck.
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
