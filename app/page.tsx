'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import {
  AboutCompany,
  WhySug,
  ProductCategories,
  TitanCategories,
  BrandFamily,
  CatalogDownload,
  CtaContact,
  Footer,
} from '@/components/Sections';

type Lang = 'th' | 'en';

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('th');

  return (
    <>
      <Header lang={lang} setLang={setLang} active="home" />
      <main>
        <Hero lang={lang} />
        <AboutCompany lang={lang} />
        <WhySug lang={lang} />
        <ProductCategories lang={lang} />
        <TitanCategories lang={lang} />
        <BrandFamily lang={lang} />
        <CatalogDownload lang={lang} />
        <CtaContact lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  );
}
