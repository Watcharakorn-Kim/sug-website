'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { Footer } from '@/components/Sections';
import { crossRefSearch, getProductById, type CrossRefEntry } from '@/lib/products';

type Lang = 'th' | 'en';
const t = (lang: Lang, th: string, en: string) => lang === 'en' ? en : th;

const COMPETITOR_BRANDS = ['Hilti', 'Fischer', 'Würth', 'Bossard', 'SikaFlex', 'Rawlplug'];

export default function ComparePage() {
  const [lang, setLang] = useState<Lang>('th');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CrossRefEntry[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.trim().length >= 2) {
      setResults(crossRefSearch(q));
      setSearched(true);
    } else {
      setResults([]);
      setSearched(false);
    }
  };

  const matchBadge = (level: string) => {
    const map: Record<string, { label_th: string; label_en: string; color: string }> = {
      exact: { label_th: 'ตรงกัน 100%', label_en: 'EXACT MATCH', color: '#16a34a' },
      equivalent: { label_th: 'เทียบเท่า', label_en: 'EQUIVALENT', color: '#2563eb' },
      similar: { label_th: 'คล้ายกัน', label_en: 'SIMILAR', color: '#d97706' },
    };
    return map[level] ?? map.similar;
  };

  return (
    <>
      <Header lang={lang} setLang={setLang} active="products" />
      <main>
        {/* Hero */}
        <section style={{
          background: 'linear-gradient(155deg, #23247E 0%, #14154F 100%)',
          padding: '80px 0 64px', color: '#fff',
        }}>
          <div className="section-inner">
            <span className="section-kicker light">PHASE 2 · {t(lang, 'เทียบรหัสสินค้า', 'CROSS REFERENCE')}</span>
            {lang === 'th' ? (
              <h1 className="section-title-th light" style={{ marginTop: 12 }}>เทียบรหัสสินค้าคู่แข่ง<br />เจอ SUG ที่เทียบเท่า</h1>
            ) : (
              <h1 className="section-title light" style={{ marginTop: 12 }}>Find the SUG equivalent<br />for any competitor part.</h1>
            )}
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 17, marginTop: 16, maxWidth: 560 }} lang={lang}>
              {t(lang,
                'วางรหัสสินค้า Hilti, Fischer, Würth, Bossard หรือแบรนด์อื่น — เราหาสินค้า SUG ที่เทียบเท่าให้ทันที',
                'Enter any Hilti, Fischer, Würth or Bossard part number — we\'ll find the SUG equivalent instantly.')}
            </p>

            {/* Search box */}
            <div style={{ marginTop: 36, position: 'relative', maxWidth: 580 }}>
              <input
                type="text"
                value={query}
                onChange={e => handleSearch(e.target.value)}
                placeholder={t(lang, 'พิมพ์รหัสสินค้า เช่น S-WH 15, HST3, FPF II...', 'Enter part number, e.g. S-WH 15, HST3, FPF II...')}
                autoFocus
                style={{
                  width: '100%',
                  padding: '18px 60px 18px 22px',
                  fontSize: 16,
                  border: '2px solid rgba(255,255,255,0.25)',
                  borderRadius: 'var(--radius-2)',
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(8px)',
                  color: '#fff',
                  outline: 'none',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.04em',
                  transition: 'border-color 180ms',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--sug-orange)'; e.target.style.background = 'rgba(255,255,255,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.25)'; e.target.style.background = 'rgba(255,255,255,0.08)'; }}
              />
              <span style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', fontSize: 20, opacity: 0.5 }}>🔍</span>
            </div>

            {/* Brand pills */}
            <div style={{ marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{t(lang, 'แบรนด์ที่รองรับ', 'SUPPORTED BRANDS')}:</span>
              {COMPETITOR_BRANDS.map(b => (
                <button key={b} onClick={() => handleSearch(b)}
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.75)', padding: '5px 14px', borderRadius: 20, fontSize: 12, fontFamily: 'var(--font-mono)', cursor: 'pointer', transition: 'all 180ms' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--sug-orange)'; e.currentTarget.style.borderColor = 'var(--sug-orange)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
                >{b}</button>
              ))}
            </div>
          </div>
        </section>

        {/* Results */}
        <div className="section" style={{ paddingTop: 60 }}>
          <div className="section-inner">
            {!searched ? (
              <div style={{ textAlign: 'center', padding: '64px 0' }}>
                <div style={{ fontSize: 56, marginBottom: 20 }}>🔍</div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-3)' }} lang={lang}>
                  {t(lang, 'พิมพ์รหัสสินค้า หรือชื่อแบรนด์เพื่อเริ่มค้นหา', 'Type a part number or brand name to start')}
                </p>
              </div>
            ) : results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 0' }}>
                <div style={{ fontSize: 56, marginBottom: 20 }}>🤔</div>
                <p style={{ fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)', fontSize: 18, fontWeight: 700, color: 'var(--fg-1)', marginBottom: 12 }} lang={lang}>
                  {t(lang, 'ไม่พบรหัสสินค้าที่ค้นหา', 'No match found for that part number.')}
                </p>
                <p style={{ color: 'var(--fg-3)', fontSize: 15 }} lang={lang}>
                  {t(lang, 'ติดต่อฝ่ายขายเราเพื่อให้ช่วยค้นหา', 'Contact our sales team for manual lookup.')}
                </p>
                <a href="tel:+6624206734" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 24, background: 'var(--sug-orange)', color: '#fff', padding: '14px 28px', borderRadius: 'var(--radius-2)', fontWeight: 600, textDecoration: 'none' }}>
                  📞 02-420-6734-6
                </a>
              </div>
            ) : (
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 28 }}>
                  {results.length} {t(lang, 'รายการที่พบ สำหรับ', 'results for')} &ldquo;{query}&rdquo;
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, background: 'var(--sug-fog)', border: '1px solid var(--sug-fog)' }}>
                  {results.map((r, i) => {
                    const product = getProductById(r.sug_product_id);
                    const badge = matchBadge(r.match_level);
                    return (
                      <div key={i} style={{ background: '#fff', padding: '28px 32px', display: 'grid', gridTemplateColumns: '1fr auto 1fr auto', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Competitor */}
                        <div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 6 }}>{t(lang, 'สินค้าคู่แข่ง', 'COMPETITOR')}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--fg-1)', letterSpacing: '0.04em' }}>{r.competitor_brand} {r.competitor_sku}</div>
                          <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 4 }}>{r.competitor_name}</div>
                        </div>

                        {/* Arrow + match badge */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22, color: 'var(--sug-mist)' }}>→</span>
                          <span style={{ background: badge.color, color: '#fff', fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.1em', padding: '3px 8px', borderRadius: 2 }}>
                            {t(lang, badge.label_th, badge.label_en)}
                          </span>
                        </div>

                        {/* SUG Product */}
                        <div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sug-orange)', marginBottom: 6 }}>SUG EQUIVALENT</div>
                          {product ? (
                            <>
                              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg-1)', fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)' }} lang={lang}>
                                {t(lang, product.name_th, product.name_en)}
                              </div>
                              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>SKU: {product.sku_prefix}</div>
                              <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 6 }} lang={lang}>{t(lang, r.notes_th, r.notes_en)}</div>
                            </>
                          ) : (
                            <div style={{ color: 'var(--fg-3)' }}>SUG {r.sug_product_id}</div>
                          )}
                        </div>

                        {/* CTA */}
                        {product && (
                          <Link href={`/products/${product.system}/${product.id}`}
                            style={{ background: 'var(--sug-ink)', color: '#fff', padding: '12px 20px', borderRadius: 'var(--radius-1)', fontSize: 13, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background 180ms' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--sug-orange)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'var(--sug-ink)')}>
                            {t(lang, 'ดูสินค้า', 'View Product')} →
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}
