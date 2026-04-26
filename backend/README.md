# Product Catalog & Review Platform — Backend

A production-ready REST API built with Laravel 12, PostgreSQL, and Redis.

---

## Tech Stack

| Layer            | Technology                    |
| ---------------- | ----------------------------- |
| Framework        | Laravel 12 (PHP 8.2+)         |
| Database         | PostgreSQL 16                 |
| Cache            | Redis 7                       |
| Auth             | Laravel Sanctum (token-based) |
| Server           | Nginx + PHP-FPM               |
| Containerisation | Docker + Docker Compose       |

---

## Prerequisites

- PHP 8.2+
- Composer 2.x
- PostgreSQL 16
- Redis 7
- Docker + Docker Compose (for containerised setup)

---

## Local Setup (without Docker)

### 1. Clone the repository

```bash
git clone https://github.com/sechibueze/fullstack-product-catalog.git
cd fullstack-product-catalog/backend
```

### 2. Install dependencies

```bash
composer install
```

### 3. Configure environment

```bash
cp .env.example .env
php artisan key:generate
```

Update `.env` with your local database and Redis credentials:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=product_catalog
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

CACHE_STORE=redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

### 4. Create databases

```bash
psql -U your_db_user -c "CREATE DATABASE product_catalog;"
psql -U your_db_user -c "CREATE DATABASE product_catalog_test;"
```

### 5. Run migrations and seeders

```bash
php artisan migrate:fresh --seed
```

This seeds:

- 3 categories
- 8 products (6 published, 2 unpublished)
- 10 reviews (7 approved, 3 unapproved)

### 6. Create admin user

```bash
php artisan tinker --execute="
App\Models\User::create([
    'name'     => 'Admin User',
    'email'    => 'admin@example.com',
    'password' => bcrypt('password'),
]);
echo 'Admin created';
"
```

### 7. Start the development server

```bash
php artisan serve --port=8000
```

API is now available at `http://localhost:8000/api/v1`

---

## Docker Setup

### 1. Start all services

```bash
# From repo root
docker compose up -d db cache backend nginx
```

### 2. Install dependencies inside container

```bash
docker compose exec backend composer install
```

### 3. Generate app key

```bash
docker compose exec backend php artisan key:generate
```

### 4. Run migrations and seeders

```bash
docker compose exec backend php artisan migrate:fresh --seed
```

### 5. Create admin user

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

API is available at `http://localhost:8000/api/v1`

---

## Running Tests

### Setup test database

```bash
# Local
psql -U your_db_user -c "CREATE DATABASE product_catalog_test;"

# Docker
docker compose exec db psql -U wfd -d postgres -c "CREATE DATABASE product_catalog_test TEMPLATE template0 ENCODING 'UTF8' LC_COLLATE 'en_US.utf8' LC_CTYPE 'en_US.utf8';"
```

### Run all tests

```bash
php artisan test
```

### Run specific suites

```bash
# Unit tests only
php artisan test --testsuite=Unit

# Feature tests only
php artisan test --testsuite=Feature

# With coverage
php artisan test --coverage
```

### Test summary

| Suite                    | Tests   | Coverage                                     |
| ------------------------ | ------- | -------------------------------------------- |
| Unit — Models            | 14      | UUID, relationships, scopes, soft deletes    |
| Feature — Categories API | 13      | Full CRUD, auth, validation, pagination      |
| Feature — Products API   | 14      | Full CRUD, filtering, auth, toggle published |
| Feature — Reviews API    | 11      | Public submit, approve/reject, throttle      |
| **Total**                | **52+** | All passing                                  |

---

## API Reference

### Base URL

- http://localhost:8000/api/v1

### Authentication

All write endpoints require a Bearer token obtained from the login endpoint.

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

Use the returned token in subsequent requests:

### HTTP status codes

| Code | Meaning            |
| ---- | ------------------ |
| 200  | Success            |
| 201  | Created            |
| 204  | No content         |
| 401  | Unauthenticated    |
| 403  | Forbidden          |
| 404  | Not found          |
| 405  | Method not allowed |
| 422  | Validation error   |
| 429  | Too many requests  |
| 500  | Server error       |

---

### Endpoints

#### Health

| Method | Endpoint      | Auth | Description          |
| ------ | ------------- | ---- | -------------------- |
| GET    | `/api/health` | No   | Service health check |

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
