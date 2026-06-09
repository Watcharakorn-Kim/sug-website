'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { Footer } from '@/components/Sections';
import { PRODUCTS, crossRefSearch, getProductById, type CrossRefEntry, type Product } from '@/lib/products';

type Lang = 'th' | 'en';
const t = (lang: Lang, th: string, en: string) => lang === 'en' ? en : th;

const SORT_OPTIONS = [
  { value: 'recommended', th: 'เรียง: แนะนำ', en: 'Sort: Recommended' },
  { value: 'name', th: 'เรียง: ชื่อ', en: 'Sort: Name' },
  { value: 'brand', th: 'เรียง: แบรนด์', en: 'Sort: Brand' },
] as const;

export default function CatalogPage() {
  const [lang, setLang] = useState<Lang>('th');
  const [filter, setFilter] = useState<'ALL' | 'SUG' | 'TITAN'>('ALL');
  const [sort, setSort] = useState('recommended');
  const [crossRefQuery, setCrossRefQuery] = useState('');
  const [crossRefResults, setCrossRefResults] = useState<CrossRefEntry[]>([]);
  const [crossRefSearched, setCrossRefSearched] = useState(false);

  const handleCrossRef = () => {
    if (crossRefQuery.trim().length >= 2) {
      setCrossRefResults(crossRefSearch(crossRefQuery));
      setCrossRefSearched(true);
    }
  };

  let filtered = filter === 'ALL' ? PRODUCTS : PRODUCTS.filter(p => p.brand === filter);
  if (sort === 'name') filtered = [...filtered].sort((a, b) => a.name_th.localeCompare(b.name_th));
  if (sort === 'brand') filtered = [...filtered].sort((a, b) => a.brand.localeCompare(b.brand));

  return (
    <>
      <Header lang={lang} setLang={setLang} active="products" />
      <main>
        {/* Cross-reference bar — matches design image 9 */}
        <div style={{
          background: '#fff',
          borderBottom: '1px solid var(--sug-fog)',
          padding: '20px 0',
        }}>
          <div className="section-inner" style={{ paddingTop: 0, paddingBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)',
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--fg-1)',
                whiteSpace: 'nowrap',
              }} lang={lang}>
                {t(lang, 'เทียบรหัสคู่แข่ง', 'Cross-reference')}
              </span>
              <input
                type="text"
                value={crossRefQuery}
                onChange={e => setCrossRefQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCrossRef()}
                placeholder={t(lang,
                  'วางรหัสสินค้าของแบรนด์อื่น เช่น HILTI, BOSCH...',
                  'Paste competitor part number, e.g. HILTI, BOSCH...')}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '1px solid var(--sug-fog)',
                  borderRadius: 'var(--radius-1)',
                  fontSize: 14,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.02em',
                  color: 'var(--fg-1)',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleCrossRef}
                style={{
                  background: 'var(--sug-ink)',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: 'var(--radius-1)',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)',
                  transition: 'background 180ms',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--sug-orange)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--sug-ink)')}
              >
                {t(lang, 'ค้นหา SUG ที่เทียบเท่า', 'Find SUG equivalent')}
              </button>
            </div>

            {/* Cross-ref results */}
            {crossRefSearched && (
              <div style={{ marginTop: 16, borderTop: '1px solid var(--sug-fog)', paddingTop: 16 }}>
                {crossRefResults.length === 0 ? (
                  <p style={{ fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)', fontSize: 14, color: 'var(--fg-3)', margin: 0 }} lang={lang}>
                    {t(lang, 'ไม่พบรหัสที่ค้นหา — ติดต่อฝ่ายขายเพื่อสอบถามเพิ่มเติม', 'No match found — contact sales for manual lookup.')}
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {crossRefResults.map((r, i) => {
                      const product = getProductById(r.sug_product_id);
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', background: 'var(--sug-paper)', borderRadius: 'var(--radius-1)' }}>
                          <div style={{ flex: 1 }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>
                              {r.competitor_brand} {r.competitor_sku}
                            </span>
                            <span style={{ margin: '0 12px', color: 'var(--sug-mist)' }}>→</span>
                            <span style={{ fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)', fontSize: 14, fontWeight: 700, color: 'var(--fg-1)' }}>
                              {product ? t(lang, product.name_th, product.name_en) : r.sug_product_id}
                            </span>
                          </div>
                          {product && (
                            <Link href={`/products/${product.system}/${product.id}`}
                              style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--sug-orange)', textDecoration: 'none', fontWeight: 600 }}>
                              {t(lang, 'ดูสินค้า →', 'View →')}
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Count + sort bar */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--sug-fog)', padding: '12px 0' }}>
          <div className="section-inner" style={{ paddingTop: 0, paddingBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--sug-orange)' }}>
                  {filtered.length}
                </span>
                <span style={{ fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)', fontSize: 15, color: 'var(--fg-2)' }} lang={lang}>
                  {t(lang, 'รายการสินค้า', 'products')}
                </span>
              </div>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                style={{
                  padding: '8px 32px 8px 12px',
                  border: '1px solid var(--sug-fog)',
                  borderRadius: 'var(--radius-1)',
                  fontSize: 13,
                  fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)',
                  color: 'var(--fg-2)',
                  appearance: 'auto',
                  background: '#fff',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{t(lang, o.th, o.en)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Product list — matches design image 9 (list rows, not cards) */}
        <div style={{ background: '#fff', paddingBottom: 80 }}>
          <div className="section-inner" style={{ paddingTop: 0 }}>
            {filtered.map((p, i) => {
              const inStock = p.variants.filter(v => v.in_stock).length;
              const totalVariants = p.variants.length;
              const minPrice = Math.min(...p.variants.map(v => v.price_from ?? 0));
              const specTags = p.standards || [];

              return (
                <Link
                  key={p.id}
                  href={`/products/${p.system}/${p.id}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr auto',
                    gap: 20,
                    alignItems: 'center',
                    padding: '24px 0',
                    borderBottom: '1px solid var(--sug-fog)',
                    textDecoration: 'none',
                    transition: 'background 120ms',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--sug-paper)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Brand badge + image placeholder */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      background: p.brand === 'SUG' ? 'var(--sug-blue)' : 'var(--titan-blue)',
                      color: '#fff',
                      fontSize: 10,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      padding: '3px 10px',
                      borderRadius: 2,
                    }}>{p.brand}</span>
                    <div style={{
                      width: 60, height: 60,
                      background: 'var(--sug-paper)',
                      borderRadius: 'var(--radius-1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-thai)', fontSize: 10, color: 'var(--fg-3)',
                    }}>
                      {t(lang, 'ภาพ', 'IMG')}
                      <br />{t(lang, 'สินค้า', '')}
                    </div>
                  </div>

                  {/* Product info */}
                  <div>
                    <h3 style={{
                      fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)',
                      fontSize: 17,
                      fontWeight: 700,
                      margin: '0 0 6px',
                      color: 'var(--fg-1)',
                      lineHeight: 1.3,
                    }} lang={lang}>
                      {t(lang, p.name_th, p.name_en)}
                    </h3>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                      {specTags.map(tag => (
                        <span key={tag} style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          border: '1px solid var(--sug-fog)',
                          borderRadius: 2,
                          fontFamily: 'var(--font-mono)',
                          fontSize: 10,
                          fontWeight: 600,
                          color: 'var(--fg-2)',
                          letterSpacing: '0.04em',
                        }}>{tag.trim()}</span>
                      ))}
                    </div>
                    <p style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--fg-3)',
                      margin: 0,
                      letterSpacing: '0.04em',
                    }}>
                      {t(lang, 'ปรับสเปกได้', 'Configurable')} · {totalVariants} {t(lang, 'ขนาด', 'sizes')} · {p.variants[0]?.pack_qty || '-'} {t(lang, 'ความยาว', 'lengths')}
                    </p>
                  </div>

                  {/* Price + stock */}
                  <div style={{ textAlign: 'right', minWidth: 140 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', marginBottom: 4 }}>
                      {t(lang, 'เริ่มต้น', 'from')}
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--fg-1)', lineHeight: 1 }}>
                      ฿{minPrice.toFixed(2)}<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--fg-3)' }}>/{t(lang, 'ชิ้น', 'pc')}</span>
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6,
                      marginTop: 8,
                      fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)',
                      fontSize: 13,
                      color: inStock > 0 ? 'var(--sug-success)' : 'var(--fg-3)',
                    }}>
                      {inStock > 0 && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--sug-success)', flexShrink: 0 }} />}
                      {t(lang, 'พร้อมส่งวันนี้', 'Ready to ship')}
                      <span style={{ fontSize: 16, color: 'var(--sug-mist)', marginLeft: 4 }}>→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}
