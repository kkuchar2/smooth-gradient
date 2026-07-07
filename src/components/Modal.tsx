import { useEffect, useSyncExternalStore, type MouseEvent, type ReactNode } from 'react'

import ReactDOM from 'react-dom'

import { cn } from '@/lib/cn'

type ModalProps = {
  onClose: () => void
  title?: string
  size?: 'default' | 'wide'
  children: ReactNode
}

const getModalRoot = () => document.getElementById('modal-root')

export function Modal({ onClose, title, size = 'default', children }: ModalProps) {
  const modalRoot = useSyncExternalStore(
    () => () => {},
    getModalRoot,
    () => null,
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleCloseClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    onClose()
  }

  if (!modalRoot) {
    return null
  }

  const modalContent = (
    <div
      className="z-modal fixed inset-0 flex items-end justify-center p-0 min-[900px]:items-center min-[900px]:p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-pointer border-none bg-[oklch(0.12_0_0/0.55)] backdrop-blur-xs"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className={cn('relative z-1 w-full', size === 'wide' ? 'max-w-[min(52rem,96vw)]' : 'max-w-full min-[900px]:max-w-88')}>
        <div
          className="w-full overflow-hidden rounded-t-md border border-border bg-surface-raised shadow-[0_24px_48px_oklch(0.1_0_0/0.35)] min-[900px]:rounded-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          <div className="flex items-center justify-between gap-3 px-3.5 pt-3.5 pb-2.5 text-text">
            {title && (
              <h2 id="modal-title" className="m-0 text-[0.9375rem] font-semibold tracking-tight">
                {title}
              </h2>
            )}
            <button
              type="button"
              className="relative grid size-8 shrink-0 place-items-center rounded-sm border-none bg-control hover:bg-control-hover"
              aria-label="Close"
              onClick={handleCloseClick}
            >
              <div className="absolute top-1/2 left-1/2 h-px w-1/2 -translate-1/2 rotate-45 bg-text-muted" />
              <div className="absolute top-1/2 left-1/2 h-px w-1/2 -translate-1/2 -rotate-45 bg-text-muted" />
            </button>
          </div>

          <div
            className={cn(
              'max-h-[min(85dvh,36rem)] overflow-auto px-3 pb-3 min-[900px]:max-h-[min(60dvh,24rem)]',
              size === 'wide' &&
                'flex max-h-[min(80dvh,36rem)] min-h-[min(70dvh,28rem)] overflow-hidden p-0 min-[900px]:min-h-[min(70dvh,28rem)]',
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )

  return ReactDOM.createPortal(modalContent, modalRoot)
}
