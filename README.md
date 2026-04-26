# fullstack-product-catalog

A full-stack **Product Catalog & Review Platform** built as a senior full-stack engineering assessment for Women First Digital. The system demonstrates production-grade architecture across a Laravel 12 REST API backend and a Next.js 15 frontend with SSG, ISR, Redis caching, Sanctum authentication, and a fully responsive admin panel.

**Author:** [sechibueze](https://github.com/sechibueze)

---

## Live Architecture

```
Browser
  │
  ├── localhost:3000  →  Next.js 15 (SSG + ISR + CSR)
  │                        │
  │                        └── fetch() → localhost:8000
  │
  └── localhost:8000  →  Nginx → PHP-FPM (Laravel 12)
                                    │
                              ┌─────┴──────┐
                           PostgreSQL    Redis
                           (port 5432)  (port 6379)
```

All services run in Docker Compose. The frontend hits the API through nginx on the internal Docker network for server-side fetches, and directly via `localhost:8000` for client-side requests.

---

## Tech Stack

| Layer              | Technology              | Version            |
| ------------------ | ----------------------- | ------------------ |
| Backend framework  | Laravel                 | 12 (PHP 8.2+)      |
| Database           | PostgreSQL              | 16                 |
| Cache              | Redis                   | 7                  |
| Authentication     | Laravel Sanctum         | token-based        |
| Web server         | Nginx + PHP-FPM         | 1.25               |
| Frontend framework | Next.js                 | 15.5 (App Router)  |
| Language           | TypeScript              | strict mode        |
| Styling            | Tailwind CSS            | v4                 |
| Forms              | React Hook Form + Zod   | —                  |
| Data fetching      | TanStack React Query    | v5                 |
| Type schema        | Drizzle ORM             | type contract only |
| Containerisation   | Docker + Docker Compose | —                  |
| API docs           | Swagger / OpenAPI       | 3.0                |

---

## Quick Start (Docker — recommended)

### Prerequisites

- Docker Desktop or Docker Engine + Docker Compose

### 1. Clone the repo

```bash
git clone https://github.com/sechibueze/fullstack-product-catalog.git
cd fullstack-product-catalog
```

### 2. Configure backend environment

```bash
cp backend/.env.example backend/.env
```

The default values work out of the box with Docker. No changes needed.

### 3. Start all services

```bash
docker compose up -d
```

### 4. Install backend dependencies

```bash
docker compose exec backend composer install
```

### 5. Generate app key and seed the database

```bash
docker compose exec backend php artisan key:generate
docker compose exec backend php artisan migrate:fresh --seed
```

This seeds exactly what the spec requires:

- 3 categories (Electronics, Clothing, Home & Garden)
- 8 products (6 published, 2 unpublished)
- 10 reviews (7 approved, 3 unapproved)

### 6. Create admin user

```bash
docker compose exec backend php artisan tinker --execute="
App\Models\User::create([
    'name'     => 'Admin User',
    'email'    => 'admin@example.com',
    'password' => bcrypt('password'),
]);
echo 'Admin created';
"
```

### 7. Access the platform

| Service            | URL                                     |
| ------------------ | --------------------------------------- |
| Frontend           | http://localhost:3000                   |
| Backend API        | http://localhost:8000/api/v1            |
| Health check       | http://localhost:8000/api/health        |
| API Docs (Swagger) | http://localhost:8000/api/documentation |

---

## Local Development (without Docker)

### Backend

```bash
cd backend
composer install
cp .env.example .env

# Update .env with your local PostgreSQL and Redis credentials
# DB_HOST=127.0.0.1, DB_PORT=5432, REDIS_HOST=127.0.0.1, REDIS_PORT=6379

php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve --port=8000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local

# Update NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

npm run dev
```

---

## Admin Panel

Visit `http://localhost:3000/admin/login`

```
Email:    admin@example.com
Password: password
```

The admin panel supports:

- **Products** — create, edit, delete, toggle published status inline
- **Reviews** — approve, reject, delete with single-click actions and tab filtering

---

## Running Tests

### Setup test database

```bash
# Docker
docker compose exec db psql -U wfd -d postgres -c \
  "CREATE DATABASE product_catalog_test TEMPLATE template0 ENCODING 'UTF8' LC_COLLATE 'en_US.utf8' LC_CTYPE 'en_US.utf8';"

# Or locally
psql -U your_user -c "CREATE DATABASE product_catalog_test;"
```

### Run all tests

```bash
# Docker
docker compose exec backend php artisan test

# Local
cd backend && php artisan test
```

### Test breakdown

| Suite                    | Tests   | What is covered                                                            |
| ------------------------ | ------- | -------------------------------------------------------------------------- |
| Unit — Models            | 14      | UUID generation, slug auto-generation, relationships, scopes, soft deletes |
| Feature — Categories API | 13      | Full CRUD, auth protection, validation, pagination                         |
| Feature — Products API   | 14      | Full CRUD, category filter, toggle published, auth                         |
| Feature — Reviews API    | 11      | Public submit, approve/reject, throttle, auth                              |
| **Total**                | **52+** | All passing                                                                |

---

## API Reference

### Base URL

```
http://localhost:8000/api/v1
```

### Authentication

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

Use the returned token:

```
Authorization: Bearer your-token-here
```

### Endpoints

#### Auth

| Method | Endpoint              | Auth | Description            |
| ------ | --------------------- | ---- | ---------------------- |
| POST   | `/api/v1/auth/login`  | No   | Login, returns token   |
| POST   | `/api/v1/auth/logout` | Yes  | Invalidate token       |
| GET    | `/api/v1/auth/me`     | Yes  | Get authenticated user |

#### Categories

| Method    | Endpoint                    | Auth | Description          |
| --------- | --------------------------- | ---- | -------------------- |
| GET       | `/api/v1/categories`        | No   | List all categories  |
| GET       | `/api/v1/categories/{slug}` | No   | Get category by slug |
| POST      | `/api/v1/categories`        | Yes  | Create category      |
| PUT/PATCH | `/api/v1/categories/{id}`   | Yes  | Update category      |
| DELETE    | `/api/v1/categories/{id}`   | Yes  | Soft delete category |

#### Products

| Method    | Endpoint                           | Auth | Description             |
| --------- | ---------------------------------- | ---- | ----------------------- |
| GET       | `/api/v1/products`                 | No   | List published products |
| GET       | `/api/v1/products?category={slug}` | No   | Filter by category      |
| GET       | `/api/v1/products?search={term}`   | No   | Search by name          |
| GET       | `/api/v1/products/{slug}`          | No   | Get product by slug     |
| POST      | `/api/v1/products`                 | Yes  | Create product          |
| PUT/PATCH | `/api/v1/products/{id}`            | Yes  | Update product          |
| DELETE    | `/api/v1/products/{id}`            | Yes  | Soft delete product     |

#### Reviews

| Method | Endpoint                           | Auth | Description                    |
| ------ | ---------------------------------- | ---- | ------------------------------ |
| GET    | `/api/v1/reviews`                  | Yes  | List all reviews               |
| GET    | `/api/v1/reviews?is_approved=true` | Yes  | Filter by approval             |
| POST   | `/api/v1/products/{slug}/reviews`  | No   | Submit review (5/min throttle) |
| DELETE | `/api/v1/reviews/{id}`             | Yes  | Delete review                  |
| PATCH  | `/api/v1/reviews/{id}/approve`     | Yes  | Approve review                 |
| PATCH  | `/api/v1/reviews/{id}/reject`      | Yes  | Reject review                  |

### Response envelope

```json
{
  "data": {},
  "message": "Resource retrieved successfully."
}
```

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field": ["Descriptive error message."]
  }
}
```

---

## Caching Strategy

All GET responses are cached at the **service layer** using Redis tagged cache — not at the HTTP layer. This means cache invalidation is precise and immediate on every mutation.

### Key naming convention

| Resource        | Key pattern                                                | TTL  |
| --------------- | ---------------------------------------------------------- | ---- |
| Categories list | `categories.list.page.{n}.per.{pp}`                        | 300s |
| Category detail | `categories.detail.{slug}`                                 | 300s |
| Products list   | `products.list.page.{n}.per.{pp}.cat.{c}.search.{s}`       | 60s  |
| Product detail  | `products.detail.{slug}`                                   | 60s  |
| Reviews list    | `reviews.list.page.{n}.per.{pp}.product.{id}.approved.{a}` | 60s  |

### TTL decisions

- **Products (60s):** Price, stock, and publish status change frequently from the admin panel. 60s balances freshness with cache efficiency.
- **Categories (300s):** Categories are stable — names and descriptions rarely change. 300s significantly reduces database load.
- **Reviews (60s):** New reviews are submitted publicly at any time and need to appear promptly after approval.

### Cache busting

On every mutation, related cache tags are flushed atomically:

- Category mutation → flush `Tag('categories')`
- Product mutation → flush `Tag('products')` + `Tag('reviews')`
- Review mutation → flush `Tag('reviews')` + specific `products.detail.{slug}`

### Cache-Control headers

All GET responses include:

```
Cache-Control: public, max-age={ttl}, s-maxage={ttl}
X-Cache-TTL: {ttl}
```

---

## SSG / ISR Strategy

| Route                | Strategy  | Revalidate | Purpose                                  |
| -------------------- | --------- | ---------- | ---------------------------------------- |
| `/`                  | SSG       | —          | Static homepage, rebuilds only on deploy |
| `/products`          | SSG + ISR | 60s        | Paginated listing with filters           |
| `/products/[slug]`   | SSG + ISR | 60s        | Product detail with reviews              |
| `/categories`        | SSG       | —          | Static categories list                   |
| `/categories/[slug]` | SSG + ISR | 300s       | Products filtered by category            |
| `/admin/*`           | CSR       | —          | Client-rendered, auth-protected          |

All published product and category slugs are pre-rendered at build time via `generateStaticParams`. Unpublished or missing slugs return proper 404s via `notFound()`.

---

## Beyond the Spec — Engineering Decisions

These production considerations were added beyond the minimum spec requirements:

### UUID Primary Keys

All tables use UUID primary keys instead of auto-incrementing integers. This prevents ID enumeration attacks (users cannot guess `/products/1`, `/products/2`), is safe for distributed systems, and is the industry standard for public-facing APIs. Implemented via a reusable `HasUuid` trait applied to all models.

### Service Layer Architecture

Business logic lives in dedicated service classes (`CategoryService`, `ProductService`, `ReviewService`, `CacheService`) rather than directly in controllers. Controllers are thin — they validate, delegate, and respond. This makes the codebase testable, maintainable, and follows SOLID principles.

### Typed API Response Transformers

The Laravel API returns `snake_case` JSON. The frontend transforms all API responses to `camelCase` TypeScript types using strongly-typed transformer functions in the service layer — no `any` types, no runtime surprises.

### Drizzle ORM as Type Contract

Drizzle ORM is used exclusively as a TypeScript type source — no live database connection on the frontend. The schema mirrors the backend tables exactly and provides `InferSelectModel` / `InferInsertModel` types used across all components, API calls, and form validation.

### Separate Raw API Types

A dedicated `src/types/api.ts` file defines `snake_case` raw API response interfaces that exactly match what Laravel returns. This creates a clear separation between the API contract and the application's internal TypeScript types.

### Global Error Handling

A custom exception handler in `bootstrap/app.php` catches all exception types and returns consistent JSON error envelopes. No HTML error pages ever leak to API consumers. Covers `AuthenticationException`, `ModelNotFoundException`, `ValidationException`, `MethodNotAllowedHttpException`, and a catch-all 500 handler that hides stack traces in production.

### Multi-Stage Docker Builds

The backend and frontend Dockerfiles use multi-stage builds with separate `development`, `builder`, and `production` targets. The production image is lean — no dev dependencies, no xdebug, with OPcache configured for maximum PHP performance.

### JSON-LD Structured Data

Product detail pages include `application/ld+json` structured data for Google rich results — product name, price, availability, and aggregate ratings. Breadcrumb structured data is also included on product and category detail pages.

### Core Web Vitals

- `next/font` with `display: swap` eliminates layout shift from font loading
- Fixed-dimension skeleton loaders on every async section prevent CLS
- Server Components by default — Client Components only where interaction is needed
- `next/image` configured with AVIF and WebP formats for optimal LCP
- Web Vitals reporting hook ready for analytics integration

### Design Token System

All colors, typography, spacing, shadows, and transitions are defined as CSS custom properties in a single `@theme {}` block in `globals.css`. Changing the brand color requires updating one line. Dark mode tokens override the same variables under `[data-theme="dark"]`.

### Optimistic UI Updates

The admin panel uses TanStack React Query's `onMutate` / `onError` / `onSettled` lifecycle to apply optimistic updates — the UI reflects changes instantly before the server responds, and rolls back automatically if the request fails.

### Axios Interceptors

A global axios interceptor attaches the Bearer token to every authenticated request and handles 401 responses by clearing the token and redirecting to login — no manual token management in individual components.

### Rate Limiting

The public review submission endpoint is throttled at 5 requests per minute per IP using Laravel's `throttle:5,1` middleware, returning a proper 429 response with a consistent error envelope.

### Soft Deletes

Categories and products use soft deletes — records are never permanently removed from the database on `DELETE` requests. This preserves data integrity and allows recovery. The `deleted_at` timestamp is indexed and all queries automatically exclude soft-deleted records via Eloquent's global scope.

---

---

## Environment Variables

### Backend (`backend/.env`)

| Variable                   | Description            | Docker default               |
| -------------------------- | ---------------------- | ---------------------------- |
| `APP_KEY`                  | Laravel encryption key | Generated via `key:generate` |
| `APP_ENV`                  | Environment            | `local`                      |
| `APP_DEBUG`                | Show errors            | `true`                       |
| `DB_HOST`                  | PostgreSQL host        | `db`                         |
| `DB_PORT`                  | PostgreSQL port        | `5432`                       |
| `DB_DATABASE`              | Database name          | `product_catalog`            |
| `DB_USERNAME`              | Database user          | `wfd`                        |
| `DB_PASSWORD`              | Database password      | `secret`                     |
| `REDIS_HOST`               | Redis host             | `cache`                      |
| `REDIS_PORT`               | Redis port             | `6379`                       |
| `CACHE_STORE`              | Cache driver           | `redis`                      |
| `SANCTUM_STATEFUL_DOMAINS` | Frontend domains       | `localhost:3000`             |

### Frontend (`frontend/.env.local`)

| Variable               | Description             | Default                        |
| ---------------------- | ----------------------- | ------------------------------ |
| `NEXT_PUBLIC_API_URL`  | API URL for browser     | `http://localhost:8000/api/v1` |
| `API_INTERNAL_URL`     | API URL for server-side | `http://nginx/api/v1`          |
| `NEXT_PUBLIC_APP_NAME` | App name                | `Product Catalog`              |
| `NEXT_PUBLIC_APP_URL`  | Frontend URL            | `http://localhost:3000`        |

---

## Git Workflow

```
main        ← stable, production-ready
└── develop ← integration branch
    └── feature/BE-XX-name  ← backend features
    └── feature/FE-XX-name  ← frontend features
```

Commit message format: `type(scope): description`

Examples:

```
feat(products): add CRUD resource controller with Redis caching
fix(auth): resolve CSRF token mismatch on public review submit
test(reviews): add approval workflow feature tests
docs(openapi): add Swagger annotations for all endpoints
```
