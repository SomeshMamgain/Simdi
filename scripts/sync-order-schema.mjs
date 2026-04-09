import { Client, Databases } from 'node-appwrite'

function getEnv(...keys) {
  for (const key of keys) {
    const value = process.env[key]

    if (value) {
      return value
    }
  }

  return ''
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitForAttributes(collectionId, keys) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const attributeList = await databases.listAttributes({ databaseId, collectionId })
    const attributesByKey = new Map(attributeList.attributes.map((attribute) => [attribute.key, attribute]))
    const allAvailable = keys.every((key) => attributesByKey.get(key)?.status === 'available')

    if (allAvailable) {
      return attributesByKey
    }

    await sleep(1000)
  }

  const latestAttributeList = await databases.listAttributes({ databaseId, collectionId })
  return new Map(latestAttributeList.attributes.map((attribute) => [attribute.key, attribute]))
}

const endpoint = getEnv('NEXT_PUBLIC_APPWRITE_ENDPOINT')
const projectId = getEnv('NEXT_PUBLIC_APPWRITE_PROJECT_ID')
const apiKey = getEnv('APPWRITE_API_KEY')
const databaseId = getEnv('NEXT_PUBLIC_APPWRITE_DATABASE_ID', 'NEXT_PUBLIC_APPWRITE_DB_ID', 'APPWRITE_DATABASE_ID')
const preferredCollectionId = getEnv(
  'NEXT_PUBLIC_APPWRITE_ORDER_COLLECTION_ID',
  'NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID',
  'NEXT_PUBLIC_APPWRITE_COLLECTION_ID',
  'APPWRITE_ORDER_COLLECTION_ID',
  'APPWRITE_ORDERS_COLLECTION_ID',
  'APPWRITE_COLLECTION_ID'
)

if (!endpoint || !projectId || !apiKey || !databaseId) {
  throw new Error('Missing Appwrite environment values required for order schema sync')
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey)

const databases = new Databases(client)

const statusEnumValues = [
  'pending',
  'completed',
  'failed',
  'confirmed',
  'processing',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'cancelled',
]

const scalarAttributes = [
  ['user_id', (collectionId) => databases.createStringAttribute({ databaseId, collectionId, key: 'user_id', size: 50, required: false })],
  ['email', (collectionId) => databases.createEmailAttribute({ databaseId, collectionId, key: 'email', required: false })],
  ['name', (collectionId) => databases.createStringAttribute({ databaseId, collectionId, key: 'name', size: 100, required: false })],
  ['phone', (collectionId) => databases.createStringAttribute({ databaseId, collectionId, key: 'phone', size: 20, required: false })],
  ['order_payload', (collectionId) => databases.createLongtextAttribute({ databaseId, collectionId, key: 'order_payload', required: false })],
  ['order_number', (collectionId) => databases.createStringAttribute({ databaseId, collectionId, key: 'order_number', size: 50, required: false })],
  ['date', (collectionId) => databases.createDatetimeAttribute({ databaseId, collectionId, key: 'date', required: false })],
  ['subtotal', (collectionId) => databases.createFloatAttribute({ databaseId, collectionId, key: 'subtotal', required: false })],
  ['discount_code', (collectionId) => databases.createStringAttribute({ databaseId, collectionId, key: 'discount_code', size: 50, required: false })],
  ['discount_amount', (collectionId) => databases.createFloatAttribute({ databaseId, collectionId, key: 'discount_amount', required: false })],
  ['discount_percent', (collectionId) => databases.createIntegerAttribute({ databaseId, collectionId, key: 'discount_percent', required: false, min: 0, max: 100 })],
  ['handling_charges', (collectionId) => databases.createFloatAttribute({ databaseId, collectionId, key: 'handling_charges', required: false })],
  ['handling_charge_percent', (collectionId) => databases.createIntegerAttribute({ databaseId, collectionId, key: 'handling_charge_percent', required: false, min: 0, max: 100 })],
  ['total_amount', (collectionId) => databases.createFloatAttribute({ databaseId, collectionId, key: 'total_amount', required: false })],
  ['payment_method', (collectionId) => databases.createStringAttribute({ databaseId, collectionId, key: 'payment_method', size: 30, required: false })],
  ['razorpay_order_id', (collectionId) => databases.createStringAttribute({ databaseId, collectionId, key: 'razorpay_order_id', size: 100, required: false })],
  ['razorpay_payment_id', (collectionId) => databases.createStringAttribute({ databaseId, collectionId, key: 'razorpay_payment_id', size: 100, required: false })],
  ['razorpay_signature', (collectionId) => databases.createStringAttribute({ databaseId, collectionId, key: 'razorpay_signature', size: 200, required: false })],
  ['payment_status', (collectionId) => databases.createEnumAttribute({ databaseId, collectionId, key: 'payment_status', elements: ['pending', 'completed', 'failed', 'refunded'], required: false })],
  ['payment_date', (collectionId) => databases.createDatetimeAttribute({ databaseId, collectionId, key: 'payment_date', required: false })],
  ['type', (collectionId) => databases.createStringAttribute({ databaseId, collectionId, key: 'type', size: 50, required: false })],
  ['in_transit', (collectionId) => databases.createDatetimeAttribute({ databaseId, collectionId, key: 'in_transit', required: false })],
  ['out_for_delivery', (collectionId) => databases.createDatetimeAttribute({ databaseId, collectionId, key: 'out_for_delivery', required: false })],
  ['delivered_date', (collectionId) => databases.createDatetimeAttribute({ databaseId, collectionId, key: 'delivered_date', required: false })],
  ['tracking_number', (collectionId) => databases.createStringAttribute({ databaseId, collectionId, key: 'tracking_number', size: 50, required: false })],
  ['notes', (collectionId) => databases.createLongtextAttribute({ databaseId, collectionId, key: 'notes', required: false })],
  ['admin_notes', (collectionId) => databases.createLongtextAttribute({ databaseId, collectionId, key: 'admin_notes', required: false })],
  ['refund_status', (collectionId) => databases.createEnumAttribute({ databaseId, collectionId, key: 'refund_status', elements: ['none', 'pending', 'completed'], required: false })],
  ['refund_amount', (collectionId) => databases.createFloatAttribute({ databaseId, collectionId, key: 'refund_amount', required: false })],
]

async function resolveOrderCollectionId() {
  if (preferredCollectionId) {
    try {
      await databases.getCollection({ databaseId, collectionId: preferredCollectionId })
      return preferredCollectionId
    } catch {
      // Fall through to discovery.
    }
  }

  const collectionList = await databases.listCollections({ databaseId })
  const matchingCollection = collectionList.collections.find((collection) => {
    const normalizedName = collection.name.trim().toLowerCase().replace(/\s+/g, '_')
    return normalizedName === 'order_received' || normalizedName === 'orders' || normalizedName.includes('order')
  })

  if (!matchingCollection) {
    throw new Error('Unable to find the Appwrite orders collection. Set NEXT_PUBLIC_APPWRITE_ORDER_COLLECTION_ID to the correct collection ID.')
  }

  return matchingCollection.$id
}

async function main() {
  const collectionId = await resolveOrderCollectionId()
  const collectionAwareAttributes = scalarAttributes.map(([key, createAttribute]) => [
    key,
    () => createAttribute(collectionId),
  ])
  const indexes = [
    ['orders_by_user_id', ['user_id'], () => databases.createIndex({ databaseId, collectionId, key: 'orders_by_user_id', type: 'key', attributes: ['user_id'] })],
    ['orders_by_email', ['email'], () => databases.createIndex({ databaseId, collectionId, key: 'orders_by_email', type: 'key', attributes: ['email'] })],
    ['orders_by_order_number', ['order_number'], () => databases.createIndex({ databaseId, collectionId, key: 'orders_by_order_number', type: 'unique', attributes: ['order_number'] })],
    ['orders_by_status', ['status'], () => databases.createIndex({ databaseId, collectionId, key: 'orders_by_status', type: 'key', attributes: ['status'] })],
    ['orders_by_date', ['date'], () => databases.createIndex({ databaseId, collectionId, key: 'orders_by_date', type: 'key', attributes: ['date'] })],
  ]

  console.log(`Syncing order schema for collection "${collectionId}"...`)

  const existingAttributeList = await databases.listAttributes({ databaseId, collectionId })
  const existingAttributes = new Map(existingAttributeList.attributes.map((attribute) => [attribute.key, attribute]))

  for (const [key, createAttribute] of collectionAwareAttributes) {
    if (existingAttributes.has(key)) {
      console.log(`- attribute "${key}" already exists`)
      continue
    }

    console.log(`- creating attribute "${key}"`)
    try {
      await createAttribute()
    } catch (error) {
      if (error?.type === 'attribute_already_exists') {
        console.log(`- attribute "${key}" became available during sync`)
        continue
      }

      throw error
    }
    await sleep(250)
  }

  const existingStatus = existingAttributes.get('status')

  if (existingStatus?.type === 'enum') {
    console.log('- updating "status" enum to support shipping workflow values')
    await databases.updateEnumAttribute({
      databaseId,
      collectionId,
      key: 'status',
      elements: statusEnumValues,
      required: existingStatus.required,
      xdefault: typeof existingStatus.default === 'string' ? existingStatus.default : undefined,
    })
    await sleep(250)
  }

  const availableAttributes = await waitForAttributes(collectionId, ['user_id', 'email', 'order_number', 'status', 'date'])

  const existingIndexList = await databases.listIndexes({ databaseId, collectionId })
  const existingIndexes = new Set(existingIndexList.indexes.map((index) => index.key))

  for (const [key, attributeKeys, createIndex] of indexes) {
    if (existingIndexes.has(key)) {
      console.log(`- index "${key}" already exists`)
      continue
    }

    if (!attributeKeys.every((attributeKey) => availableAttributes.get(attributeKey)?.status === 'available')) {
      console.log(`- skipping index "${key}" until attributes are available`)
      continue
    }

    console.log(`- creating index "${key}"`)
    try {
      await createIndex()
    } catch (error) {
      if (error?.type === 'index_already_exists') {
        console.log(`- index "${key}" became available during sync`)
        continue
      }

      throw error
    }
    await sleep(250)
  }

  console.log('')
  console.log('Order schema sync finished.')
  console.log('Note: this script keeps using the existing JSON fields `items` and `shipping_address` for compatibility.')
  console.log('If you want a dedicated `delivery_address` JSON attribute, add it manually in Appwrite and the app will start using it automatically.')
}

main().catch((error) => {
  console.error('Order schema sync failed:')
  console.error(error)
  process.exitCode = 1
})
