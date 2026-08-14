<?php

namespace App\EventListener;

use App\Entity\Camera;
use App\Entity\Photo;
use App\Repository\CameraRepository;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Events;
use League\Flysystem\FilesystemOperator;
use Symfony\Component\DependencyInjection\Attribute\Target;

#[AsEntityListener(event: Events::prePersist, method: 'prePersist', entity: Photo::class)]
class PhotoExifListener
{
    public function __construct(
        #[Target('photos.storage')] private readonly FilesystemOperator $storage,
        private readonly CameraRepository $cameraRepository,
    ) {
    }

    public function prePersist(Photo $photo, PrePersistEventArgs $args): void
    {
        if (null !== $photo->getCamera() || null === $photo->getImageName()) {
            return;
        }

        $name = $this->detectCameraName($photo->getImageName());
        if (null === $name) {
            return;
        }

        $camera = $this->cameraRepository->findOneBy(['name' => $name]);
        if (null === $camera) {
            $camera = new Camera();
            $camera->setName($name);
            $args->getObjectManager()->persist($camera);
        }

        $photo->setCamera($camera);
    }

    private function detectCameraName(string $imageName): ?string
    {
        $stream = null;

        try {
            $stream = $this->storage->readStream($imageName);
            $exif = @exif_read_data($stream);
        } catch (\Throwable) {
            return null;
        } finally {
            if (\is_resource($stream)) {
                fclose($stream);
            }
        }

        if (false === $exif) {
            return null;
        }

        $make = isset($exif['Make']) ? trim((string) $exif['Make']) : '';
        $model = isset($exif['Model']) ? trim((string) $exif['Model']) : '';

        if ('' === $model) {
            return '' !== $make ? $make : null;
        }

        if ('' === $make) {
            return $model;
        }

        // Compare against Make's first word, not the whole string: real EXIF
        // commonly has a verbose Make ("NIKON CORPORATION") whose Model
        // ("NIKON D750") only echoes the brand's first word, not the full
        // string - matching the whole Make would miss that and produce
        // "NIKON CORPORATION NIKON D750".
        $makeFirstWord = strtolower(strtok($make, ' '));
        if (str_starts_with(strtolower($model), $makeFirstWord)) {
            return $model;
        }

        return $make.' '.$model;
    }
}
