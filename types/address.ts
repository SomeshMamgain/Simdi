export interface AddressFormData {
  fullName: string
  phoneNumber: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface AddressFormErrors {
  fullName?: string
  phoneNumber?: string
  addressLine1?: string
  city?: string
  state?: string
  postalCode?: string
}
