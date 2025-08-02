import { useState, useEffect, useCallback, useRef } from 'react'
import { WebSocketMessage, MessageData } from '@/types'

interface UseWebSocketReturn {
  connected: boolean
  connecting: boolean
  userCount: number
  messages: MessageData[]
  sendMessage: (content: string) => void
  clearMessages: () => void
}

export function useWebSocket(url: string): UseWebSocketReturn {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [userCount, setUserCount] = useState(0)
  const [messages, setMessages] = useState<MessageData[]>([])
  
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 5
  const reconnectInterval = 3000

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return
    if (connecting) return

    setConnecting(true)
    reconnectAttemptsRef.current++

    try {
      wsRef.current = new WebSocket(url)

      wsRef.current.onopen = () => {
        setConnected(true)
        setConnecting(false)
        reconnectAttemptsRef.current = 0
        console.log('WebSocket connected')
      }

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          
          switch (message.type) {
            case 'connected':
              if (message.userCount !== undefined) {
                setUserCount(message.userCount)
              }
              if (message.recentMessages) {
                setMessages(message.recentMessages)
              }
              break
            case 'userCount':
              if (message.count !== undefined) {
                setUserCount(message.count)
              }
              break
            case 'message':
              if (message.content && message.clientId && message.timestamp) {
                const newMessage: MessageData = {
                  type: 'message',
                  content: message.content,
                  clientId: message.clientId,
                  timestamp: message.timestamp
                }
                setMessages(prev => [newMessage, ...prev].slice(0, 100))
              }
              break
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      wsRef.current.onclose = () => {
        setConnected(false)
        setConnecting(false)
        console.log('WebSocket disconnected')
        scheduleReconnect()
      }

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error)
        setConnected(false)
        setConnecting(false)
      }
    } catch (error) {
      console.error('WebSocket connection failed:', error)
      setConnecting(false)
      scheduleReconnect()
    }
  }, [url, connecting])

  const scheduleReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }

    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current)
    }

    const delay = reconnectInterval * Math.pow(2, reconnectAttemptsRef.current - 1)
    reconnectTimerRef.current = setTimeout(() => {
      connect()
    }, delay)
  }, [connect])

  const sendMessage = useCallback((content: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected')
      return
    }

    const message: WebSocketMessage = {
      type: 'message',
      content,
      timestamp: new Date().toISOString()
    }

    try {
      wsRef.current.send(JSON.stringify(message))
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  useEffect(() => {
    connect()

    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [connect])

  return {
    connected,
    connecting,
    userCount,
    messages,
    sendMessage,
    clearMessages
  }
} 