import { randomBytes } from 'node:crypto'
import { readJSON, writeJSON } from './storage'
import type { Appointment } from './types'

const KEY = 'appointments.json'

export async function listAppointments(): Promise<Appointment[]> {
  return (await readJSON<Appointment[]>(KEY)) ?? []
}

async function saveAll(items: Appointment[]) {
  await writeJSON(KEY, items)
}

function generateFolio() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = randomBytes(6)
  let out = ''
  for (const b of bytes) out += alphabet[b % alphabet.length]
  return `NM-${out}`
}

export async function createAppointment(input: Omit<Appointment, 'folio' | 'createdAt' | 'status' | 'notes'>) {
  const items = await listAppointments()
  let folio = generateFolio()
  while (items.some((a) => a.folio === folio)) folio = generateFolio()
  const appointment: Appointment = {
    ...input,
    folio,
    createdAt: new Date().toISOString(),
    status: 'pendiente',
    notes: '',
  }
  items.unshift(appointment)
  await saveAll(items)
  return appointment
}

export async function updateAppointment(folio: string, patch: Partial<Pick<Appointment, 'status' | 'notes' | 'date' | 'time'>>) {
  const items = await listAppointments()
  const index = items.findIndex((a) => a.folio === folio)
  if (index === -1) return null
  items[index] = { ...items[index], ...patch }
  await saveAll(items)
  return items[index]
}

export async function deleteAppointment(folio: string) {
  const items = await listAppointments()
  await saveAll(items.filter((a) => a.folio !== folio))
}

export const digitsOnly = (value: string) => value.replace(/\D/g, '')
