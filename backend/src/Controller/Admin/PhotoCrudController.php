<?php

namespace App\Controller\Admin;

use App\Entity\Photo;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class PhotoCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Photo::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Photo')
            ->setEntityLabelInPlural('Photos')
            ->setDefaultSort(['createdAt' => 'DESC']);
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->onlyOnIndex();
        yield ImageField::new('imageName', 'Image')
            ->setFlysystemStorage('photos.storage')
            ->setFlysystemUrlPrefix('/media/photos/')
            ->setUploadedFileNamePattern('[randomhash].[extension]');
        yield TextField::new('title')->setRequired(false);
        yield AssociationField::new('album')->setRequired(false);
        yield AssociationField::new('camera')
            ->setRequired(false)
            ->autocomplete()
            ->setHelp("Auto-detected from the photo's EXIF data when possible (JPEG only) - override here if it's wrong or missing.");
        yield AssociationField::new('tags')->setRequired(false)->autocomplete();
        yield DateTimeField::new('takenAt')->setRequired(false);
        yield DateTimeField::new('createdAt')->onlyOnIndex();
    }
}
