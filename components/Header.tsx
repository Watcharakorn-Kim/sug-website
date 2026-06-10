'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDealerAuth } from '@/lib/dealerAuth';

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
  const { user, logout } = useDealerAuth();
  const [hoveredBrand, setHoveredBrand] = useState<string>('SUG');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);

  const t = (th: string, en: string) => lang === 'en' ? en : th;
  const activeBrand = BRAND_MENU.find(b => b.key === hoveredBrand) || BRAND_MENU[0];

  const navLinks = [
    { key: 'products', th: 'สินค้า', en: 'Products', href: '/catalog', hasMega: true },
    { key: 'brands', th: 'แบรนด์', en: 'Brands', href: '/#brands' },
    { key: 'catalog', th: 'แค็ตตาล็อก', en: 'Catalog', href: '/catalog' },
    { key: 'dealer', th: 'สำหรับตัวแทน', en: 'For Dealers', href: '/portal' },
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
            {user ? (
              <div style={{ position: 'relative' }}>
                <div className="acct-chip" onClick={() => setAcctOpen(o => !o)}>
                  <span className="acct-avatar">{user.company.slice(0, 2)}</span>
                  <span>
                    <span className="acct-name" style={{ display: 'block', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.company}
                    </span>
                    <span className="acct-tier">{user.tier.toUpperCase()} · {user.id}</span>
                  </span>
                </div>
                {acctOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    background: '#fff',
                    border: '1px solid var(--border-hairline)',
                    borderRadius: 'var(--radius-2)',
                    boxShadow: 'var(--shadow-3)',
                    minWidth: 200,
                    zIndex: 200,
                    overflow: 'hidden'
                  }}>
                    <Link href="/portal" className="nav-link" style={{ display: 'block', padding: '12px 16px', borderBottom: '1px solid var(--border-hairline)', fontSize: 14 }} lang={lang}>
                      {t('แดชบอร์ดบัญชี', 'Account Dashboard')}
                    </Link>
                    <button
                      onClick={() => { logout(); setAcctOpen(false); }}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px', fontSize: 14, background: 'none', border: 'none', color: 'var(--fg-2)', cursor: 'pointer' }}
                      lang={lang}
                    >
                      {t('ออกจากระบบ', 'Sign Out')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/portal" className="nav-link" style={{ fontSize: 13, fontWeight: 600, color: 'var(--sug-steel)', marginRight: 10 }} lang={lang}>
                  {t('เข้าสู่ระบบตัวแทน', 'Dealer Login')}
                </Link>
                <Link href="/contact" className="btn-contact" lang={lang}>
                  {t('ติดต่อฝ่ายขาย', 'Contact Sales')} <span className="arr">→</span>
                </Link>
              </>
            )}

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
