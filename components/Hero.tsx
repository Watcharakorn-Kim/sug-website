'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeroProps {
  lang: 'th' | 'en';
}

const stats = [
  { n: '40+', th: 'ปีแห่งความเชี่ยวชาญ', en: 'Years of expertise' },
  { n: '77', th: 'จังหวัดที่ให้บริการ', en: 'Provinces served' },
  { n: '50,000+', th: 'รายการสินค้า', en: 'Products listed' },
  { n: 'ISO 9001', th: 'มาตรฐานโรงงานผลิต', en: 'Factory certified' },
];

export default function Hero({ lang }: HeroProps) {
  const t = (th: string, en: string) => lang === 'en' ? en : th;
  const bgRef = useRef<HTMLImageElement>(null);

  // Parallax on scroll
  useEffect(() => {
    const onScroll = () => {
      if (bgRef.current) {
        const y = window.scrollY * 0.35;
        bgRef.current.style.transform = `translateY(${y}px) scale(1.1)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="hero" aria-label="Hero">
      {/* Background */}
      <img
        ref={bgRef}
        src="/hero-bolts.png"
        alt=""
        className="hero-bg"
        aria-hidden="true"
      />
      <div className="hero-gradient" aria-hidden="true" />

      {/* Content */}
      <div className="hero-inner">
        <div className="hero-meta">
          <span>SUG · FASTENER</span>
          <span className="dot">·</span>
          <span>{t('ผู้เชี่ยวชาญสกรูและตัวยึดแห่งประเทศไทย', 'THAILAND FASTENER EXPERT SINCE 1999')}</span>
        </div>

        {lang === 'th' ? (
          <h1 className="hero-display-th">
            <span style={{ display: 'block' }}>คัดสรรทุกตัว</span>
            <span style={{ display: 'block' }} className="accent">สร้างความมั่นใจ</span>
          </h1>
        ) : (
          <h1 className="hero-display">
            <span className="line">YOUR FASTENING</span>
            <span className="line"><span className="accent">SOLUTION.</span></span>
          </h1>
        )}

        <p className={`hero-sub ${lang === 'th' ? 'hero-sub-thai' : ''}`}>
          {t(
            'ผู้ผลิตและจัดจำหน่ายสกรู สลักเกลียว ดอกสว่าน และตัวยึดระดับอุตสาหกรรม ส่งตรงจากโรงงานถึงตัวแทน 77 จังหวัดทั่วประเทศ',
            'Industrial-grade screws, bolts, drill bits and structural fasteners — factory-direct to dealers across all 77 provinces of Thailand.'
          )}
        </p>

        <div className="hero-ctas">
          <Link href="/#contact" className="btn-orange-lg" lang={lang}>
            {t('ติดต่อฝ่ายขาย', 'Contact Sales')} <span className="arr">→</span>
          </Link>
          <Link href="/catalog" className="btn-outline-light" lang={lang}>
            {t('ดูแคตตาล็อกสินค้า', 'Browse Catalog')}
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="hero-stats">
        {stats.map((s, i) => (
          <div key={s.n} className="stat-item">
            <div className="stat-n">{s.n}</div>
            <div className={`stat-label ${lang === 'th' ? 'stat-label-th' : ''}`}>{t(s.th, s.en)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
