import { getCollection, type CollectionEntry } from 'astro:content';
import { PRODUCT_CATEGORIES, type ProductCategory } from '../config/navigation';
import { formatPrice } from './format';

export type Product = CollectionEntry<'products'>;

export async function getProducts(): Promise<Product[]> {
  const products = await getCollection('products');
  return products.sort((a, b) => a.data.order - b.data.order);
}

export async function getProductGroups() {
  const products = await getProducts();
  return (Object.keys(PRODUCT_CATEGORIES) as ProductCategory[]).map((category) => ({
    category,
    ...PRODUCT_CATEGORIES[category],
    products: products.filter((product) => product.data.category === category),
  }));
}

export const isInDevelopment = (product: Product) => product.data.status === 'in-development';

/** e.g. "เริ่ม 3,900 บาท" / "ราคาเปิดตัวประมาณ 590 /เดือน" */
export function startingPriceText(product: Product, { spaceBeforeUnit = true } = {}) {
  const { prefix, amount, unit } = product.data.startingPrice;
  const separator = spaceBeforeUnit || !unit.startsWith('/') ? ' ' : '';
  return `${prefix} ${formatPrice(amount)}${separator}${unit}`;
}
