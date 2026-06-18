import { apiClient } from './client';
import type {
  ResourcesResponse,
  ReadResourceResponse,
  TopicMap,
  PaperMap,
} from '@/types/api.types';

export const resourcesApi = {
  /** List all static resources and URI template resources. */
  list: () => apiClient.get<ResourcesResponse>('/api/resources'),

  /**
   * Read the raw content of a specific resource by its fully resolved URI.
   * IMPORTANT: response.content is a JSON-encoded string — always JSON.parse() it.
   */
  read: (uri: string) =>
    apiClient.get<ReadResourceResponse>('/api/resources/read', {
      params: { uri },
    }),

  /**
   * Fetch and parse the topic list (papers://list).
   * Returns a map of topic → paper IDs.
   */
  readTopicList: async (): Promise<TopicMap> => {
    const res = await apiClient.get<ReadResourceResponse>('/api/resources/read', {
      params: { uri: 'papers://list' },
    });
    return JSON.parse(res.data.content) as TopicMap;
  },

  /**
   * Fetch and parse all papers for a given topic.
   * Topic names use underscores (e.g., "transformer_attention_mechanisms").
   */
  readTopicPapers: async (topic: string): Promise<PaperMap> => {
    const res = await apiClient.get<ReadResourceResponse>('/api/resources/read', {
      params: { uri: `papers://${topic}/info` },
    });
    return JSON.parse(res.data.content) as PaperMap;
  },
};
