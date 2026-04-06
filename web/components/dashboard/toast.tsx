import { CheckCircle, AlertCircle, Info } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
}

export function Toast({ message, type }: ToastProps) {
  const getStyles = () => {
    switch (type) {
      case 'success':
        return { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400', icon: CheckCircle }
      case 'error':
        return { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400', icon: AlertCircle }
      case 'info':
        return { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400', icon: Info }
    }
  }

  const styles = getStyles()
  const Icon = styles.icon

  return (
    <div className={`fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg border ${styles.bg} ${styles.border} ${styles.text} animate-in fade-in slide-in-from-bottom-4 duration-300 z-50`}>
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}
