import { useEffect, useState } from 'react'

interface NotificationProps {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  visible: boolean
  onHide: () => void
}

export function Notification({ message, type, visible, onHide }: NotificationProps) {
  const [shouldRender, setShouldRender] = useState(visible)

  useEffect(() => {
    if (visible) {
      setShouldRender(true)
      const timer = setTimeout(() => {
        onHide()
      }, 3000)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 300) // Wait for animation to complete
      return () => clearTimeout(timer)
    }
  }, [visible, onHide])

  if (!shouldRender) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-success text-white'
      case 'error':
        return 'bg-error text-white'
      case 'warning':
        return 'bg-warning text-white'
      case 'info':
      default:
        return 'bg-primary-500 text-white'
    }
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg font-semibold
                 transition-all duration-300 transform ${
                   visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                 } ${getTypeStyles()}`}
    >
      <div className="flex items-center justify-between">
        <span className="flex-1 pr-2">{message}</span>
        <button
          onClick={onHide}
          className="text-white/80 hover:text-white text-lg leading-none"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  )
} 