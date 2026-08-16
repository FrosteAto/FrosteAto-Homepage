<?php

namespace App\Controller\Admin;

use App\Entity\Recipe;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class RecipeCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Recipe::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Recipe')
            ->setEntityLabelInPlural('Recipes')
            ->setDefaultSort(['createdAt' => 'DESC']);
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->onlyOnIndex();
        yield ImageField::new('imageName', 'Photo')
            ->setFlysystemStorage('recipes.storage')
            ->setUploadDir('/')
            ->setFlysystemUrlPrefix('/media/recipes/')
            ->setUploadedFileNamePattern('[randomhash].[extension]')
            ->setRequired(false);
        yield TextField::new('title');
        yield TextField::new('slug')->onlyOnIndex();
        yield TextareaField::new('description')
            ->setNumOfRows(3)
            ->setRequired(false)
            ->setHelp('A short intro shown between the photo and the ingredients - what makes this recipe worth making, not a list of steps.');
        yield TextareaField::new('ingredients')
            ->setNumOfRows(10)
            ->setHelp('One ingredient per line.');
        yield TextareaField::new('steps', 'Method')
            ->setNumOfRows(12)
            ->setHelp('One step per line.');
        yield TextareaField::new('authorNotes', "Author's notes")
            ->setNumOfRows(6)
            ->setRequired(false);
        yield TextField::new('servings')
            ->setRequired(false)
            ->setHelp('e.g. "4" or "4-6".');
        yield TextField::new('prepTime', 'Prep time')
            ->setRequired(false)
            ->setHelp('e.g. "15 min".');
        yield TextField::new('cookTime', 'Cook time')
            ->setRequired(false)
            ->setHelp('e.g. "40 min".');
        yield IntegerField::new('kcalPerServing', 'Calories per serving')
            ->setHelp('kcal, per serving.');
        yield IntegerField::new('proteinPerServing', 'Protein per serving (g)')
            ->setRequired(false);
        yield DateTimeField::new('publishedAt')
            ->setRequired(false)
            ->setHelp('Leave blank to keep this recipe as a draft - it will not appear on the public site or API.');
        yield DateTimeField::new('createdAt')->onlyOnIndex();
    }
}
