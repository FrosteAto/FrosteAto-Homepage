<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\TagRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\String\Slugger\AsciiSlugger;

#[ORM\Entity(repositoryClass: TagRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(security: "is_granted('ROLE_ADMIN')"),
        new Patch(security: "is_granted('ROLE_ADMIN')"),
        new Delete(security: "is_granted('ROLE_ADMIN')"),
    ],
)]
class Tag
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['photo:read', 'tag:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 50, unique: true)]
    #[Groups(['photo:read', 'tag:read', 'tag:write'])]
    private string $name;

    #[ORM\Column(length: 60, unique: true)]
    #[Groups(['photo:read', 'tag:read'])]
    private string $slug;

    /** @var Collection<int, Photo> */
    #[ORM\ManyToMany(targetEntity: Photo::class, mappedBy: 'tags')]
    private Collection $photos;

    public function __construct()
    {
        $this->photos = new ArrayCollection();
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

    /** @return Collection<int, Photo> */
    public function getPhotos(): Collection
    {
        return $this->photos;
    }
}
