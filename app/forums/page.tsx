import { Metadata } from "next";
import { getForumPosts } from "@/lib/forum-db";
import { getAllCities } from "@/lib/data/locations";
import ForumContainer from "./ForumContainer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Adult Forums & Reviews | CallGirl4U Community",
  description: "Join the CallGirl4U discussion forum to share verified reviews, safety tips, and general discussions about local companions and massage services.",
  keywords: "adult forums, call girl reviews, escort forums, companion reviews, safety tips, body massage reviews",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "https://callgirl4u.com/forums",
  }
};

export default async function ForumsPage() {
  const posts = await getForumPosts();
  const cities = getAllCities();

  return (
    <ForumContainer initialPosts={posts} cities={cities} />
  );
}
