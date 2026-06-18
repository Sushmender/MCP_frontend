import { useQuery } from '@tanstack/react-query';
import { resourcesApi } from '@/api/resources.api';

/** Fetches and caches the topic list (papers://list). */
export function useTopicList() {
  return useQuery({
    queryKey: ['library-topics'],
    queryFn: () => resourcesApi.readTopicList(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/** Fetches and caches all papers for a specific topic. */
export function useTopicPapers(topic: string | null) {
  return useQuery({
    queryKey: ['library', topic],
    queryFn: () => resourcesApi.readTopicPapers(topic!),
    enabled: !!topic,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
