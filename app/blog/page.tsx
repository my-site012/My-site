import Link from "next/link";
import type { Metadata } from "next";
import { blogPosts } from "@/lib/data/blogPosts";

export const metadata: Metadata = {
  title: "Blog – Call Girls, Call Boys & Massage Tips | CallGirl4U",
  description: "Read expert guides, city directories, and tips for finding verified call girls, call boys, and massage services across India. Updated daily.",
  keywords: "call girl blog india, call boy tips, massage service india, adult classifieds guide india",
  alternates: {
    canonical: "https://callgirl4u.com/blog",
  },
};

const categoryColors: Record<string, string> = {
  "call-girls": "bg-red-600",
  "call-boys": "bg-blue-700",
  "massage": "bg-green-700",
  "general": "bg-gray-700",
};

const categoryLabels: Record<string, string> = {
  "call-girls": "Call Girls",
  "call-boys": "Call Boys",
  "massage": "Massage",
  "general": "General",
};

export default function BlogPage() {
  const categories = ["all", "call-girls", "call-boys", "massage"];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero */}
      <section className="bg-white py-12 border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl text-gray-900 mb-4 uppercase tracking-tighter">
            CallGirl4U <span className="text-red-600">Blog</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Expert guides, city directories, and tips for finding verified companions and massage services across India.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={cat === "all" ? "/blog" : `/blog?category=${cat}`}
              className={`px-4 py-2 rounded-full text-sm font-bold uppercase border transition-colors ${
                cat === "all"
                  ? "bg-gray-900 text-white border-gray-900"
                  : cat === "call-girls"
                  ? "bg-red-600 text-white border-red-600"
                  : cat === "call-boys"
                  ? "bg-blue-700 text-white border-blue-700"
                  : "bg-green-700 text-white border-green-700"
              } hover:opacity-80`}
            >
              {cat === "all" ? "All Posts" : categoryLabels[cat]}
            </Link>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Card Top */}
              <div className="bg-gray-900 px-6 py-8 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`${categoryColors[post.category]} text-white text-xs font-bold px-3 py-1 rounded-full uppercase`}>
                    {categoryLabels[post.category]}
                  </span>
                  <span className="text-gray-400 text-xs">{post.readTime}</span>
                </div>
                <h2 className="text-white text-lg font-bold leading-tight group-hover:text-red-400 transition-colors line-clamp-3">
                  {post.title}
                </h2>
                <p className="text-gray-400 text-sm mt-3 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              {/* Card Bottom */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className="text-gray-500 text-xs">
                  {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                <span className="text-red-600 font-bold text-sm group-hover:underline">
                  Read More →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Blog Count */}
        <p className="text-center text-gray-400 text-sm mt-12">
          Showing {blogPosts.length} articles — Updated regularly
        </p>
      </section>
    </div>
  );
}
