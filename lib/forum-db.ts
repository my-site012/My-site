import { kv } from "./kv";
import fs from "fs";
import path from "path";

export interface ForumReply {
  id: string;
  nickname: string;
  content: string;
  createdAt: string;
}

export interface ForumPost {
  id: string;
  title: string;
  nickname: string;
  category: string;
  city: string;
  content: string;
  likes: number;
  replies: ForumReply[];
  createdAt: string;
}

const FALLBACK_FILE = path.join(process.cwd(), "scratch", "forum-mock.json");

// Helper to ensure scratch folder exists
function ensureScratchDir() {
  const dir = path.dirname(FALLBACK_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Initial mock data to seed
const INITIAL_POSTS: ForumPost[] = [
  {
    id: "post_initial_1",
    title: "Aerocity Reshma - Best massage therapy experience!",
    nickname: "DelhiTraveler",
    category: "Reviews",
    city: "Aerocity",
    content: "Just had a full body massage session with Reshma in Aerocity. She is extremely professional and polite. The session was worth every rupee, pay only in cash after service. Pure 10/10.",
    likes: 12,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
    replies: [
      {
        id: "reply_initial_1_1",
        nickname: "VipGuest",
        content: "Totally agree! Reshma is very good with deep tissue massage.",
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
      }
    ]
  },
  {
    id: "post_initial_2",
    title: "Beware of advance payment scams! Safe booking tips",
    nickname: "AdminSafety",
    category: "Safety Tips",
    city: "All Cities",
    content: "Important safety warning: Never pay anyone in advance. Genuine independent service providers will NEVER ask for advance payments, booking fees, or transport charges online. Always follow Cash on Delivery.",
    likes: 28,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    replies: [
      {
        id: "reply_initial_2_1",
        nickname: "Rahul_K",
        content: "Thank you for posting this. Almost got scammed by a fake agency asking for deposit.",
        createdAt: new Date(Date.now() - 3600000 * 20).toISOString()
      }
    ]
  },
  {
    id: "post_initial_3",
    title: "Priya in Mumbai Andheri review",
    nickname: "MumbaiRider",
    category: "Reviews",
    city: "Mumbai",
    content: "Met Priya in Andheri East today. She matches her pictures perfectly and has a wonderful personality. Cash payment after service made the booking risk-free.",
    likes: 8,
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(), // 1.5 days ago
    replies: []
  }
];

// Read from fallback file
function readFallbackFile(): ForumPost[] {
  ensureScratchDir();
  if (!fs.existsSync(FALLBACK_FILE)) {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(INITIAL_POSTS, null, 2));
    return INITIAL_POSTS;
  }
  try {
    const data = fs.readFileSync(FALLBACK_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    console.error("Error reading fallback file:", e);
    return INITIAL_POSTS;
  }
}

// Write to fallback file
function writeFallbackFile(posts: ForumPost[]) {
  ensureScratchDir();
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(posts, null, 2));
  } catch (e) {
    console.error("Error writing fallback file:", e);
  }
}

export async function getForumPosts(): Promise<ForumPost[]> {
  if (!kv) {
    return readFallbackFile();
  }
  
  try {
    const ids = await kv.lrange("forum:post_ids", 0, 99);
    if (!ids || ids.length === 0) {
      // Seed initial posts in Vercel KV if empty
      for (const post of INITIAL_POSTS) {
        await kv.set(`forum:post:${post.id}`, JSON.stringify(post));
        await kv.lpush("forum:post_ids", post.id);
      }
      return INITIAL_POSTS;
    }
    
    // Fetch all posts
    const keys = ids.map(id => `forum:post:${id}`);
    const results = await kv.mget<any[]>(...keys);
    
    const posts: ForumPost[] = [];
    for (const result of results) {
      if (result) {
        try {
          posts.push(typeof result === "string" ? JSON.parse(result) : result);
        } catch (e) {
          console.error("Failed to parse post:", e);
        }
      }
    }
    
    // Sort by createdAt descending
    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error("Failed to get forum posts from KV, falling back to local file:", error);
    return readFallbackFile();
  }
}

export async function createForumPost(
  title: string,
  nickname: string,
  category: string,
  city: string,
  content: string
): Promise<ForumPost> {
  const newPost: ForumPost = {
    id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    title: title.trim(),
    nickname: nickname.trim() || "Anonymous",
    category,
    city: city.trim() || "All Cities",
    content: content.trim(),
    likes: 0,
    replies: [],
    createdAt: new Date().toISOString()
  };

  if (!kv) {
    const posts = readFallbackFile();
    posts.unshift(newPost);
    writeFallbackFile(posts);
    return newPost;
  }

  try {
    await kv.set(`forum:post:${newPost.id}`, JSON.stringify(newPost));
    await kv.lpush("forum:post_ids", newPost.id);
    await kv.ltrim("forum:post_ids", 0, 99); // Keep last 100 posts
    return newPost;
  } catch (error) {
    console.error("Failed to save post to KV, saving to local file:", error);
    const posts = readFallbackFile();
    posts.unshift(newPost);
    writeFallbackFile(posts);
    return newPost;
  }
}

export async function addForumReply(
  postId: string,
  nickname: string,
  content: string
): Promise<ForumReply | null> {
  const newReply: ForumReply = {
    id: `reply_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    nickname: nickname.trim() || "Anonymous",
    content: content.trim(),
    createdAt: new Date().toISOString()
  };

  if (!kv) {
    const posts = readFallbackFile();
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.replies.push(newReply);
      writeFallbackFile(posts);
      return newReply;
    }
    return null;
  }

  try {
    const rawPost = await kv.get(`forum:post:${postId}`);
    if (!rawPost) return null;
    
    const post: ForumPost = typeof rawPost === "string" ? JSON.parse(rawPost) : rawPost;
    post.replies.push(newReply);
    await kv.set(`forum:post:${postId}`, JSON.stringify(post));
    return newReply;
  } catch (error) {
    console.error("Failed to add reply to KV, falling back to local file:", error);
    const posts = readFallbackFile();
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.replies.push(newReply);
      writeFallbackFile(posts);
      return newReply;
    }
    return null;
  }
}

export async function likeForumPost(postId: string): Promise<number> {
  if (!kv) {
    const posts = readFallbackFile();
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.likes += 1;
      writeFallbackFile(posts);
      return post.likes;
    }
    return 0;
  }

  try {
    const rawPost = await kv.get(`forum:post:${postId}`);
    if (!rawPost) return 0;
    
    const post: ForumPost = typeof rawPost === "string" ? JSON.parse(rawPost) : rawPost;
    post.likes += 1;
    await kv.set(`forum:post:${postId}`, JSON.stringify(post));
    return post.likes;
  } catch (error) {
    console.error("Failed to like post in KV, falling back to local file:", error);
    const posts = readFallbackFile();
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.likes += 1;
      writeFallbackFile(posts);
      return post.likes;
    }
    return 0;
  }
}
