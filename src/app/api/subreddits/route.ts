import { NextResponse } from 'next/server';

let mockSubreddits = [
  { id: '1', name: 'ollama', description: 'Discussions about Ollama', subscribers: 10000 },
  { id: '2', name: 'openai', description: 'All things OpenAI', subscribers: 50000 },
];

export async function GET() {
  return NextResponse.json(mockSubreddits);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { url } = body;

  // In a real application, you would parse the URL, fetch subreddit info, and save to database
  const newSubreddit = {
    id: String(mockSubreddits.length + 1),
    name: url.split('/').pop() || 'unknown',
    description: 'New subreddit added',
    subscribers: 0,
  };

  mockSubreddits.push(newSubreddit);

  return NextResponse.json(newSubreddit, { status: 201 });
}
