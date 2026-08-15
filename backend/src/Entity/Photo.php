<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\PhotoRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: PhotoRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(security: "is_granted('ROLE_ADMIN')"),
        new Put(security: "is_granted('ROLE_ADMIN')"),
        new Delete(security: "is_granted('ROLE_ADMIN')"),
    ],
    paginationEnabled: false,
    order: ['createdAt' => 'DESC'],
    normalizationContext: ['groups' => ['photo:read']],
    denormalizationContext: ['groups' => ['photo:write']],
)]
#[ApiFilter(SearchFilter::class, properties: [
    'album' => 'exact',
    'album.slug' => 'exact',
    'tags' => 'exact',
    'tags.slug' => 'exact',
])]
class Photo
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['photo:read', 'album:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 150, nullable: true)]
    #[Groups(['photo:read', 'photo:write', 'album:read'])]
    private ?string $title = null;

    #[ORM\ManyToOne(targetEntity: Album::class, inversedBy: 'photos')]
    #[Groups(['photo:read', 'photo:write'])]
    private ?Album $album = null;

    #[ORM\ManyToOne(targetEntity: Camera::class, inversedBy: 'photos')]
    #[Groups(['photo:read', 'photo:write'])]
    private ?Camera $camera = null;

    /** @var Collection<int, Tag> */
    #[ORM\ManyToMany(targetEntity: Tag::class, inversedBy: 'photos')]
    #[Groups(['photo:read', 'photo:write'])]
    private Collection $tags;

    #[ORM\Column(nullable: true)]
    #[Groups(['photo:read', 'photo:write'])]
    private ?\DateTimeImmutable $takenAt = null;

    #[ORM\Column(options: ['default' => false])]
    #[Groups(['photo:read', 'photo:write'])]
    private bool $featured = false;

    /**
     * Filename within the `photos.storage` Flysystem storage. Uploaded and
     * managed through the admin panel (see PhotoCrudController) rather than
     * via the API directly.
     */
    #[ORM\Column(nullable: true)]
    #[Groups(['photo:read'])]
    private ?string $imageName = null;

    /**
     * Set once a pre-sized copy exists in the `photos_thumbnails.storage`
     * Flysystem storage under the same filename as imageName (see
     * PhotoThumbnailListener). Null means no thumbnail yet - either it
     * hasn't been backfilled, or generation failed - and callers should
     * fall back to resizing the original on demand.
     */
    #[ORM\Column(nullable: true)]
    #[Groups(['photo:read'])]
    private ?\DateTimeImmutable $thumbnailGeneratedAt = null;

    #[ORM\Column]
    #[Groups(['photo:read'])]
    private \DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->tags = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getAlbum(): ?Album
    {
        return $this->album;
    }

    public function setAlbum(?Album $album): static
    {
        $this->album = $album;

        return $this;
    }

    public function getCamera(): ?Camera
    {
        return $this->camera;
    }

    public function setCamera(?Camera $camera): static
    {
        $this->camera = $camera;

        return $this;
    }

    /** @return Collection<int, Tag> */
    public function getTags(): Collection
    {
        return $this->tags;
    }

    public function addTag(Tag $tag): static
    {
        if (!$this->tags->contains($tag)) {
            $this->tags->add($tag);
        }

        return $this;
    }

    public function removeTag(Tag $tag): static
    {
        $this->tags->removeElement($tag);

        return $this;
    }

    public function getTakenAt(): ?\DateTimeImmutable
    {
        return $this->takenAt;
    }

    public function setTakenAt(?\DateTimeImmutable $takenAt): static
    {
        $this->takenAt = $takenAt;

        return $this;
    }

    public function isFeatured(): bool
    {
        return $this->featured;
    }

    public function setFeatured(bool $featured): static
    {
        $this->featured = $featured;

        return $this;
    }

    public function getImageName(): ?string
    {
        return $this->imageName;
    }

    public function setImageName(?string $imageName): static
    {
        $this->imageName = $imageName;

        return $this;
    }

    #[Groups(['photo:read', 'album:read'])]
    public function getImageUrl(): ?string
    {
        return $this->imageName ? '/media/photos/'.$this->imageName : null;
    }

    public function getThumbnailGeneratedAt(): ?\DateTimeImmutable
    {
        return $this->thumbnailGeneratedAt;
    }

    public function setThumbnailGeneratedAt(?\DateTimeImmutable $thumbnailGeneratedAt): static
    {
        $this->thumbnailGeneratedAt = $thumbnailGeneratedAt;

        return $this;
    }

    #[Groups(['photo:read', 'album:read'])]
    public function getThumbnailUrl(): ?string
    {
        return $this->thumbnailGeneratedAt && $this->imageName
            ? '/media/photos-thumbnails/'.$this->imageName
            : null;
    }

    #[Groups(['photo:read'])]
    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function __toString(): string
    {
        return $this->title ?? $this->imageName ?? 'Photo #'.($this->id ?? '?');
    }
}
