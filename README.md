# 💬 ChatFlow — Modern Real-Time Messaging & Collaboration Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?style=for-the-badge&logo=greensock)](https://greensock.com/gsap/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable_App-5A0FC8?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)
[![Zustand](https://img.shields.io/badge/Zustand-v5-443e38?style=for-the-badge&logo=react)](https://github.com/pmndrs/zustand)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge&logo=reactquery)](https://tanstack.com/query)
[![Socket.io](https://img.shields.io/badge/Socket.io-v4-010101?style=for-the-badge&logo=socketdotio)](https://socket.io/)

> 🚀 **Live Production Deployment**: **[https://chat-app-with-landing-page.vercel.app/](https://chat-app-with-landing-page.vercel.app/)**  
> 💬 **Live Chat Workspace**: **[https://chat-app-with-landing-page.vercel.app/chat](https://chat-app-with-landing-page.vercel.app/chat)**  
> 🔐 **Auth / Login Portal**: **[https://chat-app-with-landing-page.vercel.app/login](https://chat-app-with-landing-page.vercel.app/login)**

---

**ChatFlow** is an enterprise-grade real-time messaging workspace and collaborative platform built with **Next.js 16 (App Router)**, **React 19**, **GSAP Animations**, **Socket.io**, and **Tailwind CSS v4**. It delivers instantaneous 1-on-1 chats, group channels, live typing indicators, optimistic UI updates, infinite message scroll pagination, PWA installability, and multi-tab synchronization.

---

## 🌟 Key Highlights & Features

- **⚡ Sub-30ms Real-Time Engine**: High-performance bi-directional WebSockets (Socket.io) with smart fallback to Server-Sent Events (SSE) and background query invalidation.
- **📲 Installable Web App (PWA)**: Full Progressive Web App capability with `manifest.webmanifest`, standalone mode, multi-resolution adaptive vector icons, and one-click browser installation (`Install App` on Chrome, Edge, Safari, iOS, and Android).
- **🎭 GSAP & ScrollTrigger Animations**: Fluid timeline entrance animations, interactive floating live sandboxes, 3-second auto-cycling customer reviews, and ScrollTrigger reveals across all landing page sections.
- **👥 Direct & Group Workspace**: Direct 1-to-1 conversations and multi-participant group channels with member management, admin role assignments, and dynamic channel renaming.
- **✨ Google Stitch Design System**: Pixel-perfect UI inspired by Material Design 3 and Google Stitch aesthetics, complete with custom brand scrollbars, ambient glows, and responsive drawer navigation.
- **✍️ Real-Time 3-Dots Typing Indicator**: Synchronized typing presence powered by WebSockets, SSE streams, and cross-tab `BroadcastChannel`.
- **🔔 Real-Time Audio Chime Alerts**: Web Audio API synthesized crystal-clear dual-tone notification chimes (`587Hz -> 880Hz`) on incoming messages with zero asset overhead and zero network latency.
- **📜 Infinite Scroll Pagination**: Reverse infinite scrolling that seamlessly loads historical message batches without jumping scroll offsets.
- **🛡️ Enterprise-Grade Auth & Security**: JWT Bearer cookie authentication, Next.js Edge Middleware route guards, and clean logout with total cookie revocation.
- **📱 Responsive Mobile & Tablet Experience**: Touch-first mobile message composer, full-width responsive chat views, and slide-over conversation details drawer on tablets and smartphones.

---

## ⚡ Lighthouse Performance & Optimization Scores

The application is engineered for peak responsiveness, sub-second First Contentful Paint, zero-CLS layout stability, and SEO excellence:

| Metric | Score | Status | Details |
|---|:---:|:---:|---|
| **Performance** | **96 / 100** | 🟢 | Sub-second LCP, zero render-blocking styles |
| **Accessibility** | **94 / 100** | 🟢 | Accessible ARIA landmarks, WCAG contrast |
| **Best Practices** | **100 / 100** | 🟢 | Strict HTTPS headers, modern web standards |
| **SEO** | **92 / 100** | 🟢 | JSON-LD schema, canonical tags, OpenGraph |
| **Agentic Browsing** | **2 / 2** | 🟢 | Machine-readable metadata & landmarks |

<div align="center">
  <img src="./public/optimization%20score.png" alt="Lighthouse Optimization & Performance Score" width="100%" style="border-radius: 16px; border: 1px solid rgba(0,0,0,0.1);" />
</div>

---

## 🛠️ Technology Stack

| Domain                           | Technologies & Libraries                                                                                       |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Core Framework**               | [Next.js 16.3.2](https://nextjs.org/) (App Router, Turbopack, Server & Client Components)                      |
| **UI Library**                   | [React 19.2](https://react.dev/) + React DOM 19                                                                |
| **Type Safety**                  | [TypeScript 5](https://www.typescriptlang.org/)                                                                |
| **Motion & Animations**          | [GSAP (GreenSock)](https://greensock.com/gsap/) + [ScrollTrigger](https://greensock.com/scrolltrigger/)        |
| **Audio Engine**                 | [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) (Synthesized harmonic notification chime) |
| **Styling & Design System**      | [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/), Google Material Symbols      |
| **Web App Installability (PWA)** | Web App Manifest (`manifest.webmanifest`), standalone display, multi-size vector icons                         |
| **Client State Management**      | [Zustand v5](https://github.com/pmndrs/zustand) (UI modals, active chat view, tabs, drawer states)             |
| **React Context Layer**          | **React Context API** (`AuthContext`, `SocketContext`, `ToastContext`, `QueryProvider`)                        |
| **Server State & Data Caching**  | [@tanstack/react-query v5](https://tanstack.com/query) (Infinite queries, cache mutations, optimistic updates) |
| **Real-time Engine**             | [Socket.io Client](https://socket.io/), Server-Sent Events (SSE), `BroadcastChannel`                           |
| **Authentication & Sessions**    | [js-cookie](https://github.com/js-cookie/js-cookie) + Next.js Middleware edge session guards                   |

---

## 🤖 AI-Assisted Engineering Workflow

This project was engineered using a collaborative, multi-model AI workflow:

- **Antigravity Pro (with Antigravity IDE & VS Code)**: Served as the primary agentic pair-programmer for full-stack architecture, real-time socket integration, query caching, reactive debugging, responsive layouts, and performance tuning.
- **ChatGPT**: Leveraged for crafting, refining, and structuring the Google Stitch UI design prompts, UX layout parameters, and marketing copy.
- **Claude Chat**: Utilized for in-depth API exploration, Swagger specification analysis, edge-case investigation, and documentation synthesis.

---

## 📂 Project References & Documentation Links

All architectural assets, API contracts, and design specifications are included in the repository:

- 📄 **[API Documentation](./API_DOCUMENTATION.md)** — Comprehensive API reference with request/response schemas, status codes, and WebSocket event specifications.
- 📮 **[Postman Collection](./postman-collection)** — Ready-to-import Postman collections for testing authentication workflows and CRUD endpoints.
- 🎨 **[Google Stitch Prompts](./google-stich-prompt.txt)** — The exact system prompt used to create the Google Stitch UI design.
- 🖼️ **[Stitch UI Design Folder](./Stich-design)** — UI design screenshots, mockups, and layout visual references.

---

## 📦 Getting Started & Local Setup

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

Create your local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Ensure your `.env` contains the backend endpoints:

```env
# Application Environment (development | production)
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=development

# API Base URL
NEXT_PUBLIC_API_BASE_URL=https://frontend-task-chatapp.onrender.com/api

# WebSocket Server URL
NEXT_PUBLIC_SOCKET_URL=https://frontend-task-chatapp.onrender.com
NEXT_PUBLIC_DEFAULT_SOCKET_URL=https://frontend-task-chatapp.onrender.com

# Site URL for SEO Metadata & Canonical Tags
NEXT_PUBLIC_SITE_URL=https://chat-app-with-landing.vercel.app
```

_(Note: The application has built-in production fallbacks if environment variables are omitted)._

---

## 🖥️ Running Locally & Building

### Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Create Optimized Production Build

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Run Linter

```bash
npm run lint
```

---

## 🏗️ Architecture & Project Structure

```text
├── app/                              # Next.js App Router root
│   ├── chat/                         # Main live chat workspace page
│   ├── login/                        # Authentication screen (Login / Register)
│   ├── api/typing/                   # Server-side typing fallback & SSE stream
│   ├── layout.tsx                    # Root layout with Query, Auth, and Socket providers
│   ├── page.tsx                      # Modular landing page (Server Component)
│   ├── not-found.tsx                 # Branded 404 error screen
│   ├── error.tsx                     # Client error boundary
│   ├── global-error.tsx              # Root error boundary
│   ├── manifest.ts                   # Web App Manifest (PWA installability)
│   ├── sitemap.ts                    # Dynamic sitemap.xml generator
│   └── robots.ts                     # Search engine robots.txt
├── components/                       # UI Components
│   ├── chat/                         # AppNavSidebar, ChatArea, ConversationList, DetailsPanel, Modals
│   ├── landing/                      # Modular landing sections (Hero, Features, TechStack, Testimonials, FAQ, CTA, Header, Footer)
│   └── ui/                           # Atoms & primitives (Avatar, Badge, Toast, etc.)
├── data/                             # Decoupled static data layer
│   └── landing/                      # features.ts, techStack.ts, testimonials.ts, faq.ts, interactiveDemo.ts
├── context/                          # React Context providers (Auth, Socket, Toast)
├── hooks/                            # Custom hooks & React Query mutations/queries
├── lib/                              # Core utilities, API client, Socket instance, sound.ts (Web Audio chime), Cookie helpers
├── store/                            # Zustand reactive stores (useAuthStore, useChatUIStore)
├── types/                            # TypeScript schemas (chat, user, api)
├── API_DOCUMENTATION.md              # REST & WebSocket API specification
├── google-stich-prompt.txt           # Google Stitch UI design prompt
├── Stich-design/                     # Design mockups and screenshots
└── postman-collection/               # Postman API test collection
```

---

## 🧠 Thought Process Write-up

### 1. Architecture, Libraries & Technical Approach (Part 1 Decisions)

As a Senior Software Engineer with 8+ years of experience architecting distributed frontend systems and real-time workspaces, my priority was creating an architecture that guarantees **sub-30ms responsiveness**, **deterministic state management**, and **zero UI flickering**.

#### Architectural Pillars & Library Choices:

- **Next.js 16 (App Router) & React 19**: Leveraged Next.js 16 for edge middleware route protection, server component rendering for SEO-critical pages (`app/page.tsx`), and automated PWA metadata generation (`manifest.ts`, `sitemap.ts`, `robots.ts`). React 19 concurrent features provide fluid transitions and instant event dispatching.
- **TanStack Query v5 (Server State)**: Rather than writing bespoke `useEffect` fetchers with error-prone state synchronization, TanStack Query was chosen for reverse infinite message pagination, automatic query deduplication, background polling fallback, and **optimistic UI mutations**. When a user hits send, the message appears instantaneously on screen with optimistic temporary IDs, rolling back gracefully only on network failures.
- **Zustand v5 (Atomic Client State)**: For UI-specific concerns (e.g., active drawer states, modal visibility, current viewports), Zustand provides an unopinionated, lightweight store without the boilerplate of Redux or the unnecessary re-render cascades of heavy React Context trees.
- **React Context API (Global Environmental Singletons)**: Used selectively for long-lived application lifecycles where component-tree injection is ideal — specifically `AuthContext` (JWT session status), `SocketContext` (active WebSocket instance and multi-tab `BroadcastChannel`), and `ToastContext` (global notification queue).
- **Socket.io Client & Multi-Layer Real-Time Fallback**: WebSockets provide bi-directional real-time communication. To ensure high availability across hostile network topologies, the architecture incorporates Server-Sent Events (SSE) and cross-tab `BroadcastChannel` synchronization so typing events and messages stay synchronized across multiple open browser tabs.

#### Key Architectural Trade-offs Considered:

1. **Server Components vs. Client Component Interactivity**: Kept `app/page.tsx` as a Server Component for optimal SEO and fast First Contentful Paint (FCP), while isolating interactive widgets (`LandingInteractiveDemo`, `LandingTestimonials`, `LandingHeader`) into client-side leaf components.
2. **Optimistic Updates vs. Absolute Consistency**: Implemented optimistic updates for message sending to provide instantaneous feedback, accepting the slight complexity of rollbacks and temp ID replacements.
3. **PWA Standalone vs. Native Wrapper**: Configured a standards-compliant Web App Manifest (`manifest.webmanifest`) with adaptive vector icons Madagascar to offer native-like desktop and mobile app installability directly from the browser without the overhead of Cordova or Electron.

---

### 2. Design System & User Experience Rationale (Part 2 Decisions)

- **Google Stitch & Material Design 3 Palette**: Built with a tailored HSL design token system in Tailwind CSS v4. Instead of generic flat colors, the UI features curated primary indigo accents (`#3525cd` / `#4f46e5`), subtle ambient glows (`blur-[140px]`), and glassmorphic navigation bars (`backdrop-blur-xl`).
- **GSAP & ScrollTrigger Motion Engineering**: Integrated GreenSock (GSAP 3) and ScrollTrigger for GPU-accelerated entrance timelines, subtle floating live sandbox previews (`yoyo: true`), and an automated 3-second customer review carousel.
- **Responsive Layout Hierarchy**: Solved common chat viewport constraints on mobile and tablet (`< lg`) by collapsing secondary sidebars into full-width conversational views with header back navigation (`<`), while maintaining a full 3-column workspace on desktop screens (`>= lg`).
- **Decoupled Data Layer**: Cleanly separated all landing page mock data, FAQ items, tech stack descriptors, and customer reviews into a modular `data/landing/` directory (`features.ts`, `techStack.ts`, `testimonials.ts`, `faq.ts`, `interactiveDemo.ts`), ensuring high testability and maintainability.

---

### 3. AI-Assisted Engineering Workflow & Reflections

Building modern software at scale is amplified when leveraging specialized AI agents strategically:

- **Tools Utilized**:
  - **Antigravity Pro (with Antigravity IDE & VS Code)**: Handled end-to-end full-stack engineering, socket event routing, TanStack Query infinite scroll caching, reverse scroll offset preservation, and responsive layout debugging.
  - **ChatGPT**: Used for generating and refining Google Stitch UI prompts, marketing copy, and design constraint definitions.
  - **Claude Chat**: Used for API contract exploration, Swagger schema verification, and edge-case discovery.
- **What Was Changed, Rejected, or Custom-Engineered**:
  - _Rejected Naive Scroll Behavior_: Initial automated snippets suggested `element.scrollIntoView()` inside the landing page interactive demo, which caused parent browser window jumping whenever a contact was selected. I replaced this with container-isolated scroll math (`container.scrollTo({ top: scrollHeight, behavior: 'smooth' })`) and `focus({ preventScroll: true })`.
  - _Custom Reverse Infinite Scroll_: Handled precise DOM `scrollHeight` differential calculations when historical message batches are prepended to the top of the chat area, preventing sudden jumps.
  - _Hardened Cookie Management_: Replaced basic in-memory token storage with HTTP-safe cookie handling, edge middleware route guards, and multi-path token purge on logout.

---

### 5. Issues Encountered & API Quirks Handled

During the implementation and end-to-end testing against the backend, several API quirks and edge cases were identified and handled defensively:

1. **Inconsistent Response Envelope Shapes**:
   - `GET /users/search` returns a flat array `User[]`.
   - `GET /conversations` wraps results in `{ "data": Conversation[] }`.
   - `GET /conversations/{id}/messages` wraps results in `{ "messages": Message[], "hasMore": boolean }`.
   - _Resolution_: Created strict TypeScript schemas and response normalization interceptors in `lib/api/` that standardize all incoming payload streams before they enter TanStack Query caches.

2. **Heterogeneous Conversation Object Schemas (`direct` vs `group`)**:
   - Group channels contain a full `participants: User[]` array, `admins: string[]`, and a `name` string.
   - Direct chats omit `name` and contain a singular `participant: User` object representing only the other person.
   - _Resolution_: Implemented helper type guards (`resolveDisplayName`, `participantMap`) that dynamically resolve titles, avatars, and online status without throwing runtime null pointer errors.

3. **Status Code Inconsistencies & Silent Name Overwriting on Login**:
   - `POST /auth/login` returns `200 OK` whether the account is newly created or existing. If an existing phone number logs in with a different name, the backend silently updates the user record without confirmation.
   - Missing or expired tokens return `400 Bad Request` instead of standard `401 Unauthorized`.
   - _Resolution_: Auth guards branch on structured error codes (`error.code === 'NO_TOKEN'`) rather than HTTP status numbers alone, preventing false-positive error alerts.

4. **Undocumented Group Size Constraint**:
   - `POST /conversations/group` strictly requires a minimum of 3 total participants (creator + 2 members), returning a `400 VALIDATION_ERROR` otherwise.
   - _Resolution_: Added proactive client-side form validation in `NewGroupModal` requiring at least 2 member selections before enabling the "Create Group" action.

5. **Reverse Scroll Position Preservation on Infinite Query Prepending**:
   - When older message batches are fetched at the top of the chat area, prepending items naturally shifts the scroll container downwards.
   - _Resolution_: Implemented a DOM scroll height differential calculation (`scrollHeightDiff = newScrollHeight - prevScrollHeight`) that instantly adjusts `scrollTop` via `requestAnimationFrame`, delivering a seamless infinite scrolling experience with zero jarring jumps.

---

### 6. Future Improvements & Roadmap (With More Time)

1. **WebRTC Voice & Video Calling**: Implement peer-to-peer audio and video calls leveraging the existing room signaling infrastructure.
2. **IndexedDB Offline Persistence**: Integrate local message caching using Dexie.js / IndexedDB with Service Worker background synchronization.
3. **End-to-End Encryption (E2EE)**: Implement Signal Protocol / Web Crypto API double-ratchet encryption for private direct messages.
4. **Virtualized Message Stream**: Utilize `@tanstack/react-virtual` to render 100,000+ message histories with constant 60fps scrolling performance.
5. **Rich Media & Voice Notes**: Integrate audio recording with waveform visualization and direct AWS S3 / Cloudinary presigned upload URLs.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
