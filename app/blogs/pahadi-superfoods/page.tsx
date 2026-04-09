import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo'

import { CowGheeBlogClient } from './CowGheeBlogClient'

export const metadata: Metadata = buildMetadata({
  title: 'The Golden Elixir: Why A2 Badri Cow Ghee is the Ultimate Superfood | Simdi',
  description:
    'Learn why A2 Badri Cow Ghee from Pauri Garhwal stands out as a Himalayan superfood, from the Bilona process to traditional wellness benefits.',
  path: '/blogs/pahadi-superfoods',
  type: 'article',
  keywords: [
    'A2 Badri Cow Ghee',
    'Bilona ghee benefits',
    'Himalayan superfood',
    'Pauri Garhwal ghee',
    'Badri cow ghee',
    'traditional ghee blog',
  ],
  images: ['/badricow.png'],
  imageAlt: 'A2 Badri Cow Ghee blog by SIMDI',
  publishedTime: '2026-04-03T00:00:00.000Z',
  modifiedTime: '2026-04-03T00:00:00.000Z',
})

export default function CowGheeBlog() {
  return <CowGheeBlogClient />
}
