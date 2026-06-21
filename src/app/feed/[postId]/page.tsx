"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, X, ThumbsUp, MessageSquare, Repeat2, Send,
  Globe2, Mail, Phone, User, Lightbulb, Rocket, DollarSign, Users, Building2,
  Handshake, Loader2, ArrowLeft, Clock
} from "lucide-react";
import { getPostById, toggleLike } from "@/app/actions/posts";

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string; icon: React.ElementType }> = {
  "Idea":                  { bg: "bg-amber-500/10", text: "text-amber-400",  border: "border-amber-500/25",  icon: Lightbulb },
  "MVP":                   { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/25", icon: Rocket },
  "Investment Wanted":     { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/25", icon: DollarSign },
  "Partners Wanted":       { bg: "bg-cyan-500/10",  text: "text-cyan-400",  border: "border-cyan-500/25",   icon: Handshake },
  "Startup Space Wanted":  { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/25", icon: Building2 },
  "Cofounder Wanted":      { bg: "bg-rose-500/10",  text: "text-rose-400",  border: "border-rose-500/25",   icon: Users },
};

export default function PostDetailPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = use(params);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liking, setLiking] = useState(false);
  const [showLikers, setShowLikers] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await getPostById(postId);
        if (res.success && res.post) {
          setPost(res.post);
          setLiked(res.post.likedByMe);
          setLikeCount(res.post.likeCount);
        } else {
          setError(res.error || "Post not found.");
        }
      } catch (e) {
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [postId]);

  async function handleLike() {
    if (liking) return;
    setLiking(true);
    try {
      const res = await toggleLike(postId);
      if (res.success) {
        setLiked(res.liked);
        setLikeCount(res.likeCount);
      }
    } catch (e) {
      console.error("Failed to toggle like:", e);
    } finally {
      setLiking(false);
    }
  }

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  let imgs: string[] = [];
  try { imgs = JSON.parse(post?.imagesJson || "[]"); } catch {}

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center gap-4">
        <p className="text-[var(--text-secondary)] text-sm">{error || "Post not found."}</p>
        <Link href="/feed" className="text-emerald-400 text-xs font-bold hover:underline">← Back to Feed</Link>
      </div>
    );
  }

  const catStyle = CATEGORY_STYLES[post.category] || { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/25", icon: null };
  const CatIcon = catStyle.icon;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Background Glowing Orbs */}
      <div className="fixed top-[-10%] left-[-15%] w-[60%] h-[60%] rounded-full bg-[#00a86b]/4 blur-[140px] pointer-events-none animate-pulse-glow"></div>
      <div className="fixed bottom-[-15%] right-[-15%] w-[60%] h-[60%] rounded-full bg-[#2563eb]/3 blur-[140px] pointer-events-none"></div>

      <div className="max-w-3xl mx-auto px-4 py-6 relative z-10">
        {/* Back button */}
        <Link href="/feed" className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Feed
        </Link>

        {/* Post Card */}
        <div className="bg-[#1d2226] border border-[#38434f] rounded-xl overflow-hidden shadow-xl">
          {/* Author Header */}
          <div className="flex items-start px-6 pt-5 pb-2">
            <img src={post.userAvatar} className="w-14 h-14 rounded-full mr-4 object-cover" />
            <div className="flex-1 leading-tight">
              <p className="font-bold text-lg text-white">{post.userName}</p>
              <p className="text-xs text-[#8c959f] mt-0.5">{post.userRole}</p>
              {post.category && (
                <span className={`inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
                  {CatIcon && <CatIcon className="w-3.5 h-3.5" />}
                  {post.category}
                </span>
              )}
            </div>
          </div>

          {/* Timestamp */}
          <div className="px-6 pb-3 flex items-center gap-2 text-xs text-[#8c959f]">
            <Clock className="w-3.5 h-3.5" />
            <span>{timeAgo(post.createdAt)}</span>
            <span>•</span>
            <Globe2 className="w-3.5 h-3.5" />
            <span>Public</span>
          </div>

          {/* Body */}
          <div className="px-6 py-3">
            {post.title && <h1 className="text-xl font-bold text-white mb-3">{post.title}</h1>}
            <p className="text-sm leading-relaxed text-[#e9eaec] whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Contact Info */}
          {(post.showContactEmail || post.showContactPhone || post.showContactCountry) && (
            <div className="mx-6 mt-2 mb-4 p-4 bg-slate-900/30 border border-slate-700/40 rounded-lg">
              <div className="font-bold text-white text-[11px] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" /> Contact Information
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs">
                {post.showContactEmail && post.contactEmail && (
                  <div className="flex items-center gap-2 text-slate-300"><Mail className="w-4 h-4 text-slate-500" /> {post.contactEmail}</div>
                )}
                {post.showContactPhone && post.contactPhone && (
                  <div className="flex items-center gap-2 text-slate-300"><Phone className="w-4 h-4 text-slate-500" /> {post.contactPhone}</div>
                )}
                {post.showContactCountry && post.contactCountry && (
                  <div className="flex items-center gap-2 text-slate-300"><Globe2 className="w-4 h-4 text-slate-500" /> {post.contactCountry}</div>
                )}
              </div>
            </div>
          )}

          {/* Images */}
          {imgs.length > 0 && (
            <div className="relative w-full bg-[#1b1f23] flex items-center justify-center group/carousel">
              <img src={imgs[currentImage]} alt="Post media" className="max-h-[600px] object-contain w-full" />
              {imgs.length > 1 && (
                <>
                  {currentImage > 0 && (
                    <button onClick={() => setCurrentImage(p => p - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white opacity-0 group-hover/carousel:opacity-100 hover:bg-black/90 transition-all cursor-pointer border border-white/20 z-10">
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  )}
                  {currentImage < imgs.length - 1 && (
                    <button onClick={() => setCurrentImage(p => p + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white opacity-0 group-hover/carousel:opacity-100 hover:bg-black/90 transition-all cursor-pointer border border-white/20 z-10">
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  )}
                  <div className="absolute top-4 right-4 bg-black/70 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm z-10 border border-white/10">
                    {currentImage + 1} / {imgs.length}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Like count bar */}
          {likeCount > 0 && (
            <div className="px-6 py-3 flex items-center justify-between border-b border-[#38434f]">
              <button
                onClick={() => setShowLikers(!showLikers)}
                className="flex items-center gap-2 text-sm text-[#8c959f] hover:text-[#0a66c2] hover:underline transition-colors cursor-pointer"
              >
                <div className="flex -space-x-1">
                  <div className="w-5 h-5 rounded-full bg-[#0a66c2] flex items-center justify-center ring-[1.5px] ring-[#1d2226]">
                    <ThumbsUp className="w-2.5 h-2.5 text-white fill-white" />
                  </div>
                </div>
                <span>{likeCount}</span>
              </button>
              <div className="flex gap-3 text-xs text-[#8c959f]">
                <span>0 comments</span>
                <span>•</span>
                <span>0 reposts</span>
              </div>
            </div>
          )}

          {/* Likers Dropdown */}
          {showLikers && likeCount > 0 && (
            <div className="mx-6 mb-3 bg-[#141b24] border border-[#38434f] rounded-lg overflow-hidden">
              <div className="p-3 border-b border-[#38434f]">
                <p className="text-xs font-bold text-white">{likeCount} {likeCount === 1 ? "Like" : "Likes"}</p>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {(post.likers || []).map((liker: any) => (
                  <div key={liker.userId} className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#38434f] transition-colors">
                    <img src={liker.userAvatar} alt={liker.userName} className="w-8 h-8 rounded-full object-cover" />
                    <span className="text-sm font-semibold text-white">{liker.userName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="px-4 py-2 flex items-center justify-between text-sm font-semibold text-[#8c959f] border-t border-[#38434f]">
            <button
              onClick={handleLike}
              disabled={liking}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 mx-0.5 rounded-md transition-colors cursor-pointer ${liked ? "text-[#0a66c2]" : "hover:bg-[#38434f] hover:text-[#e9eaec]"} ${liking ? "opacity-60" : ""}`}
            >
              {liking ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ThumbsUp className={`w-5 h-5 ${liked ? "fill-[#0a66c2] text-[#0a66c2]" : ""}`} />
              )}
              {liked ? "Liked" : "Like"}
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3.5 mx-0.5 rounded-md hover:bg-[#38434f] hover:text-[#e9eaec] transition-colors cursor-pointer">
              <MessageSquare className="w-5 h-5" />
              Comment
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3.5 mx-0.5 rounded-md hover:bg-[#38434f] hover:text-[#e9eaec] transition-colors cursor-pointer hidden sm:flex">
              <Repeat2 className="w-5 h-5" />
              Repost
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3.5 mx-0.5 rounded-md hover:bg-[#38434f] hover:text-[#e9eaec] transition-colors cursor-pointer">
              <Send className="w-5 h-5 -rotate-12 mt-0.5" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
