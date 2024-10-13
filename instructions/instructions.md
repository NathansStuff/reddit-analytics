# Product Requirements Document (PRD) - Reddit Analytics Platform

## Project Overview

We are building a Reddit analytics platform that allows users to analyze different subreddits. Users can view top content, categorize posts, and gain insights into subreddit activity. The platform will be developed using Next.js 14, Shadcn UI components, Tailwind CSS, and Lucide Icons. The backend will utilize MongoDB as the database and implement user authentication with NextAuth.

## Core Functionalities

### 1. Subreddit Management

#### a. View Available Subreddits
- Users can see a list of available subreddits displayed in cards.
- Common subreddits like "ollama" and "openai" will be preloaded.
- Each subreddit card will display basic information about the subreddit.

#### b. Add New Subreddits
- Users can add new subreddits by clicking an "Add Subreddit" button.
- Clicking the button opens a modal where users can paste the subreddit URL.
- After adding a new subreddit, a new card is added to the list.

### 2. Subreddit Page

#### a. Navigation to Subreddit Page
- Clicking on a subreddit card navigates to that subreddit's dedicated page.

#### b. Tabbed Interface
- The subreddit page contains two tabs:
  - Top Posts: Displays the top posts from the subreddit.
  - Themes: Shows categorized themes based on post content.

### 3. Fetch Reddit Posts Data in "Top Posts"

#### a. Display Recent Posts
- Under the "Top Posts" tab, the platform displays Reddit posts from the past 24 hours.
- Posts include the following data:
  - Title
  - Score
  - Content
  - URL
  - Created UTC timestamp
  - Number of comments

#### b. Data Fetching
- The platform uses the Snoowrap library to fetch Reddit data.
- Posts are displayed in a table component.
- The table is sortable based on the number of scores (upvotes).

### 4. Analyze Reddit Posts Data in "Themes"

#### a. Post Categorization
- For each post, data is sent to OpenAI's API for categorization.
- Posts are categorized into predefined themes:
  - Solution Requests: Posts where users seek solutions to problems.
  - Pain and Anger: Posts expressing pain and anger.
  - Advice Requests: Posts seeking advice.
  - Money Talk: Posts discussing spending money.

#### b. Concurrent Processing
- The categorization process runs concurrently for all posts to optimize performance.

#### c. Display Categories
- The "Themes" page displays each category as a card.
- Each card includes:
  - Title
  - Description
  - Number of posts in the category

#### d. View Posts by Category
- Clicking on a category card opens a side panel.
- The side panel lists all posts belonging to that category.

### 5. Ability to Add New Theme Categories

#### a. Add Custom Categories
- Users can add new theme categories via the UI.
- After adding a new category, the analysis process is triggered to categorize posts under the new theme.

## File Structure

Below is the proposed file structure for the project:

```
.reddit-analytics
├── .env.local
├── .eslintrc.json
├── .gitignore
├── README.md
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── src
│   ├── app
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── fonts
│   │   ├── page.tsx
│   │   ├── api
│   │   │   ├── auth
│   │   │   │   └── [...nextauth]/route.ts
│   │   │   ├── subreddits
│   │   │   │   └── route.ts
│   │   │   ├── posts
│   │   │   │   └── route.ts
│   │   │   └── analysis
│   │   │       └── route.ts
│   │   ├── subreddits
│   │   │   ├── page.tsx
│   │   │   ├── add
│   │   │   │   └── page.tsx
│   │   │   └── [subreddit]
│   │   │       ├── page.tsx
│   │   │       └── themes
│   │   │           └── page.tsx
│   │   └── auth
│   │       └── signin
│   │           └── page.tsx
│   ├── components
│   │   ├── ui
│   │   ├── SubredditCard.tsx
│   │   ├── AddSubredditModal.tsx
│   │   ├── PostTable.tsx
│   │   ├── CategoryCard.tsx
│   │   └── PostsSidePanel.tsx
│   ├── lib
│   │   ├── db.ts
│   │   ├── utils.ts
│   │   ├── snoowrapClient.ts
│   │   └── openaiClient.ts
│   ├── models
│   │   ├── Subreddit.ts
│   │   ├── Post.ts
│   │   └── User.ts
│   └── types
│       └── index.ts
└── public
    └── images
```

## Documentation

### Using Snoowrap to Fetch Reddit Posts Data

The platform utilizes the Snoowrap library to interact with the Reddit API. Below is an example of how to fetch recent posts from a subreddit:

```javascript
import Snoowrap from 'snoowrap';
import dotenv from 'dotenv';

dotenv.config();

// Create a Snoowrap instance
const reddit = new Snoowrap({
  userAgent: 'web:MyRedditApp:1.0 (by /u/Prize-Bumblebee-5669)',
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  refreshToken: process.env.REDDIT_REFRESH_TOKEN,
});

interface RedditPost {
  title: string;
  content: string;
  score: number;
  numComments: number;
  date: Date;
}

async function fetchRecentOllamaPosts(): Promise<RedditPost[]> {
  const subreddit = reddit.getSubreddit('ollama');
  const posts = await subreddit.getNew({ limit: 100 });

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const recentPosts = posts
    .filter((post: Snoowrap.Submission) => new Date(post.created_utc * 1000) > twentyFourHoursAgo)
    .map((post: Snoowrap.Submission) => ({
      title: post.title,
      content: post.selftext,
      score: post.score,
      numComments: post.num_comments,
      date: new Date(post.created_utc * 1000),
    }));

  return recentPosts;
}

async function main() {
  try {
    console.log('Attempting to fetch posts...');
    const recentPosts = await fetchRecentOllamaPosts();
    console.log('Recent Ollama posts:', recentPosts);
    console.log(`Total posts fetched: ${recentPosts.length}`);
  } catch (error: any) {
    console.error('Error fetching Reddit posts:', error);
    if (error.response) {
      console.error('Response body:', error.response.body);
    }
  }
}

main();
```

Notes:
- Ensure that the environment variables (REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_REFRESH_TOKEN) are set in the `.env.local` file.
- The `fetchRecentOllamaPosts` function can be modified to fetch posts from any subreddit by changing the subreddit name in `getSubreddit('ollama')`.

### Using OpenAI for Structured Output to Categorize Reddit Posts

The platform uses OpenAI's API to categorize Reddit posts into predefined themes. Below is an example of how to perform this categorization:

```javascript
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// Define the structure for the post category analysis using Zod
const PostCategoryAnalysis = z.object({
  solutionRequests: z.boolean().describe("Posts where people are seeking solutions for problems"),
  painAndAnger: z.boolean().describe("Posts where people are expressing their pain and anger"),
  adviceRequests: z.boolean().describe("Posts where people are seeking advice"),
  moneyTalk: z.boolean().describe("Posts where people are talking about spending money"),
});

type PostCategoryAnalysisType = z.infer<typeof PostCategoryAnalysis>;

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function categorizePost(
  postTitle: string,
  postContent: string
): Promise<PostCategoryAnalysisType> {
  const categoryDescriptions = Object.entries(PostCategoryAnalysis.shape).map(
    ([key, value]) => `${key}: ${value.description}`
  ).join('\n');

  const prompt = `
    Analyze the following Reddit post and categorize it based on these criteria:
    ${categoryDescriptions}

    Post Title: ${postTitle}
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

  const content = response.choices[0].message.content;
  if (content) {
    const analysis = PostCategoryAnalysis.parse(JSON.parse(content));
    return analysis;
  }

  throw new Error('Failed to categorize the post');
}

// Main function to demonstrate usage
async function main() {
  const testPosts = [
    {
      title: 'Need help with my budget',
      content: "I'm struggling to make ends meet. Any advice on how to cut expenses?",
    },
    {
      title: 'Frustrated with my job',
      content: "I can't stand my boss anymore. Every day is a nightmare!",
    },
    {
      title: 'Looking for a new laptop',
      content: "I'm thinking of buying a new laptop. Any recommendations under $1000?",
    },
  ];

  for (const post of testPosts) {
    try {
      console.log(`\nAnalyzing post: "${post.title}"`);
      const analysis = await categorizePost(post.title, post.content);
      console.log('Analysis result:', analysis);
    } catch (error) {
      console.error('Error categorizing post:', error);
    }
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export default categorizePost;
```

Notes:
- The `PostCategoryAnalysis` schema defines the expected structure of the analysis output.
- The `categorizePost` function sends a prompt to the OpenAI API to analyze and categorize a Reddit post.
- The `main` function demonstrates how to use `categorizePost` with sample posts.
- Ensure that the `OPENAI_API_KEY` is set in the `.env.local` file.

### Expected OpenAI API Response

When categorizing a post, the OpenAI API is expected to return a JSON object matching the PostCategoryAnalysis schema. For example:

```json
{
  "solutionRequests": true,
  "painAndAnger": false,
  "adviceRequests": true,
  "moneyTalk": false
}
```

This response indicates that the post falls under "Solution Requests" and "Advice Requests" categories.

## Additional Details

### MongoDB Integration
- MongoDB will be used as the database to store subreddit information, posts, and user data.
- Mongoose will be utilized for schema definition and data modeling.

### Authentication with NextAuth
- NextAuth will be implemented for user authentication.
- Users can sign in using supported providers or custom authentication mechanisms.
- Authentication is required for adding subreddits and performing analyses.

### Concurrency in Data Processing
- The analysis of posts using OpenAI's API will be performed concurrently to improve performance.
- Appropriate concurrency control and error handling mechanisms will be implemented.

### UI Components and Libraries
- Shadcn UI Components: Used for building consistent and accessible UI elements.
- Tailwind CSS: Utilized for styling components and layouts.
- Lucide Icons: Integrated for iconography throughout the application.

### Error Handling and Logging
- Proper error handling will be implemented both on the client and server sides.
- Logging mechanisms will be set up to monitor application performance and errors.

### Environment Variables
- All sensitive information like API keys and database credentials will be stored in the `.env.local` file and not committed to version control.
- Environment variables include:
  - REDDIT_CLIENT_ID
  - REDDIT_CLIENT_SECRET
  - REDDIT_REFRESH_TOKEN
  - OPENAI_API_KEY
  - MONGODB_URI
  - NEXTAUTH_SECRET

