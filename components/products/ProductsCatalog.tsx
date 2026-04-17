'use client'

import { useDeferredValue, useState } from 'react'

import { ProductCard } from '@/components/ProductCard'
import type { ProductDocument } from '@/lib/product-types'
import { getProductKeywords, getProductSummary, stripHtml } from '@/lib/product-utils'

import styles from './products-catalog.module.css'

interface ProductsCatalogProps {
  products: ProductDocument[]
}

function normalizeSearchText(value?: string) {
  if (!value) {
    return ''
  }

  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getProductSearchText(product: ProductDocument) {
  return normalizeSearchText(
    [
      product.name,
      product.alias_name,
      product.type,
      product.village,
      stripHtml(getProductSummary(product)),
      ...getProductKeywords(product),
    ]
      .filter(Boolean)
      .join(' ')
  )
}

export function ProductsCatalog({ products }: ProductsCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const deferredSearchQuery = useDeferredValue(searchQuery)
  const normalizedSearchQuery = normalizeSearchText(deferredSearchQuery)
  const searchTerms = normalizedSearchQuery ? normalizedSearchQuery.split(' ') : []
  const activeSearchLabel = searchQuery.trim()

  const filteredProducts = products.filter((product) => {
    if (!searchTerms.length) {
      return true
    }

    const searchableText = getProductSearchText(product)

    return searchTerms.every((term) => searchableText.includes(term))
  })

  return (
    <>
      <div className={styles.controls}>
        <div className={styles.searchPanel}>
          <label className={styles.label} htmlFor="products-search">
            Search Products
          </label>
          <div className={styles.searchRow}>
            <input
              id="products-search"
              type="search"
              className={styles.searchInput}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by product name, type, village, or keyword"
              aria-label="Search products"
            />

            {searchQuery ? (
              <button type="button" className={styles.clearButton} onClick={() => setSearchQuery('')}>
                Clear
              </button>
            ) : null}
          </div>

          <p className={styles.helperText}>Try Bilona Ghee, honey, rice, Garhwal, or pantry staples.</p>
        </div>

        <p className={styles.summary}>
          {activeSearchLabel
            ? `Showing ${filteredProducts.length} of ${products.length} products for "${activeSearchLabel}"`
            : `Showing ${products.length} live products`}
        </p>
      </div>

      {filteredProducts.length ? (
        <div className={styles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.$id} product={product} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>No products match your search</h2>
          <p className={styles.emptyCopy}>
            Try a different name, type, village, or keyword, or clear the search to browse the full collection again.
          </p>
          {searchQuery ? (
            <button type="button" className={styles.emptyAction} onClick={() => setSearchQuery('')}>
              Clear Search
            </button>
          ) : null}
        </div>
      )}
    </>
  )
}
