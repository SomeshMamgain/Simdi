'use client'

import { Minus, Plus, ShieldCheck, ShoppingBag, Truck } from 'lucide-react'
import { useMemo, useState } from 'react'

import type { ProductDocument } from '@/lib/product-types'
import {
  formatPrice,
  getPrimaryImage,
  getProductSizeOptions,
  getVariantPrice,
  isProductInStock,
  toNumber,
} from '@/lib/product-utils'
import { useCartStore } from '@/store/cartStore'

import styles from './ProductDetailPage.module.css'

interface PriceSectionProps {
  product: ProductDocument
}

export function PriceSection({ product }: PriceSectionProps) {
  const addItem = useCartStore((state) => state.addItem)
  const sizeOptions = getProductSizeOptions(product.unit)
  const [selectedSizeValue, setSelectedSizeValue] = useState(sizeOptions[0]?.value ?? '')
  const [quantity, setQuantity] = useState(1)
  const inStock = isProductInStock(product)

  const selectedSize = useMemo(
    () => sizeOptions.find((option) => option.value === selectedSizeValue) ?? sizeOptions[0],
    [selectedSizeValue, sizeOptions]
  )

  const priceForSelection = selectedSize
    ? getVariantPrice(product.price, selectedSize.multiplier, selectedSize.surcharge)
    : product.price

  const unitLabel = selectedSize?.label ?? product.unit
  const totalPrice = toNumber(priceForSelection)

  const handleAddToCart = () => {
    addItem(
      {
        id: selectedSize ? `${product.$id}:${selectedSize.value}` : product.$id,
        name: selectedSize ? `${product.name ?? 'Untitled product'} (${selectedSize.label})` : product.name ?? 'Untitled product',
        price: formatPrice(priceForSelection, unitLabel),
        img: getPrimaryImage(product),
      },
      quantity
    )
  }

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
          <div className={styles.quantityControl}>
            <button
              type="button"
              className={styles.quantityButton}
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className={styles.quantityValue}>{quantity}</span>
            <button
              type="button"
              className={styles.quantityButton}
              onClick={() => setQuantity((current) => current + 1)}
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      <button type="button" className={styles.addButton} disabled={!inStock} onClick={handleAddToCart}>
        <ShoppingBag size={16} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
        {inStock ? `Add ${quantity} to Cart` : 'Out of Stock'}
      </button>

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
