#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

DB_NAME=app
DB_USER=app
DB_PASSWORD=app-dev-password
REQUIRED_PHP_EXTENSIONS=(ctype iconv pdo_pgsql pgsql intl gd zip)

info() { printf '\033[1;34m%s\033[0m\n' "$1"; }
warn() { printf '\033[1;33m%s\033[0m\n' "$1"; }
error() { printf '\033[1;31m%s\033[0m\n' "$1"; exit 1; }

ensure_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    error "Required command '$1' is not installed or not on PATH."
  fi
}

os_id() {
  if [ -f /etc/os-release ]; then
    grep '^ID=' /etc/os-release | cut -d= -f2 | tr -d '"'
  fi
}

# Where PHP scans for extra .ini files (e.g. /etc/php/conf.d) - empty if
# this build of PHP doesn't use one. Some PHP builds quote the path in
# `php --ini` output (e.g. `"/etc/php/conf.d"`); strip that if present.
php_conf_d_dir() {
  local dir
  dir="$(php --ini 2>/dev/null | sed -n 's/^Scan for additional \.ini files in: *//p')" || true
  dir="${dir#\"}"
  dir="${dir%\"}"
  printf '%s' "$dir"
}

# package_hint EXTENSION OS_ID - best-effort package name that provides a
# PHP extension on a given distro. ctype/iconv usually ship in the base
# php package already; on all of these they just need to be enabled (see
# check_php_extensions), not installed separately.
package_hint() {
  local ext="$1" os="$2"
  case "$ext" in
    ctype|iconv)
      echo '(bundled with the base php package - see the enabling step below)'
      return
      ;;
  esac
  case "$os" in
    arch|manjaro)
      case "$ext" in
        gd) echo 'php-gd' ;;
        pdo_pgsql|pgsql) echo 'php-pgsql' ;;
        *) echo '(bundled with the base php package - see the enabling step below)' ;;
      esac
      ;;
    ubuntu|debian)
      case "$ext" in
        pdo_pgsql) echo 'php-pgsql' ;;
        *) echo "php-${ext}" ;;
      esac
      ;;
    fedora|rhel|centos)
      case "$ext" in
        pdo_pgsql) echo 'php-pgsql' ;;
        *) echo "php-${ext}" ;;
      esac
      ;;
    alpine)
      echo "php8-${ext} (exact package name depends on your installed PHP version)"
      ;;
    *)
      echo "the package that provides ext-${ext} on your distro"
      ;;
  esac
}

generate_secret() {
  if command -v php >/dev/null 2>&1; then
    php -r 'echo bin2hex(random_bytes(32));'
  elif command -v openssl >/dev/null 2>&1; then
    openssl rand -hex 32
  else
    error 'Cannot generate APP_SECRET: php or openssl is required.'
  fi
}

# ensure_env_value FILE KEY DEFAULT_VALUE
# Makes sure FILE has exactly one "KEY=..." line. An existing value that
# isn't blank/a "ChangeMe" placeholder is left alone (so re-running never
# clobbers something you customized); otherwise DEFAULT_VALUE is written.
# Also collapses duplicate KEY= lines left over from older/interrupted runs.
ensure_env_value() {
  local file="$1" key="$2" default_value="$3"
  local match_count first_value final_value tmp

  match_count="$(grep -c -E "^${key}=" "$file" 2>/dev/null || true)"
  match_count="${match_count:-0}"

  first_value="$(grep -m1 -E "^${key}=" "$file" 2>/dev/null || true)"
  first_value="${first_value#*=}"

  case "$first_value" in
    "" | '""' | *ChangeMe*) final_value="$default_value" ;;
    *) final_value="$first_value" ;;
  esac

  if [ "$match_count" = "1" ] && [ "$first_value" = "$final_value" ]; then
    return 0
  fi

  tmp="$(mktemp)"
  grep -v -E "^${key}=" "$file" 2>/dev/null > "$tmp" || true
  printf '%s=%s\n' "$key" "$final_value" >> "$tmp"
  mv "$tmp" "$file"
}

check_php_extensions() {
  local ext hint os conf_dir missing=()

  for ext in "${REQUIRED_PHP_EXTENSIONS[@]}"; do
    if ! php -r "exit(extension_loaded('$ext') ? 0 : 1);" >/dev/null 2>&1; then
      missing+=("$ext")
    fi
  done

  if [ "${#missing[@]}" -eq 0 ]; then
    info 'All required PHP extensions are enabled.'
    return
  fi

  conf_dir="$(php_conf_d_dir)"

  # On distros like Arch, the extensions are usually already installed (or
  # bundled in the base php package) but switched off in php.ini. Before
  # falling back to manual instructions, try the one-line fix directly:
  # drop this repo's ready-made ini snippet into PHP's conf.d.
  if [ -f .dev/php-extra.ini ] && [ -n "$conf_dir" ]; then
    warn "Missing PHP extension(s): ${missing[*]}"
    info "This repo ships .dev/php-extra.ini with the lines this project needs - enabling it now (needs sudo):"
    info "  sudo cp .dev/php-extra.ini ${conf_dir}/frosteato.ini"
    if sudo cp .dev/php-extra.ini "${conf_dir}/frosteato.ini"; then
      missing=()
      for ext in "${REQUIRED_PHP_EXTENSIONS[@]}"; do
        if ! php -r "exit(extension_loaded('$ext') ? 0 : 1);" >/dev/null 2>&1; then
          missing+=("$ext")
        fi
      done
    else
      warn 'Could not copy it automatically - install/enable the extensions yourself, see below.'
    fi
  fi

  if [ "${#missing[@]}" -eq 0 ]; then
    info 'All required PHP extensions are now enabled.'
    return
  fi

  os="$(os_id)"
  warn "Missing PHP extension(s): ${missing[*]}"
  warn 'Install the package(s) that provide them, e.g.:'
  for ext in "${missing[@]}"; do
    hint="$(package_hint "$ext" "$os")"
    warn "  $ext -> $hint"
  done

  warn ''
  warn "On some distros (e.g. Arch) installing the package still leaves the extension disabled in php.ini."
  warn "If 'php -m' still doesn't list an extension afterwards, this repo ships .dev/php-extra.ini with the"
  warn "exact lines this project needs - enable them by copying it into PHP's extra config directory:"
  if [ -n "$conf_dir" ]; then
    warn "  sudo cp .dev/php-extra.ini ${conf_dir}/frosteato.ini"
  else
    warn "  copy .dev/php-extra.ini into PHP's ini scan directory (run 'php --ini' to find it)"
  fi
  warn 'Then re-run this script.'

  error 'Missing required PHP extension(s); see above.'
}

set_backend_env() {
  local env_file=backend/.env.local
  local default_db="postgresql://${DB_USER}:${DB_PASSWORD}@127.0.0.1:5432/${DB_NAME}?serverVersion=16&charset=utf8"

  if [ ! -f "$env_file" ]; then
    info 'Creating backend/.env.local'
    : > "$env_file"
  fi

  ensure_env_value "$env_file" APP_SECRET "$(generate_secret)"
  ensure_env_value "$env_file" DATABASE_URL "\"${default_db}\""

  info 'backend/.env.local is configured.'
}

set_frontend_env() {
  local env_file=frontend/.env.local
  local example_file=frontend/.env.example
  local default_api_url='http://localhost:8000'

  if [ ! -f "$env_file" ]; then
    if [ -f "$example_file" ]; then
      info 'Creating frontend/.env.local from frontend/.env.example'
      cp "$example_file" "$env_file"
    else
      info 'Creating frontend/.env.local'
      : > "$env_file"
    fi
  fi

  ensure_env_value "$env_file" API_URL "$default_api_url"

  info 'frontend/.env.local is configured.'
}

# Best-effort local PostgreSQL role/database provisioning, mirroring the
# manual commands in README.md. Never fatal: PostgreSQL might not be
# installed yet, or creating the role might need a sudo password this
# script can't supply non-interactively - either way, fall back to
# printing the exact command to run by hand.
setup_database() {
  if ! command -v psql >/dev/null 2>&1; then
    warn 'psql not found; skipping automatic database setup.'
    warn "Install PostgreSQL, then create the role/database yourself - see README.md."
    return
  fi

  if ! pg_isready -q 2>/dev/null; then
    warn 'PostgreSQL does not appear to be running; skipping automatic database setup.'
    warn 'Start PostgreSQL and re-run this script, or create the role/database yourself - see README.md.'
    return
  fi

  info 'Ensuring local PostgreSQL role and database exist...'

  if sudo -iu postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" 2>/dev/null | grep -q 1; then
    info "PostgreSQL role '${DB_USER}' already exists."
  elif sudo -iu postgres psql -c "CREATE ROLE ${DB_USER} WITH LOGIN PASSWORD '${DB_PASSWORD}';" >/dev/null 2>&1; then
    info "Created PostgreSQL role '${DB_USER}'."
  else
    warn "Could not create PostgreSQL role '${DB_USER}' (this needs sudo access to the 'postgres' system account)."
    warn "Create it yourself: sudo -iu postgres psql -c \"CREATE ROLE ${DB_USER} WITH LOGIN PASSWORD '${DB_PASSWORD}';\""
    return
  fi

  if sudo -iu postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" 2>/dev/null | grep -q 1; then
    info "PostgreSQL database '${DB_NAME}' already exists."
  elif sudo -iu postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};" >/dev/null 2>&1; then
    info "Created PostgreSQL database '${DB_NAME}'."
  else
    warn "Could not create PostgreSQL database '${DB_NAME}'."
    warn "Create it yourself: sudo -iu postgres psql -c \"CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};\""
    return
  fi
}

install_backend() {
  info 'Installing backend dependencies...'
  pushd backend >/dev/null
  composer install --prefer-dist --no-interaction --no-ansi
  popd >/dev/null
}

install_frontend() {
  info 'Installing frontend dependencies...'
  pushd frontend >/dev/null
  npm install --silent
  popd >/dev/null
}

run_migrations() {
  info 'Running backend database migrations...'
  pushd backend >/dev/null
  if php bin/console doctrine:migrations:migrate --no-interaction --no-ansi; then
    info 'Migrations completed successfully.'
  else
    warn 'Migrations failed. Make sure PostgreSQL is running and the database from the step above exists,'
    warn 'then run: cd backend && php bin/console doctrine:migrations:migrate'
  fi
  popd >/dev/null
}

info 'Starting repository setup.'
ensure_command composer
ensure_command php
ensure_command npm

check_php_extensions

info 'Configuring local environment files.'
set_backend_env
set_frontend_env

setup_database

install_backend
install_frontend
run_migrations

info 'Setup complete.'
info 'Next steps:'
info '  1. Create an admin user for the /admin panel:'
info '       cd backend && php bin/console app:create-admin-user you@example.com a-strong-password'
info '  2. Start the apps - see "Run it" in README.md.'
