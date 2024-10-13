import { NextResponse } from 'next/server';
import Snoowrap from 'snoowrap';

const reddit = new Snoowrap({
  userAgent: 'MyRedditApp:1.0 (by /u/YourUsername)',
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  refreshToken: process.env.REDDIT_REFRESH_TOKEN,
});

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    const subreddit = await reddit.getSubreddit(params.name);
    const posts = await subreddit.getTop({time: 'day', limit: 100});

    const recentPosts = posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      score: post.score,
      content: post.selftext,
      url: post.url,
      createdAt: post.created_utc * 1000,
      numComments: post.num_comments,
    }));

    // Sort posts by score in descending order
    recentPosts.sort((a, b) => b.score - a.score);

    return NextResponse.json(recentPosts);
  } catch (error) {
    console.error('Error fetching subreddit posts:', error);
    return new NextResponse('Error fetching subreddit posts', { status: 500 });
  }
}
