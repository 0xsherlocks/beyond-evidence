import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'zm4dl3vf'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2024-01-01'

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  // Disable CDN so we always get fresh data when content changes in Studio
  useCdn: false,
  // Disable Next.js fetch caching — ensures Sanity changes appear immediately
  stega: { enabled: false },
})

const builder = imageUrlBuilder({ projectId, dataset })

export function urlFor(source: any) {
  return builder.image(source)
}

/**
 * Helper to get image URL - prefers Sanity image, falls back to external URL
 */
export function getImageUrl(item: any, fallback?: string): string {
  if (item?.image?.asset) {
    return urlFor(item.image).url()
  }
  if (item?.imageUrl) {
    return item.imageUrl
  }
  return fallback || ''
}
