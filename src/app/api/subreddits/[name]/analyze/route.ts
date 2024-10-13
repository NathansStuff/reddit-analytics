import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import Snoowrap from 'snoowrap';
import { z } from 'zod';

const openai = new OpenAI({
  baseURL: 'https://oai.helicone.ai/v1',
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    'Helicone-Auth': `Bearer ${process.env.HELICONE_API_KEY}`,
  },
});

const reddit = new Snoowrap({
  userAgent: 'MyRedditApp:1.0 (by /u/YourUsername)',
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  refreshToken: process.env.REDDIT_REFRESH_TOKEN,
});

const PostCategoryAnalysis = z.object({
  solutionRequests: z.boolean().describe("Posts where people are seeking solutions for problems"),
  painAndAnger: z.boolean().describe("Posts where people are expressing their pain and anger"),
  adviceRequests: z.boolean().describe("Posts where people are seeking advice"),
  moneyTalk: z.boolean().describe("Posts where people are talking about spending money"),
});

type PostCategoryAnalysisType = z.infer<typeof PostCategoryAnalysis>;

async function categorizePost(title: string, postContent: string): Promise<PostCategoryAnalysisType> {
  const categoryDescriptions = Object.entries(PostCategoryAnalysis.shape).map(
    ([key, value]) => `${key}: ${value.description}`
  ).join('\n');

  const prompt = `
    Analyze the following Reddit post and categorize it based on these criteria:
    ${categoryDescriptions}

    Post Title: ${title}
    Post Content: ${postContent}

    Provide a structured output with boolean values for each category in JSON format.
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-0125-preview',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant that analyzes Reddit posts and provides responses in JSON format.',
      },
      { role: 'user', content: prompt },
    ],
  });

  const responseContent = response.choices[0].message.content;
  if (responseContent) {
    const analysis = PostCategoryAnalysis.parse(JSON.parse(responseContent));
    return analysis;
  }

  throw new Error('Failed to categorize the post');
}

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    const subreddit = await reddit.getSubreddit(params.name);
    const posts = await subreddit.getNew({ limit: 10 }); // Limit to 10 posts for demo purposes

    const analyzePosts = posts.map(async (post: any) => {
      try {
        const analysis = await categorizePost(post.title, post.selftext);
        return {
          id: post.id,
          title: post.title,
          content: post.selftext,
          url: post.url,
          createdAt: post.created_utc * 1000,
          analysis,
        };
      } catch (error) {
        console.error(`Error analyzing post ${post.id}:`, error);
        return null;
      }
    });

    const analyzedPosts = await Promise.all(analyzePosts);
    const validPosts = analyzedPosts.filter((post): post is Exclude<typeof post, null> => post !== null);

    return NextResponse.json(validPosts);
  } catch (error) {
    console.error('Error analyzing subreddit posts:', error);
    return new NextResponse('Error analyzing subreddit posts', { status: 500 });
  }
}
