import { Fragment } from 'react'

export function InlineBold({ text, strongClassName = 'font-semibold text-foreground' }: { text: string; strongClassName?: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className={strongClassName}>
            {part.slice(2, -2)}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}

export function SimpleMarkdown({ source }: { source: string }) {
  const blocks = source.trim().split(/\n\s*\n/)
  return (
    <div className="flex flex-col gap-5">
      {blocks.map((block, i) => {
        const lines = block.split('\n').filter(Boolean)
        const nodes: React.ReactNode[] = []
        let list: string[] = []
        const flushList = (key: string) => {
          if (list.length) {
            nodes.push(
              <ul key={key} className="flex list-disc flex-col gap-2 pl-5 leading-relaxed text-muted-foreground">
                {list.map((item, j) => (
                  <li key={j}>
                    <InlineBold text={item} />
                  </li>
                ))}
              </ul>,
            )
            list = []
          }
        }
        lines.forEach((line, j) => {
          if (line.startsWith('## ')) {
            flushList(`l${j}`)
            nodes.push(
              <h2 key={j} className="mt-4 text-2xl text-foreground">
                {line.slice(3)}
              </h2>,
            )
          } else if (line.startsWith('- ')) {
            list.push(line.slice(2))
          } else {
            flushList(`l${j}`)
            nodes.push(
              <p key={j} className="leading-relaxed text-muted-foreground">
                <InlineBold text={line} />
              </p>,
            )
          }
        })
        flushList('end')
        return <Fragment key={i}>{nodes}</Fragment>
      })}
    </div>
  )
}
