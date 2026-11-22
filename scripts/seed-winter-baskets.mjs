import { Client, Databases, ID, Query } from 'node-appwrite'

function getEnv(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing ${name}`)
  return value
}

const databases = new Databases(new Client().setEndpoint(getEnv('NEXT_PUBLIC_APPWRITE_ENDPOINT')).setProject(getEnv('NEXT_PUBLIC_APPWRITE_PROJECT_ID')).setKey(getEnv('APPWRITE_API_KEY')))
const databaseId = getEnv('NEXT_PUBLIC_APPWRITE_DATABASE_ID')
const collectionId = getEnv('NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID')
const baskets = [
  ['Pahadi Winter Essentials', 'pahadi-winter-essentials', 1899, 'The everyday taste of the Himalayas. A starter collection for everyday mountain-style meals, bringing together traditional pulses, grains, millet, ghee, seasoning, salt and pickle.'],
  ['Himalayan Winter Nourishment', 'himalayan-winter-nourishment', 2899, 'Winter tastes better when it comes from the mountains. A more complete winter pantry for families, featuring traditional pulses, grains, honey, walnuts and cooking spices.'],
  ['Pahadi Heritage Luxury Hamper', 'pahadi-heritage-luxury-hamper', 4499, '12 treasures from the Himalayas. One gift of warmth. A premium collection of Himalayan pantry staples, traditional pulses, grains, premium ghee and honey, spices, pickle and snacks. Suitable for gifting and family celebrations.'],
]
const attributes = new Set((await databases.listAttributes({ databaseId, collectionId })).attributes.map((attribute) => attribute.key))
const existing = await databases.listDocuments({ databaseId, collectionId, queries: [Query.limit(100)] })

for (const [name, slug, price, description] of baskets) {
  if (existing.documents.some((document) => document.alias_name === slug || document.name === name)) {
    console.log(`Skipping existing basket: ${name}`)
    continue
  }
  const data = {}
  const values = { name, alias_name: slug, price: String(price), unit: 'basket', description: `${description} Pricing and availability require internal approval before publication.`, type: 'Winter Collection', village: 'Pauri Garhwal, Uttarakhand', image: '/hero-products.jpg', image_list_comma_separated_link: '/hero-products.jpg', keywords: 'SIMDI Winter Collection, Himalayan gift basket, Pahadi pantry, winter hamper', key_highlights_comma_separated: 'Curated Himalayan pantry, Packed as one basket, Review required before publication', seasonal: true, in_stock: false, stock: '0' }
  for (const [key, value] of Object.entries(values)) if (attributes.has(key)) data[key] = value
  await databases.createDocument({ databaseId, collectionId, documentId: ID.unique(), data })
  console.log(`Created review-only basket: ${name} (${slug})`)
}
