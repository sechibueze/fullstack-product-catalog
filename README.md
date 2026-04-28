# fullstack-product-catalog

A full-stack **Product Catalog & Review Platform** built as a senior full-stack engineering assessment for Women First Digital. The system demonstrates production-grade architecture across a Laravel 12 REST API backend and a Next.js 15 frontend with SSG, ISR, Redis caching, Sanctum authentication, and a fully responsive admin panel.

**Author:** [sechibueze](https://github.com/sechibueze)

---

## Architecture

```
Browser
  │
  ├── :3000  →  Next.js 15 (SSG + ISR + CSR)
  │               │
  │               └── fetch() → :8000/api/v1
  │
  └── :8000  →  Laravel 12 (Apache + PHP 8.2)
                    │
              ┌─────┴──────┐
           PostgreSQL    Redis
```

---

## Tech Stack

| Layer         | Technology            | Version            |
| ------------- | --------------------- | ------------------ |
| Backend       | Laravel               | 12 (PHP 8.2)       |
| Database      | PostgreSQL            | 16                 |
| Cache         | Redis                 | 7                  |
| Auth          | Laravel Sanctum       | token-based        |
| Frontend      | Next.js (App Router)  | 15.5               |
| Language      | TypeScript            | strict             |
| Styling       | Tailwind CSS          | v4                 |
| Forms         | React Hook Form + Zod | —                  |
| Data fetching | TanStack React Query  | v5                 |
| Type schema   | Drizzle ORM           | type contract only |
| Containers    | Docker Compose        | —                  |
| API docs      | Swagger / OpenAPI     | 3.0                |

---

## Quick Start

### Prerequisites

- Docker and Docker Compose

### 1. Clone

```bash
git clone https://github.com/sechibueze/fullstack-product-catalog.git
cd fullstack-product-catalog
```

### 2. Start

```bash
make dev-fresh
```

Builds all images, starts every service, runs migrations, and seeds the database in one command.

### 3. Open

| Service  | URL                                     |
| -------- | --------------------------------------- |
| Frontend | http://localhost:3000                   |
| API      | http://localhost:8000/api/v1            |
| API Docs | http://localhost:8000/api/documentation |
| Health   | http://localhost:8000/api/health        |

### Admin credentials (seeded)

```
Email:    test@example.com
Password: password
```

---

## Development Commands

```bash
make dev          # start all services with hot reload
make dev-fresh    # wipe volumes, rebuild, migrate and seed from scratch
make dev-down     # stop all services
make dev-seed     # run migrations + seed against running containers
make dev-logs     # tail backend and frontend logs
```

### Artisan commands

```bash
docker compose exec backend php artisan <command>
```

### Tests

Create the test database once:

```bash
docker compose exec db psql -U wfd -d product_catalog \
  -c "CREATE DATABASE product_catalog_test;"
```

Run the suite:

```bash
docker compose exec backend php artisan test
```

---

## API Reference

**Base URL:** `http://localhost:8000/api/v1`

### Authentication

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

Protected routes require:

```
Authorization: Bearer <token>
```

### Endpoints

#### Auth

| Method | Endpoint       | Public | Description          |
| ------ | -------------- | ------ | -------------------- |
| POST   | `/auth/login`  | ✓      | Login, returns token |
| POST   | `/auth/logout` |        | Revoke token         |
| GET    | `/auth/me`     |        | Authenticated user   |

#### Categories

| Method    | Endpoint             | Public | Description |
| --------- | -------------------- | ------ | ----------- |
| GET       | `/categories`        | ✓      | List        |
| GET       | `/categories/{slug}` | ✓      | Single      |
| POST      | `/categories`        |        | Create      |
| PUT/PATCH | `/categories/{id}`   |        | Update      |
| DELETE    | `/categories/{id}`   |        | Soft delete |

#### Products

| Method    | Endpoint                    | Public | Description                      |
| --------- | --------------------------- | ------ | -------------------------------- |
| GET       | `/products`                 | ✓      | List (published only for guests) |
| GET       | `/products?category={slug}` | ✓      | Filter by category               |
| GET       | `/products?search={term}`   | ✓      | Search by name                   |
| GET       | `/products/{slug}`          | ✓      | Single product                   |
| POST      | `/products`                 |        | Create                           |
| PUT/PATCH | `/products/{id}`            |        | Update                           |
| DELETE    | `/products/{id}`            |        | Soft delete                      |

#### Reviews

| Method | Endpoint                   | Public | Description                 |
| ------ | -------------------------- | ------ | --------------------------- |
| GET    | `/reviews`                 |        | List                        |
| POST   | `/products/{slug}/reviews` | ✓      | Submit (5 req/min throttle) |
| DELETE | `/reviews/{id}`            |        | Delete                      |
| PATCH  | `/reviews/{id}/approve`    |        | Approve                     |
| PATCH  | `/reviews/{id}/reject`     |        | Reject                      |

### Response format

```json
{ "data": {}, "message": "Resource retrieved successfully." }
```

```json
{ "message": "The given data was invalid.", "errors": { "field": ["Message."] } }
```

---

## Caching Strategy

All GET responses are cached at the **service layer** using Redis tagged cache — not at the HTTP layer — so invalidation is precise and immediate on every mutation.

### Key naming

| Resource        | Key pattern                                                   | TTL  |
| --------------- | ------------------------------------------------------------- | ---- |
| Categories list | `categories.list.page.{n}.per.{pp}`                           | 300s |
| Category detail | `categories.detail.{slug}`                                    | 300s |
| Products list   | `products.list.page.{n}.per.{pp}.cat.{c}.search.{s}.pub.{p}` | 60s  |
| Product detail  | `products.detail.{slug}`                                      | 60s  |
| Reviews list    | `reviews.list.page.{n}.per.{pp}.product.{id}.approved.{a}`   | 60s  |

**TTL decisions:** Products and reviews are 60s — price, stock, and approval status change frequently. Categories are 300s — structurally stable.

Cache busting is tag-based: product mutations flush `Tag('products') + Tag('reviews')`; category mutations flush `Tag('categories')`. All GET responses include `Cache-Control: public, max-age={ttl}` and `X-Cache-TTL: {ttl}` headers.

---

## SSG / ISR Strategy

| Route                | Strategy  | Revalidate | Notes                                |
| -------------------- | --------- | ---------- | ------------------------------------ |
| `/`                  | SSG       | —          | Static, rebuilt on deploy            |
| `/products`          | SSG + ISR | 60s        | Paginated listing                    |
| `/products/[slug]`   | SSG + ISR | 60s        | Product detail with approved reviews |
| `/categories`        | SSG       | —          | Static list                          |
| `/categories/[slug]` | SSG + ISR | 300s       | Products filtered by category        |
| `/admin/*`           | CSR       | —          | Client-rendered, auth-protected      |

All published slugs are pre-rendered at build time via `generateStaticParams`. Unpublished or missing slugs return 404 via `notFound()`.

---

## Seed data

- **3 categories** — Electronics, Clothing, Home & Garden
- **8 products** — 6 published, 2 unpublished
- **10 reviews** — 7 approved, 3 unapproved

---

## Engineering Decisions

**UUID primary keys** — prevents ID enumeration. Implemented via a reusable `HasUuid` Eloquent concern on all models.

**Service layer** — `CategoryService`, `ProductService`, `ReviewService`, `CacheService` hold all business logic. Controllers are thin: validate, delegate, respond.

**Typed transformers** — the backend returns `snake_case` JSON; service-layer transformer functions map every response to `camelCase` TypeScript types. No `any` types anywhere.

**Drizzle ORM as type contract** — no live DB connection on the frontend. The schema mirrors the backend tables and provides `InferSelectModel` / `InferInsertModel` types across components, API calls, and forms.

**Global error handling** — a custom handler in `bootstrap/app.php` ensures all exception types return consistent JSON envelopes. HTML error pages never reach API consumers.

**Multi-stage Docker builds** — separate `development` and `production` targets. The production image excludes dev dependencies, runs with OPcache, and uses an entrypoint that auto-migrates and auto-seeds on first deploy.

**Optimistic UI** — admin mutations use React Query's `onMutate` / `onError` / `onSettled` lifecycle for instant feedback with automatic rollback on failure.

**Soft deletes** — categories and products are never hard-deleted. The `deleted_at` index ensures soft-deleted records are excluded from all queries automatically.

**JSON-LD structured data** — product detail pages include machine-readable product and breadcrumb markup for search engine rich results.
