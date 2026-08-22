# 💬 ChatFlow — Modern Real-Time Messaging Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-v5-443e38?style=for-the-badge&logo=react)](https://github.com/pmndrs/zustand)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge&logo=reactquery)](https://tanstack.com/query)
[![Context API](https://img.shields.io/badge/React_Context_API-Integrated-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Socket.io](https://img.shields.io/badge/Socket.io-v4-010101?style=for-the-badge&logo=socketdotio)](https://socket.io/)

ChatFlow is a state-of-the-art, real-time messaging application and live workspace built with Next.js 16 (App Router), React 19, and Tailwind CSS. Featuring direct 1-to-1 conversations, group channels, real-time typing indicators, optimistic UI updates, infinite message pagination, and seamless cross-tab synchronization.

---

## 🚀 Key Features

- **⚡ Lightning-Fast Real-Time Messaging**: Built on Socket.io with optimistic UI updates and smart background polling fallback.
- **👥 Direct & Group Channels**: Start 1-to-1 direct chats or create rich multi-member group channels with admin privileges.
- **✨ Google Stitch Design System**: Clean, modern UI inspired by Material Design 3 and Google Stitch aesthetics.
- **✍️ Real-Time Typing Indicators**: Live 3-dots typing animations synchronized via WebSockets, SSE streams, and cross-tab `BroadcastChannel`.
- **📜 Infinite Scroll Pagination**: Smooth historical message loading that preserves scroll position and auto-scrolls on new messages.
- **🛡️ Enterprise-Grade Auth & Security**: JWT cookie authentication, Next.js Middleware route guards, and clean logout with full cookie revocation.
- **📱 Fully Responsive**: Fluid responsive layout with mobile drawer views and collapsible conversation details sidebars.

---

## 🛠️ Technology Stack

| Area | Technologies |
|---|---|
| **Frontend Framework** | [Next.js 16.3.2](https://nextjs.org/) (App Router, Turbopack, React 19) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling & Icons** | [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/), Google Material Symbols |
| **Client State Management** | [Zustand v5](https://github.com/pmndrs/zustand) (UI modals, active chat view, tabs, responsive state) |
| **React Context Providers** | **React Context API** (`AuthContext`, `SocketContext`, `ToastContext`, `QueryProvider`) |
| **Server State & Caching** | [@tanstack/react-query v5](https://tanstack.com/query) (Infinite queries, cache mutations, optimistic updates) |
| **Real-time Engine** | [Socket.io Client](https://socket.io/), Server-Sent Events (SSE), `BroadcastChannel`, LocalStorage Sync |
| **Auth & Cookies** | [js-cookie](https://github.com/js-cookie/js-cookie) + Next.js Middleware server-side guards |

---

## 🤖 AI-Assisted Workflow & Tools Used

This project was crafted using a modern AI-assisted engineering workflow:

- **Antigravity Pro (with Antigravity IDE & VS Code)**: Used as the primary agentic pair-programmer for full-stack architecture, real-time socket integration, query caching, and reactive debugging.
- **ChatGPT**: Used for crafting, refining, and iterating on the Google Stitch UI design prompts and UX copy.
- **Claude Chat**: Used for API research, swagger inspection, edge-case analysis, and documentation synthesis.

---

## 📂 Project References & Documentation Links

All design specifications, API documentation, and test collections are included in the repository:

- 📄 **[API Documentation](./API_DOCUMENTATION.md)** — Comprehensive API reference with request/response schemas, status codes, and WebSocket event details.
- 📮 **[Postman Collection](./postman-collection)** — Complete Postman collection for testing REST endpoints and authentication workflows.
- 🎨 **[Google Stitch Prompts](./google-stich-prompt.txt)** — The exact design prompt used to generate the Google Stitch UI system.
- 🖼️ **[Stitch UI Design Folder](./Stich-design)** — UI design screenshots, mockups, and layout references.

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/hasibulhasanshanto/chat-app-with-landing-page.git
cd chat-app-with-landing-page
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to create your local `.env` file:

```bash
cp .env.example .env
```

Ensure your `.env` contains the required configuration:

```env
# Application Environment (development | production)
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=development

# API Base URL
NEXT_PUBLIC_API_BASE_URL=https://frontend-task-chatapp.onrender.com/api

# WebSocket Server URL
NEXT_PUBLIC_SOCKET_URL=https://frontend-task-chatapp.onrender.com
NEXT_PUBLIC_DEFAULT_SOCKET_URL=https://frontend-task-chatapp.onrender.com
```

*(Note: If environment variables are omitted, the application automatically falls back to the default live backend URLs).*

---

## 🖥️ Running Locally

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the app.

### Production Build & Start

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

---

## 📁 Project Structure

```text
├── app/                      # Next.js App Router pages and layouts
│   ├── chat/                 # Main chat workspace page
│   ├── login/                # Authentication page (Login / Register)
│   ├── api/typing/           # Server-side typing fallback & SSE stream
│   ├── layout.tsx            # Root layout with Query, Auth, and Socket providers
│   └── page.tsx              # Landing page
├── components/               # Reusable React components
│   ├── chat/                 # ChatArea, ConversationList, MessageBubble, Modals
│   ├── landing/              # Landing page sections & components
│   └── ui/                   # Shared UI atoms (Avatar, Badge, Toast, etc.)
├── context/                  # React Contexts (AuthContext, SocketContext, ToastContext)
├── hooks/                    # Custom React & React Query hooks
│   └── queries/              # TanStack Query hooks (conversations, messages, auth)
├── lib/                      # Core utilities, API client, Socket instance, Cookies
├── store/                    # Zustand stores (useAuthStore, useChatUIStore)
├── types/                    # TypeScript interfaces & type definitions
├── API_DOCUMENTATION.md      # API reference documentation
├── google-stich-prompt.txt   # Google Stitch UI design prompt
├── Stich-design/             # Design references & screenshots
└── postman-collection/       # Postman test collection
```

---

## 📄 License

This project is licensed under the MIT License.
