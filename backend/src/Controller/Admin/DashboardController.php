<?php

namespace App\Controller\Admin;

use EasyCorp\Bundle\EasyAdminBundle\Attribute\AdminDashboard;
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

    public function configureMenuItems(): iterable
    {
        yield MenuItem::linkToDashboard('Dashboard', 'fa fa-home');
        yield MenuItem::linkTo(PhotoCrudController::class, 'Photos', 'fa fa-image');
        yield MenuItem::linkTo(AlbumCrudController::class, 'Albums', 'fa fa-folder');
        yield MenuItem::linkTo(TagCrudController::class, 'Tags', 'fa fa-tag');
        yield MenuItem::linkTo(CameraCrudController::class, 'Cameras', 'fa fa-camera');
        yield MenuItem::linkTo(PostCrudController::class, 'Blog Posts', 'fa fa-pen');
    }
}
