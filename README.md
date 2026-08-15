# 0brien.dev

Personal site and portfolio: Home, Software Development, FrosteArch,
Photography, Music, and Blog. Live at [0brien.dev](https://0brien.dev).

## Project structure

- `frontend/` - Next.js (App Router, TypeScript, Tailwind CSS, Framer Motion). The whole public site.
- `backend/` - Symfony + API Platform. Powers the Photography and Blog admin/API; everything else is static content in the frontend.
- `infra/` - Production Docker Compose stack and Caddyfile, used by the deploy workflow.
- `.github/workflows/` - CI/CD: builds and deploys on push to `main`.

## Getting started (fresh machine)

### 1. Prerequisites

- **Node.js** and **npm**
- **PHP 8.4+** and **Composer**, with the `pdo_pgsql`, `pgsql`, `intl`, `gd`, `ctype`, `iconv`, and `zip` extensions enabled
- **PostgreSQL** (server), running locally
- **Docker** and **Docker Compose** - optional, but the easiest way to run both apps once step 2 is done (see step 4 below)

Exact install commands vary by OS/package manager. On Arch Linux, for example:

```bash
sudo pacman -S postgresql php composer php-pgsql php-gd
sudo -iu postgres initdb --locale=C.UTF-8 -D /var/lib/postgres/data
sudo systemctl enable --now postgresql
```

(`intl`, `iconv`, and `zip` ship inside Arch's base `php` package but are disabled
by default - no separate install needed, but see step 2: the setup script
detects this and tells you exactly how to switch them on.)

### 2. Run the setup script

```bash
./setup.sh
```

This handles everything else:

- Checks that PHP actually has the extensions above enabled, and prints the exact fix if not - including a ready-made `.dev/php-extra.ini` for distros (like Arch above) that install an extension but leave it switched off
- Creates `backend/.env.local` and `frontend/.env.local` - gitignored local config - with a generated `APP_SECRET` and the `DATABASE_URL`/`API_URL` defaults used below
- Creates the local `app` PostgreSQL role (password `app-dev-password`) and `app` database, if PostgreSQL is running and it has the access to do so (otherwise it prints the exact `sudo -iu postgres psql ...` command to run by hand)
- Runs `composer install` and `npm install`
- Runs the database migrations

It's safe to re-run any time, e.g. after pulling changes that add new
dependencies or migrations - it won't overwrite `.env.local` values you've
already customized.

### 3. Create an admin user

The one thing the script can't do for you, since it needs a real email and password:

```bash
cd backend
php bin/console app:create-admin-user you@example.com a-strong-password
```

### 4. Run it

**Option A - natively:**

```bash
# backend/ - serves the API + admin panel at :8000
php -S localhost:8000 -t public   # or `symfony server:start` if you have the Symfony CLI installed

# frontend/ - serves the site at :3000
npm run dev
```

**Option B - Docker** (Linux only; requires the Docker daemon running and the
`nf_tables` kernel module loaded - `sudo modprobe nf_tables` if `docker compose`
fails to start networking):

```bash
docker compose up --build
```

Builds and runs both apps in containers, bind-mounted so edits take effect
without a rebuild. The containers don't install dependencies themselves -
they reuse `vendor/` and `node_modules/` from the host - and they connect to
the native Postgres from step 1 (not a containerized one, to avoid a port
clash), so steps 1-2 above are still required first. (Step 3 isn't required
to start the containers, but you'll still need it to log into `/admin`.)
This is a dev-only setup; `infra/docker-compose.yml` is the separate
production stack the deploy workflow uses.

Once running: the site is at `http://localhost:3000`, the API at
`http://localhost:8000/api`, and the admin panel at `http://localhost:8000/admin`.

## Editing the site

Most pages are plain React components - edit, save, and `npm run dev`
hot-reloads immediately:

- **Home** - `frontend/src/app/page.tsx`
- **Software Development** - `frontend/src/app/software/page.tsx`
- **FrosteArch** - `frontend/src/app/frostearch/page.tsx`
- **Music** - `frontend/src/app/music/page.tsx`

Shared UI lives in `frontend/src/components/`, site-wide styles in
`frontend/src/app/globals.css`, and fonts in `frontend/src/fonts/`.

**Blog** and **Photography** are different: their content comes from the
backend, not frontend source files. With the backend running (see "Run it"
above), manage posts, photos, albums, tags, and cameras at
`http://localhost:8000/admin` - the frontend pages just render whatever the
API returns, and pick up new or edited content without a rebuild (ISR).

A few things about the photo admin worth knowing:

- **Camera and taken-at date detection are automatic, JPEG-only.** Uploading
  a photo reads its EXIF data and fills in the Camera and Taken at fields for
  you, if the file has them - most real camera JPEGs do, but PNGs,
  screenshots, and some already-edited/exported files often don't. When
  detection comes up empty, those fields just stay unset; edit them by hand
  on the Photos page if you want to fix or add one. Photos uploaded before
  this feature existed are never retroactively scanned - they'll show as
  no-camera/no-date until edited.
- **Bulk upload** (`Bulk Upload` in the admin menu) uploads many photos in
  one go, applying one album and one set of tags to the whole batch, with
  camera and taken-at detected per photo from EXIF as above. Camera can also
  be set for the whole batch instead - pick one from the dropdown and every
  photo gets it, regardless of its own EXIF; taken-at is still detected per
  photo from EXIF either way. Each photo's title defaults to its original
  filename. After submitting, you'll see a summary of how many succeeded
  and, if any failed, why.
- **Albums have their own optional date too** (`Date` on the Albums admin
  page) - set it to when the album's content actually happened (e.g. an
  event or trip date) to control where it lands in the photography page's
  ordering. Leave it blank and the album sorts by its most recent photo's
  taken-at date instead, or by upload date if it has no dated photos yet.
- **Mark a photo as `Featured`** (checkbox on the Photos admin page, also
  toggleable straight from the Photos list without opening each one, or from
  an album's own `Manage Photos` page) to show it in a larger-tiled section
  at the top of its album's page. Featured photos still appear in their
  normal spot in the grid below too - it's additive, not a replacement.
- **Each album's `Manage Photos` page** (linked from the Albums list and
  edit page) shows every photo in that album as a grid with instant
  Featured and Cover Photo toggles - the only way to set an album's cover
  photo, since picking one from hundreds by filename in a dropdown wasn't
  workable.
- **Thumbnails are pre-generated on upload** (a resized copy, not the full
  original) so browsing an album doesn't trigger a burst of on-demand
  resizing - previously the real bottleneck on large albums, occasionally
  slow or unreliable under concurrent load. Photos uploaded before this
  existed don't have one yet; visit **`Generate Thumbnails`** in the admin
  menu and click the button to backfill them all in the background, with
  live progress. Anything not yet backfilled just falls back to the old
  on-demand resizing - never a broken image, just slower until it's done.
- On the public site, `/photography` has a **"Group by camera" toggle**
  that reorganizes the album grid into collapsible sections by camera
  (with an "Unknown camera" section for albums with no camera-tagged
  photos yet). Everything sorts newest-first as described above.
- **Shooting settings** (aperture, shutter speed, ISO, focal length) are
  detected from EXIF alongside camera and taken-at, and shown next to the
  camera name when a photo is opened in the lightbox. Like camera
  detection, this is JPEG-only, best-effort, and never backfilled for
  photos uploaded before it existed - anything missing from EXIF is just
  left off the line rather than shown as unknown.
- **Each album page shows which camera was used on the most photos in it**
  (e.g. "Shot on Canon EOS R6"), alongside the date and photo count.
  Computed from the album's own photos, so it needs no separate setup.
- **The admin panel (`/admin`) uses the public site's light-mode colour
  palette** instead of EasyAdmin's default theme - see
  `backend/public/admin/theme.css` if it ever needs adjusting.

## Technology overview

**Frontend** - [Next.js](https://nextjs.org) (App Router, TypeScript),
[Tailwind CSS](https://tailwindcss.com) v4, and
[Framer Motion](https://www.framer.com/motion/) for animation. Statically
generates most pages, with ISR for the Blog and Photography pages so new
content appears without a redeploy.

**Backend** - [Symfony](https://symfony.com) 8 with
[API Platform](https://api-platform.com) exposing a JSON-LD/Hydra REST API,
[Doctrine ORM](https://www.doctrine-project.org) over PostgreSQL,
[EasyAdmin](https://symfony.com/bundles/EasyAdminBundle) for the content
admin panel, and [Flysystem](https://flysystem.thephpleague.com) abstracting
photo storage (local disk today, swappable to S3-compatible object storage).

**Deployment** - Both apps are containerized with Docker and served behind
[Caddy](https://caddyserver.com) (automatic HTTPS via Let's Encrypt) on a
single DigitalOcean droplet. GitHub Actions builds and pushes images to
GHCR on every push to `main`, then deploys over SSH.
