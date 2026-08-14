<?php

namespace App\Controller\Admin;

use App\Entity\Album;
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
            $tags = $form->get('tags')->getData();

            /** @var UploadedFile[] $files */
            $files = $form->get('photos')->getData();

            $succeeded = 0;
            $failures = [];

            foreach ($files as $file) {
                try {
                    if (false === @getimagesize($file->getPathname())) {
                        throw new \RuntimeException('Not a readable image file');
                    }

                    $extension = $file->guessExtension() ?? $file->getClientOriginalExtension();
                    $newFilename = bin2hex(random_bytes(16)).'.'.$extension;

                    $this->storage->write($newFilename, $file->getContent());

                    $photo = new Photo();
                    $photo->setImageName($newFilename);
                    $photo->setAlbum($album);
                    foreach ($tags as $tag) {
                        $photo->addTag($tag);
                    }

                    $this->entityManager->persist($photo);
                    $this->entityManager->flush();

                    ++$succeeded;
                } catch (\Throwable $e) {
                    $failures[] = \sprintf('%s: %s', $file->getClientOriginalName(), $e->getMessage());
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
