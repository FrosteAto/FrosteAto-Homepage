<?php

namespace App\EventListener;

use App\Entity\Camera;
use App\Entity\Photo;
use App\Repository\CameraRepository;
use App\Service\PhotoExifReader;
use App\Service\PhotoGpsStripper;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Events;
use League\Flysystem\FilesystemOperator;
use Symfony\Component\DependencyInjection\Attribute\Target;

#[AsEntityListener(event: Events::prePersist, method: 'prePersist', entity: Photo::class)]
class PhotoExifListener
{
    public function __construct(
        private readonly PhotoExifReader $exifReader,
        private readonly CameraRepository $cameraRepository,
        private readonly PhotoGpsStripper $gpsStripper,
        #[Target('photos.storage')] private readonly FilesystemOperator $storage,
    ) {
    }

    public function prePersist(Photo $photo, PrePersistEventArgs $args): void
    {
        if (null === $photo->getImageName()) {
            return;
        }

        $exif = $this->exifReader->readExif($photo->getImageName());
        if (null === $exif) {
            return;
        }

        if (null === $photo->getCamera()) {
            $this->applyCameraName($photo, $exif, $args);
        }

        if (null === $photo->getTakenAt()) {
            $takenAt = $this->exifReader->detectTakenAt($exif);
            if (null !== $takenAt) {
                $photo->setTakenAt($takenAt);
            }
        }

        // Unlike camera/takenAt, shooting settings have no admin form field
        // to override - a new Photo's values here are always null at this
        // point, so there's no "already set" case to skip.
        $photo->setAperture($this->exifReader->detectAperture($exif));
        $photo->setShutterSpeed($this->exifReader->detectShutterSpeed($exif));
        $photo->setIso($this->exifReader->detectIso($exif));
        $photo->setFocalLength($this->exifReader->detectFocalLength($exif));

        $this->stripGpsData($photo);
    }

    private function stripGpsData(Photo $photo): void
    {
        $imageName = $photo->getImageName();
        if (null === $imageName) {
            return;
        }

        try {
            $original = $this->storage->read($imageName);
            $stripped = $this->gpsStripper->strip($original);

            if ($stripped !== $original) {
                $this->storage->write($imageName, $stripped);
            }
        } catch (\Throwable) {
            // Same defensive stance as EXIF reading itself: an unreadable
            // or unwritable file must never block the upload. The photo
            // just won't be marked as GPS-checked, so a later backfill
            // run will pick it up.
            return;
        }

        $photo->setGpsStrippedAt(new \DateTimeImmutable());
    }

    private function applyCameraName(Photo $photo, array $exif, PrePersistEventArgs $args): void
    {
        $name = $this->exifReader->detectCameraName($exif);
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
}
