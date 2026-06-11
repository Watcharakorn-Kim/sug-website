import type { Metadata } from 'next';
import { loadAndPreprocessData } from '@/lib/preprocess';

export { default } from './ProductDetailPage';

export function generateStaticParams() {
  const products = loadAndPreprocessData();
  return products.map(p => ({
    category: p.cat,
    product: p.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}): Promise<Metadata> {
  const { product } = await params;
  const products = loadAndPreprocessData();
  const p = products.find(prod => prod.id === product);
  if (!p) return { title: 'Product | SUG Fastener' };
  return {
    title: `${p.th} | SUG Fastener`,
    description: p.specTh || p.th,
  };
}
