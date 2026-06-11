import { NextResponse } from 'next/server';
import { loadAndPreprocessData, RawSku, PreprocessedProduct } from '../../../lib/preprocess';
import { computePrice } from '../../../lib/products';

function getCheapestPrice(p: PreprocessedProduct): number {
  const sel = {
    size: p.attrs?.size?.[0] || null,
    length: p.attrs?.length?.[0] || null,
    grade: p.attrs?.grade?.[0] || null,
    finish: p.attrs?.finish?.[0] || null,
  };
  return computePrice(p, sel);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cat = searchParams.get('cat');
    const brand = searchParams.get('brand');
    const sys = searchParams.get('sys');
    const std = searchParams.get('std');
    const size = searchParams.get('size');
    const inStockOnly = searchParams.get('inStockOnly') === 'true';
    const q = searchParams.get('q');
    const sort = searchParams.get('sort');
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    
    let products = loadAndPreprocessData();

    // Filter by Category
    if (cat) {
      const cats = cat.split(',').map(c => c.trim()).filter(Boolean);
      if (cats.length > 0) {
        products = products.filter(p => cats.includes(p.cat));
      }
    }

    // Filter by Brand
    if (brand) {
      const brands = brand.split(',').map(b => b.trim()).filter(Boolean);
      if (brands.length > 0) {
        products = products.filter(p => brands.includes(p.brand));
      }
    }

    // Filter by Work System
    if (sys) {
      products = products.filter(p => p.systems?.includes(sys));
    }

    // Filter by Standard
    if (std) {
      const stds = std.split(',').map(s => s.trim()).filter(Boolean);
      if (stds.length > 0) {
        products = products.filter(p => p.standards.some(s => stds.includes(s)));
      }
    }

    // Filter by Size
    if (size) {
      const sizes = size.split(',').map(s => s.trim()).filter(Boolean);
      if (sizes.length > 0) {
        products = products.filter(p => {
          const pSizes = p.attrs?.size || p.hasSizes || [];
          return pSizes.some(s => sizes.includes(s));
        });
      }
    }

    // Filter by stock
    if (inStockOnly) {
      products = products.filter(p => !(p.lead && p.lead.days > 0));
    }

    // Search query matching against name (TH/EN), standards, ID, and category_sub
    if (q !== null) {
      const lowerQ = q.toLowerCase().trim();
      if (lowerQ === '') {
        products = [];
      } else {
        products = products.filter(p => {
          const standardMatch = p.standards.some(s => s.toLowerCase().includes(lowerQ));
          const thMatch = p.th.toLowerCase().includes(lowerQ);
          const enMatch = p.en.toLowerCase().includes(lowerQ);
          const idMatch = p.id.toLowerCase().includes(lowerQ);
          const skuMatch = p.sku?.toLowerCase().includes(lowerQ);
          const attrMatch = p.attrs ? Object.values(p.attrs).some((vals: string[] | undefined) => vals?.some((v: string) => v.toLowerCase().includes(lowerQ))) : false;

          // Also check raw SKUs within the product family
          const rawSkus = p.skus || [];
          const rawSkuMatch = rawSkus.some((s: RawSku) => 
            (s.sku && s.sku.toLowerCase().includes(lowerQ)) ||
            (s.name && s.name.toLowerCase().includes(lowerQ)) ||
            (s.category_sub && s.category_sub.toLowerCase().includes(lowerQ))
          );

          return thMatch || enMatch || idMatch || skuMatch || standardMatch || attrMatch || rawSkuMatch;
        });
      }
    }

    // Sort products
    if (sort === 'price-asc') {
      products = [...products].sort((a, b) => getCheapestPrice(a) - getCheapestPrice(b));
    } else if (sort === 'price-desc') {
      products = [...products].sort((a, b) => getCheapestPrice(b) - getCheapestPrice(a));
    }

    // Extract unique sorted arrays of categories, brands, standards, and sizes (facets) before pagination
    const categoriesFacet = Array.from(new Set(products.map(p => p.cat))).sort();
    const brandOrder = ['SUG', 'TITAN', 'LIO', 'LOREX'];
    const brandsFacet = Array.from(new Set(products.map(p => p.brand)))
      .sort((a, b) => brandOrder.indexOf(a) - brandOrder.indexOf(b));
    const standardsFacet = Array.from(new Set(products.flatMap(p => p.standards))).sort();
    const sizesFacet = Array.from(new Set(products.flatMap(p => p.attrs?.size || p.hasSizes || []))).sort();

    const facets = {
      categories: categoriesFacet,
      brands: brandsFacet,
      standards: standardsFacet,
      sizes: sizesFacet
    };

    // Apply Pagination
    let paginatedProducts = products;
    const total = products.length;
    let pages = 1;

    const isPageSpecified = page !== null && page !== undefined;
    const isLimitSpecified = limit !== null && limit !== undefined;

    if (isPageSpecified || isLimitSpecified) {
      let limitNum = 50;
      if (isLimitSpecified) {
        const parsedLimit = parseInt(limit, 10);
        if (!isNaN(parsedLimit) && parsedLimit > 0) {
          limitNum = parsedLimit;
        }
      }

      let pageNum = 1;
      if (isPageSpecified) {
        const parsedPage = parseInt(page, 10);
        if (!isNaN(parsedPage) && parsedPage > 0) {
          pageNum = parsedPage;
        }
      }

      pages = Math.ceil(total / limitNum);
      paginatedProducts = products.slice((pageNum - 1) * limitNum, pageNum * limitNum);
    } else {
      paginatedProducts = products;
      pages = 1;
    }

    // Return list of products along with facets and pagination info
    return NextResponse.json({
      products: paginatedProducts,
      total,
      pages,
      facets
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in GET /api/products:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
