'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { Footer } from '@/components/Sections';

type Lang = 'th' | 'en';
const t = (lang: Lang, th: string, en: string) => lang === 'en' ? en : th;

const RESOURCES = [
  {
    id: 'install-roofing',
    category: 'installation',
    icon: '🏗',
    name_th: 'คู่มือการติดตั้งสกรูหลังคา Bi-Metal',
    name_en: 'Bi-Metal Roofing Screw Installation Guide',
    desc_th: 'ขั้นตอนการติดตั้งสกรูหลังคา การเลือกขนาด แรงขัน และการบำรุงรักษา',
    desc_en: 'Step-by-step roofing screw installation, size selection, torque specifications, and maintenance.',
    pages: 24, updated: '2024-11-01', format: 'PDF',
  },
  {
    id: 'install-drywall',
    category: 'installation',
    icon: '🧱',
    name_th: 'คู่มือการติดตั้งสกรู Drywall & Fibre-cement',
    name_en: 'Drywall & Fibre-cement Installation Guide',
    desc_th: 'วิธีการติดตั้งสกรู CSH และ RIB สำหรับผนังยิปซัมและไฟเบอร์ซีเมนต์',
    desc_en: 'CSH and RIB screw installation for gypsum and fibre-cement boards.',
    pages: 18, updated: '2024-10-15', format: 'PDF',
  },
  {
    id: 'install-anchor',
    category: 'installation',
    icon: '⚓',
    name_th: 'คู่มือการติดตั้ง Anchor Bolt & Concrete Screw',
    name_en: 'Anchor Bolt & Concrete Screw Installation',
    desc_th: 'ขั้นตอนการเจาะและติดตั้ง anchor bolt สำหรับโครงสร้างคอนกรีต ETA certified',
    desc_en: 'Drilling and installation procedure for ETA-certified concrete anchors.',
    pages: 32, updated: '2024-09-20', format: 'PDF',
  },
  {
    id: 'torque-chart',
    category: 'technical',
    icon: '⚙️',
    name_th: 'ตารางแรงขันสกรูทุกรุ่น (Torque Chart)',
    name_en: 'Torque Chart — All Product Lines',
    desc_th: 'ค่าแรงขันที่แนะนำ (Nm) สำหรับสกรูทุกขนาดและวัสดุ ป้องกันการยืดหรือหัก',
    desc_en: 'Recommended torque values (Nm) for all screws and bolt sizes. Prevent over-torque and breakage.',
    pages: 8, updated: '2024-12-01', format: 'PDF',
  },
  {
    id: 'material-guide',
    category: 'technical',
    icon: '🔬',
    name_th: 'คู่มือเลือกวัสดุตัวยึด (Material Selection Guide)',
    name_en: 'Material Selection Guide',
    desc_th: 'วิธีเลือกระหว่าง Carbon Steel, SUS304, SUS316 สำหรับงานต่างๆ — ชายทะเล อุตสาหกรรม อาหาร',
    desc_en: 'How to choose between Carbon Steel, SUS304, SUS316 for different environments.',
    pages: 12, updated: '2024-08-10', format: 'PDF',
  },
  {
    id: 'salt-spray-report',
    category: 'certificates',
    icon: '📜',
    name_th: 'รายงานทดสอบ Salt-spray >1,000 ชั่วโมง',
    name_en: 'Salt-spray Test Report >1,000 hours',
    desc_th: 'รายงานผลการทดสอบทนเกลือสเปรย์ AS3566 Class 3 โดย Bureau Veritas',
    desc_en: 'Salt-spray test result report, AS3566 Class 3, tested by Bureau Veritas.',
    pages: 6, updated: '2024-06-01', format: 'PDF',
  },
  {
    id: 'as3566-cert',
    category: 'certificates',
    icon: '🏅',
    name_th: 'ใบรับรอง AS3566 Class 3',
    name_en: 'AS3566 Class 3 Certificate of Compliance',
    desc_th: 'ใบรับรองมาตรฐาน AS3566 Class 3 สำหรับสกรู Bi-Metal 304',
    desc_en: 'AS3566 Class 3 certification for SUG Bi-Metal 304 self-drilling screws.',
    pages: 2, updated: '2024-05-01', format: 'PDF',
  },
  {
    id: 'selection-wizard',
    category: 'tools',
    icon: '🧙',
    name_th: 'เครื่องมือเลือกสกรู (Screw Selector)',
    name_en: 'Screw Selection Wizard',
    desc_th: 'ตอบคำถาม 5 ข้อ — เราแนะนำสกรูที่เหมาะสมให้อัตโนมัติ',
    desc_en: 'Answer 5 questions — our wizard recommends the perfect screw automatically.',
    pages: 0, updated: '2024-12-08', format: 'INTERACTIVE',
  },
  {
    id: 'faq-installer',
    category: 'tools',
    icon: '❓',
    name_th: 'FAQ สำหรับช่างติดตั้ง',
    name_en: 'FAQ for Installers & Contractors',
    desc_th: 'คำถามที่พบบ่อย — วิธีเจาะ แรงขัน การเลือกขนาด การบำรุงรักษาหลังติดตั้ง',
    desc_en: 'Common questions — drilling technique, torque, size selection, post-installation care.',
    pages: 16, updated: '2024-11-20', format: 'PDF',
  },
];

const CATEGORIES = [
  { key: 'all', th: 'ทั้งหมด', en: 'All' },
  { key: 'installation', th: 'คู่มือติดตั้ง', en: 'Installation Guides' },
  { key: 'technical', th: 'เอกสารเทคนิค', en: 'Technical Docs' },
  { key: 'certificates', th: 'ใบรับรอง', en: 'Certificates' },
  { key: 'tools', th: 'เครื่องมือออนไลน์', en: 'Online Tools' },
] as const;

// ── Screw Selector Wizard ──────────────────────────────────────────────────
function ScrewWizard({ lang }: { lang: Lang }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<string | null>(null);

  const questions = [
    {
      th: 'งานอะไร?',
      en: 'What type of application?',
      opts: [
        { v: 'roofing', th: '🏠 หลังคา / เมทัลชีต', en: '🏠 Roofing / Metal sheet' },
        { v: 'wall', th: '🧱 ผนัง / ไฟเบอร์ซีเมนต์', en: '🧱 Wall / Fibre-cement' },
        { v: 'concrete', th: '🏗 คอนกรีต / อิฐ', en: '🏗 Concrete / Masonry' },
        { v: 'structural', th: '⚙️ โครงสร้างเหล็ก', en: '⚙️ Steel structure' },
      ],
    },
    {
      th: 'สภาพแวดล้อม?',
      en: 'Environment?',
      opts: [
        { v: 'indoor', th: '🏢 ในอาคาร', en: '🏢 Indoor' },
        { v: 'outdoor', th: '🌤 กลางแจ้ง (ทั่วไป)', en: '🌤 Outdoor (general)' },
        { v: 'coastal', th: '🌊 ชายทะเล / ความชื้นสูง', en: '🌊 Coastal / High humidity' },
        { v: 'industrial', th: '🏭 อุตสาหกรรมเคมี / อาหาร', en: '🏭 Chemical / Food industry' },
      ],
    },
    {
      th: 'ความหนาวัสดุที่เจาะ?',
      en: 'Substrate thickness?',
      opts: [
        { v: 'thin', th: '< 1 mm', en: '< 1 mm' },
        { v: 'medium', th: '1–3 mm', en: '1–3 mm' },
        { v: 'thick', th: '3–6 mm', en: '3–6 mm' },
        { v: 'heavy', th: '> 6 mm (โครงเหล็กหนัก)', en: '> 6 mm (heavy steel)' },
      ],
    },
  ];

  const getRecommendation = (): string => {
    const app = answers[0];
    const env = answers[1];
    const thick = answers[2];
    if (app === 'roofing' && (env === 'coastal' || env === 'outdoor')) return 'สกรู Bi-Metal 304 AS3566 Class 3 (SUG-AS48/55) — ทนเกลือสเปรย์ >1,000h';
    if (app === 'roofing' && env === 'indoor') return 'สกรู Hex Galvanised (SUG-HG) — คุ้มค่า งานหลังคาในร่ม';
    if (app === 'wall') return 'สกรู CSH สำหรับไฟเบอร์ซีเมนต์ หรือ RIB สำหรับยิปซัม';
    if (app === 'concrete') return 'Concrete Screw (SUG-CS) หรือ Anchor Bolt (SUG-AB) ETA certified';
    if (app === 'structural' && thick === 'heavy') return 'TEK #5 (6.8mm) สำหรับเหล็กหนา 6–12mm — ไม่ต้องเจาะล่วงหน้า';
    if (env === 'industrial') return 'SUS316 A4-80 (TITAN TSS316) — ทนกรดคลอไรด์สูงสุด';
    return 'สกรู DIN 931 Grade 8.8 (TITAN THB) — มาตรฐานสากล ครอบคลุมทุกงาน';
  };

  if (result) {
    return (
      <div style={{ textAlign: 'center', padding: '32px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h3 style={{ fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)', fontSize: 20, fontWeight: 700, color: 'var(--fg-1)', margin: '0 0 12px' }} lang={lang}>
          {t(lang, 'แนะนำ:', 'Recommendation:')}
        </h3>
        <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--sug-blue)', margin: '0 0 28px', lineHeight: 1.6 }}>{result}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/catalog" className="btn-orange-lg" style={{ fontSize: 14, padding: '12px 24px' }}>{t(lang, 'ดูสินค้า', 'View Products')} →</Link>
          <button onClick={() => { setStep(0); setAnswers({}); setResult(null); }} style={{ background: 'var(--sug-paper)', border: '1px solid var(--sug-fog)', color: 'var(--fg-2)', padding: '12px 24px', borderRadius: 'var(--radius-2)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            {t(lang, 'เริ่มใหม่', 'Start over')}
          </button>
        </div>
      </div>
    );
  }

  const q = questions[step];
  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {questions.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? 'var(--sug-orange)' : 'var(--sug-fog)', transition: 'background 300ms' }} />
        ))}
      </div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 12 }}>
        {t(lang, `คำถาม ${step + 1} / ${questions.length}`, `QUESTION ${step + 1} / ${questions.length}`)}
      </p>
      <h3 style={{ fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)', fontSize: 20, fontWeight: 700, color: 'var(--fg-1)', margin: '0 0 24px' }} lang={lang}>
        {t(lang, q.th, q.en)}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {q.opts.map(o => (
          <button key={o.v} onClick={() => {
            const newA = { ...answers, [step]: o.v };
            setAnswers(newA);
            if (step < questions.length - 1) {
              setStep(step + 1);
            } else {
              setResult(getRecommendation());
            }
          }}
            style={{ padding: '14px 18px', border: '1px solid var(--sug-fog)', borderRadius: 'var(--radius-1)', background: '#fff', fontSize: 14, fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)', color: 'var(--fg-1)', cursor: 'pointer', textAlign: 'left', lineHeight: 1.4, transition: 'all 160ms' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--sug-blue)'; e.currentTarget.style.background = 'rgba(43,44,145,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--sug-fog)'; e.currentTarget.style.background = '#fff'; }}
          >
            {t(lang, o.th, o.en)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const [lang, setLang] = useState<Lang>('th');
  const [category, setCategory] = useState<string>('all');
  const [showWizard, setShowWizard] = useState(false);

  const filtered = category === 'all' ? RESOURCES : RESOURCES.filter(r => r.category === category);

  return (
    <>
      <Header lang={lang} setLang={setLang} active="products" />
      <main>
        {/* Hero */}
        <section style={{ background: 'linear-gradient(155deg, #23247E 0%, #14154F 100%)', padding: '80px 0 60px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -160, right: -160, width: 500, height: 500, background: 'radial-gradient(circle, rgba(239,90,28,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div className="section-inner" style={{ position: 'relative', zIndex: 1 }}>
            <span className="section-kicker light">PHASE 4 · {t(lang, 'เอกสารเทคนิค', 'TECHNICAL LIBRARY')}</span>
            {lang === 'th' ? (
              <h1 className="section-title-th light" style={{ marginTop: 12 }}>คลังความรู้<br />และเครื่องมือช่าง</h1>
            ) : (
              <h1 className="section-title light" style={{ marginTop: 12 }}>Technical Library<br />& Installer Tools.</h1>
            )}
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 17, marginTop: 16, maxWidth: 560 }} lang={lang}>
              {t(lang, 'คู่มือ ตาราง ใบรับรอง และเครื่องมือออนไลน์สำหรับช่างและวิศวกร', 'Guides, charts, certificates, and online tools for installers and engineers.')}
            </p>
          </div>
        </section>

        {/* Wizard CTA */}
        <div style={{ background: 'var(--sug-paper)', borderBottom: '1px solid var(--sug-fog)', padding: '24px 0' }}>
          <div className="section-inner" style={{ paddingTop: 0, paddingBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sug-orange)', marginBottom: 4 }}>
                  🧙 SCREW SELECTOR WIZARD
                </p>
                <p style={{ fontSize: 14, color: 'var(--fg-2)', margin: 0 }} lang={lang}>
                  {t(lang, 'ไม่แน่ใจว่าควรใช้สกรูรุ่นไหน? ตอบ 3 คำถาม เราแนะนำให้', 'Unsure which screw to use? Answer 3 questions — we\'ll recommend instantly.')}
                </p>
              </div>
              <button onClick={() => setShowWizard(w => !w)} className="btn-orange-lg" style={{ fontSize: 14, padding: '12px 24px', flexShrink: 0 }}>
                {showWizard ? t(lang, 'ปิด', 'Close') : t(lang, 'เริ่มเลยตอนนี้', 'Start Now')} →
              </button>
            </div>
            {showWizard && (
              <div style={{ marginTop: 24, border: '1px solid var(--sug-fog)', borderRadius: 'var(--radius-2)', background: '#fff', overflow: 'hidden' }}>
                <ScrewWizard lang={lang} />
              </div>
            )}
          </div>
        </div>

        {/* Resources grid */}
        <section className="section" style={{ paddingTop: 48 }}>
          <div className="section-inner">
            {/* Filter */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 36, flexWrap: 'wrap' }}>
              {CATEGORIES.map(c => (
                <button key={c.key} onClick={() => setCategory(c.key)}
                  style={{ padding: '8px 18px', borderRadius: 20, border: '1px solid', fontSize: 13, fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-mono)', fontWeight: 600, cursor: 'pointer', transition: 'all 160ms', background: category === c.key ? 'var(--sug-ink)' : 'transparent', color: category === c.key ? '#fff' : 'var(--fg-2)', borderColor: category === c.key ? 'var(--sug-ink)' : 'var(--sug-fog)' }}>
                  {t(lang, c.th, c.en)}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2, background: 'var(--sug-fog)', border: '1px solid var(--sug-fog)' }}>
              {filtered.map(r => (
                <div key={r.id} style={{ background: '#fff', padding: '28px', display: 'flex', flexDirection: 'column', gap: 12, transition: 'background 180ms' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--sug-paper)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 32 }}>{r.icon}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', padding: '3px 8px', borderRadius: 2, background: r.format === 'INTERACTIVE' ? 'rgba(43,44,145,0.1)' : 'var(--sug-paper)', color: r.format === 'INTERACTIVE' ? 'var(--sug-blue)' : 'var(--fg-3)', border: '1px solid var(--sug-fog)' }}>
                      {r.format}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)', fontSize: 16, fontWeight: 700, color: 'var(--fg-1)', margin: 0, lineHeight: 1.3 }} lang={lang}>
                    {t(lang, r.name_th, r.name_en)}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--fg-2)', margin: 0, lineHeight: 1.65 }} lang={lang}>
                    {t(lang, r.desc_th, r.desc_en)}
                  </p>
                  {r.pages > 0 && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.06em' }}>
                      {r.pages} pages · Updated {r.updated}
                    </div>
                  )}
                  {r.format === 'INTERACTIVE' ? (
                    <button onClick={() => setShowWizard(true)} className="btn-orange-lg" style={{ fontSize: 13, padding: '10px 18px', borderRadius: 'var(--radius-1)', marginTop: 'auto' }}>
                      {t(lang, 'เปิดใช้งาน', 'Launch')} →
                    </button>
                  ) : (
                    <button style={{ background: 'var(--sug-ink)', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 'var(--radius-1)', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto', transition: 'background 180ms', alignSelf: 'flex-start' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--sug-orange)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'var(--sug-ink)')}>
                      ⬇ {t(lang, 'ดาวน์โหลด PDF', 'Download PDF')}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer lang={lang} />
    </>
  );
}
