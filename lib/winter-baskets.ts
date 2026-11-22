import type { ProductDocument } from '@/lib/product-types'

export interface WinterBasketItem {
  name: string
  quantity: string
  match: string[]
}

export interface WinterBasket {
  slug: string
  name: string
  sellingPrice: number
  description: string
  contents: WinterBasketItem[]
}

export const WINTER_BASKETS: WinterBasket[] = [
  {
    slug: 'pahadi-winter-essentials', name: 'Pahadi Winter Essentials', sellingPrice: 1899,
    description: 'The everyday taste of the Himalayas. A starter collection for everyday mountain-style meals, bringing together traditional pulses, grains, millet, ghee, seasoning, salt and pickle.',
    contents: [
      { name: 'Gauth Dal', quantity: '500g', match: ['gauth dal', 'gahat'] }, { name: 'Pahadi Jhangora', quantity: '500g', match: ['jhangora'] },
      { name: 'Mandua (Ragi) Atta', quantity: '1kg', match: ['koda atta', 'ragi millet'] }, { name: 'Pahadi Bilona Cow Ghee', quantity: '250g', match: ['bilona cow ghee'] },
      { name: 'Jakhya', quantity: '100g', match: ['jakhya'] }, { name: 'Pisyu Loon', quantity: '250g', match: ['pisyu loon'] },
      { name: 'Pahadi Amla Achar', quantity: '250g', match: ['amla achar'] },
    ],
  },
  {
    slug: 'himalayan-winter-nourishment', name: 'Himalayan Winter Nourishment', sellingPrice: 2899,
    description: 'Winter tastes better when it comes from the mountains. A more complete winter pantry for families, featuring traditional pulses, grains, honey, walnuts and cooking spices.',
    contents: [
      { name: 'Gauth Dal', quantity: '500g', match: ['gauth dal', 'gahat'] }, { name: 'Pahadi Bhatt Dal', quantity: '500g', match: ['bhatt dal'] },
      { name: 'Pahadi Jhangora', quantity: '500g', match: ['jhangora'] }, { name: 'Mandua (Ragi) Atta', quantity: '1kg', match: ['koda atta', 'ragi millet'] },
      { name: 'Pahadi Jau (Barley)', quantity: '500g', match: ['pahadi jau'] }, { name: 'Pahadi Bilona Cow Ghee', quantity: '250g', match: ['bilona cow ghee'] },
      { name: 'Raw Pahadi Honey', quantity: '250g', match: ['raw pahadi honey'] }, { name: 'Pahadi Akhrot', quantity: '250g', match: ['pahadi akhrot'] },
      { name: 'Jakhya', quantity: '100g', match: ['jakhya'] }, { name: 'Pahadi Red Chilli Powder', quantity: '100g', match: ['red chilli powder'] },
    ],
  },
  {
    slug: 'pahadi-heritage-luxury-hamper', name: 'Pahadi Heritage Luxury Hamper', sellingPrice: 4499,
    description: '12 treasures from the Himalayas. One gift of warmth. A premium collection of Himalayan pantry staples, traditional pulses, grains, premium ghee and honey, spices, pickle and snacks. Suitable for gifting and family celebrations.',
    contents: [
      { name: 'Gauth Dal', quantity: '500g', match: ['gauth dal', 'gahat'] }, { name: 'Pahadi Bhatt Dal', quantity: '500g', match: ['bhatt dal'] },
      { name: 'Pahadi Jhangora', quantity: '500g', match: ['jhangora'] },
      { name: 'Pahadi Chawal', quantity: '1kg', match: ['pahadi chawal'] }, { name: 'Mandua (Ragi) Atta', quantity: '1kg', match: ['koda atta', 'ragi millet'] },
      { name: 'Pahadi Bilona Cow Ghee', quantity: '500g', match: ['bilona cow ghee'] }, { name: 'Raw Pahadi Honey', quantity: '500g', match: ['raw pahadi honey'] },
      { name: 'Pahadi Akhrot', quantity: '250g', match: ['pahadi akhrot'] }, { name: 'Pisyu Loon', quantity: '250g', match: ['pisyu loon'] },
      { name: 'Jakhya', quantity: '100g', match: ['jakhya'] }, { name: 'Pahadi Amla Achar', quantity: '250g', match: ['amla achar'] },
      { name: 'Pahadi Ragi Biscuits', quantity: '1 pack', match: ['ragi biscuits'] },
    ],
  },
]

export function getWinterBasket(slug?: string) {
  return WINTER_BASKETS.find((basket) => basket.slug === slug)
}

export function isWinterBasket(product: Pick<ProductDocument, '$id' | 'name' | 'alias_name'>) {
  const slug = (product.alias_name ?? product.name ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return Boolean(getWinterBasket(slug))
}
