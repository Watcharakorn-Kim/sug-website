# Project: SUG Website 6,341 Products Migration & Integration

## Architecture
This project integrates 6,341 real products across SUG, TITAN, LIO, GIANTLOK, LOREX, and ORBIT brands.
To prevent browser performance degradation (LCP, INP) from parsing a 13.4MB JSON product database on the client:
1. **Server-Side API Routing (Node.js)**: Expose `/api/products` and `/api/products/[id]` to load, parse, cache, and filter the JSON files server-side.
2. **Product Family Re-indexing & Grouping**: Group flat SKU records (from brand JSONs) into unified dynamic parametric "Product Families" grouped by `family` + `brand` + `category_sub`.
3. **Dynamic UI Rendering**:
   - The `/catalog` page fetches filtered results asynchronously from `/api/products`.
   - The `/products/[category]/[product]` page dynamically fetches detailed product info (specs, stock, breaks, discounts) from `/api/products/[id]`.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Product Data Migration | Copy JSON files to `public/data/` | None | DONE |
| 2 | Backend API Routing & Grouping | Implement pre-processing logic, `/api/products` and `/api/products/[id]` | M1 | DONE |
| 3 | Catalog Page Integration | Update `/catalog` to fetch dynamically and support full-brand filtering | M2 | DONE |
| 4 | Product Detail Route Updates | Update `/products/[category]/[product]` to fetch dynamically | M2 | DONE |
| 5 | Categories & Work Systems | Verify homepage/sidebar links to catalog filters align | M3 | DONE |
| 6 | E2E Testing & Acceptance | Create and run E2E test cases to verify 100% integration | M4, M5 | DONE |

## Interface Contracts
### `/api/products` Query Params
- `q`: Search query string
- `cat`: Category key (e.g. `bolts`)
- `brand`: Brand filter (e.g. `SUG`, `TITAN`, etc.)
- `std`: Standard filter
- `size`: Thread size filter
- `inStockOnly`: Boolean string
- `sort`: `rel` \| `price-asc` \| `price-desc`
- `page`: Page index (optional, default 1)
- `limit`: Page size (optional, default 50)

**Response Format**:
```json
{
  "products": [
    {
      "id": "string",
      "cat": "string",
      "brand": "string",
      "th": "string",
      "en": "string",
      "standards": ["string"],
      "img": "string | null",
      "parametric": boolean,
      "attrs": {
        "size": ["string"],
        "length": ["string"],
        "grade": ["string"],
        "finish": ["string"]
      },
      "sku": "string",
      "priceList": number,
      "breaks": [[number, number]],
      "lead": { "stock": "string", "days": number },
      "seed": number
    }
  ],
  "total": number,
  "pages": number,
  "facets": {
    "sizes": ["string"],
    "standards": ["string"],
    "brands": ["string"],
    "categories": ["string"]
  }
}
```

### `/api/products/[id]` Query Params (retrieved by Product ID or SKU)
**Response Format**:
```json
{
  "product": {
    "id": "string",
    "cat": "string",
    "brand": "string",
    "th": "string",
    "en": "string",
    "standards": ["string"],
    "img": "string | null",
    "parametric": boolean,
    "attrs": {
      "size": ["string"],
      "length": ["string"],
      "grade": ["string"],
      "finish": ["string"]
    },
    "breaks": [[number, number]],
    "lead": { "stock": "string", "days": number },
    "seed": number,
    "skus": [
      {
        "sku": "string",
        "name": "string",
        "price_unit": "string",
        "list_price": number,
        "general_net": number,
        "general_cash": number,
        "t1_net": number,
        "t1_cash": number,
        ...
        "t6_net": number,
        "t6_cash": number,
        "pcs_per_pack": number,
        "packs_per_case": number,
        "pcs_per_case": number,
        "spec_size": "string",
        "length_inch": "string",
        "material_coating": "string",
        "color": "string"
      }
    ]
  }
}
```

## Code Layout
- `public/data/` - Legacy product and taxonomy JSONs
- `app/api/products/route.ts` - Main catalog query endpoint
- `app/api/products/[id]/route.ts` - Single product fetch endpoint (supports ID or SKU query)
- `lib/preprocess.ts` - Helper to load, clean, group, and cache product records in memory
- `app/catalog/CatalogPage.tsx` - Updated frontend for async fetching
- `app/products/[category]/[product]/ProductDetailPage.tsx` - Updated frontend for detail fetch
