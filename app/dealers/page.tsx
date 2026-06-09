'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import { Footer } from '@/components/Sections';

type Lang = 'th' | 'en';
const t = (lang: Lang, th: string, en: string) => lang === 'en' ? en : th;

// Sample dealer data — 77 provinces grouped by region
const DEALERS = [
  // กรุงเทพและปริมณฑล
  { id: 1, province: 'กรุงเทพมหานคร', region: 'central', name: 'บริษัท SUG ซัพพลาย จำกัด (สำนักงานใหญ่)', address: '168/5 หมู่ 5 ซ.กระทุ่มส้ม 26 ถ.พุทธมณฑลสาย 4 สามพราน นครปฐม 73220', tel: '02-420-6734-6', line: '@sugbolts', tier: 'main' },
  { id: 2, province: 'กรุงเทพมหานคร', region: 'central', name: 'ร้านชัยมงคลวัสดุ', address: 'ถ.รัชดาภิเษก แขวงห้วยขวาง', tel: '02-275-XXXX', line: null, tier: 'gold' },
  { id: 3, province: 'นนทบุรี', region: 'central', name: 'ห้างหุ้นส่วน นนทบุรีก่อสร้าง', address: 'ถ.งามวงศ์วาน เมืองนนทบุรี', tel: '02-588-XXXX', line: null, tier: 'silver' },
  { id: 4, province: 'สมุทรปราการ', region: 'central', name: 'วัสดุสมุทรปราการ 2000', address: 'ถ.สุขุมวิท เมืองสมุทรปราการ', tel: '02-389-XXXX', line: null, tier: 'silver' },
  // ภาคเหนือ
  { id: 5, province: 'เชียงใหม่', region: 'north', name: 'ล้านนาวัสดุ จำกัด', address: 'ถ.เชียงใหม่-ลำปาง เมืองเชียงใหม่', tel: '053-XXX-XXX', line: null, tier: 'gold' },
  { id: 6, province: 'เชียงราย', region: 'north', name: 'ร้านเชียงรายสลักภัณฑ์', address: 'ถ.พหลโยธิน เมืองเชียงราย', tel: '053-XXX-XXX', line: null, tier: 'bronze' },
  { id: 7, province: 'ลำปาง', region: 'north', name: 'ลำปางก่อสร้างครบวงจร', address: 'ถ.อวกาศ เมืองลำปาง', tel: '054-XXX-XXX', line: null, tier: 'bronze' },
  // ภาคอีสาน
  { id: 8, province: 'ขอนแก่น', region: 'northeast', name: 'ขอนแก่นวัสดุสากล', address: 'ถ.มิตรภาพ เมืองขอนแก่น', tel: '043-XXX-XXX', line: null, tier: 'gold' },
  { id: 9, province: 'นครราชสีมา', region: 'northeast', name: 'โคราชก่อสร้างซัพพลาย', address: 'ถ.มิตรภาพ เมืองนครราชสีมา', tel: '044-XXX-XXX', line: null, tier: 'silver' },
  { id: 10, province: 'อุดรธานี', region: 'northeast', name: 'อุดรวัสดุก่อสร้าง', address: 'ถ.อุดร-หนองคาย เมืองอุดรธานี', tel: '042-XXX-XXX', line: null, tier: 'bronze' },
  // ภาคใต้
  { id: 11, province: 'สงขลา', region: 'south', name: 'หาดใหญ่สลักภัณฑ์ครบวงจร', address: 'ถ.กาญจนวณิชย์ หาดใหญ่', tel: '074-XXX-XXX', line: null, tier: 'gold' },
  { id: 12, province: 'ภูเก็ต', region: 'south', name: 'ภูเก็ตก่อสร้างครบวงจร', address: 'ถ.เจ้าฟ้า เมืองภูเก็ต', tel: '076-XXX-XXX', line: null, tier: 'silver' },
  { id: 13, province: 'นครศรีธรรมราช', region: 'south', name: 'นครศรีวัสดุ', address: 'ถ.ราชดำเนิน เมืองนครศรีธรรมราช', tel: '075-XXX-XXX', line: null, tier: 'bronze' },
  // ภาคตะวันออก
  { id: 14, province: 'ชลบุรี', region: 'east', name: 'ชลบุรีสากลวัสดุ', address: 'ถ.สุขุมวิท เมืองชลบุรี', tel: '038-XXX-XXX', line: null, tier: 'gold' },
  { id: 15, province: 'ระยอง', region: 'east', name: 'ระยองก่อสร้างซัพพลาย', address: 'ถ.ระยอง-มาบตาพุด เมืองระยอง', tel: '038-XXX-XXX', line: null, tier: 'silver' },
];

const REGIONS = [
  { key: 'all', th: 'ทั้งหมด', en: 'All Regions' },
  { key: 'central', th: 'ภาคกลาง', en: 'Central' },
  { key: 'north', th: 'ภาคเหนือ', en: 'North' },
  { key: 'northeast', th: 'ภาคอีสาน', en: 'Northeast' },
  { key: 'south', th: 'ภาคใต้', en: 'South' },
  { key: 'east', th: 'ภาคตะวันออก', en: 'East' },
] as const;

const TIER_STYLE: Record<string, { label_th: string; label_en: string; color: string; bg: string }> = {
  main:   { label_th: 'สำนักงานใหญ่', label_en: 'HQ', color: '#fff', bg: 'var(--sug-orange)' },
  gold:   { label_th: 'ตัวแทนทอง', label_en: 'Gold Dealer', color: '#92400e', bg: '#fef3c7' },
  silver: { label_th: 'ตัวแทนเงิน', label_en: 'Silver Dealer', color: '#374151', bg: '#f3f4f6' },
  bronze: { label_th: 'ตัวแทนทั่วไป', label_en: 'Dealer', color: '#78350f', bg: '#fef9c3' },
};

export default function DealersPage() {
  const [lang, setLang] = useState<Lang>('th');
  const [region, setRegion] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = DEALERS.filter(d => {
    const matchRegion = region === 'all' || d.region === region;
    const q = search.toLowerCase();
    const matchSearch = !q || d.province.includes(search) || d.name.includes(search) || d.address.toLowerCase().includes(q);
    return matchRegion && matchSearch;
  });

  return (
    <>
      <Header lang={lang} setLang={setLang} active="contact" />
      <main>
        {/* Hero */}
        <section style={{ background: 'linear-gradient(155deg, #23247E 0%, #14154F 100%)', padding: '80px 0 60px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -160, right: -160, width: 500, height: 500, background: 'radial-gradient(circle, rgba(239,90,28,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div className="section-inner" style={{ position: 'relative', zIndex: 1 }}>
            <span className="section-kicker light">PHASE 4 · {t(lang, 'เครือข่ายตัวแทน', 'DEALER NETWORK')}</span>
            {lang === 'th' ? (
              <h1 className="section-title-th light" style={{ marginTop: 12 }}>ตัวแทนจำหน่าย<br />77 จังหวัดทั่วไทย</h1>
            ) : (
              <h1 className="section-title light" style={{ marginTop: 12 }}>Dealer network —<br />77 provinces, all Thailand.</h1>
            )}
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 17, marginTop: 16, maxWidth: 560 }} lang={lang}>
              {t(lang,
                'ค้นหาตัวแทนจำหน่าย SUG ใกล้บ้านของคุณ พร้อมรับสินค้าได้เลย ทุกจังหวัดทั่วประเทศ',
                'Find your nearest SUG dealer — stock ready, nationwide coverage.')}
            </p>
            <div style={{ marginTop: 36, display: 'flex', gap: 40, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              {[{ n: '77', th: 'จังหวัด', en: 'Provinces' }, { n: '200+', th: 'จุดจำหน่าย', en: 'Dealer points' }, { n: '24h', th: 'จัดส่งทั่วประเทศ', en: 'Nationwide delivery' }].map(s => (
                <div key={s.n}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'var(--sug-orange)', lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-mono)', fontSize: lang === 'th' ? 14 : 10, letterSpacing: lang === 'th' ? 0 : '0.1em', textTransform: lang === 'th' ? 'none' : 'uppercase', color: 'rgba(255,255,255,0.5)', marginTop: 6 }} lang={lang}>{t(lang, s.th, s.en)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Google Maps embed */}
        <div style={{ height: 400, background: 'var(--sug-fog)', position: 'relative' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.0!2d100.3!3d13.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQyJzAwLjAiTiAxMDDCsDE4JzAwLjAiRQ!5e0!3m2!1sen!2sth!4v1"
            width="100%"
            height="400"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="SUG Dealer Network Map"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(20,21,79,0.3), transparent 40%)', pointerEvents: 'none' }} />
        </div>

        {/* Search + Filter */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--sug-fog)', position: 'sticky', top: 73, zIndex: 40, padding: '16px 0' }}>
          <div className="section-inner" style={{ paddingTop: 0, paddingBottom: 0 }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={t(lang, 'ค้นหาจังหวัดหรือชื่อร้าน...', 'Search province or dealer name...')}
                  style={{ width: '100%', padding: '10px 14px 10px 40px', border: '1px solid var(--sug-fog)', borderRadius: 'var(--radius-1)', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none', color: 'var(--fg-1)' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {REGIONS.map(r => (
                  <button key={r.key} onClick={() => setRegion(r.key)}
                    style={{ padding: '8px 14px', borderRadius: 'var(--radius-1)', border: '1px solid', fontSize: 12, fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-mono)', fontWeight: 600, cursor: 'pointer', transition: 'all 160ms', background: region === r.key ? 'var(--sug-ink)' : 'transparent', color: region === r.key ? '#fff' : 'var(--fg-2)', borderColor: region === r.key ? 'var(--sug-ink)' : 'var(--sug-fog)' }}>
                    {t(lang, r.th, r.en)}
                  </button>
                ))}
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', whiteSpace: 'nowrap' }}>
                {filtered.length} {t(lang, 'จุดจำหน่าย', 'dealers')}
              </span>
            </div>
          </div>
        </div>

        {/* Dealer list */}
        <section className="section" style={{ paddingTop: 48 }}>
          <div className="section-inner">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
              {filtered.map(d => {
                const tierStyle = TIER_STYLE[d.tier];
                return (
                  <div key={d.id} style={{ background: '#fff', border: '1px solid var(--sug-fog)', borderRadius: 'var(--radius-2)', padding: '28px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', transition: 'box-shadow 180ms, transform 180ms' }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                    {/* Tier */}
                    <span style={{ position: 'absolute', top: 20, right: 20, background: tierStyle.bg, color: tierStyle.color, fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', padding: '3px 8px', borderRadius: 2 }}>
                      {t(lang, tierStyle.label_th, tierStyle.label_en)}
                    </span>
                    {/* Province */}
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sug-orange)' }}>
                      📍 {d.province}
                    </div>
                    {/* Name */}
                    <h3 style={{ fontFamily: 'var(--font-thai)', fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--fg-1)', lineHeight: 1.3 }}>
                      {d.name}
                    </h3>
                    {/* Address */}
                    <p style={{ fontSize: 13, color: 'var(--fg-2)', margin: 0, lineHeight: 1.65, fontFamily: 'var(--font-thai)' }}>
                      {d.address}
                    </p>
                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      <a href={`tel:${d.tel.replace(/[^0-9]/g, '')}`}
                        style={{ flex: 1, background: 'var(--sug-ink)', color: '#fff', padding: '10px', borderRadius: 'var(--radius-1)', fontSize: 13, fontWeight: 600, textDecoration: 'none', textAlign: 'center', transition: 'background 180ms' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--sug-orange)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'var(--sug-ink)')}>
                        📞 {d.tel}
                      </a>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.name + ' ' + d.address)}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ background: 'var(--sug-paper)', color: 'var(--fg-2)', padding: '10px 14px', borderRadius: 'var(--radius-1)', fontSize: 13, fontWeight: 600, textDecoration: 'none', border: '1px solid var(--sug-fog)', display: 'flex', alignItems: 'center', gap: 4, transition: 'all 180ms' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--sug-orange)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--sug-paper)'; e.currentTarget.style.color = 'var(--fg-2)'; }}>
                        🗺
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Become a dealer CTA */}
            <div style={{ marginTop: 80, background: 'linear-gradient(155deg, #23247E 0%, #14154F 100%)', borderRadius: 'var(--radius-2)', padding: '56px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--sug-orange)', marginBottom: 12 }}>
                  {t(lang, 'สนใจเป็นตัวแทน?', 'BECOME A DEALER')}
                </p>
                <h3 style={{ fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-display)', fontSize: lang === 'th' ? 26 : 32, fontWeight: 700, color: '#fff', margin: '0 0 12px', lineHeight: 1.1, textTransform: lang === 'th' ? 'none' : 'uppercase' }} lang={lang}>
                  {t(lang, 'เปิดเขตตัวแทนในจังหวัดของคุณ', 'Open a dealer territory in your province.')}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, margin: 0, lineHeight: 1.65 }} lang={lang}>
                  {t(lang, 'ราคาตัวแทนพิเศษ · สนับสนุนด้านเทคนิค · สต็อกสินค้าพร้อมส่ง', 'Special dealer pricing · technical support · ready stock')}
                </p>
              </div>
              <a href="mailto:info@sugbolts-nuts.com?subject=Dealer%20Application"
                className="btn-orange-lg" style={{ flexShrink: 0 }}>
                {t(lang, 'สมัครเป็นตัวแทน', 'Apply to be a dealer')} →
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer lang={lang} />
    </>
  );
}
