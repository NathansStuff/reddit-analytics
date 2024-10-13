import Link from 'next/link';
import { Users } from 'lucide-react';

interface SubredditCardProps {
  subreddit: {
    id: string;
    name: string;
    description: string;
    subscribers: number;
  };
}

export default function SubredditCard({ subreddit }: SubredditCardProps) {
  return (
    <Link
      href={`/subreddits/${subreddit.name}`}
      className='block'
    >
      <div className='bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300'>
        <div className='p-6'>
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            {subreddit.name}
          </h2>
          <p className='text-gray-600 mb-4 line-clamp-2'>
            {subreddit.description}
          </p>
          <div className='flex items-center text-sm text-gray-500'>
            <Users
              size={16}
              className='mr-1'
            />
            <span>{subreddit.subscribers.toLocaleString()} subscribers</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
