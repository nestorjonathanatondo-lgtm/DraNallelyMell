'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { Loader2, Lock } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { btnPrimary } from '@/lib/ui'

const TAP_MAX_MS = 350
const TAP_WINDOW_MS = 1000
const HOLD_MS = 1500
const ARM_TIMEOUT_MS = 1500

/**
 * Hidden admin entry: 3 quick taps on the logo (all within 1s) followed by a 1.5s press.
 */
export function AdminGesture({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const taps = useRef<number[]>([])
  const armedAt = useRef(0)
  const pressStart = useRef(0)
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const suppressClick = useRef(false)

  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const clearHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current)
    holdTimer.current = null
  }

  const onPointerDown = () => {
    const now = performance.now()
    pressStart.current = now
    if (armedAt.current && now - armedAt.current < ARM_TIMEOUT_MS) {
      clearHold()
      holdTimer.current = setTimeout(() => {
        armedAt.current = 0
        taps.current = []
        suppressClick.current = true
        navigator.vibrate?.(40)
        setPassword('')
        setError('')
        setOpen(true)
      }, HOLD_MS)
    }
  }

  const onPointerUp = () => {
    const now = performance.now()
    const duration = now - pressStart.current
    const wasHoldAttempt = Boolean(holdTimer.current)
    clearHold()

    if (wasHoldAttempt) {
      armedAt.current = 0
      taps.current = []
      return
    }
    if (duration > TAP_MAX_MS) {
      taps.current = []
      return
    }
    taps.current = [...taps.current, now].filter((t) => now - t <= TAP_WINDOW_MS)
    if (taps.current.length >= 3) {
      armedAt.current = now
      taps.current = []
    }
  }

  const onPointerCancel = () => {
    clearHold()
  }

  const onClickCapture = (event: React.MouseEvent) => {
    if (suppressClick.current) {
      event.preventDefault()
      event.stopPropagation()
      suppressClick.current = false
    }
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        setError('Contraseña incorrecta')
        return
      }
      setOpen(false)
      router.push('/admin')
    } catch {
      setError('No se pudo conectar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <span
        className="no-callout inline-flex touch-manipulation"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={onPointerCancel}
        onClickCapture={onClickCapture}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      >
        {children}
      </span>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl border border-border bg-card p-6 sm:max-w-sm">
          <DialogHeader>
            <span className="mb-2 flex size-10 items-center justify-center rounded-full bg-muted text-accent">
              <Lock className="size-4" aria-hidden="true" />
            </span>
            <DialogTitle className="font-serif text-2xl font-normal">Acceso privado</DialogTitle>
            <DialogDescription>Ingresa la contraseña de administración.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="admin-password">Contraseña</Label>
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-xl bg-background"
                aria-invalid={Boolean(error)}
              />
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
            </div>
            <button type="submit" className={btnPrimary} disabled={loading || !password}>
              {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              Entrar
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
