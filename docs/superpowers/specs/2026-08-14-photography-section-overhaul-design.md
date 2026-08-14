# Photography section overhaul — design

Date: 2026-08-14
Status: approved, not yet implemented

## Context

The photography section (`frontend/src/app/photography/`, backed by the Symfony/API
Platform app in `backend/`) currently has three problems:

1. **No chronological or equipment-based organization.** Albums render in
   whatever order the API returns them in (implicitly upload order), and
   there's no way to see what was shot on which camera.
2. **Upload is one photo at a time**, through the EasyAdmin panel at
   `/admin`, with no documentation of how it actually works - and no way to
   bulk-upload a backlog.
3. **Two small, unrelated admin annoyances** surfaced while discussing the
   above: the login page doesn't trigger a password manager's save prompt,
   and it doesn't match the main site's look.

This document covers all three, since the first two share backend work
(EXIF extraction is used by both the single-photo and bulk-upload paths)
and the third is small enough to ride along.

## Goals

- Photos carry a `camera` (make/model), auto-detected from EXIF at upload
  time, editable by hand.
- The `/photography` landing page sorts albums newest-shot-first by
  default, and can optionally group album cards into collapsible
  per-camera sections.
- Photos within an album (`/photography/[slug]`) also sort
  newest-shot-first, instead of upload order.
- The grid thumbnails on both pages are genuinely smaller over the wire
  than the full-resolution originals; the full-resolution image only loads
  when a photo is clicked (already true today for the lightbox - see
  "Current state" below).
- The admin panel supports uploading many photos in one submission, with
  one album + tag set applied to the whole batch.
- The admin login page triggers password manager save/autofill, and
  visually matches the main site's light-mode palette.
- The README documents how EXIF detection, bulk upload, and the
  camera-grouping toggle work.

## Non-goals

- **Backfilling camera data for already-uploaded photos.** They show as
  "Unknown camera" until manually edited in the admin panel. No migration
  script re-scans old files.
- **A CLI import command.** Considered and explicitly declined in favor of
  a browser-based bulk upload page only.
- **Background/async processing for bulk upload.** Processing is
  synchronous within the HTTP request, per file, with an incremental
  flush so partial progress survives a mid-batch failure. No message
  queue, no worker process.
- **Reskinning the full EasyAdmin panel** (the Photos/Albums/Tags/Posts
  CRUD screens). Only the standalone login page is restyled.
- **RAW or HEIC EXIF support.** PHP's `exif_read_data()` only reads
  JPEG/TIFF; other formats fall back to "no camera detected," not an
  error.
- **An automated test suite.** Neither app has one today; this feature
  doesn't introduce one. Verification is a manual checklist (see below).
- **Persisting the "Group by camera" toggle state** across page loads
  (no localStorage/URL param). It always starts flat/off.
- **Upload deduplication.** Uploading the same file twice still creates
  two `Photo` rows, same as today.

## Current state (facts this design builds on)

- **Entities:** `Photo` (title, album, tags, `takenAt` (nullable, manually
  typed today), `imageName`, `createdAt`), `Album` (name, slug,
  description, coverPhoto), `Tag` (name, slug). No `camera` field exists
  anywhere.
- **API:** API Platform / Symfony, JSON-LD/Hydra. `Photo`'s collection
  endpoint has a fixed default order of `createdAt DESC` (upload order,
  not shoot date). No endpoint currently returns cameras or exposes
  aggregated data per album.
- **Upload:** EasyAdmin panel at `/admin` → Photos → one entity per form
  submission, one `ImageField` per submission, backed by Flysystem's
  local adapter (`public/media/photos/[randomhash].[ext]`). No EXIF
  reading anywhere in the codebase today (`ext-exif` isn't installed).
  `Tag` and `Album` have their own EasyAdmin CRUD controllers, registered
  in `DashboardController`'s menu.
- **Image processing:** GD is compiled into the backend PHP image with
  JPEG/WebP support already (`--with-freetype --with-jpeg --with-webp`),
  unused today. `ext-exif` is not installed.
- **Upload limits:** the backend Dockerfile installs no `php.ini` at all,
  so PHP runs on bare compiled defaults (`upload_max_filesize=2M`,
  `post_max_size=8M`, `max_file_uploads=20`). nginx's
  `client_max_body_size` is 20MB. Both are below what a batch of modern
  camera JPEGs needs.
- **Frontend delivery:** `next/image` is already used for both the album
  cover grid and the per-album photo grid, with correct `remotePatterns`
  in `next.config.ts` - but the `sharp` package required for Next's
  self-hosted Image Optimization to function isn't in `package.json`, so
  it's not actually resizing/compressing in production today. The
  lightbox in `PhotoGrid.tsx` already renders as a plain `<img>` only
  when a photo is clicked (not eagerly), so "full-res only on click" is
  already true and isn't part of this design.
- **Security:** `access_control` in `security.yaml` gates everything under
  `^/admin` (except `^/admin/login`) behind `ROLE_ADMIN` by path prefix.
  Any new route under `/admin/...` inherits this automatically.
- **Login page:** `backend/templates/security/login.html.twig` is a
  standalone, hand-rolled template (not using EasyAdmin's theme). The
  username field is `autocomplete="email"`.

## Design

### 1. Camera capture (EXIF)

- New `Camera` entity: `id`, `name`, `slug` - modeled directly on the
  existing `Tag` entity (same `AsciiSlugger`-based slugging, same bare
  `#[ApiResource]`, same `photo:read` serialization group on the fields
  needed for the frontend to consume it). A `CameraCrudController`
  mirrors `TagCrudController` and is added to the dashboard menu, both so
  it's manageable directly (rename/merge duplicates) and because
  EasyAdmin's autocomplete field needs a registered CRUD controller for
  its target entity.
- `Photo` gets a nullable `camera` `ManyToOne` relation, shaped like its
  existing `album` relation, added via a Doctrine migration.
- A shared extraction service - used by both the single-photo admin form
  and the new bulk-upload path, so this logic exists exactly once - that,
  when a photo is stored and no camera has been set by hand: reads EXIF
  from the file via `exif_read_data()`, derives a name from the
  Make/Model tags (prefer Model, fall back to Make, dedupe an overlapping
  prefix - camera brands format these inconsistently, so this is a
  heuristic, not a perfect parse), finds-or-creates a matching `Camera` by
  that name, and sets it on the `Photo`. Wrapped so a missing or corrupt
  EXIF block never blocks the photo from saving - it just leaves `camera`
  null.
- Requires `ext-exif` added to the backend Dockerfile
  (`docker-php-ext-install ... exif ...`) - no other new packages, since
  GD already covers the image-processing side.
- `PhotoCrudController` gets `AssociationField::new('camera')
  ->setRequired(false)->autocomplete()`, matching how `tags` already
  works, plus help text explaining the auto-detection and its limits.

### 2. Thumbnails

- Add `sharp` to `frontend/package.json`. No other changes - `next/image`
  and `next.config.ts` are already correctly configured; this was a
  missing-dependency problem, not a missing-feature problem.

### 3. Bulk upload

- New "Bulk Upload" page in the admin panel, its own route under
  `/admin/...` (inherits `ROLE_ADMIN` automatically via the existing
  path-prefix `access_control` rule - no new security config needed).
- Form: a multi-file picker, one Album dropdown, one Tags picker - applied
  to the entire batch. No per-file title or date field; those stay
  editable afterward through the existing single-photo form, same as any
  photo today.
- Processing is synchronous within the request (per the chosen "web
  multi-upload only" option - no queue, no worker process). Each file is
  handled independently through the same store-file →
  extract-EXIF → create-`Photo` path as a single upload, with the shared
  Album/Tags applied, and is flushed to the database as soon as it
  succeeds - so a bad file, or a crash partway through a large batch,
  doesn't lose the photos already processed before it. The response is a
  results summary: counts succeeded/failed, with a reason per failure.
- Upload ceilings need raising, since no `php.ini` is loaded at all today
  (bare compiled defaults). This design sizes limits for roughly 60 JPEGs
  per batch at up to ~40MB each as a working assumption - adjust
  `upload_max_filesize` / `post_max_size` / `max_file_uploads` (PHP) and
  `client_max_body_size` (nginx) proportionally if actual batches or file
  sizes (e.g. RAW) turn out to be larger.

### 4. Admin login page

- Fix `autocomplete="email"` → `autocomplete="username"` on the username
  field in `login.html.twig` (`backend/templates/security/login.html.twig:25`).
  Paired with the existing `autocomplete="current-password"`, this is
  the specific token pairing password managers use to recognize a login
  form and offer to save it. Everything else about the form (real
  `<form method="post">`, real `<input type="password">`, no JS
  intercepting submission) is already compatible.
- Restyle using the real light-mode tokens from
  `frontend/src/app/globals.css`: background `--color-cream` (`#fefae0`),
  text `--color-ink` (`#283618`), card surface `--color-champagne-soft`
  (`#f5eed8`), accent/chrome `--color-sage-deep` (`#bfcb9a`) /
  `--color-tan-deep` (`#4d3014`). Typography: Helvetica Neue Bold for the
  heading, Commit Mono for body text - copies of those two font files
  (from `frontend/src/fonts/`) embedded via `@font-face` directly in the
  template, so the backend doesn't depend on the frontend build. Scope is
  the login page only, not the EasyAdmin panel behind it.

### 5. Frontend: photography browsing

- **`/photography` (landing page):** stays a Server Component fetching
  data, now pulling all photos (not just cover photos) alongside albums
  so it can compute, per album: a sort key (the most recent `takenAt`
  among its photos, falling back to `createdAt` for photos or albums with
  no taken date - see the ordering note below) and the distinct set of
  cameras among its photos (possibly empty). This is plain in-memory
  computation at render time against the existing `getAlbums()` /
  `getPhotos()` calls - no new API endpoint.
  - That computed data is passed to a new client component (same pattern
    as the existing `PhotoGrid`: server does data work, client does
    interaction) that owns the "Group by camera" toggle and per-section
    expanded/collapsed state.
  - **Flat view (default on every load, no persistence):** today's album
    grid, unchanged visually, ordered newest-shot-first.
  - **Grouped view:** the same album cards partitioned into collapsible
    sections, one per camera plus "Unknown camera" always last. Sections
    start collapsed; more than one can be open at once. An album with
    photos from two cameras appears in both sections. Sections are
    themselves ordered newest-first (by each camera's most recently-shot
    album), except Unknown, which is always last. Albums within a section
    keep the same newest-shot-first order as the flat view.
- **`/photography/[slug]` (album page):** the photo grid also switches
  from upload-order to newest-shot-first.
- **Ordering note (applies to both):** `takenAt` is nullable, and
  Postgres's default `NULL` handling for `DESC` order is `NULLS FIRST` -
  which would otherwise put every undated photo at the *top* of a
  "newest first" list, the opposite of what's wanted. Both the API's
  default photo order and the frontend's album-level aggregation need to
  sort by taken-date-or-upload-date-if-none (conceptually
  `COALESCE(takenAt, createdAt) DESC`), not by `takenAt` alone.
- The existing lightbox (full-res only on click) is unchanged.

### 6. Docs

- Extend the root `README.md`, in the existing "Editing the site" /
  admin section, with: how EXIF camera detection works and its JPEG-only
  limitation, how the Bulk Upload page works, and what the "Group by
  camera" toggle does - matching the README's existing terse style rather
  than a new docs file.
- Add EasyAdmin field-level help text (e.g. on the Camera field: "Auto-
  detected from the photo's EXIF data when possible - override here if
  it's wrong or missing") so the guidance is visible at the point of use,
  not just in a README.

### 7. Verification plan

No automated test suite exists in this repo today, for either app, and
this feature doesn't add one. Manual checklist to run through once built:

- A real camera JPEG uploaded through the single-photo admin form
  auto-fills its camera; a PNG/screenshot degrades gracefully to
  "no camera detected" rather than erroring.
- Manually overriding an auto-detected camera sticks.
- A bulk batch containing one corrupt/invalid file still saves the rest
  and reports the one failure with a reason.
- A batch sized within the new limits (but beyond the old 20-file/2MB-file
  defaults) succeeds end to end.
- `/photography` flat view is ordered newest-shot-first; toggling
  "Group by camera" buckets correctly, including a mixed-camera album
  appearing in more than one section, and an "Unknown camera" section for
  photos with no detected camera.
- `/photography/[slug]` photo grids are also newest-shot-first.
- Thumbnails are verifiably smaller over the network (browser devtools)
  in a production-style build (`next build && next start`, not just
  `next dev`).
- The admin login page now triggers a password manager's save prompt, and
  visually matches the main site's light mode.
- The new Bulk Upload route is unreachable when logged out / as a
  non-admin (expected to just work, given the existing path-prefix
  `access_control` rule - confirmed, not re-implemented).
