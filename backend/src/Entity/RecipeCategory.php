<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\RecipeCategoryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\String\Slugger\AsciiSlugger;

#[ORM\Entity(repositoryClass: RecipeCategoryRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(security: "is_granted('ROLE_ADMIN')"),
        new Put(security: "is_granted('ROLE_ADMIN')"),
        new Delete(security: "is_granted('ROLE_ADMIN')"),
    ],
    // Ordered by id (creation order) rather than name, so an admin can put
    // categories in meal order (Breakfast, Lunch, Dinner, ...) just by
    // creating them in that order - no separate position field to manage.
    order: ['id' => 'ASC'],
    normalizationContext: ['groups' => ['recipe_category:read']],
    denormalizationContext: ['groups' => ['recipe_category:write']],
)]
class RecipeCategory
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['recipe:read', 'recipe_category:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 60, unique: true)]
    #[Groups(['recipe:read', 'recipe_category:read', 'recipe_category:write'])]
    private string $name;

    #[ORM\Column(length: 70, unique: true)]
    #[Groups(['recipe:read', 'recipe_category:read'])]
    private string $slug;

    /** @var Collection<int, Recipe> */
    #[ORM\OneToMany(targetEntity: Recipe::class, mappedBy: 'category')]
    private Collection $recipes;

    public function __construct()
    {
        $this->recipes = new ArrayCollection();
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

    /** @return Collection<int, Recipe> */
    public function getRecipes(): Collection
    {
        return $this->recipes;
    }

    public function __toString(): string
    {
        return $this->name;
    }
}
