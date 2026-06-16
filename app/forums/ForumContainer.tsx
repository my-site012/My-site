"use client";

import { useState } from "react";
import { ForumPost, ForumReply } from "@/lib/forum-db";
import { submitPost, submitReply, incrementLikes } from "./actions";

interface ForumContainerProps {
  initialPosts: ForumPost[];
  cities: string[];
}

export default function ForumContainer({ initialPosts, cities }: ForumContainerProps) {
  const [posts, setPosts] = useState<ForumPost[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // New thread form state
  const [newTitle, setNewTitle] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [newCategory, setNewCategory] = useState("Reviews");
  const [newCity, setNewCity] = useState("All Cities");
  const [newContent, setNewContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Reply state per post (maps post ID to reply input values)
  const [replyInputs, setReplyInputs] = useState<Record<string, { nickname: string; content: string }>>({});
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  // Categories list
  const categories = ["All", "Reviews", "Safety Tips", "General", "City Discussions"];

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.nickname.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesCity = selectedCity === "All Cities" || post.city === selectedCity;

    return matchesSearch && matchesCategory && matchesCity;
  });

  const handleLike = async (postId: string) => {
    // Optimistic Update
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    
    // Call server action in background
    await incrementLikes(postId);
  };

  const handleReplyChange = (postId: string, field: "nickname" | "content", value: string) => {
    setReplyInputs(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId] || { nickname: "", content: "" },
        [field]: value
      }
    }));
  };

  const handleReplySubmit = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    const input = replyInputs[postId];
    if (!input || !input.content.trim()) return;

    const nickname = input.nickname.trim() || "Anonymous";
    const content = input.content.trim();

    // Reset reply input content (keep nickname for convenience)
    setReplyInputs(prev => ({
      ...prev,
      [postId]: { nickname, content: "" }
    }));

    const result = await submitReply(postId, nickname, content);
    if (result.success && result.reply) {
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            replies: [...p.replies, result.reply as ForumReply]
          };
        }
        return p;
      }));
    } else {
      alert("Failed to submit reply. Please try again.");
    }
  };

  const toggleReplies = (postId: string) => {
    setExpandedReplies(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      setFormError("Title and Content are required.");
      return;
    }
    
    setIsSubmitting(true);
    setFormError("");

    const result = await submitPost(
      newTitle,
      newNickname.trim() || "Anonymous",
      newCategory,
      newCity,
      newContent
    );

    if (result.success) {
      // Local state update to feel instant
      const mockPost: ForumPost = {
        id: `post_temp_${Date.now()}`,
        title: newTitle,
        nickname: newNickname.trim() || "Anonymous",
        category: newCategory,
        city: newCity,
        content: newContent,
        likes: 0,
        replies: [],
        createdAt: new Date().toISOString()
      };
      setPosts(prev => [mockPost, ...prev]);
      
      // Clear form & close modal
      setNewTitle("");
      setNewNickname("");
      setNewContent("");
      setNewCategory("Reviews");
      setNewCity("All Cities");
      setShowCreateModal(false);
    } else {
      setFormError("Failed to submit post. Please try again.");
    }
    setIsSubmitting(false);
  };

  // Helper for nice user icons
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-red-500", "bg-pink-500", "bg-purple-500", "bg-indigo-500", 
      "bg-blue-500", "bg-teal-500", "bg-emerald-500", "bg-orange-500"
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return colors[sum % colors.length];
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Forum Header Card */}
        <div className="relative rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-rose-700 text-white p-8 md:p-12 shadow-xl mb-10 overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <span className="text-9xl font-black italic select-none">FORUM</span>
          </div>
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">Adult Forums & Reviews</h1>
            <p className="text-rose-100 text-base md:text-lg mb-6">
              Welcome to the community board! Share independent reviews of companion visits, massage services, post safety warnings, or talk about experiences in your city. Keep it respectful.
            </p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-white text-red-600 hover:bg-rose-50 px-6 py-3 rounded-full font-bold text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              ✍️ Create New Thread
            </button>
          </div>
        </div>

        {/* Search and Filter Panel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="w-full md:w-auto flex flex-wrap items-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition border ${
                  selectedCategory === cat 
                    ? "bg-red-600 text-white border-red-600 shadow-sm" 
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 items-center justify-end">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search forum..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>

            {/* City Filter */}
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white cursor-pointer"
            >
              <option value="All Cities">All Cities</option>
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Feed Column */}
          <div className="lg:col-span-2 space-y-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => {
                const isExpanded = expandedReplies[post.id] || false;
                const replyCount = post.replies.length;
                const currentReplyInput = replyInputs[post.id] || { nickname: "", content: "" };

                return (
                  <article key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-gray-200 transition-all duration-300">
                    <div className="p-6">
                      
                      {/* Top Header Information */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${getAvatarColor(post.nickname)} shadow-inner`}>
                          {post.nickname.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 leading-none">{post.nickname}</h4>
                          <span className="text-[10px] text-gray-400 mt-1 inline-block">
                            {new Date(post.createdAt).toLocaleDateString(undefined, { 
                              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </span>
                        </div>

                        <div className="ml-auto flex items-center gap-2">
                          <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
                            📍 {post.city}
                          </span>
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                            post.category === "Reviews" 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                              : post.category === "Safety Tips"
                              ? "bg-amber-50 text-amber-700 border-amber-100"
                              : "bg-purple-50 text-purple-700 border-purple-100"
                          }`}>
                            {post.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap mb-4">{post.content}</p>

                      {/* Actions Footer */}
                      <div className="flex items-center gap-4 pt-4 border-t border-gray-50 text-sm">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors font-semibold active:scale-95"
                        >
                          ❤️ {post.likes} Likes
                        </button>
                        <button 
                          onClick={() => toggleReplies(post.id)}
                          className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 transition-colors font-semibold"
                        >
                          💬 {replyCount} {replyCount === 1 ? "Comment" : "Comments"}
                        </button>
                      </div>

                    </div>

                    {/* Expandable Replies Section */}
                    {isExpanded && (
                      <div className="bg-gray-50/70 border-t border-gray-100 p-6 space-y-6">
                        {replyCount > 0 ? (
                          <div className="space-y-4">
                            <h5 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-2">Discussion</h5>
                            {post.replies.map(reply => (
                              <div key={reply.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 ${getAvatarColor(reply.nickname)}`}>
                                  {reply.nickname.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-sm text-gray-900">{reply.nickname}</span>
                                    <span className="text-[9px] text-gray-400">
                                      {new Date(reply.createdAt).toLocaleDateString(undefined, { 
                                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 text-xs leading-relaxed">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400 text-xs italic text-center py-2">No responses yet. Be the first to share your thoughts!</p>
                        )}

                        {/* Inline Reply Form */}
                        <form onSubmit={e => handleReplySubmit(e, post.id)} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
                          <h5 className="font-bold text-xs text-gray-800 uppercase tracking-wider">Leave a Comment</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <input
                              type="text"
                              placeholder="Your Nickname"
                              value={currentReplyInput.nickname}
                              onChange={e => handleReplyChange(post.id, "nickname", e.target.value)}
                              className="px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
                            />
                            <input
                              type="text"
                              placeholder="Type your comment here..."
                              value={currentReplyInput.content}
                              onChange={e => handleReplyChange(post.id, "content", e.target.value)}
                              className="sm:col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-red-500 focus:outline-none"
                              required
                            />
                          </div>
                          <div className="flex justify-end">
                            <button 
                              type="submit"
                              className="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] uppercase tracking-wider px-4 py-2 rounded-lg transition shadow-sm active:scale-95"
                            >
                              Post Comment
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </article>
                );
              })
            ) : (
              <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm">
                <span className="text-5xl block mb-4">📭</span>
                <p className="text-gray-500 font-semibold mb-2">No threads match your current filter.</p>
                <p className="text-gray-400 text-sm">Be the first to create a discussion thread under this category!</p>
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            
            {/* Guidelines Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4 pb-2 border-b flex items-center gap-2">
                ⚠️ Safe Posting Guidelines
              </h3>
              <ul className="space-y-3.5 text-xs text-gray-600 leading-relaxed list-decimal pl-4">
                <li><strong>No Personal Identifiable Details:</strong> Never share real phone numbers (other than publicly listed ad numbers), bank details, or addresses.</li>
                <li><strong>No Prepayments:</strong> Do not promote or ask for online advance payments. We support a strictly cash-on-delivery community.</li>
                <li><strong>Honest Reviews:</strong> Share authentic experiences to help other community members stay informed.</li>
                <li><strong>Respectful Conduct:</strong> Defamatory language, harassment, or abusive behaviour will be flagged and removed.</li>
              </ul>
            </div>

            {/* Popular Cities Quick Link */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4 pb-2 border-b flex items-center gap-2">
                📍 Filter by Hotspots
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Aerocity", "Delhi", "Mumbai", "Pune", "Bengaluru", "Hyderabad", "Noida", "Chennai"].map(city => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      // Scroll to posts top smoothly
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
                      selectedCity === city 
                        ? "bg-rose-50 text-rose-700 border border-rose-200" 
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent"
                    }`}
                  >
                    {city}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedCity("All Cities")}
                  className="px-3 py-1.5 text-xs rounded-lg font-bold text-red-600 hover:underline"
                >
                  Reset City Filter
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-5 flex justify-between items-center">
              <h3 className="text-xl font-bold uppercase tracking-wide">✍️ Create New Thread</h3>
              <button 
                onClick={() => {
                  setShowCreateModal(false);
                  setFormError("");
                }}
                className="text-white hover:text-rose-100 font-extrabold text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreatePost} className="p-6 space-y-4 overflow-y-auto flex-1">
              {formError && (
                <div className="bg-red-50 text-red-700 border border-red-100 text-xs px-4 py-3 rounded-lg font-medium">
                  ⚠️ {formError}
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-500 uppercase">Thread Title</label>
                <input
                  type="text"
                  placeholder="e.g. Aerocity Tanya review - Very good"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase">Your Nickname</label>
                  <input
                    type="text"
                    placeholder="e.g. SunnyD"
                    value={newNickname}
                    onChange={e => setNewNickname(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="Reviews">Reviews</option>
                    <option value="Safety Tips">Safety Tips</option>
                    <option value="General">General</option>
                    <option value="City Discussions">City Discussions</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-500 uppercase">Target City</label>
                <select
                  value={newCity}
                  onChange={e => setNewCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none bg-white cursor-pointer"
                >
                  <option value="All Cities">All Cities (General)</option>
                  {cities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-500 uppercase">Thread Content</label>
                <textarea
                  placeholder="Describe your experience or share details... Please do not include private personal contact details."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none focus:border-transparent transition-all resize-none"
                  required
                />
              </div>

              {/* Modal Actions Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormError("");
                  }}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold text-xs uppercase px-6 py-2.5 rounded-full transition shadow-md active:scale-95"
                >
                  {isSubmitting ? "Submitting..." : "Submit Thread"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
