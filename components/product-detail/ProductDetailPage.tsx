import Link from 'next/link'
import { ArrowLeft, ChevronRight, Leaf, Sparkles } from 'lucide-react'

import { ProductCard } from '@/components/ProductCard'
import type { ProductDocument } from '@/lib/product-types'
import {
  formatPrice,
  getPrimaryImage,
  getProductGalleryImages,
  getProductHighlights,
  getProductIngredients,
  getProductKeywords,
  getProductSlug,
  getProductVideoPresentation,
  toSerializableProduct,
  toSerializableProducts,
} from '@/lib/product-utils'

import styles from './ProductDetailPage.module.css'
import { ImageGallery } from './ImageGallery'
import { NutritionFacts } from './NutritionFacts'
import { PriceSection } from './PriceSection'
import { ProductHeader } from './ProductHeader'
import { ProductTabs } from './ProductTabs'
import { ReviewSection } from './ReviewSection'

interface ProductDetailPageProps {
  product: ProductDocument
  relatedProducts: ProductDocument[]
}

export function ProductDetailPage({ product, relatedProducts }: ProductDetailPageProps) {
  const serializableProduct = toSerializableProduct(product)
  const serializableRelatedProducts = toSerializableProducts(relatedProducts)
  const galleryImages = getProductGalleryImages(serializableProduct)
  const highlights = getProductHighlights(serializableProduct)
  const ingredients = getProductIngredients(serializableProduct)
  const keywords = getProductKeywords(serializableProduct)
  const video = getProductVideoPresentation(serializableProduct.video)

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'details', label: 'Details' },
    { id: 'preparation', label: 'Preparation' },
    { id: 'history', label: 'History' },
    { id: 'reviews', label: 'Reviews' },
    ...(video ? [{ id: 'video', label: 'Video' }] : []),
    ...(relatedProducts.length > 0 ? [{ id: 'related', label: 'Related' }] : []),
  ]

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.breadcrumbs}>
          <Link href="/">Home</Link>
          <ChevronRight size={14} />
          <Link href="/shop">Products</Link>
          <ChevronRight size={14} />
          <span className={styles.breadcrumbAccent}>{serializableProduct.name ?? 'Product'}</span>
        </div>

        {/* <Link href="/shop" className={styles.backLink}>
          <ArrowLeft size={16} />
          Back to Products
        </Link> */}

        <div className={styles.heroGrid}>
          <ImageGallery images={galleryImages} productName={serializableProduct.name ?? 'Product image'} />

          <div className={`${styles.panel} ${styles.summaryPanel}`}>
            <ProductHeader product={serializableProduct} />
            <PriceSection product={serializableProduct} />
          </div>
        </div>

        <ProductTabs sections={sections} />

        <div className={styles.contentGrid}>
          <div className={styles.contentColumn}>
            <section id="overview" className={`${styles.panel} ${styles.sectionCard}`}>
              <h2 className={styles.sectionTitle}>Overview</h2>
              <p className={styles.sectionLead}>
                {serializableProduct.description ?? 'A handcrafted Himalayan specialty sourced directly from the mountains.'}
              </p>

              <div className={styles.infoGrid}>
                <div className={styles.infoTile}>
                  <span className={styles.infoTileLabel}>Alias Name</span>
                  <span className={styles.infoTileValue}>{serializableProduct.alias_name ?? 'Authentic mountain specialty'}</span>
                </div>
                <div className={styles.infoTile}>
                  <span className={styles.infoTileLabel}>Origin Village</span>
                  <span className={styles.infoTileValue}>{serializableProduct.village ?? 'Pauri Garhwal, Uttarakhand'}</span>
                </div>
                <div className={styles.infoTile}>
                  <span className={styles.infoTileLabel}>Category</span>
                  <span className={styles.infoTileValue}>{serializableProduct.type ?? 'Traditional product'}</span>
                </div>
                <div className={styles.infoTile}>
                  <span className={styles.infoTileLabel}>Seasonality</span>
                  <span className={styles.infoTileValue}>{serializableProduct.seasonal ? 'Seasonal harvest' : 'Available year-round'}</span>
                </div>
              </div>
            </section>

            <section id="nutrition" className={`${styles.panel} ${styles.sectionCard}`}>
              <h2 className={styles.sectionTitle}>Nutrition Facts</h2>
              <p className={styles.sectionLead}>Clean, readable nutrition data for quick comparison and conscious shopping.</p>
              <NutritionFacts product={serializableProduct} />
            </section>

            <section id="details" className={`${styles.panel} ${styles.sectionCard}`}>
              <h2 className={styles.sectionTitle}>Details</h2>
              <p className={styles.sectionLead}>
                Everything you need to know before ordering, from standout benefits to pantry guidance.
              </p>

              {highlights.length > 0 ? (
                <>
                  <div className={styles.chipList}>
                    {highlights.map((highlight) => (
                      <span key={highlight} className={styles.chip}>
                        <Sparkles size={14} />
                        {highlight}
                      </span>
                    ))}
                  </div>
                </>
              ) : null}

              {ingredients.length > 0 ? (
                <>
                  <h3 className={styles.asideTitle} style={{ marginTop: '22px' }}>
                    Ingredients
                  </h3>
                  <ul className={`${styles.list} ${styles.listCompact}`}>
                    {ingredients.map((ingredient) => (
                      <li key={ingredient}>{ingredient}</li>
                    ))}
                  </ul>
                </>
              ) : null}

              <div className={styles.infoGrid}>
                {serializableProduct.storage ? (
                  <div className={styles.infoTile}>
                    <span className={styles.infoTileLabel}>Storage</span>
                    <span className={styles.infoTileValue}>{serializableProduct.storage}</span>
                  </div>
                ) : null}
                {serializableProduct.shelf_life ? (
                  <div className={styles.infoTile}>
                    <span className={styles.infoTileLabel}>Shelf Life</span>
                    <span className={styles.infoTileValue}>{serializableProduct.shelf_life}</span>
                  </div>
                ) : null}
                {serializableProduct.texture ? (
                  <div className={styles.infoTile}>
                    <span className={styles.infoTileLabel}>Texture</span>
                    <span className={styles.infoTileValue}>{serializableProduct.texture}</span>
                  </div>
                ) : null}
                {serializableProduct.taste_note ? (
                  <div className={styles.infoTile}>
                    <span className={styles.infoTileLabel}>Taste Notes</span>
                    <span className={styles.infoTileValue}>{serializableProduct.taste_note}</span>
                  </div>
                ) : null}
              </div>
            </section>

            <section id="preparation" className={`${styles.panel} ${styles.sectionCard}`}>
              <h2 className={styles.sectionTitle}>Preparation</h2>
              <p className={styles.sectionLead}>
                {serializableProduct.preparation ?? serializableProduct.method ?? 'Preparation guidance will be shared here once available.'}
              </p>

              {serializableProduct.method && serializableProduct.method !== serializableProduct.preparation ? (
                <div className={styles.quote}>
                  <span className={styles.quoteBody}>{serializableProduct.method}</span>
                </div>
              ) : null}
            </section>

            <section id="history" className={`${styles.panel} ${styles.sectionCard}`}>
              <h2 className={styles.sectionTitle}>History</h2>
              <p className={styles.sectionLead}>
                {serializableProduct.history ?? 'This product carries the heritage, techniques, and seasonal rhythms of Himalayan village life.'}
              </p>
            </section>

            <section id="reviews" className={`${styles.panel} ${styles.sectionCard}`}>
              <h2 className={styles.sectionTitle}>Customer Reviews</h2>
              <p className={styles.sectionLead}>A quick look at what customers are saying about this mountain-made product.</p>
              <ReviewSection product={serializableProduct} />
            </section>

            {video ? (
              <section id="video" className={`${styles.panel} ${styles.sectionCard}`}>
                <h2 className={styles.sectionTitle}>Product Video</h2>
                <p className={styles.sectionLead}>See the product, its texture, and its story in motion.</p>

                {video.kind === 'embed' ? (
                  <iframe
                    className={styles.videoFrame}
                    src={video.src}
                    title={`${serializableProduct.name ?? 'Product'} video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video className={styles.directVideo} controls preload="metadata">
                    <source src={video.src} />
                    Your browser does not support embedded video playback.
                  </video>
                )}
              </section>
            ) : null}

            {serializableRelatedProducts.length > 0 ? (
              <section id="related" className={`${styles.panel} ${styles.sectionCard}`}>
                <h2 className={styles.sectionTitle}>Related Products</h2>
                <p className={styles.sectionLead}>More from the same collection, village network, or flavor family.</p>

                <div className={styles.relatedGrid}>
                  {serializableRelatedProducts.map((relatedProduct) => (
                    <Link
                      key={relatedProduct.$id}
                      href={`/shop/${getProductSlug(relatedProduct)}`}
                      className={styles.relatedCard}
                    >
                      <img
                        className={styles.relatedImage}
                        src={getPrimaryImage(relatedProduct)}
                        alt={relatedProduct.name ?? 'Related product'}
                        loading="lazy"
                      />
                      <div className={styles.relatedBody}>
                        <h3 className={styles.relatedName}>{relatedProduct.name ?? 'Untitled product'}</h3>
                        <p className={styles.relatedMeta}>{relatedProduct.alias_name ?? relatedProduct.type ?? 'From the Simdi collection'}</p>
                        <span className={styles.relatedPrice}>{formatPrice(relatedProduct.price, relatedProduct.unit)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className={styles.contentColumn}>
            <section className={`${styles.panel} ${styles.asideCard}`}>
              <h2 className={styles.asideTitle}>Why It Stands Out</h2>
              <p className={styles.asideText}>
                Each product page is built to highlight the producer story, nutritional clarity, and the practical details that help customers buy with confidence.
              </p>
              <div className={styles.chipList}>
                <span className={styles.chip}>
                  <Leaf size={14} />
                  Direct-from-source
                </span>
                <span className={styles.chip}>
                  <Sparkles size={14} />
                  Detailed product story
                </span>
              </div>
            </section>

            {keywords.length > 0 ? (
              <section className={`${styles.panel} ${styles.asideCard}`}>
                <h2 className={styles.asideTitle}>Search Context</h2>
                <p className={styles.asideText}>Useful search terms associated with this product.</p>
                <div className={styles.keywords}>
                  {keywords.map((keyword) => (
                    <span key={keyword} className={styles.keyword}>
                      {keyword}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            {serializableRelatedProducts.length > 0 ? (
              <>
                <section className={styles.panel}>
                <ProductCard product={serializableRelatedProducts[0]} />
              </section>
                <section className={styles.panel}>
                <ProductCard product={serializableRelatedProducts[3]} />
              </section>
              </>
            
              
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  )
}
