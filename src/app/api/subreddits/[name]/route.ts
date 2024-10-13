import { NextResponse } from 'next/server';

const mockSubreddits = [
  { id: '1', name: 'ollama', description: 'Discussions about Ollama', subscribers: 10000 },
  { id: '2', name: 'openai', description: 'All things OpenAI', subscribers: 50000 },
];

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  const subreddit = mockSubreddits.find(s => s.name.toLowerCase() === params.name.toLowerCase());

  if (subreddit) {
    return NextResponse.json(subreddit);
  } else {
    return new NextResponse('Subreddit not found', { status: 404 });
  }
}
