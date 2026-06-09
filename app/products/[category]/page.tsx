import type { Metadata } from 'next';
import { getCategoryByKey } from '@/lib/products';
export { default } from './CategoryPage';

export function generateStaticParams() {
  return [
    { category: 'roofing' },
    { category: 'multipurpose' },
    { category: 'wall' },
    { category: 'concrete' },
    { category: 'accessories' },
    { category: 'general' },
    { category: 'electrical' },
    { category: 'stainless' },
    { category: 'agri' },
    { category: 'plumbing' },
    { category: 'fasteners' },
  ];
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const cat = getCategoryByKey(params.category);
  if (!cat) return { title: 'Product Category | SUG Fastener' };
  return {
    title: `${cat.name_th} · ${cat.name_en} | SUG Fastener`,
    description: cat.desc_th,
  };
}
