import type { Metadata } from 'next';
import { getCategoryByKey } from '@/lib/products';
export { default } from './CategoryPage';

export function generateStaticParams() {
  return [
    { category: 'bolts' },
    { category: 'screws' },
    { category: 'sds' },
    { category: 'nuts' },
    { category: 'anchors' },
    { category: 'drills' },
    { category: 'tools' },
  ];
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const cat = getCategoryByKey(params.category);
  if (!cat) return { title: 'Product Category | SUG Fastener' };
  return {
    title: `${cat.th} · ${cat.en} | SUG Fastener`,
    description: `${cat.th} · ${cat.en} category page.`,
  };
}
