import { chatApi } from '@/api/chat.api';
import { promptsApi } from '@/api/prompts.api';
import { resourcesApi } from '@/api/resources.api';
import type { QueryResult } from '@/types/api.types';

/**
 * Smart query router — inspects raw user input and routes to the correct API.
 *
 * Prefix rules (checked in order):
 *  "@folders"           → GET /api/resources       (list all resource folders)
 *  "@<topic>"           → GET /api/resources/read   (read papers for topic)
 *  "/prompts"           → GET /api/prompts          (list all available prompts)
 *  "/<name> [key=val]"  → POST /api/prompts/execute (execute a named prompt)
 *  anything else        → POST /api/chat            (normal AI chat)
 */
export async function handleQueryInput(raw: string): Promise<QueryResult> {
  const query = raw.trim();

  // ── @folders → list all resource folders ─────────────────────────────────
  if (query === '@folders') {
    const res = await resourcesApi.list();
    return { type: 'resources_list', data: res.data };
  }

  // ── @<topic> → read papers for that topic ────────────────────────────────
  if (query.startsWith('@')) {
    const topic = query.slice(1).trim(); // strip '@'
    const uri = `papers://${topic}`;
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

  // ── default → normal AI chat ──────────────────────────────────────────────
  const res = await chatApi.sendMessage(query);
  return { type: 'chat', data: res.data };
}
