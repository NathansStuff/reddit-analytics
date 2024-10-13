'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import AddSubredditModal from './AddSubredditModal';

export default function AddSubredditButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200'
      >
        <Plus
          size={20}
          className='mr-2'
        />
        Add Subreddit
      </button>
      <AddSubredditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
