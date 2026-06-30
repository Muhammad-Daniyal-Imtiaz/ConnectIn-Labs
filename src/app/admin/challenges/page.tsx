"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getAdminChallenges, deleteChallengeAsAdmin } from "@/app/actions/admin";
import { Loader2, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

export default function AdminChallengesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (c?: string) => {
    setLoading(true);
    const res = await getAdminChallenges(20, c);
    if (res.success) {
      setItems(res.challenges);
      setCursor(res.nextCursor);
      setHasMore(res.hasMore);
    } else {
      setError(res.error || "Failed");
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this challenge permanently?")) return;
    const res = await deleteChallengeAsAdmin(id);
    if (res.success) {
      setItems((prev) => prev.filter((ch) => ch.id !== id));
    } else {
      alert(res.error || "Delete failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white uppercase tracking-wider">Challenges</h1>
      </div>
      {error && <p className="text-red-400 text-sm mb-4 font-bold">{error}</p>}
      <div className="bg-[#0c111d] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 font-bold uppercase tracking-wider">
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Creator</th>
                <th className="text-center p-3">Teams</th>
                <th className="text-center p-3">Submissions</th>
                <th className="text-left p-3">Created</th>
                <th className="text-center p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center"><Loader2 className="w-5 h-5 animate-spin text-emerald-500 mx-auto" /></td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500 font-bold">No challenges found.</td></tr>
              ) : items.map((ch: any) => (
                <tr key={ch.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                  <td className="p-3 text-white font-bold max-w-xs truncate">{ch.title}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <img src={ch.creator?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(ch.creator?.name || "")}`} alt="" className="w-5 h-5 rounded-full object-cover" />
                      <span className="text-white font-bold">{ch.creator?.name || "Unknown"}</span>
                    </div>
                  </td>
                  <td className="p-3 text-center text-slate-300">{ch.teamCount}</td>
                  <td className="p-3 text-center text-slate-300">{ch.submissionCount}</td>
                  <td className="p-3 text-slate-400">{ch.createdAt ? new Date(ch.createdAt).toLocaleDateString() : "-"}</td>
                  <td className="p-3 text-center">
                    <button onClick={() => handleDelete(ch.id)} className="text-red-400 hover:text-red-300 transition-all p-1 cursor-pointer">
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
