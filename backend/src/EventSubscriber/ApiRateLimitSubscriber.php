<?php

namespace App\EventSubscriber;

use Symfony\Component\DependencyInjection\Attribute\Target;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\RateLimiter\RateLimiterFactoryInterface;

/**
 * Generous by design (300 req/min per IP) - this exists to blunt
 * bot-speed scraping of the public API, not to constrain normal browsing.
 * Applies to every method under /api, including the ROLE_ADMIN-gated
 * writes: simplest to reason about, and the limit is high enough that it
 * never meaningfully affects a real admin session either.
 */
#[AsEventListener(event: KernelEvents::REQUEST)]
class ApiRateLimitSubscriber
{
    public function __construct(
        #[Target('api_public')] private readonly RateLimiterFactoryInterface $limiter,
    ) {
    }

    public function __invoke(RequestEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();
        if (!str_starts_with($request->getPathInfo(), '/api')) {
            return;
        }

        $limit = $this->limiter->create($request->getClientIp())->consume();

        if (!$limit->isAccepted()) {
            throw new TooManyRequestsHttpException(
                $limit->getRetryAfter()->getTimestamp() - time(),
            );
        }
    }
}
