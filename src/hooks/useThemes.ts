import { useQuery } from '@tanstack/react-query';

async function fetchThemes(subredditName: string) {
  const response = await fetch(`/api/subreddits/${subredditName}/analyze`);
  if (!response.ok) {
    throw new Error('Failed to fetch themes');
  }

  const initialCategories: any[] = [
    {
      name: 'Solution Requests',
      key: 'solutionRequests',
      description: 'Posts where people are seeking solutions for problems',
      posts: [],
    },
    {
      name: 'Pain and Anger',
      key: 'painAndAnger',
      description: 'Posts where people are expressing their pain and anger',
      posts: [],
    },
    {
      name: 'Advice Requests',
      key: 'adviceRequests',
      description: 'Posts where people are seeking advice',
      posts: [],
    },
    {
      name: 'Money Talk',
      key: 'moneyTalk',
      description: 'Posts where people are talking about spending money',
      posts: [],
    },
  ];

  const responseData = await response.json();
  const categorizedPosts = categorizePosts(responseData, initialCategories);

  return categorizedPosts;
}

const categorizePosts = (posts: any[], categories: any[]): any[] => {
  return categories.map(category => ({
    ...category,
    posts: posts.filter(post => post.analysis[category.key]),
  }));
};

export function useThemes(subredditName: string) {
  return useQuery({
    queryKey: ['themes', subredditName],
    queryFn: () => fetchThemes(subredditName),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
