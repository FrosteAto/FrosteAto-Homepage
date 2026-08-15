<?php

namespace App\Controller\Admin;

use EasyCorp\Bundle\EasyAdminBundle\Attribute\AdminDashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\Assets;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGeneratorInterface;
use Symfony\Component\HttpFoundation\Response;

#[AdminDashboard(routePath: '/admin', routeName: 'admin')]
class DashboardController extends AbstractDashboardController
{
    public function index(): Response
    {
        $adminUrlGenerator = $this->container->get(AdminUrlGeneratorInterface::class);

        return $this->redirect($adminUrlGenerator->setController(PhotoCrudController::class)->generateUrl());
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('0brien.dev admin');
    }

    public function configureAssets(): Assets
    {
        return Assets::new()
            ->addCssFile('admin/theme.css');
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::linkToDashboard('Dashboard', 'fa fa-home');
        yield MenuItem::linkTo(PhotoCrudController::class, 'Photos', 'fa fa-image');
        yield MenuItem::linkToRoute('Bulk Upload', 'fa fa-upload', 'admin_photos_bulk_upload');
        yield MenuItem::linkToRoute('Generate Thumbnails', 'fa fa-images', 'admin_photos_backfill_thumbnails');
        yield MenuItem::linkToRoute('Backfill Camera Settings', 'fa fa-sliders', 'admin_photos_backfill_settings');
        yield MenuItem::linkTo(AlbumCrudController::class, 'Albums', 'fa fa-folder');
        yield MenuItem::linkTo(TagCrudController::class, 'Tags', 'fa fa-tag');
        yield MenuItem::linkTo(CameraCrudController::class, 'Cameras', 'fa fa-camera');
        yield MenuItem::linkTo(PostCrudController::class, 'Blog Posts', 'fa fa-pen');
    }
}
