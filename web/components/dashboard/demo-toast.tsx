'use client'

import { useEffect } from 'react'
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { DemoToast } from '@/types'

interface DemoToastStackProps {
  toasts: DemoToast[]
  onDismiss: (toastId: string) => void
}

export function DemoToastStack({ toasts, onDismiss }: DemoToastStackProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed right-6 top-6 z-[80] flex w-[min(92vw,24rem)] flex-col gap-3">
      {toasts.map((toast) => (
        <DemoToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function DemoToastItem({
  toast,
  onDismiss,
}: {
  toast: DemoToast
  onDismiss: (toastId: string) => void
}) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => onDismiss(toast.id), 3200)
    return () => window.clearTimeout(timeoutId)
  }, [onDismiss, toast.id])

  const config =
    toast.tone === 'success'
      ? {
          border: 'border-emerald-500/30',
          glow: 'shadow-emerald-500/10',
          icon: CheckCircle2,
          accent: 'text-emerald-300',
        }
      : toast.tone === 'error'
        ? {
            border: 'border-rose-500/30',
            glow: 'shadow-rose-500/10',
            icon: AlertTriangle,
            accent: 'text-rose-300',
          }
        : {
            border: 'border-sky-500/30',
            glow: 'shadow-sky-500/10',
            icon: Info,
            accent: 'text-sky-300',
          }

  const Icon = config.icon

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border bg-slate-950/90 p-4 backdrop-blur-xl shadow-2xl',
        config.border,
        config.glow,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.16),_transparent_50%)]" />
      <div className="relative flex items-start gap-3">
        <div className={cn('mt-0.5 rounded-full bg-white/5 p-2', config.accent)}>
          <Icon className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">{toast.title}</p>
          <p className="mt-1 text-sm leading-5 text-slate-400">{toast.message}</p>
        </div>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          aria-label="Dismiss toast"
          data-demo-label="Dismiss toast"
          className="rounded-md p-1 text-slate-500 transition-colors hover:bg-white/5 hover:text-white"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}

