'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { Footer } from '@/components/Sections';
import { getProductById, getCategoryByKey, PRODUCTS, type Product, type ProductVariant } from '@/lib/products';

type Lang = 'th' | 'en';
const t = (lang: Lang, th: string, en: string) => lang === 'en' ? en : th;

interface Props {
  params: { category: string; product: string };
}

function VariantTable({ variants, lang, selected, onSelect }: {
  variants: ProductVariant[];
  lang: Lang;
  selected: string;
  onSelect: (sku: string) => void;
}) {
  return (
    <div style={{ border: '1px solid var(--sug-fog)', borderRadius: 'var(--radius-2)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 80px 80px 100px',
        background: 'var(--sug-ink)',
        color: 'rgba(255,255,255,0.6)',
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        padding: '10px 16px',
        gap: 12,
      }}>
        <span>SKU / {t(lang, 'ขนาด', 'SIZE')}</span>
        <span style={{ textAlign: 'right' }}>{t(lang, 'บรรจุ', 'QTY')}</span>
        <span style={{ textAlign: 'right' }}>{t(lang, 'สต็อก', 'STOCK')}</span>
        <span />
      </div>

      {/* Rows */}
      {variants.map((v, i) => {
        const isSelected = selected === v.sku;
        return (
          <button
            key={v.sku}
            onClick={() => onSelect(v.sku)}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 80px 80px 100px',
              gap: 12,
              padding: '14px 16px',
              background: isSelected ? 'rgba(43,44,145,0.06)' : '#fff',
              borderBottom: i < variants.length - 1 ? '1px solid var(--sug-fog)' : 'none',
              borderLeft: `3px solid ${isSelected ? 'var(--sug-blue)' : 'transparent'}`,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              font: 'inherit',
              transition: 'background 120ms, border-left-color 120ms',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--fg-1)', letterSpacing: '0.04em' }}>{v.sku}</span>
              <span style={{ display: 'block', fontSize: 13, color: 'var(--fg-2)', marginTop: 2 }}>{v.size}</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-2)', textAlign: 'right' }}>
              {v.pack_qty.toLocaleString()} {t(lang, 'ชิ้น', 'pcs')}
            </span>
            <span style={{ textAlign: 'right' }}>
              <span style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: v.in_stock ? 'var(--sug-success)' : '#E0E0E0',
                marginRight: 6,
              }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: v.in_stock ? 'var(--sug-success)' : 'var(--fg-3)' }}>
                {v.in_stock ? t(lang, 'มีสต็อก', 'In stock') : t(lang, 'หมด', 'Out')}
              </span>
            </span>
            <div style={{ textAlign: 'right' }}>
              {isSelected && (
                <span style={{
                  background: 'var(--sug-blue)',
                  color: '#fff',
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  padding: '3px 8px',
                  borderRadius: 2,
                }}>{t(lang, 'เลือกแล้ว', 'SELECTED')}</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function ProductDetailPage({ params }: Props) {
  const [lang, setLang] = useState<Lang>('th');
  const [selectedSku, setSelectedSku] = useState<string>('');
  const [quoteQty, setQuoteQty] = useState('');
  const [quoteSent, setQuoteSent] = useState(false);

  const product = getProductById(params.product);
  const category = getCategoryByKey(params.category);

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

  const selectedVariant = product.variants.find(v => v.sku === selectedSku) ?? product.variants[0];
  const relatedProducts = PRODUCTS.filter(p => p.system === product.system && p.id !== product.id).slice(0, 3);

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSent(true);
  };

  return (
    <>
      <Header lang={lang} setLang={setLang} active="products" />
      <main>
        {/* Breadcrumb */}
        <div style={{ background: 'var(--sug-paper)', borderBottom: '1px solid var(--sug-fog)', padding: '12px 0' }}>
          <div className="section-inner" style={{ paddingTop: 0, paddingBottom: 0 }}>
            <nav style={{ display: 'flex', gap: 10, alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', color: 'var(--fg-3)', textTransform: 'uppercase', flexWrap: 'wrap' }}>
              <Link href="/" style={{ color: 'var(--fg-3)', transition: 'color 120ms' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--sug-orange)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-3)')}>
                {t(lang, 'หน้าแรก', 'Home')}
              </Link>
              <span>·</span>
              <Link href="/catalog" style={{ color: 'var(--fg-3)', transition: 'color 120ms' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--sug-orange)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-3)')}>
                {t(lang, 'สินค้า', 'Products')}
              </Link>
              <span>·</span>
              <Link href={`/products/${params.category}`} style={{ color: 'var(--fg-3)', transition: 'color 120ms' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--sug-orange)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-3)')}>
                {t(lang, category.name_th, category.name_en)}
              </Link>
              <span>·</span>
              <span style={{ color: 'var(--fg-1)' }}>{product.sku_prefix}</span>
            </nav>
          </div>
        </div>

        {/* Product main */}
        <div className="section" style={{ paddingTop: 60 }}>
          <div className="section-inner">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 440px', gap: 72, alignItems: 'start' }}>

              {/* Left: details */}
              <div>
                {/* Badges */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                  <span style={{ background: product.brand === 'SUG' ? 'var(--sug-blue)' : 'var(--titan-blue)', color: '#fff', fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.1em', padding: '4px 10px', borderRadius: 2 }}>
                    {product.brand}
                  </span>
                  {product.isBestSeller && <span style={{ background: 'var(--sug-orange)', color: '#fff', fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.08em', padding: '4px 10px', borderRadius: 2 }}>{t(lang, 'ขายดี', 'BEST SELLER')}</span>}
                  {product.isNew && <span style={{ background: 'var(--sug-success)', color: '#fff', fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.08em', padding: '4px 10px', borderRadius: 2 }}>NEW</span>}
                </div>

                <h1 style={{
                  fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)',
                  fontSize: lang === 'th' ? 28 : 26,
                  fontWeight: 700,
                  margin: '0 0 8px',
                  lineHeight: 1.25,
                  color: 'var(--fg-1)',
                }} lang={lang}>
                  {t(lang, product.name_th, product.name_en)}
                </h1>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--fg-3)', textTransform: 'uppercase', marginBottom: 24 }}>
                  SKU SERIES: {product.sku_prefix}
                </div>

                {/* Product image */}
                {product.image ? (
                  <div style={{
                    background: 'linear-gradient(155deg, #2B2C91 0%, #191A6B 100%)',
                    borderRadius: 'var(--radius-2)',
                    padding: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 300,
                    marginBottom: 40,
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, background: 'radial-gradient(circle, rgba(239,90,28,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />
                    <img src={product.image} alt={t(lang, product.name_th, product.name_en)} style={{ maxHeight: 220, maxWidth: '80%', objectFit: 'contain', position: 'relative', zIndex: 1 }} />
                  </div>
                ) : (
                  <div style={{ background: 'var(--sug-paper)', border: '1px solid var(--sug-fog)', borderRadius: 'var(--radius-2)', height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', color: 'var(--fg-3)', textTransform: 'uppercase' }}>{product.sku_prefix}</span>
                  </div>
                )}

                {/* Description */}
                <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 12 }}>
                  {t(lang, 'รายละเอียด', 'DESCRIPTION')}
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--fg-2)', margin: '0 0 40px', maxWidth: 600 }} lang={lang}>
                  {t(lang, product.desc_th, product.desc_en)}
                </p>

                {/* Standards */}
                <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 14 }}>
                  {t(lang, 'มาตรฐาน', 'STANDARDS')}
                </h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
                  {product.standards.map(std => (
                    <span key={std} style={{ border: '1px solid var(--sug-fog)', background: 'var(--sug-paper)', padding: '6px 14px', borderRadius: 2, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', fontWeight: 600, color: 'var(--fg-2)' }}>
                      {std}
                    </span>
                  ))}
                </div>

                {/* Specs table */}
                <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 14 }}>
                  {t(lang, 'ข้อมูลทางเทคนิค', 'TECHNICAL SPECS')}
                </h2>
                <div style={{ border: '1px solid var(--sug-fog)', borderRadius: 'var(--radius-2)', overflow: 'hidden', marginBottom: 40 }}>
                  {product.specs.map((spec, i) => (
                    <div key={spec.key} style={{
                      display: 'grid',
                      gridTemplateColumns: '180px 1fr',
                      gap: 20,
                      padding: '14px 20px',
                      background: i % 2 === 0 ? '#fff' : 'var(--sug-paper)',
                      borderBottom: i < product.specs.length - 1 ? '1px solid var(--sug-fog)' : 'none',
                    }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--fg-3)', textTransform: 'uppercase' }} lang={lang}>{spec.key}</span>
                      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--fg-1)' }}>{spec.value}</span>
                    </div>
                  ))}
                </div>

                {/* Variant table */}
                <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 14 }}>
                  {t(lang, 'ขนาดที่จำหน่าย', 'AVAILABLE SIZES')}
                </h2>
                <VariantTable
                  variants={product.variants}
                  lang={lang}
                  selected={selectedSku || product.variants[0]?.sku}
                  onSelect={setSelectedSku}
                />
              </div>

              {/* Right: quote panel (sticky) */}
              <div style={{ position: 'sticky', top: 90 }}>
                <div style={{
                  border: '1px solid var(--border-hairline)',
                  borderRadius: 'var(--radius-2)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-3)',
                }}>
                  {/* Panel header */}
                  <div style={{ background: 'var(--sug-ink)', padding: '24px 28px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
                      {t(lang, 'ขอใบเสนอราคา', 'REQUEST QUOTE')}
                    </div>
                    <div style={{ fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-display)', fontSize: lang === 'th' ? 18 : 20, fontWeight: 700, color: '#fff', lineHeight: 1.2, textTransform: lang === 'th' ? 'none' : 'uppercase' }} lang={lang}>
                      {t(lang, 'รับราคาใน 24 ชั่วโมง', 'Price within 24 hours')}
                    </div>
                  </div>

                  {/* Panel body */}
                  {quoteSent ? (
                    <div style={{ padding: '40px 28px', textAlign: 'center' }}>
                      <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
                      <h3 style={{ fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)', fontSize: 18, fontWeight: 700, margin: '0 0 12px', color: 'var(--sug-success)' }} lang={lang}>
                        {t(lang, 'รับคำขอแล้ว', 'Request received!')}
                      </h3>
                      <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.65 }} lang={lang}>
                        {t(lang, 'ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง', 'Our team will contact you within 24 hours.')}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleQuoteSubmit} style={{ padding: '28px' }}>
                      {/* Selected variant */}
                      <div style={{ marginBottom: 20 }}>
                        <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-3)', display: 'block', marginBottom: 8 }}>
                          {t(lang, 'ขนาดที่เลือก', 'SELECTED SIZE')}
                        </label>
                        <select
                          value={selectedSku || product.variants[0]?.sku}
                          onChange={e => setSelectedSku(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 14px',
                            border: '1px solid var(--sug-fog)',
                            borderRadius: 'var(--radius-1)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 13,
                            background: '#fff',
                            color: 'var(--fg-1)',
                            cursor: 'pointer',
                            outline: 'none',
                          }}
                        >
                          {product.variants.map(v => (
                            <option key={v.sku} value={v.sku} disabled={!v.in_stock}>
                              {v.sku} · {v.size} {!v.in_stock ? `(${t(lang, 'หมด', 'out of stock')})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity */}
                      <div style={{ marginBottom: 20 }}>
                        <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-3)', display: 'block', marginBottom: 8 }}>
                          {t(lang, 'ปริมาณที่ต้องการ (ชิ้น)', 'QTY NEEDED (pcs)')}
                        </label>
                        <input
                          type="number"
                          min="1"
                          placeholder={t(lang, 'เช่น 5000', 'e.g. 5000')}
                          value={quoteQty}
                          onChange={e => setQuoteQty(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 14px',
                            border: '1px solid var(--sug-fog)',
                            borderRadius: 'var(--radius-1)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 13,
                            outline: 'none',
                            color: 'var(--fg-1)',
                          }}
                        />
                      </div>

                      {/* Name */}
                      <div style={{ marginBottom: 20 }}>
                        <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-3)', display: 'block', marginBottom: 8 }}>
                          {t(lang, 'ชื่อ / บริษัท', 'NAME / COMPANY')}
                        </label>
                        <input
                          type="text"
                          placeholder={t(lang, 'ชื่อของท่าน หรือชื่อบริษัท', 'Your name or company')}
                          style={{
                            width: '100%',
                            padding: '12px 14px',
                            border: '1px solid var(--sug-fog)',
                            borderRadius: 'var(--radius-1)',
                            fontFamily: 'var(--font-body)',
                            fontSize: 13,
                            outline: 'none',
                            color: 'var(--fg-1)',
                          }}
                        />
                      </div>

                      {/* Phone */}
                      <div style={{ marginBottom: 24 }}>
                        <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-3)', display: 'block', marginBottom: 8 }}>
                          {t(lang, 'เบอร์โทรศัพท์', 'PHONE')}
                        </label>
                        <input
                          type="tel"
                          placeholder="0xx-xxx-xxxx"
                          style={{
                            width: '100%',
                            padding: '12px 14px',
                            border: '1px solid var(--sug-fog)',
                            borderRadius: 'var(--radius-1)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 13,
                            outline: 'none',
                            color: 'var(--fg-1)',
                          }}
                        />
                      </div>

                      <button type="submit" className="btn-orange-lg" style={{ width: '100%', justifyContent: 'center', borderRadius: 'var(--radius-1)' }}>
                        {t(lang, 'ส่งคำขอใบเสนอราคา', 'Send Quote Request')} →
                      </button>
                    </form>
                  )}

                  {/* Quick contact */}
                  <div style={{ padding: '20px 28px', background: 'var(--sug-paper)', borderTop: '1px solid var(--sug-fog)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 12 }}>
                      {t(lang, 'หรือติดต่อตรง', 'OR CONTACT DIRECTLY')}
                    </div>
                    <a href="tel:+6624206734" style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 15, fontWeight: 600, color: 'var(--fg-1)', textDecoration: 'none', marginBottom: 8, transition: 'color 120ms' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--sug-orange)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-1)')}>
                      📞 02-420-6734-6
                    </a>
                    <a href="https://line.me/R/ti/p/@sugbolts" target="_blank" rel="noopener noreferrer"
                      style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, fontWeight: 500, color: 'var(--fg-2)', textDecoration: 'none', transition: 'color 120ms' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--sug-orange)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-2)')}>
                      LINE: @sugbolts →
                    </a>
                  </div>
                </div>

                {/* Pack note */}
                <div style={{ marginTop: 16, padding: '14px 18px', background: 'rgba(43,44,145,0.06)', border: '1px solid var(--sug-blue-200)', borderRadius: 'var(--radius-1)' }}>
                  <p style={{ fontSize: 13, color: 'var(--sug-blue)', lineHeight: 1.55, margin: 0 }} lang={lang}>
                    {t(lang,
                      `📦 บรรจุ ${selectedVariant?.pack_qty?.toLocaleString() ?? '—'} ชิ้น/ถุง · ราคาพิเศษสำหรับการสั่งซื้อ 10 ถุงขึ้นไป`,
                      `📦 Pack of ${selectedVariant?.pack_qty?.toLocaleString() ?? '—'} pcs · Special pricing for 10+ bags`
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Related products */}
            {relatedProducts.length > 0 && (
              <div style={{ marginTop: 96, paddingTop: 64, borderTop: '1px solid var(--sug-fog)' }}>
                <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 32 }}>
                  {t(lang, 'สินค้าอื่นในหมวดเดียวกัน', 'MORE IN THIS CATEGORY')}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, background: 'var(--sug-fog)', border: '1px solid var(--sug-fog)' }}>
                  {relatedProducts.map(p => (
                    <Link
                      key={p.id}
                      href={`/products/${p.system}/${p.id}`}
                      style={{ background: '#fff', padding: 28, display: 'flex', flexDirection: 'column', gap: 10, textDecoration: 'none', transition: 'background 180ms', borderBottom: '2px solid transparent' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--sug-paper)'; e.currentTarget.style.borderBottomColor = 'var(--sug-orange)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderBottomColor = 'transparent'; }}
                    >
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--sug-orange)' }}>{p.sku_prefix}</span>
                      <span style={{ fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)', fontSize: 15, fontWeight: 700, color: 'var(--fg-1)', lineHeight: 1.3 }} lang={lang}>
                        {t(lang, p.name_th, p.name_en)}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>
                        {p.variants.length} {t(lang, 'ขนาด', 'sizes')}
                      </span>
                    </Link>
                  ))}
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
