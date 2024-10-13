'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface AddSubredditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddSubredditModal({ isOpen, onClose }: AddSubredditModalProps) {
  const [subredditUrl, setSubredditUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/subreddits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: subredditUrl }),
      });

      if (response.ok) {
        // Subreddit added successfully
        onClose();
        setSubredditUrl('');
        // You might want to refresh the subreddit list here
      } else {
        // Handle error
        console.error('Failed to add subreddit');
      }
    } catch (error) {
      console.error('Error adding subreddit:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Subreddit</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={subredditUrl}
            onChange={(e) => setSubredditUrl(e.target.value)}
            placeholder="Enter subreddit URL"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Add Subreddit
          </button>
        </form>
      </div>
    </div>
  );
}
