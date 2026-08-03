# 0brien.dev Roadmap

Working TODO list for turning this from a single portfolio page into the
full site: portfolio, Software Development, FrosteArch, Photography, Music,
and Blog, on a proper self-hosted stack.

Architecture: Next.js frontend + Symfony/API Platform backend (Postgres +
object storage for photos), deployed together on a DigitalOcean droplet.
Only Photography and Blog actually need the backend - everything else can
ship as static/near-static content first.

Status legend: `[x]` done, `[ ]` not started, `[~]` in progress / partial.

## Needs from you

Everything below is something only you can do - an account, a payment, a
piece of content, or a decision. Front-loading these means I can keep
working through the phases below without stopping. Grouped by how soon
they're actually needed.

**Blocking right now (Phase 2):**

- [ ] **Install the Postgres server.** Only the client library (`psql`) is
      on this machine - the server isn't. I asked for this once already and
      it doesn't look like it landed yet (`pacman -Q postgresql` still comes
      back not-found). Run:
      ```
      sudo pacman -S postgresql
      sudo -iu postgres initdb --locale=C.UTF-8 -D /var/lib/postgres/data
      sudo systemctl enable --now postgresql
      ```

      Done now


- [ ] **Admin login for `/admin`.** Tell me an email + password to create
      (or say "generate one" and I'll make a random one and hand it to you
      once via chat - rotate it after).

      email should be FrosteAto.exparrot@protonmail.com and password for now can just be admin123

**Needed before Phase 2 (Photos) can fully finish:**

- [ ] A DigitalOcean account, if you don't already have one.
- [ ] A DigitalOcean **Space** (object storage bucket) for photos, plus a
      **Spaces access key + secret key** (DO dashboard -> API -> Spaces
      Keys). Hand me the keys and I'll put them straight into `.env.local`
      (gitignored, never committed) - don't paste them anywhere that gets
      committed.
- [ ] Decision: organize photos by **albums**, **tags**, or **both**? Affects
      the Photography page layout.

      Organise by album and tags ideally, but album primarily. For the DO stuff, use placeholders for now.

**Needed for Phase 4 (Music):**

- [ ] Bandcamp URLs for whatever albums exist/are planned - just links, no
      credentials.

      None exist, use placeholders

**Needed for Phase 5 (FrosteArch):**

- [ ] Real content: what FrosteArch actually is, screenshots, download
      links/repo, changelog. I don't know anything about it beyond "custom
      Linux ISO" and won't invent details.

      FrosteArch is https://github.com/FrosteAto/FrosteArch
      Base it off the README for now.
      My general idea if for the page to have three logos at the top with the three flavours, and when you scroll down it tells you about each one's main features and whatnot. Derive from the repo and readme.

**Needed for Phase 6 (Deployment):**

- [ ] **Create the droplet yourself** in the DigitalOcean dashboard - I
      won't spend your money without you taking that step directly. Cheapest
      plan that supports Docker is fine to start (1 vCPU / 1GB is enough for
      Next.js + Symfony + Postgres at this scale). Give me the droplet's IP
      once it exists.
- [ ] SSH access to that droplet - either add a key of mine/yours and tell
      me, or you run the deploy commands I hand you yourself each time.
      Given your "I push, not you" preference on git, you may want the same
      rule for deploys - your call, just tell me which.
- [ ] Where `0brien.dev` DNS is currently managed (which registrar), so I
      can give you the exact record to change when we cut over from GitHub
      Pages.

      We'll do this another time.

**Content pass (Phase 1 follow-up, no rush):**

- [ ] Review/rewrite: Home intro copy, whether "Competencies" is current,
      any Software Development projects to add or drop.

      We'll do this another time

## System dependencies

What this repo actually needs installed on a machine to build/run, and the
exact commands used to get there - so a fresh machine (or future session)
doesn't rediscover these one at a time via failed builds.

**Already required and installed on this machine:**

| Dependency | Why | Install command used |
|---|---|---|
| Node.js, npm | `frontend/` (Next.js) | already present |
| PHP 8.5, Composer | `backend/` (Symfony) | already present |
| `php-pgsql` | Doctrine <-> Postgres driver (`pdo_pgsql`, `pgsql`) | `sudo pacman -S php-pgsql` |
| `php-gd` | Image handling (EasyAdmin image field, thumbnailing later) | `sudo pacman -S php-gd` |
| `iconv`, `intl` PHP extensions | Required by Symfony itself | `.so` files ship with `php`, just needed enabling - done via a project-local `.dev/php-extra.ini`, no sudo required for this part |

Note: this machine's PHP builds several extensions as loadable `.so`
modules rather than compiling them in, and Arch splits some into separate
packages (`php-pgsql`, `php-gd`, etc.) that `composer create-project`
doesn't tell you about upfront - it just fails opaquely. `iconv`/`intl` are
enabled without touching system config via `backend`'s
`PHP_INI_SCAN_DIR=/etc/php/conf.d:<repo>/.dev` env var (see any backend
`composer`/`php bin/console` command in this session) - `pgsql`/`gd` needed
actual package installs since their `.so` files didn't exist at all.

**Still needed (see "Needs from you" above):**

| Dependency | Why | Install command |
|---|---|---|
| `postgresql` (server) | Local dev database | `sudo pacman -S postgresql` + `initdb` + `systemctl enable --now postgresql` (full commands above) |

**Will be needed later, but remotely (on the droplet, not this machine):**

| Dependency | Why | Phase |
|---|---|---|
| Docker + Docker Compose | Runs the whole stack in prod | Phase 6 |
| Caddy | Reverse proxy + auto-HTTPS | Phase 6 (via Docker Compose, not installed on host) |

## Phase 0 - Environment & Foundations

- [x] Confirm Node, npm, PHP, Composer available locally
- [x] Scaffold Next.js app in `frontend/` (TypeScript, Tailwind v4, App Router)
- [x] Install Framer Motion
- [x] Decide on secrets pattern: commit `.env.example`, gitignore `.env.local`
- [x] Apply that pattern to `frontend/`
- [x] Apply the same pattern to `backend/` (Symfony/Flex ships this by
      default; `.env.local` created locally with a real `APP_SECRET` and DB
      credentials, confirmed gitignored)
- [x] Turn on GitHub secret scanning + push protection on the repo

## Phase 1 - Frontend Shell

- [x] Nav bar with all six sections, animated active-link underline, mobile menu
- [x] Page-transition animation on navigation
- [x] Root layout: custom fonts (HelveticaNeue, CommitMono, Satisfy, IBMPlexMono), color palette ported from `Style.sass`
- [x] Home page (landing, intro, links out to every section)
- [x] Software Development page (competencies + Drop By Drop / DUST / Other Projects, ported from the old site)
- [x] Placeholder pages for FrosteArch / Photography / Music / Blog
- [x] Verified: `npm run build` clean, all routes render, no console errors
- [ ] **Content pass** - the ported copy is a direct port of the old site; you flagged it needs love. Revisit:
  - [ ] Home page intro/bio copy
  - [ ] Whether "Competencies" list is current
  - [ ] Any new projects to add/remove on Software Development
  - [ ] Photography/Music/Blog placeholder copy once those sections have real scope
- [ ] Remove `frontend/CLAUDE.md` / `AGENTS.md` framework-generated notice once it's no longer relevant (auto-regenerated by `next dev`, harmless to leave for now)

## Phase 2 - Backend: Photos

- [x] Scaffold `backend/` Symfony app (Symfony 8.1)
- [x] Install API Platform, define `Photo`, `Album`, `Tag` entities
- [x] Install EasyAdminBundle, build Dashboard + CRUD controllers for all three
- [x] Wire photo uploads: EasyAdmin's native Flysystem-backed `ImageField`
      handles this directly - VichUploaderBundle was installed then removed
      as redundant once this was discovered
- [x] Flysystem storage configured (`league/flysystem-bundle` +
      `league/flysystem-aws-s3-v3`), local disk adapter for now, writes
      straight into `public/media/photos` so no streaming controller is
      needed in dev
- [x] Secure the admin panel: `User` entity, form login at `/admin/login`,
      login throttling, `/admin/*` restricted to `ROLE_ADMIN`; a
      `bin/console app:create-admin-user` command creates/resets the one
      admin account (no public registration form, intentionally)
- [x] Container lints clean (`bin/console lint:container`)
- [ ] **Blocked:** create the actual database + run migrations, verify
      `/api` and `/admin` come up in a browser, log in - needs Postgres
      server (see "Needs from you")
- [ ] Provision DigitalOcean Spaces bucket, swap the Flysystem adapter from
      `local` to `aws` once the bucket + keys exist
- [ ] Build the real Photography page in Next.js: gallery grid + lightbox, fetching from the API
- [ ] Implement the album/tag organization scheme once you've picked one

## Phase 3 - Backend: Blog

- [ ] `Post` entity (title, slug, body, tags, publishedAt, draft flag) via API Platform
- [ ] Write/edit posts from the EasyAdmin panel
- [ ] Build the real Blog page: post list + individual post view in Next.js
- [ ] RSS feed
- [ ] (Later, optional) comments, search across blog + photos

## Phase 4 - Music

- [ ] Decide data source: hardcoded list vs simple entity in the Symfony backend
- [ ] Build Music page: album list with cover art, links/embeds to Bandcamp

## Phase 5 - FrosteArch

- [ ] Gather real content: what FrosteArch is, screenshots, download links, changelog
- [ ] Build static FrosteArch page with that content
- [ ] (Later, optional) dynamic download counters / release info pulled from GitHub releases or a build pipeline

## Phase 6 - Deployment & Hosting

- [ ] Provision DigitalOcean droplet (you create it - see "Needs from you")
- [ ] `infra/docker-compose.yml`: Next.js, Symfony (PHP-FPM), Postgres, Caddy
- [ ] `infra/Caddyfile`: reverse proxy `/` -> Next.js, `/api/*` -> Symfony, auto-HTTPS
- [ ] Point `0brien.dev` DNS at the droplet, retire the GitHub Pages `CNAME` setup
- [ ] Real secrets (DB password, Spaces keys, etc.) created directly on the droplet as `.env.local` / Docker env files - never in git
- [ ] Manual deploy flow first (`git pull` + `docker compose up --build` on the droplet)
- [ ] (Later, optional) CI/CD via GitHub Actions

## Backlog / ideas (not scheduled)

- Styling v2
- Auth for a private/draft area
- Search across blog + photos
- Newsletter/RSS signup
- FrosteArch download stats
