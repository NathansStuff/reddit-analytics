'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  score: number;
  content: string;
  url: string;
  createdAt: number;
  numComments: number;
}

type SortKey = 'title' | 'score' | 'numComments' | 'createdAt';

export default function TopPosts({ subredditName }: { subredditName: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/subreddits/${subredditName}/posts`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError('Error fetching posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [subredditName]);

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortKey === 'title') {
      return sortDirection === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  if (isLoading) {
    return (
      <div className='text-center py-8 text-gray-600'>Loading posts...</div>
    );
  }

  if (error) {
    return <div className='text-red-500 text-center py-8'>{error}</div>;
  }

  return (
    <div>
      <h2 className='text-2xl font-semibold mb-6 text-gray-800'>
        Top Posts for r/{subredditName}
      </h2>
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='bg-gray-100'>
              <th
                className='p-3 text-left cursor-pointer'
                onClick={() => toggleSort('title')}
              >
                <div className='flex items-center'>
                  Title
                  {sortKey === 'title' &&
                    (sortDirection === 'asc' ? (
                      <ArrowUp
                        size={16}
                        className='ml-1'
                      />
                    ) : (
                      <ArrowDown
                        size={16}
                        className='ml-1'
                      />
                    ))}
                </div>
              </th>
              <th
                className='p-3 text-left cursor-pointer'
                onClick={() => toggleSort('score')}
              >
                <div className='flex items-center'>
                  Score
                  {sortKey === 'score' &&
                    (sortDirection === 'asc' ? (
                      <ArrowUp
                        size={16}
                        className='ml-1'
                      />
                    ) : (
                      <ArrowDown
                        size={16}
                        className='ml-1'
                      />
                    ))}
                </div>
              </th>
              <th
                className='p-3 text-left cursor-pointer'
                onClick={() => toggleSort('numComments')}
              >
                <div className='flex items-center'>
                  Comments
                  {sortKey === 'numComments' &&
                    (sortDirection === 'asc' ? (
                      <ArrowUp
                        size={16}
                        className='ml-1'
                      />
                    ) : (
                      <ArrowDown
                        size={16}
                        className='ml-1'
                      />
                    ))}
                </div>
              </th>
              <th
                className='p-3 text-left cursor-pointer'
                onClick={() => toggleSort('createdAt')}
              >
                <div className='flex items-center'>
                  Posted
                  {sortKey === 'createdAt' &&
                    (sortDirection === 'asc' ? (
                      <ArrowUp
                        size={16}
                        className='ml-1'
                      />
                    ) : (
                      <ArrowDown
                        size={16}
                        className='ml-1'
                      />
                    ))}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPosts.map(post => (
              <tr
                key={post.id}
                className='border-b hover:bg-gray-50'
              >
                <td className='p-3'>
                  <a
                    href={post.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-indigo-600 hover:underline'
                  >
                    {post.title}
                  </a>
                </td>
                <td className='p-3'>{post.score}</td>
                <td className='p-3'>{post.numComments}</td>
                <td className='p-3'>
                  {formatDistanceToNow(post.createdAt)} ago
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
