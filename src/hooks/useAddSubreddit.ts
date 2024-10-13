import { useMutation, useQueryClient } from '@tanstack/react-query';

async function addSubreddit(url: string) {
  const response = await fetch('/api/subreddits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  if (!response.ok) {
    throw new Error('Failed to add subreddit');
  }
  return response.json();
}

export function useAddSubreddit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addSubreddit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subreddits'] });
    },
  });
}
