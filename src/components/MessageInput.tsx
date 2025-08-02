import { useState, KeyboardEvent } from 'react'

interface MessageInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export function MessageInput({ onSendMessage, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    const trimmedMessage = message.trim()
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage)
      setMessage('')
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex gap-3 items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your message..."
          disabled={disabled}
          className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                   focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-200"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          className="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 
                   disabled:cursor-not-allowed text-white font-semibold rounded-lg
                   transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-primary-500/50"
        >
          Send
        </button>
      </div>
    </div>
  )
} 