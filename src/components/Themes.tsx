'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { X, Plus } from 'lucide-react';

interface AnalyzedPost {
  id: string;
  title: string;
  content: string;
  url: string;
  createdAt: number;
  analysis: {
    [key: string]: boolean;
  };
}

interface Category {
  name: string;
  description: string;
  posts: AnalyzedPost[];
}

export default function Themes({ subredditName }: { subredditName: string }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');

  useEffect(() => {
    fetchAnalyzedPosts();
  }, [subredditName]);

  const fetchAnalyzedPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/subreddits/${subredditName}/analyze`);
      if (!response.ok) {
        throw new Error('Failed to fetch analyzed posts');
      }
      const data: AnalyzedPost[] = await response.json();

      const initialCategories: Category[] = [
        { name: 'Solution Requests', description: 'Posts where people are seeking solutions for problems', posts: [] },
        { name: 'Pain and Anger', description: 'Posts where people are expressing their pain and anger', posts: [] },
        { name: 'Advice Requests', description: 'Posts where people are seeking advice', posts: [] },
        { name: 'Money Talk', description: 'Posts where people are talking about spending money', posts: [] },
      ];

      const categorizedPosts = categorizePosts(data, initialCategories);
      setCategories(categorizedPosts);
    } catch (err) {
      setError('Error fetching analyzed posts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const categorizePosts = (posts: AnalyzedPost[], categories: Category[]): Category[] => {
    return categories.map(category => ({
      ...category,
      posts: posts.filter(post => post.analysis[category.name.toLowerCase().replace(/\s+/g, '')])
    }));
  };

  const handleAddCategory = async () => {
    if (!newCategoryName || !newCategoryDescription) return;

    const newCategory: Category = {
      name: newCategoryName,
      description: newCategoryDescription,
      posts: [],
    };

    try {
      // Here you would typically make an API call to add the new category
      // For now, we'll just update the local state
      setCategories([...categories, newCategory]);

      // Trigger a re-analysis of posts with the new category
      await fetchAnalyzedPosts();

      setNewCategoryName('');
      setNewCategoryDescription('');
      setIsAddingCategory(false);
    } catch (err) {
      setError('Failed to add new category. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Analyzing posts...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Themes for r/{subredditName}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {categories.map((category) => (
          <div
            key={category.name}
            className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedCategory(category)}
          >
            <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{category.description}</p>
            <p className="text-sm font-medium text-blue-600">{category.posts.length} posts</p>
          </div>
        ))}
        <div
          className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow flex items-center justify-center"
          onClick={() => setIsAddingCategory(true)}
        >
          <Plus size={24} className="text-blue-500 mr-2" />
          <span className="text-blue-500 font-medium">Add New Category</span>
        </div>
      </div>
      {selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold">{selectedCategory.name} Posts</h3>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            {selectedCategory.posts.map((post) => (
              <div key={post.id} className="mb-6 pb-6 border-b last:border-b-0">
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  <h4 className="text-lg font-medium mb-2">{post.title}</h4>
                </a>
                <p className="text-sm text-gray-600 mb-2">
                  {post.content.length > 200
                    ? `${post.content.substring(0, 200)}...`
                    : post.content}
                </p>
                <p className="text-xs text-gray-500">
                  Posted {formatDistanceToNow(post.createdAt)} ago
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {isAddingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-semibold mb-4">Add New Category</h3>
            <input
              type="text"
              placeholder="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
            />
            <textarea
              placeholder="Category Description"
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
              rows={3}
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsAddingCategory(false)}
                className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
