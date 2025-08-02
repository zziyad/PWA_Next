import { MessageData } from '@/types'

interface MessageLogProps {
  messages: MessageData[]
  onClear: () => void
}

export function MessageLog({ messages, onClear }: MessageLogProps) {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const formatClientId = (clientId: string) => {
    return clientId.substring(0, 8)
  }

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Activity Log
        </h3>
        <button
          onClick={onClear}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg
                   transition-colors duration-200 text-sm"
        >
          Clear Log
        </button>
      </div>
      
      <div className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 
                    rounded-lg p-4 overflow-y-auto max-h-96 min-h-[200px]">
        {messages.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 text-center py-8">
            No messages yet. Send a message to get started!
          </div>
        ) : (
          <div className="space-y-2 font-mono text-sm">
            {messages.map((message, index) => (
              <div
                key={`${message.clientId}-${message.timestamp}-${index}`}
                className="flex flex-wrap gap-2 text-gray-700 dark:text-gray-300 
                         hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded"
              >
                <span className="text-gray-500 dark:text-gray-400 text-xs">
                  [{formatTimestamp(message.timestamp)}]
                </span>
                <span className="text-primary-600 dark:text-primary-400 text-xs font-medium">
                  {formatClientId(message.clientId)}:
                </span>
                <span className="flex-1 break-words">
                  {message.content}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 