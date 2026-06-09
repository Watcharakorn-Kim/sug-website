'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

type Lang = 'th' | 'en';
const t = (lang: Lang, th: string, en: string) => lang === 'en' ? en : th;

function useReveal(delay = 0) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('visible'), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref as React.RefObject<any>;
}

/* ══════════════════════════════════════════
   ABOUT COMPANY
══════════════════════════════════════════ */
export function AboutCompany({ lang }: { lang: Lang }) {
  const ref = useReveal();
  return (
    <section className="section section-about" id="about">
      <div className="section-inner">
        <header className="section-head">
          <div>
            <span className="section-kicker">01 · {t(lang, 'เกี่ยวกับเรา', 'ABOUT US')}</span>
            {lang === 'th' ? (
              <h2 className="section-title-th">ผู้ผลิตและจัดจำหน่าย<br />ตัวยึดครบวงจร</h2>
            ) : (
              <h2 className="section-title">A fastener<br />house, end to end.</h2>
            )}
          </div>
        </header>
        <div className="about-grid reveal" ref={ref}>
          <div>
            <p className={`about-lead ${lang === 'th' ? 'about-lead-th' : ''}`} lang={lang}>
              {t(lang,
                'บริษัท สยาม ยูเนี่ยน โกลด์ เทรดดิ้ง จำกัด (SUG)',
                'Siam Union Gold Trading Co., Ltd. (SUG)')}
            </p>
            <p className={`about-copy ${lang === 'th' ? 'about-copy-th' : ''}`} lang={lang}>
              {t(lang,
                'SUG เชี่ยวชาญการผลิตสกรูตามมาตรฐานสากล DIN · JIS · BS · ASME · ANSI · IFI · ISO พร้อมความชำนาญพิเศษด้านสกรูปลายสว่าน สำหรับยึดโครงหลังคาและงานโครงสร้าง',
                'SUG specialises in screws made to international standards — DIN · JIS · BS · ASME · ANSI · IFI · ISO — with particular expertise in self-drilling screws for roofing and structural framing.')}
            </p>
            <p className={`about-copy ${lang === 'th' ? 'about-copy-th' : ''}`} lang={lang}>
              {t(lang,
                'ด้วยประสบการณ์กว่า 40 ปีในการควบคุมคุณภาพและพัฒนานวัตกรรม SUG ได้รับความไว้วางใจจากลูกค้าทั่วประเทศในด้านคุณภาพและการบริการที่เป็นเลิศ',
                'With over 40 years of quality control and continuous innovation, SUG has earned customers\' trust through outstanding quality and service — recognised widely across Thailand.')}
            </p>
            <div className="about-legal">
              <div className="about-legal-k">{t(lang, 'นิติบุคคล', 'REGISTERED ENTITY')}</div>
              <div className="about-legal-name" lang={lang}>
                {t(lang, 'บริษัท สยาม ยูเนี่ยน โกลด์ เทรดดิ้ง จำกัด', 'Siam Union Gold Trading Co., Ltd.')}
              </div>
              <div className="about-legal-en">
                {t(lang, 'SIAM UNION GOLD TRADING CO., LTD.', 'บริษัท สยาม ยูเนี่ยน โกลด์ เทรดดิ้ง จำกัด')}
              </div>
            </div>
          </div>
          <aside className="about-aside">
            <img src="/photo-polo-dark.png" alt={t(lang, 'ทีม SUG', 'SUG Team')} className="about-photo" />
            <div className="about-facts">
              {[
                { n: '2542', th: 'ก่อตั้งและดำเนินธุรกิจตั้งแต่ปี พ.ศ. 2542', en: 'Operating since 1999' },
                { n: '50,000+', th: 'รายการสินค้าที่จัดจำหน่าย ครบที่สุดในประเทศไทย', en: 'Products — Thailand\'s most complete fastener range' },
                { n: '77', th: 'จังหวัดที่จัดส่งถึงหน้างานผ่านเครือข่ายตัวแทน', en: 'Provinces served through our dealer network' },
              ].map(f => (
                <div key={f.n} className="about-fact">
                  <div className="about-fact-n">{f.n}</div>
                  <div className={`about-fact-l ${lang === 'th' ? 'about-fact-l-th' : ''}`} lang={lang}>{t(lang, f.th, f.en)}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   WHY SUG
══════════════════════════════════════════ */
export function WhySug({ lang }: { lang: Lang }) {
  const ref = useReveal();
  const pillars = [
    { k_th: 'คุณภาพ', k_en: 'QUALITY', th: 'คัดสรรทุกตัว สร้างความมั่นใจ พร้อมใบรับรองและผลทดสอบจริง', en: 'Every piece selected. Confidence built in — with certificates and real test results.' },
    { k_th: 'ครบ', k_en: 'COMPLETE', th: 'ทุกสลักภัณฑ์ จบได้ในที่เดียว ครอบคลุมทุกการใช้งาน 50,000+ รายการ', en: 'Every fastener, one place — covering every application. 50,000+ products.' },
    { k_th: 'นวัตกรรม', k_en: 'INNOVATION', th: 'สินค้าที่ตอบโจทย์การใช้งาน และประสบการณ์ที่เข้าใจผู้ใช้งานในทุกอุตสาหกรรม', en: 'Products built around real use — and the people who use them, across every industry.' },
  ];

  return (
    <section className="section section-why" id="why">
      <div className="section-inner">
        <header className="section-head">
          <div>
            <span className="section-kicker light">02 · {t(lang, 'ทำไมต้องเลือก SUG', 'WHY CHOOSE SUG')}</span>
            {lang === 'th' ? (
              <h2 className="section-title-th light">สามสิ่งที่เรายึดถือ</h2>
            ) : (
              <h2 className="section-title light">Three things we stand on.</h2>
            )}
          </div>
        </header>
        <div className="pillar-grid reveal" ref={ref}>
          {pillars.map((p, i) => (
            <div key={p.k_en} className="pillar">
              {lang === 'th' ? (
                <div className="pillar-k-th">{p.k_th}</div>
              ) : (
                <div className="pillar-k">{p.k_en}</div>
              )}
              <p className={`pillar-copy ${lang === 'th' ? 'pillar-copy-th' : ''}`} lang={lang}>
                {t(lang, p.th, p.en)}
              </p>
            </div>
          ))}
        </div>
        <div className="why-stats">
          {[
            { n: '1000h', th: 'SALT-SPRAY TEST', en: 'SALT-SPRAY TEST' },
            { n: '5', th: 'มาตรฐานสากล', en: 'INTERNATIONAL STANDARDS' },
            { n: 'Bureau\nVeritas', th: 'ผู้ตรวจรับรอง', en: 'CERTIFIED BY' },
          ].map(s => (
            <div key={s.n} className="why-stat">
              <div className="why-stat-n" style={{ whiteSpace: 'pre-line' }}>{s.n}</div>
              <div className={`why-stat-l ${lang === 'th' ? 'why-stat-l-th' : ''}`}>{t(lang, s.th, s.en)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   PRODUCT CATEGORIES (SUG)
══════════════════════════════════════════ */
export function ProductCategories({ lang }: { lang: Lang }) {
  const cats = [
    { key: 'roofing', th: 'ระบบหลังคา', en: 'Roofing System', tag: 'กระเบื้อง · เมทัลชีต · Bi-Metal', std: 'AS3566 · SALT-SPRAY 1000H', img: '/product-drill-orange.png' },
    { key: 'multipurpose', th: 'งานอเนกประสงค์', en: 'Multipurpose', tag: 'แปะแนงเหล็ก · WAVE DOME', std: 'T-17 · SD POINT', img: null },
    { key: 'wall', th: 'ผนัง / ไฟเบอร์ซีเมนต์', en: 'Wall / Fibre-cement', tag: 'CSH · RIB · FMC · ไม้ฝา', std: 'DIN 7504', img: null },
    { key: 'concrete', th: 'งานคอนกรีต', en: 'Concrete', tag: 'หัวเหลี่ยม · FH · PH', std: 'ETA · DIN', img: null },
    { key: 'accessories', th: 'อุปกรณ์เสริม', en: 'Accessories', tag: 'EPDM · รางน้ำ · แป · เครื่องมือ', std: 'MADE-TO-SPEC', img: null },
  ];

  return (
    <section className="section section-products">
      <div className="section-inner">
        <header className="section-head">
          <div>
            <span className="section-kicker">03 · {t(lang, 'ระบบงานของ SUG', 'SUG BY SYSTEM')}</span>
            {lang === 'th' ? (
              <h2 className="section-title-th">บ้าน 1 หลัง — SUG ดูแลครบ 5 ระบบ</h2>
            ) : (
              <h2 className="section-title">One house.<br />Five systems. All SUG.</h2>
            )}
          </div>
          <Link href="/catalog" className="section-link" lang={lang}>
            {t(lang, 'เลือกตามงาน', 'Shop by job')} →
          </Link>
        </header>
        <div className="cat-grid">
          {cats.map((c, i) => (
            <Link
              key={c.key}
              href={`/catalog?sys=${c.key}`}
              className={`cat-card${i === 0 ? ' feature' : ''}`}
            >
              {c.img && <img src={c.img} alt="" className="cat-img" aria-hidden="true" />}
              <div className="cat-num">0{i + 1}</div>
              {lang === 'th' ? (
                <h3 className={`cat-name-th${i === 0 ? ' cat-card.feature .cat-name-th' : ''}`}>{c.th}</h3>
              ) : (
                <h3 className="cat-name">{c.en}</h3>
              )}
              <div className="cat-meta">
                <span className="cat-count" lang={lang}>{c.tag}</span>
                <span className="cat-std">{c.std}</span>
              </div>
              <span className="cat-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   TITAN CATEGORIES
══════════════════════════════════════════ */
export function TitanCategories({ lang }: { lang: Lang }) {
  const cats = [
    { key: 'general', th: 'น็อตมาตรฐานทั่วไป', en: 'General Standard', tag: 'DIN · ISO · JIS', std: 'STANDARD' },
    { key: 'electrical', th: 'อุตสาหกรรมงานไฟฟ้า', en: 'Electrical Industry', tag: 'ตู้ไฟ · ราง · กราวด์', std: 'INDUSTRIAL' },
    { key: 'stainless', th: 'อุตสาหกรรมงานสเตนเลส', en: 'Stainless Industry', tag: 'SUS304 · SUS316', std: 'CORROSION-PROOF' },
    { key: 'agri', th: 'อุตสาหกรรมงานเกษตร', en: 'Agriculture Industry', tag: 'เครื่องจักรกลเกษตร', std: 'HEAVY-DUTY' },
    { key: 'plumbing', th: 'อุตสาหกรรมงานประปา', en: 'Plumbing Industry', tag: 'ข้อต่อ · วาล์ว · ท่อ', std: 'WATERWORKS' },
    { key: 'fasteners', th: 'สกรู & สลักภัณฑ์', en: 'Screws & Fasteners', tag: 'สลักเกลียว · แหวน · สตัด', std: 'GENERAL' },
  ];

  return (
    <section className="section section-titan" id="titan">
      <div className="section-inner">
        <header className="section-head">
          <div>
            <span className="section-kicker">04 · {t(lang, 'สินค้า TITAN', 'TITAN PRODUCTS')}</span>
            {lang === 'th' ? (
              <h2 className="section-title-th">น็อตและสลักภัณฑ์<br />มาตรฐานงานอุตสาหกรรม</h2>
            ) : (
              <h2 className="section-title">Industrial-standard<br />nuts & fasteners.</h2>
            )}
          </div>
          <img src="/logo-titan.png" alt="TITAN" className="titan-head-logo" />
        </header>
        <div className="cat-grid">
          {cats.map((c, i) => (
            <Link key={c.key} href={`/catalog?brand=TITAN&sys=${c.key}`} className="cat-card">
              <div className="cat-num">0{i + 1}</div>
              {lang === 'th' ? (
                <h3 className="cat-name-th">{c.th}</h3>
              ) : (
                <h3 className="cat-name" style={{ fontSize: '1.75rem' }}>{c.en}</h3>
              )}
              <div className="cat-meta">
                <span className="cat-count" lang={lang}>{c.tag}</span>
                <span className="cat-std">{c.std}</span>
              </div>
              <span className="cat-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   BRAND FAMILY
══════════════════════════════════════════ */
export function BrandFamily({ lang }: { lang: Lang }) {
  const sugItems = [
    { th: 'ระบบหลังคา', en: 'Roofing', href: '/catalog?sys=roofing' },
    { th: 'งานอเนกประสงค์', en: 'Multipurpose', href: '/catalog?sys=multipurpose' },
    { th: 'ผนัง / ไฟเบอร์ซีเมนต์', en: 'Wall / Fibre-cement', href: '/catalog?sys=wall' },
    { th: 'งานคอนกรีต', en: 'Concrete', href: '/catalog?sys=concrete' },
    { th: 'อุปกรณ์เสริม', en: 'Accessories', href: '/catalog?sys=accessories' },
  ];
  const titanItems = [
    { th: 'น็อตมาตรฐานทั่วไป', en: 'General standard', href: '/catalog?brand=TITAN' },
    { th: 'อุตสาหกรรมงานไฟฟ้า', en: 'Electrical', href: '/catalog?brand=TITAN&sys=electrical' },
    { th: 'อุตสาหกรรมงานสเตนเลส', en: 'Stainless', href: '/catalog?brand=TITAN&sys=stainless' },
    { th: 'อุตสาหกรรมงานเกษตร', en: 'Agriculture', href: '/catalog?brand=TITAN&sys=agri' },
    { th: 'อุตสาหกรรมงานประปา', en: 'Plumbing', href: '/catalog?brand=TITAN&sys=plumbing' },
  ];

  return (
    <section className="section section-brands" id="brands">
      <div className="section-inner">
        <header className="section-head">
          <div>
            <span className="section-kicker">05 · {t(lang, 'ตระกูลแบรนด์', 'THE BRAND FAMILY')}</span>
            {lang === 'th' ? (
              <h2 className="section-title-th">สองแบรนด์<br />คนละตรรกะการเลือก</h2>
            ) : (
              <h2 className="section-title">Two brands.<br />Two ways to choose.</h2>
            )}
          </div>
          <p className={`section-sub ${lang === 'th' ? 'section-sub-th' : ''}`} lang={lang}>
            {t(lang,
              'SUG เลือกตาม "งานที่ติดตั้ง" · TITAN เลือกตาม "อุตสาหกรรมปลายทาง" — คนละตรรกะ ไม่ปนกัน',
              'SUG is organised by the job you\'re installing; TITAN by your end industry — two distinct logics, never mixed.')}
          </p>
        </header>

        <div className="brand-grid">
          {/* SUG Card */}
          <article className="brand-card">
            <div className="brand-mark">
              <img src="/sug-logo-official.png" alt="SUG" style={{ maxHeight: 140, maxWidth: '68%', objectFit: 'contain' }} />
            </div>
            <div className="brand-body">
              <span className="brand-meta">{t(lang, 'แบ่งตามงานที่ติดตั้ง', 'BY INSTALL JOB')}</span>
              <p className={`brand-tag ${lang === 'th' ? 'brand-tag-th' : ''}`} lang={lang}>
                {t(lang, 'สกรูปลายสว่าน และอุปกรณ์ติดตั้งหลังคา', 'Self-drilling screws & roofing accessories.')}
              </p>
              <ul className={`brand-list ${lang === 'th' ? 'brand-list-th' : ''}`}>
                {sugItems.map((item, i) => (
                  <li key={item.en}>
                    <span className="bl-no">0{i + 1}</span>
                    <Link href={item.href} lang={lang}>{t(lang, item.th, item.en)}</Link>
                  </li>
                ))}
              </ul>
              <Link href="/catalog?brand=SUG" className="brand-cta" lang={lang}>
                {t(lang, 'ดูสินค้า SUG', 'Explore SUG')} →
              </Link>
            </div>
          </article>

          {/* TITAN Card */}
          <article className="brand-card">
            <div className="brand-mark titan">
              <img src="/titan-logo-on-blue.png" alt="TITAN" style={{ maxHeight: 140, maxWidth: '68%', objectFit: 'contain' }} />
            </div>
            <div className="brand-body">
              <span className="brand-meta">{t(lang, 'แบ่งตามอุตสาหกรรม', 'BY END INDUSTRY')}</span>
              <p className={`brand-tag ${lang === 'th' ? 'brand-tag-th' : ''}`} lang={lang}>
                {t(lang, 'สกรู น็อต และสลักภัณฑ์ มาตรฐานงานอุตสาหกรรม', 'Screws, nuts & fasteners — industrial standard.')}
              </p>
              <ul className={`brand-list ${lang === 'th' ? 'brand-list-th' : ''}`}>
                {titanItems.map((item, i) => (
                  <li key={item.en}>
                    <span className="bl-no">0{i + 1}</span>
                    <Link href={item.href} lang={lang}>{t(lang, item.th, item.en)}</Link>
                  </li>
                ))}
              </ul>
              <Link href="/catalog?brand=TITAN" className="brand-cta" lang={lang}>
                {t(lang, 'ดูสินค้า TITAN', 'Explore TITAN')} →
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   CATALOG DOWNLOAD
══════════════════════════════════════════ */
const CATALOG_GROUPS = [
  { key: 'titan', no: '01', brand: 'TITAN', th: 'TITAN — สกรูและตัวยึด', en: 'TITAN Fasteners', yr: '2023' },
  { key: 'titan-ss', no: '02', brand: 'TITAN', th: 'TITAN — น็อตสแตนเลส', en: 'TITAN Stainless Nuts', yr: '2023' },
  { key: 'nuts', no: '03', brand: 'น๊อตทั่วไป', th: 'น๊อตทั่วไป', en: 'General Nuts & Bolts', yr: '—' },
  { key: 'giantlok', no: '04', brand: 'GIANTLOK', th: 'GIANTLOK — พุกและแองเคอร์', en: 'GIANTLOK Anchors', yr: '2023' },
  { key: 'lio', no: '05', brand: 'LIO', th: 'LIO — ตัวยึดงานก่อสร้าง', en: 'LIO Fasteners', yr: '2023' },
  { key: 'lorex', no: '06', brand: 'LOREX', th: 'LOREX', en: 'LOREX', yr: '2023' },
  { key: 'anchor', no: '07', brand: 'พุก', th: 'ใบราคาปุ๊ก (พุก)', en: 'Anchor Price List', yr: '—' },
  { key: 'sug-main', no: '08', brand: 'SUG', th: 'SUG — สกรูปลายสว่าน', en: 'SUG Self-drilling Screws', yr: '2024' },
];

export function CatalogDownload({ lang }: { lang: Lang }) {
  return (
    <section className="section section-catalog" id="catalog">
      <div className="section-inner">
        <header className="section-head">
          <div>
            <span className="section-kicker">{t(lang, 'ดาวน์โหลด', 'DOWNLOAD')}</span>
            {lang === 'th' ? (
              <h2 className="section-title-th">แค็ตตาล็อก<br />เลือกโหลดตามกลุ่มสินค้า</h2>
            ) : (
              <h2 className="section-title">Catalogs —<br />by product group.</h2>
            )}
          </div>
          <p className={`section-sub ${lang === 'th' ? 'section-sub-th' : ''}`} lang={lang}>
            {t(lang,
              'โหลดเล่มรวม SUG หรือเลือกแค็ตตาล็อกตามแบรนด์และกลุ่มสินค้า — ทุกเล่มเป็นไฟล์ PDF',
              'Download the SUG edition or pick a catalog by brand and product line — every booklet is a PDF.')}
          </p>
        </header>

        {/* Featured full edition */}
        <div className="cat-dl-box">
          {/* 3D cover */}
          <div className="cat-cover-3d" aria-hidden="true">
            <img src="/sug-logo-official.png" alt="" style={{ height: 28, width: 'auto', objectFit: 'contain' }} />
            <div className="cat-cover-yr">EDITION 2026</div>
            <div className="cat-cover-kick">Product Catalog</div>
            <div className="cat-cover-title">สินค้าครบ<br />ทุกจุดยึด</div>
            <div className="cat-cover-bar">
              <span>50,000+ ITEMS</span>
              <span>8 GROUPS</span>
            </div>
          </div>

          {/* Body */}
          <div className="cat-dl-body">
            <div className="cat-dl-kicker">{t(lang, 'เล่มรวม', 'COMPLETE EDITION')}</div>
            {lang === 'th' ? (
              <h3 className="cat-dl-title-th">แค็ตตาล็อกสินค้า SUG 2026</h3>
            ) : (
              <h3 className="cat-dl-title">The SUG Product Catalog 2026</h3>
            )}
            <p className={`cat-dl-sub ${lang === 'th' ? 'cat-dl-sub-th' : ''}`} lang={lang}>
              {t(lang,
                'รวมทุกกลุ่มสินค้าไว้ในเล่มเดียว พร้อมมาตรฐาน ขนาด เกรด และการชุบผิว',
                'Every product group in one book — with standards, sizes, grades, and finishes.')}
            </p>
            <div className="cat-dl-meta">
              {[
                { k: t(lang, 'รูปแบบไฟล์', 'Format'), v: 'PDF · A4' },
                { k: t(lang, 'ฉบับ', 'Edition'), v: '2026' },
                { k: t(lang, 'ภาษา', 'Language'), v: 'TH / EN' },
              ].map(m => (
                <div key={m.k} className="cat-dl-meta-item">
                  <span className="cat-dl-meta-k">{m.k}</span>
                  <span className="cat-dl-meta-v">{m.v}</span>
                </div>
              ))}
            </div>
            <div className="cat-dl-actions">
              <a href="/catalogs/SUG-Catalog-2026.pdf" download className="btn-orange-dl" lang={lang}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>
                </svg>
                {t(lang, 'ดาวน์โหลดเล่มรวม (PDF)', 'Download full catalog (PDF)')}
              </a>
              <a href="#contact" className="btn-ghost-light" lang={lang}>
                {t(lang, 'ขอรับสินค้าตัวอย่าง', 'Request samples')} <span className="arr">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Booklets grid */}
        <div className="cat-group-head">
          <span className="cat-group-label" lang={lang}>{t(lang, 'เล่มแยกตามแบรนด์และกลุ่มสินค้า', 'BY BRAND & PRODUCT LINE')}</span>
          <span className="cat-group-rule" />
          <span className="cat-group-count">{CATALOG_GROUPS.length} {t(lang, 'เล่ม', 'volumes')}</span>
        </div>
        <div className="cat-group-grid">
          {CATALOG_GROUPS.map(g => (
            <a key={g.key} href={`/catalogs/${g.key}.pdf`} download className="cat-group-card">
              <div className="cgc-cover" aria-hidden="true">
                <span className="cgc-no">{g.no}</span>
                <span className="cgc-brand">{g.brand}</span>
              </div>
              <div className="cgc-body">
                <h4 className="cgc-name" lang={lang}>{t(lang, g.th, g.en)}</h4>
                <div className="cgc-meta">
                  <span className="cgc-sku">PDF</span>
                  <span>{g.yr === '—' ? t(lang, 'ฉบับล่าสุด', 'Latest') : `EDITION ${g.yr}`}</span>
                </div>
                <span className="cgc-dl">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>
                  </svg>
                  {t(lang, 'ดาวน์โหลด PDF', 'Download PDF')}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   CTA + CONTACT
══════════════════════════════════════════ */
export function CtaContact({ lang }: { lang: Lang }) {
  return (
    <section className="section section-cta" id="contact">
      <div className="section-inner">
        <div className="cta-inner">
          <div>
            <span className="cta-kicker">{t(lang, 'ช่องทางติดต่อ', 'CONTACT US')}</span>
            {lang === 'th' ? (
              <h2 className="cta-title-th">พร้อมสั่งซื้อ?<br />คุยกับฝ่ายขายของเรา</h2>
            ) : (
              <h2 className="cta-title">Ready to order?<br />Talk to our sales team.</h2>
            )}
            <p className={`cta-sub ${lang === 'th' ? 'cta-sub-th' : ''}`} lang={lang}>
              {t(lang,
                'ใบเสนอราคาใน 24 ชั่วโมง · ราคาตัวแทนและเงื่อนไขเครดิต · สนับสนุนทางเทคนิคสำหรับงานเฉพาะทาง',
                'Quote within 24 hours · dealer pricing & credit terms · technical support for specialty applications.')}
            </p>
          </div>
          <div className="cta-actions">
            <a href="tel:+6624206734" className="btn-orange-lg" lang={lang} style={{ fontSize: 16 }}>
              📞 02-420-6734-6
            </a>
            <a href="https://line.me/R/ti/p/@sugbolts" target="_blank" rel="noopener noreferrer" className="btn-ghost-light" lang={lang}>
              LINE: @sugbolts <span className="arr">→</span>
            </a>
          </div>
        </div>

        {/* Contact cells */}
        <div className="contact-grid">
          <div className="contact-cell">
            <div className="contact-cell-t">{t(lang, 'ช่องทางติดต่อ', 'CHANNELS')}</div>
            <div className="contact-chan">
              {[
                { k: 'Tel', v: '02-420-6734-6', href: 'tel:+6624206734' },
                { k: 'Line', v: '@sugbolts', href: 'https://line.me/R/ti/p/@sugbolts' },
                { k: 'Email', v: 'info@sugbolts-nuts.com', href: 'mailto:info@sugbolts-nuts.com' },
                { k: 'Web', v: 'www.sugbolts-nuts.com', href: 'https://www.sugbolts-nuts.com' },
              ].map(c => (
                <div key={c.k} className="contact-line">
                  <span className="ck">{c.k}</span>
                  <a className="cv" href={c.href} target={c.k === 'Web' ? '_blank' : undefined} rel="noopener noreferrer">{c.v}</a>
                </div>
              ))}
            </div>
          </div>
          <div className="contact-cell">
            <div className="contact-cell-t">{t(lang, 'สำนักงาน', 'OFFICE')}</div>
            <p className={`contact-addr ${lang === 'th' ? 'contact-addr-th' : ''}`} lang={lang}>
              {t(lang, 'บริษัท สยาม ยูเนี่ยน โกลด์ เทรดดิ้ง จำกัด', 'Siam Union Gold Trading Co., Ltd.')}<br />
              {t(lang,
                '168/5 หมู่ 5 ซ.กระทุ่มส้ม 26 ถ.พุทธมณฑลสาย 4 ต.กระทุ่มล้ม อ.สามพราน จ.นครปฐม 73220',
                '168/5 Moo 5, Soi Krathumsom 26, Phutthamonthon Sai 4 Rd, Krathumsom, Samphran, Nakhon Pathom 73220')}
            </p>
            <a
              className="contact-map"
              href="https://www.google.com/maps/search/?api=1&query=168%2F5+Moo+5+Phutthamonthon+Sai+4+Samphran+Nakhon+Pathom+73220"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t(lang, 'เปิดแผนที่ Google Maps', 'Open in Google Maps')} →
            </a>
          </div>
          <div className="contact-cell">
            <div className="contact-cell-t">{t(lang, 'เวลาทำการ', 'HOURS')}</div>
            <p className={`contact-hours ${lang === 'th' ? 'contact-hours-th' : ''}`} lang={lang}>
              {t(lang, 'จันทร์ – เสาร์', 'Mon – Sat')}<br />
              08:00 – 17:00 น.<br />
              {t(lang, 'อาทิตย์และวันหยุดนักขัตฤกษ์ — ปิด', 'Sun & public holidays — closed')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════ */
function FooterCol({ title, items, lang }: { title: string; items: [string, string][]; lang: Lang }) {
  return (
    <div>
      <div className="footer-col-title">{title}</div>
      <ul className={`footer-links ${lang === 'th' ? 'footer-links-th' : ''}`}>
        {items.map(([label, href]) => (
          <li key={label}><Link href={href} lang={lang}>{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="sug-footer">
      <div className="section-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-logo-wrap" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src="/sug-logo-official.png" alt="SUG" style={{ height: 44, width: 'auto', objectFit: 'contain' }} />
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', textTransform: 'uppercase' }}>SUG</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>FASTENER</span>
              </span>
            </div>
            <p className={`footer-desc ${lang === 'th' ? 'footer-desc-th' : ''}`} lang={lang}>
              {t(lang,
                'ผู้ผลิตและจัดจำหน่ายสกรู สลักเกลียว และตัวยึดครบวงจร มาตรฐานสากล DIN · JIS · ISO',
                'Manufacturer and distributor of screws, bolts, and fasteners — international standards DIN · JIS · ISO.')}
            </p>
            <p className={`footer-addr ${lang === 'th' ? 'footer-addr-th' : ''}`} lang={lang}>
              {t(lang,
                '168/5 หมู่ 5 ซ.กระทุ่มส้ม 26 ถ.พุทธมณฑลสาย 4\nต.กระทุ่มล้ม อ.สามพราน จ.นครปฐม 73220',
                '168/5 Moo 5, Soi Krathumsom 26\nPhutthamonthon Sai 4 Rd, Samphran\nNakhon Pathom 73220')}
            </p>
          </div>
          <FooterCol
            title={t(lang, 'สินค้า SUG', 'SUG Products')}
            lang={lang}
            items={[
              [t(lang, 'ระบบหลังคา', 'Roofing'), '/catalog?sys=roofing'],
              [t(lang, 'งานอเนกประสงค์', 'Multipurpose'), '/catalog?sys=multipurpose'],
              [t(lang, 'ผนัง / ไฟเบอร์ซีเมนต์', 'Wall / Fibre-cement'), '/catalog?sys=wall'],
              [t(lang, 'งานคอนกรีต', 'Concrete'), '/catalog?sys=concrete'],
              [t(lang, 'อุปกรณ์เสริม', 'Accessories'), '/catalog?sys=accessories'],
            ]}
          />
          <FooterCol
            title={t(lang, 'สินค้า TITAN', 'TITAN Products')}
            lang={lang}
            items={[
              [t(lang, 'น็อตมาตรฐานทั่วไป', 'General standard'), '/catalog?brand=TITAN'],
              [t(lang, 'งานไฟฟ้า', 'Electrical'), '/catalog?brand=TITAN&sys=electrical'],
              [t(lang, 'งานสเตนเลส', 'Stainless'), '/catalog?brand=TITAN&sys=stainless'],
              [t(lang, 'งานเกษตร', 'Agriculture'), '/catalog?brand=TITAN&sys=agri'],
              [t(lang, 'งานประปา', 'Plumbing'), '/catalog?brand=TITAN&sys=plumbing'],
            ]}
          />
          <FooterCol
            title={t(lang, 'บริษัท', 'Company')}
            lang={lang}
            items={[
              [t(lang, 'เกี่ยวกับเรา', 'About Us'), '/#about'],
              [t(lang, 'ดาวน์โหลด Catalog', 'Download Catalog'), '/#catalog'],
              [t(lang, 'ติดต่อเรา', 'Contact'), '/#contact'],
              [t(lang, 'มาตรฐานและการรับรอง', 'Standards & certs'), '/#why'],
            ]}
          />
        </div>
        <div className="footer-bottom">
          <span>© 2026 Siam Union Gold Trading Co., Ltd.</span>
          <span className="footer-standards">DIN · JIS · BS · ASME · ANSI · IFI · ISO</span>
        </div>
      </div>
    </footer>
  );
}
