# 0brien.dev

Personal site and portfolio is being remade, please bear with me!

## Structure

- `frontend/` - Next.js (App Router, TypeScript, Tailwind, Framer Motion). Currently the whole site: Home, Software Development, FrosteArch, Photography, Music, Blog.
- `backend/` - Symfony API (photos, blog CMS, metadata). Not built yet - Phase 2.
- `infra/` - Deployment config (Docker Compose, Caddy). Not built yet.

## Local development

```bash
cd frontend
npm install
npm run dev
```

Copy `frontend/.env.example` to `frontend/.env.local` for any local environment variables - `.env.local` is gitignored and never committed.

## Roadmap

1. **Frontend shell** (done) - all pages scaffolded, portfolio content ported over, Photography/Music/Blog are placeholders.
2. **Photo backend** - Symfony + API Platform + Postgres + object storage, admin upload UI, wire up the Photography page.
3. **Blog CMS** - same backend, wire up the Blog page.
4. **Music** - static Bandcamp links/embeds.
5. **FrosteArch** - static content to start, possibly dynamic download stats later.
