# Tech Stack Architecture

---

## Infrastructure & Deployment

| Layer | Tool |
|---|---|
| Hosting | Vercel |
| CDN + Edge Cache | Vercel Edge Network |
| Domain + DNS | GoDaddy |
| SSL | Auto via Vercel |

**Add:**
- **PWA support** — Makes the app installable on mobile without an app store.
- **Service Workers** — Offline caching so the app loads even without a connection.
- **Image optimization pipeline** — Auto-compress and serve modern formats like WebP.
- **Edge middleware** — Handle auth checks, geo-routing, redirects, and rate limiting before requests hit the backend.

---

## Frontend Stack

### Core
- **React** — UI framework
- **Vite** — Fast bundler and dev server
- **TypeScript** — Type safety across the codebase

### State Management
- **Zustand** — Lightweight global client state
- **TanStack Query** — Server state, caching, and background refetching

### Add
- **Immer** — Clean immutable state updates, especially for nested objects
- **React Hook Form** — Performant, minimal-re-render form handling
- **Zod** — Schema validation shared between frontend and backend

---

## UI System

### Styling
- **Tailwind CSS** — Utility-first styling
- **Lucide Icons** — Clean, consistent icon set

### Components
- **shadcn/ui** — Accessible, customizable components built on Radix UI

### Animation
- **Framer Motion** — Smooth UI transitions and gesture interactions

### Theming
- Dark / light / warm mode via CSS variables
- Dynamic accent color support

---

## Authentication & Security

### Auth (pick one)
- **Better Auth** — Modern TypeScript-first, great DX
- **Auth.js** — More battle-tested, wider ecosystem

**Must support:** Google Sign-In, Email OTP, Magic links, Session management, Multi-device sessions

### Security
- **JWT rotation** — Refresh tokens invalidate after each use
- **CSRF protection** — Middleware-level, non-negotiable
- **Rate limiting** — Especially on auth endpoints
- **Device fingerprinting** — Detect suspicious session activity
- **Redis session cache** — Fast auth checks without hitting the DB every time
- **Zod request validation** — Validate every incoming request before handler logic runs

---

## Backend

### Core
- **Node.js + Fastify + TypeScript** — Fast, typed, well-structured

### Monorepo Structure
```
/apps
   /api
   /socket
   /worker
   /ai
/packages
   /types
   /ui
   /config
```
Shared types and config live in `/packages` — one source of truth across all services.

---

## Real-Time

- **WebSockets** — Chat and live events
- **WebRTC** — Voice, video, and screen sharing

### Add
- **Socket.IO** or native `ws` — Reconnection logic and rooms on top of raw WebSocket
- **TURN/STUN servers (Coturn)** — Required for WebRTC behind firewalls and NAT. Without this, calls fail for a real percentage of users.

---

## AI Layer

### Current
- Puter AI

### Target Architecture
```
AI Provider Layer
 ├── OpenAI
 ├── Gemini
 ├── Claude
 ├── Local Models
 └── Future Providers
```
A thin abstraction layer means swapping or adding providers is a config change, not a rewrite.

### Add
- **AI routing** — Match request types to the right model
- **Fallback providers** — Auto-retry on failure or rate limit
- **Streaming responses** — Start rendering before the full response arrives
- **Prompt templates** — Centralized, versioned prompts
- **Conversation memory** — Manage context window across turns
- **Moderation layer** — Filter user input before it reaches the model
- **Token tracking** — Per-feature and per-user usage visibility

### Libraries
- **Vercel AI SDK** — Streaming, provider abstraction, React hooks — start here
- **LangChain** — Only if you need complex multi-step agent pipelines

---

## Database

| Database | Use Case |
|---|---|
| PostgreSQL + Prisma | Primary relational data |
| MongoDB | Chats, embeddings, AI logs, app logs |

---

## Redis

Add this early — it solves multiple problems at once:

- **Caching** — Frequently read data without hitting the DB
- **OTPs & temp codes** — Built-in TTL handles expiry automatically
- **Session storage** — Fast, scalable auth sessions
- **Rate limiting** — Atomic counters across multiple server instances
- **WebSocket scaling** — Pub/Sub lets multiple WS servers share state
- **BullMQ backing** — Powers the job queue
- **Short-term AI memory** — Temporary context that doesn't need permanent storage

---

## Background Jobs

**BullMQ** — Queue system built on Redis.

Never run heavy operations directly in API routes. Use the queue for:
- Push and email notifications
- AI processing jobs
- OCR and media compression
- Audio transcription
- Anything calling an external service that needs retry logic

---

## File Storage

Don't store files on the server. Use object storage:

- **Cloudflare R2** — No egress fees, easy CDN integration *(recommended)*
- **AWS S3** — Mature and broadly supported, watch egress costs

Store: voice notes, images, OCR uploads, recordings, avatars.

---

## Voice & Media

### TTS
- **ElevenLabs** — Best voice quality, supports streaming
- **Sarvam AI** — Strong option for Indian languages

### Add
- **Streaming TTS** — Play audio as it generates, not after
- **Interruption handling** — Stop playback cleanly when the user starts speaking
- **Silence detection** — Auto-detect end of user speech
- **Local audio preprocessing** — Noise reduction before sending upstream

### Transcription
- **Whisper** — Accurate, multilingual, can be self-hosted
- **Deepgram** — Lower latency, better for real-time streaming

---

## OCR & Vision

### OCR
- **Tesseract** — Reliable for clean printed documents
- **PaddleOCR** — Better for multilingual content and complex layouts

### Vision AI
- **OpenAI GPT-4 Vision** / **Google Gemini** — Structured extraction and complex document understanding
- Use the same abstraction layer as the text AI layer

---

## Mobile & Desktop

### Desktop
- **Tauri** — Web frontend + Rust backend. Lighter and faster than Electron.
- **SQLite** — Local database for offline data and preferences
- Native APIs: camera, mic, file system, notifications, screen share

### Android
- **Capacitor** — Wraps the web app, mature plugin ecosystem *(safer choice today)*
- **Tauri Mobile** — Shares codebase with desktop, still maturing

---

## Observability

Add this before you need it, not after.

- **Pino** — Structured JSON logging for Node.js
- **Sentry** — Error tracking with full stack traces and request context
- **PostHog** — Product analytics, session recordings, funnel analysis
- **Better Stack** — Uptime monitoring and incident alerting

---

## CI/CD

**GitHub Actions** — Standard pipeline:
```
Lint → Test → Build → Deploy
```

**Code quality:**
- **ESLint** — Catch errors and enforce consistent patterns
- **Prettier** — Automatic formatting, no style debates
- **Husky** — Run checks before commits land
- **Commitlint** — Enforce consistent commit message format

---

## Full Architecture

```
Frontend (React + Vite + TypeScript)
              │
              ▼
    API Gateway (Fastify)
              │
    ┌─────────┼──────────┐
    ▼         ▼          ▼
  Auth        AI      WebSocket
    │         │           │
    ▼         ▼           ▼
  Redis    Workers      WebRTC
    │
    ▼
PostgreSQL + MongoDB
    │
    ▼
Object Storage (R2 / S3)
```

---

## Priorities

The stack is solid. The risk isn't missing technology — it's building too much too early.

- Ship product before adding infrastructure
- Let real problems drive technical decisions
- Keep the experience fast, stable, and simple