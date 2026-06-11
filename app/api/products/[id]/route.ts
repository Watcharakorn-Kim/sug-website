import { NextResponse } from 'next/server';
import { loadAndPreprocessData, getTierPrice, RawSku } from '../../../../lib/preprocess';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const size = searchParams.get('size');
    const length = searchParams.get('length');
    const finish = searchParams.get('finish');
    const tier = searchParams.get('tier');

    const products = loadAndPreprocessData();
    const product = products.find(p => p.id === id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const rawSkus = product.skus || [];

    // Find the matching SKU if attributes are specified
    let matchedSku: RawSku | null = null;
    if (size || length || finish) {
      matchedSku = rawSkus.find((s: RawSku) => {
        if (size && s.spec_size !== size) return false;
        if (length && s.length_inch !== length) return false;
        if (finish && s.material_coating !== finish) return false;
        return true;
      }) || null;
    }

    // Default to the first SKU if no exact match but we have SKUs
    if (!matchedSku && rawSkus.length > 0) {
      matchedSku = rawSkus[0];
    }

    // Compute prices
    const listPrice = matchedSku ? parseFloat(matchedSku.list_price) || 0 : (product.priceList || 0);
    const price = matchedSku ? getTierPrice(matchedSku, tier || undefined) : listPrice;

    // Collate all available spec values from matching SKUs to filter options dynamically if needed
    const availableSpecs = rawSkus.map((s: RawSku) => ({
      sku: s.sku,
      size: s.spec_size,
      length: s.length_inch,
      finish: s.material_coating,
      listPrice: parseFloat(s.list_price) || 0,
      tierPrice: getTierPrice(s, tier || undefined),
      weight: s.weight_kg_pc,
      boxQty: s.qty_box,
      crateQty: s.qty_crate,
    }));

    return NextResponse.json({
      product: {
        ...product,
        // Strip the raw SKUs array to keep response size optimal, but keep summary specs
        skus: undefined,
      },
      matchedSku: matchedSku ? {
        sku: matchedSku.sku,
        size: matchedSku.spec_size,
        length: matchedSku.length_inch,
        finish: matchedSku.material_coating,
        weight: matchedSku.weight_kg_pc,
        boxQty: matchedSku.qty_box,
        crateQty: matchedSku.qty_crate,
        listPrice,
        price,
      } : null,
      specs: availableSpecs,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error in GET /api/products/[id]:`, error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
