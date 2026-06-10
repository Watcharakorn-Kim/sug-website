// ============================================================
// SUG FASTENER — Complete Product Database & Helpers (TS)
// ============================================================

export type Brand = 'SUG' | 'TITAN';

export interface ProductSpec {
  key: string;
  value: string;
}

export interface ProductAttrs {
  size?: string[];
  length?: string[];
  grade?: string[];
  finish?: string[];
  [key: string]: string[] | undefined;
}

export interface Product {
  id: string;
  cat: string;
  brand: Brand;
  seed: number;
  th: string;
  en: string;
  standards: string[];
  img: string | null;
  parametric: boolean;
  attrs?: ProductAttrs;
  hasSizes?: string[]; // for flat products with size options
  sku?: string;        // for flat products
  priceList?: number;  // for flat products base list price
  base?: number;       // for parametric products base price
  breaks: [number, number][]; // [qty, multiplier]
  lead: {
    stock: string;
    days: number;
  };
  premium?: boolean;
  specTh?: string;
  specEn?: string;
}

export interface Category {
  key: string;
  th: string;
  en: string;
  parametric: boolean;
}

export interface WorkSystem {
  key: string;
  th: string;
  en: string;
  tagTh: string;
  tagEn: string;
  std: string;
  img: string | null;
  blurbTh: string;
  blurbEn: string;
  products: string[]; // product IDs
}

export interface CrossRefEntry {
  competitor_brand: string;
  competitor_sku: string;
  competitor_name: string;
  sug_product_id: string;
  match_level: 'exact' | 'equivalent' | 'similar';
  notes_th: string;
  notes_en: string;
}

// ── Branches for stock-by-province ──
export const BRANCHES = [
  { code: 'SPK', th: 'สมุทรปราการ (คลังหลัก)', en: 'Samut Prakan (HQ)' },
  { code: 'BKK', th: 'กรุงเทพฯ บางนา', en: 'Bangkok Bangna' },
  { code: 'CNX', th: 'เชียงใหม่', en: 'Chiang Mai' },
  { code: 'KKC', th: 'ขอนแก่น', en: 'Khon Kaen' },
  { code: 'HDY', th: 'หาดใหญ่ สงขลา', en: 'Hat Yai' },
];

export const CATEGORIES: Category[] = [
  { key: 'bolts',   th: 'สลักเกลียว',        en: 'Bolts',                  parametric: true },
  { key: 'screws',  th: 'สกรู',              en: 'Screws',                 parametric: true },
  { key: 'sds',     th: 'สกรูเจาะตัวเอง',     en: 'Self-drilling Screws',   parametric: true },
  { key: 'nuts',    th: 'น็อตและแหวน',        en: 'Nuts & Washers',         parametric: true },
  { key: 'anchors', th: 'พุกและแองเคอร์',     en: 'Anchors',                parametric: true },
  { key: 'drills',  th: 'ดอกสว่าน',          en: 'Drill Bits',             parametric: false },
  { key: 'tools',   th: 'เครื่องมือ',         en: 'Power Tool Accessories', parametric: false },
];

export const PRODUCTS: Product[] = [
  {
    id: 'hex-bolt-933', cat: 'bolts', brand: 'SUG', seed: 11,
    th: 'สลักเกลียวหัวหกเหลี่ยม (เต็มเกลียว)', en: 'Hex Head Bolt — Fully Threaded',
    standards: ['DIN 933', 'ISO 4017'], img: null,
    parametric: true,
    attrs: {
      size:   ['M6', 'M8', 'M10', 'M12', 'M16', 'M20'],
      length: ['20', '25', '30', '40', '50', '60', '80', '100'],
      grade:  ['8.8', '10.9', '12.9'],
      finish: ['ชุบซิงค์ขาว / Zinc', 'กัลวาไนซ์ / HDG', 'สเตนเลส A2', 'ดำรมดำ / Plain'],
    },
    base: 6,
    breaks: [[1, 1], [100, 0.92], [500, 0.85], [2000, 0.78]],
    lead: { stock: 'พร้อมส่ง', days: 0 },
  },
  {
    id: 'hex-bolt-931', cat: 'bolts', brand: 'SUG', seed: 12,
    th: 'สลักเกลียวหัวหกเหลี่ยม (เกลียวบางส่วน)', en: 'Hex Bolt — Partially Threaded',
    standards: ['DIN 931', 'ISO 4014'], img: null, parametric: true,
    attrs: {
      size:   ['M8', 'M10', 'M12', 'M16', 'M20', 'M24'],
      length: ['50', '60', '80', '100', '120', '150'],
      grade:  ['8.8', '10.9'],
      finish: ['ชุบซิงค์ขาว / Zinc', 'กัลวาไนซ์ / HDG', 'สเตนเลส A2'],
    },
    base: 9, breaks: [[1, 1], [100, 0.93], [500, 0.86], [2000, 0.8]],
    lead: { stock: 'พร้อมส่ง', days: 0 },
  },
  {
    id: 'titan-bolt-129', cat: 'bolts', brand: 'TITAN', seed: 21,
    th: 'TITAN สลักเกลียวแรงดึงสูง เกรด 12.9', en: 'TITAN High-Tensile Bolt — Grade 12.9',
    standards: ['ISO 898-1', 'DIN 912'], img: null, parametric: true,
    attrs: {
      size:   ['M10', 'M12', 'M16', 'M20'],
      length: ['40', '50', '60', '80', '100'],
      grade:  ['12.9'],
      finish: ['ดำรมดำ / Black Oxide', 'ฟอสเฟต / Phosphate'],
    },
    base: 28, breaks: [[1, 1], [50, 0.95], [200, 0.88], [1000, 0.82]],
    lead: { stock: 'พร้อมส่ง', days: 0 }, premium: true,
  },
  {
    id: 'machine-screw', cat: 'screws', brand: 'SUG', seed: 31,
    th: 'สกรูหัวกลมแฉก (เมตริก)', en: 'Pan Head Machine Screw — Phillips',
    standards: ['DIN 7985', 'ISO 7045'], img: null, parametric: true,
    attrs: {
      size:   ['M3', 'M4', 'M5', 'M6', 'M8'],
      length: ['8', '10', '12', '16', '20', '25', '30'],
      grade:  ['4.8', 'A2 SS'],
      finish: ['ชุบซิงค์ขาว / Zinc', 'สเตนเลส A2', 'นิกเกิล / Nickel'],
    },
    base: 1.2, breaks: [[1, 1], [200, 0.9], [1000, 0.82], [5000, 0.72]],
    lead: { stock: 'พร้อมส่ง', days: 0 },
  },
  {
    id: 'wood-screw', cat: 'screws', brand: 'SUG', seed: 32,
    th: 'สกรูเกลียวปล่อยหัวเตเปอร์', en: 'Countersunk Wood Screw',
    standards: ['DIN 7505'], img: null, parametric: true,
    attrs: {
      size:   ['3.5', '4.0', '4.5', '5.0', '6.0'],
      length: ['16', '25', '30', '40', '50', '60', '70'],
      grade:  ['เหล็กชุบ / Steel'],
      finish: ['ชุบซิงค์เหลือง / Yellow Zinc', 'ดำ / Black Phos'],
    },
    base: 0.6, breaks: [[1, 1], [500, 0.88], [2000, 0.78], [10000, 0.68]],
    lead: { stock: 'พร้อมส่ง', days: 0 },
  },
  {
    id: 'sds-screw', cat: 'sds', brand: 'SUG', seed: 41,
    th: 'สกรูเจาะตัวเอง หัวหกเหลี่ยม', en: 'Hex Washer Self-Drilling Screw',
    standards: ['DIN 7504 K', 'JIS B1125'], img: '/product-drill-orange.png', parametric: true,
    attrs: {
      size:   ['#10', '#12', '#14'],
      length: ['16', '20', '25', '32', '45', '60', '85'],
      grade:  ['C1022 ชุบ', 'สเตนเลส 410'],
      finish: ['ชุบซิงค์ / Zinc', 'ทาสี / Painted', 'พร้อม EPDM'],
    },
    base: 1.8, breaks: [[1, 1], [250, 0.9], [1000, 0.8], [5000, 0.7]],
    lead: { stock: 'พร้อมส่ง', days: 0 },
  },
  {
    id: 'hex-nut', cat: 'nuts', brand: 'SUG', seed: 51,
    th: 'น็อตหัวหกเหลี่ยม', en: 'Hex Nut',
    standards: ['DIN 934', 'ISO 4032'], img: null, parametric: true,
    attrs: {
      size:   ['M6', 'M8', 'M10', 'M12', 'M16', 'M20', 'M24'],
      grade:  ['คลาส 8', 'สเตนเลส A2'],
      finish: ['ชุบซิงค์ขาว / Zinc', 'กัลวาไนซ์ / HDG', 'สเตนเลส A2'],
    },
    base: 2, breaks: [[1, 1], [200, 0.9], [1000, 0.8], [5000, 0.72]],
    lead: { stock: 'พร้อมส่ง', days: 0 },
  },
  {
    id: 'flat-washer', cat: 'nuts', brand: 'SUG', seed: 52,
    th: 'แหวนอีแปะ (แหวนแบน)', en: 'Flat Washer',
    standards: ['DIN 125', 'ISO 7089'], img: null, parametric: true,
    attrs: {
      size:   ['M6', 'M8', 'M10', 'M12', 'M16', 'M20'],
      grade:  ['เหล็กชุบ', 'สเตนเลส A2'],
      finish: ['ชุบซิงค์ขาว / Zinc', 'สเตนเลส A2'],
    },
    base: 0.8, breaks: [[1, 1], [500, 0.85], [2000, 0.75], [10000, 0.65]],
    lead: { stock: 'พร้อมส่ง', days: 0 },
  },
  {
    id: 'wedge-anchor', cat: 'anchors', brand: 'SUG', seed: 61,
    th: 'แองเคอร์ลิ่ม (สลักถ่างคอนกรีต)', en: 'Wedge Anchor',
    standards: ['ETA Option 1'], img: null, parametric: true,
    attrs: {
      size:   ['M8', 'M10', 'M12', 'M16'],
      length: ['65', '80', '100', '120', '150'],
      grade:  ['เหล็กชุบ', 'สเตนเลส A4'],
      finish: ['ชุบซิงค์ / Zinc', 'สเตนเลส A4'],
    },
    base: 12, breaks: [[1, 1], [50, 0.93], [200, 0.85], [1000, 0.78]],
    lead: { stock: 'พร้อมส่ง', days: 0 },
  },
  {
    id: 'titan-chem-anchor', cat: 'anchors', brand: 'TITAN', seed: 62,
    th: 'TITAN เคมีแองเคอร์ วินิลเอสเตอร์', en: 'TITAN Vinyl Ester Chemical Anchor',
    standards: ['ETA Option 1', 'Seismic C2'], img: null, parametric: false,
    sku: 'TT-CHEM-VE-400', priceList: 380,
    specTh: 'หลอดเคมี 400 มล. สำหรับงานยึดเหล็กเสริมและสตั๊ดในคอนกรีตแตกร้าว ทนแรงแผ่นดินไหว',
    specEn: '400 ml cartridge for rebar and stud anchoring in cracked concrete. Seismic-qualified.',
    breaks: [[1, 1], [12, 0.94], [48, 0.88], [144, 0.82]],
    lead: { stock: 'พร้อมส่ง', days: 0 }, premium: true,
  },
  {
    id: 'hss-cobalt-drill', cat: 'drills', brand: 'SUG', seed: 71,
    th: 'ดอกสว่านโคบอลต์ HSS-Co', en: 'HSS-Cobalt Twist Drill',
    standards: ['DIN 338', 'M35'], img: '/product-drill-orange.png', parametric: false,
    sku: 'TX-HSS-CO', priceList: 82, hasSizes: ['3.0', '4.0', '5.0', '6.5', '8.0', '10.0'],
    specTh: 'ผสมโคบอลต์ 5% (M35) ปลายตัด 135° สปลิทพอยต์ สำหรับสเตนเลสและเหล็กโครงสร้าง',
    specEn: '5% cobalt (M35), 135° split point. For stainless and structural steel.',
    breaks: [[1, 1], [10, 0.95], [50, 0.88], [200, 0.8]],
    lead: { stock: 'พร้อมส่ง', days: 0 },
  },
  {
    id: 'sds-concrete-drill', cat: 'drills', brand: 'SUG', seed: 72,
    th: 'ดอกสว่านโรตารี่ SDS-Plus เจาะคอนกรีต', en: 'SDS-Plus Concrete Drill',
    standards: ['ISO 5468'], img: '/product-drill-blue.png', parametric: false,
    sku: 'TX-SDS-PL', priceList: 145, hasSizes: ['6', '8', '10', '12', '16'],
    specTh: 'ปลายคาร์ไบด์ 4 ร่อง ระบายฝุ่นเร็ว สำหรับเจาะคอนกรีตและหินแกรนิต',
    specEn: '4-flute carbide tip, fast dust evacuation. For concrete and granite.',
    breaks: [[1, 1], [10, 0.93], [50, 0.85], [200, 0.77]],
    lead: { stock: 'พร้อมส่ง', days: 0 },
  },
  {
    id: 'titan-drill-m42', cat: 'tools', brand: 'TITAN', seed: 81,
    th: 'TITAN ดอกสว่านบิตหกเหลี่ยม M42', en: 'TITAN M42 Impact Drill Bit',
    standards: ['M42', 'TiAlN'], img: '/product-drill-blue.png', parametric: false,
    sku: 'TT-DRL-M42', priceList: 220, hasSizes: ['4.0', '5.0', '6.0', '8.0'],
    specTh: 'เคลือบ TiAlN ก้านหกเหลี่ยม 1/4 นิ้ว สำหรับสว่านกระแทกไร้สาย งานหนักต่อเนื่อง',
    specEn: 'TiAlN coated, 1/4" hex shank for cordless impact drivers. Heavy continuous use.',
    breaks: [[1, 1], [10, 0.95], [50, 0.9], [200, 0.84]], lead: { stock: 'พร้อมส่ง', days: 0 },
    premium: true,
  },
  {
    id: 'bi-metal-holesaw', cat: 'tools', brand: 'SUG', seed: 82,
    th: 'โฮลซอว์ไบเมทัล M42', en: 'Bi-Metal Hole Saw M42',
    standards: ['M42 HSS'], img: null, parametric: false,
    sku: 'TX-HOLE-BM', priceList: 165, hasSizes: ['19', '22', '29', '35', '44', '51', '68'],
    specTh: 'ฟันไบเมทัล M42 ทนความร้อน สำหรับเจาะเหล็กแผ่น สเตนเลส และไม้',
    specEn: 'M42 bi-metal teeth. For sheet steel, stainless, and wood.',
    breaks: [[1, 1], [5, 0.95], [25, 0.88], [100, 0.8]], lead: { stock: 'สั่งผลิต', days: 5 },
  },
];

export const SYSTEMS: WorkSystem[] = [
  { key: 'roofing', th: 'ระบบหลังคา', en: 'Roofing System',
    tagTh: 'กระเบื้อง · เมทัลชีต · Bi-Metal 304', tagEn: 'Tile · metal sheet · Bi-Metal 304',
    std: 'AS3566 · SALT-SPRAY 1000H', img: '/product-drill-orange.png',
    blurbTh: 'สกรูยึดเมทัลชีตและกระเบื้อง พร้อมดอกและโฮลซอว์สำหรับงานหลังคา',
    blurbEn: 'Self-drilling roofing screws with the drills and hole saws to fit them.',
    products: ['sds-screw', 'bi-metal-holesaw', 'titan-drill-m42', 'hss-cobalt-drill'] },
  { key: 'multipurpose', th: 'งานอเนกประสงค์', en: 'Multipurpose',
    tagTh: 'แปะแนงเหล็ก · WAVE DOME', tagEn: 'Steel batten · WAVE DOME',
    std: 'T-17 · SD POINT', img: null,
    blurbTh: 'สกรูและสลักเกลียวอเนกประสงค์สำหรับงานไม้ เหล็ก และงานทั่วไป',
    blurbEn: 'All-round screws and bolts for timber, steel, and general fixing.',
    products: ['wood-screw', 'machine-screw', 'hex-bolt-933'] },
  { key: 'wall', th: 'ผนัง / ไฟเบอร์ซีเมนต์', en: 'Wall / Fibre-cement',
    tagTh: 'CSH · RIB · FMC · ไม้ฝา', tagEn: 'CSH · RIB · FMC · plank',
    std: 'DIN 7504', img: null,
    blurbTh: 'สกรูยึดแผ่นไฟเบอร์ซีเมนต์ ไม้ฝา และผนังเบา',
    blurbEn: 'Screws for fibre-cement board, fascia plank, and lightweight walls.',
    products: ['wood-screw', 'sds-screw', 'machine-screw'] },
  { key: 'concrete', th: 'งานคอนกรีต', en: 'Concrete',
    tagTh: 'หัวเหลี่ยม · FH · PH', tagEn: 'Hex · FH · PH',
    std: 'ETA · DIN', img: null,
    blurbTh: 'พุก แองเคอร์ และเคมีภัณฑ์ยึดในคอนกรีต พร้อมดอกเจาะ',
    blurbEn: 'Anchors, chemical fixings, and the drills to set them in concrete.',
    products: ['wedge-anchor', 'titan-chem-anchor', 'sds-concrete-drill', 'hex-bolt-931'] },
  { key: 'accessories', th: 'อุปกรณ์เสริม', en: 'Accessories',
    tagTh: 'EPDM · รางน้ำ · แป · เครื่องมือ', tagEn: 'EPDM · gutter · purlin · tools',
    std: 'MADE-TO-SPEC', img: null,
    blurbTh: 'แหวน น็อต ดอกสว่าน และเครื่องมือที่ใช้ส่งมอบงานให้เสร็จสมบูรณ์',
    blurbEn: 'Washers, nuts, drill bits, and tools to finish the job.',
    products: ['hss-cobalt-drill', 'sds-concrete-drill', 'titan-drill-m42', 'bi-metal-holesaw', 'flat-washer', 'hex-nut'] },
];

export const CROSS_REF_DB: CrossRefEntry[] = [
  { competitor_brand: 'Hilti', competitor_sku: 'S-WH 15', competitor_name: 'Hilti Hex washer head screw', sug_product_id: 'sds-screw', match_level: 'exact', notes_th: 'สกรูปลายสว่านหัวหกเหลี่ยมเทียบเท่า', notes_en: 'Hex self-drilling screw equivalent.' },
  { competitor_brand: 'Hilti', competitor_sku: 'HST3 M10', competitor_name: 'Hilti Anchor bolt HST3', sug_product_id: 'wedge-anchor', match_level: 'equivalent', notes_th: 'ETA certified แองเคอร์ลิ่มเทียบเท่า', notes_en: 'ETA certified equivalent wedge anchor.' },
  { competitor_brand: 'Fischer', competitor_sku: 'FPF II WT', competitor_name: 'Fischer wood screw', sug_product_id: 'wood-screw', match_level: 'equivalent', notes_th: 'สกรูยึดไม้เตเปอร์เทียบเท่า', notes_en: 'Wood screw equivalent.' },
  { competitor_brand: 'Fischer', competitor_sku: 'FAZ II 10/10', competitor_name: 'Fischer wedge anchor', sug_product_id: 'wedge-anchor', match_level: 'equivalent', notes_th: 'แองเคอร์คอนกรีตลิ่มเทียบเท่า', notes_en: 'Equivalent structural wedge anchor.' },
  { competitor_brand: 'Würth', competitor_sku: 'ASSY-EPDM-304', competitor_name: 'Würth self-drilling screw', sug_product_id: 'sds-screw', match_level: 'exact', notes_th: 'ปลายสว่านพร้อม EPDM เทียบเท่า', notes_en: 'Self-drilling screw with EPDM.' },
  { competitor_brand: 'Würth', competitor_sku: 'HBS 931 8.8', competitor_name: 'Würth Hex bolt partial thread', sug_product_id: 'hex-bolt-931', match_level: 'exact', notes_th: 'DIN 931 เกรด 8.8 เทียบเท่าตรงรุ่น', notes_en: 'DIN 931 grade 8.8 hex bolt.' },
  { competitor_brand: 'Würth', competitor_sku: 'AMO LT 7.5', competitor_name: 'Würth concrete anchor', sug_product_id: 'wedge-anchor', match_level: 'equivalent', notes_th: 'แองเคอร์สำหรับคอนกรีตเทียบเท่า', notes_en: 'Concrete anchor equivalent.' },
  { competitor_brand: 'Bossard', competitor_sku: 'BN8890', competitor_name: 'Bossard pan head machine screw', sug_product_id: 'machine-screw', match_level: 'equivalent', notes_th: 'สกรูหัวกลมแฉกเมตริกเทียบเท่า', notes_en: 'Pan head machine screw equivalent.' },
  { competitor_brand: 'Bossard', competitor_sku: 'BN33', competitor_name: 'Bossard hex bolt DIN 931', sug_product_id: 'hex-bolt-931', match_level: 'exact', notes_th: 'DIN 931 หกเหลี่ยมเกลียวบางส่วนเทียบเท่า', notes_en: 'DIN 931 hex bolt partial thread.' },
  { competitor_brand: 'Bossard', competitor_sku: 'BN5', competitor_name: 'Bossard fully threaded hex bolt', sug_product_id: 'hex-bolt-933', match_level: 'exact', notes_th: 'DIN 933 หกเหลี่ยมเต็มเกลียวเทียบเท่า', notes_en: 'DIN 933 hex bolt fully threaded.' },
];

export const DEALER_MULT = 0.82;

// ── Pricing multipliers ──
const SIZE_MULT: Record<string, number> = {
  M3: 0.4, M4: 0.5, M5: 0.6, M6: 1, M8: 1.5, M10: 2.2, M12: 3.2, M16: 5.5, M20: 8.5, M24: 13,
  '#10': 1, '#12': 1.2, '#14': 1.5, '3.0': 0.5, '3.5': 0.6, '4.0': 0.7, '4.5': 0.8, '5.0': 0.9, '6.0': 1.2
};
const GRADE_MULT: Record<string, number> = {
  '4.8': 1, '8.8': 1, '10.9': 1.35, '12.9': 1.8, 'คลาส 8': 1,
  'A2 SS': 1.9, 'สเตนเลส A2': 1.9, 'สเตนเลส A4': 2.6, 'สเตนเลส 410': 1.7,
  'เหล็กชุบ / Steel': 1, 'เหล็กชุบ': 1, 'C1022 ชุบ': 1
};

const finishMult = (f?: string): number => {
  if (!f) return 1;
  if (f.includes('A4')) return 1.4;
  if (f.includes('A2') || f.includes('สเตนเลส')) return 1.25;
  if (f.includes('HDG') || f.includes('กัลวาไนซ์')) return 1.3;
  if (f.includes('EPDM')) return 1.2;
  return 1;
};

// ── Helpers ──

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}

export function getCategoryByKey(key: string): Category | undefined {
  return CATEGORIES.find(c => c.key === key);
}

export function systemFor(key: string): WorkSystem | null {
  return SYSTEMS.find(s => s.key === key) || null;
}

export function bySystem(key: string): Product[] {
  const s = systemFor(key);
  if (!s) return [];
  return s.products.map(id => getProductById(id)).filter((p): p is Product => !!p);
}

export function computePrice(prod: Product, sel: { size?: string | null; length?: string | null; grade?: string | null; finish?: string | null }): number {
  if (!prod.parametric) return prod.priceList || 0;
  let price = prod.base || 0;
  if (sel.size && SIZE_MULT[sel.size]) price *= SIZE_MULT[sel.size];
  if (sel.length) price *= (1 + (parseInt(sel.length, 10) || 20) / 120);
  if (sel.grade && GRADE_MULT[sel.grade]) price *= GRADE_MULT[sel.grade];
  if (sel.finish) price *= finishMult(sel.finish);
  return Math.max(0.3, Math.round(price * 10) / 10);
}

export function buildSku(prod: Product, sel: { size?: string | null; length?: string | null; grade?: string | null; finish?: string | null }): string {
  if (!prod.parametric) return prod.sku || prod.id.toUpperCase();
  const parts = [prod.id.toUpperCase().replace(/-/g, '')];
  if (sel.size) parts.push(String(sel.size).replace('#', 'N'));
  if (sel.length) parts.push(String(sel.length));
  if (sel.grade) parts.push(String(sel.grade).replace(/[^0-9A-Za-z]/g, '').slice(0, 4));
  if (sel.finish) parts.push(sel.finish.includes('A2') ? 'A2' : sel.finish.includes('A4') ? 'A4' : sel.finish.includes('HDG') || sel.finish.includes('กัลวา') ? 'HDG' : 'ZN');
  return parts.join('-');
}

// [pcsPerBox, boxesPerCrate]
const PACK: Record<string, [number, number]> = {
  'machine-screw': [200, 20], 'wood-screw': [200, 20],
  'sds-screw': [100, 12], 'flat-washer': [500, 10], 'hex-nut': [200, 10],
  'hss-cobalt-drill': [10, 10], 'sds-concrete-drill': [10, 10],
  'titan-drill-m42': [10, 10], 'bi-metal-holesaw': [1, 12],
  'titan-chem-anchor': [1, 12],
};

const PACK_BY_CAT: Record<string, [number, number]> = {
  bolts: [100, 10], screws: [100, 10], sds: [100, 12], nuts: [200, 10], anchors: [25, 8], drills: [10, 10], tools: [5, 10]
};

export function packFor(prod: Product) {
  const o = PACK[prod.id] || PACK_BY_CAT[prod.cat] || [100, 10];
  return { boxPcs: o[0], boxesPerCrate: o[1], cratePcs: o[0] * o[1] };
}

export const UNIT_DEFS = [
  { key: 'pc',    th: 'ตัว',   en: 'pcs'    },
  { key: 'box',   th: 'กล่อง', en: 'boxes'  },
  { key: 'crate', th: 'ลัง',   en: 'crates' },
];

export function unitToPcs(prod: Product, unit: string, n: number): number {
  const pk = packFor(prod);
  if (unit === 'box') return n * pk.boxPcs;
  if (unit === 'crate') return n * pk.cratePcs;
  return n;
}

const CROSS_SELL: Record<string, string[]> = {
  'sds-screw':        ['sds-concrete-drill', 'bi-metal-holesaw', 'titan-drill-m42'],
  'wood-screw':       ['hss-cobalt-drill', 'machine-screw'],
  'machine-screw':    ['hex-nut', 'flat-washer', 'hss-cobalt-drill'],
  'hex-bolt-933':     ['hex-nut', 'flat-washer', 'wedge-anchor'],
  'hex-bolt-931':     ['hex-nut', 'flat-washer'],
  'titan-bolt-129':   ['hex-nut', 'flat-washer', 'titan-drill-m42'],
  'hex-nut':          ['flat-washer', 'hex-bolt-933'],
  'flat-washer':      ['hex-nut', 'hex-bolt-933'],
  'wedge-anchor':     ['sds-concrete-drill', 'hex-nut', 'titan-chem-anchor'],
  'titan-chem-anchor':['sds-concrete-drill', 'wedge-anchor'],
  'hss-cobalt-drill': ['sds-screw', 'bi-metal-holesaw'],
  'sds-concrete-drill':['wedge-anchor', 'titan-chem-anchor', 'sds-screw'],
  'titan-drill-m42':  ['sds-screw', 'bi-metal-holesaw'],
  'bi-metal-holesaw': ['sds-concrete-drill', 'sds-screw'],
};

export function relatedFor(prod: Product): Product[] {
  let ids = CROSS_SELL[prod.id] || [];
  if (ids.length < 3) {
    const extra = PRODUCTS.filter(x => x.cat === prod.cat && x.id !== prod.id).map(x => x.id);
    ids = [...new Set([...ids, ...extra])];
  }
  return ids.map(id => getProductById(id)).filter((p): p is Product => !!p).slice(0, 4);
}

export function tierPrice(unit: number, qty: number, breaks: [number, number][]): number {
  let mult = 1;
  for (const [minQty, m] of breaks) {
    if (qty >= minQty) mult = m;
  }
  return Math.round(unit * mult * 100) / 100;
}

export function stockFor(seed: number) {
  return BRANCHES.map((b, i) => {
    const n = Math.abs(Math.round(Math.sin(seed * 9.7 + i * 3.3) * 4200));
    return { ...b, qty: n };
  });
}

export function fmt(n: number): string {
  return '฿' + Number(n).toLocaleString('th-TH', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
}

export function searchProducts(q: string): Product[] {
  if (!q.trim()) return [];
  const lower = q.toLowerCase();
  return PRODUCTS.filter(p =>
    p.th.toLowerCase().includes(lower) ||
    p.en.toLowerCase().includes(lower) ||
    p.id.toLowerCase().includes(lower) ||
    (p.sku && p.sku.toLowerCase().includes(lower)) ||
    p.standards.some(s => s.toLowerCase().includes(lower))
  );
}

export function crossRefSearch(query: string): CrossRefEntry[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return CROSS_REF_DB.filter(r =>
    r.competitor_sku.toLowerCase().includes(q) ||
    r.competitor_brand.toLowerCase().includes(q) ||
    r.competitor_name.toLowerCase().includes(q)
  );
}
