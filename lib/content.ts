import { cache } from 'react'
import { defaultContent } from './default-content'
import { readJSON, writeJSON } from './storage'
import type { SiteContent } from './types'

const KEY = 'content.json'

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export function mergeContent(stored: Partial<SiteContent> | null): SiteContent {
  if (!stored) return structuredClone(defaultContent)
  const merged = structuredClone(defaultContent) as unknown as Record<string, unknown>
  for (const [key, value] of Object.entries(stored)) {
    const base = merged[key]
    merged[key] = isPlainObject(base) && isPlainObject(value) ? { ...base, ...value } : value
  }
  return merged as unknown as SiteContent
}

export const getContent = cache(async (): Promise<SiteContent> => {
  const stored = await readJSON<Partial<SiteContent>>(KEY)
  return mergeContent(stored)
})

export async function saveContent(content: SiteContent) {
  await writeJSON(KEY, content)
}

export function whatsappLink(content: SiteContent, message?: string) {
  const text = encodeURIComponent(message ?? content.contact.whatsappMessage)
  return `https://wa.me/${content.contact.whatsapp}?text=${text}`
}

export function mapsLink(content: SiteContent) {
  return `https://maps.google.com/?q=${encodeURIComponent(content.contact.mapQuery)}`
}

export function mapsEmbed(content: SiteContent) {
  return (
    content.contact.mapEmbedUrl ||
    `https://www.google.com/maps?q=${encodeURIComponent(content.contact.mapQuery)}&output=embed`
  )
}
