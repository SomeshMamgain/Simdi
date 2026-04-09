'use client'

import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

import styles from './ProductDetailPage.module.css'

interface ImageGalleryProps {
  images: string[]
  productName: string
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0] ?? '/placeholder.jpg')
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  useEffect(() => {
    setActiveImage(images[0] ?? '/placeholder.jpg')
  }, [images])

  useEffect(() => {
    if (!isLightboxOpen) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLightboxOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isLightboxOpen])

  return (
    <>
      <div className={`${styles.panel} ${styles.galleryWrap}`}>
        <button
          type="button"
          className={styles.galleryMain}
          onClick={() => setIsLightboxOpen(true)}
          aria-label={`Open image gallery for ${productName}`}
        >
          <img src={activeImage} alt={productName} loading="eager" />
          <span className={styles.galleryHint}>Tap to expand</span>
        </button>

        {images.length > 1 ? (
          <div className={styles.thumbnailRow}>
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                className={`${styles.thumbnailButton} ${activeImage === image ? styles.thumbnailButtonActive : ''}`}
                onClick={() => setActiveImage(image)}
                aria-label={`Show product image ${index + 1}`}
              >
                <img src={image} alt={`${productName} thumbnail ${index + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {isLightboxOpen ? (
        <div className={styles.lightbox} onClick={() => setIsLightboxOpen(false)} role="presentation">
          <div className={styles.lightboxInner}>
            <button
              type="button"
              className={styles.lightboxClose}
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close expanded image"
            >
              <X size={18} />
            </button>
            <img className={styles.lightboxImage} src={activeImage} alt={productName} />
          </div>
        </div>
      ) : null}
    </>
  )
}
