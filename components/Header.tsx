'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const BRAND_MENU = [
  {
    key: 'SUG',
    logo: '/logo-sug-trans.png',
    note_th: 'สกรูปลายสว่าน & อุปกรณ์ติดตั้งหลังคา',
    note_en: 'Self-drilling screws & roofing accessories',
    cats: [
      ['ระบบหลังคา', 'Roofing', '/catalog?sys=roofing'],
      ['งานอเนกประสงค์', 'Multipurpose', '/catalog?sys=multipurpose'],
      ['ผนัง / ไฟเบอร์ซีเมนต์', 'Wall / Fibre-cement', '/catalog?sys=wall'],
      ['งานคอนกรีต', 'Concrete', '/catalog?sys=concrete'],
      ['อุปกรณ์เสริม', 'Accessories', '/catalog?sys=accessories'],
    ],
  },
  {
    key: 'TITAN',
    logo: '/logo-titan.png',
    note_th: 'สกรู น็อต & สลักภัณฑ์ มาตรฐานงานอุตสาหกรรม',
    note_en: 'Screws, nuts & fasteners — industrial standard',
    cats: [
      ['น็อตมาตรฐานทั่วไป', 'General standard', '/catalog?brand=TITAN'],
      ['งานไฟฟ้า', 'Electrical', '/catalog?brand=TITAN&sys=electrical'],
      ['งานสเตนเลส', 'Stainless', '/catalog?brand=TITAN&sys=stainless'],
      ['งานเกษตร', 'Agriculture', '/catalog?brand=TITAN&sys=agri'],
      ['งานประปา', 'Plumbing', '/catalog?brand=TITAN&sys=plumbing'],
    ],
  },
];

interface HeaderProps {
  lang: 'th' | 'en';
  setLang: (l: 'th' | 'en') => void;
  active?: string;
}

export default function Header({ lang, setLang, active = 'home' }: HeaderProps) {
  const [hoveredBrand, setHoveredBrand] = useState<string>('SUG');
  const [mobileOpen, setMobileOpen] = useState(false);

  const t = (th: string, en: string) => lang === 'en' ? en : th;
  const activeBrand = BRAND_MENU.find(b => b.key === hoveredBrand) || BRAND_MENU[0];

  const navLinks = [
    { key: 'products', th: 'สินค้า', en: 'Products', href: '/catalog', hasMega: true },
    { key: 'about', th: 'เกี่ยวกับเรา', en: 'About', href: '/about' },
    { key: 'compare', th: 'เทียบรหัสคู่แข่ง', en: 'Cross-Reference', href: '/compare' },
    { key: 'resources', th: 'เอกสารเทคนิค', en: 'Resources', href: '/resources' },
    { key: 'dealers', th: 'ตัวแทนจำหน่าย', en: 'Dealers', href: '/dealers' },
    { key: 'contact', th: 'ติดต่อเรา', en: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sug-header">
      {/* Metabar */}
      <div className="sug-metabar">
        <div className="sug-metabar-inner">
          <span>SUG</span>
          <span className="meta-dot">·</span>
          <span>{t('เครือข่ายตัวแทน 77 จังหวัด', 'DEALER NETWORK · 77 PROVINCES')}</span>
          <span className="meta-dot">·</span>
          <span>DIN · JIS · ASME · ANSI · IFI</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className={`lang-btn ${lang === 'th' ? 'active' : ''}`} onClick={() => setLang('th')}>TH</button>
            <span className="lang-sep">/</span>
            <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="sug-nav">
        <div className="sug-nav-inner">
          {/* Logo */}
          <Link href="/" className="sug-logo-link" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            {/* Badge — preserve square aspect ratio */}
            <Image
              src="/sug-logo-official.png"
              alt="SUG"
              width={52}
              height={40}
              priority
              style={{ width: 'auto', height: 44, objectFit: 'contain' }}
            />
            {/* Wordmark */}
            <span style={{
              display: 'flex',
              flexDirection: 'column',
              lineHeight: 1,
              gap: 2,
            }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--sug-ink)',
                textTransform: 'uppercase',
              }}>SUG</span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: '0.18em',
                color: 'var(--sug-steel)',
                textTransform: 'uppercase',
              }}>FASTENER</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="sug-nav-links" aria-label="Main navigation">
            {navLinks.map(item =>
              item.hasMega ? (
                <div key={item.key} className="nav-dropdown-wrap">
                  <Link
                    href={item.href}
                    className={`nav-link ${active === item.key ? 'active' : ''}`}
                    lang={lang}
                  >
                    {t(item.th, item.en)}
                    <span className="nav-caret">▾</span>
                  </Link>
                  {/* Mega menu */}
                  <div className="nav-mega" role="menu">
                    <div className="mega-inner">
                      {/* Brand panel */}
                      <div className="mega-brands">
                        <div className="mega-cat-label" lang={lang}>{t('เลือกแบรนด์', 'BY BRAND')}</div>
                        {BRAND_MENU.map(b => (
                          <button
                            key={b.key}
                            className={`mega-brand-btn ${hoveredBrand === b.key ? 'active' : ''}`}
                            onMouseEnter={() => setHoveredBrand(b.key)}
                            onClick={() => setHoveredBrand(b.key)}
                          >
                            <Image
                              src={b.logo}
                              alt={b.key}
                              width={100}
                              height={32}
                              className="mega-brand-logo"
                            />
                            <span className="mega-brand-note" lang={lang}>{t(b.note_th, b.note_en)}</span>
                          </button>
                        ))}
                      </div>
                      {/* Categories panel */}
                      <div className="mega-cats">
                        <Link href={`/catalog?brand=${activeBrand.key}`} className="mega-all">
                          <div>
                            <div className="mega-all-text" lang={lang}>{t('ดูสินค้าทั้งหมด', 'View all products')}</div>
                            <div className="mega-all-sub">{activeBrand.key} · {t('ครบทุกรายการ', 'Complete range')}</div>
                          </div>
                          <span className="mega-all-arr">→</span>
                        </Link>
                        <div className="mega-cat-label" style={{ marginTop: 12 }} lang={lang}>
                          {t('หมวดสินค้า', 'CATEGORIES')} · {activeBrand.key}
                        </div>
                        <div className="mega-cat-grid">
                          {activeBrand.cats.map(([th, en, href]) => (
                            <Link key={en} href={href} className="mega-cat-item">
                              <span className="mega-cat-th" lang={lang}>{t(th, en)}</span>
                              <span className="mega-cat-en">{t(en, th)}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`nav-link ${active === item.key ? 'active' : ''}`}
                  lang={lang}
                >
                  {t(item.th, item.en)}
                </Link>
              )
            )}
          </nav>

          {/* CTA */}
          <div className="nav-actions">
            <Link href="/search"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, border: '1px solid var(--sug-fog)', color: 'var(--fg-2)', textDecoration: 'none', fontSize: 16, transition: 'all 180ms' }}
              title={t('ค้นหาสินค้า', 'Search products')}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = 'var(--sug-orange)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--sug-orange)'; }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-2)'; e.currentTarget.style.borderColor = 'var(--sug-fog)'; }}
            >
              🔍
            </Link>
            <Link href="/portal"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, border: '1px solid var(--sug-fog)', color: 'var(--fg-2)', textDecoration: 'none', fontSize: 16, transition: 'all 180ms' }}
              title={t('Dealer Portal', 'Dealer Portal')}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = 'var(--sug-blue)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--sug-blue)'; }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-2)'; e.currentTarget.style.borderColor = 'var(--sug-fog)'; }}
            >
              🔒
            </Link>
            <Link href="/contact" className="btn-contact" lang={lang}>
              {t('ติดต่อฝ่ายขาย', 'Contact Sales')} <span className="arr">→</span>
            </Link>
            {/* Mobile burger */}
            <button
              className="mobile-menu-btn"
              aria-label="Open menu"
              onClick={() => setMobileOpen(o => !o)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
