<?php

namespace App\EventSubscriber;

use Symfony\Component\DependencyInjection\Attribute\Target;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\IpUtils;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\RateLimiter\RateLimiterFactoryInterface;

/**
 * Generous by design (300 req/min per IP) - this exists to blunt
 * bot-speed scraping of the public API, not to constrain normal browsing.
 * Applies to every method under /api, including the ROLE_ADMIN-gated
 * writes: simplest to reason about, and the limit is high enough that it
 * never meaningfully affects a real admin session either. Runs ahead of
 * the firewall (priority 100 vs. its 8) so unauthenticated write attempts
 * are rate-limited too, not just the reads that get past auth.
 */
#[AsEventListener(event: KernelEvents::REQUEST, priority: 100)]
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

        $clientIp = $request->getClientIp();
        if (null === $clientIp || IpUtils::isPrivateIp($clientIp)) {
            // Server-side rendering calls the backend directly over the
            // Docker network (INTERNAL_API_URL in frontend/src/lib/api.ts),
            // bypassing Caddy entirely - every legitimate page load's API
            // calls would otherwise share one bucket keyed on the frontend
            // container's private IP, and tripping it would 500 the whole
            // site for every visitor. Real internet traffic always arrives
            // via Caddy with a public client IP forwarded (trusted_proxies
            // in framework.yaml), so this only exempts internal
            // infrastructure, never an actual visitor or scraper.
            return;
        }

        $limit = $this->limiter->create($clientIp)->consume();

        if (!$limit->isAccepted()) {
            throw new TooManyRequestsHttpException(
                max(1, $limit->getRetryAfter()->getTimestamp() - time()),
            );
        }
    }
}
