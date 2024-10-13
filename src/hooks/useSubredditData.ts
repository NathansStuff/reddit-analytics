import { useQuery } from '@tanstack/react-query';

async function fetchSubredditData(name: string) {
  const res = await fetch(`/api/subreddits/${name}`);
  if (!res.ok) {
    throw new Error('Failed to fetch subreddit data');
  }
  return res.json();
}

export function useSubredditData(name: string) {
  return useQuery({
    queryKey: ['subreddit', name],
    queryFn: () => fetchSubredditData(name),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
