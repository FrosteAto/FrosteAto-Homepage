<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\LensRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\String\Slugger\AsciiSlugger;

#[ORM\Entity(repositoryClass: LensRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(security: "is_granted('ROLE_ADMIN')"),
        new Put(security: "is_granted('ROLE_ADMIN')"),
        new Delete(security: "is_granted('ROLE_ADMIN')"),
    ],
)]
class Lens
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['album:read', 'lens:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 100, unique: true)]
    #[Groups(['album:read', 'lens:read', 'lens:write'])]
    private string $name;

    #[ORM\Column(length: 120, unique: true)]
    #[Groups(['album:read', 'lens:read'])]
    private string $slug;

    /** @var Collection<int, Album> */
    #[ORM\OneToMany(targetEntity: Album::class, mappedBy: 'lens')]
    private Collection $albums;

    public function __construct()
    {
        $this->albums = new ArrayCollection();
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

    /** @return Collection<int, Album> */
    public function getAlbums(): Collection
    {
        return $this->albums;
    }

    public function __toString(): string
    {
        return $this->name;
    }
}
