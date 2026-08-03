# 0brien.dev Roadmap

Working TODO list for turning this from a single portfolio page into the
full site: portfolio, Software Development, FrosteArch, Photography, Music,
and Blog, on a proper self-hosted stack.

Architecture: Next.js frontend + Symfony/API Platform backend (Postgres +
object storage for photos), deployed together on a DigitalOcean droplet.
Only Photography and Blog actually need the backend - everything else can
ship as static/near-static content first.

Status legend: `[x]` done, `[ ]` not started, `[~]` in progress / partial.

**Local dev DB has seed data** - one album ("Sample Album"), one photo
(placeholder cat image), one tag ("landscape"), one published post
("Hello, World"), and one draft post, all inserted directly via a
throwaway script to verify the Photography/Blog pipelines end-to-end.
Safe to delete from `/admin` any time - it's local-only, not in git.

## Needs from you

Everything below is something only you can do - an account, a payment, a
piece of content, or a decision. Front-loading these means I can keep
working through the phases below without stopping. Grouped by how soon
they're actually needed.

**Resolved:**

- [x] Postgres server installed and running.
- [x] Admin login for `/admin` created (credentials given in chat, not
      repeated here since this file is public - worth rotating the password
      away from the placeholder one before this ever goes near production).
- [x] Photo organization: **albums primarily, tags as a secondary
      filter/cross-cut.**
- [x] DigitalOcean Spaces: deferred, use placeholders for now - the local
      disk Flysystem adapter already works for dev, so this doesn't block
      building the Photography page. Only matters for Phase 6 (production).
- [x] Bandcamp: no albums exist yet, use placeholders for the Music page.
- [x] FrosteArch content: source is
      [github.com/FrosteAto/FrosteArch](https://github.com/FrosteAto/FrosteArch) -
      base the page on its README. Layout idea: three logos up top for the
      three flavours, scroll down for each one's features, derived from the
      repo/README rather than invented.
- [x] DNS cutover and content pass: explicitly deferred to later - not
      blocking anything right now.

**Still open, no rush:**

- [ ] DigitalOcean account + Spaces bucket + access keys, whenever Phase 6
      gets close.
- [ ] Droplet creation (you create it, I won't spend your money), SSH access
      model, and DNS registrar info - all Phase 6, deferred per above.

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

| `postgresql` (server) | Local dev database | `sudo pacman -S postgresql` + `initdb --locale=C.UTF-8 -D /var/lib/postgres/data` + `systemctl enable --now postgresql` |

Note: this machine's PHP builds several extensions as loadable `.so`
modules rather than compiling them in, and Arch splits some into separate
packages (`php-pgsql`, `php-gd`, etc.) that `composer create-project`
doesn't tell you about upfront - it just fails opaquely. `iconv`/`intl` are
enabled without touching system config via `backend`'s
`PHP_INI_SCAN_DIR=/etc/php/conf.d:<repo>/.dev` env var (see any backend
`composer`/`php bin/console` command in this session) - `pgsql`/`gd` needed
actual package installs since their `.so` files didn't exist at all.

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
- [x] Database created, initial migration generated + run, admin user
      created, `/api` and `/admin` verified end-to-end (login, then the
      Photos CRUD index renders with no errors). One gotcha worth knowing:
      Symfony 8.1's admin login uses a new "same-origin" CSRF strategy that
      validates via `Origin`/`Referer`/`Sec-Fetch-Site` headers instead of a
      classic session token - real browsers send these automatically, but
      testing with `curl` requires adding `-H "Origin: ..."` and
      `-H "Referer: ..."` manually or the login POST gets silently rejected.
- [x] API filters added (album/album.slug/tags/tags.slug on Photo, slug on
      Album) plus a computed `imageUrl` field, so the frontend can browse by
      album or tag without extra backend work
- [x] Real Photography page: `/photography` lists albums by cover photo,
      `/photography/[slug]` shows an album's photos in a grid that opens a
      keyboard-navigable lightbox, tag chips link to `/photography/tag/[slug]`
      as the secondary cross-album view. Verified end-to-end with seeded
      sample data (album, photo, tag) - screenshots and console-error check
      all clean.
- [ ] Provision DigitalOcean Spaces bucket, swap the Flysystem adapter from
      `local` to `aws` once the bucket + keys exist (deferred - not blocking,
      local disk works fine for dev and even a small-scale launch)

## Phase 3 - Backend: Blog

- [x] `Post` entity (title, slug, body, publishedAt) via API Platform -
      null `publishedAt` means draft
- [x] `PublishedPostExtension` (Doctrine query extension) hides drafts and
      future-dated posts from anyone who isn't `ROLE_ADMIN`, for both the
      collection and single-item queries - a guessed slug can't leak a draft
- [x] Write/edit posts from the EasyAdmin panel, added to the dashboard menu
- [x] Real Blog page: list with excerpts + dates, individual post view,
      verified end-to-end (seeded a published post and a draft, confirmed
      only the published one appears via the API and the page)
- [ ] RSS feed (not done - nice-to-have, not blocking)
- [ ] (Later, optional) comments, search across blog + photos

## Phase 4 - Music

- [x] No albums exist yet - built the page with an honest empty state
      rather than fake data, typed `Release[]` array ready to fill in real
      Bandcamp entries. Mentions the real Drop By Drop score credit.

## Phase 5 - FrosteArch

- [x] Pulled real content from
      [github.com/FrosteAto/FrosteArch](https://github.com/FrosteAto/FrosteArch)'s
      README: tagline, the three editions (Desktop/Server/Node) and their
      actual descriptions, the FL Studio + Hatsune Miku music production
      feature
- [x] Built the page: logo + tagline hero, then each edition scroll-reveals
      (Framer Motion `whileInView`) with a real screenshot from the repo.
      Note: the repo only has one main logo (not three per-flavour logos as
      originally pictured) - used a representative screenshot per edition
      instead, flagging the substitution rather than inventing logos that
      don't exist
- [x] Images downloaded from the repo and resized/recompressed (~14MB of
      source screenshots down to ~1.9MB via a throwaway `sharp` script - no
      image tooling was on this machine and installing any needs sudo)
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
