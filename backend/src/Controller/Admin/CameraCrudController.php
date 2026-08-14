<?php

namespace App\Controller\Admin;

use App\Entity\Camera;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class CameraCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Camera::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Camera')
            ->setEntityLabelInPlural('Cameras');
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->onlyOnIndex();
        yield TextField::new('name');
        yield TextField::new('slug')->onlyOnIndex();
    }
}
