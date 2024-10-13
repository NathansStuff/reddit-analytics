import SubredditList from '@/components/SubredditList'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-indigo-800 mb-8 tracking-tight">
          Reddit Analytics Platform
        </h1>
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-10">
            <SubredditList />
          </div>
        </div>
      </div>
    </main>
  )
}