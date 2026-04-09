import { permanentRedirect } from 'next/navigation'

export default function LegacyProductsRedirect() {
  permanentRedirect('/products')
}
