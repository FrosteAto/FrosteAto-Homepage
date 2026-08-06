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
- **Docker** and **Docker Compose** - optional, but the easiest way to run both apps once Postgres is set up (see step 5 below)

Exact install commands vary by OS/package manager. On Arch Linux, for example:

```bash
sudo pacman -S postgresql php-pgsql php-gd
sudo -iu postgres initdb --locale=C.UTF-8 -D /var/lib/postgres/data
sudo systemctl enable --now postgresql
```

### 2. Create the local database

```bash
sudo -iu postgres psql -c "CREATE ROLE app WITH LOGIN PASSWORD 'app-dev-password';"
sudo -iu postgres psql -c "CREATE DATABASE app OWNER app;"
```

### 3. Configure environment variables

Both apps read local config from a gitignored `.env.local` - copy the example and adjust if needed:

```bash
# backend/.env.local
APP_SECRET=<any random string>
DATABASE_URL="postgresql://app:app-dev-password@127.0.0.1:5432/app?serverVersion=16&charset=utf8"
```

```bash
# frontend/.env.local (see frontend/.env.example)
API_URL=http://localhost:8000
```

### 4. Install dependencies and run migrations

```bash
cd backend
composer install
php bin/console doctrine:migrations:migrate
php bin/console app:create-admin-user you@example.com a-strong-password
```

```bash
cd frontend
npm install
```

### 5. Run it

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
without a rebuild. Still uses the Postgres from step 1/2 running natively
(not containerized, to avoid a port clash) - steps 1-3 above are still
required first. This is a dev-only setup; `infra/docker-compose.yml` is
the separate production stack the deploy workflow uses.

Once running: the site is at `http://localhost:3000`, the API at
`http://localhost:8000/api`, and the admin panel at `http://localhost:8000/admin`.

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
