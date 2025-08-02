import { NextApiRequest, NextApiResponse } from 'next'
import { WebSocketServer } from 'ws'
import { v4 as uuidv4 } from 'uuid'
import { WebSocketMessage, MessageData } from '@/types'

interface ExtendedWebSocket extends WebSocket {
  clientId?: string
  connectedAt?: Date
  userAgent?: string
}

const connections = new Map<string, ExtendedWebSocket>()
const messages: MessageData[] = []
const MAX_MESSAGES = 100

let wss: WebSocketServer | null = null

const broadcast = (data: WebSocketMessage, excludeClientId = '') => {
  const message = JSON.stringify(data)
  for (const [clientId, ws] of connections) {
    if (clientId !== excludeClientId && ws.readyState === 1) {
      try {
        ws.send(message)
      } catch (error) {
        console.error('Error broadcasting to client:', error)
        connections.delete(clientId)
      }
    }
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' })
    return
  }

  // Initialize WebSocket server if not already done
  if (!wss) {
    wss = new WebSocketServer({ 
      port: 8080,
      perMessageDeflate: false 
    })

    wss.on('connection', (ws: ExtendedWebSocket, req) => {
      const clientId = uuidv4()
      const connectedAt = new Date()
      const userAgent = req.headers['user-agent'] || 'Unknown'

      ws.clientId = clientId
      ws.connectedAt = connectedAt
      ws.userAgent = userAgent

      connections.set(clientId, ws)

      console.log(`WebSocket connection ${req.socket.remoteAddress}`)
      console.log(`Client connected: ${clientId} (Total: ${connections.size})`)

      // Send initial data
      const userCount = connections.size
      const recentMessages = messages.slice(-10)
      const welcomeData: WebSocketMessage = {
        type: 'connected',
        clientId,
        userCount,
        recentMessages
      }
      ws.send(JSON.stringify(welcomeData))

      // Broadcast user count update
      broadcast({ type: 'userCount', count: userCount }, clientId)

      ws.on('message', (data) => {
        try {
          const message: WebSocketMessage = JSON.parse(data.toString())
          console.log(`Received from ${clientId}:`, message)

          if (message.type === 'message' && message.content) {
            const messageData: MessageData = {
              type: 'message',
              content: message.content,
              clientId,
              timestamp: new Date().toISOString()
            }

            messages.push(messageData)
            if (messages.length > MAX_MESSAGES) {
              messages.shift()
            }

            broadcast(messageData, clientId)
          } else if (message.type === 'ping') {
            ws.send(JSON.stringify({ type: 'pong' }))
          }
        } catch (error) {
          console.error('Error parsing message:', error)
        }
      })

      ws.on('close', () => {
        console.log(`WebSocket connection closed: ${clientId}`)
        connections.delete(clientId)
        const count = connections.size
        broadcast({ type: 'userCount', count }, clientId)
        console.log(`Client disconnected: ${clientId} (Total: ${count})`)
      })

      ws.on('error', (error) => {
        console.error(`WebSocket error for ${clientId}:`, error)
        connections.delete(clientId)
        const count = connections.size
        broadcast({ type: 'userCount', count }, clientId)
      })
    })

    console.log('WebSocket server started on port 8080')
  }

  res.status(200).json({ 
    message: 'WebSocket server is running',
    port: 8080,
    connections: connections.size
  })
} 