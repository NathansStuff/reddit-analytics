import { NextResponse } from 'next/server';
import clientPromise, { getDatabase } from '@/lib/mongodb';
import { fetchRedditPosts } from '@/lib/dataFetcher';

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    // Ensure the MongoDB connection is established
    await clientPromise;
    const db = await getDatabase();
    const subredditName = params.name;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    let posts = await db.collection('posts').find({
      subredditName,
      createdAt: { $gte: twentyFourHoursAgo }
    }).sort({ score: -1 }).toArray();

    if (posts.length === 0) {
      // Fetch new posts from Reddit API
      const redditPosts = await fetchRedditPosts(subredditName);
      const insertResult = await db.collection('posts').insertMany(redditPosts);

      // Fetch the newly inserted posts
      posts = await db.collection('posts').find({
        _id: { $in: Object.values(insertResult.insertedIds) }
      }).toArray();
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
