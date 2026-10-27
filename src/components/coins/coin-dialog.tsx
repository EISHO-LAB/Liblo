import { useEffect, useRef, type ReactNode } from 'react'
import { Icon } from '@/components/icons/icon'
import { coinIcons } from '@/data/coin-icons'

export function CoinDialog({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    const previousOverflow = document.body.style.overflow
    dialog?.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
    }
  }, [])

  return (
    <dialog
      ref={ref}
      className="coin-dialog"
      aria-labelledby="coin-dialog-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="coin-dialog-content">
        <div className="coin-dialog-heading">
          <h2 id="coin-dialog-title">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="coin-icon-button"
            aria-label="Close dialog"
            autoFocus
          >
            <Icon icon={coinIcons.close} width={20} height={20} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  )
}
