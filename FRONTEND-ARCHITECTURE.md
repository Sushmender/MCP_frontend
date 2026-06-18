# Frontend Architecture

> **Project:** MCP Research Frontend  
> **Backend:** FastAPI at `http://127.0.0.1:8000`  
> **Stack:** React 18 · TypeScript · Vite · TailwindCSS · shadcn/ui · React Router v6 · TanStack Query v5 · Zustand v4 · Axios · React Hook Form · Zod

---

## Folder Structure

```
src/
├── api/                    # API service layer (one file per endpoint group)
│   ├── client.ts           # Axios instance — 320s timeout, error interceptor
│   ├── chat.api.ts         # POST /api/chat
│   ├── tools.api.ts        # GET /api/tools
│   ├── prompts.api.ts      # GET /api/prompts + POST /api/prompts/execute
│   ├── resources.api.ts    # GET /api/resources + GET /api/resources/read
│   └── health.api.ts       # GET /
│
├── components/
│   ├── ui/                 # shadcn/ui auto-generated primitives
│   ├── chat/               # Chat-specific components
│   │   ├── ChatInput.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── ChatThread.tsx
│   │   ├── ToolCallsAccordion.tsx
│   │   └── LoadingMessage.tsx
│   ├── workflows/          # Workflow form components
│   │   ├── SummarizePaperForm.tsx
│   │   ├── ComparePapersForm.tsx
│   │   ├── FindSummarizeForm.tsx
│   │   └── WorkflowResult.tsx
│   ├── library/            # Paper library components
│   │   ├── TopicCard.tsx
│   │   ├── PaperCard.tsx
│   │   └── LibraryGrid.tsx
│   ├── capabilities/       # Capabilities display components
│   │   ├── ToolCard.tsx
│   │   ├── PromptCard.tsx
│   │   └── ResourceCard.tsx
│   ├── layout/             # App frame
│   │   ├── AppLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── BackendStatusBanner.tsx
│   └── shared/             # Generic reusable components
│       ├── MarkdownRenderer.tsx
│       ├── ElapsedTimer.tsx
│       ├── ErrorDisplay.tsx
│       └── EmptyState.tsx
│
├── pages/                  # Route-level page components
│   ├── ChatPage.tsx         # /
│   ├── WorkflowsPage.tsx    # /workflows
│   ├── LibraryPage.tsx      # /library
│   ├── CapabilitiesPage.tsx # /capabilities
│   └── ServiceErrorPage.tsx # Full-page 503 fallback
│
├── store/                  # Zustand client state stores
│   ├── app.store.ts         # backendOnline, sidebarOpen
│   ├── chat.store.ts        # chatHistory[], isChatLoading, chatError
│   └── workflow.store.ts    # activeTab, currentResult, isLoading
│
├── hooks/                  # Custom React hooks
│   ├── useBackendHealth.ts  # Polls GET / on startup
│   ├── useChat.ts           # useMutation → handleQueryInput
│   ├── useWorkflow.ts       # useMutation → promptsApi.execute
│   ├── useLibrary.ts        # useQuery → resourcesApi.readTopicList/Papers
│   └── useCapabilities.ts  # useQuery → tools, prompts, resources
│
├── utils/
│   ├── queryRouter.ts       # Smart prefix routing: @, /, /prompts, @folders
│   ├── formatters.ts        # Topic names, dates, authors, IDs, elapsed time
│   └── errorParser.ts       # API error normalization + type guards
│
├── types/
│   └── api.types.ts         # All TypeScript interfaces (API, state, errors)
│
├── constants/
│   └── index.ts             # Routes, loading messages, prompt names, nav items
│
├── lib/
│   └── utils.ts             # cn() helper (clsx + tailwind-merge)
│
├── App.tsx                  # Router + QueryClientProvider setup
├── main.tsx                 # React DOM root
└── index.css               # Tailwind base + CSS variables (light/dark)
```

---

## Pages & Routing

| Route | Component | Primary APIs |
|-------|-----------|-------------|
| `/` | `ChatPage` | `POST /api/chat` (via queryRouter) |
| `/workflows` | `WorkflowsPage` | `POST /api/prompts/execute` |
| `/library` | `LibraryPage` | `GET /api/resources/read` |
| `/capabilities` | `CapabilitiesPage` | `GET /api/tools`, `/api/prompts`, `/api/resources` |
| `/service-error` | `ServiceErrorPage` | `GET /` (retry) |

---

## State Management

### Zustand Stores (client state — persists across queries)

| Store | State |
|-------|-------|
| `appStore` | `backendOnline`, `sidebarOpen` |
| `chatStore` | `chatHistory[]`, `isChatLoading`, `chatError` |
| `workflowStore` | `activeTab`, `currentResult`, `isLoading`, `error` |

### TanStack Query (server cache — auto-managed)

| Query Key | Source | Stale Time |
|-----------|--------|-----------|
| `['tools']` | `GET /api/tools` | 5 min |
| `['prompts']` | `GET /api/prompts` | 5 min |
| `['resources']` | `GET /api/resources` | 5 min |
| `['library-topics']` | `GET /api/resources/read?uri=papers://list` | 5 min |
| `['library', topic]` | `GET /api/resources/read?uri=papers://{topic}/info` | 5 min |

---

## API Layer Design

All API calls go through `src/api/client.ts` — an Axios instance with:
- **Base URL:** `VITE_API_BASE_URL` env var (default: `http://127.0.0.1:8000`)
- **Timeout:** 320,000ms (320s — slightly above backend's 300s max)
- **Interceptor:** Normalizes errors into `NormalizedError` with `userMessage`, `isTimeout`, `isServiceUnavailable`, `statusCode`

```
User action
  → hook (useChat / useWorkflow)
    → util (queryRouter / promptsApi)
      → api service (chat.api / prompts.api)
        → apiClient (Axios)
          → FastAPI Backend
```

---

## Smart Query Router

The chat input supports prefix commands routed to different endpoints:

| User types | Endpoint | Response type |
|-----------|----------|---------------|
| `@folders` | `GET /api/resources` | Resource list |
| `@<topic>` | `GET /api/resources/read?uri=papers://<topic>` | Paper data |
| `/prompts` | `GET /api/prompts` | Prompts list |
| `/<name> key=val` | `POST /api/prompts/execute` | Prompt result |
| anything else | `POST /api/chat` | Chat response |

---

## Error Handling Matrix

| HTTP Status | Handler | UI Behavior |
|-------------|---------|-------------|
| 422 | Form validation | Inline field errors |
| 404 | Toast notification | Short error message |
| 408 | Toast + tip | Timeout message with backend tip text |
| 500 | Toast notification | Generic "try again" message |
| 503 | Redirect | Full-page `ServiceErrorPage` |
| 200 (LLM error) | Inline check | "AI not configured" message in chat |

---

## Key Design Decisions

1. **320s Axios timeout** — lets the backend's 300s timeout govern; our client adds 20s buffer to catch the 408
2. **JSON.parse(content)** — `GET /api/resources/read` always returns `content` as a JSON string; all resource API functions parse this automatically
3. **Optimistic chat messages** — user message and loading placeholder are added to store immediately; real response replaces the loading state
4. **Zustand + TanStack Query** — Zustand for mutable client state (chat history, sidebar), TanStack Query for server cache (tools, papers)
5. **No auth layer** — backend has fully open CORS; no tokens or interceptors for auth needed currently
