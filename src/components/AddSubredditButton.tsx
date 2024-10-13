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
        className="flex items-center justify-center bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors"
      >
        <Plus size={24} />
        <span className="ml-2">Add Subreddit</span>
      </button>
      <AddSubredditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
