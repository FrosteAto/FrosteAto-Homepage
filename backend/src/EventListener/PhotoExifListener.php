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
        $needsCamera = null === $photo->getCamera();
        $needsTakenAt = null === $photo->getTakenAt();

        if ((!$needsCamera && !$needsTakenAt) || null === $photo->getImageName()) {
            return;
        }

        $exif = $this->readExif($photo->getImageName());
        if (null === $exif) {
            return;
        }

        if ($needsCamera) {
            $this->applyCameraName($photo, $exif, $args);
        }

        if ($needsTakenAt) {
            $this->applyTakenAt($photo, $exif);
        }
    }

    private function readExif(string $imageName): ?array
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

        return false !== $exif ? $exif : null;
    }

    private function applyCameraName(Photo $photo, array $exif, PrePersistEventArgs $args): void
    {
        $name = $this->detectCameraName($exif);
        if (null === $name) {
            return;
        }

        $name = mb_substr($name, 0, 100);
        $camera = $this->cameraRepository->findOneBy(['name' => $name]);
        if (null === $camera) {
            $camera = new Camera();
            $camera->setName($name);
            $args->getObjectManager()->persist($camera);
        }

        $photo->setCamera($camera);
    }

    private function detectCameraName(array $exif): ?string
    {
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

    private function applyTakenAt(Photo $photo, array $exif): void
    {
        $takenAt = $this->detectTakenAt($exif);
        if (null !== $takenAt) {
            $photo->setTakenAt($takenAt);
        }
    }

    private function detectTakenAt(array $exif): ?\DateTimeImmutable
    {
        // DateTimeOriginal is when the shutter fired; DateTimeDigitized is
        // usually identical for straight-from-camera JPEGs. Deliberately NOT
        // falling back to the plain "DateTime" tag - that one tracks when the
        // file/metadata was last modified (e.g. by editing software), which
        // can silently misrepresent when the photo was actually taken.
        $value = $exif['DateTimeOriginal'] ?? $exif['DateTimeDigitized'] ?? null;
        if (!\is_string($value) || '' === trim($value)) {
            return null;
        }

        $date = \DateTimeImmutable::createFromFormat('Y:m:d H:i:s', trim($value));

        return false !== $date ? $date : null;
    }
}
