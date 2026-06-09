'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { Footer } from '@/components/Sections';

type Lang = 'th' | 'en';
const t = (lang: Lang, th: string, en: string) => lang === 'en' ? en : th;

const CATEGORIES = [
  {
    brand: 'SUG',
    key: 'roofing',
    th: 'ระบบหลังคา',
    en: 'Roofing System',
    desc_th: 'สกรูปลายสว่าน Bi-Metal 304 · กระเบื้องหลังคา · เมทัลชีต · EPDM',
    desc_en: 'Bi-Metal 304 self-drilling screws · tile · metal sheet · EPDM',
    std: 'AS3566 · SALT-SPRAY 1000H',
    count: '2,400+',
    color: '#2B2C91',
  },
  {
    brand: 'SUG',
    key: 'multipurpose',
    th: 'งานอเนกประสงค์',
    en: 'Multipurpose',
    desc_th: 'แปะแนงเหล็ก · WAVE DOME · สกรูไม้ทั่วไป',
    desc_en: 'Steel purlins · WAVE DOME · general wood screws',
    std: 'T-17 · SD POINT',
    count: '1,800+',
    color: '#2B2C91',
  },
  {
    brand: 'SUG',
    key: 'wall',
    th: 'ผนัง / ไฟเบอร์ซีเมนต์',
    en: 'Wall / Fibre-cement',
    desc_th: 'CSH · RIB · FMC · ไม้ฝา · ซีเมนต์บอร์ด',
    desc_en: 'CSH · RIB · FMC · lap board · cement board',
    std: 'DIN 7504',
    count: '900+',
    color: '#2B2C91',
  },
  {
    brand: 'SUG',
    key: 'concrete',
    th: 'งานคอนกรีต',
    en: 'Concrete',
    desc_th: 'หัวเหลี่ยม · FH · PH · HEX FLANGE',
    desc_en: 'Hex head · FH · PH · hex flange',
    std: 'ETA · DIN',
    count: '650+',
    color: '#2B2C91',
  },
  {
    brand: 'SUG',
    key: 'accessories',
    th: 'อุปกรณ์เสริม',
    en: 'Accessories',
    desc_th: 'EPDM · รางน้ำ · แป · เครื่องมือ · อุปกรณ์ยึด',
    desc_en: 'EPDM · gutters · purlins · tools · fixing accessories',
    std: 'MADE-TO-SPEC',
    count: '1,200+',
    color: '#2B2C91',
  },
  {
    brand: 'TITAN',
    key: 'general',
    th: 'น็อตมาตรฐานทั่วไป',
    en: 'General Standard Nuts',
    desc_th: 'สลักเกลียว น็อต แหวน ทุกขนาดมาตรฐาน DIN',
    desc_en: 'Bolts, nuts, washers — all standard DIN sizes',
    std: 'DIN · ISO · JIS',
    count: '8,000+',
    color: '#202B77',
  },
  {
    brand: 'TITAN',
    key: 'electrical',
    th: 'อุตสาหกรรมงานไฟฟ้า',
    en: 'Electrical Industry',
    desc_th: 'ตู้ไฟ · ราง · กราวด์ · cable tray · conduit',
    desc_en: 'Electrical enclosures · cable trays · grounding',
    std: 'IEC · DIN',
    count: '2,600+',
    color: '#202B77',
  },
  {
    brand: 'TITAN',
    key: 'stainless',
    th: 'อุตสาหกรรมงานสเตนเลส',
    en: 'Stainless Industry',
    desc_th: 'SUS304 · SUS316 ทนกรด-ด่าง ทุกประเภท',
    desc_en: 'SUS304 · SUS316 — acid & alkali resistant',
    std: 'ASTM A193 · DIN',
    count: '3,200+',
    color: '#202B77',
  },
  {
    brand: 'TITAN',
    key: 'agri',
    th: 'อุตสาหกรรมงานเกษตร',
    en: 'Agriculture Industry',
    desc_th: 'เครื่องจักรกลเกษตร · heavy-duty grade',
    desc_en: 'Agricultural machinery · heavy-duty grade',
    std: 'ISO 8.8 · 10.9',
    count: '1,400+',
    color: '#202B77',
  },
  {
    brand: 'TITAN',
    key: 'plumbing',
    th: 'อุตสาหกรรมงานประปา',
    en: 'Plumbing Industry',
    desc_th: 'ข้อต่อ · วาล์ว · ท่อ · fitting ทุกขนาด',
    desc_en: 'Fittings · valves · pipes — all sizes',
    std: 'WATERWORKS',
    count: '900+',
    color: '#202B77',
  },
];

export default function CatalogPage() {
  const [lang, setLang] = useState<Lang>('th');
  const [filter, setFilter] = useState<'ALL' | 'SUG' | 'TITAN'>('ALL');

  const filtered = filter === 'ALL' ? CATEGORIES : CATEGORIES.filter(c => c.brand === filter);

  return (
    <>
      <Header lang={lang} setLang={setLang} active="products" />
      <main>
        {/* Page hero */}
        <section style={{
          background: 'linear-gradient(155deg, #23247E 0%, #14154F 100%)',
          color: '#fff',
          padding: '80px 0 60px',
        }}>
          <div className="section-inner">
            <span className="section-kicker light">{t(lang, 'สินค้าทั้งหมด', 'ALL PRODUCTS')}</span>
            {lang === 'th' ? (
              <h1 className="section-title-th light" style={{ marginTop: 12 }}>แค็ตตาล็อกสินค้า</h1>
            ) : (
              <h1 className="section-title light" style={{ marginTop: 12 }}>Product Catalog</h1>
            )}
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 17, marginTop: 16, maxWidth: 560 }} lang={lang}>
              {t(lang,
                '50,000+ รายการ ครอบคลุม SUG · TITAN · GIANTLOK · LIO · LOREX — สต็อกพร้อมส่งทั่วประเทศ',
                '50,000+ products across SUG · TITAN · GIANTLOK · LIO · LOREX — in stock, nationwide delivery.')}
            </p>
          </div>
        </section>

        {/* Filter bar */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--sug-fog)', position: 'sticky', top: 73, zIndex: 50 }}>
          <div className="section-inner" style={{ paddingTop: 0, paddingBottom: 0 }}>
            <div style={{ display: 'flex', gap: 4, padding: '16px 0', alignItems: 'center' }}>
              {(['ALL', 'SUG', 'TITAN'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 'var(--radius-2)',
                    border: '1px solid',
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    transition: 'all 180ms',
                    background: filter === f ? 'var(--sug-ink)' : 'transparent',
                    color: filter === f ? '#fff' : 'var(--fg-2)',
                    borderColor: filter === f ? 'var(--sug-ink)' : 'var(--border-hairline)',
                  }}
                >
                  {f === 'ALL' ? t(lang, 'ทั้งหมด', 'ALL') : f}
                </button>
              ))}
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.06em' }}>
                {filtered.length} {t(lang, 'กลุ่มสินค้า', 'categories')}
              </span>
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div className="section" style={{ paddingTop: 60 }}>
          <div className="section-inner">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 2, background: 'var(--sug-fog)', border: '1px solid var(--sug-fog)' }}>
              {filtered.map((cat, i) => (
                <Link
                  key={cat.key}
                  href={`/catalog?brand=${cat.brand}&sys=${cat.key}`}
                  style={{
                    background: '#fff',
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    minHeight: 240,
                    position: 'relative',
                    transition: 'background 180ms',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--sug-paper)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                >
                  {/* Brand badge */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 4,
                  }}>
                    <span style={{
                      background: cat.color,
                      color: '#fff',
                      fontSize: 10,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      padding: '3px 8px',
                      borderRadius: 2,
                    }}>{cat.brand}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.08em' }}>
                      {cat.count} {t(lang, 'รายการ', 'items')}
                    </span>
                  </div>

                  <h3 style={{
                    fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-display)',
                    fontSize: lang === 'th' ? 22 : 26,
                    fontWeight: 700,
                    margin: 0,
                    lineHeight: 1.15,
                    color: 'var(--fg-1)',
                    letterSpacing: lang === 'th' ? 0 : '-0.01em',
                    textTransform: lang === 'th' ? 'none' : 'uppercase',
                  }} lang={lang}>
                    {t(lang, cat.th, cat.en)}
                  </h3>

                  <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.6, margin: 0 }} lang={lang}>
                    {t(lang, cat.desc_th, cat.desc_en)}
                  </p>

                  <div style={{
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--fg-3)',
                  }}>
                    {cat.std}
                  </div>

                  {/* Arrow */}
                  <span style={{
                    position: 'absolute',
                    top: 28,
                    right: 28,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 18,
                    color: 'var(--sug-mist)',
                    transition: 'transform 180ms, color 180ms',
                  }}>→</span>
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div style={{
              marginTop: 80,
              background: 'linear-gradient(155deg, #23247E 0%, #14154F 100%)',
              borderRadius: 'var(--radius-2)',
              padding: '56px 60px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 40,
              flexWrap: 'wrap',
            }}>
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--sug-orange)', marginBottom: 12 }}>
                  {t(lang, 'ต้องการสินค้าเฉพาะทาง?', 'NEED A CUSTOM SPEC?')}
                </p>
                <h3 style={{ fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-display)', fontSize: lang === 'th' ? 28 : 36, fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.1, textTransform: lang === 'th' ? 'none' : 'uppercase' }} lang={lang}>
                  {t(lang, 'ขอใบเสนอราคาได้เลย ใน 24 ชั่วโมง', 'Get a quote within 24 hours.')}
                </h3>
              </div>
              <Link href="/#contact" className="btn-orange-lg" lang={lang} style={{ flexShrink: 0 }}>
                {t(lang, 'ติดต่อฝ่ายขาย', 'Contact Sales')} <span className="arr">→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}
