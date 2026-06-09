'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Header from '@/components/Header';
import { Footer } from '@/components/Sections';
import { searchProducts, PRODUCTS, CATEGORIES, type Product } from '@/lib/products';

type Lang = 'th' | 'en';
const t = (lang: Lang, th: string, en: string) => lang === 'en' ? en : th;

function SearchContent() {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<Lang>('th');
  const [query, setQuery] = useState(searchParams?.get('q') ?? '');
  const [results, setResults] = useState<Product[]>([]);
  const [filterBrand, setFilterBrand] = useState<string>('ALL');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.trim().length >= 2) {
      let r = searchProducts(query);
      if (filterBrand !== 'ALL') r = r.filter(p => p.brand === filterBrand);
      setResults(r);
    } else {
      setResults([]);
    }
  }, [query, filterBrand]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const popular = PRODUCTS.filter(p => p.isBestSeller).slice(0, 6);

  return (
    <>
      <Header lang={lang} setLang={setLang} active="products" />
      <main>
        {/* Search bar header */}
        <section style={{ background: 'var(--sug-paper)', borderBottom: '1px solid var(--sug-fog)', padding: '40px 0' }}>
          <div className="section-inner">
            <span className="section-kicker" style={{ marginBottom: 16, display: 'block' }}>PHASE 4 · {t(lang, 'ค้นหาสินค้า', 'PRODUCT SEARCH')}</span>
            <div style={{ position: 'relative', maxWidth: 680 }}>
              <span style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', fontSize: 20, opacity: 0.4 }}>🔍</span>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t(lang, 'ค้นหาสินค้า SKU มาตรฐาน... เช่น Bi-Metal, DIN 931, CSH, M10', 'Search product, SKU, standard... e.g. Bi-Metal, DIN 931, M10')}
                style={{
                  width: '100%', padding: '18px 20px 18px 54px',
                  fontSize: 17, border: '2px solid var(--sug-fog)',
                  borderRadius: 'var(--radius-2)', background: '#fff',
                  color: 'var(--fg-1)', outline: 'none', fontFamily: 'var(--font-body)',
                  transition: 'border-color 180ms',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--sug-blue)')}
                onBlur={e => (e.target.style.borderColor = 'var(--sug-fog)')}
              />
            </div>
            {/* Filter + count */}
            <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              {['ALL', 'SUG', 'TITAN'].map(f => (
                <button key={f} onClick={() => setFilterBrand(f)}
                  style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid', fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.08em', cursor: 'pointer', transition: 'all 180ms', background: filterBrand === f ? 'var(--sug-ink)' : 'transparent', color: filterBrand === f ? '#fff' : 'var(--fg-2)', borderColor: filterBrand === f ? 'var(--sug-ink)' : 'var(--sug-fog)' }}>
                  {f === 'ALL' ? t(lang, 'ทั้งหมด', 'ALL') : f}
                </button>
              ))}
              {query.length >= 2 && (
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.06em' }}>
                  {results.length} {t(lang, 'รายการ', 'results')}
                </span>
              )}
            </div>
          </div>
        </section>

        <div className="section" style={{ paddingTop: 48 }}>
          <div className="section-inner">
            {query.length < 2 ? (
              <div>
                <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 24 }}>
                  {t(lang, 'สินค้าขายดี', 'BEST SELLERS')}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2, background: 'var(--sug-fog)', border: '1px solid var(--sug-fog)' }}>
                  {popular.map(p => (
                    <Link key={p.id} href={`/products/${p.system}/${p.id}`}
                      style={{ background: '#fff', padding: 28, display: 'flex', flexDirection: 'column', gap: 10, textDecoration: 'none', transition: 'background 180ms', borderBottom: '2px solid transparent' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--sug-paper)'; e.currentTarget.style.borderBottomColor = 'var(--sug-orange)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderBottomColor = 'transparent'; }}>
                      <span style={{ background: p.brand === 'SUG' ? 'var(--sug-blue)' : 'var(--titan-blue)', color: '#fff', fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.1em', padding: '3px 8px', borderRadius: 2, alignSelf: 'flex-start' }}>{p.brand}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.1em' }}>{p.sku_prefix}</span>
                      <span style={{ fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)', fontSize: 16, fontWeight: 700, color: 'var(--fg-1)', lineHeight: 1.3 }} lang={lang}>
                        {t(lang, p.name_th, p.name_en)}
                      </span>
                      <span style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }} lang={lang}>
                        {t(lang, p.desc_th, p.desc_en).slice(0, 80)}...
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 12 }} lang={lang}>
                  {t(lang, `ไม่พบสินค้าสำหรับ "${query}"`, `No results for "${query}"`)}
                </p>
                <Link href="/compare" style={{ color: 'var(--sug-orange)', fontWeight: 600, textDecoration: 'underline' }} lang={lang}>
                  {t(lang, 'ลองเทียบรหัสคู่แข่ง →', 'Try cross-reference tool →')}
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2, background: 'var(--sug-fog)', border: '1px solid var(--sug-fog)' }}>
                {results.map(p => (
                  <Link key={p.id} href={`/products/${p.system}/${p.id}`}
                    style={{ background: '#fff', padding: 28, display: 'flex', flexDirection: 'column', gap: 10, textDecoration: 'none', transition: 'background 180ms', borderBottom: '2px solid transparent' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--sug-paper)'; e.currentTarget.style.borderBottomColor = 'var(--sug-orange)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderBottomColor = 'transparent'; }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ background: p.brand === 'SUG' ? 'var(--sug-blue)' : 'var(--titan-blue)', color: '#fff', fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.1em', padding: '3px 8px', borderRadius: 2 }}>{p.brand}</span>
                      {p.isBestSeller && <span style={{ background: 'var(--sug-orange)', color: '#fff', fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600, padding: '3px 8px', borderRadius: 2 }}>{t(lang, 'ขายดี', 'BEST SELLER')}</span>}
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.1em' }}>{p.sku_prefix}</span>
                    <span style={{ fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)', fontSize: 16, fontWeight: 700, color: 'var(--fg-1)', lineHeight: 1.3 }} lang={lang}>
                      {t(lang, p.name_th, p.name_en)}
                    </span>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {p.standards.slice(0, 2).map(s => <span key={s} style={{ border: '1px solid var(--sug-fog)', padding: '2px 8px', borderRadius: 2, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)' }}>{s}</span>)}
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', marginTop: 'auto' }}>
                      {p.variants.length} {t(lang, 'ขนาด', 'sizes')}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
