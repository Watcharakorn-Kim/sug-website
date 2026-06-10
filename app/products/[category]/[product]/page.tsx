import type { Metadata } from 'next';
import { getProductById, PRODUCTS } from '@/lib/products';
export { default } from './ProductDetailPage';

export function generateStaticParams() {
  return PRODUCTS.map(p => ({
    category: p.cat,
    product: p.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { category: string; product: string };
}): Promise<Metadata> {
  const p = getProductById(params.product);
  if (!p) return { title: 'Product | SUG Fastener' };
  return {
    title: `${p.th} | SUG Fastener`,
    description: p.specTh || p.th,
  };
}
