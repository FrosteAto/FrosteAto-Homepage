<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\MusicAlbumRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: MusicAlbumRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(security: "is_granted('ROLE_ADMIN')"),
        new Patch(security: "is_granted('ROLE_ADMIN')"),
        new Delete(security: "is_granted('ROLE_ADMIN')"),
    ],
    paginationEnabled: false,
    order: ['createdAt' => 'DESC'],
    normalizationContext: ['groups' => ['music_album:read']],
    denormalizationContext: ['groups' => ['music_album:write']],
)]
class MusicAlbum
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['music_album:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 150)]
    #[Groups(['music_album:read', 'music_album:write'])]
    private string $title;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['music_album:read', 'music_album:write'])]
    private ?string $description = null;

    /**
     * Filename within the `music_covers.storage` Flysystem storage. Uploaded
     * and managed through the admin panel (see MusicAlbumCrudController)
     * rather than via the API directly.
     */
    #[ORM\Column(nullable: true)]
    #[Groups(['music_album:read'])]
    private ?string $coverImageName = null;

    /**
     * No detail page on this site - clicking an album's card sends visitors
     * straight here instead. Left null renders the card as an obvious
     * "coming soon" placeholder rather than a dead link.
     */
    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['music_album:read', 'music_album:write'])]
    private ?string $bandcampUrl = null;

    #[ORM\Column]
    #[Groups(['music_album:read'])]
    private \DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
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

    public function getCoverImageName(): ?string
    {
        return $this->coverImageName;
    }

    public function setCoverImageName(?string $coverImageName): static
    {
        $this->coverImageName = $coverImageName;

        return $this;
    }

    #[Groups(['music_album:read'])]
    public function getCoverImageUrl(): ?string
    {
        return $this->coverImageName ? '/media/music-covers/'.$this->coverImageName : null;
    }

    public function getBandcampUrl(): ?string
    {
        return $this->bandcampUrl;
    }

    public function setBandcampUrl(?string $bandcampUrl): static
    {
        $this->bandcampUrl = $bandcampUrl;

        return $this;
    }

    #[Groups(['music_album:read'])]
    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function __toString(): string
    {
        return $this->title;
    }
}
