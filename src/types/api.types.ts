// ─────────────────────────────────────────────────────────────────────────────
// Chat Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface ChatResponse {
  response: string;
  tool_calls: ToolCall[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolCalls?: ToolCall[];
  timestamp: number;
  isLoading?: boolean;
  /** Type of result for smart query routing */
  resultType?: 'chat' | 'resources_list' | 'resource' | 'prompts_list' | 'prompt_result';
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ToolProperty {
  type: string;
  description?: string;
  enum?: string[];
  items?: { type: string };
}

export interface ToolInputSchema {
  type: string;
  properties: Record<string, ToolProperty>;
  required?: string[];
}

export interface Tool {
  name: string;
  description: string;
  input_schema: ToolInputSchema;
}

export interface ToolsResponse {
  tools: Tool[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Prompt Types
// ─────────────────────────────────────────────────────────────────────────────

export interface PromptArgument {
  name: string;
  description: string;
  required: boolean;
}

export interface Prompt {
  name: string;
  description: string;
  arguments: PromptArgument[];
}

export interface PromptsResponse {
  prompts: Prompt[];
}

export interface ExecutePromptRequest {
  prompt_name: string;
  arguments: Record<string, unknown>;
}

export interface ExecutePromptResponse {
  prompt_name: string;
  response: string;
  tool_calls: ToolCall[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Resource Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ResourceInfo {
  uri: string;
  name: string;
  description: string;
  mime_type: string;
}

export interface ResourceTemplate {
  uri_template: string;
  name: string;
  description: string;
  mime_type: string;
}

export interface ResourcesResponse {
  resources: ResourceInfo[];
  resource_templates: ResourceTemplate[];
}

export interface ReadResourceResponse {
  uri: string;
  /** JSON-encoded string — always JSON.parse() this! */
  content: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Paper / Library Types
// ─────────────────────────────────────────────────────────────────────────────

export interface Paper {
  title: string;
  authors: string[];
  summary: string;
  pdf_url: string;
  published: string;
}

/** Map of paper_id → Paper metadata */
export type PaperMap = Record<string, Paper>;

/** Map of topic → list of paper IDs */
export type TopicMap = Record<string, string[]>;

// ─────────────────────────────────────────────────────────────────────────────
// Health Types
// ─────────────────────────────────────────────────────────────────────────────

export interface HealthResponse {
  status: string;
  service: string;
  documentation: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Error Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ValidationErrorDetail {
  type: string;
  loc: (string | number)[];
  msg: string;
  input?: unknown;
}

export interface ApiErrorResponse {
  detail: string | ValidationErrorDetail[];
}

export interface NormalizedError {
  statusCode: number;
  userMessage: string;
  detail: string | ValidationErrorDetail[];
  isTimeout: boolean;
  isServiceUnavailable: boolean;
  isValidation: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Smart Query Router Types
// ─────────────────────────────────────────────────────────────────────────────

export type QueryResultType =
  | 'chat'
  | 'resources_list'
  | 'resource'
  | 'prompts_list'
  | 'prompt_result';

export interface QueryResult {
  type: QueryResultType;
  data: ChatResponse | ResourcesResponse | ReadResourceResponse | PromptsResponse | ExecutePromptResponse;
  uri?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Workflow Types
// ─────────────────────────────────────────────────────────────────────────────

export type WorkflowType = 'summarize' | 'compare' | 'find_and_summarize';

export interface WorkflowResult {
  promptName: string;
  response: string;
  toolCalls: ToolCall[];
}
