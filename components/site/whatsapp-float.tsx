import { MessageCircle } from 'lucide-react'

export function WhatsappFloat({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-30 flex items-center gap-3 rounded-full border border-border bg-card/95 p-2 pr-2 shadow-xl backdrop-blur sm:pr-5"
    >
      <span className="relative flex size-10 items-center justify-center rounded-full bg-[#25D366] text-card">
        <MessageCircle className="size-5" aria-hidden="true" />
        <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-card bg-accent-light" />
      </span>
      <span className="hidden flex-col leading-tight sm:flex">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">Atención exclusiva</span>
        <span className="text-sm">¿Dudas? Escríbenos</span>
      </span>
      <span className="sr-only sm:hidden">Escríbenos por WhatsApp</span>
    </a>
  )
}
