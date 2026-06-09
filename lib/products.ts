// ============================================================
// SUG FASTENER — Complete Product Data (Extended)
// ============================================================

export type Brand = 'SUG' | 'TITAN';
export type System =
  | 'roofing' | 'multipurpose' | 'wall' | 'concrete' | 'accessories'
  | 'general' | 'electrical' | 'stainless' | 'agri' | 'plumbing' | 'fasteners';

export interface ProductSpec { key: string; value: string; }
export interface ProductVariant {
  sku: string; size: string;
  length_mm?: number; diameter_mm?: number;
  pack_qty: number; price_from?: number; in_stock: boolean;
}
export interface Product {
  id: string; brand: Brand; system: System; sku_prefix: string;
  name_th: string; name_en: string; desc_th: string; desc_en: string;
  standards: string[]; specs: ProductSpec[]; variants: ProductVariant[];
  image?: string; isNew?: boolean; isBestSeller?: boolean;
  crossRef?: { brand: string; sku: string }[];
}
export interface Category {
  key: System; brand: Brand;
  name_th: string; name_en: string; desc_th: string; desc_en: string;
  standards: string[]; color: string; products: Product[];
}

export const PRODUCTS: Product[] = [
  // ── SUG ROOFING ─────────────────────────────────────────────────────────
  {
    id: 'sug-bimetal-hex',
    brand: 'SUG', system: 'roofing', sku_prefix: 'AS3566',
    name_th: 'สลักเกลียวหัวหกเหลี่ยม Bi-Metal 304',
    name_en: 'Bi-Metal 304 Self-drilling Screw (Hex Head)',
    desc_th: 'สกรูปลายสว่าน Bi-Metal 304 หัวหกเหลี่ยม EPDM washer ใช้ยึดกระเบื้องโลหะ เมทัลชีต เหล็กรูปพรรณ ทนเกลือสเปรย์ >1,000 ชั่วโมง มาตรฐาน AS3566 Class 3',
    desc_en: 'Bi-Metal 304 self-drilling hex head screw with EPDM washer. Fastens metal sheet, tiles, purlins. Salt-spray >1,000h. AS3566 Class 3.',
    standards: ['AS3566 Class 3', 'SALT-SPRAY 1000H', 'ISO 4762'],
    specs: [
      { key: 'เกรดสแตนเลส', value: 'SUS304' },
      { key: 'หัวสกรู', value: 'Hex Washer Head + EPDM' },
      { key: 'ปลายสว่าน', value: 'Bi-Metal (ตัดเหล็ก C90 ถึง 2 mm)' },
      { key: 'การชุบ', value: 'Bi-Metal 304 + EPDM Washer' },
      { key: 'มาตรฐาน', value: 'AS3566 Class 3' },
      { key: 'ทนเกลือสเปรย์', value: '>1,000 ชั่วโมง (Bureau Veritas)' },
    ],
    variants: [
      { sku: 'AS-48x25', size: '4.8 × 25 mm', length_mm: 25, diameter_mm: 4.8, pack_qty: 250, in_stock: true },
      { sku: 'AS-48x38', size: '4.8 × 38 mm', length_mm: 38, diameter_mm: 4.8, pack_qty: 250, in_stock: true },
      { sku: 'AS-48x50', size: '4.8 × 50 mm', length_mm: 50, diameter_mm: 4.8, pack_qty: 250, in_stock: true },
      { sku: 'AS-48x65', size: '4.8 × 65 mm', length_mm: 65, diameter_mm: 4.8, pack_qty: 200, in_stock: true },
      { sku: 'AS-48x75', size: '4.8 × 75 mm', length_mm: 75, diameter_mm: 4.8, pack_qty: 200, in_stock: false },
      { sku: 'AS-55x25', size: '5.5 × 25 mm', length_mm: 25, diameter_mm: 5.5, pack_qty: 200, in_stock: true },
      { sku: 'AS-55x38', size: '5.5 × 38 mm', length_mm: 38, diameter_mm: 5.5, pack_qty: 200, in_stock: true },
      { sku: 'AS-55x50', size: '5.5 × 50 mm', length_mm: 50, diameter_mm: 5.5, pack_qty: 200, in_stock: true },
    ],
    image: '/product-drill-orange.png', isBestSeller: true,
    crossRef: [
      { brand: 'Hilti', sku: 'S-WH 15' },
      { brand: 'Würth', sku: 'ASSY-EPDM-304' },
    ],
  },
  {
    id: 'sug-hex-galv',
    brand: 'SUG', system: 'roofing', sku_prefix: 'HG',
    name_th: 'สลักเกลียวหัวหกเหลี่ยม ชุบสังกะสี',
    name_en: 'Galvanised Self-drilling Screw (Hex Head)',
    desc_th: 'สกรูปลายสว่านหัวหกเหลี่ยม ชุบสังกะสีไฟฟ้า + EPDM washer สำหรับงานหลังคาทั่วไปและงานโครงสร้างเบา',
    desc_en: 'EG hex-head self-drilling with EPDM. General roofing and light structure.',
    standards: ['DIN 7504', 'ISO 15480'],
    specs: [
      { key: 'การชุบผิว', value: 'Electro-galvanised (EG)' },
      { key: 'หัวสกรู', value: 'Hex Washer Head + EPDM' },
      { key: 'ปลาย', value: 'Self-drilling SD Point' },
    ],
    variants: [
      { sku: 'HG-48x25', size: '4.8 × 25 mm', pack_qty: 500, in_stock: true },
      { sku: 'HG-48x38', size: '4.8 × 38 mm', pack_qty: 500, in_stock: true },
      { sku: 'HG-48x50', size: '4.8 × 50 mm', pack_qty: 500, in_stock: true },
      { sku: 'HG-48x65', size: '4.8 × 65 mm', pack_qty: 500, in_stock: true },
      { sku: 'HG-55x38', size: '5.5 × 38 mm', pack_qty: 400, in_stock: true },
      { sku: 'HG-55x50', size: '5.5 × 50 mm', pack_qty: 400, in_stock: false },
    ],
    image: '/product-drill-blue.png',
    crossRef: [{ brand: 'Fischer', sku: 'FPF II WT' }],
  },
  {
    id: 'sug-tile-screw',
    brand: 'SUG', system: 'roofing', sku_prefix: 'TS',
    name_th: 'สกรูยึดกระเบื้องหลังคา (Tile Screw)',
    name_en: 'Tile Roofing Screw',
    desc_th: 'สกรูหัวกลมชุบสี สำหรับยึดกระเบื้องซีเมนต์ลอนคู่ ลอนเล็ก มี EPDM washer กันน้ำ ทนการกัดกร่อน',
    desc_en: 'Coloured round-head screw for cement roof tiles. EPDM washer. Corrosion resistant.',
    standards: ['AS3566 Class 2', 'DIN 7504'],
    specs: [
      { key: 'หัวสกรู', value: 'Pan Head + EPDM Washer' },
      { key: 'สี', value: 'เทา / น้ำตาล / แดงอิฐ (ตามสี RAL)' },
      { key: 'วัสดุ', value: 'Carbon steel + EG + colour coat' },
    ],
    variants: [
      { sku: 'TS-55x55', size: '5.5 × 55 mm', pack_qty: 200, in_stock: true },
      { sku: 'TS-55x65', size: '5.5 × 65 mm', pack_qty: 200, in_stock: true },
      { sku: 'TS-55x75', size: '5.5 × 75 mm', pack_qty: 200, in_stock: true },
      { sku: 'TS-55x90', size: '5.5 × 90 mm', pack_qty: 150, in_stock: false },
    ],
    isNew: true,
  },
  // ── SUG MULTIPURPOSE ────────────────────────────────────────────────────
  {
    id: 'sug-wave-dome',
    brand: 'SUG', system: 'multipurpose', sku_prefix: 'WD',
    name_th: 'สลักเกลียวหัว WAVE DOME (HWH)',
    name_en: 'Wave Dome Head Self-drilling Screw',
    desc_th: 'สกรูหัว WAVE DOME (HWH) ใช้ยึดเหล็กรูปพรรณกับแปและโครงสร้างเหล็ก งานอเนกประสงค์ในโรงงานอุตสาหกรรม',
    desc_en: 'Wave Dome Head (HWH) for steel framing and purlin fastening. Industrial multipurpose.',
    standards: ['DIN 7504', 'T-17 Point'],
    specs: [
      { key: 'หัวสกรู', value: 'Wave Dome Head (HWH)' },
      { key: 'ปลาย', value: 'T-17 Self-drilling' },
      { key: 'การชุบ', value: 'Zinc phosphate + mechanical plating' },
    ],
    variants: [
      { sku: 'WD-55x25', size: '5.5 × 25 mm', pack_qty: 500, in_stock: true },
      { sku: 'WD-55x38', size: '5.5 × 38 mm', pack_qty: 500, in_stock: true },
      { sku: 'WD-55x50', size: '5.5 × 50 mm', pack_qty: 500, in_stock: true },
      { sku: 'WD-68x25', size: '6.8 × 25 mm', pack_qty: 250, in_stock: true },
      { sku: 'WD-68x38', size: '6.8 × 38 mm', pack_qty: 250, in_stock: true },
    ],
    isNew: true,
  },
  {
    id: 'sug-hex-tek',
    brand: 'SUG', system: 'multipurpose', sku_prefix: 'TEK',
    name_th: 'สกรู TEK ยึดเหล็กหนา (Heavy Gauge)',
    name_en: 'TEK Screw for Heavy Gauge Steel',
    desc_th: 'สกรู TEK ปลาย #3 / #5 สำหรับเจาะเหล็กหนาสูงสุด 12 mm โดยไม่ต้องเจาะล่วงหน้า ลดต้นทุนการทำงาน',
    desc_en: 'TEK #3 / #5 point for drilling steel up to 12 mm without pre-drilling. Saves time on heavy structure.',
    standards: ['AS3566', 'ASTM C1513'],
    specs: [
      { key: 'ปลายสว่าน', value: 'TEK #3 (เจาะเหล็ก 3-6 mm) / #5 (6-12 mm)' },
      { key: 'หัวสกรู', value: 'Hex Washer Head (HWH)' },
      { key: 'การชุบ', value: 'Bi-Metal 304 / EG' },
    ],
    variants: [
      { sku: 'TEK3-68x25', size: '6.8 × 25 mm TEK3', pack_qty: 200, in_stock: true },
      { sku: 'TEK3-68x38', size: '6.8 × 38 mm TEK3', pack_qty: 200, in_stock: true },
      { sku: 'TEK5-68x25', size: '6.8 × 25 mm TEK5', pack_qty: 100, in_stock: true },
      { sku: 'TEK5-68x38', size: '6.8 × 38 mm TEK5', pack_qty: 100, in_stock: false },
    ],
    isBestSeller: true,
  },
  // ── SUG WALL ─────────────────────────────────────────────────────────────
  {
    id: 'sug-csh',
    brand: 'SUG', system: 'wall', sku_prefix: 'CSH',
    name_th: 'สลักเกลียว CSH ไฟเบอร์ซีเมนต์',
    name_en: 'CSH Fibre-cement Board Screw',
    desc_th: 'สกรูเฉพาะสำหรับไฟเบอร์ซีเมนต์ หัว Countersunk ลดการแตกร้าว ปลาย Double-thread ยึดแน่น ชุบสีดำกันสนิม',
    desc_en: 'Dedicated fibre-cement screw. Countersunk head prevents cracking. Double-thread tip. Black phosphate.',
    standards: ['DIN 7504', 'ISO 15480'],
    specs: [
      { key: 'หัวสกรู', value: 'Bugle Head (Countersunk)' },
      { key: 'ปลาย', value: 'Double-thread Self-drilling' },
      { key: 'การชุบ', value: 'Black phosphate' },
      { key: 'วัสดุ', value: 'Carbon steel hardened' },
    ],
    variants: [
      { sku: 'CSH-42x65', size: '4.2 × 65 mm', pack_qty: 200, in_stock: true },
      { sku: 'CSH-42x75', size: '4.2 × 75 mm', pack_qty: 200, in_stock: true },
      { sku: 'CSH-42x90', size: '4.2 × 90 mm', pack_qty: 150, in_stock: true },
      { sku: 'CSH-42x110', size: '4.2 × 110 mm', pack_qty: 100, in_stock: false },
    ],
    isBestSeller: true,
    crossRef: [{ brand: 'Bossard', sku: 'BN8890' }],
  },
  {
    id: 'sug-rib-wall',
    brand: 'SUG', system: 'wall', sku_prefix: 'RIB',
    name_th: 'สกรู RIB ยึดผนังเบา (Dry Wall)',
    name_en: 'RIB Drywall & Partition Screw',
    desc_th: 'สกรูหัว Bugle เกลียว fine thread สำหรับยึดแผ่นยิปซัมและผนังเบา ชุบสีดำ ไม่แตกร้าว ง่ายต่อการไสหัวให้เสมอ',
    desc_en: 'Bugle head fine thread for gypsum board and drywall. Black. Countersinks flush.',
    standards: ['DIN 18182', 'ASTM C1002'],
    specs: [
      { key: 'ปลาย', value: 'Sharp point (ไม่ต้องเจาะล่วงหน้า)' },
      { key: 'เกลียว', value: 'Fine thread (HF) / Coarse thread (HG)' },
      { key: 'การชุบ', value: 'Black phosphate' },
    ],
    variants: [
      { sku: 'RIB-35x25', size: '3.5 × 25 mm', pack_qty: 1000, in_stock: true },
      { sku: 'RIB-35x32', size: '3.5 × 32 mm', pack_qty: 1000, in_stock: true },
      { sku: 'RIB-35x38', size: '3.5 × 38 mm', pack_qty: 1000, in_stock: true },
      { sku: 'RIB-38x45', size: '3.8 × 45 mm', pack_qty: 500, in_stock: true },
    ],
  },
  // ── SUG CONCRETE ─────────────────────────────────────────────────────────
  {
    id: 'sug-anchor-bolt',
    brand: 'SUG', system: 'concrete', sku_prefix: 'AB',
    name_th: 'Anchor Bolt หัวหกเหลี่ยม',
    name_en: 'Hex Head Anchor Bolt',
    desc_th: 'Anchor bolt ยึดโครงสร้างกับคอนกรีต ETA certified ทนแรงดึงสูง ชุบสังกะสีร้อน 45µm',
    desc_en: 'Structural concrete anchor bolt. ETA certified. High tensile. HDG 45µm.',
    standards: ['ETA', 'DIN 931', 'ASTM A307'],
    specs: [
      { key: 'เกรด', value: 'Grade 8.8' },
      { key: 'การชุบ', value: 'Hot-dip galvanised 45µm' },
      { key: 'มาตรฐาน', value: 'ETA 16/0143' },
    ],
    variants: [
      { sku: 'AB-M8x80', size: 'M8 × 80 mm', pack_qty: 50, in_stock: true },
      { sku: 'AB-M10x100', size: 'M10 × 100 mm', pack_qty: 25, in_stock: true },
      { sku: 'AB-M12x120', size: 'M12 × 120 mm', pack_qty: 25, in_stock: true },
      { sku: 'AB-M16x150', size: 'M16 × 150 mm', pack_qty: 10, in_stock: true },
    ],
    crossRef: [{ brand: 'Hilti', sku: 'HST3 M10' }, { brand: 'Fischer', sku: 'FAZ II 10/10' }],
  },
  {
    id: 'sug-concrete-screw',
    brand: 'SUG', system: 'concrete', sku_prefix: 'CS',
    name_th: 'สกรูคอนกรีต (Concrete Screw)',
    name_en: 'Concrete Screw (Hex Flange)',
    desc_th: 'สกรูเจาะคอนกรีต หัวหกเหลี่ยม Flange ชุบสีฟ้ากันสนิม ไม่ต้องใช้พุก เจาะรูนำแล้วขันได้เลย',
    desc_en: 'Hex flange concrete screw. Blue corrosion coat. No anchor needed — drill, then drive.',
    standards: ['ETA 14/0041', 'AS4617'],
    specs: [
      { key: 'หัวสกรู', value: 'Hex Flange Head' },
      { key: 'การชุบ', value: 'Blue corrosion protection coating' },
      { key: 'ใช้กับ', value: 'คอนกรีต อิฐ หิน' },
    ],
    variants: [
      { sku: 'CS-75x50', size: '7.5 × 50 mm', pack_qty: 100, in_stock: true },
      { sku: 'CS-75x70', size: '7.5 × 70 mm', pack_qty: 100, in_stock: true },
      { sku: 'CS-75x90', size: '7.5 × 90 mm', pack_qty: 50, in_stock: true },
      { sku: 'CS-10x100', size: '10 × 100 mm', pack_qty: 25, in_stock: false },
    ],
    isNew: true,
    crossRef: [{ brand: 'Hilti', sku: 'HUS-H 7.5' }, { brand: 'Würth', sku: 'AMO LT 7.5' }],
  },
  // ── SUG ACCESSORIES ─────────────────────────────────────────────────────
  {
    id: 'sug-epdm-washer',
    brand: 'SUG', system: 'accessories', sku_prefix: 'EPDM',
    name_th: 'แหวน EPDM + Aluminum (อะไหล่)',
    name_en: 'EPDM + Aluminium Sealing Washer',
    desc_th: 'แหวนยาง EPDM + Aluminum สำหรับสกรูหลังคา กันน้ำซึมแบบถาวร ทนแสง UV ทนอุณหภูมิ -40°C ถึง +120°C',
    desc_en: 'EPDM + Aluminium sealing washer for roofing screws. UV resistant. -40°C to +120°C.',
    standards: ['DIN 6902', 'EPDM ASTM D2000'],
    specs: [
      { key: 'วัสดุ', value: 'EPDM rubber + Aluminium' },
      { key: 'ทนอุณหภูมิ', value: '-40°C to +120°C' },
      { key: 'ทนแสง UV', value: 'ใช่' },
    ],
    variants: [
      { sku: 'EPDM-16mm', size: 'Ø 16 mm (สำหรับ 4.8 mm)', pack_qty: 1000, in_stock: true },
      { sku: 'EPDM-19mm', size: 'Ø 19 mm (สำหรับ 5.5 mm)', pack_qty: 1000, in_stock: true },
      { sku: 'EPDM-22mm', size: 'Ø 22 mm (สำหรับ 6.8 mm)', pack_qty: 500, in_stock: true },
    ],
  },
  // ── TITAN GENERAL ────────────────────────────────────────────────────────
  {
    id: 'titan-hex-bolt',
    brand: 'TITAN', system: 'general', sku_prefix: 'THB',
    name_th: 'สลักเกลียวหัวหกเหลี่ยม DIN 931',
    name_en: 'Hex Bolt DIN 931 (Full / Partial Thread)',
    desc_th: 'สลักเกลียวหัวหกเหลี่ยม DIN 931 เกรด 8.8 เหล็กกล้าคาร์บอน ทุกขนาด M4–M30',
    desc_en: 'Hex bolt DIN 931 Grade 8.8 carbon steel. All sizes M4 to M30.',
    standards: ['DIN 931', 'ISO 4014', 'Grade 8.8'],
    specs: [
      { key: 'เกรด', value: '8.8' },
      { key: 'วัสดุ', value: 'Carbon steel (10.9 option)' },
      { key: 'การชุบ', value: 'EG / HDG / Plain' },
    ],
    variants: [
      { sku: 'THB-M6x20', size: 'M6 × 20 mm', pack_qty: 200, in_stock: true },
      { sku: 'THB-M6x30', size: 'M6 × 30 mm', pack_qty: 200, in_stock: true },
      { sku: 'THB-M8x25', size: 'M8 × 25 mm', pack_qty: 100, in_stock: true },
      { sku: 'THB-M8x40', size: 'M8 × 40 mm', pack_qty: 100, in_stock: true },
      { sku: 'THB-M10x40', size: 'M10 × 40 mm', pack_qty: 50, in_stock: true },
      { sku: 'THB-M10x60', size: 'M10 × 60 mm', pack_qty: 50, in_stock: true },
      { sku: 'THB-M12x50', size: 'M12 × 50 mm', pack_qty: 25, in_stock: true },
      { sku: 'THB-M16x60', size: 'M16 × 60 mm', pack_qty: 25, in_stock: false },
    ],
    isBestSeller: true,
    crossRef: [{ brand: 'Würth', sku: 'HBS 931 8.8' }, { brand: 'Bossard', sku: 'BN33' }],
  },
  {
    id: 'titan-hex-nut',
    brand: 'TITAN', system: 'general', sku_prefix: 'THN',
    name_th: 'น็อตหกเหลี่ยม DIN 934',
    name_en: 'Hex Nut DIN 934',
    desc_th: 'น็อตหกเหลี่ยม DIN 934 เกรด 8 ทุกขนาด M4–M30',
    desc_en: 'Hex nut DIN 934 Grade 8. All sizes M4 to M30.',
    standards: ['DIN 934', 'ISO 4032', 'Grade 8'],
    specs: [
      { key: 'เกรด', value: '8' },
      { key: 'การชุบ', value: 'EG / HDG / Plain' },
    ],
    variants: [
      { sku: 'THN-M6', size: 'M6', pack_qty: 500, in_stock: true },
      { sku: 'THN-M8', size: 'M8', pack_qty: 500, in_stock: true },
      { sku: 'THN-M10', size: 'M10', pack_qty: 200, in_stock: true },
      { sku: 'THN-M12', size: 'M12', pack_qty: 100, in_stock: true },
      { sku: 'THN-M16', size: 'M16', pack_qty: 50, in_stock: true },
    ],
    isBestSeller: true,
  },
  {
    id: 'titan-flat-washer',
    brand: 'TITAN', system: 'general', sku_prefix: 'TFW',
    name_th: 'แหวนอีแปะ DIN 125',
    name_en: 'Flat Washer DIN 125',
    desc_th: 'แหวนอีแปะ DIN 125 เหล็กกล้า ชุบสังกะสีไฟฟ้า ทุกขนาด M5–M24',
    desc_en: 'Flat washer DIN 125 steel EG. All sizes M5 to M24.',
    standards: ['DIN 125', 'ISO 7089'],
    specs: [
      { key: 'วัสดุ', value: 'Steel + EG / SUS304' },
      { key: 'มาตรฐาน', value: 'DIN 125A / 125B' },
    ],
    variants: [
      { sku: 'TFW-M6', size: 'M6', pack_qty: 1000, in_stock: true },
      { sku: 'TFW-M8', size: 'M8', pack_qty: 500, in_stock: true },
      { sku: 'TFW-M10', size: 'M10', pack_qty: 200, in_stock: true },
      { sku: 'TFW-M12', size: 'M12', pack_qty: 100, in_stock: true },
    ],
  },
  // ── TITAN STAINLESS ──────────────────────────────────────────────────────
  {
    id: 'titan-ss-bolt',
    brand: 'TITAN', system: 'stainless', sku_prefix: 'TSS',
    name_th: 'สลักเกลียว SUS304 DIN 933',
    name_en: 'Stainless SUS304 Hex Bolt DIN 933',
    desc_th: 'สลักเกลียวสแตนเลส SUS304 หัวหกเหลี่ยม DIN 933 เกลียวเต็ม ทนกรด-ด่าง ชายทะเล โรงงานอาหาร',
    desc_en: 'SUS304 stainless hex bolt DIN 933. Full thread. Acid, marine, food-grade resistant.',
    standards: ['DIN 933', 'ISO 4017', 'A2-70'],
    specs: [
      { key: 'เกรด', value: 'SUS304 (A2-70)' },
      { key: 'ความต้านแรงดึง', value: '700 MPa' },
      { key: 'สภาพแวดล้อม', value: 'ทนกรด-ด่าง ชายทะเล อาหาร' },
    ],
    variants: [
      { sku: 'TSS-M6x20', size: 'M6 × 20 mm', pack_qty: 100, in_stock: true },
      { sku: 'TSS-M8x25', size: 'M8 × 25 mm', pack_qty: 50, in_stock: true },
      { sku: 'TSS-M8x40', size: 'M8 × 40 mm', pack_qty: 50, in_stock: true },
      { sku: 'TSS-M10x40', size: 'M10 × 40 mm', pack_qty: 25, in_stock: true },
      { sku: 'TSS-M12x50', size: 'M12 × 50 mm', pack_qty: 25, in_stock: false },
    ],
    isNew: true,
    crossRef: [{ brand: 'Bossard', sku: 'BN5' }, { brand: 'Würth', sku: 'ISK SS A2' }],
  },
  {
    id: 'titan-ss316-bolt',
    brand: 'TITAN', system: 'stainless', sku_prefix: 'TSS316',
    name_th: 'สลักเกลียว SUS316 (ทะเล / เคมี)',
    name_en: 'Stainless SUS316 Hex Bolt (Marine/Chemical)',
    desc_th: 'SUS316 ทนกรดคลอไรด์ ทนทะเลสูงสุด เหมาะสำหรับโรงงานกระดาษ อาหารทะเล เคมีภัณฑ์',
    desc_en: 'SUS316 (A4-80) — superior chloride resistance. Chemical, paper, seafood processing.',
    standards: ['DIN 933', 'A4-80', 'ASTM A193 B8M'],
    specs: [
      { key: 'เกรด', value: 'SUS316 (A4-80)' },
      { key: 'ความต้านแรงดึง', value: '800 MPa' },
      { key: 'ทน', value: 'กรดคลอไรด์ / ทะเล / เคมีภัณฑ์' },
    ],
    variants: [
      { sku: 'TSS316-M8x25', size: 'M8 × 25 mm', pack_qty: 25, in_stock: true },
      { sku: 'TSS316-M10x40', size: 'M10 × 40 mm', pack_qty: 25, in_stock: true },
      { sku: 'TSS316-M12x50', size: 'M12 × 50 mm', pack_qty: 10, in_stock: false },
    ],
    isBestSeller: true,
  },
  // ── TITAN ELECTRICAL ────────────────────────────────────────────────────
  {
    id: 'titan-electrical-bolt',
    brand: 'TITAN', system: 'electrical', sku_prefix: 'TEB',
    name_th: 'สลักเกลียวงานไฟฟ้า (ตู้ควบคุม)',
    name_en: 'Electrical Enclosure Bolt & Nut Set',
    desc_th: 'ชุดสลักเกลียว + น็อต สำหรับงานตู้ควบคุมไฟฟ้า ชุบสังกะสีขาว ทนสนิม ไม่นำกรด',
    desc_en: 'Bolt & nut set for electrical enclosures. White zinc. Corrosion resistant.',
    standards: ['DIN 933', 'IEC 60529'],
    specs: [
      { key: 'การชุบ', value: 'White zinc plated' },
      { key: 'ใช้กับ', value: 'ตู้ไฟ MDB/SMDB, cable tray, conduit' },
    ],
    variants: [
      { sku: 'TEB-M5x12', size: 'M5 × 12 mm', pack_qty: 200, in_stock: true },
      { sku: 'TEB-M6x12', size: 'M6 × 12 mm', pack_qty: 200, in_stock: true },
      { sku: 'TEB-M6x16', size: 'M6 × 16 mm', pack_qty: 200, in_stock: true },
      { sku: 'TEB-M8x20', size: 'M8 × 20 mm', pack_qty: 100, in_stock: true },
    ],
  },
  // ── TITAN AGRICULTURE ───────────────────────────────────────────────────
  {
    id: 'titan-agri-bolt',
    brand: 'TITAN', system: 'agri', sku_prefix: 'TAB',
    name_th: 'สลักเกลียวเกรด 10.9 งานเครื่องกลเกษตร',
    name_en: 'Grade 10.9 Agricultural Machinery Bolt',
    desc_th: 'สลักเกลียว High-tensile เกรด 10.9 สำหรับเครื่องจักรกลเกษตร รถไถ เครื่องเกี่ยว ทนแรงสั่นสะเทือน',
    desc_en: 'Grade 10.9 high-tensile bolt for agricultural machinery. Vibration resistant.',
    standards: ['DIN 931', 'ISO 8.8 / 10.9', 'Grade 10.9'],
    specs: [
      { key: 'เกรด', value: '10.9 (High-tensile)' },
      { key: 'วัสดุ', value: 'Alloy steel (42CrMo)' },
      { key: 'การชุบ', value: 'Yellow chromate / Plain' },
    ],
    variants: [
      { sku: 'TAB-M10x40', size: 'M10 × 40 mm', pack_qty: 50, in_stock: true },
      { sku: 'TAB-M12x50', size: 'M12 × 50 mm', pack_qty: 25, in_stock: true },
      { sku: 'TAB-M14x60', size: 'M14 × 60 mm', pack_qty: 25, in_stock: true },
      { sku: 'TAB-M16x70', size: 'M16 × 70 mm', pack_qty: 10, in_stock: false },
    ],
  },
];

// ── CROSS-REFERENCE DATABASE ────────────────────────────────────────────────
export interface CrossRefEntry {
  competitor_brand: string;
  competitor_sku: string;
  competitor_name: string;
  sug_product_id: string;
  match_level: 'exact' | 'equivalent' | 'similar';
  notes_th: string;
  notes_en: string;
}

export const CROSS_REF_DB: CrossRefEntry[] = [
  { competitor_brand: 'Hilti', competitor_sku: 'S-WH 15', competitor_name: 'Hilti Hex washer head screw', sug_product_id: 'sug-bimetal-hex', match_level: 'exact', notes_th: 'Bi-Metal 304 ทนเกลือสเปรย์เทียบเท่า', notes_en: 'Bi-Metal 304 — equivalent salt-spray performance.' },
  { competitor_brand: 'Hilti', competitor_sku: 'S-WH 15-38', competitor_name: 'Hilti Self-drilling 38mm', sug_product_id: 'sug-bimetal-hex', match_level: 'exact', notes_th: 'เทียบขนาด 4.8×38', notes_en: 'Match: 4.8×38 mm variant.' },
  { competitor_brand: 'Hilti', competitor_sku: 'HST3 M10', competitor_name: 'Hilti Anchor bolt HST3', sug_product_id: 'sug-anchor-bolt', match_level: 'equivalent', notes_th: 'ETA certified เทียบเท่า Hilti HST3', notes_en: 'ETA certified equivalent to Hilti HST3.' },
  { competitor_brand: 'Fischer', competitor_sku: 'FPF II WT', competitor_name: 'Fischer self-drilling', sug_product_id: 'sug-hex-galv', match_level: 'equivalent', notes_th: 'EG coating เทียบเท่า', notes_en: 'EG coating equivalent.' },
  { competitor_brand: 'Fischer', competitor_sku: 'FAZ II 10/10', competitor_name: 'Fischer anchor FAZ II', sug_product_id: 'sug-anchor-bolt', match_level: 'equivalent', notes_th: 'ETA anchor เทียบเท่า M10×100', notes_en: 'ETA equivalent anchor M10×100.' },
  { competitor_brand: 'Würth', competitor_sku: 'ASSY-EPDM-304', competitor_name: 'Würth ASSY EPDM 304', sug_product_id: 'sug-bimetal-hex', match_level: 'exact', notes_th: 'ทั้งสองรุ่น AS3566 Class 3', notes_en: 'Both AS3566 Class 3 certified.' },
  { competitor_brand: 'Würth', competitor_sku: 'HBS 931 8.8', competitor_name: 'Würth hex bolt 8.8', sug_product_id: 'titan-hex-bolt', match_level: 'exact', notes_th: 'DIN 931 เกรด 8.8 เทียบเท่า', notes_en: 'DIN 931 grade 8.8 direct match.' },
  { competitor_brand: 'Würth', competitor_sku: 'AMO LT 7.5', competitor_name: 'Würth AMO concrete screw', sug_product_id: 'sug-concrete-screw', match_level: 'equivalent', notes_th: 'สกรูคอนกรีต hex flange เทียบเท่า', notes_en: 'Hex flange concrete screw equivalent.' },
  { competitor_brand: 'Bossard', competitor_sku: 'BN8890', competitor_name: 'Bossard fibre-cement screw', sug_product_id: 'sug-csh', match_level: 'equivalent', notes_th: 'CSH เทียบเท่า Bossard BN8890', notes_en: 'CSH equivalent to Bossard BN8890.' },
  { competitor_brand: 'Bossard', competitor_sku: 'BN33', competitor_name: 'Bossard hex bolt', sug_product_id: 'titan-hex-bolt', match_level: 'exact', notes_th: 'DIN 931 เกรด 8.8 เทียบเท่า', notes_en: 'DIN 931 grade 8.8 direct match.' },
  { competitor_brand: 'Bossard', competitor_sku: 'BN5', competitor_name: 'Bossard SS bolt', sug_product_id: 'titan-ss-bolt', match_level: 'exact', notes_th: 'SUS304 A2-70 เทียบเท่า', notes_en: 'SUS304 A2-70 direct match.' },
];

// ── CATEGORIES ──────────────────────────────────────────────────────────────
export const CATEGORIES: Category[] = [
  { key: 'roofing', brand: 'SUG', name_th: 'ระบบหลังคา', name_en: 'Roofing System', desc_th: 'Bi-Metal 304 · เมทัลชีต · EPDM — AS3566 Class 3 · 1,000h salt-spray', desc_en: 'Bi-Metal 304 · metal sheet · EPDM — AS3566 Class 3 · 1,000h salt-spray', standards: ['AS3566 Class 3', 'SALT-SPRAY 1000H', 'DIN 7504'], color: '#2B2C91', products: PRODUCTS.filter(p => p.system === 'roofing') },
  { key: 'multipurpose', brand: 'SUG', name_th: 'งานอเนกประสงค์', name_en: 'Multipurpose', desc_th: 'แปะแนงเหล็ก · WAVE DOME · TEK · โครงสร้างเหล็ก', desc_en: 'Steel purlins · WAVE DOME · TEK · structural framing', standards: ['T-17 Point', 'TEK #3/#5', 'DIN 7504'], color: '#2B2C91', products: PRODUCTS.filter(p => p.system === 'multipurpose') },
  { key: 'wall', brand: 'SUG', name_th: 'ผนัง / ไฟเบอร์ซีเมนต์', name_en: 'Wall / Fibre-cement', desc_th: 'CSH · RIB · ยิปซัม · ซีเมนต์บอร์ด', desc_en: 'CSH · RIB · gypsum · cement board', standards: ['DIN 7504', 'ISO 15480', 'DIN 18182'], color: '#2B2C91', products: PRODUCTS.filter(p => p.system === 'wall') },
  { key: 'concrete', brand: 'SUG', name_th: 'งานคอนกรีต', name_en: 'Concrete', desc_th: 'Anchor bolt · Concrete screw · Hex flange', desc_en: 'Anchor bolts · Concrete screws · Hex flange', standards: ['ETA', 'DIN 931', 'AS4617'], color: '#2B2C91', products: PRODUCTS.filter(p => p.system === 'concrete') },
  { key: 'accessories', brand: 'SUG', name_th: 'อุปกรณ์เสริม', name_en: 'Accessories', desc_th: 'EPDM washer · รางน้ำ · แป · เครื่องมือยึด', desc_en: 'EPDM washer · gutters · purlins · fixing tools', standards: ['DIN 6902', 'EPDM ASTM D2000'], color: '#2B2C91', products: PRODUCTS.filter(p => p.system === 'accessories') },
  { key: 'general', brand: 'TITAN', name_th: 'น็อตมาตรฐานทั่วไป', name_en: 'General Standard', desc_th: 'สลักเกลียว น็อต แหวน ทุกขนาด DIN · JIS · ISO', desc_en: 'Bolts, nuts, washers — all standard sizes', standards: ['DIN 931', 'DIN 934', 'ISO 4014', 'Grade 8.8'], color: '#202B77', products: PRODUCTS.filter(p => p.system === 'general') },
  { key: 'electrical', brand: 'TITAN', name_th: 'อุตสาหกรรมงานไฟฟ้า', name_en: 'Electrical Industry', desc_th: 'ตู้ควบคุม · cable tray · conduit · grounding', desc_en: 'Enclosures · cable tray · conduit · grounding', standards: ['IEC 60529', 'DIN 933'], color: '#202B77', products: PRODUCTS.filter(p => p.system === 'electrical') },
  { key: 'stainless', brand: 'TITAN', name_th: 'อุตสาหกรรมงานสเตนเลส', name_en: 'Stainless Industry', desc_th: 'SUS304 A2-70 · SUS316 A4-80 — ทะเล / อาหาร / เคมี', desc_en: 'SUS304 A2-70 · SUS316 A4-80 — marine, food, chemical', standards: ['DIN 933', 'A2-70', 'A4-80', 'ASTM A193'], color: '#202B77', products: PRODUCTS.filter(p => p.system === 'stainless') },
  { key: 'agri', brand: 'TITAN', name_th: 'อุตสาหกรรมงานเกษตร', name_en: 'Agriculture Industry', desc_th: 'เครื่องจักรกลเกษตร · Grade 10.9 · Alloy steel', desc_en: 'Agricultural machinery · Grade 10.9 · Alloy steel', standards: ['ISO 8.8/10.9', 'DIN 931'], color: '#202B77', products: PRODUCTS.filter(p => p.system === 'agri') },
  { key: 'plumbing', brand: 'TITAN', name_th: 'อุตสาหกรรมงานประปา', name_en: 'Plumbing Industry', desc_th: 'ข้อต่อ · วาล์ว · ท่อ · fitting ทุกขนาด', desc_en: 'Fittings · valves · pipes — all sizes', standards: ['WATERWORKS', 'DIN'], color: '#202B77', products: PRODUCTS.filter(p => p.system === 'plumbing') },
];

export function getCategoryByKey(key: string): Category | undefined {
  return CATEGORIES.find(c => c.key === key);
}
export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}
export function searchProducts(q: string): Product[] {
  if (!q.trim()) return [];
  const lower = q.toLowerCase();
  return PRODUCTS.filter(p =>
    p.name_th.includes(q) ||
    p.name_en.toLowerCase().includes(lower) ||
    p.sku_prefix.toLowerCase().includes(lower) ||
    p.desc_th.includes(q) ||
    p.desc_en.toLowerCase().includes(lower) ||
    p.standards.some(s => s.toLowerCase().includes(lower)) ||
    p.variants.some(v => v.sku.toLowerCase().includes(lower))
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
