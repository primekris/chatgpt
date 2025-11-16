# ChatGPT Clone - AI Chat Application

## Overview

This is a production-ready ChatGPT-style web application that provides a conversational AI interface with streaming responses, session management, and extensive customization options. The application uses Together AI's API for AI responses and stores all data locally in the browser via localStorage.

**Core Purpose**: Provide users with a ChatGPT-like experience featuring real-time AI responses, multiple conversation sessions, voice input/output, code syntax highlighting, and customizable AI behavior.

**Tech Stack**:
- **Frontend**: React with TypeScript, Vite build system
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Backend**: Express.js server for proxying AI requests
- **AI Provider**: Together AI (Meta Llama 3.1 8B model)
- **State Management**: Local React state with localStorage persistence
- **Data Validation**: Zod schemas

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Component Structure**: The application follows a component-based architecture with clear separation of concerns:

- **Layout Components**: `ChatSidebar`, `ChatHeader`, `ChatArea` handle the main application layout
- **Feature Components**: `MessageBubble`, `InputBox`, `CodeBlock` provide specific functionality
- **UI Components**: shadcn/ui library components in `client/src/components/ui/` for consistent styling
- **Custom Hooks**: `use-speech-recognition`, `use-text-to-speech`, `use-toast` encapsulate reusable logic

**Routing**: Uses `wouter` for lightweight client-side routing. Currently single-page application with all routes directing to `ChatPage`.

**State Management**: 
- Session-level state managed via React hooks in `ChatPage.tsx`
- Persistent data stored in localStorage via `lib/storage.ts`
- No database backend - fully client-side data persistence

**Design Philosophy**: ChatGPT-inspired UI with explicit replication of ChatGPT's interface patterns (documented in `design_guidelines.md`). Key design decisions:
- Sidebar width: 260px desktop, collapsible on mobile
- Max content width: 768px for optimal reading
- Message bubbles: Full-width containers with centered content
- Consistent spacing using Tailwind's scale (2, 3, 4, 6, 8, 12)

### Backend Architecture

**Server Framework**: Express.js serving as a minimal proxy layer for AI API requests.

**API Endpoints**:
- `POST /api/chat/stream`: Server-Sent Events (SSE) endpoint for streaming AI responses
- Request validation using Zod schemas from `shared/schema.ts`

**AI Service Pattern**: `server/ai-service.ts` implements a provider pattern for AI integrations:
- `AIProvider` interface defines contract for AI providers
- `TogetherAIProvider` implements Together AI integration
- AsyncGenerator pattern for streaming responses
- Easy to extend with new providers (OpenAI, Anthropic, etc.)

**Why this approach**:
- Keeps API keys server-side for security
- SSE enables real-time streaming without WebSockets complexity
- Provider pattern allows future multi-model support
- Minimal backend reduces deployment complexity

### Data Architecture

**Storage Layer**: Client-side localStorage-based persistence (`client/src/lib/storage.ts`):
- Sessions stored as JSON arrays
- Active session ID tracked separately
- System prompts and settings stored independently
- No user authentication or database required

**Data Models** (defined in `shared/schema.ts`):
- `Message`: Individual chat messages with role, content, timestamp
- `Session`: Collection of messages with metadata
- `SystemPrompt`: Customizable AI behavior instructions
- `ChatRequest`: API request format with messages, temperature, model selection

**Why localStorage**:
- Zero backend database infrastructure needed
- Instant deployments without database setup
- Per-browser sessions (privacy-friendly)
- Sufficient for personal use case
- Could migrate to PostgreSQL/Drizzle later if multi-user support needed

**Note**: While Drizzle ORM configuration exists in `drizzle.config.ts`, it's not currently used. The application is designed to work without a database, but the infrastructure is ready if future requirements demand server-side persistence.

### Feature Implementation

**Streaming Responses**: 
- Server uses AsyncGenerator to stream AI responses chunk by chunk
- Client consumes SSE stream and updates UI in real-time
- Typing animation effect via React state updates

**Session Management**:
- Create, rename, delete sessions
- Automatic title generation from first message
- Persistent across browser sessions

**Message Actions**:
- Copy, download, edit, regenerate, delete per message
- Dropdown menu (3-dot) appears on hover
- Each action triggers state updates and localStorage sync

**Voice Features**:
- Speech recognition via Web Speech API (`use-speech-recognition.ts`)
- Text-to-speech via browser's SpeechSynthesis API (`use-text-to-speech.ts`)
- Graceful degradation when APIs unavailable

**Code Handling**:
- Syntax highlighting via highlight.js
- Copy and download code blocks
- Language detection from markdown code fences
- React-markdown with remark-gfm for parsing

## External Dependencies

### Third-Party APIs

**Together AI API**:
- **Purpose**: AI model inference for chat responses
- **Authentication**: API key stored in `TOGETHER_API_KEY` environment variable
- **Models**: Currently using Meta Llama 3.1 8B Instruct Turbo
- **Integration**: Server-side only, proxied through Express endpoint
- **Future**: Architecture supports adding OpenAI, Anthropic, Mistral models

### Core Libraries

**React Ecosystem**:
- `react` + `react-dom`: UI framework
- `@tanstack/react-query`: Server state management (currently minimal use)
- `wouter`: Lightweight routing

**UI/Styling**:
- `tailwindcss`: Utility-first CSS framework
- `@radix-ui/*`: Headless UI components (accordion, dialog, dropdown, etc.)
- `class-variance-authority`: Component variant styling
- `lucide-react`: Icon library

**Markdown & Code**:
- `react-markdown`: Markdown rendering
- `remark-gfm`: GitHub Flavored Markdown support
- `highlight.js`: Syntax highlighting for code blocks

**Validation & Utilities**:
- `zod`: Runtime type validation and schema definition
- `nanoid`: Unique ID generation
- `date-fns`: Date formatting utilities

**Build Tools**:
- `vite`: Frontend build tool and dev server
- `typescript`: Type safety
- `esbuild`: Backend bundling

### Browser APIs

**Web Speech API**: Used for voice input (speech recognition)
**Speech Synthesis API**: Used for text-to-speech output
**localStorage**: Client-side data persistence
**Fetch API**: HTTP requests for AI streaming

### Database (Optional/Future)

**Drizzle ORM**: Configured but not actively used
- Ready for PostgreSQL integration via Neon serverless
- Would enable multi-user support and cloud sync
- Currently application works entirely without database

### Deployment

**Designed for**: Render.com free tier (documented in `DEPLOYMENT.md`)
- GitHub-based deployment
- Environment variable support for API keys
- Single buildpack deployment (Node.js)