'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { Footer } from '@/components/Sections';

type Lang = 'th' | 'en';
const t = (lang: Lang, th: string, en: string) => lang === 'en' ? en : th;

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const start = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - start) / 1800, 1);
          const e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(e * target).toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

export default function AboutPage() {
  const [lang, setLang] = useState<Lang>('th');

  const timeline = [
    { year: '2542', th: 'ก่อตั้งบริษัท สยาม ยูเนี่ยน โกลด์ เทรดดิ้ง จำกัด', en: 'Founded Siam Union Gold Trading Co., Ltd.' },
    { year: '2548', th: 'เปิดตัวแบรนด์ SUG พร้อมสินค้าสกรูปลายสว่านระบบหลังคา', en: 'Launched SUG brand with roofing self-drilling screw line.' },
    { year: '2553', th: 'ขยายเครือข่ายตัวแทน 77 จังหวัดทั่วประเทศ', en: 'Expanded dealer network to all 77 provinces.' },
    { year: '2558', th: 'เปิดตัวแบรนด์ TITAN สำหรับงานอุตสาหกรรม', en: 'Launched TITAN brand for industrial applications.' },
    { year: '2562', th: 'ผ่านการรับรองมาตรฐาน AS3566 Class 3 จาก Bureau Veritas', en: 'AS3566 Class 3 certified by Bureau Veritas.' },
    { year: '2567', th: 'ครบ 25 ปี ขยายไลน์สินค้าสู่ 50,000+ รายการ', en: '25th anniversary — product range expanded to 50,000+ SKUs.' },
  ];

  const standards = [
    { code: 'AS3566', name: 'Australian Standard', detail_th: 'สำหรับสกรูยึดในงานก่อสร้าง', detail_en: 'For fasteners in construction' },
    { code: 'DIN', name: 'Deutsches Institut für Normung', detail_th: 'มาตรฐานเยอรมัน ใช้กว้างขวางที่สุดในโลก', detail_en: 'German standard — widest global adoption' },
    { code: 'JIS', name: 'Japanese Industrial Standards', detail_th: 'มาตรฐานญี่ปุ่น อุตสาหกรรมยานยนต์และอิเล็กทรอนิกส์', detail_en: 'Japanese standard for auto & electronics' },
    { code: 'ISO', name: 'International Organization', detail_th: 'มาตรฐานสากลที่ยอมรับทั่วโลก', detail_en: 'Internationally recognized standard' },
    { code: 'ASME', name: 'Amer. Soc. Mech. Engineers', detail_th: 'สำหรับงานวิศวกรรมกล US', detail_en: 'US mechanical engineering standard' },
    { code: 'ETA', name: 'European Technical Assessment', detail_th: 'สำหรับงาน Anchor bolt คอนกรีต', detail_en: 'European anchor bolt certification' },
  ];

  return (
    <>
      <Header lang={lang} setLang={setLang} active="about" />
      <main>
        {/* Hero */}
        <section style={{ background: 'linear-gradient(155deg, #23247E 0%, #14154F 100%)', padding: '100px 0 80px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -200, right: -200, width: 600, height: 600, background: 'radial-gradient(circle, rgba(239,90,28,0.15) 0%, transparent 70%)' }} />
          <div className="section-inner" style={{ position: 'relative', zIndex: 1 }}>
            <span className="section-kicker light">01 · {t(lang, 'เกี่ยวกับเรา', 'ABOUT US')}</span>
            {lang === 'th' ? (
              <h1 className="section-title-th light" style={{ marginTop: 12 }}>25 ปีแห่งความเชี่ยวชาญ<br />ในวงการตัวยึด</h1>
            ) : (
              <h1 className="section-title light" style={{ marginTop: 12 }}>25 years of fastener<br />expertise.</h1>
            )}
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 18, marginTop: 20, maxWidth: 600, lineHeight: 1.7 }} lang={lang}>
              {t(lang,
                'บริษัท สยาม ยูเนี่ยน โกลด์ เทรดดิ้ง จำกัด (SUG) ก่อตั้งในปี 2542 ด้วยความมุ่งมั่นที่จะเป็นผู้ผลิตและจัดจำหน่ายตัวยึดมาตรฐานสากลที่ดีที่สุดในประเทศไทย',
                'Siam Union Gold Trading Co., Ltd. (SUG) was founded in 1999 with a commitment to become Thailand\'s premier manufacturer and distributor of internationally standardised fasteners.')}
            </p>

            {/* Key stats */}
            <div style={{ marginTop: 60, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.15)', maxWidth: 800 }}>
              {[
                { n: 25, suffix: '', th: 'ปีที่ดำเนินการ', en: 'Years in operation' },
                { n: 50000, suffix: '+', th: 'รายการสินค้า', en: 'Product lines' },
                { n: 77, suffix: '', th: 'จังหวัดที่ครอบคลุม', en: 'Provinces covered' },
                { n: 6, suffix: '', th: 'มาตรฐานสากล', en: 'International standards' },
              ].map(s => (
                <div key={s.th}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 700, color: 'var(--sug-orange)', lineHeight: 1 }}>
                    <CountUp target={s.n} suffix={s.suffix} />
                  </div>
                  <div style={{ fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-mono)', fontSize: lang === 'th' ? 14 : 10, letterSpacing: lang === 'th' ? 0 : '0.08em', textTransform: lang === 'th' ? 'none' : 'uppercase', color: 'rgba(255,255,255,0.5)', marginTop: 8 }} lang={lang}>{t(lang, s.th, s.en)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company story */}
        <section className="section">
          <div className="section-inner">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
              <div>
                <span className="section-kicker">{t(lang, 'เรื่องราวของเรา', 'OUR STORY')}</span>
                {lang === 'th' ? (
                  <h2 className="section-title-th" style={{ marginTop: 12 }}>จากผู้นำเข้า<br />สู่ผู้ผลิตระดับประเทศ</h2>
                ) : (
                  <h2 className="section-title" style={{ marginTop: 12 }}>From importer<br />to national manufacturer.</h2>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 32 }}>
                  {[
                    { th: 'เริ่มต้นจากการนำเข้าตัวยึดคุณภาพสูงจากไต้หวันและญี่ปุ่น ก่อนพัฒนาความสามารถด้านการผลิตเองในประเทศ', en: 'Started by importing high-quality fasteners from Taiwan and Japan, then developed domestic manufacturing capability.' },
                    { th: 'พัฒนา Bi-Metal 304 self-drilling screw สำหรับระบบหลังคาไทย ออกแบบเฉพาะสำหรับสภาพอากาศร้อนชื้นและเกลือทะเล', en: 'Developed Bi-Metal 304 self-drilling screws specifically for Thai roofing systems, engineered for tropical heat, humidity, and coastal salt exposure.' },
                    { th: 'วันนี้ SUG จัดจำหน่ายสินค้ากว่า 50,000 รายการผ่านเครือข่ายตัวแทน 77 จังหวัด ด้วยคำมั่นสัญญาเดียวกัน: คุณภาพ ครบ นวัตกรรม', en: 'Today, SUG distributes 50,000+ products through 77 provincial dealer networks — with the same promise: Quality, Complete, Innovation.' },
                  ].map((p, i) => (
                    <p key={i} style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--fg-2)', margin: 0 }} lang={lang}>{t(lang, p.th, p.en)}</p>
                  ))}
                </div>
              </div>

              {/* Photo */}
              <div>
                <img src="/photo-polo-dark.png" alt="SUG Team" style={{ width: '100%', borderRadius: 'var(--radius-2)', objectFit: 'cover', aspectRatio: '4/3' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, marginTop: 2, background: 'var(--sug-fog)' }}>
                  {[
                    { n: 'DIN · JIS · ISO', th: 'มาตรฐานที่รับรอง', en: 'Certified standards' },
                    { n: '1,000h', th: 'Salt-spray test', en: 'Salt-spray test' },
                  ].map(s => (
                    <div key={s.n} style={{ background: 'var(--sug-ink)', color: '#fff', padding: '24px', textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--sug-orange)' }}>{s.n}</div>
                      <div style={{ fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-mono)', fontSize: lang === 'th' ? 13 : 10, letterSpacing: lang === 'th' ? 0 : '0.1em', textTransform: lang === 'th' ? 'none' : 'uppercase', color: 'rgba(255,255,255,0.55)', marginTop: 6 }} lang={lang}>{t(lang, s.th, s.en)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="section" style={{ background: 'var(--sug-paper)' }}>
          <div className="section-inner">
            <span className="section-kicker">{t(lang, 'ไทม์ไลน์', 'TIMELINE')}</span>
            {lang === 'th' ? (
              <h2 className="section-title-th" style={{ marginTop: 12 }}>25 ปี ความเป็นมา</h2>
            ) : (
              <h2 className="section-title" style={{ marginTop: 12 }}>25 years of history.</h2>
            )}
            <div style={{ marginTop: 48, position: 'relative' }}>
              <div style={{ position: 'absolute', left: 80, top: 0, bottom: 0, width: 1, background: 'var(--sug-fog)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {timeline.map((ev, i) => (
                  <div key={ev.year} style={{ display: 'flex', gap: 32, alignItems: 'flex-start', padding: '28px 0', position: 'relative' }}>
                    <div style={{ width: 80, flexShrink: 0, fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--sug-orange)', textAlign: 'right', paddingTop: 4 }}>{ev.year}</div>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--sug-blue)', border: '2px solid #fff', boxShadow: '0 0 0 2px var(--sug-blue)', flexShrink: 0, marginTop: 8, position: 'relative', zIndex: 1 }} />
                    <p style={{ fontFamily: lang === 'th' ? 'var(--font-thai)' : 'var(--font-body)', fontSize: 16, lineHeight: 1.65, color: 'var(--fg-1)', margin: 0, paddingTop: 4 }} lang={lang}>
                      {t(lang, ev.th, ev.en)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Standards */}
        <section className="section">
          <div className="section-inner">
            <span className="section-kicker">{t(lang, 'มาตรฐาน', 'STANDARDS')}</span>
            {lang === 'th' ? (
              <h2 className="section-title-th" style={{ marginTop: 12 }}>6 มาตรฐานสากล</h2>
            ) : (
              <h2 className="section-title" style={{ marginTop: 12 }}>Six international standards.</h2>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, background: 'var(--sug-fog)', border: '1px solid var(--sug-fog)', marginTop: 40 }}>
              {standards.map(s => (
                <div key={s.code} style={{ background: '#fff', padding: '32px' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--sug-ink)', marginBottom: 8, textTransform: 'uppercase' }}>{s.code}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--sug-orange)', marginBottom: 12 }}>{s.name}</div>
                  <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.65, margin: 0 }} lang={lang}>{t(lang, s.detail_th, s.detail_en)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: 'linear-gradient(155deg, #23247E 0%, #14154F 100%)', padding: '80px 0' }}>
          <div className="section-inner" style={{ textAlign: 'center' }}>
            {lang === 'th' ? (
              <h2 className="section-title-th light">พร้อมสั่งซื้อหรือสอบถาม?</h2>
            ) : (
              <h2 className="section-title light">Ready to order or enquire?</h2>
            )}
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 17, marginTop: 16, marginBottom: 40 }} lang={lang}>
              {t(lang, 'ทีมงานของเราพร้อมช่วยเหลือในทุกคำถาม', 'Our team is ready to help with any enquiry.')}
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/#contact" className="btn-orange-lg">{t(lang, 'ติดต่อฝ่ายขาย', 'Contact Sales')} →</Link>
              <Link href="/catalog" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '14px 28px', borderRadius: 'var(--radius-2)', fontWeight: 600, fontSize: 15, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }} lang={lang}>
                {t(lang, 'ดูสินค้า', 'View Catalog')} →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer lang={lang} />
    </>
  );
}
