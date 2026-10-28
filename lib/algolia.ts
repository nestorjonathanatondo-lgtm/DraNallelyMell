import { getContent } from '@/lib/content'

export const ALGOLIA_INDEX = process.env.ALGOLIA_INDEX_NAME || 'dnm-treatments'

function config(mode: 'search' | 'write' = 'write') {
  const appId = process.env.ALGOLIA_APP_ID
  const apiKey = mode === 'search'
    ? process.env.ALGOLIA_SEARCH_API_KEY
    : process.env.ALGOLIA_WRITE_API_KEY
  if (!appId || !apiKey) throw new Error('Algolia no está configurado.')
  return { appId, apiKey }
}

export async function treatmentRecords() {
  const content = await getContent()
  return content.treatments.map((treatment) => ({
    objectID: treatment.slug,
    type: 'treatment',
    name: treatment.name,
    slug: treatment.slug,
    category: treatment.category,
    description: treatment.description,
    benefits: treatment.benefits,
    duration: treatment.duration,
    price: treatment.price,
    image: treatment.image,
    badge: treatment.badge,
    url: `/tratamientos/${treatment.slug}`,
  }))
}

export async function reindexTreatments() {
  const { appId, apiKey } = config()
  const response = await fetch(`https://${appId}.algolia.net/1/indexes/${encodeURIComponent(ALGOLIA_INDEX)}/batch`, {
    method: 'POST',
    headers: { 'x-algolia-api-key': apiKey, 'x-algolia-application-id': appId, 'content-type': 'application/json' },
    body: JSON.stringify({ requests: (await treatmentRecords()).map((record) => ({ action: 'updateObject', body: record })) }),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Algolia respondió ${response.status}.`)
  return response.json()
}

export async function searchTreatments(query: string) {
  const { appId, apiKey } = config('search')
  const response = await fetch(`https://${appId}-dsn.algolia.net/1/indexes/${encodeURIComponent(ALGOLIA_INDEX)}/query`, {
    method: 'POST',
    headers: { 'x-algolia-api-key': apiKey, 'x-algolia-application-id': appId, 'content-type': 'application/json' },
    body: JSON.stringify({ params: new URLSearchParams({ query, hitsPerPage: '8', attributesToRetrieve: 'name,slug,category,description,image,url,badge,price,duration' }).toString() }),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Algolia respondió ${response.status}.`)
  return response.json()
}
