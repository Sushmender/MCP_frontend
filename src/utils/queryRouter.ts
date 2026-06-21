import { chatApi } from '@/api/chat.api';
import { promptsApi } from '@/api/prompts.api';
import { resourcesApi } from '@/api/resources.api';
import type { QueryResult } from '@/types/api.types';

/**
 * MCP prompt names that are registered on the backend.
 * Used to distinguish real prompt commands from unknown slash-commands
 * (e.g. /fetch) which should be forwarded to the LLM as chat instead.
 */
const KNOWN_PROMPT_COMMANDS = new Set([
  'summarize_paper',
  'compare_papers',
  'find_and_summarize',
]);

/**
 * Smart query router — inspects raw user input and routes to the correct API.
 *
 * Prefix rules (checked in order):
 *  "@folders"              → GET /api/resources       (list all resource folders)
 *  "@<topic>"              → GET /api/resources/read   (read papers for topic)
 *  "/prompts"              → GET /api/prompts          (list all available prompts)
 *  "/<known> [key=val]"    → POST /api/prompts/execute (execute a named MCP prompt)
 *  "/fetch <url>"          → POST /api/chat            (forward to LLM as chat)
 *  "/<unknown> …"          → POST /api/chat            (fall back to LLM as chat)
 *  anything else           → POST /api/chat            (normal AI chat)
 */
export async function handleQueryInput(raw: string): Promise<QueryResult> {
  const query = raw.trim();

  // ── @folders → list all stored topic folders ─────────────────────────────
  // Reads papers://list which returns { topic: [paper_ids…] } JSON.
  if (query === '@folders') {
    const res = await resourcesApi.read('papers://list');
    return { type: 'folders_list', data: res.data };
  }

  // ── @<topic> → read papers for that topic ────────────────────────────────
  // The MCP resource template is papers://{topic}/info — must include /info.
  // Spaces are normalized to underscores to match how topics are stored on disk
  // (e.g. "@robotic intelligence" → papers://robotic_intelligence/info).
  if (query.startsWith('@')) {
    const topic = query.slice(1).trim().toLowerCase().replace(/\s+/g, '_');
    const uri = `papers://${topic}/info`;
    const res = await resourcesApi.read(uri);
    return { type: 'resource', data: res.data, uri };
  }

  // ── /prompts → list available prompts ────────────────────────────────────
  if (query === '/prompts') {
    const res = await promptsApi.list();
    return { type: 'prompts_list', data: res.data };
  }

  // ── /<name> [key=val …] → execute a named prompt ─────────────────────────
  if (query.startsWith('/')) {
    const parts = query.split(/\s+/);
    const promptName = parts[0].slice(1); // strip '/'

    // Only route to the prompts API if this is a known MCP prompt.
    // Unknown slash-commands (e.g. /fetch <url>) fall through to chat so
    // the LLM can handle them gracefully instead of causing a 404/500.
    if (KNOWN_PROMPT_COMMANDS.has(promptName)) {
      const args: Record<string, string> = {};
      for (const part of parts.slice(1)) {
        const eqIdx = part.indexOf('=');
        if (eqIdx > 0) {
          const key = part.slice(0, eqIdx);
          const val = part.slice(eqIdx + 1);
          args[key] = val;
        }
      }
      const res = await promptsApi.execute(promptName, args);
      return { type: 'prompt_result', data: res.data };
    }

    // Unknown slash-command → forward the full input to the LLM as a chat
    // message so it can respond helpfully (e.g. explain what /fetch does).
    const res = await chatApi.sendMessage(query);
    return { type: 'chat', data: res.data };
  }

  // ── default → normal AI chat ──────────────────────────────────────────────
  const res = await chatApi.sendMessage(query);
  return { type: 'chat', data: res.data };
}
