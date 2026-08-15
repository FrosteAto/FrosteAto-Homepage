<?php

namespace App\Controller\Admin;

use App\Entity\Lens;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class LensCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Lens::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Lens')
            ->setEntityLabelInPlural('Lenses');
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->onlyOnIndex();
        yield TextField::new('name');
        yield TextField::new('slug')->onlyOnIndex();
    }
}
