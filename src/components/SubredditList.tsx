import SubredditCard from './SubredditCard'
import AddSubredditButton from './AddSubredditButton'

interface Subreddit {
  id: string
  name: string
  description: string
  subscribers: number
}

async function getSubreddits(): Promise<Subreddit[]> {
  const res = await fetch('http://localhost:3000/api/subreddits', { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Failed to fetch subreddits')
  }
  return res.json()
}

export default async function SubredditList() {
  const subreddits = await getSubreddits()

  return (
    <div>
      <div className="mb-8 flex justify-end">
        <AddSubredditButton />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subreddits.map((subreddit) => (
          <SubredditCard key={subreddit.id} subreddit={subreddit} />
        ))}
      </div>
    </div>
  )
}