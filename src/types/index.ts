export interface WebSocketMessage {
  type: 'message' | 'connected' | 'userCount' | 'ping' | 'pong' | 'status' | 'error'
  clientId?: string
  content?: string
  count?: number
  userCount?: number
  recentMessages?: MessageData[]
  connected?: boolean
  error?: string
  timestamp?: string
}

export interface MessageData {
  type: 'message'
  content: string
  clientId: string
  timestamp: string
}

export interface ConnectionState {
  connected: boolean
  connecting: boolean
  userCount: number
  clientId: string | null
}

export interface NotificationState {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  visible: boolean
}

export interface AppState {
  connection: ConnectionState
  messages: MessageData[]
  notification: NotificationState
  installPrompt: BeforeInstallPromptEvent | null
  canInstall: boolean
}

export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
} 