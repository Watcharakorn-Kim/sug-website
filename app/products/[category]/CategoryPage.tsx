'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { Footer } from '@/components/Sections';
import { CATEGORIES, PRODUCTS, getCategoryByKey, type Product } from '@/lib/products';

type Lang = 'th' | 'en';
const t = (lang: Lang, th: string, en: string) => lang === 'en' ? en : th;

interface Props {
  params: { category: string };
}

// Compact product card for listing
function ProductCard({ product, lang }: { product: Product; lang: Lang }) {
  const [hovering, setHovering] = useState(false);
  const inStockCount = product.variants.filter(v => v.in_stock).length;

  return (
    <Link
      href={`/products/${product.system}/${product.id}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        border: '1px solid var(--sug-fog)',
        borderBottom: hovering ? '2px solid var(--sug-orange)' : '2px solid transparent',
        padding: '28px',
        gap: 16,
        textDecoration: 'none',
        transition: 'all 180ms',
        boxShadow: hovering ? 'var(--shadow-3)' : 'none',
        transform: hovering ? 'translateY(-3px)' : 'none',
        position: 'relative',
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Badges */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <span style={{
          background: product.brand === 'SUG' ? 'var(--sug-blue)' : 'var(--titan-blue)',
          color: '#fff', fontSize: 10, fontFamily: 'var(--font-mono)',
          fontWeight: 600, letterSpacing: '0.1em', padding: '3px 8px', borderRadius: 2,
        }}>{product.brand}</span>
        {product.isBestSeller && (
          <span style={{ background: 'var(--sug-orange)', color: '#fff', fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.08em', padding: '3px 8px', borderRadius: 2 }}>
            {t(lang, 'ขายดี', 'BEST SELLER')}
          </span>
        )}
        {product.isNew && (
          <span style={{ background: 'var(--sug-success)', color: '#fff', fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.08em', padding: '3px 8px', borderRadius: 2 }}>
            NEW
          </span>
        )}
      </div>

      {/* Product image if available */}
      {product.image && (
        <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img
            src={product.image}
            alt={t(lang, product.name_th, product.name_en)}
            style={{ maxHeight: '100%', maxWidth: '70%', objectFit: 'contain', transition: 'transform 280ms', transform: hovering ? 'scale(1.06)' : 'scale(1)' }}
          />
        </div>
      )}

      {/* SKU prefix */}
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--fg-3)' }}>
        SKU: {product.sku_prefix}
      </span>

      {/* Name */}
      <h3 style={{
        fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)',
        fontSize: lang === 'th' ? 16 : 15,
        fontWeight: 700,
        margin: 0,
        color: 'var(--fg-1)',
        lineHeight: 1.35,
      }} lang={lang}>
        {t(lang, product.name_th, product.name_en)}
      </h3>

      {/* Standards pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {product.standards.slice(0, 2).map(std => (
          <span key={std} style={{
            border: '1px solid var(--sug-fog)',
            padding: '3px 8px',
            borderRadius: 2,
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.06em',
            color: 'var(--fg-3)',
          }}>{std}</span>
        ))}
      </div>

      {/* Variants */}
      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--sug-fog)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.04em' }}>
          {product.variants.length} {t(lang, 'ขนาด', 'sizes')} · <span style={{ color: inStockCount > 0 ? 'var(--sug-success)' : 'var(--sug-danger)' }}>
            {inStockCount} {t(lang, 'มีสต็อก', 'in stock')}
          </span>
        </span>
        <span style={{ color: hovering ? 'var(--sug-orange)' : 'var(--sug-mist)', fontFamily: 'var(--font-mono)', fontSize: 16, transition: 'color 180ms, transform 180ms', transform: hovering ? 'translateX(4px)' : 'none' }}>→</span>
      </div>
    </Link>
  );
}

export default function CategoryPage({ params }: Props) {
  const [lang, setLang] = useState<Lang>('th');
  const category = getCategoryByKey(params.category);

  if (!category) {
    return (
      <>
        <Header lang={lang} setLang={setLang} active="products" />
        <main style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: 40 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, textTransform: 'uppercase' }}>404</h1>
          <p style={{ color: 'var(--fg-3)' }}>Category not found</p>
          <Link href="/catalog" style={{ color: 'var(--sug-orange)', fontWeight: 600 }}>← Back to Catalog</Link>
        </main>
        <Footer lang={lang} />
      </>
    );
  }

  const otherCats = CATEGORIES.filter(c => c.brand === category.brand && c.key !== category.key);

  return (
    <>
      <Header lang={lang} setLang={setLang} active="products" />
      <main>
        {/* Hero */}
        <section style={{
          background: `linear-gradient(155deg, ${category.color} 0%, ${category.color}CC 100%)`,
          color: '#fff',
          padding: '80px 0 60px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -160, right: -160, width: 500, height: 500, background: 'radial-gradient(circle, rgba(239,90,28,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div className="section-inner" style={{ position: 'relative', zIndex: 1 }}>
            {/* Breadcrumb */}
            <nav style={{ display: 'flex', gap: 8, alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 32 }}>
              <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', transition: 'color 180ms' }} onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
                {t(lang, 'หน้าแรก', 'Home')}
              </Link>
              <span>·</span>
              <Link href="/catalog" style={{ color: 'rgba(255,255,255,0.5)', transition: 'color 180ms' }} onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
                {t(lang, 'สินค้า', 'Catalog')}
              </Link>
              <span>·</span>
              <span style={{ color: 'rgba(255,255,255,0.85)' }}>
                {t(lang, category.name_th, category.name_en)}
              </span>
            </nav>

            {/* Brand badge */}
            <div style={{ marginBottom: 16 }}>
              <span style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.16em',
                padding: '4px 12px',
                borderRadius: 2,
                backdropFilter: 'blur(4px)',
              }}>{category.brand}</span>
            </div>

            <h1 style={{
              fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-display)',
              fontSize: lang === 'th' ? 'clamp(2rem, 5vw, 3.5rem)' : 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: lang === 'th' ? 0 : '-0.025em',
              textTransform: lang === 'th' ? 'none' : 'uppercase',
              color: '#fff',
              margin: '0 0 20px',
            }} lang={lang}>
              {t(lang, category.name_th, category.name_en)}
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,0.78)', maxWidth: 640, margin: '0 0 28px' }} lang={lang}>
              {t(lang, category.desc_th, category.desc_en)}
            </p>

            {/* Standards */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {category.standards.map(std => (
                <span key={std} style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.85)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  padding: '4px 10px',
                  borderRadius: 2,
                }}>{std}</span>
              ))}
            </div>

            {/* Stat */}
            <div style={{ marginTop: 36, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.15)', display: 'flex', gap: 48 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color: 'var(--sug-orange)', lineHeight: 1 }}>{category.products.length}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>{t(lang, 'รุ่นสินค้า', 'Product lines')}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color: 'var(--sug-orange)', lineHeight: 1 }}>
                  {category.products.reduce((sum, p) => sum + p.variants.length, 0)}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>{t(lang, 'ขนาดรวม', 'Size variants')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="section" style={{ paddingTop: 60 }}>
          <div className="section-inner">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
              <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-3)', margin: 0 }}>
                {category.products.length} {t(lang, 'รุ่นสินค้า', 'product lines')}
              </h2>
              <Link href="/#contact" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--sug-orange)', borderBottom: '1px solid var(--sug-orange)', paddingBottom: 2 }}>
                {t(lang, 'ขอใบเสนอราคา →', 'Request Quote →')}
              </Link>
            </div>

            {category.products.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 2,
                background: 'var(--sug-fog)',
                border: '1px solid var(--sug-fog)',
              }}>
                {category.products.map(product => (
                  <ProductCard key={product.id} product={product} lang={lang} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '80px 40px', background: 'var(--sug-paper)', borderRadius: 'var(--radius-2)' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 12 }}>
                  {t(lang, 'กำลังเพิ่มสินค้า', 'PRODUCTS COMING SOON')}
                </p>
                <p style={{ color: 'var(--fg-2)', fontSize: 16 }} lang={lang}>
                  {t(lang, 'ติดต่อฝ่ายขายสำหรับข้อมูลเพิ่มเติม', 'Contact sales for full product information.')}
                </p>
                <Link href="/#contact" className="btn-orange-lg" style={{ display: 'inline-flex', marginTop: 24 }}>
                  {t(lang, 'ติดต่อฝ่ายขาย', 'Contact Sales')} →
                </Link>
              </div>
            )}

            {/* Cross-reference tool teaser */}
            <div style={{
              marginTop: 64,
              background: 'var(--sug-paper)',
              border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-2)',
              padding: '36px 40px',
              display: 'flex',
              gap: 32,
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--sug-orange)', marginBottom: 10 }}>
                  {t(lang, 'เทียบรหัสคู่แข่ง', 'CROSS REFERENCE')}
                </div>
                <p style={{ fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)', fontSize: 18, fontWeight: 700, margin: '0 0 8px', color: 'var(--fg-1)' }} lang={lang}>
                  {t(lang, 'มีรหัสสินค้าของแบรนด์อื่น?', 'Have a competitor part number?')}
                </p>
                <p style={{ fontSize: 15, color: 'var(--fg-2)', margin: 0 }} lang={lang}>
                  {t(lang, 'วางรหัสสินค้า Hilti, Bosch, Fischer หรือแบรนด์อื่น — เราหา SUG ที่เทียบเท่าให้', 'Enter a Hilti, Bosch, Fischer or any brand code — we\'ll find the SUG equivalent.')}
                </p>
              </div>
              <Link href="/catalog#crossref" style={{
                background: 'var(--sug-ink)',
                color: '#fff',
                padding: '14px 28px',
                fontWeight: 600,
                fontSize: 14,
                borderRadius: 'var(--radius-2)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                whiteSpace: 'nowrap',
                transition: 'background 180ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--sug-orange)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--sug-ink)')}
              >
                {t(lang, 'เทียบรหัสสินค้า', 'Cross Reference')} →
              </Link>
            </div>

            {/* Related categories */}
            {otherCats.length > 0 && (
              <div style={{ marginTop: 64 }}>
                <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 24 }}>
                  {t(lang, 'หมวดอื่นของ', 'MORE FROM')} {category.brand}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 2, background: 'var(--sug-fog)', border: '1px solid var(--sug-fog)' }}>
                  {otherCats.slice(0, 4).map(c => (
                    <Link
                      key={c.key}
                      href={`/products/${c.key}`}
                      style={{
                        background: '#fff',
                        padding: '28px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        textDecoration: 'none',
                        transition: 'background 180ms',
                        borderBottom: '2px solid transparent',
                        position: 'relative',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--sug-paper)'; e.currentTarget.style.borderBottomColor = 'var(--sug-orange)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderBottomColor = 'transparent'; }}
                    >
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--sug-orange)', fontWeight: 600, letterSpacing: '0.1em' }}>{c.brand}</span>
                      <span style={{ fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)', fontSize: 16, fontWeight: 700, color: 'var(--fg-1)' }} lang={lang}>
                        {t(lang, c.name_th, c.name_en)}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.05em' }}>
                        {c.products.length} {t(lang, 'รุ่น', 'lines')}
                      </span>
                      <span style={{ position: 'absolute', top: 24, right: 24, fontFamily: 'var(--font-mono)', color: 'var(--sug-mist)' }}>→</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer lang={lang} />
    </>
  );
}
