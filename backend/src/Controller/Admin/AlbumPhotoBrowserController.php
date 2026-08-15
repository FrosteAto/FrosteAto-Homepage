<?php

namespace App\Controller\Admin;

use App\Entity\Photo;
use App\Repository\AlbumRepository;
use App\Repository\PhotoRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;

class AlbumPhotoBrowserController extends AbstractController
{
    private const CSRF_TOKEN_ID = 'album-photo-browser';

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly AlbumRepository $albumRepository,
        private readonly PhotoRepository $photoRepository,
    ) {
    }

    #[Route(path: '/admin/albums/{id}/photos', name: 'admin_album_photos', methods: ['GET'])]
    public function browse(int $id): Response
    {
        $album = $this->albumRepository->find($id) ?? throw new NotFoundHttpException('Album not found.');

        $photos = $album->getPhotos()->toArray();
        usort(
            $photos,
            static fn (Photo $a, Photo $b) => ($b->getTakenAt() ?? $b->getCreatedAt()) <=> ($a->getTakenAt() ?? $a->getCreatedAt()),
        );

        return $this->render('admin/album_photo_browser.html.twig', [
            'album' => $album,
            'photos' => $photos,
        ]);
    }

    #[Route(path: '/admin/photos/{id}/toggle-featured', name: 'admin_photo_toggle_featured', methods: ['POST'])]
    public function toggleFeatured(int $id, Request $request): JsonResponse
    {
        $this->assertValidCsrfToken($request);

        $photo = $this->photoRepository->find($id) ?? throw new NotFoundHttpException('Photo not found.');
        $photo->setFeatured(!$photo->isFeatured());
        $this->entityManager->flush();

        return $this->json(['featured' => $photo->isFeatured()]);
    }

    #[Route(path: '/admin/albums/{albumId}/set-cover-photo/{photoId}', name: 'admin_album_set_cover_photo', methods: ['POST'])]
    public function setCoverPhoto(int $albumId, int $photoId, Request $request): JsonResponse
    {
        $this->assertValidCsrfToken($request);

        $album = $this->albumRepository->find($albumId) ?? throw new NotFoundHttpException('Album not found.');
        $photo = $this->photoRepository->find($photoId) ?? throw new NotFoundHttpException('Photo not found.');

        // Toggling the current cover photo off just clears it; toggling a
        // different one on replaces it outright - coverPhoto is a single
        // field on Album, so there's never more than one to begin with.
        $album->setCoverPhoto($album->getCoverPhoto() === $photo ? null : $photo);
        $this->entityManager->flush();

        return $this->json(['coverPhotoId' => $album->getCoverPhoto()?->getId()]);
    }

    private function assertValidCsrfToken(Request $request): void
    {
        if (!$this->isCsrfTokenValid(self::CSRF_TOKEN_ID, (string) $request->request->get('_token'))) {
            throw $this->createAccessDeniedException('Invalid CSRF token.');
        }
    }
}
