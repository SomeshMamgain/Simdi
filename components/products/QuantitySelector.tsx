'use client'

import { Minus, Plus } from 'lucide-react'

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
  className?: string
  buttonClassName?: string
  inputClassName?: string
}

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max,
  disabled = false,
  className,
  buttonClassName,
  inputClassName,
}: QuantitySelectorProps) {
  const normalizedValue = Number.isFinite(value) ? value : min

  const handleChange = (nextValue: number) => {
    if (!Number.isFinite(nextValue)) {
      return
    }

    const clampedValue = Math.max(min, max ? Math.min(max, nextValue) : nextValue)
    onChange(clampedValue)
  }

  return (
    <div className={className}>
      <button
        type="button"
        className={buttonClassName}
        onClick={() => handleChange(normalizedValue - 1)}
        disabled={disabled || normalizedValue <= min}
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      <input
        className={inputClassName}
        type="number"
        min={min}
        max={max}
        value={normalizedValue}
        disabled={disabled}
        inputMode="numeric"
        onChange={(event) => handleChange(Number(event.target.value || min))}
        aria-label="Quantity"
      />
      <button
        type="button"
        className={joinClasses(buttonClassName)}
        onClick={() => handleChange(normalizedValue + 1)}
        disabled={disabled || (typeof max === 'number' ? normalizedValue >= max : false)}
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  )
}
