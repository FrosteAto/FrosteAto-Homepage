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
use App\Repository\RecipeRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\String\Slugger\AsciiSlugger;

#[ORM\Entity(repositoryClass: RecipeRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(security: "is_granted('ROLE_ADMIN')"),
        new Put(security: "is_granted('ROLE_ADMIN')"),
        new Delete(security: "is_granted('ROLE_ADMIN')"),
    ],
    paginationEnabled: false,
    order: ['publishedAt' => 'DESC'],
    normalizationContext: ['groups' => ['recipe:read']],
    denormalizationContext: ['groups' => ['recipe:write']],
)]
#[ApiFilter(SearchFilter::class, properties: ['slug' => 'exact'])]
class Recipe implements Publishable
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['recipe:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 150)]
    #[Groups(['recipe:read', 'recipe:write'])]
    private string $title;

    #[ORM\Column(length: 170, unique: true)]
    #[Groups(['recipe:read'])]
    private string $slug;

    /**
     * Short intro/teaser shown between the photo and the ingredients on the
     * recipe page - distinct from authorNotes, which reads as tips/asides
     * and stays at the bottom of the page.
     */
    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['recipe:read', 'recipe:write'])]
    private ?string $description = null;

    #[ORM\Column(type: 'text')]
    #[Groups(['recipe:read', 'recipe:write'])]
    private string $ingredients;

    #[ORM\Column(type: 'text')]
    #[Groups(['recipe:read', 'recipe:write'])]
    private string $steps;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['recipe:read', 'recipe:write'])]
    private ?string $authorNotes = null;

    #[ORM\Column(length: 40, nullable: true)]
    #[Groups(['recipe:read', 'recipe:write'])]
    private ?string $servings = null;

    #[ORM\Column(length: 40, nullable: true)]
    #[Groups(['recipe:read', 'recipe:write'])]
    private ?string $prepTime = null;

    #[ORM\Column(length: 40, nullable: true)]
    #[Groups(['recipe:read', 'recipe:write'])]
    private ?string $cookTime = null;

    /**
     * Filename within the `recipes.storage` Flysystem storage. Uploaded and
     * managed through the admin panel (see RecipeCrudController) rather
     * than via the API directly.
     */
    #[ORM\Column(nullable: true)]
    #[Groups(['recipe:read'])]
    private ?string $imageName = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['recipe:read', 'recipe:write'])]
    private ?\DateTimeImmutable $publishedAt = null;

    #[ORM\Column]
    #[Groups(['recipe:read'])]
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
        $this->slug = (new AsciiSlugger())->slug($title)->lower()->toString();

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

    public function getIngredients(): string
    {
        return $this->ingredients;
    }

    public function setIngredients(string $ingredients): static
    {
        $this->ingredients = $ingredients;

        return $this;
    }

    public function getSteps(): string
    {
        return $this->steps;
    }

    public function setSteps(string $steps): static
    {
        $this->steps = $steps;

        return $this;
    }

    public function getAuthorNotes(): ?string
    {
        return $this->authorNotes;
    }

    public function setAuthorNotes(?string $authorNotes): static
    {
        $this->authorNotes = $authorNotes;

        return $this;
    }

    public function getServings(): ?string
    {
        return $this->servings;
    }

    public function setServings(?string $servings): static
    {
        $this->servings = $servings;

        return $this;
    }

    public function getPrepTime(): ?string
    {
        return $this->prepTime;
    }

    public function setPrepTime(?string $prepTime): static
    {
        $this->prepTime = $prepTime;

        return $this;
    }

    public function getCookTime(): ?string
    {
        return $this->cookTime;
    }

    public function setCookTime(?string $cookTime): static
    {
        $this->cookTime = $cookTime;

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

    #[Groups(['recipe:read'])]
    public function getImageUrl(): ?string
    {
        return $this->imageName ? '/media/recipes/'.$this->imageName : null;
    }

    public function getPublishedAt(): ?\DateTimeImmutable
    {
        return $this->publishedAt;
    }

    public function setPublishedAt(?\DateTimeImmutable $publishedAt): static
    {
        $this->publishedAt = $publishedAt;

        return $this;
    }

    #[Groups(['recipe:read'])]
    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function __toString(): string
    {
        return $this->title;
    }
}
