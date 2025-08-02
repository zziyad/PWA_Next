import { openDB, DBSchema, IDBPDatabase } from 'idb'
import { MessageData } from '@/types'

interface PWADatabase extends DBSchema {
  messages: {
    key: string
    value: MessageData & { id: string }
    indexes: {
      'timestamp': string
      'clientId': string
    }
  }
  settings: {
    key: string
    value: {
      key: string
      value: any
      timestamp: string
    }
  }
}

class Database {
  private db: IDBPDatabase<PWADatabase> | null = null
  private readonly DB_NAME = 'PWADatabase'
  private readonly DB_VERSION = 1

  async init(): Promise<void> {
    if (this.db) return

    try {
      this.db = await openDB<PWADatabase>(this.DB_NAME, this.DB_VERSION, {
        upgrade(db) {
          // Messages store
          if (!db.objectStoreNames.contains('messages')) {
            const messageStore = db.createObjectStore('messages', { keyPath: 'id' })
            messageStore.createIndex('timestamp', 'timestamp')
            messageStore.createIndex('clientId', 'clientId')
          }

          // Settings store
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'key' })
          }
        },
      })
    } catch (error) {
      console.error('Failed to initialize database:', error)
      throw error
    }
  }

  async addMessage(message: MessageData): Promise<void> {
    if (!this.db) await this.init()
    
    const messageWithId = {
      ...message,
      id: `${message.clientId}-${message.timestamp}`
    }

    try {
      await this.db!.add('messages', messageWithId)
    } catch (error) {
      // If message already exists, update it
      if (error instanceof Error && error.name === 'ConstraintError') {
        await this.db!.put('messages', messageWithId)
      } else {
        console.error('Failed to add message:', error)
        throw error
      }
    }
  }

  async getMessages(limit = 50): Promise<MessageData[]> {
    if (!this.db) await this.init()

    try {
      const messages = await this.db!
        .getAllFromIndex('messages', 'timestamp')
      
      return messages
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit)
        .map(({ id, ...message }) => message)
    } catch (error) {
      console.error('Failed to get messages:', error)
      return []
    }
  }

  async getMessagesByClient(clientId: string): Promise<MessageData[]> {
    if (!this.db) await this.init()

    try {
      const messages = await this.db!.getAllFromIndex('messages', 'clientId', clientId)
      return messages
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .map(({ id, ...message }) => message)
    } catch (error) {
      console.error('Failed to get messages by client:', error)
      return []
    }
  }

  async clearMessages(): Promise<void> {
    if (!this.db) await this.init()

    try {
      await this.db!.clear('messages')
    } catch (error) {
      console.error('Failed to clear messages:', error)
      throw error
    }
  }

  async setSetting(key: string, value: any): Promise<void> {
    if (!this.db) await this.init()

    const setting = {
      key,
      value,
      timestamp: new Date().toISOString()
    }

    try {
      await this.db!.put('settings', setting)
    } catch (error) {
      console.error('Failed to set setting:', error)
      throw error
    }
  }

  async getSetting<T>(key: string): Promise<T | null> {
    if (!this.db) await this.init()

    try {
      const setting = await this.db!.get('settings', key)
      return setting?.value ?? null
    } catch (error) {
      console.error('Failed to get setting:', error)
      return null
    }
  }

  async deleteSetting(key: string): Promise<void> {
    if (!this.db) await this.init()

    try {
      await this.db!.delete('settings', key)
    } catch (error) {
      console.error('Failed to delete setting:', error)
      throw error
    }
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }
}

export const database = new Database() 