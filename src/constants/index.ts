// ─────────────────────────────────────────────────────────────────────────────
// Route paths
// ─────────────────────────────────────────────────────────────────────────────

export const ROUTES = {
  CHAT: '/',
  WORKFLOWS: '/workflows',
  LIBRARY: '/library',
  CAPABILITIES: '/capabilities',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Loading messages shown during API calls
// ─────────────────────────────────────────────────────────────────────────────

export const LOADING_MESSAGES = {
  chat: 'Thinking… the AI is searching and analyzing papers',
  summarize: 'Summarizing paper…',
  compare: 'Comparing papers… this may take a few minutes',
  find_and_summarize: 'Searching arXiv and summarizing papers…',
  fetch: 'Fetching URL and reading content…',
  library: 'Loading papers…',
  capabilities: 'Loading capabilities…',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Prompt names (must match backend)
// ─────────────────────────────────────────────────────────────────────────────

export const PROMPT_NAMES = {
  SUMMARIZE: 'summarize_paper',
  COMPARE: 'compare_papers',
  FIND_AND_SUMMARIZE: 'find_and_summarize',
  FETCH: 'fetch_url',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Smart query prefix constants
// ─────────────────────────────────────────────────────────────────────────────

export const QUERY_PREFIXES = {
  FOLDERS: '@folders',
  PROMPTS_LIST: '/prompts',
  TOPIC: '@',
  PROMPT_EXECUTE: '/',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar nav items
// ─────────────────────────────────────────────────────────────────────────────

export const NAV_ITEMS = [
  {
    label: 'Chat',
    path: ROUTES.CHAT,
    icon: 'MessageSquare',
    description: 'Free-form AI research queries',
  },
  {
    label: 'Workflows',
    path: ROUTES.WORKFLOWS,
    icon: 'Zap',
    description: 'Guided research templates',
  },
  {
    label: 'Library',
    path: ROUTES.LIBRARY,
    icon: 'BookOpen',
    description: 'Browse cached papers',
  },
  {
    label: 'Capabilities',
    path: ROUTES.CAPABILITIES,
    icon: 'Cpu',
    description: 'Tools, prompts, and resources',
  },
] as const;
