import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { postService } from '../api/postService.js';
import { getErrorMessage } from '../api/api.js';

import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';
import PostCard from '../components/PostCard.jsx';

import { Rss, Send, MessageSquare } from 'lucide-react';

export default function FeedPage() {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [newPostContent, setNewPostContent] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await postService.getPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err));
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim() || creating) return;

    setCreating(true);
    setError(null);

    try {
      const created = await postService.createPost({ content: newPostContent.trim() });
      const newPostObj = created || {
        id: Date.now(),
        content: newPostContent.trim(),
        authorName: user?.name || 'You',
        authorRole: user?.role || 'STUDENT',
        createdAt: new Date().toISOString(),
        likesCount: 0,
        liked: false,
        comments: [],
      };
      setPosts([newPostObj, ...posts]);
      setNewPostContent('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Campus Networking Feed
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Share technical projects, interview preparation tips, and internship experiences.
        </p>
      </div>

      {/* Create Post Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <form onSubmit={handleCreatePost} className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold text-xs">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <textarea
              rows={3}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What are you working on? Share interview advice, projects, or questions..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-400">
              Posting as <strong className="text-slate-600">{user?.name}</strong>
            </span>
            <button
              type="submit"
              disabled={creating || !newPostContent.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              {creating ? 'Publishing...' : 'Post to Feed'}
            </button>
          </div>
        </form>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchPosts} />}

      {/* Posts List */}
      {loading ? (
        <LoadingSpinner message="Loading campus discussions..." size="lg" className="py-20" />
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MessageSquare}
          title="No posts yet"
          description="Be the first to share an update, internship tip, or project discussion with the community!"
        />
      )}
    </div>
  );
}
