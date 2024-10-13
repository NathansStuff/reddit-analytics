import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import SubredditTabs from '@/components/SubredditTabs'

async function getSubredditData(name: string) {
  const res = await fetch(`http://localhost:3000/api/subreddits/${name}`, { cache: 'no-store' })
  if (!res.ok) {
    return null
  }
  return res.json()
}

export default async function SubredditPage({ params }: { params: { name: string } }) {
  const subredditData = await getSubredditData(params.name)

  if (!subredditData) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200 mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Subreddit List
        </Link>
        <h1 className="text-4xl font-extrabold text-indigo-900 mb-6">r/{subredditData.name}</h1>
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <p className="text-gray-700 mb-4 text-lg">{subredditData.description}</p>
          <p className="text-sm text-indigo-600 font-semibold">
            {subredditData.subscribers.toLocaleString()} subscribers
          </p>
        </div>
        <SubredditTabs subredditName={subredditData.name} />
      </div>
    </div>
  )
}