const { WebSocketServer } = require('ws')
const { randomUUID } = require('crypto')

const PORT = 8080

const connections = new Map()
const messages = []
const MAX_MESSAGES = 100

const broadcast = (data, excludeClientId = '') => {
  const message = JSON.stringify(data)
  for (const [clientId, connection] of connections) {
    if (clientId !== excludeClientId && connection.ws.readyState === 1) {
      try {
        connection.ws.send(message)
      } catch (error) {
        console.error('Error broadcasting to client:', error)
        connections.delete(clientId)
      }
    }
  }
}

const wss = new WebSocketServer({ 
  port: PORT,
  host: '0.0.0.0' // Listen on all network interfaces
})

wss.on('connection', (ws, req) => {
  const clientId = randomUUID()
  console.log(`WebSocket connection from ${req.socket.remoteAddress}`)

  const connectedAt = new Date()
  const userAgent = req.headers['user-agent']
  connections.set(clientId, { ws, connectedAt, userAgent })

  const userCount = connections.size
  const recentMessages = messages.slice(-10)
  const data = { type: 'connected', clientId, userCount, recentMessages }
  ws.send(JSON.stringify(data))

  broadcast({ type: 'userCount', count: userCount }, clientId)
  console.log(`Client connected: ${clientId} (Total: ${connections.size})`)

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString())
      console.log(`Received from ${clientId}:`, message)
      
      const { type, content } = message
      if (type === 'message' && content) {
        const timestamp = new Date().toISOString()
        const messageData = { type, content, clientId, timestamp }
        messages.push(messageData)
        if (messages.length > MAX_MESSAGES) messages.shift()
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

process.on('SIGINT', () => {
  console.log('\nShutting down WebSocket server...')
  for (const connection of connections.values()) {
    connection.ws.close()
  }
  connections.clear()
  wss.close(() => {
    console.log('WebSocket server closed')
    process.exit(0)
  })
})

console.log(`WebSocket server running on port ${PORT}`)
console.log('Waiting for connections...') 