'use client';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { Footer } from '@/components/Sections';
import { useDealerAuth } from '@/lib/dealerAuth';
import {
  getProductById,
  getCategoryByKey,
  computePrice,
  buildSku,
  packFor,
  unitToPcs,
  relatedFor,
  tierPrice,
  stockFor,
  fmt,
  DEALER_MULT,
  type Product
} from '@/lib/products';

type Lang = 'th' | 'en';
const t = (lang: Lang, th: string, en: string) => lang === 'en' ? en : th;

interface Props {
  params: { category: string; product: string };
}

function getCheapestPrice(p: Product): number {
  if (!p.parametric) return p.priceList || 0;
  const sel = {
    size: p.attrs?.size ? p.attrs.size[0] : null,
    length: p.attrs?.length ? p.attrs.length[0] : null,
    grade: p.attrs?.grade ? p.attrs.grade[0] : null,
    finish: p.attrs?.finish ? p.attrs.finish[0] : null,
  };
  return computePrice(p, sel);
}

const ATTR_LABELS = {
  size: { th: 'ขนาดเกลียว', en: 'Thread Size' },
  length: { th: 'ความยาว (มม.)', en: 'Length (mm)' },
  grade: { th: 'เกรด / วัสดุ', en: 'Grade / Material' },
  finish: { th: 'การชุบเคลือบ', en: 'Finish / Coating' },
};

export default function ProductDetailPage({ params }: Props) {
  const [lang, setLang] = useState<Lang>('th');
  const { user } = useDealerAuth();
  const dealer = !!user;

  const staticProduct = getProductById(params.product);

  interface ApiMatchedSku {
    sku: string;
    size?: string;
    length?: string;
    finish?: string;
    weight?: number;
    boxQty?: number;
    crateQty?: number;
    listPrice: number;
    price: number;
  }

  interface ApiSpec {
    sku: string;
    size?: string;
    length?: string;
    finish?: string;
    listPrice: number;
    tierPrice: number;
    weight?: number;
    boxQty?: number;
    crateQty?: number;
  }

  // Dynamic API state
  const [apiData, setApiData] = useState<{
    product?: Product;
    matchedSku?: ApiMatchedSku;
    specs?: ApiSpec[];
  } | null>(null);

  const product = apiData?.product || staticProduct;
  const matchedSku = apiData?.matchedSku;

  const category = getCategoryByKey(product?.cat || params.category);

  // pdp tabs state
  const [tab, setTab] = useState<'specs' | 'certs' | 'ship'>('specs');

  // toast notification state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // dynamic selector state
  const initialSel = useMemo(() => {
    if (!staticProduct) return {} as Record<string, string | null>;
    if (staticProduct.parametric && staticProduct.attrs) {
      return {
        size: staticProduct.attrs.size ? staticProduct.attrs.size[0] : null,
        length: staticProduct.attrs.length ? staticProduct.attrs.length[0] : null,
        grade: staticProduct.attrs.grade ? staticProduct.attrs.grade[0] : null,
        finish: staticProduct.attrs.finish ? staticProduct.attrs.finish[0] : null,
      } as Record<string, string | null>;
    }
    return { size: staticProduct.hasSizes ? staticProduct.hasSizes[0] : null } as Record<string, string | null>;
  }, [staticProduct]);

  const [sel, setSel] = useState<Record<string, string | null>>(initialSel);

  // reset selection if product changes (render-phase state adjustment pattern)
  const [prevProduct, setPrevProduct] = useState(params.product);
  if (params.product !== prevProduct) {
    setPrevProduct(params.product);
    setSel(initialSel);
  }

  // Fetch dynamic details on option select or dealer login changes
  useEffect(() => {
    const tier = user?.tier || '';
    const queryParts = [];
    if (sel.size) queryParts.push(`size=${encodeURIComponent(sel.size)}`);
    if (sel.length) queryParts.push(`length=${encodeURIComponent(sel.length)}`);
    if (sel.finish) queryParts.push(`finish=${encodeURIComponent(sel.finish)}`);
    if (tier) queryParts.push(`tier=${encodeURIComponent(tier)}`);
    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

    fetch(`/api/products/${params.product}${queryString}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setApiData(data);
        }
      })
      .catch(err => {
        console.error('Failed to load dynamic details:', err);
      });
  }, [params.product, sel.size, sel.length, sel.finish, user?.tier]);

  // B2B unit and qty state
  const [buyUnit, setBuyUnit] = useState<string>('pc');
  const [unitQty, setUnitQty] = useState<number>(product?.parametric ? 100 : 10);

  if (!product || !category) {
    return (
      <>
        <Header lang={lang} setLang={setLang} active="products" />
        <main style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: 40 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, textTransform: 'uppercase' }}>404</h1>
          <p style={{ color: 'var(--fg-3)' }}>Product not found</p>
          <Link href="/catalog" style={{ color: 'var(--sug-orange)', fontWeight: 600 }}>← Back to Catalog</Link>
        </main>
        <Footer lang={lang} />
      </>
    );
  }

  const pk = packFor(product);
  const qty = unitToPcs(product, buyUnit, unitQty); // total pieces

  const stepFor = () => (buyUnit === 'pc' ? (unitQty > 100 ? 50 : 10) : 1);

  const changeUnit = (u: string) => {
    const pcsNow = qty;
    const nq = u === 'pc' ? pcsNow
      : u === 'box' ? Math.max(1, Math.round(pcsNow / pk.boxPcs))
      : Math.max(1, Math.round(pcsNow / pk.cratePcs));
    setBuyUnit(u);
    setUnitQty(nq);
  };

  const listPrice = matchedSku ? matchedSku.listPrice : (product.parametric ? computePrice(product, sel) : product.priceList || 0);
  const unitPrice = matchedSku ? matchedSku.price : (dealer ? Math.round(listPrice * DEALER_MULT * 100) / 100 : listPrice);
  const tieredPriceVal = tierPrice(unitPrice, qty, product.breaks);
  const sku = matchedSku ? matchedSku.sku : buildSku(product, sel);

  // stable stock values depending on dynamic selections
  const stockSeed = product.seed + (sel.size ? sel.size.length : 0);
  const stock = stockFor(stockSeed);
  const totalStock = stock.reduce((s, b) => s + b.qty, 0);
  const savePct = listPrice > 0 ? Math.round((1 - tieredPriceVal / listPrice) * 100) : 0;

  const setAttr = (k: string, v: string) => {
    setSel(s => ({ ...s, [k]: v }));
  };

  const handleAction = (isQuote: boolean) => {
    const actionLabel = isQuote ? t(lang, 'ส่งคำขอใบเสนอราคาแล้ว', 'Added to quote request') : t(lang, 'เพิ่มลงตะกร้าตัวแทน B2B แล้ว', 'Added to B2B cart');
    showToast(actionLabel);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const relatedProducts = relatedFor(product);

  return (
    <div className="store-page">
      <Header lang={lang} setLang={setLang} active="products" />

      {/* Toast popup */}
      {toastMsg && (
        <div className="toast show" style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}>
          <span className="tcheck">✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Breadcrumbs */}
      <nav className="crumb">
        <Link href="/">{t(lang, 'หน้าแรก', 'Home')}</Link>
        <span className="sep">/</span>
        <Link href="/catalog">{t(lang, 'แคตตาล็อก', 'Catalog')}</Link>
        <span className="sep">/</span>
        <Link href={`/catalog?sys=${category.key}`}>{t(lang, category.th, category.en)}</Link>
        <span className="sep">/</span>
        <span>{sku}</span>
      </nav>

      {/* Product details wrapper */}
      <div className="pdp">
        {/* Left media column */}
        <div className="pdp-media">
          <div className={`pdp-figure ${product.img ? '' : 'ph'}`}>
            <span className={`pdp-brandtag ${product.brand === 'TITAN' ? 'titan' : ''}`}>{product.brand}</span>
            {product.img ? (
              <img src={product.img} alt={t(lang, product.th, product.en)} />
            ) : (
              <span>{t(lang, 'ภาพสินค้า', 'Product image')}</span>
            )}
            <div className="mark">
              <img src="/sug-logo-official.png" alt="SUG" />
            </div>
          </div>
          <div className="buy-meta" lang={lang} style={{ marginTop: 16 }}>
            <span>✓ {t(lang, 'ส่งฟรีเมื่อสั่งครบ ฿2,000', 'Free delivery over ฿2,000')}</span>
            <span>✓ {t(lang, 'ใบกำกับภาษีเต็มรูปแบบ', 'Full tax invoice')}</span>
          </div>
        </div>

        {/* Right content column */}
        <div className="pdp-detail">
          <div className="pdp-sku">{t(lang, 'รหัสฐาน', 'Base ref')} · {product.id.toUpperCase()}</div>
          <h1 className="pdp-title" lang={lang}>{t(lang, product.th, product.en)}</h1>
          <div className="pdp-sub">{t(lang, product.en, product.th)}</div>
          <div className="pdp-std" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
            {product.standards.map(s => <span className="std-tag" key={s}>{s}</span>)}
          </div>
          {(product.specTh || product.specEn) && (
            <p className="pdp-desc" lang={lang}>{t(lang, product.specTh || '', product.specEn || '')}</p>
          )}

          {/* Parametric selectors */}
          {product.parametric && product.attrs ? (
            <div className="config">
              {Object.entries(product.attrs).map(([k, options]) => {
                if (!options) return null;
                const attrLabel = ATTR_LABELS[k as keyof typeof ATTR_LABELS] || { th: k, en: k };
                return (
                  <div className="config-row" key={k}>
                    <div className="config-label">
                      <span className="k">{t(lang, attrLabel.th, attrLabel.en)}</span>
                      <span className="v" lang={lang}>{sel[k]}</span>
                    </div>
                    <div className="opt-row">
                      {options.map(v => (
                        <button
                          key={v}
                          className={`opt ${k === 'finish' ? 'finish-opt' : ''} ${sel[k] === v ? 'active' : ''}`}
                          onClick={() => setAttr(k, v)}
                          lang={lang}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : product.hasSizes ? (
            <div className="config">
              <div className="config-row">
                <div className="config-label">
                  <span className="k">{t(lang, 'ขนาด (มม.)', 'Size (mm)')}</span>
                  <span className="v">{sel.size}</span>
                </div>
                <div className="opt-row">
                  {product.hasSizes.map(v => (
                    <button
                      key={v}
                      className={`opt ${sel.size === v ? 'active' : ''}`}
                      onClick={() => setAttr('size', v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* Buy box B2B aware */}
          {!dealer ? (
            <div className="buybox buybox-locked">
              <div className="buybox-sku" lang={lang}>SKU <b>{sku}</b></div>
              <div className="lock-hero">
                <span className="lock-hero-ico">🔒</span>
                <div>
                  <div className="lock-hero-title" lang={lang}>
                    {t(lang, 'ราคาแสดงเฉพาะสมาชิก B2B', 'Pricing for B2B account holders')}
                  </div>
                  <div className="lock-hero-sub" lang={lang}>
                    {t(lang, 'เข้าสู่ระบบเพื่อดูราคาส่วนตัว ส่วนลดตามปริมาณ และสั่งซื้อออนไลน์', 'Sign in to see your price, volume discounts, and order online.')}
                  </div>
                </div>
              </div>
              <div className="qty-buy">
                <Link href="/portal" style={{ width: '100%', textDecoration: 'none' }}>
                  <button className="btn-addcart" style={{ width: '100%' }} lang={lang}>
                    {t(lang, 'เข้าสู่ระบบเพื่อดูราคาและสั่งซื้อ', 'Login to Buy & See Prices')} <span className="arr">→</span>
                  </button>
                </Link>
              </div>
              <div className="buy-meta" lang={lang}>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); showToast(t(lang, 'กำลังดาวน์โหลดแบบเทคนิค (CAD/PDF)...', 'Downloading CAD/PDF technical drawings...')); }}
                  style={{ color: 'var(--sug-orange)', fontWeight: 600 }}
                >
                  ↓ {t(lang, 'ดาวน์โหลดแบบเทคนิค', 'Download drawing')}
                </a>
                <span>📄 {t(lang, 'ดูรายละเอียดสเปกได้โดยไม่ต้องเข้าสู่ระบบ', 'Specs viewable without login')}</span>
              </div>
            </div>
          ) : (
            <div className="buybox">
              <div className="buybox-sku" lang={lang}>SKU <b>{sku}</b></div>
              <div className="buybox-price">
                <span className="bb-now dealer">{fmt(tieredPriceVal)}</span>
                <span className="bb-unit">/{t(lang, 'ชิ้น', 'pc')}</span>
                {tieredPriceVal < listPrice && <span className="bb-list">{fmt(listPrice)}</span>}
              </div>
              <div className="bb-save" lang={lang}>
                {t(lang, 'ราคาตัวแทนพิเศษ — ประหยัด', 'Dealer special pricing — saved')} {savePct}% {qty >= 100 ? t(lang, '(รวมส่วนลดตามปริมาณ)', '(incl. volume break)') : ''}
              </div>

              {/* B2B Price breaks table */}
              <table className="tier-table">
                <thead>
                  <tr>
                    <th>{t(lang, 'จำนวน (ชิ้น)', 'Qty (pcs)')}</th>
                    <th>{t(lang, 'ราคา/ชิ้น', 'Price/pc')}</th>
                    <th>{t(lang, 'ส่วนลด', 'Discount')}</th>
                  </tr>
                </thead>
                <tbody>
                  {product.breaks.map(([minQty, m], i) => {
                    const next = product.breaks[i + 1];
                    const active = qty >= minQty && (!next || qty < next[0]);
                    return (
                      <tr key={minQty} className={active ? 'active' : ''}>
                        <td>{minQty.toLocaleString()}{next ? '–' + (next[0] - 1).toLocaleString() : '+'}</td>
                        <td>{fmt(Math.round(unitPrice * m * 100) / 100)}</td>
                        <td>{m < 1 ? '−' + Math.round((1 - m) * 100) + '%' : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* B2B Unit selection toggles */}
              <div className="unit-toggle" role="tablist">
                <button className={`unit-btn ${buyUnit === 'pc' ? 'active' : ''}`} onClick={() => changeUnit('pc')} lang={lang}>
                  {t(lang, 'ตัว', 'pcs')}
                </button>
                <button className={`unit-btn ${buyUnit === 'box' ? 'active' : ''}`} onClick={() => changeUnit('box')} lang={lang}>
                  {t(lang, 'กล่อง', 'boxes')}
                </button>
                <button className={`unit-btn ${buyUnit === 'crate' ? 'active' : ''}`} onClick={() => changeUnit('crate')} lang={lang}>
                  {t(lang, 'ลัง', 'crates')}
                </button>
              </div>

              <div className="qty-buy">
                {/* Stepper */}
                <div className="qty-stepper">
                  <button onClick={() => setUnitQty(q => Math.max(1, q - stepFor()))}>−</button>
                  <input
                    type="number"
                    value={unitQty}
                    onChange={e => setUnitQty(Math.max(1, parseInt(e.target.value || '1', 10)))}
                  />
                  <button onClick={() => setUnitQty(q => q + stepFor())}>+</button>
                </div>
                {/* Actions */}
                <button className="btn-addcart" onClick={() => handleAction(false)} lang={lang}>
                  {t(lang, 'สั่งซื้อ B2B', 'Order B2B')} · {fmt(tieredPriceVal * qty)}
                </button>
                <button className="btn-addquote" onClick={() => handleAction(true)} lang={lang}>
                  {t(lang, 'ขอใบเสนอราคา', 'Quote')}
                </button>
              </div>

              {/* Conversion display info */}
              <div className="unit-convert" lang={lang}>
                {buyUnit === 'pc' ? (
                  <span>{t(lang, 'บรรจุ', 'Packed')} <b>{pk.boxPcs.toLocaleString()}</b> {t(lang, 'ตัว/กล่อง', 'pcs/box')} · <b>{pk.boxesPerCrate}</b> {t(lang, 'กล่อง/ลัง', 'boxes/crate')}</span>
                ) : (
                  <span><b>{unitQty.toLocaleString()}</b> {t(lang, buyUnit === 'box' ? 'กล่อง' : 'ลัง', buyUnit)} = <b className="uc-pcs">{qty.toLocaleString()}</b> {t(lang, 'ตัว', 'pcs')}</span>
                )}
              </div>

              <div className="buy-meta" lang={lang}>
                <span>📦 {t(lang, `บรรจุ ${pk.boxPcs.toLocaleString()} ชิ้น/กล่อง`, `${pk.boxPcs.toLocaleString()} pcs/box`)}</span>
                <span>🚚 {totalStock > 3000 ? t(lang, 'จัดส่งพรุ่งนี้ทั่วประเทศ', 'Nationwide next-day') : t(lang, 'พร้อมจัดส่ง 2–3 วัน', 'Ships 2–3 days')}</span>
              </div>
            </div>
          )}

          {/* Branch stock availability */}
          <div className="branch-stock">
            <h4>{t(lang, 'สต๊อกสินค้าตามคลังสาขา', 'Stock by branch')}</h4>
            <div className="branch-grid">
              {stock.map(b => (
                <div className="branch-item" key={b.code}>
                  <span className="bname" lang={lang}>{t(lang, b.th, b.en)}</span>
                  <span className={`bqty ${b.qty < 800 ? 'low' : ''}`}>{b.qty.toLocaleString()} {t(lang, 'ชิ้น', 'pcs')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab panels at the bottom */}
        <div className="pdp-tabs">
          <div className="tabbar">
            <button className={tab === 'specs' ? 'active' : ''} onClick={() => setTab('specs')} lang={lang}>
              {t(lang, 'สเปกทางเทคนิค', 'Specifications')}
            </button>
            <button className={tab === 'certs' ? 'active' : ''} onClick={() => setTab('certs')} lang={lang}>
              {t(lang, 'ใบรับรอง & เอกสาร', 'Certs & Documents')}
            </button>
            <button className={tab === 'ship' ? 'active' : ''} onClick={() => setTab('ship')} lang={lang}>
              {t(lang, 'การจัดส่ง', 'Delivery')}
            </button>
          </div>

          {tab === 'specs' && (
            <div className="tab-panel">
              <div className="spec-grid">
                {[
                  [t(lang, 'มาตรฐาน', 'Standard'), product.standards.join(' · ')],
                  [t(lang, 'แบรนด์', 'Brand'), product.brand],
                  [t(lang, 'ขนาดเกลียว', 'Thread size'), sel.size || '—'],
                  [t(lang, 'ความยาว', 'Length'), sel.length ? sel.length + ' mm' : '—'],
                  [t(lang, 'เกรด/วัสดุ', 'Grade/Material'), sel.grade || (product.parametric ? '—' : t(lang, 'เหล็กกล้า', 'Tool steel'))],
                  [t(lang, 'การชุบเคลือบ', 'Finish'), sel.finish || '—'],
                  [t(lang, 'หน่วยบรรจุ', 'Pack unit'), `${pk.boxPcs} ${t(lang, 'ชิ้น/กล่อง', 'pcs/box')}`],
                  [t(lang, 'แหล่งผลิต', 'Origin'), t(lang, 'ผลิตในประเทศไทย', 'Made in Thailand')],
                ].map(([k, v]) => (
                  <div className="spec-row" key={k}>
                    <span className="sk" lang={lang}>{k}</span>
                    <span className="sv">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'certs' && (
            <div className="tab-panel">
              <div className="cert-list">
                {[
                  [t(lang, 'ใบรับรองมาตรฐาน (Mill Certificate)', 'Mill Certificate (3.1)'), 'EN 10204 3.1 · PDF'],
                  [t(lang, 'รายงานผลทดสอบแรงดึง', 'Tensile Test Report'), 'ISO 898-1 · PDF'],
                  [t(lang, 'เอกสารความปลอดภัย (SDS)', 'Safety Data Sheet'), 'GHS · PDF'],
                  [t(lang, 'แบบเขียนทางเทคนิค (CAD)', 'Technical Drawing (CAD)'), 'STEP · DXF'],
                ].map(([n, info]) => (
                  <div className="cert-item" key={n}>
                    <span className="cic">↓</span>
                    <div className="cmeta">
                      <div className="cname" lang={lang}>{n}</div>
                      <div className="cinfo">{info}</div>
                    </div>
                    <button
                      onClick={() => showToast(t(lang, `กำลังเตรียมดาวน์โหลด ${n}...`, `Preparing download for ${n}...`))}
                      className="cdl"
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      lang={lang}
                    >
                      {t(lang, 'ดาวน์โหลด', 'Download')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'ship' && (
            <div className="tab-panel">
              <p className="pdp-desc" lang={lang} style={{ maxWidth: '70ch' }}>
                {t(
                  lang,
                  'จัดส่งจากคลังสินค้า 5 ภูมิภาคทั่วประเทศ ครอบคลุม 77 จังหวัด สั่งสินค้าก่อนเวลา 14:00 น. สามารถจัดส่งวันถัดไปสำหรับสินค้าที่มีพร้อมส่ง · บริการรับสินค้าเองที่สาขาหลัก · งานโครงการมีบริการจัดส่งหลายปลายทางแยกตามจุดก่อสร้าง',
                  'Shipped from 5 regional warehouses covering all 77 provinces. Order before 2pm for next-day delivery on in-stock items. Branch pickup available. Project orders can ship to multiple sites in one order.'
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cross-sell panel */}
      {relatedProducts.length > 0 && (
        <div className="xsell">
          <div className="xsell-head">
            <h2 lang={lang}>{t(lang, 'ใช้คู่กับงานนี้', 'Bought together for this job')}</h2>
            <p lang={lang}>{t(lang, 'สิ่งที่มักสั่งซื้อไปพร้อมกันเพื่อความสมบูรณ์ในการทำงาน — เพิ่มเติมได้ในคลิกเดียว', 'What tradespeople usually pick up alongside — complete the job in one click.')}</p>
          </div>
          <div className="xsell-grid">
            {relatedProducts.map(rp => {
              const rpCheapestPrice = getCheapestPrice(rp);
              const rpPrice = dealer ? Math.round(rpCheapestPrice * DEALER_MULT * 10) / 10 : rpCheapestPrice;
              const rpk = packFor(rp);

              return (
                <div className="xsell-card" key={rp.id}>
                  <Link className={`xsell-thumb ${rp.img ? '' : 'ph'}`} href={`/products/${rp.cat}/${rp.id}`}>
                    <span className={`result-brand ${rp.brand === 'TITAN' ? 'titan' : ''}`}>{rp.brand}</span>
                    {rp.img ? <img src={rp.img} alt="" /> : <span>{t(lang, 'ภาพสินค้า', 'product')}</span>}
                  </Link>
                  <Link className="xsell-name" href={`/products/${rp.cat}/${rp.id}`} lang={lang}>
                    {t(lang, rp.th, rp.en)}
                  </Link>
                  <div className="xsell-std">{rp.standards[0]}</div>
                  <div className="xsell-foot">
                    {dealer ? (
                      <span className="xsell-price">{t(lang, 'เริ่ม', 'fr.')} {fmt(rpPrice)}</span>
                    ) : (
                      <span className="xsell-lock">🔒 {t(lang, 'เข้าสู่ระบบดูราคา', 'Login')}</span>
                    )}
                    <button
                      className="xsell-add"
                      onClick={() => dealer ? showToast(t(lang, `เพิ่ม ${rpk.boxPcs} ตัว (1 กล่อง) ลงตะกร้าแล้ว`, `Added ${rpk.boxPcs} pcs (1 box) to cart`)) : window.location.href = '/portal'}
                      lang={lang}
                    >
                      + {t(lang, '1 กล่อง', '1 box')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Footer lang={lang} />
    </div>
  );
}
