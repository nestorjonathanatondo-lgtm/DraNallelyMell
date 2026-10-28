import { NextResponse } from 'next/server'
import { deleteAppointment, listAppointments, updateAppointment } from '@/lib/appointments'
import { isAdmin } from '@/lib/auth'
import type { AppointmentStatus } from '@/lib/types'

const STATUSES: AppointmentStatus[] = ['pendiente', 'confirmada', 'cancelada', 'completada']
const unauthorized = () => NextResponse.json({ error: 'No autorizado' }, { status: 401 })

export async function GET() {
  if (!(await isAdmin())) return unauthorized()
  return NextResponse.json(await listAppointments(), { headers: { 'Cache-Control': 'no-store' } })
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return unauthorized()
  const body = await request.json().catch(() => ({}))
  if (typeof body.folio !== 'string') return NextResponse.json({ error: 'Folio requerido' }, { status: 400 })
  const patch: Parameters<typeof updateAppointment>[1] = {}
  if (STATUSES.includes(body.status)) patch.status = body.status
  if (typeof body.notes === 'string') patch.notes = body.notes.slice(0, 2000)
  const updated = await updateAppointment(body.folio, patch)
  if (!updated) return NextResponse.json({ error: 'No encontrada' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return unauthorized()
  const folio = new URL(request.url).searchParams.get('folio')
  if (!folio) return NextResponse.json({ error: 'Folio requerido' }, { status: 400 })
  await deleteAppointment(folio)
  return NextResponse.json({ ok: true })
}
