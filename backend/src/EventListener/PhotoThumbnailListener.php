<?php

namespace App\EventListener;

use App\Entity\Photo;
use App\Service\PhotoThumbnailGenerator;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::prePersist, method: 'prePersist', entity: Photo::class)]
class PhotoThumbnailListener
{
    public function __construct(
        private readonly PhotoThumbnailGenerator $thumbnailGenerator,
    ) {
    }

    public function prePersist(Photo $photo, PrePersistEventArgs $args): void
    {
        if (null !== $photo->getThumbnailGeneratedAt() || null === $photo->getImageName()) {
            return;
        }

        if ($this->thumbnailGenerator->generate($photo->getImageName())) {
            $photo->setThumbnailGeneratedAt(new \DateTimeImmutable());
        }
    }
}
