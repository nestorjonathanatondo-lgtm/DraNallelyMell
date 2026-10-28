import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const BUCKET = 'site-media'
const SAFE_NAME = /^[\w.-]+$/

let client: SupabaseClient | null = null

function getSupabaseAdmin() {
  if (client) return client
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY
  const publicKey = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const key = serviceKey ?? publicKey
  if (!url || !key) {
    throw new Error('Supabase server credentials are not configured')
  }
  client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  return client
}

export const usingSupabase = () => Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY))
export const usingBlob = usingSupabase

export async function readJSON<T>(key: string): Promise<T | null> {
  if (!usingSupabase()) return null
  const { data, error } = await getSupabaseAdmin()
    .from('site_content')
    .select('data')
    .eq('key', key)
    .maybeSingle()

  if (error) {
    console.error('[storage] readJSON failed', key, error)
    return null
  }
  return (data?.data as T | undefined) ?? null
}

export async function writeJSON(key: string, data: unknown) {
  const { error } = await getSupabaseAdmin().from('site_content').upsert(
    { key, data, updated_at: new Date().toISOString() },
    { onConflict: 'key' },
  )
  if (error) throw new Error(`Could not save ${key}: ${error.message}`)
}

function sanitizeName(original: string) {
  const ext = (original.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '')
  const base = original
    .replace(/\.[^.]+$/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
  return `${Date.now()}-${base || 'archivo'}.${ext}`
}

export async function saveUpload(file: File) {
  const name = sanitizeName(file.name)
  const { error } = await getSupabaseAdmin().storage.from(BUCKET).upload(`uploads/${name}`, file, {
    contentType: file.type || 'application/octet-stream',
    upsert: false,
  })
  if (error) throw new Error(`Could not upload ${file.name}: ${error.message}`)
  return `/api/media/${name}`
}

const MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  avif: 'image/avif',
  mp4: 'video/mp4',
  webm: 'video/webm',
  ico: 'image/x-icon',
}

export async function readUpload(name: string) {
  if (!SAFE_NAME.test(name) || !usingSupabase()) return null
  const { data, error } = await getSupabaseAdmin().storage.from(BUCKET).download(`uploads/${name}`)
  if (error || !data) return null
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  return { body: new Uint8Array(await data.arrayBuffer()), contentType: data.type || MIME[ext] || 'application/octet-stream' }
}

export async function deleteUpload(name: string) {
  if (!SAFE_NAME.test(name)) return
  await getSupabaseAdmin().storage.from(BUCKET).remove([`uploads/${name}`])
}
