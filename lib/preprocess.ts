import fs from 'fs';
import path from 'path';
import { Product, Brand } from './products';

export interface RawSku {
  sku: string;
  name: string;
  brand: string;
  category_main: string;
  category_sub: string;
  family: string;
  spec_size?: string;
  length_inch?: string;
  material_coating?: string;
  list_price: string;
  qty_box?: number;
  qty_crate?: number;
  weight_kg_pc?: number;
  image_path?: string;
  general_net?: string;
  t2_net?: string;
  t3_net?: string;
  t4_net?: string;
  t5_net?: string;
  t6_net?: string;
}

export interface PreprocessedProduct extends Product {
  systems: string[];
  skus: RawSku[];
}

// Global cache for preprocessed products
let cachedProducts: PreprocessedProduct[] = [];

// Helper to slugify strings to clean IDs
function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Custom sort for M-sizes (e.g. M6 < M8 < M10)
function sortSizes(sizes: string[]): string[] {
  return [...sizes].sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''), 10);
    const numB = parseInt(b.replace(/\D/g, ''), 10);
    if (isNaN(numA) && isNaN(numB)) return a.localeCompare(b);
    if (isNaN(numA)) return 1;
    if (isNaN(numB)) return -1;
    return numA - numB;
  });
}

// Custom sort for lengths (numeric or fraction)
function sortLengths(lengths: string[]): string[] {
  return [...lengths].sort((a, b) => {
    const cleanNum = (str: string) => {
      const replaced = str.replace(/"/g, '').trim();
      if (replaced.includes('/')) {
        const parts = replaced.split('/');
        const whole = parseFloat(parts[0]);
        const fraction = parseFloat(parts[1] || '1');
        return isNaN(whole) ? 0 : whole / (fraction || 1);
      }
      return parseFloat(replaced);
    };
    const numA = cleanNum(a);
    const numB = cleanNum(b);
    if (isNaN(numA) && isNaN(numB)) return a.localeCompare(b);
    if (isNaN(numA)) return 1;
    if (isNaN(numB)) return -1;
    return numA - numB;
  });
}

// Map category names to router keys
export function mapCategory(categoryMain: string, categorySub: string, name: string): string {
  const main = (categoryMain || '').toLowerCase();
  const sub = (categorySub || '').toLowerCase();
  const n = (name || '').toLowerCase();

  if (sub.includes('ดอกสว่าน') || n.includes('ดอกสว่าน') || sub.includes('drill')) {
    return 'drills';
  }
  if (sub.includes('เครื่องมือ') || sub.includes('ดอกไขควง') || sub.includes('หัวบล็อก') || sub.includes('โฮลซอว์') || sub.includes('tool') || n.includes('โฮลซอ') || n.includes('หัวบล็อก') || n.includes('ดอกไขควง')) {
    return 'tools';
  }
  if (sub.includes('พุก') || sub.includes('แองเคอร์') || sub.includes('ปุ๊ก') || sub.includes('anchor') || n.includes('พุก') || n.includes('แองเคอร์') || n.includes('anchor') || n.includes('เคมีแองเคอร์')) {
    return 'anchors';
  }
  if (sub.includes('ปลายสว่าน') || sub.includes('เจาะตัวเอง') || sub.includes('sds') || sub.includes('self-drilling') || n.includes('ปลายสว่าน') || n.includes('เจาะตัวเอง') || n.includes('เจาะซับ')) {
    return 'sds';
  }
  if (sub.includes('น็อต') || sub.includes('แหวน') || sub.includes('nut') || sub.includes('washer') || n.includes('หัวน็อต') || n.includes('แหวนอีแปะ') || n.includes('แหวนสปริง') || n.includes('washer')) {
    return 'nuts';
  }
  if (sub.includes('สลักเกลียว') || sub.includes('bolt') || n.includes('สลักเกลียว') || n.includes('สกรูหัวหกเหลี่ยม') || n.includes('hex head bolt') || n.includes('hex bolt')) {
    return 'bolts';
  }
  if (sub.includes('สกรู') || sub.includes('screw') || n.includes('สกรู') || n.includes('screw')) {
    return 'screws';
  }

  // Fallback defaults based on category_main
  if (main.includes('หลังคา') || main.includes('roofing')) return 'sds';
  if (main.includes('ผนัง') || main.includes('wall')) return 'screws';
  if (main.includes('คอนกรีต') || main.includes('concrete')) return 'anchors';
  if (main.includes('อุปกรณ์เสริม') || main.includes('accessories')) return 'tools';
  return 'tools';
}

// Clean family name by stripping details
function cleanFamily(family: string, brand: string): string {
  let f = family || '';
  if (brand === 'TITAN') {
    f = f.replace(/^AT-\d+\s*/i, '');
    f = f.replace(/M\s*\d+\s*[xX\s*]\s*\d+/gi, '');
    f = f.replace(/\(\d+.*?\)/g, '');
    f = f.replace(/\bTITAN\b/g, '');
    f = f.trim();
  } else if (brand === 'LIO') {
    // LIO is generally clean
  } else {
    f = f.replace(/^[A-Z]+-\d+\s*[A-Z]*\s*/i, '');
    f = f.replace(/[- ](ขาว|ดำ|น้ำเงิน|แดง|เหลือง|เขียว)[- ]?/g, ' ');
    f = f.replace(/[- ]\d+(\.\d+)?(\"|m)?$/i, '');
    f = f.replace(/\(\d+.*?\)/g, '');
    f = f.trim();
  }
  return f || family;
}

// Extract standards from item name
function extractStandards(name: string): string[] {
  const standards: string[] = [];
  const regexes = [
    /DIN\s*\d+/gi,
    /ISO\s*\d+(-\d+)?/gi,
    /JIS\s*[A-Z]?\d+/gi,
    /AS\s*\d+(\.\d+)?/gi,
    /AS\s*3566/gi,
    /Class\s*\d+/gi,
    /ANSI\s*[A-Z\d\.]+/gi,
    /ASTM\s*[A-Z\d\.]+/gi
  ];
  for (const r of regexes) {
    const matches = name.match(r);
    if (matches) {
      matches.forEach(m => {
        let cleaned = m.toUpperCase().replace(/\s+/g, ' ');
        if (cleaned.startsWith('AS3566')) cleaned = 'AS 3566';
        if (!standards.includes(cleaned)) {
          standards.push(cleaned);
        }
      });
    }
  }
  // Default to general quality standard if none extracted
  if (standards.length === 0) {
    standards.push('ISO 9001');
  }
  return standards;
}

export function loadAndPreprocessData(): PreprocessedProduct[] {
  if (cachedProducts.length > 0) {
    return cachedProducts;
  }

  const dataDir = path.join(process.cwd(), 'public/data');
  const files = [
    { name: 'products_sug.json', defaultBrand: 'SUG' },
    { name: 'products_lio.json', defaultBrand: 'LIO' },
    { name: 'products_titan.json', defaultBrand: 'TITAN' },
    { name: 'products_other.json', defaultBrand: 'OTHER' },
  ];

  const rawSkus: RawSku[] = [];

  for (const file of files) {
    const filePath = path.join(dataDir, file.name);
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const list = JSON.parse(content);
        if (Array.isArray(list)) {
          list.forEach(item => {
            const brand = item.brand || file.defaultBrand;
            if (['SUG', 'TITAN', 'LIO', 'LOREX'].includes(brand)) {
              rawSkus.push({
                ...item,
                brand: brand
              });
            }
          });
        }
      } catch (err) {
        console.error(`Error loading or parsing ${file.name}:`, err);
      }
    }
  }

  // Group by family + brand + category_sub
  const groups: Record<string, RawSku[]> = {};
  for (const sku of rawSkus) {
    const rawFamily = sku.family || sku.category_sub || sku.name || 'General Product';
    const cleanedFam = cleanFamily(rawFamily, sku.brand);
    const key = `${cleanedFam}::${sku.brand}::${sku.category_sub || ''}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(sku);
  }

  const products: PreprocessedProduct[] = [];
  const idSet = new Set<string>();

  for (const items of Object.values(groups)) {
    const first = items[0];
    const brand = first.brand as Brand;
    const rawFamily = first.family || first.category_sub || first.name || 'General Product';
    const th = cleanFamily(rawFamily, brand);
    
    // Generate clean slug ID
    let baseId = slugify(`${brand}-${th}`);
    if (!baseId) baseId = 'product-item';
    let id = baseId;
    let counter = 1;
    while (idSet.has(id)) {
      id = `${baseId}-${counter++}`;
    }
    idSet.add(id);

    const cat = mapCategory(first.category_main, first.category_sub, first.name);
    
    // Collate attributes
    const sizeSet = new Set<string>();
    const lengthSet = new Set<string>();
    const finishSet = new Set<string>();

    for (const item of items) {
      if (item.spec_size) sizeSet.add(item.spec_size);
      if (item.length_inch) lengthSet.add(item.length_inch);
      if (item.material_coating) finishSet.add(item.material_coating);
    }

    const sizes = sortSizes(Array.from(sizeSet));
    const lengths = sortLengths(Array.from(lengthSet));
    const finishes = Array.from(finishSet).sort();

    const isParametric = sizes.length > 1 || lengths.length > 1 || finishes.length > 1;

    // Standardize standards list
    const standardsSet = new Set<string>();
    for (const item of items) {
      const stdList = extractStandards(item.name);
      stdList.forEach(s => standardsSet.add(s));
    }
    const standards = Array.from(standardsSet);

    // Choose image or placeholder
    let img = first.image_path || null;
    if (!img) {
      if (cat === 'drills' || cat === 'tools') {
        img = '/product-drill-blue.png';
      } else if (cat === 'sds') {
        img = '/product-drill-orange.png';
      } else {
        img = null;
      }
    }

    // Default list price: find minimum list price among SKUs
    const priceList = items.reduce((min, item) => {
      const p = parseFloat(item.list_price);
      if (isNaN(p) || p <= 0) return min;
      return min === 0 ? p : Math.min(min, p);
    }, 0);

    // Default breaks config
    const breaks: [number, number][] = brand === 'TITAN'
      ? [[1, 1], [50, 0.95], [200, 0.88], [1000, 0.82]]
      : [[1, 1], [100, 0.92], [500, 0.85], [2000, 0.78]];

    const catNames: Record<string, string> = {
      bolts: 'Bolt',
      screws: 'Screw',
      sds: 'Self-Drilling Screw',
      nuts: 'Nut / Washer',
      anchors: 'Anchor',
      drills: 'Drill Bit',
      tools: 'Tool Accessory'
    };
    const catEn = catNames[cat] || 'Fastener';
    const cleanEn = th.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, ' ').trim();
    const en = cleanEn ? `${brand} ${cleanEn} ${catEn}`.replace(/\s+/g, ' ').trim() : `${brand} ${catEn} (${first.category_sub || 'Fasteners'})`.trim();

    // Map product to work systems based on category and name content
    const systems: string[] = [];
    if (cat === 'sds') {
      systems.push('roofing', 'wall');
    } else if (cat === 'screws') {
      systems.push('multipurpose', 'wall');
    } else if (cat === 'bolts') {
      systems.push('multipurpose', 'concrete');
    } else if (cat === 'anchors') {
      systems.push('concrete');
    } else if (cat === 'nuts') {
      systems.push('accessories');
    } else if (cat === 'drills') {
      systems.push('accessories');
      if (th.toLowerCase().includes('คอนกรีต') || en.toLowerCase().includes('concrete')) {
        systems.push('concrete');
      }
    } else if (cat === 'tools') {
      systems.push('accessories');
      if (th.toLowerCase().includes('หลังคา') || th.toLowerCase().includes('โฮลซอ') || en.toLowerCase().includes('roofing') || en.toLowerCase().includes('holesaw')) {
        systems.push('roofing');
      }
    }

    const product: PreprocessedProduct = {
      id,
      cat,
      brand,
      seed: Math.abs(id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)),
      th,
      en,
      standards,
      img,
      parametric: isParametric,
      breaks,
      lead: { stock: 'พร้อมส่ง', days: 0 },
      skus: items,
      systems,
    };

    if (isParametric) {
      product.attrs = {
        size: sizes.length > 0 ? sizes : undefined,
        length: lengths.length > 0 ? lengths : undefined,
        finish: finishes.length > 0 ? finishes : undefined,
      };
    } else {
      product.sku = first.sku || id.toUpperCase();
      product.priceList = priceList || 10;
      if (sizes.length > 0) {
        product.hasSizes = sizes;
      }
    }

    products.push(product);
  }

  cachedProducts = products;
  return products;
}

// Helper to resolve specific tier price
export function getTierPrice(sku: RawSku, tier?: string): number {
  if (!sku) return 0;
  const listPrice = parseFloat(sku.list_price) || 0;
  if (!tier) return listPrice;

  switch (tier.toLowerCase()) {
    case 'bronze':
      return sku.t2_net ? parseFloat(sku.t2_net) : (parseFloat(sku.general_net || '') || listPrice);
    case 'silver':
      return sku.t3_net ? parseFloat(sku.t3_net) : (parseFloat(sku.general_net || '') || listPrice);
    case 'gold':
      return sku.t4_net ? parseFloat(sku.t4_net) : (parseFloat(sku.general_net || '') || listPrice);
    case 'platinum':
      return sku.t5_net ? parseFloat(sku.t5_net) : (sku.t6_net ? parseFloat(sku.t6_net) : (parseFloat(sku.general_net || '') || listPrice));
    default:
      return listPrice;
  }
}
