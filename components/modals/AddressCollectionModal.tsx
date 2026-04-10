'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Loader2, MapPin, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { hasAddressErrors, normalizeAddressFormData, normalizePhoneNumber, validateAddressForm } from '@/lib/address-utils'
import { INDIAN_STATES } from '@/lib/constants/indian-states'
import { useAuthStore } from '@/store/authStore'
import { useCheckoutStore } from '@/store/checkoutStore'
import type { AddressFormData, AddressFormErrors } from '@/types/address'
import type { UserProfile } from '@/types/auth'

import styles from './address-collection.module.css'

interface AddressCollectionModalProps {
  open: boolean
  onClose: () => void
  onSaved: (profile: UserProfile) => void | Promise<void>
}

function getDefaultAddress(currentUserName?: string, currentPhone?: string) {
  return normalizeAddressFormData({
    fullName: currentUserName ?? '',
    phoneNumber: currentPhone ?? '',
    country: 'India',
  })
}

export function AddressCollectionModal({ open, onClose, onSaved }: AddressCollectionModalProps) {
  const currentUser = useAuthStore((state) => state.currentUser)
  const profile = useAuthStore((state) => state.profile)
  const updateUserProfile = useAuthStore((state) => state.updateUserProfile)
  const pendingAddress = useCheckoutStore((state) => state.pendingAddress)
  const [formData, setFormData] = useState<AddressFormData>(getDefaultAddress())
  const [errors, setErrors] = useState<AddressFormErrors>({})
  const [saveForFutureOrders, setSaveForFutureOrders] = useState(Boolean(profile?.savedForFutureOrders))
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const initialAddress = useMemo(() => {
    if (pendingAddress) {
      return normalizeAddressFormData(pendingAddress)
    }

    if (profile?.savedForFutureOrders && profile.fullAddress) {
      return normalizeAddressFormData(profile.fullAddress)
    }

    return getDefaultAddress(currentUser?.name, profile?.phone ?? currentUser?.phone)
  }, [currentUser?.name, currentUser?.phone, pendingAddress, profile?.fullAddress, profile?.phone, profile?.savedForFutureOrders])

  useEffect(() => {
    if (!open) {
      return
    }

    setFormData(initialAddress)
    setErrors({})
    setStatusMessage(null)
    setSaveForFutureOrders(Boolean(profile?.savedForFutureOrders))
  }, [initialAddress, open, profile?.savedForFutureOrders])

  const formErrors = useMemo(() => validateAddressForm(formData), [formData])
  const isFormValid = !hasAddressErrors(formErrors)

  const updateField = (field: keyof AddressFormData, value: string) => {
    const nextValue = field === 'phoneNumber'
      ? normalizePhoneNumber(value)
      : field === 'postalCode'
        ? value.replace(/\D/g, '').slice(0, 6)
        : value

    setFormData((current) => {
      const nextForm = {
        ...current,
        [field]: nextValue,
      }

      setErrors(validateAddressForm(nextForm))
      return nextForm
    })
    setStatusMessage(null)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedForm = normalizeAddressFormData(formData)
    const validationErrors = validateAddressForm(normalizedForm)
    setErrors(validationErrors)

    if (hasAddressErrors(validationErrors)) {
      setStatusMessage('Please review the highlighted fields before continuing.')
      return
    }

    setIsSaving(true)
    setStatusMessage(null)

    try {
      const result = await updateUserProfile({
        fullAddress: normalizedForm,
        saveForFutureOrders,
      })

      if (!result.profile) {
        throw new Error('Failed to save your delivery address')
      }

      await Promise.resolve(onSaved(result.profile))
      onClose()
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Failed to save address')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => !nextOpen && !isSaving && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <div className={styles.hero}>
            <p className={styles.eyebrow}>DELIVERY DETAILS</p>
            <Dialog.Title className={styles.title}>Delivery Address</Dialog.Title>
            <Dialog.Description className={styles.description}>
              Confirm where your order should go before we open Razorpay. We&apos;ll use these details for packing,
              delivery coordination, and your order record.
            </Dialog.Description>
          </div>

          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close delivery address modal"
          >
            <X size={20} />
          </button>

          <div className={styles.body}>
            {statusMessage ? <div className={styles.status}>{statusMessage}</div> : null}

            <form onSubmit={handleSubmit}>
              <div className={styles.grid}>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Full Name</span>
                  <input
                    className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
                    value={formData.fullName}
                    onChange={(event) => updateField('fullName', event.target.value)}
                    placeholder="Aarohi Rawat"
                    disabled={isSaving}
                    autoComplete="name"
                  />
                  {errors.fullName ? <span className={styles.error}>{errors.fullName}</span> : null}
                </label>

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Phone Number</span>
                  <input
                    className={`${styles.input} ${errors.phoneNumber ? styles.inputError : ''}`}
                    value={formData.phoneNumber}
                    onChange={(event) => updateField('phoneNumber', event.target.value)}
                    placeholder="9999999999"
                    disabled={isSaving}
                    inputMode="numeric"
                    autoComplete="tel"
                  />
                  {errors.phoneNumber ? (
                    <span className={styles.error}>{errors.phoneNumber}</span>
                  ) : (
                    <span className={styles.hint}>10 digits, starts with 6-9</span>
                  )}
                </label>

                <label className={`${styles.field} ${styles.full}`}>
                  <span className={styles.fieldLabel}>Address Line 1</span>
                  <input
                    className={`${styles.input} ${errors.addressLine1 ? styles.inputError : ''}`}
                    value={formData.addressLine1}
                    onChange={(event) => updateField('addressLine1', event.target.value)}
                    placeholder="Village, street, house number"
                    disabled={isSaving}
                    autoComplete="address-line1"
                  />
                  {errors.addressLine1 ? <span className={styles.error}>{errors.addressLine1}</span> : null}
                </label>

                <label className={`${styles.field} ${styles.full}`}>
                  <span className={styles.fieldLabel}>Address Line 2</span>
                  <input
                    className={styles.input}
                    value={formData.addressLine2 ?? ''}
                    onChange={(event) => updateField('addressLine2', event.target.value)}
                    placeholder="Apartment, suite, landmark"
                    disabled={isSaving}
                    autoComplete="address-line2"
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>City</span>
                  <input
                    className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
                    value={formData.city}
                    onChange={(event) => updateField('city', event.target.value)}
                    placeholder="Dehradun"
                    disabled={isSaving}
                    autoComplete="address-level2"
                  />
                  {errors.city ? <span className={styles.error}>{errors.city}</span> : null}
                </label>

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>State</span>
                  <select
                    className={`${styles.select} ${errors.state ? styles.selectError : ''}`}
                    value={formData.state}
                    onChange={(event) => updateField('state', event.target.value)}
                    disabled={isSaving}
                    autoComplete="address-level1"
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors.state ? <span className={styles.error}>{errors.state}</span> : null}
                </label>

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Postal Code</span>
                  <input
                    className={`${styles.input} ${errors.postalCode ? styles.inputError : ''}`}
                    value={formData.postalCode}
                    onChange={(event) => updateField('postalCode', event.target.value)}
                    placeholder="249001"
                    disabled={isSaving}
                    inputMode="numeric"
                    autoComplete="postal-code"
                  />
                  {errors.postalCode ? <span className={styles.error}>{errors.postalCode}</span> : null}
                </label>

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Country</span>
                  <input
                    className={`${styles.input} ${styles.readOnly}`}
                    value={formData.country}
                    readOnly
                    disabled
                    autoComplete="country-name"
                  />
                </label>
              </div>

              <label className={styles.checkboxRow}>
                <input
                  className={styles.checkbox}
                  type="checkbox"
                  checked={saveForFutureOrders}
                  onChange={(event) => setSaveForFutureOrders(event.target.checked)}
                  disabled={isSaving}
                />
                <span>Save this address for future orders</span>
              </label>

              <div className={styles.footer}>
                <button type="button" className={styles.secondaryButton} onClick={onClose} disabled={isSaving}>
                  Cancel
                </button>
                <button type="submit" className={styles.primaryButton} disabled={isSaving || !isFormValid}>
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={18} />}
                  {isSaving ? 'Saving Address...' : 'Save & Continue'}
                </button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
