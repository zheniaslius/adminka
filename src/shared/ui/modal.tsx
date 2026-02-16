import { useEffect } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/shared/lib/utils'

export function Modal(props: {
  open: boolean
  title?: string
  description?: string
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}) {
  useEffect(() => {
    if (!props.open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') props.onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [props])

  if (!props.open) return null

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) props.onClose()
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={cn(
            'w-full max-w-lg rounded-xl border bg-card text-card-foreground shadow-lg',
            props.className,
          )}
          role="dialog"
          aria-modal="true"
        >
          {(props.title || props.description) ? (
            <div className="space-y-1 border-b p-6">
              {props.title ? (
                <h2 className="text-lg font-semibold leading-none tracking-tight">
                  {props.title}
                </h2>
              ) : null}
              {props.description ? (
                <p className="text-sm text-muted-foreground">{props.description}</p>
              ) : null}
            </div>
          ) : null}
          <div className="p-6">{props.children}</div>
          {props.footer ? <div className="border-t p-6">{props.footer}</div> : null}
        </div>
      </div>
    </div>,
    document.body,
  )
}

