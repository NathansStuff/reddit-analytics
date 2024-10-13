'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface AddSubredditModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddSubredditModal({ isOpen, onClose }: AddSubredditModalProps) {
  const [subredditUrl, setSubredditUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/subreddits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: subredditUrl }),
      })

      if (response.ok) {
        onClose()
        setSubredditUrl('')
      } else {
        console.error('Failed to add subreddit')
      }
    } catch (error) {
      console.error('Error adding subreddit:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Add New Subreddit</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="subredditUrl" className="block text-sm font-medium text-gray-700">
              Subreddit URL
            </label>
            <input
              type="text"
              id="subredditUrl"
              value={subredditUrl}
              onChange={(e) => setSubredditUrl(e.target.value)}
              placeholder="Enter subreddit URL"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Subreddit
          </button>
        </form>
      </div>
    </div>
  )
}