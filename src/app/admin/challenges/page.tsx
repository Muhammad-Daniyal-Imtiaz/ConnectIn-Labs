"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getAdminChallenges, deleteChallengeAsAdmin } from "@/app/actions/admin";
import { Loader2, ChevronLeft, ChevronRight, Trash2, ExternalLink, Trophy } from "lucide-react";

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
    if (!confirm("Delete this challenge permanently? This will also remove all teams and submissions.")) return;
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
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-wider">Challenges</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Manage all challenge arena entries</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-white/5 px-3 py-1.5 rounded-lg">
          <Trophy className="w-3.5 h-3.5" />
          <span>{items.length} loaded</span>
        </div>
      </div>
      {error && <p className="text-red-400 text-sm mb-4 font-bold">{error}</p>}
      <div className="bg-[#0c111d] border border-white/5 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="text-left p-3.5 text-slate-400 font-bold uppercase tracking-wider">Title</th>
                <th className="text-left p-3.5 text-slate-400 font-bold uppercase tracking-wider">Creator</th>
                <th className="text-center p-3.5 text-slate-400 font-bold uppercase tracking-wider">Teams</th>
                <th className="text-center p-3.5 text-slate-400 font-bold uppercase tracking-wider">Submissions</th>
                <th className="text-left p-3.5 text-slate-400 font-bold uppercase tracking-wider">Status</th>
                <th className="text-left p-3.5 text-slate-400 font-bold uppercase tracking-wider">Created</th>
                <th className="text-center p-3.5 text-slate-400 font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="p-12 text-center"><Loader2 className="w-5 h-5 animate-spin text-emerald-500 mx-auto" /></td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={7} className="p-12 text-center text-slate-500 font-bold">No challenges found.</td></tr>
              ) : items.map((ch: any) => (
                <tr key={ch.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-all group">
                  <td className="p-3.5">
                    <Link href={`/challenges`} target="_blank" className="flex items-center gap-2 text-white font-bold hover:text-emerald-400 transition-all max-w-xs">
                      <span className="truncate">{ch.title}</span>
                      <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  </td>
                  <td className="p-3.5">
                    {ch.creator ? (
                      <Link href={`/users/${ch.creator.id}`} target="_blank" className="flex items-center gap-2 hover:text-emerald-400 transition-all w-fit">
                        <img src={ch.creator.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(ch.creator.name)}`} alt="" className="w-5 h-5 rounded-full object-cover ring-1 ring-white/10" />
                        <span className="text-white font-bold">{ch.creator.name}</span>
                      </Link>
                    ) : (
                      <span className="text-slate-500 italic">Deleted user</span>
                    )}
                  </td>
                  <td className="p-3.5 text-center"><span className="font-bold tabular-nums text-amber-400">{ch.teamCount}</span></td>
                  <td className="p-3.5 text-center"><span className="font-bold tabular-nums text-blue-400">{ch.submissionCount}</span></td>
                  <td className="p-3.5">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      ch.status === "Open" ? "bg-emerald-500/10 text-emerald-400" :
                      ch.status === "Closed" ? "bg-red-500/10 text-red-400" :
                      "bg-amber-500/10 text-amber-400"
                    }`}>{ch.status}</span>
                  </td>
                  <td className="p-3.5 text-slate-400 tabular-nums">{ch.createdAt ? new Date(ch.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "-"}</td>
                  <td className="p-3.5 text-center">
                    <button onClick={() => handleDelete(ch.id)} title="Delete challenge" className="text-red-500/60 hover:text-red-400 transition-all p-1.5 hover:bg-red-500/10 rounded-lg cursor-pointer">
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
        <div className="flex items-center justify-center gap-4 mt-5">
          <button onClick={() => load()} disabled={loading || !cursor} className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-4 py-2 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
            <ChevronLeft className="w-3.5 h-3.5" /> First
          </button>
          {hasMore && (
            <button onClick={() => load(cursor!)} disabled={loading} className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-5 py-2 rounded-xl transition-all disabled:opacity-50 cursor-pointer">
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
