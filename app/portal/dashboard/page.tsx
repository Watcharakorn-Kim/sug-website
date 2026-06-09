'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DealerAuthProvider, useDealerAuth, TIER_CONFIG } from '@/lib/dealerAuth';
import { PRODUCTS, CATEGORIES, type Product } from '@/lib/products';

type Lang = 'th' | 'en';
const t = (lang: Lang, th: string, en: string) => lang === 'en' ? en : th;

// ── Mock order history ────────────────────────────────────────────────────
const MOCK_ORDERS = [
  { id: 'ORD-2024-0891', date: '2024-12-05', items: 3, amount: 24800, status: 'delivered', status_th: 'จัดส่งแล้ว' },
  { id: 'ORD-2024-0876', date: '2024-11-28', items: 6, amount: 56200, status: 'delivered', status_th: 'จัดส่งแล้ว' },
  { id: 'ORD-2024-0844', date: '2024-11-15', items: 2, amount: 12400, status: 'delivered', status_th: 'จัดส่งแล้ว' },
];

const MOCK_QUOTES = [
  { id: 'QUO-2024-0124', date: '2024-12-08', items: 4, amount: 38500, status: 'pending', status_th: 'รอการยืนยัน' },
  { id: 'QUO-2024-0119', date: '2024-12-01', items: 2, amount: 15200, status: 'approved', status_th: 'อนุมัติแล้ว' },
];

// ── Dashboard content ─────────────────────────────────────────────────────
function DashboardContent() {
  const { user, logout } = useDealerAuth();
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('th');
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'quotes' | 'downloads'>('overview');
  const [quoteItems, setQuoteItems] = useState<{ product: Product; sku: string; qty: number }[]>([]);

  useEffect(() => {
    if (!user) router.push('/portal');
  }, [user, router]);

  if (!user) return null;

  const tier = TIER_CONFIG[user.tier];
  const creditLeft = user.creditLimit - user.creditUsed;
  const creditPct = (user.creditUsed / user.creditLimit) * 100;
  const bestSellers = PRODUCTS.filter(p => p.isBestSeller).slice(0, 6);

  const addToQuote = (product: Product) => {
    const sku = product.variants[0]?.sku;
    if (!sku) return;
    setQuoteItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, sku, qty: 1 }];
    });
  };

  const navItems = [
    { key: 'overview', icon: '🏠', th: 'ภาพรวม', en: 'Overview' },
    { key: 'products', icon: '🔩', th: 'เลือกสินค้า', en: 'Products' },
    { key: 'quotes', icon: '📋', th: 'ใบเสนอราคา', en: 'Quotes' },
    { key: 'orders', icon: '📦', th: 'ประวัติคำสั่งซื้อ', en: 'Orders' },
    { key: 'downloads', icon: '📄', th: 'ดาวน์โหลด', en: 'Downloads' },
  ] as const;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9FC', fontFamily: 'var(--font-body)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 260, flexShrink: 0,
        background: 'var(--sug-ink)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/sug-logo-official.png" alt="SUG" style={{ height: 32, width: 'auto' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, letterSpacing: '-0.01em', color: '#fff', textTransform: 'uppercase' }}>SUG</span>
          </Link>
          <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>DEALER PORTAL</div>
        </div>

        {/* User card */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: tier.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {user.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.2, fontFamily: 'var(--font-thai)' }}>{user.name}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-thai)', marginTop: 2 }}>{user.company}</div>
            </div>
          </div>
          {/* Tier badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.08)', border: `1px solid ${tier.color}40`, borderRadius: 20, padding: '4px 12px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: tier.color }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: tier.color }}>{tier.label.toUpperCase()}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{tier.discount}% OFF</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                padding: '12px 14px', borderRadius: 'var(--radius-1)',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                fontSize: 14, fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)',
                fontWeight: activeTab === item.key ? 600 : 400,
                background: activeTab === item.key ? 'rgba(239,90,28,0.2)' : 'transparent',
                color: activeTab === item.key ? 'var(--sug-orange)' : 'rgba(255,255,255,0.6)',
                transition: 'all 150ms',
                marginBottom: 2,
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {t(lang, item.th, item.en)}
              {item.key === 'quotes' && quoteItems.length > 0 && (
                <span style={{ marginLeft: 'auto', background: 'var(--sug-orange)', color: '#fff', borderRadius: 10, padding: '2px 7px', fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  {quoteItems.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <button onClick={() => setLang(l => l === 'th' ? 'en' : 'th')}
              style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: 'rgba(255,255,255,0.5)', padding: '6px 12px', borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: 10, cursor: 'pointer' }}>
              {lang === 'th' ? 'EN' : 'TH'}
            </button>
            <button onClick={logout}
              style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '6px 14px', borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: 10, cursor: 'pointer', letterSpacing: '0.06em' }}>
              LOGOUT
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Top bar */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--sug-fog)', padding: '16px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-2)', margin: 0 }}>
            {navItems.find(n => n.key === activeTab) && t(lang, navItems.find(n => n.key === activeTab)!.th, navItems.find(n => n.key === activeTab)!.en)}
          </h1>
          <a href="tel:+6624206734" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--sug-orange)', letterSpacing: '0.06em', textDecoration: 'none' }}>
            📞 02-420-6734-6
          </a>
        </div>

        {/* Content */}
        <div style={{ padding: '40px 36px' }}>

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div>
              <h2 style={{ fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)', fontSize: 22, fontWeight: 700, margin: '0 0 8px', color: 'var(--fg-1)' }} lang={lang}>
                {t(lang, `สวัสดี คุณ${user.name.split(' ')[1] ?? user.name}`, `Welcome back, ${user.name}`)}
              </h2>
              <p style={{ color: 'var(--fg-3)', fontSize: 14, margin: '0 0 36px' }} lang={lang}>
                {t(lang, user.province + ' · ' + user.company, user.company + ' · ' + user.province)}
              </p>

              {/* Stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 36 }}>
                {[
                  { icon: '💳', label_th: 'วงเงินเครดิต', label_en: 'Credit Limit', value: `฿${user.creditLimit.toLocaleString()}`, sub: '', color: 'var(--sug-blue)' },
                  { icon: '📤', label_th: 'ใช้งานแล้ว', label_en: 'Credit Used', value: `฿${user.creditUsed.toLocaleString()}`, sub: `${Math.round(creditPct)}% used`, color: creditPct > 80 ? '#ef4444' : '#f59e0b' },
                  { icon: '✅', label_th: 'วงเงินคงเหลือ', label_en: 'Available Credit', value: `฿${creditLeft.toLocaleString()}`, sub: '', color: '#16a34a' },
                  { icon: '🏆', label_th: 'ระดับตัวแทน', label_en: 'Dealer Tier', value: tier.label, sub: `${tier.discount}% discount`, color: tier.color },
                ].map(s => (
                  <div key={s.label_th} style={{ background: '#fff', border: '1px solid var(--sug-fog)', borderRadius: 'var(--radius-2)', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 24, opacity: 0.15 }}>{s.icon}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 12 }} lang={lang}>
                      {t(lang, s.label_th, s.label_en)}
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    {s.sub && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)', marginTop: 6 }}>{s.sub}</div>}
                  </div>
                ))}
              </div>

              {/* Credit bar */}
              <div style={{ background: '#fff', border: '1px solid var(--sug-fog)', borderRadius: 'var(--radius-2)', padding: '24px', marginBottom: 36 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
                    {t(lang, 'การใช้วงเงินเครดิต', 'CREDIT UTILISATION')}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: creditPct > 80 ? '#ef4444' : 'var(--fg-2)' }}>
                    {Math.round(creditPct)}%
                  </span>
                </div>
                <div style={{ height: 8, background: 'var(--sug-fog)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${creditPct}%`, background: creditPct > 80 ? '#ef4444' : creditPct > 60 ? '#f59e0b' : 'var(--sug-blue)', borderRadius: 4, transition: 'width 800ms cubic-bezier(.16,1,.3,1)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)' }}>
                  <span>฿{user.creditUsed.toLocaleString()} {t(lang, 'ใช้งาน', 'used')}</span>
                  <span>฿{user.creditLimit.toLocaleString()} {t(lang, 'ทั้งหมด', 'limit')}</span>
                </div>
              </div>

              {/* Recent orders */}
              <div style={{ background: '#fff', border: '1px solid var(--sug-fog)', borderRadius: 'var(--radius-2)', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--sug-fog)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-3)', margin: 0 }}>
                    {t(lang, 'คำสั่งซื้อล่าสุด', 'RECENT ORDERS')}
                  </h3>
                  <button onClick={() => setActiveTab('orders')} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--sug-orange)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {t(lang, 'ดูทั้งหมด →', 'View all →')}
                  </button>
                </div>
                {MOCK_ORDERS.map((o, i) => (
                  <div key={o.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 120px 100px', gap: 16, padding: '16px 24px', borderBottom: i < MOCK_ORDERS.length - 1 ? '1px solid var(--sug-fog)' : 'none', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--fg-1)' }}>{o.id}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>{o.date}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-2)', textAlign: 'center' }}>{o.items} {t(lang, 'รายการ', 'items')}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--fg-1)', textAlign: 'right' }}>฿{o.amount.toLocaleString()}</div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ background: '#dcfce7', color: '#16a34a', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', padding: '4px 10px', borderRadius: 20 }}>
                        {t(lang, o.status_th, o.status.toUpperCase())}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PRODUCTS ── */}
          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-3)', margin: '0 0 4px' }}>
                    {t(lang, 'เลือกสินค้าเพื่อขอราคา', 'SELECT PRODUCTS TO QUOTE')}
                  </h2>
                  <p style={{ fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)', fontSize: 13, color: 'var(--fg-3)', margin: 0 }} lang={lang}>
                    {t(lang, `ราคาตัวแทนของคุณ: ลด ${tier.discount}% จากราคาปกติ`, `Your dealer price: ${tier.discount}% off standard pricing`)}
                  </p>
                </div>
                {quoteItems.length > 0 && (
                  <button onClick={() => setActiveTab('quotes')} style={{ background: 'var(--sug-orange)', color: '#fff', padding: '12px 22px', border: 'none', borderRadius: 'var(--radius-1)', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    📋 {t(lang, 'ดูรายการขอราคา', 'View Quote')} ({quoteItems.length})
                  </button>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 2, background: 'var(--sug-fog)', border: '1px solid var(--sug-fog)' }}>
                {PRODUCTS.map(p => (
                  <div key={p.id} style={{ background: '#fff', padding: '24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span style={{ background: p.brand === 'SUG' ? 'var(--sug-blue)' : 'var(--titan-blue)', color: '#fff', fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.1em', padding: '3px 8px', borderRadius: 2 }}>{p.brand}</span>
                      {p.isBestSeller && <span style={{ background: 'var(--sug-orange)', color: '#fff', fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600, padding: '3px 8px', borderRadius: 2 }}>{t(lang, 'ขายดี', 'HOT')}</span>}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)' }}>{p.sku_prefix}</div>
                    <div style={{ fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)', fontSize: 14, fontWeight: 700, color: 'var(--fg-1)', lineHeight: 1.3 }} lang={lang}>
                      {t(lang, p.name_th, p.name_en)}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--sug-success)', fontWeight: 600 }}>
                      {p.variants.filter(v => v.in_stock).length}/{p.variants.length} {t(lang, 'ขนาดมีสต็อก', 'sizes in stock')}
                    </div>
                    <button
                      onClick={() => addToQuote(p)}
                      style={{ marginTop: 'auto', background: quoteItems.some(i => i.product.id === p.id) ? 'var(--sug-success)' : 'var(--sug-ink)', color: '#fff', border: 'none', padding: '10px', borderRadius: 'var(--radius-1)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 180ms' }}
                    >
                      {quoteItems.some(i => i.product.id === p.id) ? (t(lang, '✓ เพิ่มแล้ว', '✓ Added')) : (t(lang, '+ เพิ่มในรายการ', '+ Add to Quote'))}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── QUOTES ── */}
          {activeTab === 'quotes' && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 28 }}>
                {t(lang, 'รายการขอใบเสนอราคา', 'QUOTE REQUESTS')}
              </h2>
              {quoteItems.length > 0 && (
                <div style={{ background: '#fff', border: '1px solid var(--sug-fog)', borderRadius: 'var(--radius-2)', overflow: 'hidden', marginBottom: 32 }}>
                  <div style={{ padding: '20px 24px', background: 'var(--sug-ink)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    {t(lang, 'รายการใหม่', 'CURRENT DRAFT')} — {quoteItems.length} {t(lang, 'รายการ', 'items')}
                  </div>
                  {quoteItems.map((item, i) => (
                    <div key={item.product.id} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px auto', gap: 16, padding: '16px 24px', borderBottom: '1px solid var(--sug-fog)', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)', fontSize: 14, fontWeight: 700, color: 'var(--fg-1)' }} lang={lang}>
                          {t(lang, item.product.name_th, item.product.name_en)}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)', marginTop: 4 }}>SKU: {item.sku}</div>
                      </div>
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={e => setQuoteItems(prev => prev.map((qi, j) => j === i ? { ...qi, qty: parseInt(e.target.value) || 1 } : qi))}
                        style={{ padding: '8px 12px', border: '1px solid var(--sug-fog)', borderRadius: 'var(--radius-1)', fontFamily: 'var(--font-mono)', fontSize: 13, textAlign: 'center', outline: 'none', color: 'var(--fg-1)' }}
                      />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', textAlign: 'center' }}>
                        {item.product.variants[0]?.pack_qty} {t(lang, 'ชิ้น/ถุง', 'pcs/bag')}
                      </span>
                      <button onClick={() => setQuoteItems(prev => prev.filter((_, j) => j !== i))}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 18 }}>×</button>
                    </div>
                  ))}
                  <div style={{ padding: '20px 24px', display: 'flex', gap: 12 }}>
                    <button style={{ background: 'var(--sug-orange)', color: '#fff', padding: '12px 24px', border: 'none', borderRadius: 'var(--radius-1)', fontWeight: 700, fontSize: 14, cursor: 'pointer', flex: 1 }}
                      onClick={() => alert(t(lang, 'ส่งคำขอเรียบร้อย! ทีมงานจะติดต่อภายใน 24 ชั่วโมง', 'Quote sent! Our team will contact you within 24 hours.'))}>
                      {t(lang, 'ส่งคำขอใบเสนอราคา', 'Send Quote Request')} →
                    </button>
                    <button style={{ background: 'none', border: '1px solid var(--sug-fog)', color: 'var(--fg-2)', padding: '12px 20px', borderRadius: 'var(--radius-1)', cursor: 'pointer', fontSize: 14 }}
                      onClick={() => setQuoteItems([])}>
                      {t(lang, 'ล้างรายการ', 'Clear')}
                    </button>
                  </div>
                </div>
              )}

              {/* Historical quotes */}
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 16 }}>
                {t(lang, 'ประวัติใบเสนอราคา', 'QUOTE HISTORY')}
              </h3>
              <div style={{ background: '#fff', border: '1px solid var(--sug-fog)', borderRadius: 'var(--radius-2)', overflow: 'hidden' }}>
                {MOCK_QUOTES.map((q, i) => (
                  <div key={q.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 120px 120px', gap: 16, padding: '18px 24px', borderBottom: i < MOCK_QUOTES.length - 1 ? '1px solid var(--sug-fog)' : 'none', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--fg-1)' }}>{q.id}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>{q.date}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-2)', textAlign: 'center' }}>{q.items} {t(lang, 'รายการ', 'items')}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--fg-1)', textAlign: 'right' }}>฿{q.amount.toLocaleString()}</div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ background: q.status === 'approved' ? '#dcfce7' : '#fef9c3', color: q.status === 'approved' ? '#16a34a' : '#ca8a04', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', padding: '4px 10px', borderRadius: 20 }}>
                        {t(lang, q.status_th, q.status.toUpperCase())}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {activeTab === 'orders' && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 28 }}>
                {t(lang, 'ประวัติคำสั่งซื้อ', 'ORDER HISTORY')}
              </h2>
              <div style={{ background: '#fff', border: '1px solid var(--sug-fog)', borderRadius: 'var(--radius-2)', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 120px 120px', gap: 16, padding: '12px 24px', background: 'var(--sug-paper)', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
                  <span>{t(lang, 'เลขที่คำสั่งซื้อ', 'ORDER NO.')}</span>
                  <span style={{ textAlign: 'center' }}>{t(lang, 'รายการ', 'ITEMS')}</span>
                  <span style={{ textAlign: 'right' }}>{t(lang, 'ยอดรวม', 'TOTAL')}</span>
                  <span style={{ textAlign: 'right' }}>{t(lang, 'สถานะ', 'STATUS')}</span>
                </div>
                {MOCK_ORDERS.map((o, i) => (
                  <div key={o.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 120px 120px', gap: 16, padding: '18px 24px', borderTop: '1px solid var(--sug-fog)', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--fg-1)' }}>{o.id}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>{o.date}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-2)', textAlign: 'center' }}>{o.items}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--fg-1)', textAlign: 'right' }}>฿{o.amount.toLocaleString()}</div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ background: '#dcfce7', color: '#16a34a', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
                        {t(lang, o.status_th, 'DELIVERED')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── DOWNLOADS ── */}
          {activeTab === 'downloads' && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 28 }}>
                {t(lang, 'เอกสารสำหรับตัวแทน', 'DEALER DOCUMENTS')}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {[
                  { icon: '📋', name_th: 'ใบราคาตัวแทน 2024', name_en: 'Dealer Price List 2024', size: '2.4 MB', tag: 'EXCLUSIVE' },
                  { icon: '📚', name_th: 'แค็ตตาล็อกรวม SUG 2026', name_en: 'SUG Full Catalog 2026', size: '8.1 MB', tag: 'PDF' },
                  { icon: '📚', name_th: 'แค็ตตาล็อก TITAN 2023', name_en: 'TITAN Catalog 2023', size: '5.3 MB', tag: 'PDF' },
                  { icon: '🔬', name_th: 'ผลทดสอบ Salt-spray 1000h', name_en: 'Salt-spray Test Report 1000h', size: '1.2 MB', tag: 'CERT' },
                  { icon: '📜', name_th: 'ใบรับรอง AS3566 Class 3', name_en: 'AS3566 Class 3 Certificate', size: '0.8 MB', tag: 'CERT' },
                  { icon: '📜', name_th: 'ใบรับรอง Bureau Veritas', name_en: 'Bureau Veritas Certificate', size: '0.6 MB', tag: 'CERT' },
                  { icon: '⚙️', name_th: 'คู่มือการติดตั้งสกรูหลังคา', name_en: 'Roofing Screw Installation Guide', size: '3.2 MB', tag: 'GUIDE' },
                  { icon: '📊', name_th: 'ตารางแรงขันสกรู (Torque Chart)', name_en: 'Torque Chart — All Products', size: '0.4 MB', tag: 'TECH' },
                ].map(d => (
                  <div key={d.name_en} style={{ background: '#fff', border: '1px solid var(--sug-fog)', borderRadius: 'var(--radius-2)', padding: '24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 28 }}>{d.icon}</span>
                      <span style={{ background: d.tag === 'EXCLUSIVE' ? 'var(--sug-orange)' : 'var(--sug-paper)', color: d.tag === 'EXCLUSIVE' ? '#fff' : 'var(--fg-3)', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', padding: '3px 8px', borderRadius: 2 }}>
                        {d.tag}
                      </span>
                    </div>
                    <div style={{ fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)', fontSize: 15, fontWeight: 700, color: 'var(--fg-1)', lineHeight: 1.3 }} lang={lang}>
                      {t(lang, d.name_th, d.name_en)}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)' }}>PDF · {d.size}</div>
                    <button style={{ background: 'var(--sug-ink)', color: '#fff', border: 'none', padding: '10px', borderRadius: 'var(--radius-1)', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 'auto', transition: 'background 180ms' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--sug-orange)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'var(--sug-ink)')}>
                      ⬇ {t(lang, 'ดาวน์โหลด', 'Download')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DealerAuthProvider>
      <DashboardContent />
    </DealerAuthProvider>
  );
}
