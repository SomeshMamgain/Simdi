'use client'

import { ShieldCheck, Truck } from 'lucide-react'
import { useState } from 'react'

import { AddToCartButton } from '@/components/products/AddToCartButton'
import { QuantitySelector } from '@/components/products/QuantitySelector'
import type { ProductDocument } from '@/lib/product-types'
import {
  formatPrice,
  getProductSizeOptions,
  getVariantPrice,
  isProductInStock,
  toNumber,
} from '@/lib/product-utils'

import styles from './ProductDetailPage.module.css'

interface PriceSectionProps {
  product: ProductDocument
}

export function PriceSection({ product }: PriceSectionProps) {
  const sizeOptions = getProductSizeOptions(product.unit)
  const [selectedSizeValue, setSelectedSizeValue] = useState(sizeOptions[0]?.value ?? '')
  const [quantity, setQuantity] = useState(1)
  const inStock = isProductInStock(product)

  const selectedSize = sizeOptions.find((option) => option.value === selectedSizeValue) ?? sizeOptions[0]

  const priceForSelection = selectedSize
    ? getVariantPrice(product.price, selectedSize.multiplier, selectedSize.surcharge)
    : product.price

  const unitLabel = selectedSize?.label ?? product.unit
  const totalPrice = toNumber(priceForSelection)

  return (
    <section className={styles.priceCard} aria-label="Price and purchase options">
      <div>
        <span className={styles.priceLabel}>Price</span>
        <div className={styles.priceRow}>
          <strong className={styles.priceValue}>{formatPrice(priceForSelection)}</strong>
          <span className={styles.priceMeta}>{unitLabel ? `Per ${unitLabel}` : 'Single pack pricing'}</span>
        </div>
      </div>

      <div className={styles.purchaseRow}>
        {sizeOptions.length > 0 ? (
          <div className={styles.controlCard}>
            <span className={styles.controlLabel}>Pack Size</span>
            <select
              className={styles.sizeSelect}
              value={selectedSizeValue}
              onChange={(event) => setSelectedSizeValue(event.target.value)}
              aria-label={`Select pack size for ${product.name ?? 'this product'}`}
            >
              {sizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className={styles.controlCard}>
          <span className={styles.controlLabel}>Quantity</span>
          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            className={styles.quantityControl}
            buttonClassName={styles.quantityButton}
            inputClassName={styles.quantityInput}
          />
        </div>
      </div>

      <AddToCartButton
        product={product}
        quantity={quantity}
        size={selectedSize}
        label={inStock ? `Add ${quantity} to Cart` : 'Out of Stock'}
        className={styles.addButton}
      />

      <div className={styles.helperGrid}>
        <div className={styles.helperCard}>
          <span className={styles.helperTitle}>Estimated Total</span>
          <span className={styles.helperBody}>
            {totalPrice !== null ? formatPrice(totalPrice * quantity, unitLabel) : 'Calculated at checkout'}
          </span>
        </div>
        <div className={styles.helperCard}>
          <span className={styles.helperTitle}>Availability</span>
          <span className={styles.helperBody}>{inStock ? 'Ready to ship from our mountain pantry' : 'Currently unavailable'}</span>
        </div>
        <div className={styles.helperCard}>
          <span className={styles.helperTitle}>
            <Truck size={14} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
            Delivery
          </span>
          <span className={styles.helperBody}>Pan-India shipping with careful packaging for freshness.</span>
        </div>
        <div className={styles.helperCard}>
          <span className={styles.helperTitle}>
            <ShieldCheck size={14} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
            Assurance
          </span>
          <span className={styles.helperBody}>Sourced directly from Himalayan producers and village collectives.</span>
        </div>
      </div>
    </section>
  )
}
