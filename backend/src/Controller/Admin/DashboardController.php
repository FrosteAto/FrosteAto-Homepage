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
            ->setTitle('0brien.dev admin')
            // Without this, EasyAdmin's own JS auto-applies its dark scheme
            // when the browser/OS prefers dark - and its dark-scheme CSS
            // re-points tokens like --body-bg at the *other end* of the
            // --gray-* ramp (e.g. --gray-950 instead of --white). Overriding
            // just the ramp's colors in theme.css doesn't stop that remap -
            // it just recolors the same dark structure, so the admin still
            // reads as dark, only tinted. Disabling dark mode outright is
            // the actual fix for "always follow the site's light theme".
            ->disableDarkMode();
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
