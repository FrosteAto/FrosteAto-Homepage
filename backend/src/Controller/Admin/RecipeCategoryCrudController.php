<?php

namespace App\Controller\Admin;

use App\Entity\RecipeCategory;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class RecipeCategoryCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return RecipeCategory::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Recipe Category')
            ->setEntityLabelInPlural('Recipe Categories')
            ->setHelp('index', 'Order here is meal order, not alphabetical - new categories are added to the end. Create them in the order you want them to appear (e.g. Breakfast, Lunch, Dinner, Snacks, Dessert).');
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->onlyOnIndex();
        yield TextField::new('name');
        yield TextField::new('slug')->onlyOnIndex();
    }
}
