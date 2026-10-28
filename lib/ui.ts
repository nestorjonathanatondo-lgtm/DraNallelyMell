export const btnBase =
  'inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-xs font-semibold uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50'

export const btnPrimary = `${btnBase} bg-primary text-primary-foreground hover:bg-primary/85`
export const btnOutline = `${btnBase} border border-accent-light/70 text-foreground hover:bg-card`
export const btnLight = `${btnBase} bg-background text-foreground hover:bg-background/85`
export const btnOutlineDark = `${btnBase} border border-dark-foreground/25 text-dark-foreground hover:bg-dark-foreground/10`

export const container = 'mx-auto w-full max-w-7xl px-5 md:px-10'
