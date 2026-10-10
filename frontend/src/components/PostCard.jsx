import React, { useState } from 'react';
import { Heart, MessageSquare, Send, Clock, User, Share2 } from 'lucide-react';
import { postService } from '../api/postService.js';
import { getErrorMessage } from '../api/api.js';

export default function PostCard({ post, onLikeToggle }) {
  if (!post) return null;

  const [likesCount, setLikesCount] = useState(
    post.likesCount ?? post.likes?.length ?? (post.liked ? 1 : 0)
  );
  const [liked, setLiked] = useState(Boolean(post.liked || post.isLiked));
  const [isLiking, setIsLiking] = useState(false);

  // Comments state
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState(null);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    const prevLiked = liked;
    const prevCount = likesCount;

    // Optimistic update
    setLiked(!prevLiked);
    setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);

    try {
      if (prevLiked) {
        await postService.unlikePost(post.id);
      } else {
        await postService.likePost(post.id);
      }
      if (onLikeToggle) onLikeToggle(post.id, !prevLiked);
    } catch {
      // Revert on error
      setLiked(prevLiked);
      setLikesCount(prevCount);
    } finally {
      setIsLiking(false);
    }
  };

  const toggleComments = async () => {
    const nextState = !showComments;
    setShowComments(nextState);

    // If opening comments and we haven't loaded them yet
    if (nextState && comments.length === 0) {
      setLoadingComments(true);
      try {
        const fetched = await postService.getComments(post.id);
        if (Array.isArray(fetched)) {
          setComments(fetched);
        }
      } catch {
        // Fallback: keep existing comments array
      } finally {
        setLoadingComments(false);
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submittingComment) return;

    setSubmittingComment(true);
    setCommentError(null);

    try {
      const added = await postService.addComment(post.id, { content: newComment.trim() });
      const newCommentObj = added || {
        id: Date.now(),
        content: newComment.trim(),
        createdAt: new Date().toISOString(),
        authorName: 'You',
      };
      setComments((prev) => [...prev, newCommentObj]);
      setNewComment('');
    } catch (err) {
      setCommentError(getErrorMessage(err));
    } finally {
      setSubmittingComment(false);
    }
  };

  const authorName = post.authorName || post.user?.name || post.author?.name || 'Community Member';
  const authorRole = post.authorRole || post.user?.role || 'STUDENT';
  const postDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recent';

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      {/* Author Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold text-sm">
            {authorName[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">{authorName}</h4>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="capitalize">{authorRole.toLowerCase()}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-slate-400" />
                {postDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="mt-3.5 text-sm text-slate-800 leading-relaxed whitespace-pre-line">
        {post.content}
      </div>

      {/* Post Actions Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-1.5 font-medium transition-colors ${
              liked ? 'text-rose-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-rose-600' : ''}`} />
            <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
          </button>

          <button
            type="button"
            onClick={toggleComments}
            className="flex items-center gap-1.5 font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{comments.length} Comments</span>
          </button>
        </div>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
          {/* Add comment input */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment or advice..."
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={submittingComment || !newComment.trim()}
              className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-xs"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>

          {commentError && (
            <p className="text-xs text-rose-600">{commentError}</p>
          )}

          {/* Comment list */}
          {loadingComments ? (
            <p className="text-xs text-slate-400 italic">Loading comments...</p>
          ) : comments.length > 0 ? (
            <div className="space-y-2.5 pt-1">
              {comments.map((comment, index) => {
                const cAuthor = comment.authorName || comment.user?.name || 'Student';
                const cText = comment.content || comment.text || '';
                return (
                  <div key={comment.id || index} className="rounded-lg bg-slate-50 p-2.5 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-800">{cAuthor}</span>
                      {comment.createdAt && (
                        <span className="text-[10px] text-slate-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700 leading-normal">{cText}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-1">No comments yet. Start the conversation!</p>
          )}
        </div>
      )}
    </article>
  );
}
