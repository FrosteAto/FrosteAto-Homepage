<?php

namespace App\Controller\Admin;

use App\Entity\MusicAlbum;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\UrlField;

class MusicAlbumCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return MusicAlbum::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Music Album')
            ->setEntityLabelInPlural('Music Albums')
            ->setDefaultSort(['createdAt' => 'DESC']);
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->onlyOnIndex();
        yield TextField::new('title');
        yield TextareaField::new('description')->setRequired(false);
        yield ImageField::new('coverImageName', 'Cover image')
            ->setFlysystemStorage('music_covers.storage')
            ->setUploadDir('/')
            ->setFlysystemUrlPrefix('/media/music-covers/')
            ->setUploadedFileNamePattern('[randomhash].[extension]')
            ->setRequired(false);
        yield UrlField::new('bandcampUrl', 'Bandcamp link')
            ->setRequired(false)
            ->setHelp("Clicking the album on the public site sends visitors straight here. Leave blank for an upcoming release - it'll show as a \"Coming soon\" card instead of a dead link.");
    }
}
