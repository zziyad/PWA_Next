interface ControlPanelProps {
  onInstall?: () => void
  onUpdateCache?: () => void
  canInstall: boolean
  connected: boolean
}

export function ControlPanel({ 
  onInstall, 
  onUpdateCache, 
  canInstall, 
  connected 
}: ControlPanelProps) {
  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex flex-wrap gap-3 items-center">
        {canInstall && onInstall && (
          <button
            onClick={onInstall}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg
                     transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-primary-500/50"
          >
            Install App
          </button>
        )}
        
        {onUpdateCache && (
          <button
            onClick={onUpdateCache}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg
                     transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-gray-500/50"
          >
            Update Cache
          </button>
        )}
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-success' : 'bg-error'}`} />
          <span>{connected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>
    </div>
  )
} 