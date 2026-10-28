import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

export const ADMIN_COOKIE = 'dnm_admin'
const SESSION_HOURS = 12

const password = () => process.env.ADMIN_PASSWORD || 'Nallely08'
const secret = () => process.env.ADMIN_SECRET || `dnm-cms::${password()}`

function sign(payload: string) {
  return createHmac('sha256', secret()).update(payload).digest('base64url')
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  return ba.length === bb.length && timingSafeEqual(ba, bb)
}

export function checkPassword(input: string) {
  return typeof input === 'string' && safeEqual(input, password())
}

export function createSessionToken() {
  const expires = Date.now() + SESSION_HOURS * 3600 * 1000
  const payload = `admin.${expires}`
  return { token: `${payload}.${sign(payload)}`, maxAge: SESSION_HOURS * 3600 }
}

export function verifySessionToken(token: string | undefined) {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [role, expires, signature] = parts
  const payload = `${role}.${expires}`
  if (!safeEqual(signature, sign(payload))) return false
  return Number(expires) > Date.now()
}

export async function isAdmin() {
  const store = await cookies()
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value)
}
