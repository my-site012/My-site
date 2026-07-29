import { blogPosts, getBlogPost, getAllBlogSlugs } from "@/lib/data/blogPosts";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.metaDescription,
    alternates: {
      canonical: `https://callgirl4u.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.date,
    },
  };
}

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

const categoryLinks: Record<string, string> = {
  "call-girls": "/call-girls",
  "call-boys": "/call-boys",
  "massage": "/massage",
  "general": "/",
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  // Related posts (same category, exclude current)
  const related = blogPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.metaDescription,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Organization",
      "name": "CallGirl4U",
    },
    "publisher": {
      "@type": "Organization",
      "name": "CallGirl4U",
      "logo": {
        "@type": "ImageObject",
        "url": "https://callgirl4u.com/icon.png",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://callgirl4u.com/blog/${post.slug}`,
    },
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gray-900 py-14">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-5">
            <Link prefetch={false} href="/blog" className="text-gray-400 text-sm hover:text-white transition">
              ← Blog
            </Link>
            <span className="text-gray-600">/</span>
            <span className={`${categoryColors[post.category]} text-white text-xs font-bold px-3 py-1 rounded-full uppercase`}>
              {categoryLabels[post.category]}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <span>
              {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-10">

        {/* Main Article */}
        <article className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div
            className="blog-content max-w-none text-gray-800"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA Box */}
          <div className="mt-12 bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-red-800 mb-2">
              Browse Verified Profiles in {post.cityName}
            </h3>
            <p className="text-gray-700 text-sm mb-6">
              Real photos, no advance payment. Connect directly with verified companions in {post.cityName}.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link prefetch={false} href={`/call-girls/${post.citySlug}`}
                className="bg-red-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-red-700 transition">
                Call Girls in {post.cityName}
              </Link>
              <Link prefetch={false} href={`/call-boys/${post.citySlug}`}
                className="bg-blue-700 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-800 transition">
                Call Boys in {post.cityName}
              </Link>
              <Link prefetch={false} href={`/massage/${post.citySlug}`}
                className="bg-green-700 text-white font-bold px-6 py-3 rounded-lg hover:bg-green-800 transition">
                Massage in {post.cityName}
              </Link>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">

          {/* Category Quick Links */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4 border-b pb-2">Browse by Category</h3>
            <div className="flex flex-col gap-3">
              <Link prefetch={false} href="/call-girls"
                className="flex items-center gap-3 p-3 bg-red-50 rounded-lg text-red-700 font-semibold text-sm hover:bg-red-100 transition">
                <span className="text-lg">💃</span> Call Girls India
              </Link>
              <Link prefetch={false} href="/call-boys"
                className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg text-blue-700 font-semibold text-sm hover:bg-blue-100 transition">
                <span className="text-lg">🕴️</span> Call Boys India
              </Link>
              <Link prefetch={false} href="/massage"
                className="flex items-center gap-3 p-3 bg-green-50 rounded-lg text-green-700 font-semibold text-sm hover:bg-green-100 transition">
                <span className="text-lg">💆</span> Massage Services
              </Link>
            </div>
          </div>

          {/* Related Posts */}
          {related.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4 border-b pb-2">Related Articles</h3>
              <div className="flex flex-col gap-4">
                {related.map((p) => (
                  <Link prefetch={false} key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group block">
                    <span className={`${categoryColors[p.category]} text-white text-xs font-bold px-2 py-0.5 rounded uppercase mb-1 inline-block`}>
                      {categoryLabels[p.category]}
                    </span>
                    <p className="text-gray-800 text-sm font-semibold group-hover:text-red-600 transition-colors leading-snug">
                      {p.title}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">{p.readTime}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Safety Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <h3 className="font-bold text-amber-800 text-sm mb-2">⚠️ Safety Reminder</h3>
            <p className="text-gray-700 text-xs leading-relaxed">
              Never pay in advance. All genuine companions on CallGirl4U accept cash payment only after meeting in person. Report suspicious profiles immediately.
            </p>
          </div>
        </aside>
      </div>

      {/* All Blog Posts link */}
      <div className="text-center mt-8">
        <Link prefetch={false} href="/blog"
          className="inline-block bg-gray-900 text-white font-bold px-8 py-3 rounded-full hover:bg-black transition">
          ← View All Blog Posts
        </Link>
      </div>
    </div>
  );
}
