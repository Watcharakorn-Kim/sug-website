'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import { CtaContact, Footer } from '@/components/Sections';

type Lang = 'th' | 'en';
const t = (lang: Lang, th: string, en: string) => lang === 'en' ? en : th;

export default function ContactPage() {
  const [lang, setLang] = useState<Lang>('th');

  return (
    <>
      <Header lang={lang} setLang={setLang} active="contact" />
      <main>
        <section style={{
          background: 'linear-gradient(155deg, #23247E 0%, #14154F 100%)',
          color: '#fff',
          padding: '80px 0 60px',
        }}>
          <div className="section-inner">
            <span className="section-kicker light">{t(lang, 'ติดต่อเรา', 'CONTACT US')}</span>
            {lang === 'th' ? (
              <h1 className="section-title-th light" style={{ marginTop: 12 }}>พูดคุยกับทีมงาน</h1>
            ) : (
              <h1 className="section-title light" style={{ marginTop: 12 }}>Talk to our team.</h1>
            )}
          </div>
        </section>
        <CtaContact lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  );
}
