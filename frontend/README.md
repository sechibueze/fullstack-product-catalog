# Product Catalog — Frontend

Next.js 15 frontend for the Product Catalog & Review Platform.

---

## Stack

- **Framework:** Next.js 15.5 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4
- **Data fetching:** TanStack React Query v5
- **Forms:** React Hook Form + Zod
- **Schema:** Drizzle ORM (type contract only)
- **Toasts:** Sonner

---

## Setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Update `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_NAME="Product Catalog"
NEXT_PUBLIC_APP_URL=http://localhost:3000
API_INTERNAL_URL=http://localhost:8000/api/v1
```

### 3. Start development server

```bash
npm run dev
```

App is available at `http://localhost:3000`

### 4. Build for production

```bash
npm run build
npm run start
```

---

## Pages

| Route                | Strategy         | Description                            |
| -------------------- | ---------------- | -------------------------------------- |
| `/`                  | SSG              | Homepage with featured products        |
| `/products`          | SSG + ISR (60s)  | Paginated listing with category filter |
| `/products/[slug]`   | SSG + ISR (60s)  | Product detail with reviews            |
| `/categories`        | SSG              | All categories                         |
| `/categories/[slug]` | SSG + ISR (300s) | Products filtered by category          |
| `/admin/login`       | Static           | Admin login                            |
| `/admin/products`    | CSR              | Product CRUD table                     |
| `/admin/reviews`     | CSR              | Review moderation                      |

---

## SSG / ISR Decisions

- **Products (60s revalidate):** Stock, price, and publish status change frequently. 60s ensures customers see updates quickly while still serving cached pages.
- **Categories (300s revalidate):** Categories are stable. 300s reduces origin load while keeping content fresh.
- **`generateStaticParams`:** All published product and category slugs are pre-rendered at build time for instant page loads.
- **`notFound()`:** Called for unpublished or missing slugs so they return proper 404s rather than empty pages.

---

## Design Tokens

All colors, fonts, and spacing are defined as CSS variables in `src/app/globals.css` inside the `@theme {}` block. To change the brand color update a single line:

```css
@theme {
  --color-primary: #7c3aed;
}
```

Dark mode is toggled via `data-theme="dark"` on the `<html>` element and persisted in `localStorage`.

---

## Admin Panel

The admin panel requires authentication. Login at `/admin/login`:
Email: admin@example.com
Password: password

Tokens are stored in `localStorage` and sent as `Bearer` tokens on every API request via the axios interceptor.
