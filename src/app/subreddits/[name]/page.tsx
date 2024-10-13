import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import SubredditTabs from '@/components/SubredditTabs';

async function getSubredditData(name: string) {
  // In a real application, you would fetch this data from your API
  const res = await fetch(`http://localhost:3000/api/subreddits/${name}`, { cache: 'no-store' });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export default async function SubredditPage({ params }: { params: { name: string } }) {
  const subredditData = await getSubredditData(params.name);

  if (!subredditData) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="flex items-center text-blue-500 hover:underline mb-4">
        <ArrowLeft size={20} className="mr-2" />
        Back to Subreddit List
      </Link>
      <h1 className="text-3xl font-bold mb-6">r/{subredditData.name}</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <p className="text-gray-600 mb-4">{subredditData.description}</p>
        <p className="text-sm text-gray-500">{subredditData.subscribers.toLocaleString()} subscribers</p>
      </div>
      <SubredditTabs subredditName={subredditData.name} />
    </div>
  );
}
