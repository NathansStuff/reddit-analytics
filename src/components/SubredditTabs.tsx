'use client'

import { useState } from 'react'
import TopPosts from './TopPosts'
import Themes from './Themes'

interface SubredditTabsProps {
  subredditName: string
}

export default function SubredditTabs({ subredditName }: SubredditTabsProps) {
  const [activeTab, setActiveTab] = useState('top-posts')

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex border-b">
        <button
          className={`py-4 px-6 text-sm font-medium focus:outline-none ${
            activeTab === 'top-posts'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('top-posts')}
        >
          Top Posts
        </button>
        <button
          className={`py-4 px-6 text-sm font-medium focus:outline-none ${
            activeTab === 'themes'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('themes')}
        >
          Themes
        </button>
      </div>
      <div className="p-6">
        {activeTab === 'top-posts' ? (
          <TopPosts subredditName={subredditName} />
        ) : (
          <Themes subredditName={subredditName} />
        )}
      </div>
    </div>
  )
}