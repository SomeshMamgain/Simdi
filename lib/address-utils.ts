import type { AddressFormData, AddressFormErrors } from '@/types/address'

export function normalizePhoneNumber(value: string) {
  return value.replace(/\D/g, '').slice(0, 10)
}

export function validatePhoneNumber(phone: string) {
  const cleaned = normalizePhoneNumber(phone)

  if (cleaned.length !== 10 || !/^[6-9]/.test(cleaned)) {
    return 'Please enter a valid 10-digit phone number'
  }

  return null
}

export function validateFullName(name: string) {
  const trimmed = name.trim()

  if (trimmed.length < 3 || /\d/.test(trimmed)) {
    return 'Please enter a valid name'
  }

  return null
}

export function validateAddressLine(address: string) {
  if (address.trim().length < 5) {
    return 'Please enter a complete address'
  }

  return null
}

export function validateCity(city: string) {
  if (city.trim().length < 2) {
    return 'Please enter a valid city'
  }

  return null
}

export function validatePostalCode(code: string) {
  if (!/^\d{6}$/.test(code.trim())) {
    return 'Postal code must be 6 digits'
  }

  return null
}

export function validateState(state: string) {
  if (!state.trim()) {
    return 'Please select a state'
  }

  return null
}

export function normalizeAddressFormData(address?: Partial<AddressFormData> | null): AddressFormData {
  return {
    fullName: address?.fullName?.trim() ?? '',
    phoneNumber: normalizePhoneNumber(address?.phoneNumber ?? ''),
    addressLine1: address?.addressLine1?.trim() ?? '',
    addressLine2: address?.addressLine2?.trim() ?? '',
    city: address?.city?.trim() ?? '',
    state: address?.state?.trim() ?? '',
    postalCode: (address?.postalCode ?? '').replace(/\D/g, '').slice(0, 6),
    country: address?.country?.trim() || 'India',
  }
}

export function validateAddressForm(data: AddressFormData): AddressFormErrors {
  const normalized = normalizeAddressFormData(data)
  const errors: AddressFormErrors = {}

  const fullNameError = validateFullName(normalized.fullName)
  if (fullNameError) {
    errors.fullName = fullNameError
  }

  const phoneError = validatePhoneNumber(normalized.phoneNumber)
  if (phoneError) {
    errors.phoneNumber = phoneError
  }

  const addressError = validateAddressLine(normalized.addressLine1)
  if (addressError) {
    errors.addressLine1 = addressError
  }

  const cityError = validateCity(normalized.city)
  if (cityError) {
    errors.city = cityError
  }

  const stateError = validateState(normalized.state)
  if (stateError) {
    errors.state = stateError
  }

  const postalCodeError = validatePostalCode(normalized.postalCode)
  if (postalCodeError) {
    errors.postalCode = postalCodeError
  }

  return errors
}

export function hasAddressErrors(errors: AddressFormErrors) {
  return Object.values(errors).some(Boolean)
}

export function formatAddressSingleLine(address: AddressFormData) {
  return [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(', ')
}
