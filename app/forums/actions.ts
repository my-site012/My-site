"use server";

import { createForumPost, addForumReply, likeForumPost } from "@/lib/forum-db";
import { revalidatePath } from "next/cache";

export async function submitPost(
  title: string,
  nickname: string,
  category: string,
  city: string,
  content: string
) {
  if (!title || !content || !category) {
    return { success: false, error: "Title, content, and category are required." };
  }

  try {
    await createForumPost(title, nickname, category, city, content);
    revalidatePath("/forums");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to submit post." };
  }
}

export async function submitReply(postId: string, nickname: string, content: string) {
  if (!content) {
    return { success: false, error: "Content is required." };
  }

  try {
    const reply = await addForumReply(postId, nickname, content);
    revalidatePath("/forums");
    return { success: true, reply };
  } catch (e) {
    return { success: false, error: "Failed to submit reply." };
  }
}

export async function incrementLikes(postId: string) {
  try {
    const likes = await likeForumPost(postId);
    revalidatePath("/forums");
    return { success: true, likes };
  } catch (e) {
    return { success: false, error: "Failed to like post." };
  }
}
