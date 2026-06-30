"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getAdminPosts, deletePostAsAdmin } from "@/app/actions/admin";
import { Loader2, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

export default function AdminPostsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (c?: string) => {
    setLoading(true);
    const res = await getAdminPosts(20, c);
    if (res.success) {
      setItems(res.posts);
      setCursor(res.nextCursor);
      setHasMore(res.hasMore);
    } else {
      setError(res.error || "Failed");
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return;
    const res = await deletePostAsAdmin(id);
    if (res.success) {
      setItems((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert(res.error || "Delete failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white uppercase tracking-wider">Posts</h1>
      </div>
      {error && <p className="text-red-400 text-sm mb-4 font-bold">{error}</p>}
      <div className="bg-[#0c111d] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 font-bold uppercase tracking-wider">
                <th className="text-left p-3">Content</th>
                <th className="text-left p-3">Author</th>
                <th className="text-center p-3">Likes</th>
                <th className="text-left p-3">Created</th>
                <th className="text-center p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center"><Loader2 className="w-5 h-5 animate-spin text-emerald-500 mx-auto" /></td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500 font-bold">No posts found.</td></tr>
              ) : items.map((p: any) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                  <td className="p-3 text-slate-200 max-w-xs truncate font-medium">{p.content}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <img src={p.author?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(p.author?.name || "")}`} alt="" className="w-5 h-5 rounded-full object-cover" />
                      <span className="text-white font-bold">{p.author?.name || "Unknown"}</span>
                    </div>
                  </td>
                  <td className="p-3 text-center text-slate-300">{p.likeCount}</td>
                  <td className="p-3 text-slate-400">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "-"}</td>
                  <td className="p-3 text-center">
                    <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300 transition-all p-1 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {(hasMore || cursor) && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button onClick={() => load()} disabled={loading} className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-4 py-2 rounded-lg transition-all disabled:opacity-50">
            <ChevronLeft className="w-3.5 h-3.5" /> First
          </button>
          {hasMore && (
            <button onClick={() => load(cursor!)} disabled={loading} className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-4 py-2 rounded-lg transition-all disabled:opacity-50">
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
