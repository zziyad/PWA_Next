interface StatusIndicatorProps {
  connected: boolean
  userCount: number
}

export function StatusIndicator({ connected, userCount }: StatusIndicatorProps) {
  return (
    <div className="flex gap-3 items-center">
      <div
        className={`px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide ${
          connected
            ? 'bg-success text-white'
            : 'bg-error text-white'
        }`}
      >
        {connected ? 'Online' : 'Offline'}
      </div>
      {connected && (
        <div className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
          {userCount} {userCount === 1 ? 'User' : 'Users'}
        </div>
      )}
    </div>
  )
} 