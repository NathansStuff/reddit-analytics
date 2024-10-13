'use client';

import { useState } from 'react';
import TopPosts from './TopPosts';
import Themes from './Themes';

interface SubredditTabsProps {
  subredditName: string;
}

export default function SubredditTabs({ subredditName }: SubredditTabsProps) {
  const [activeTab, setActiveTab] = useState('top-posts');

  return (
    <div>
      <div className="flex border-b mb-4">
        <button
          className={`py-2 px-4 ${
            activeTab === 'top-posts'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('top-posts')}
        >
          Top Posts
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === 'themes'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('themes')}
        >
          Themes
        </button>
      </div>
      <div>
        {activeTab === 'top-posts' ? (
          <TopPosts subredditName={subredditName} />
        ) : (
          <Themes subredditName={subredditName} />
        )}
      </div>
    </div>
  );
}
