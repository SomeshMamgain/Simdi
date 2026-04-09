import type { Models } from 'appwrite'

export type ProductNumericValue = number | string

export interface ProductDocument extends Models.Document {
  id?: string
  name?: string
  price?: ProductNumericValue
  stock?: ProductNumericValue
  image?: string
  alias_name?: string
  description?: string
  history?: string
  calories?: ProductNumericValue
  fat?: ProductNumericValue
  carbs?: ProductNumericValue
  protein?: ProductNumericValue
  storage?: string
  preparation?: string
  review?: string
  unit?: string
  nutrition_fact?: string
  seasonal?: boolean
  type?: string
  in_stock?: boolean
  rating?: ProductNumericValue
  image_list_comma_separated_link?: string
  key_higlights_comma_separated?: string
  key_highlights_comma_separated?: string
  ingredients?: string
  shelf_life?: string
  texture?: string
  taste_note?: string
  method?: string
  village?: string
  keywords?: string
  video?: string
}
