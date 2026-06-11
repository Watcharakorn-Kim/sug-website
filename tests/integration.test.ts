import { describe, it, expect, createMockRequest, runAllTests } from './test-framework';
import { GET as getProducts } from '../app/api/products/route';
import { GET as getProductDetail } from '../app/api/products/[id]/route';
import {
  PRODUCTS,
  CATEGORIES,
  SYSTEMS,
  CROSS_REF_DB,
  DEALER_MULT,
  getProductById,
  computePrice,
  buildSku,
  packFor,
  unitToPcs,
  tierPrice,
  stockFor,
  searchProducts,
  crossRefSearch,
  type Product
} from '../lib/products';
import { getTierPrice, loadAndPreprocessData } from '../lib/preprocess';

// Helper to convert Response to JSON
async function resJson(res: any) {
  return await res.json();
}

describe('Tier 1: Feature Coverage', () => {
  // TC-1.1 to TC-1.5
  it('Search (q query param) functionality', async () => {
    // 1. English keyword search ("screw")
    let req = createMockRequest('http://localhost/api/products?q=screw');
    let res = await getProducts(req);
    let data = await resJson(res);
    expect(data.products).toBeDefined();
    console.log('DEBUG [q=screw]: length =', data.products.length);
    if (data.products.length > 0) {
      console.log('DEBUG [q=screw] sample:', data.products.slice(0, 3).map((p: any) => p.en));
    }
    expect(data.products.length).toBeGreaterThan(0);
    // Ensure all returned items match keyword screw in some field
    data.products.forEach((p: any) => {
      const match = p.en.toLowerCase().includes('screw') ||
                    p.th.toLowerCase().includes('screw') ||
                    p.id.toLowerCase().includes('screw') ||
                    p.standards.some((s: string) => s.toLowerCase().includes('screw')) ||
                    (p.sku && p.sku.toLowerCase().includes('screw'));
      expect(match).toBe(true);
    });

    // 2. Thai keyword search ("สกรู")
    req = createMockRequest('http://localhost/api/products?q=สกรู');
    res = await getProducts(req);
    data = await resJson(res);
    expect(data.products.length).toBeGreaterThan(0);
    data.products.forEach((p: any) => {
      const match = p.en.toLowerCase().includes('screw') ||
                    p.th.includes('สกรู') ||
                    p.id.toLowerCase().includes('screw') ||
                    p.standards.some((s: string) => s.includes('สกรู') || s.toLowerCase().includes('screw')) ||
                    (p.sku && p.sku.includes('สกรู')) ||
                    (p.attrs && Object.values(p.attrs).some((vals: any) => vals.some((v: string) => v.includes('สกรู')))) ||
                    (p.skus && p.skus.some((s: any) => 
                      (s.sku && s.sku.includes('สกรู')) ||
                      (s.name && s.name.includes('สกรู')) ||
                      (s.category_sub && s.category_sub.includes('สกรู'))
                    ));
      expect(match).toBe(true);
    });

    // 3. Standard code search ("DIN 741")
    req = createMockRequest('http://localhost/api/products?q=DIN%20741');
    res = await getProducts(req);
    data = await resJson(res);
    expect(data.products.length).toBeGreaterThan(0);
    data.products.forEach((p: any) => {
      const match = p.standards.some((s: string) => s.includes('DIN 741'));
      expect(match).toBe(true);
    });

    // 4. Precise SKU code search ("838011016016" or similar real SKU from SUG/TITAN)
    // Let's find a real SKU first from the preprocessed database
    const allProds = loadAndPreprocessData();
    const suggestions = allProds.filter(p => p.skus && p.skus.length > 0 && p.skus[0].sku);
    const targetSku = suggestions.length > 0 ? suggestions[0].skus[0].sku : '8200301002';
    
    req = createMockRequest(`http://localhost/api/products?q=${targetSku}`);
    res = await getProducts(req);
    data = await resJson(res);
    expect(data.products.length).toBeGreaterThan(0);
    
    // 5. Non-matching query search ("xyz123abc")
    req = createMockRequest('http://localhost/api/products?q=xyz123abc');
    res = await getProducts(req);
    data = await resJson(res);
    expect(data.products.length).toBe(0);
  });

  // TC-2.1 to TC-2.5
  it('Brand Filter (brand query param) functionality', async () => {
    // 1. SUG brand selection
    let req = createMockRequest('http://localhost/api/products?brand=SUG');
    let res = await getProducts(req);
    let data = await resJson(res);
    expect(data.products.length).toBeGreaterThan(0);
    data.products.forEach((p: any) => expect(p.brand).toBe('SUG'));

    // 2. TITAN brand selection
    req = createMockRequest('http://localhost/api/products?brand=TITAN');
    res = await getProducts(req);
    data = await resJson(res);
    expect(data.products.length).toBeGreaterThan(0);
    data.products.forEach((p: any) => expect(p.brand).toBe('TITAN'));

    // 3. GIANTLOK / LIO brand selection
    req = createMockRequest('http://localhost/api/products?brand=LIO');
    res = await getProducts(req);
    data = await resJson(res);
    expect(data.products.length).toBeGreaterThan(0);
    data.products.forEach((p: any) => expect(p.brand).toBe('LIO'));

    // 4. Multiple brand union selection
    req = createMockRequest('http://localhost/api/products?brand=SUG,TITAN');
    res = await getProducts(req);
    data = await resJson(res);
    expect(data.products.length).toBeGreaterThan(0);
    const brandsSet = new Set(data.products.map((p: any) => p.brand));
    expect(brandsSet.has('SUG') || brandsSet.has('TITAN')).toBe(true);

    // 5. Brand filter with no records
    req = createMockRequest('http://localhost/api/products?brand=NONEXISTENT');
    res = await getProducts(req);
    data = await resJson(res);
    expect(data.products.length).toBe(0);
  });

  // TC-3.1 to TC-3.5
  it('Category Filter (cat query param) functionality', async () => {
    // 1. Bolts category filter
    let req = createMockRequest('http://localhost/api/products?cat=bolts');
    let res = await getProducts(req);
    let data = await resJson(res);
    expect(data.products.length).toBeGreaterThan(0);
    data.products.forEach((p: any) => expect(p.cat).toBe('bolts'));

    // 2. Screws category filter
    req = createMockRequest('http://localhost/api/products?cat=screws');
    res = await getProducts(req);
    data = await resJson(res);
    expect(data.products.length).toBeGreaterThan(0);
    data.products.forEach((p: any) => expect(p.cat).toBe('screws'));

    // 3. SDS (Self-drilling screws) category filter
    req = createMockRequest('http://localhost/api/products?cat=sds');
    res = await getProducts(req);
    data = await resJson(res);
    expect(data.products.length).toBeGreaterThan(0);
    data.products.forEach((p: any) => expect(p.cat).toBe('sds'));

    // 4. Nuts and washers category filter
    req = createMockRequest('http://localhost/api/products?cat=nuts');
    res = await getProducts(req);
    data = await resJson(res);
    expect(data.products.length).toBeGreaterThan(0);
    data.products.forEach((p: any) => expect(p.cat).toBe('nuts'));

    // 5. Power tool accessories category filter
    req = createMockRequest('http://localhost/api/products?cat=tools');
    res = await getProducts(req);
    data = await resJson(res);
    expect(data.products.length).toBeGreaterThan(0);
    data.products.forEach((p: any) => expect(p.cat).toBe('tools'));
  });

  // TC-4.1 to TC-4.5
  it('Standard Filter (std query param) functionality (Expected to fail if API lacks std filtering)', async () => {
    // NOTE: This test will FAIL if the API route does not implement the 'std' query param filter.
    // This demonstrates the test runner's ability to catch non-implemented/failing features.
    
    // We will verify if API supports 'std' filter. If not, it returns unfiltered results, which is a failure.
    let req = createMockRequest('http://localhost/api/products?std=DIN%20741');
    let res = await getProducts(req);
    let data = await resJson(res);
    
    // Assert that every returned product indeed has DIN 741
    // (If the API lacks std parameter processing, it will return other standards, triggering failure)
    data.products.forEach((p: any) => {
      const hasStd = p.standards.includes('DIN 741');
      if (!hasStd) {
        throw new Error(`API returned product ${p.id} without DIN 741 standard when filtering by std=DIN 741! (API std filter missing)`);
      }
    });
  });

  // TC-5.1 to TC-5.5
  it('Size Filter (size query param) functionality (Expected to fail if API lacks size filtering)', async () => {
    // Similarly, size query filtering is client-side in the catalog page, so the API route is expected to return unfiltered results.
    let req = createMockRequest('http://localhost/api/products?size=M6');
    let res = await getProducts(req);
    let data = await resJson(res);

    data.products.forEach((p: any) => {
      const sizes = p.attrs?.size || p.hasSizes || [];
      const hasSize = sizes.includes('M6');
      if (!hasSize) {
        throw new Error(`API returned product ${p.id} without M6 size option when filtering by size=M6! (API size filter missing)`);
      }
    });
  });
});

describe('Tier 2: Boundary & Corner Cases', () => {
  // Empty Query / Whitespace
  it('Empty queries & whitespaces', async () => {
    // TC-2.1.1: Whitespace-only search (should be trimmed and return empty list or ignored)
    let req = createMockRequest('http://localhost/api/products?q=%20%20%20%20%20');
    let res = await getProducts(req);
    let data = await resJson(res);
    expect(data.products.length).toBe(0);

    // TC-2.1.2: Omitted query parameter (should succeed and return all items)
    req = createMockRequest('http://localhost/api/products');
    res = await getProducts(req);
    data = await resJson(res);
    expect(data.products.length).toBeGreaterThan(0);

    // TC-2.1.4: URL percent-encoded spaces
    req = createMockRequest('http://localhost/api/products?q=%20%20');
    res = await getProducts(req);
    data = await resJson(res);
    expect(data.products.length).toBe(0);
  });

  // Very Long Query
  it('Very long queries and limit bounds', async () => {
    // TC-2.2.1: 256-character keyword search
    const longQ256 = 'a'.repeat(256);
    let req = createMockRequest(`http://localhost/api/products?q=${longQ256}`);
    let res = await getProducts(req);
    let data = await resJson(res);
    expect(data.products.length).toBe(0);

    // TC-2.2.2: 1024-character keyword search
    const longQ1024 = 'b'.repeat(1024);
    req = createMockRequest(`http://localhost/api/products?q=${longQ1024}`);
    res = await getProducts(req);
    data = await resJson(res);
    expect(data.products.length).toBe(0);
  });

  // Special Characters
  it('Special characters injection attempts', async () => {
    // TC-2.3.1: RegEx metacharacters in search
    let req = createMockRequest('http://localhost/api/products?q=.*%2B%3F%5E%24%7B%7D%28%29%7C%5B%5D%5C');
    let res = await getProducts(req);
    let data = await resJson(res);
    // Should handle gracefully without crashing (regex safety)
    expect(data.products.length).toBe(0);

    // TC-2.3.2: SQL Injection input
    req = createMockRequest('http://localhost/api/products?q=1%27%20OR%20%271%27%3D%271%27%20--');
    res = await getProducts(req);
    data = await resJson(res);
    expect(data.products.length).toBe(0);

    // TC-2.3.3: HTML/XSS tag injection
    req = createMockRequest('http://localhost/api/products?q=%3Cscript%3Ealert(%22XSS%22)%3C/script%3E');
    res = await getProducts(req);
    data = await resJson(res);
    expect(data.products.length).toBe(0);
  });

  // Max Paging (Expected to fail if API lacks pagination implementation)
  it('Pagination boundary parameters', async () => {
    // Note: The /api/products route currently loads all products and does not implement paging logic.
    // If the tests assert that page 2 returns different items than page 1, they will fail.
    // This is an expected failure that documents the current API limitation.
    let req = createMockRequest('http://localhost/api/products?page=2&limit=5');
    let res = await getProducts(req);
    let data = await resJson(res);
    
    // In a fully paged API, total products might be large, but the array length should be limited to 5.
    // If the API returns all products (length > 5), this highlights the need for backend pagination.
    if (data.products.length > 5) {
      throw new Error(`API returned ${data.products.length} products for limit=5. Paging limit check failed!`);
    }
  });

  // Incorrect IDs & Routes
  it('Product Detail API routes with invalid IDs', async () => {
    // TC-2.5.1: Non-existent product ID
    let req = createMockRequest('http://localhost/api/products/non-existent-product-id');
    let res = await getProductDetail(req, { params: Promise.resolve({ id: 'non-existent-product-id' }) });
    expect(res.status).toBe(404);
    let data = await resJson(res);
    expect(data.error).toBe('Product not found');

    // TC-2.5.3: Path traversal ID
    req = createMockRequest('http://localhost/api/products/..%2F..%2Fetc%2Fpasswd');
    res = await getProductDetail(req, { params: Promise.resolve({ id: '../../etc/passwd' }) });
    expect(res.status).toBe(404);
  });
});

describe('Tier 3: Cross-Feature Combinations', () => {
  it('Pairwise combination filtering', async () => {
    // 1. Search + Brand (e.g. search "screw" under brand SUG)
    let req = createMockRequest('http://localhost/api/products?q=screw&brand=SUG');
    let res = await getProducts(req);
    let data = await resJson(res);
    console.log('DEBUG [q=screw&brand=SUG]: length =', data.products.length);
    if (data.products.length > 0) {
      console.log('DEBUG [q=screw&brand=SUG] sample:', data.products.slice(0, 3).map((p: any) => p.en));
    }
    expect(data.products.length).toBeGreaterThan(0);
    data.products.forEach((p: any) => {
      expect(p.brand).toBe('SUG');
      const nameMatch = p.en.toLowerCase().includes('screw') || p.th.toLowerCase().includes('screw') || p.id.toLowerCase().includes('screw') || (p.cat === 'screws' || p.cat === 'sds');
      expect(nameMatch).toBe(true);
    });

    // 2. Brand + Category (e.g. brand TITAN and category bolts)
    req = createMockRequest('http://localhost/api/products?brand=TITAN&cat=bolts');
    res = await getProducts(req);
    data = await resJson(res);
    expect(data.products.length).toBeGreaterThan(0);
    data.products.forEach((p: any) => {
      expect(p.brand).toBe('TITAN');
      expect(p.cat).toBe('bolts');
    });

    // 3. Search + Brand + Category
    req = createMockRequest('http://localhost/api/products?q=screw&brand=SUG&cat=screws');
    res = await getProducts(req);
    data = await resJson(res);
    expect(data.products.length).toBeGreaterThan(0);
    data.products.forEach((p: any) => {
      expect(p.brand).toBe('SUG');
      expect(p.cat).toBe('screws');
      const nameMatch = p.en.toLowerCase().includes('screw') || p.th.toLowerCase().includes('screw') || p.id.toLowerCase().includes('screw');
      expect(nameMatch).toBe(true);
    });
  });
});

describe('Tier 4: Real-World Application Scenarios', () => {
  // Scenario A: Competitor SKU Cross-Reference
  it('Scenario A: Competitor SKU Cross-Reference Search', () => {
    // Search for Hilti SKU "S-WH 15"
    const results = crossRefSearch('S-WH 15');
    expect(results.length).toBeGreaterThan(0);
    
    const entry = results[0];
    expect(entry.competitor_brand).toBe('Hilti');
    expect(entry.competitor_sku).toBe('S-WH 15');
    expect(entry.sug_product_id).toBe('sds-screw'); // SUG equivalent product id
    
    // Verify matching SUG equivalent exists in database
    const sugProd = getProductById(entry.sug_product_id);
    expect(sugProd).toBeDefined();
    expect(sugProd?.id).toBe('sds-screw');
  });

  // Scenario B: Gold Dealer Tiered pricing and packaging conversions
  it('Scenario B: Gold Dealer calculations for fully threaded hex bolt (hex-bolt-933)', () => {
    const prod = getProductById('hex-bolt-933');
    expect(prod).toBeDefined();
    const product = prod as Product;

    // Attributes selected: size=M12, length=50, grade=8.8, finish=ชุบซิงค์ขาว / Zinc
    const selection = {
      size: 'M12',
      length: '50',
      grade: '8.8',
      finish: 'ชุบซิงค์ขาว / Zinc'
    };

    // Calculate list price
    const listPrice = computePrice(product, selection);
    // Base is 6, size M12 mult is 3.2, length 50 mult is 1 + 50/120 = 1.41666, grade 8.8 mult is 1, finish Zinc mult is 1.
    // Expected = 6 * 3.2 * 1.41666 = 27.2
    expect(listPrice).toBe(27.2);

    // B2B Gold Dealer base discount = 15% (multiplier 0.85). Wait, let's verify if DEALER_MULT is 0.82 or if Gold uses its own.
    // From dealerAuth.tsx, TIER_CONFIG.gold has discount 15%, but in ProductDetailPage.tsx:
    // "const unitPrice = dealer ? Math.round(listPrice * DEALER_MULT * 100) / 100 : listPrice;"
    // DEALER_MULT is 0.82 (which matches 18% dealer discount).
    const goldUnitPrice = Math.round(listPrice * DEALER_MULT * 100) / 100;
    // Expected unitPrice = Math.round(27.2 * 0.82 * 100) / 100 = 22.3
    expect(goldUnitPrice).toBe(22.3);

    // Unit selected: "boxes" (box unit). Let's convert boxes to pieces.
    const qtyBoxes = 5;
    const pk = packFor(product);
    // Default packing for bolts is [100, 10] -> boxPcs=100, boxesPerCrate=10.
    expect(pk.boxPcs).toBe(100);
    const qtyPcs = unitToPcs(product, 'box', qtyBoxes);
    expect(qtyPcs).toBe(500);

    // Volume break discount at 500 pcs is 0.85
    // breaks for bolts: [[1, 1], [100, 0.92], [500, 0.85], [2000, 0.78]]
    const finalPricePerPc = tierPrice(goldUnitPrice, qtyPcs, product.breaks);
    // Expected finalPricePerPc = Math.round(22.3 * 0.85 * 100) / 100 = 18.96
    expect(finalPricePerPc).toBe(18.96);

    // Add-to-cart total price:
    const totalOrderPrice = finalPricePerPc * qtyPcs;
    expect(totalOrderPrice).toBe(9480); // 18.96 * 500 = 9480
  });

  // Scenario C: B2B Silver Dealer SDS Screw Crate Ordering & Branch Stock Check
  it('Scenario C: Silver Dealer SDS Screw calculations and stock check', () => {
    const prod = getProductById('sds-screw');
    expect(prod).toBeDefined();
    const product = prod as Product;

    // Verify stock availability in Chiang Mai (CNX)
    const stockList = stockFor(product.seed);
    const cnxStock = stockList.find(b => b.code === 'CNX');
    expect(cnxStock).toBeDefined();
    expect(cnxStock?.qty).toBeGreaterThan(0);

    // Quantity to buy: 1 crate
    const pk = packFor(product);
    // packing for sds-screw: [100, 12] -> boxPcs=100, boxesPerCrate=12, cratePcs=1200
    expect(pk.boxPcs).toBe(100);
    expect(pk.boxesPerCrate).toBe(12);
    const qtyPcs = unitToPcs(product, 'crate', 1);
    expect(qtyPcs).toBe(1200);

    // Calculate selection pricing: size=#12, length=45, grade=C1022 ชุบ, finish=ชุบซิงค์ / Zinc
    const selection = {
      size: '#12',
      length: '45',
      grade: 'C1022 ชุบ',
      finish: 'ชุบซิงค์ / Zinc'
    };
    const listPrice = computePrice(product, selection);
    // Base is 1.8, size #12 mult is 1.2, length 45 mult is 1 + 45/120 = 1.375, grade mult is 1, finish mult is 1.
    // Expected = 1.8 * 1.2 * 1.375 = 2.97
    expect(listPrice).toBe(3); // Math.max(0.3, Math.round(2.97 * 10) / 10) -> 3.0

    // Dealer unit price
    const silverUnitPrice = Math.round(listPrice * DEALER_MULT * 100) / 100;
    // Expected = Math.round(3 * 0.82 * 100) / 100 = 2.46
    expect(silverUnitPrice).toBe(2.46);

    // Volume break for sds-screw at 1200 pcs (qualifies for >=1000 tier with 0.8 multiplier)
    // breaks for sds-screw: [[1, 1], [250, 0.9], [1000, 0.8], [5000, 0.7]]
    const finalPricePerPc = tierPrice(silverUnitPrice, qtyPcs, product.breaks);
    // Expected = Math.round(2.46 * 0.8 * 100) / 100 = 1.97
    expect(finalPricePerPc).toBe(1.97);

    const totalCratePrice = finalPricePerPc * qtyPcs;
    expect(totalCratePrice).toBe(2364); // 1.97 * 1200 = 2364
  });

  // Scenario D: Credit Limit validation
  it('Scenario D: Bronze Dealer Credit Limit check', () => {
    // Mock Bronze dealer demo account
    const dealerUser = {
      id: 'D099',
      name: 'Demo Account',
      company: 'SUG Demo Dealer',
      province: 'กรุงเทพมหานคร',
      tier: 'bronze',
      creditLimit: 50000,
      creditUsed: 5000
    };

    const availableCredit = dealerUser.creditLimit - dealerUser.creditUsed;
    expect(availableCredit).toBe(45000);

    // Purchase order exceeding available credit limit
    // Ordering large quantities of titan-chem-anchor
    const prod = getProductById('titan-chem-anchor');
    expect(prod).toBeDefined();
    const product = prod as Product;

    // Price list of titan-chem-anchor is 380, non-parametric
    const pricePerUnit = computePrice(product, {});
    expect(pricePerUnit).toBe(380);

    // Apply Bronze Dealer discount (DEALER_MULT = 0.82)
    const dealerPrice = Math.round(pricePerUnit * DEALER_MULT * 100) / 100;
    // Expected: 380 * 0.82 = 311.6
    expect(dealerPrice).toBe(311.6);

    // Quantity: 150 pcs (qualifies for >=144 tier with 0.82 multiplier)
    // breaks: [[1, 1], [12, 0.94], [48, 0.88], [144, 0.82]]
    const finalPrice = tierPrice(dealerPrice, 150, product.breaks);
    // Expected: Math.round(311.6 * 0.82 * 100) / 100 = 255.51
    expect(finalPrice).toBe(255.51);

    const orderTotal = finalPrice * 150;
    expect(orderTotal).toBe(38326.5); // 255.51 * 150 = 38326.5
    expect(orderTotal).toBeLessThan(availableCredit); // Exceeds: false (should pass checkout)

    // Purchase order that does exceed: 200 units
    const finalPrice200 = tierPrice(dealerPrice, 200, product.breaks);
    const orderTotalExceed = finalPrice200 * 200;
    expect(orderTotalExceed).toBe(51102); // 255.51 * 200 = 51102
    
    // Assertion: order total is greater than available credit
    const isExceeded = orderTotalExceed > availableCredit;
    expect(isExceeded).toBe(true); // Exceeds credit limit
  });
});

runAllTests();

