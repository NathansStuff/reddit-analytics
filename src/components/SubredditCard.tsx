import Link from 'next/link';

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
    <Link href={`/subreddits/${subreddit.name}`} className="block">
      <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold mb-2">{subreddit.name}</h2>
        <p className="text-gray-600 mb-4">{subreddit.description}</p>
        <p className="text-sm text-gray-500">{subreddit.subscribers.toLocaleString()} subscribers</p>
      </div>
    </Link>
  );
}
