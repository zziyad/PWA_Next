import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { AppState, MessageData, NotificationState, BeforeInstallPromptEvent } from '@/types'
import { database } from './database'

interface AppStore extends AppState {
  // Actions
  setConnected: (connected: boolean) => void
  setConnecting: (connecting: boolean) => void
  setUserCount: (count: number) => void
  setClientId: (clientId: string) => void
  addMessage: (message: MessageData) => void
  clearMessages: () => void
  showNotification: (message: string, type: NotificationState['type']) => void
  hideNotification: () => void
  setInstallPrompt: (prompt: BeforeInstallPromptEvent | null) => void
  setCanInstall: (canInstall: boolean) => void
  loadMessagesFromDB: () => Promise<void>
}

export const useAppStore = create<AppStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    connection: {
      connected: false,
      connecting: false,
      userCount: 0,
      clientId: null,
    },
    messages: [],
    notification: {
      message: '',
      type: 'info',
      visible: false,
    },
    installPrompt: null,
    canInstall: false,

    // Actions
    setConnected: (connected) =>
      set((state) => ({
        connection: { ...state.connection, connected, connecting: false },
      })),

    setConnecting: (connecting) =>
      set((state) => ({
        connection: { ...state.connection, connecting },
      })),

    setUserCount: (userCount) =>
      set((state) => ({
        connection: { ...state.connection, userCount },
      })),

    setClientId: (clientId) =>
      set((state) => ({
        connection: { ...state.connection, clientId },
      })),

    addMessage: (message) =>
      set((state) => {
        // Add to database asynchronously
        database.addMessage(message).catch(console.error)
        
        // Add to state (keep only last 100 messages in memory)
        const newMessages = [message, ...state.messages].slice(0, 100)
        return { messages: newMessages }
      }),

    clearMessages: () =>
      set(() => {
        // Clear database asynchronously
        database.clearMessages().catch(console.error)
        return { messages: [] }
      }),

    showNotification: (message, type) =>
      set(() => ({
        notification: { message, type, visible: true },
      })),

    hideNotification: () =>
      set((state) => ({
        notification: { ...state.notification, visible: false },
      })),

    setInstallPrompt: (installPrompt) =>
      set(() => ({ installPrompt })),

    setCanInstall: (canInstall) =>
      set(() => ({ canInstall })),

    loadMessagesFromDB: async () => {
      try {
        const messages = await database.getMessages(50)
        set(() => ({ messages }))
      } catch (error) {
        console.error('Failed to load messages from database:', error)
      }
    },
  }))
)

// Auto-hide notifications after 3 seconds
useAppStore.subscribe(
  (state) => state.notification.visible,
  (visible) => {
    if (visible) {
      setTimeout(() => {
        useAppStore.getState().hideNotification()
      }, 3000)
    }
  }
) 