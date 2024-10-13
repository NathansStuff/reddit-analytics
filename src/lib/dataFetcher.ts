import Snoowrap from 'snoowrap';

const reddit = new Snoowrap({
  userAgent: 'web:MyRedditApp:1.0 (by /u/YourUsername)',
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  refreshToken: process.env.REDDIT_REFRESH_TOKEN,
});

export async function fetchRedditPosts(subredditName: string) {
  const subreddit = reddit.getSubreddit(subredditName);
  const posts = await subreddit.getNew({ limit: 100 });

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  return posts
    .filter((post: Snoowrap.Submission) => new Date(post.created_utc * 1000) > twentyFourHoursAgo)
    .map((post: Snoowrap.Submission) => ({
      subredditName,
      id: post.id,
      title: post.title,
      content: post.selftext,
      url: post.url,
      score: post.score,
      numComments: post.num_comments,
      createdAt: new Date(post.created_utc * 1000),
    }));
}
