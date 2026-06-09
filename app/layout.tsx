import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'SUG Fastener — มั่นใจในทุกจุดยึด | Fasten Your Future',
    template: '%s | SUG Fastener',
  },
  description:
    'ผู้ผลิตและจัดจำหน่ายสกรู สลักเกลียว ดอกสว่าน และตัวยึดระดับอุตสาหกรรม ครบ 50,000+ รายการ ส่งตรงถึงตัวแทน 77 จังหวัด · Siam Union Gold Trading Co., Ltd.',
  keywords: [
    'สกรู', 'น็อต', 'สลักเกลียว', 'ตัวยึด', 'ดอกสว่าน', 'fastener', 'screw', 'bolt', 'nut',
    'SUG', 'TITAN', 'สยาม ยูเนี่ยน โกลด์', 'Siam Union Gold',
  ],
  openGraph: {
    title: 'SUG Fastener — มั่นใจในทุกจุดยึด',
    description: 'ผู้ผลิตและจัดจำหน่ายตัวยึดครบวงจร ครอบคลุม 77 จังหวัด',
    type: 'website',
    locale: 'th_TH',
    siteName: 'SUG Fastener',
  },
  metadataBase: new URL('https://www.sugbolts-nuts.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <link rel="icon" href="/sug-logo-official.png" type="image/png" />
        <meta name="theme-color" content="#14154d" />
      </head>
      <body>{children}</body>
    </html>
  );
}
