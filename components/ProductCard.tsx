'use client'

import Link from 'next/link'
import { useState } from 'react'

import type { ProductDocument } from '@/lib/product-types'
import { AddToCartButton } from '@/components/products/AddToCartButton'
import {
  formatPrice,
  getPrimaryImage,
  getProductSizeOptions,
  getProductSlug,
  getProductSummary,
  getVariantPrice,
} from '@/lib/product-utils'

interface ProductCardProps {
  product: ProductDocument
}

export function ProductCard({ product }: ProductCardProps) {
  const imageSrc = getPrimaryImage(product)
  const isInStock = product.in_stock !== false
  const productLink = `/products/${getProductSlug(product)}`
  const sizeOptions = getProductSizeOptions(product.unit)
  const [selectedSizeValue, setSelectedSizeValue] = useState(sizeOptions[0]?.value ?? '')
  const selectedSize = sizeOptions.find((option) => option.value === selectedSizeValue) ?? sizeOptions[0]
  const displayBasePrice = selectedSize
    ? formatPrice(getVariantPrice(product.price, selectedSize.multiplier, selectedSize.surcharge))
    : formatPrice(product.price)

  return (
    <article
      style={{
        background: '#fff',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid #E7E0D4',
        boxShadow: '0 18px 40px rgba(30, 45, 36, 0.08)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Link href={productLink} aria-label={`View details for ${product.name ?? 'this product'}`}>
        <div style={{ height: '260px', background: '#EEE8DC' }}>
          <img
            src={imageSrc}
            alt={product.name ?? 'Product image'}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      </Link>

      <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: '14px' }}>
          <Link href={productLink} style={{ color: 'inherit', textDecoration: 'none', flex: 1 }}>
            <h2
              style={{
                margin: 0,
                fontSize: '1.2rem',
                color: '#1E2D24',
                fontFamily: 'Georgia, serif',
                lineHeight: 1.2,
              }}
            >
              {product.name ?? 'Untitled product'}
            </h2>
          </Link>
          <span
            style={{
              flexShrink: 0,
              background: isInStock ? '#E7F3EA' : '#F3E7E7',
              color: isInStock ? '#1E6B3A' : '#8C2F2F',
              padding: '6px 10px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            {isInStock ? 'In stock' : 'Out of stock'}
          </span>
        </div>

        <p
          style={{
            margin: 0,
            color: '#5E6E5E',
            fontSize: '0.92rem',
            lineHeight: 1.6,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
          }}
        >
          <Link href={productLink} style={{ color: 'inherit', textDecoration: 'none' }}>
            {getProductSummary(product)}
          </Link>
        </p>

        <Link
          href={productLink}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#8A6A3D',
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          View Details
        </Link>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <p style={{ margin: 0, color: '#1E2D24', fontSize: '1.1rem', fontWeight: 700 }}>
                {displayBasePrice}
              </p>

              {sizeOptions.length > 0 ? (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#F3E8D3',
                    border: '1px solid #E2C89D',
                    borderRadius: '999px',
                    padding: '4px 10px',
                  }}
                >
                  <select
                    value={selectedSizeValue}
                    onChange={(event) => setSelectedSizeValue(event.target.value)}
                    aria-label={`Select size for ${product.name ?? 'product'}`}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#8A6A3D',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {sizeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : product.unit ? (
                <span style={{ color: '#8A6A3D', fontSize: '0.85rem', fontWeight: 700 }}>
                  {product.unit}
                </span>
              ) : null}
            </div>

            <AddToCartButton
              product={product}
              size={selectedSize}
              label="ADD TO CART"
              className=""
              style={{
                padding: '12px 18px',
                background: isInStock ? '#11522b' : '#C7CEC8',
                color: '#fff',
                border: 'none',
                borderRadius: '999px',
                cursor: isInStock ? 'pointer' : 'not-allowed',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
              }}
            />
          </div>
        </div>
      </div>
    </article>
  )
}
