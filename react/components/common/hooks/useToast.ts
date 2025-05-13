import type { ReactNode } from 'react'
import { useContext } from 'react'
import { ToastContext } from 'vtex.styleguide'

type ShowToastArgs = {
  message: ReactNode
  duration?: number
  horizontalPosition?: 'left' | 'right'
  keepAfterUpdate?: boolean
  action?: {
    label: string
  } & (
    | { onClick: () => void; href?: never; target?: never }
    | { href: string; onClick?: never; target?: string }
  )
}

type ToastContextValue = {
  showToast: (content: ReactNode | ShowToastArgs) => void
  hideToast: () => void
}

export function useToast() {
  return useContext(ToastContext) as ToastContextValue
}
