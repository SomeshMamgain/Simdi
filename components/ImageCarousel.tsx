'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface ImageCarouselProps {
  images: Array<{
    src: string
    alt: string
  }>
  interval?: number // ms between slides, default 4000
}

export function ImageCarousel({ images, interval = 4000 }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState<number | null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pausedRef = useRef(false)
  const touchStartXRef = useRef(0)
  const touchStartYRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (resumeRef.current) clearTimeout(resumeRef.current)
  }

  const advance = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = (prev + 1) % images.length
      setPrevIndex(prev)
      setTransitioning(true)
      setTimeout(() => {
        setPrevIndex(null)
        setTransitioning(false)
      }, 700) // match CSS transition duration
      return next
    })
  }, [images.length])

  const startAutoPlay = useCallback(() => {
    clearTimers()
    timerRef.current = setTimeout(function tick() {
      if (!pausedRef.current) advance()
      timerRef.current = setTimeout(tick, interval)
    }, interval)
  }, [advance, interval])

  useEffect(() => {
    if (images.length < 2) return
    startAutoPlay()
    return clearTimers
  }, [startAutoPlay, images.length])

  const goToSlide = (index: number) => {
    if (index === currentIndex || transitioning) return
    clearTimers()
    setPrevIndex(currentIndex)
    setTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => {
      setPrevIndex(null)
      setTransitioning(false)
    }, 800)
    // Resume autoplay after 6s of no interaction
    resumeRef.current = setTimeout(() => {
      pausedRef.current = false
      startAutoPlay()
    }, 6000)
  }

  const handleMouseEnter = () => { pausedRef.current = true }
  const handleMouseLeave = () => { pausedRef.current = false }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
    touchStartYRef.current = e.touches[0].clientY
    pausedRef.current = true
    clearTimers()
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const deltaX = touchStartXRef.current - touchEndX
    const deltaY = touchStartYRef.current - touchEndY

    // Only register as swipe if horizontal movement > vertical movement
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swiped left — go to next
        advance()
      } else {
        // Swiped right — go to previous
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
      }
    }

    pausedRef.current = false
    // Resume autoplay after 6s
    resumeRef.current = setTimeout(() => {
      startAutoPlay()
    }, 6000)
  }

  if (images.length === 0) return null

  return (
    <div style={{ flex: '1 1 400px' }}>
      {/* Carousel Container */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          borderRadius: '10px',
          overflow: 'hidden',
          backgroundColor: '#e5e7eb',
          aspectRatio: '1 / 1',
          touchAction: 'pan-y',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        } as React.CSSProperties}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous image — fades out */}
        {prevIndex !== null && (
          <img
            key={`prev-${prevIndex}`}
            src={images[prevIndex].src}
            alt={images[prevIndex].alt}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0,
              transition: 'opacity 700ms ease-in-out',
              zIndex: 1,
            }}
          />
        )}

        {/* Current image — fades in */}
        <img
          key={`current-${currentIndex}`}
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 1,
            transition: 'opacity 700ms ease-in-out',
            zIndex: 2,
            animation: 'fadeIn 700ms ease-in-out',
          }}
        />

        {/* Subtle Ken Burns zoom on current image */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(1.03); }
            to   { opacity: 1; transform: scale(1); }
          }
        `}</style>

        {/* Dots */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: index === currentIndex ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                background: index === currentIndex
                  ? '#B58E58'
                  : 'rgba(255, 255, 255, 0.55)',
                cursor: 'pointer',
                transition: 'width 400ms ease, background 400ms ease',
                padding: '4px',
                minWidth: '16px',
                minHeight: '16px',
                touchAction: 'manipulation',
              } as React.CSSProperties}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress bar at bottom of active dot — optional visual polish */}
        
        <style>{`
          @keyframes progress {
            from { width: 0%; }
            to   { width: 100%; }
          }
        `}</style>
      </div>

      {/* Info Card */}
      <div
        style={{
          background: 'rgb(32 85 53)',
          color: '#fff',
          padding: '25px',
          marginTop: '-10px',
          position: 'relative',
          zIndex: 99,
          marginInline: '20px',
          borderRadius: '8px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 20px', alignItems: 'center', justifyContent: 'center' }}>
  {[
    { icon: '🌿', text: 'FSSAI Certified' },
    { icon: '✅', text: '100% Organic' },
    { icon: '🚫', text: 'No Middlemen' },
    { icon: '🚚', text: 'Pan India Delivery' },
  ].map(({ icon, text }) => (
    <span key={text} style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', opacity: 0.92, whiteSpace: 'nowrap' }}>
      {icon} {text}
    </span>
  ))}
</div>
      </div>
    </div>
  )
}