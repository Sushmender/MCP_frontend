# MCP Research Frontend

A modern **React + TypeScript** frontend for the MCP (Model Context Protocol) Research Assistant — a tool for exploring, summarising, and comparing academic research papers via an AI-powered chat interface.

---

## ✨ Features

- 💬 **AI Chat** — Converse with the research assistant using natural language
- 🔬 **Smart Query Router** — Prefix commands (`@topic`, `/prompts`, `/summarize`) route to the right backend endpoint automatically
- 📚 **Paper Library** — Browse and explore all indexed research topics and papers
- ⚡ **Workflows** — Run structured prompts to summarise a paper, compare papers, or find & summarise by topic
- 🛠️ **Capabilities Explorer** — Inspect available MCP tools, prompts, and resources
- 🌗 **Dark / Light theme** — CSS variable–based theming out of the box

---

## 🗂️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | TailwindCSS + shadcn/ui |
| Routing | React Router v6 |
| Server State | TanStack Query v5 |
| Client State | Zustand v4 |
| HTTP Client | Axios (320s timeout) |
| Forms | React Hook Form + Zod |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- The **MCP Backend** running locally (see step 1 below)

---

### Step 1 — Clone & Run the Backend First ⚠️

> **Important:** The frontend depends on the FastAPI backend. You must start the backend **before** running `npm run dev`.

```bash
# Clone the backend repository
git clone https://github.com/Sushmender/MCP_1.git
cd MCP_1
```

Follow the backend's own README to install dependencies and set up your `.env`, then start the server:

```bash
# Inside the MCP_1 directory
uvicorn app.main:app --reload
```

The backend will be available at `http://127.0.0.1:8000`. Keep this terminal running.

---

### Step 2 — Clone This Repository

```bash
git clone https://github.com/Sushmender/MCP_frontend.git
cd MCP_frontend
```

---

### Step 3 — Install Dependencies

```bash
npm install
```

---

### Step 4 — Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env.local
```

Open `.env.local` and set the backend URL (default works if backend is on localhost):

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

---

### Step 5 — Start the Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:5173** (or the next available port).

---

## 📁 Project Structure

```
src/
├── api/              # Axios API service layer (one file per endpoint group)
├── components/
│   ├── ui/           # shadcn/ui primitives
│   ├── chat/         # Chat thread, messages, tool call accordion
│   ├── workflows/    # Workflow form components
│   ├── library/      # Paper library cards & grid
│   ├── capabilities/ # Tools / Prompts / Resources display
│   ├── layout/       # AppLayout, Sidebar, Header, Backend status banner
│   └── shared/       # MarkdownRenderer, ElapsedTimer, ErrorDisplay, EmptyState
├── pages/            # Route-level page components
├── store/            # Zustand stores (app, chat, workflow state)
├── hooks/            # Custom React hooks (useChat, useWorkflow, useLibrary, …)
├── utils/            # queryRouter, formatters, errorParser
├── types/            # TypeScript interfaces
└── constants/        # Routes, nav items, prompt names
```

---

## 🔀 Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Chat | AI chat with smart prefix routing |
| `/workflows` | Workflows | Run structured research workflows |
| `/library` | Library | Browse indexed topics and papers |
| `/capabilities` | Capabilities | View available tools, prompts & resources |
| `/service-error` | Service Error | Full-page fallback when backend is offline |

---

## 💡 Smart Query Router (Chat Prefixes)

| Prefix | What it does |
|---|---|
| `@folders` | Lists all available resource folders |
| `@<topic>` | Fetches paper data for that topic |
| `/prompts` | Lists all available prompts |
| `/<name> key=val` | Executes a named prompt with arguments |
| *(anything else)* | Sends a free-form chat message to the AI |

---

## 🛠️ Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production (TypeScript check + Vite build)
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

---

## 🔧 Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://127.0.0.1:8000` | URL of the FastAPI backend |

---

## 🤝 Related Repositories

| Repository | Purpose |
|---|---|
| [MCP_1 (Backend)](https://github.com/Sushmender/MCP_1.git) | FastAPI backend — must be running before starting the frontend |
| [MCP_frontend (this repo)](https://github.com/Sushmender/MCP_frontend) | React + TypeScript frontend |

---

## 📄 Architecture Reference

For a deep dive into the frontend architecture, see [FRONTEND-ARCHITECTURE.md](./FRONTEND-ARCHITECTURE.md).

---

> **Tip:** If the frontend shows a "Service Unavailable" banner or redirects to `/service-error`, it means the backend is not reachable. Make sure `uvicorn app.main:app --reload` is running in the `MCP_1` directory.
