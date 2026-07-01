"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getAdminJobs, deleteJobAsAdmin } from "@/app/actions/admin";
import { Loader2, ChevronLeft, ChevronRight, Trash2, ExternalLink, Briefcase } from "lucide-react";

export default function AdminJobsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (c?: string) => {
    setLoading(true);
    const res = await getAdminJobs(20, c);
    if (res.success) {
      setItems(res.jobs);
      setCursor(res.nextCursor);
      setHasMore(res.hasMore);
    } else {
      setError(res.error || "Failed");
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job permanently?")) return;
    const res = await deleteJobAsAdmin(id);
    if (res.success) {
      setItems((prev) => prev.filter((j) => j.id !== id));
    } else {
      alert(res.error || "Delete failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-wider">Jobs</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Manage all job postings</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-white/5 px-3 py-1.5 rounded-lg">
          <Briefcase className="w-3.5 h-3.5" />
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
                <th className="text-left p-3.5 text-slate-400 font-bold uppercase tracking-wider">Company</th>
                <th className="text-left p-3.5 text-slate-400 font-bold uppercase tracking-wider">Posted By</th>
                <th className="text-left p-3.5 text-slate-400 font-bold uppercase tracking-wider">Type</th>
                <th className="text-left p-3.5 text-slate-400 font-bold uppercase tracking-wider">Created</th>
                <th className="text-center p-3.5 text-slate-400 font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-12 text-center"><Loader2 className="w-5 h-5 animate-spin text-emerald-500 mx-auto" /></td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6} className="p-12 text-center text-slate-500 font-bold">No jobs found.</td></tr>
              ) : items.map((j: any) => (
                <tr key={j.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-all group">
                  <td className="p-3.5">
                    <Link href={`/jobs`} target="_blank" className="flex items-center gap-2 text-white font-bold hover:text-emerald-400 transition-all max-w-xs">
                      <span className="truncate">{j.title}</span>
                      <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  </td>
                  <td className="p-3.5">
                    {j.companySlug ? (
                      <Link href={`/company/${j.companySlug}`} target="_blank" className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-all w-fit">
                        {j.companyLogo && <img src={j.companyLogo} alt="" className="w-5 h-5 rounded object-cover ring-1 ring-white/10" />}
                        <span>{j.companyName}</span>
                      </Link>
                    ) : (
                      <span className="text-slate-300">{j.companyName}</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    {j.poster ? (
                      <Link href={`/users/${j.poster.id}`} target="_blank" className="flex items-center gap-2 hover:text-emerald-400 transition-all w-fit">
                        <img src={j.poster.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(j.poster.name)}`} alt="" className="w-5 h-5 rounded-full object-cover ring-1 ring-white/10" />
                        <span className="text-white font-bold">{j.poster.name}</span>
                      </Link>
                    ) : (
                      <span className="text-slate-500 italic">Deleted user</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-500/10 text-teal-400">{j.employmentType || j.type || "N/A"}</span>
                  </td>
                  <td className="p-3.5 text-slate-400 tabular-nums">{j.createdAt ? new Date(j.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "-"}</td>
                  <td className="p-3.5 text-center">
                    <button onClick={() => handleDelete(j.id)} title="Delete job" className="text-red-500/60 hover:text-red-400 transition-all p-1.5 hover:bg-red-500/10 rounded-lg cursor-pointer">
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
