import { useQuery } from '@tanstack/react-query';

async function fetchSubredditPosts(name: string) {
  const res = await fetch(`/api/subreddits/${name}/posts`);
  if (!res.ok) {
    throw new Error('Failed to fetch subreddit data');
  }
  return res.json();
}

export function useSubredditPosts(subredditName: string) {
  return useQuery({
    queryKey: ['subredditPosts', subredditName],
    queryFn: () => fetchSubredditPosts(subredditName),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}
