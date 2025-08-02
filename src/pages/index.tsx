import { useState, useEffect } from 'react'
import Head from 'next/head'
import { StatusIndicator } from '@/components/StatusIndicator'
import { MessageInput } from '@/components/MessageInput'
import { MessageLog } from '@/components/MessageLog'
import { ControlPanel } from '@/components/ControlPanel'
import { Notification } from '@/components/Notification'
import { useWebSocket } from '@/hooks/useWebSocket'
import { BeforeInstallPromptEvent } from '@/types'

export default function Home() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
    visible: boolean
  }>({
    message: '',
    type: 'info',
    visible: false
  })

  // WebSocket connection
  const wsUrl = typeof window !== 'undefined' 
    ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname}:8080`
    : ''
  
  const { connected, connecting, userCount, messages, sendMessage, clearMessages } = useWebSocket(wsUrl)

  // PWA Install handling
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
      showNotification('App can be installed!', 'info')
    }

    const handleAppInstalled = () => {
      setInstallPrompt(null)
      showNotification('App installed successfully!', 'success')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // Notification handling
  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({ message, type, visible: true })
  }

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }))
  }

  // PWA functions
  const handleInstall = async () => {
    if (!installPrompt) return

    try {
      await installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      
      if (outcome === 'accepted') {
        showNotification('Installation started...', 'info')
      } else {
        showNotification('Installation cancelled', 'warning')
      }
      
      setInstallPrompt(null)
    } catch (error) {
      console.error('Installation failed:', error)
      showNotification('Installation failed', 'error')
    }
  }

  const handleUpdateCache = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready
        await registration.update()
        showNotification('Cache updated successfully!', 'success')
      }
    } catch (error) {
      console.error('Cache update failed:', error)
      showNotification('Cache update failed', 'error')
    }
  }

  const handleSendMessage = (content: string) => {
    if (connected) {
      sendMessage(content)
      showNotification('Message sent!', 'success')
    } else {
      showNotification('Not connected to server', 'error')
    }
  }

  return (
    <>
      <Head>
        <title>PWA - Progressive Web Application</title>
        <meta name="description" content="Progressive Web Application with offline support and real-time communication" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-purple-700">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <header className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg border border-white/20">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                PWA Example
              </h1>
              <StatusIndicator connected={connected} userCount={userCount} />
            </div>
          </header>

          {/* Main Content */}
          <main className="space-y-6">
            {/* Control Panel */}
            <ControlPanel
              onInstall={installPrompt ? handleInstall : undefined}
              onUpdateCache={handleUpdateCache}
              canInstall={!!installPrompt}
              connected={connected}
            />

            {/* Message Input */}
            <MessageInput
              onSendMessage={handleSendMessage}
              disabled={!connected}
            />

            {/* Message Log */}
            <MessageLog
              messages={messages}
              onClear={clearMessages}
            />
          </main>
        </div>

        {/* Notification */}
        <Notification
          message={notification.message}
          type={notification.type}
          visible={notification.visible}
          onHide={hideNotification}
        />
      </div>
    </>
  )
} 