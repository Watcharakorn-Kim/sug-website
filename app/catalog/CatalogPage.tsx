'use client';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Header from '@/components/Header';
import { Footer } from '@/components/Sections';
import { useDealerAuth } from '@/lib/dealerAuth';
import {
  CATEGORIES,
  SYSTEMS,
  DEALER_MULT,
  crossRefSearch,
  computePrice,
  stockFor,
  fmt,
  type Product,
  type CrossRefEntry
} from '@/lib/products';

type Lang = 'th' | 'en';
const t = (lang: Lang, th: string, en: string) => lang === 'en' ? en : th;

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


function ResultRow({ p, lang, dealer }: { p: Product; lang: Lang; dealer: boolean }) {
  const list = getCheapestPrice(p);
  const price = dealer ? Math.round(list * DEALER_MULT * 10) / 10 : list;
  const stock = stockFor(p.seed);
  const totalStock = stock.reduce((s, b) => s + b.qty, 0);
  const stockState = p.lead && p.lead.days > 0 ? 'order' : totalStock > 3000 ? 'in' : 'low';

  const attrSummary = p.parametric && p.attrs
    ? Object.entries(p.attrs)
        .slice(0, 2)
        .map(([k, v]) => {
          if (!v) return '';
          const label = k === 'size' ? t(lang, 'ขนาด', 'sizes')
                      : k === 'length' ? t(lang, 'ความยาว', 'lengths')
                      : k === 'grade' ? t(lang, 'เกรด', 'grades')
                      : t(lang, 'แบบ', 'options');
          return `${v.length} ${label}`;
        })
        .filter(Boolean)
        .join(' · ')
    : (p.hasSizes ? `${p.hasSizes.length} ${t(lang, 'ขนาด', 'sizes')}` : '');

  // Calculate dynamic product path
  const productPath = `/products/${p.cat}/${p.id}`;

  return (
    <Link className="result-row" href={productPath}>
      <div className={`result-thumb ${p.img ? '' : 'ph'}`}>
        <span className={`result-brand ${p.brand === 'TITAN' ? 'titan' : ''}`}>{p.brand}</span>
        {p.img ? (
          <img src={p.img} alt="" style={{ objectFit: 'contain' }} />
        ) : (
          <span>{t(lang, 'ภาพสินค้า', 'product')}</span>
        )}
      </div>
      <div className="result-info">
        <h3 lang={lang}>{t(lang, p.th, p.en)}</h3>
        <div className="result-std">
          {p.standards.map(s => <span className="std-tag" key={s}>{s}</span>)}
        </div>
        <div className="result-attrs" lang={lang}>
          {p.parametric ? (
            <span>{t(lang, 'ปรับสเปกได้', 'Configurable')} · <b>{attrSummary}</b></span>
          ) : (
            <span><b>{attrSummary}</b> · {t(lang, 'พร้อมส่ง', 'in stock')}</span>
          )}
        </div>
      </div>
      <div className="result-price">
        {dealer ? (
          <div>
            <div className="price-from">{t(lang, 'เริ่มต้น', 'from')}</div>
            <span className="price-list-strike">{fmt(list)}</span>{' '}
            <span className="price-val price-dealer">{fmt(price)}</span>
            <div><span className="your-price-tag">{t(lang, 'ราคาตัวแทน', 'your price')}</span></div>
          </div>
        ) : (
          <div className="price-lock">
            <span className="lock-ico">🔒</span>
            <span className="lock-txt" lang={lang}>{t(lang, 'เข้าสู่ระบบ B2B เพื่อดูราคา', 'Login to see price')}</span>
          </div>
        )}
        <div className="stock-line">
          <span className={`stock-dot ${stockState}`}></span>
          <span className="stock-txt" lang={lang}>
            {stockState === 'order' ? t(lang, `สั่งผลิต ${p.lead.days} วัน`, `Made to order · ${p.lead.days}d`)
              : stockState === 'low' ? t(lang, 'มีจำกัด', 'Limited stock')
              : t(lang, 'พร้อมส่งวันนี้', 'Ships today')}
          </span>
          <span className="row-cta">→</span>
        </div>
      </div>
    </Link>
  );
}

function CatalogContent() {
  const searchParams = useSearchParams();
  const { user } = useDealerAuth();
  const dealer = !!user;

  const [lang, setLang] = useState<Lang>('th');
  const [cats, setCats] = useState<string[]>([]);
  const [sys, setSys] = useState<string>('');
  const [q, setQ] = useState<string>('');
  const [brands, setBrands] = useState<string[]>([]);
  const [stds, setStds] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState('rel');

  // Products dynamically loaded from preprocessed database
  const [products, setProducts] = useState<(Product & { systems?: string[] })[]>([]);
  const [loading, setLoading] = useState(false);

  // Extract all available brands
  const [allBrands, setAllBrands] = useState<string[]>(['SUG', 'TITAN', 'LIO', 'LOREX']);
  // Extract all available thread sizes from products database
  const [allSizes, setAllSizes] = useState<string[]>([]);
  // Extract dynamically generated standards
  const [allStandards, setAllStandards] = useState<string[]>([]);

  // Load global facets once on mount
  useEffect(() => {
    fetch('/api/products?limit=1000')
      .then(res => res.json())
      .then(data => {
        if (data.facets) {
          setAllBrands(data.facets.brands || ['SUG', 'TITAN', 'LIO', 'LOREX']);
          setAllSizes(data.facets.sizes || []);
          setAllStandards(data.facets.standards || []);
        }
      })
      .catch(err => {
        console.error('Failed to load global facets:', err);
      });
  }, []);

  // Fetch filtered products dynamically from the API whenever filter parameters change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const queryParts: string[] = [];
    if (cats.length > 0) queryParts.push(`cat=${encodeURIComponent(cats.join(','))}`);
    if (brands.length > 0) queryParts.push(`brand=${encodeURIComponent(brands.join(','))}`);
    if (sys) queryParts.push(`sys=${encodeURIComponent(sys)}`);
    if (q) queryParts.push(`q=${encodeURIComponent(q)}`);
    if (stds.length > 0) queryParts.push(`std=${encodeURIComponent(stds.join(','))}`);
    if (sizes.length > 0) queryParts.push(`size=${encodeURIComponent(sizes.join(','))}`);
    if (inStockOnly) queryParts.push('inStockOnly=true');
    if (sort) queryParts.push(`sort=${encodeURIComponent(sort)}`);
    queryParts.push('limit=100');

    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

    fetch(`/api/products${queryString}`)
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          setProducts(data.products);
        }
      })
      .catch(err => {
        console.error('Failed to load products from API:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [cats, brands, sys, q, stds, sizes, inStockOnly, sort]);

  // Competitor Cross Reference search state
  const [crossRefQuery, setCrossRefQuery] = useState('');
  const [crossRefResults, setCrossRefResults] = useState<CrossRefEntry[]>([]);
  const [crossRefSearched, setCrossRefSearched] = useState(false);

  // Sync with search parameters on load (using render-phase state adjustment to avoid useEffect cascading renders)
  const [prevParams, setPrevParams] = useState<string | null>(null);
  const currentParamsStr = searchParams ? searchParams.toString() : '';
  if (currentParamsStr !== prevParams) {
    setPrevParams(currentParamsStr);
    if (searchParams) {
      const catParam = searchParams.get('cat');
      setCats(catParam ? [catParam] : []);
      const sysParam = searchParams.get('sys');
      setSys(sysParam || '');
      const qParam = searchParams.get('q');
      setQ(qParam || '');
      const brandParam = searchParams.get('brand');
      setBrands(brandParam ? [brandParam] : []);
    }
  }

  const filtered = products;

  const toggle = (arr: string[], setArr: (a: string[]) => void, v: string) => {
    setArr(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
  };

  const handleCrossRefSearch = () => {
    if (crossRefQuery.trim().length >= 2) {
      setCrossRefResults(crossRefSearch(crossRefQuery));
      setCrossRefSearched(true);
    } else {
      setCrossRefResults([]);
      setCrossRefSearched(false);
    }
  };

  const anyFilter = cats.length || brands.length || stds.length || sizes.length || inStockOnly || sys || q;
  const sysInfo = sys ? SYSTEMS.find(s => s.key === sys) : null;
  const catCount = (key: string) => products.filter(p => p.cat === key).length;

  return (
    <div className="store-page">
      <Header lang={lang} setLang={setLang} active="products" />

      {/* Breadcrumbs */}
      <nav className="crumb">
        <Link href="/">{t(lang, 'หน้าแรก', 'Home')}</Link>
        <span className="sep">/</span>
        <span>{t(lang, 'แคตตาล็อกสินค้า', 'Catalog')}</span>
      </nav>

      {/* Header section */}
      <div className="catalog-head">
        <h1 lang={lang}>
          {sysInfo ? t(lang, sysInfo.th, sysInfo.en) : t(lang, 'แคตตาล็อกสินค้า', 'Product Catalog')}
        </h1>
        {sysInfo ? (
          <div className="job-banner" style={{
            background: 'var(--sug-paper)',
            border: '1px solid var(--border-hairline)',
            borderRadius: 'var(--radius-2)',
            padding: '24px',
            marginTop: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16
          }}>
            <div className="jb-body">
              <span className="jb-kicker" style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 600,
                color: 'var(--sug-orange)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: 6
              }} lang={lang}>
                {t(lang, 'เลือกตามงาน', 'SHOP BY JOB')}
              </span>
              <p className="jb-blurb" style={{ fontSize: 16, fontWeight: 600, color: 'var(--fg-1)', margin: '0 0 10px' }} lang={lang}>
                {t(lang, sysInfo.blurbTh, sysInfo.blurbEn)}
              </p>
              <div className="jb-meta" style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 12, color: 'var(--fg-3)' }}>
                <span className="jb-tag" style={{ background: 'var(--sug-fog)', padding: '2px 8px', borderRadius: 2 }} lang={lang}>
                  {t(lang, sysInfo.tagTh, sysInfo.tagEn)}
                </span>
                <span className="jb-std" style={{ fontFamily: 'var(--font-mono)' }}>{sysInfo.std}</span>
              </div>
            </div>
            <button className="jb-clear" onClick={() => setSys('')} style={{ fontSize: 13, color: 'var(--sug-orange)', fontWeight: 600, borderBottom: '1px solid var(--sug-orange)', paddingBottom: 2 }} lang={lang}>
              ↤ {t(lang, 'เลือกงานอื่น', 'Other jobs')}
            </button>
          </div>
        ) : (
          <p className="lede" lang={lang}>
            {t(
              lang,
              '50,000+ SKU พร้อมส่ง — กรองตามขนาดเกลียว เกรด วัสดุ และมาตรฐาน เพื่อหาตัวยึดที่ใช่ในไม่กี่วินาที',
              '50,000+ SKUs in stock. Filter by thread size, grade, material, and standard to find the exact fastener in seconds.'
            )}
          </p>
        )}
        {q && !sysInfo && (
          <p className="lede" lang={lang} style={{ marginTop: 12, fontSize: 14 }}>
            {t(lang, 'ผลการค้นหาสำหรับ', 'Results for')} “<b>{q}</b>”
          </p>
        )}
      </div>

      {/* Main catalog layout */}
      <div className="catalog-wrap">
        {/* Left facets filter panel */}
        <aside className="facets">
          {anyFilter ? (
            <div style={{ marginBottom: 12 }}>
              <button className="facet-clear" onClick={() => {
                setCats([]);
                setBrands([]);
                setStds([]);
                setSizes([]);
                setInStockOnly(false);
                setSys('');
                setQ('');
              }} lang={lang}>
                ✕ {t(lang, 'ล้างตัวกรองทั้งหมด', 'Clear all filters')}
              </button>
            </div>
          ) : null}

          {/* Category Facet */}
          <div className="facet">
            <h4 className="facet-title">{t(lang, 'หมวดหมู่', 'Category')}</h4>
            {CATEGORIES.map(c => (
              <label key={c.key} className={`facet-opt ${cats.includes(c.key) ? 'active' : ''}`} lang={lang}>
                <input
                  type="checkbox"
                  checked={cats.includes(c.key)}
                  onChange={() => toggle(cats, setCats, c.key)}
                />
                {t(lang, c.th, c.en)}
                <span className="ct">{catCount(c.key)}</span>
              </label>
            ))}
          </div>

          {/* Brand Facet */}
          <div className="facet">
            <h4 className="facet-title">{t(lang, 'แบรนด์', 'Brand')}</h4>
            {allBrands.map(b => (
              <label key={b} className={`facet-opt ${brands.includes(b) ? 'active' : ''}`}>
                <input
                  type="checkbox"
                  checked={brands.includes(b)}
                  onChange={() => toggle(brands, setBrands, b)}
                />
                {b}
                <span className="ct">{products.filter(p => p.brand === b).length}</span>
              </label>
            ))}
          </div>



          {/* Standards Facet */}
          <div className="facet">
            <h4 className="facet-title">{t(lang, 'มาตรฐาน', 'Standard')}</h4>
            {allStandards.slice(0, 10).map(s => (
              <label key={s} className={`facet-opt ${stds.includes(s) ? 'active' : ''}`}>
                <input
                  type="checkbox"
                  checked={stds.includes(s)}
                  onChange={() => toggle(stds, setStds, s)}
                />
                {s}
              </label>
            ))}
          </div>

          {/* Stock Facet */}
          <div className="facet">
            <h4 className="facet-title">{t(lang, 'สต๊อก', 'Availability')}</h4>
            <label className={`facet-opt ${inStockOnly ? 'active' : ''}`} lang={lang}>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={() => setInStockOnly(v => !v)}
              />
              {t(lang, 'เฉพาะที่พร้อมส่ง', 'In stock only')}
            </label>
          </div>
        </aside>

        {/* Right column: login gate, search results */}
        <main>
          {/* Public login gate banner */}
          {!dealer && (
            <div className="login-gate">
              <span className="lg-txt" lang={lang}>
                {t(lang, 'คุณกำลังดูในโหมดทั่วไป — ดูสเปกและดาวน์โหลดแบบได้ ', 'Public view — browse specs & download drawings. ')}
                <b>{t(lang, 'เข้าสู่ระบบบัญชี B2B เพื่อดูราคาและสั่งซื้อ', 'Sign in to your B2B account to see pricing and order online.')}</b>
              </span>
              <Link href="/portal" style={{ textDecoration: 'none' }}>
                <button lang={lang}>{t(lang, 'เข้าสู่ระบบตัวแทน / สมัคร B2B', 'Login to Buy & See Prices')}</button>
              </Link>
            </div>
          )}

          {/* Competitor Cross Reference Inline lookup bar */}
          <div className="xref">
            <span className="xlabel" lang={lang}>{t(lang, 'เทียบรหัสคู่แข่ง', 'Cross-reference')}</span>
            <input
              type="text"
              value={crossRefQuery}
              onChange={e => setCrossRefQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCrossRefSearch()}
              placeholder={t(
                lang,
                'วางรหัสสินค้าของแบรนด์อื่น เช่น HILTI, BOSCH, FISCHER...',
                'Paste competitor part number, e.g. HILTI, BOSCH, FISCHER...'
              )}
              lang={lang}
            />
            <button onClick={handleCrossRefSearch} lang={lang}>
              {t(lang, 'ค้นหา SUG ที่เทียบเท่า', 'Find SUG match')}
            </button>
          </div>

          {/* Cross Reference results display inline */}
          {crossRefSearched && (
            <div style={{
              background: 'var(--sug-paper)',
              border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-2)',
              padding: 20,
              marginBottom: 24
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-3)', margin: 0 }}>
                  {t(lang, 'ผลการเทียบรหัสคู่แข่ง', 'Cross-reference Results')}
                </h4>
                <button onClick={() => { setCrossRefSearched(false); setCrossRefQuery(''); }} style={{ fontSize: 12, color: 'var(--sug-steel)' }}>
                  {t(lang, 'ปิดผลลัพธ์', 'Close')}
                </button>
              </div>

              {crossRefResults.length === 0 ? (
                <p style={{ fontSize: 14, color: 'var(--fg-3)', margin: 0 }}>
                  {t(lang, 'ไม่พบรหัสสินค้าที่ตรงกัน — ติดต่อฝ่ายขายเพื่อตรวจสอบรหัสเทียบเท่าเพิ่มเติม', 'No matches found — contact sales for manual lookup.')}
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, background: 'var(--sug-fog)', border: '1px solid var(--sug-fog)', borderRadius: 'var(--radius-1)', overflow: 'hidden' }}>
                  {crossRefResults.map((r, i) => {
                    const product = products.find(p => p.id === r.sug_product_id);
                    return (
                      <div key={i} style={{ background: '#fff', padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr auto 1fr auto', gap: 16, alignItems: 'center' }}>
                        <div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.04em' }}>{r.competitor_brand}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, color: 'var(--fg-1)' }}>{r.competitor_sku}</div>
                        </div>
                        <div style={{ fontSize: 18, color: 'var(--sug-mist)' }}>→</div>
                        <div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--sug-orange)', letterSpacing: '0.04em' }}>SUG EQUIVALENT</div>
                          {product ? (
                            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-1)' }}>{t(lang, product.th, product.en)}</div>
                          ) : (
                            <div style={{ fontSize: 14, color: 'var(--fg-2)' }}>{r.sug_product_id}</div>
                          )}
                        </div>
                        {product && (
                          <Link href={`/products/${product.cat}/${product.id}`} style={{ background: 'var(--sug-ink)', color: '#fff', padding: '8px 14px', borderRadius: 'var(--radius-1)', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
                            {t(lang, 'ดูสินค้า', 'View')}
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Results bar: count + sorting */}
          <div className="results-bar">
            <span className="results-count" lang={lang}>
              <b>{filtered.length}</b> {t(lang, 'รายการสินค้า', 'product lines')}
              {dealer ? (
                <span style={{ color: 'var(--sug-orange)', marginLeft: 8, fontWeight: 600 }}>
                  · {t(lang, `ราคาตัวแทนระดับ ${user.tier.toUpperCase()}`, `${user.tier.toUpperCase()} dealer pricing`)}
                </span>
              ) : null}
            </span>
            <div className="toolbar-right">
              <select
                className="sort-select"
                value={sort}
                onChange={e => setSort(e.target.value)}
                lang={lang}
              >
                <option value="rel">{t(lang, 'เรียง: แนะนำ', 'Sort: Relevance')}</option>
                <option value="price-asc">{t(lang, 'ราคา: ต่ำ→สูง', 'Price: Low→High')}</option>
                <option value="price-desc">{t(lang, 'ราคา: สูง→ต่ำ', 'Price: High→Low')}</option>
              </select>
            </div>
          </div>

          {/* Products result rows list */}
          {loading ? (
            <div className="result-list">
              {[1, 2, 3].map(i => (
                <div key={i} className="result-row skeleton" style={{ minHeight: 120, display: 'flex', gap: 20, alignItems: 'center', opacity: 0.6, background: 'var(--sug-paper)', border: '1px solid var(--sug-fog)', padding: 20 }}>
                  <div style={{ width: 80, height: 80, background: 'var(--sug-fog)', borderRadius: 4 }}></div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ width: '40%', height: 16, background: 'var(--sug-fog)', borderRadius: 2 }}></div>
                    <div style={{ width: '20%', height: 12, background: 'var(--sug-fog)', borderRadius: 2 }}></div>
                    <div style={{ width: '60%', height: 12, background: 'var(--sug-fog)', borderRadius: 2 }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="es-ico">⌕</div>
              <h3 lang={lang}>{t(lang, 'ไม่พบสินค้าที่ตรงกับตัวกรอง', 'No products match these filters')}</h3>
              <p lang={lang}>{t(lang, 'ลองล้างหรือเปลี่ยนการตั้งค่าตัวกรอง', 'Try clearing or changing some filters.')}</p>
            </div>
          ) : (
            <div className="result-list">
              {filtered.map(p => (
                <ResultRow key={p.id} p={p} lang={lang} dealer={dealer} />
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer lang={lang} />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
