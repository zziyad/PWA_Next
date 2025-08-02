# Next.js PWA - Real-time Communication App

A modern Progressive Web Application built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **WebSocket** real-time communication. This project demonstrates the migration from a vanilla JavaScript PWA to a production-ready Next.js application.

## 🚀 Features

### PWA Capabilities
- ✅ **Installable** - Can be installed as a native app on any device
- ✅ **Offline First** - Works without internet connection using service workers
- ✅ **Background Sync** - Caches resources automatically
- ✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ✅ **App-like Experience** - Native app feel with smooth animations

### Real-time Communication
- ✅ **WebSocket Connection** - Real-time bidirectional communication
- ✅ **Automatic Reconnection** - Handles connection drops gracefully
- ✅ **Multi-tab Support** - Shared connection across browser tabs
- ✅ **User Count Display** - Shows active users in real-time
- ✅ **Message History** - Persists recent messages

### Modern Development Stack
- ✅ **Next.js 14** - Latest React framework with App Router
- ✅ **TypeScript** - Full type safety and better developer experience
- ✅ **Tailwind CSS** - Utility-first CSS framework
- ✅ **Modern React Patterns** - Hooks, functional components, proper state management
- ✅ **IndexedDB Integration** - Client-side database for offline data persistence

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Real-time** | WebSocket (ws) |
| **Database** | IndexedDB (idb) |
| **PWA** | next-pwa, Workbox |
| **Development** | ESLint, Prettier |

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nextjs-pwa-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to: `http://localhost:3000`

The WebSocket server automatically starts on port `8080` alongside the Next.js development server.

## 🏗 Project Structure

```
nextjs-pwa-app/
├── public/                     # Static assets
│   ├── manifest.json          # PWA manifest
│   ├── icon-192x192.png       # PWA icons
│   └── icon-512x512.png
├── server/                     # WebSocket server
│   └── websocket-server.js    # Standalone WebSocket server
├── src/
│   ├── components/            # React components
│   │   ├── StatusIndicator.tsx
│   │   ├── MessageInput.tsx
│   │   ├── MessageLog.tsx
│   │   ├── ControlPanel.tsx
│   │   └── Notification.tsx
│   ├── hooks/                 # Custom React hooks
│   │   └── useWebSocket.ts    # WebSocket management hook
│   ├── lib/                   # Utility libraries
│   │   ├── websocket.ts       # WebSocket client class
│   │   ├── database.ts        # IndexedDB wrapper
│   │   └── store.ts           # State management (Zustand)
│   ├── pages/                 # Next.js pages
│   │   ├── _app.tsx          # App wrapper
│   │   ├── _document.tsx     # HTML document
│   │   ├── index.tsx         # Home page
│   │   └── api/              # API routes
│   ├── styles/               # Global styles
│   │   └── globals.css       # Tailwind CSS imports
│   └── types/                # TypeScript definitions
│       └── index.ts          # App-wide type definitions
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## 🎯 Key Components

### WebSocket Hook (`useWebSocket.ts`)
```typescript
const { connected, userCount, messages, sendMessage } = useWebSocket(wsUrl)
```
- Manages WebSocket connection lifecycle
- Handles automatic reconnection with exponential backoff
- Provides real-time message handling

### Database Layer (`database.ts`)
```typescript
await database.addMessage(message)
const messages = await database.getMessages(50)
```
- IndexedDB wrapper for offline data persistence
- Structured message and settings storage
- Async/await API for modern JavaScript patterns

### React Components
- **StatusIndicator**: Shows connection status and user count
- **MessageInput**: Handles message input with keyboard shortcuts
- **MessageLog**: Displays message history with timestamps
- **ControlPanel**: PWA installation and cache management
- **Notification**: Toast notifications for user feedback

## 🔧 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (Next.js + WebSocket) |
| `npm run build` | Build production application |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |
| `npm run ws-server` | Start WebSocket server only |

## 🌐 PWA Features

### Installation
- Install prompt appears automatically
- Works on all modern browsers
- Native app experience on mobile devices

### Offline Support
- Service worker caches all resources
- Works completely offline after first visit
- Automatic cache updates

### Performance
- Lazy loading and code splitting
- Optimized images and assets
- Fast loading times

## 🔄 Migration from Vanilla PWA

This project demonstrates a complete migration from vanilla JavaScript PWA to Next.js:

### What was migrated:
- ✅ **Server logic** → Standalone WebSocket server
- ✅ **Client application** → Next.js React components  
- ✅ **Service Worker** → next-pwa integration
- ✅ **Styling** → Tailwind CSS with modern design
- ✅ **Database** → Proper IndexedDB implementation
- ✅ **TypeScript** → Full type safety

### Improvements made:
- 🚀 **Better Performance** - Next.js optimizations
- 🛡 **Type Safety** - Full TypeScript coverage
- 🎨 **Modern UI** - Tailwind CSS with glassmorphism
- 📱 **Better Mobile Support** - Responsive design
- 🔧 **Developer Experience** - Hot reload, better debugging
- 📦 **Production Ready** - Optimized builds and deployment

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000 8080
CMD ["npm", "start"]
```

### Environment Variables
Create `.env.local` for production:
```env
NEXT_PUBLIC_WS_URL=wss://your-websocket-server.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original PWA implementation from How.Programming.Works
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first approach
- WebSocket community for real-time communication patterns

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies** 