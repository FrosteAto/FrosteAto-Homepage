<?php

namespace App\Controller\Admin;

use App\Entity\Album;
use App\Entity\Camera;
use App\Entity\Photo;
use App\Entity\Tag;
use Doctrine\ORM\EntityManagerInterface;
use League\Flysystem\FilesystemOperator;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Target;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class PhotoBulkUploadController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        #[Target('photos.storage')] private readonly FilesystemOperator $storage,
    ) {
    }

    #[Route(path: '/admin/photos/bulk-upload', name: 'admin_photos_bulk_upload')]
    public function __invoke(Request $request): Response
    {
        $form = $this->createFormBuilder()
            ->add('photos', FileType::class, [
                'multiple' => true,
                'mapped' => false,
                'required' => true,
                'label' => 'Photos',
            ])
            ->add('album', EntityType::class, [
                'class' => Album::class,
                'choice_label' => 'name',
                'required' => false,
                'placeholder' => 'No album',
            ])
            ->add('camera', EntityType::class, [
                'class' => Camera::class,
                'choice_label' => 'name',
                'required' => false,
                'placeholder' => 'Auto-detect from EXIF',
            ])
            ->add('tags', EntityType::class, [
                'class' => Tag::class,
                'choice_label' => 'name',
                'multiple' => true,
                'required' => false,
            ])
            ->add('submit', SubmitType::class, ['label' => 'Upload'])
            ->getForm();

        $form->handleRequest($request);

        $results = null;

        if ($form->isSubmitted() && $form->isValid()) {
            $album = $form->get('album')->getData();
            $camera = $form->get('camera')->getData();
            $tags = $form->get('tags')->getData();

            /** @var UploadedFile[] $files */
            $files = $form->get('photos')->getData();

            $succeeded = 0;
            $failures = [];

            foreach ($files as $file) {
                $newFilename = null;

                try {
                    if (false === @getimagesize($file->getPathname())) {
                        throw new \RuntimeException('Not a readable image file');
                    }

                    $extension = $file->guessExtension() ?? $file->getClientOriginalExtension();
                    $newFilename = bin2hex(random_bytes(16)).'.'.$extension;

                    $this->storage->write($newFilename, $file->getContent());

                    $originalTitle = pathinfo($file->getClientOriginalName(), \PATHINFO_FILENAME);

                    $photo = new Photo();
                    $photo->setImageName($newFilename);
                    $photo->setTitle('' !== $originalTitle ? mb_substr($originalTitle, 0, 150) : null);
                    $photo->setAlbum($album);
                    if (null !== $camera) {
                        $photo->setCamera($camera);
                    }
                    foreach ($tags as $tag) {
                        $photo->addTag($tag);
                    }

                    $this->entityManager->persist($photo);
                    $this->entityManager->flush();

                    ++$succeeded;
                } catch (\Throwable $e) {
                    if (null !== $newFilename) {
                        try {
                            $this->storage->delete($newFilename);
                        } catch (\Throwable) {
                            // Best-effort cleanup - the failure below is already reported.
                        }
                    }

                    $failures[] = \sprintf('%s: %s', $file->getClientOriginalName(), $e->getMessage());

                    if (!$this->entityManager->isOpen()) {
                        $failures[] = 'Batch stopped early: a database error closed the connection, so remaining files were not processed.';
                        break;
                    }
                }
            }

            $results = ['succeeded' => $succeeded, 'failures' => $failures];
        }

        return $this->render('admin/photo_bulk_upload.html.twig', [
            'form' => $form,
            'results' => $results,
        ]);
    }
}
