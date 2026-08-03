<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\AlbumRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\String\Slugger\AsciiSlugger;

#[ORM\Entity(repositoryClass: AlbumRepository::class)]
#[ApiResource]
class Album
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['photo:read', 'album:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Groups(['photo:read', 'album:read', 'album:write'])]
    private string $name;

    #[ORM\Column(length: 120, unique: true)]
    #[Groups(['album:read'])]
    private string $slug;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['album:read', 'album:write'])]
    private ?string $description = null;

    #[ORM\ManyToOne(targetEntity: Photo::class)]
    #[Groups(['album:read', 'album:write'])]
    private ?Photo $coverPhoto = null;

    /** @var Collection<int, Photo> */
    #[ORM\OneToMany(targetEntity: Photo::class, mappedBy: 'album')]
    private Collection $photos;

    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->photos = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;
        $this->slug = (new AsciiSlugger())->slug($name)->lower()->toString();

        return $this;
    }

    public function getSlug(): string
    {
        return $this->slug;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getCoverPhoto(): ?Photo
    {
        return $this->coverPhoto;
    }

    public function setCoverPhoto(?Photo $coverPhoto): static
    {
        $this->coverPhoto = $coverPhoto;

        return $this;
    }

    /** @return Collection<int, Photo> */
    public function getPhotos(): Collection
    {
        return $this->photos;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }
}
