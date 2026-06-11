# Original User Request

## Initial Request — 2026-06-10T23:23:06+07:00

Migrate and integrate all 6,341 real products across SUG, TITAN, LIO, GIANTLOK, LOREX, and ORBIT brands into the Next.js production website.

Working directory: `/Users/kim/Library/Mobile Documents/com~apple~CloudDocs/Desktop/Work/SUG/20 - AI/03 - AI Agent Team/02 - Kim's AI Commercial Office/04 - Sales /17 - SUG New Website Design/sug-website`
Integrity mode: development

## Requirements

### R1. Product Data Migration
Copy and place the legacy JSON database files (`products_sug.json`, `products_lio.json`, `products_titan.json`, `products_other.json`, and `taxonomy.json`) from the source directory `/Users/kim/Library/Mobile Documents/com~apple~CloudDocs/Desktop/Work/SUG/20 - AI/03 - AI Agent Team/02 - Kim's AI Commercial Office/04 - Sales /09 - Product Lists and Discounts/web_app/data` to the Next.js website project's public data folder (`public/data/`).

### R2. Catalog Search & Filter Updates
Update the catalog page (`/catalog`) to load product data dynamically using asynchronous fetches. Ensure the search query, category, brand, and option filters successfully query all 6,300+ items across the SUG, TITAN, LIO, GIANTLOK, LOREX, and ORBIT brands.

### R3. Product Detail Page Dynamic Routing
Update the dynamic product detail route (`/products/[category]/[product]`) to fetch detailed product specs, stock levels, packaging conversions, volume break tables, and dealer discounts dynamically by retrieving items by ID or SKU from the corresponding partition files.

### R4. Categories & Work Systems Integration
Verify that categories in the sidebar and home page link correctly to the catalog filters, ensuring compatibility with all migrated brands.

## Acceptance Criteria

### Data Correctness
- [ ] All 6,341 products across SUG, TITAN, LIO, GIANTLOK, LOREX, and ORBIT are accessible in the search and filter queries.
- [ ] Pricing, volume discounts, packaging quantities, and branch stocks are correctly rendered.

### User Experience
- [ ] Catalog loading handles asynchronous data fetching gracefully (e.g., using loading states or placeholders during fetch).
- [ ] Clicking any product in the catalog correctly opens its detailed page under `/products/[category]/[product]`.

### Code Integrity & Build
- [ ] The Next.js production build (`npm run build`) compiles cleanly without any TypeScript or linting errors.

## Follow-up — 2026-06-12T00:07:19+07:00

We need to fix the 404 "Product not found" errors that occur when visiting product detail pages (e.g. `/products/tools/sug-12`) and category pages for the preprocessed database (which contains 3,359 products). Currently, only the 14 hardcoded static products work because the client components return a 404 early-render before the dynamic data fetch completes, and because Next.js 15 async params are accessed synchronously.

Working directory: `/Users/kim/Library/Mobile Documents/com~apple~CloudDocs/Desktop/Work/SUG/20 - AI/03 - AI Agent Team/02 - Kim's AI Commercial Office/04 - Sales /17 - SUG New Website Design/sug-website`
Integrity mode: development

## Requirements

### R1. Unwrap Async Router Params (Next.js 15)
In `app/products/[category]/page.tsx`, `app/products/[category]/[product]/page.tsx`, and their corresponding client components (`CategoryPage.tsx` and `ProductDetailPage.tsx`), resolve/unwrap the async `params` Promise correctly using React's `use(params)` hook.

### R2. Loading States & Safe Render Guards
- Implement clean, premium loading states (skeletons or spinners) in both `ProductDetailPage.tsx` and `CategoryPage.tsx` when the product or category data is still being fetched asynchronously.
- Do NOT early-return a 404 page during the initial render before the async fetch completes.
- Only show the 404 "Product not found" screen if the API returns a 404 status code or if the fetch completes and the item is confirmed to be missing.

### R3. Build and Test Compliance
Verify the application builds cleanly with `npm run build` and all 15 integration tests pass with `npm test`.

## Acceptance Criteria

### Functionality
- [ ] Visiting `/products/tools/sug-12` (or any other preprocessed product ID) loads the product details successfully instead of a 404 page.
- [ ] Visiting category pages (e.g., `/products/screws`, `/products/sds`) lists all respective preprocessed products correctly.
- [ ] Non-existent IDs still return a proper 404 page after the fetch completes.

### Build and Tests
- [ ] The Next.js production build (`npm run build`) compiles cleanly without any compilation or TypeScript errors.
- [ ] All 15 integration tests (`npm test`) pass cleanly.

