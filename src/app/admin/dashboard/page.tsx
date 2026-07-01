"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminStats } from "@/app/actions/admin";
import { Loader2, Users, FileText, Briefcase, Building2, Trophy, ShoppingBag, Code, Link2, Heart, Send, ArrowUpRight } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminStats().then((res) => {
      if (res.success) setStats(res.stats);
      else setError(res.error || "Failed to load stats");
    }).catch(() => setError("Failed to load")).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;
  if (error) return <p className="text-red-400 text-sm font-bold">{error}</p>;
  if (!stats) return null;

  const cards: { label: string; value: number; icon: any; color: string; href: string }[] = [
    { label: "Users", value: stats.users, icon: Users, color: "text-blue-400 bg-blue-500/10 border-blue-500/20", href: "/admin/users" },
    { label: "Posts", value: stats.posts, icon: FileText, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", href: "/admin/posts" },
    { label: "Jobs", value: stats.jobs, icon: Briefcase, color: "text-teal-400 bg-teal-500/10 border-teal-500/20", href: "/admin/jobs" },
    { label: "Companies", value: stats.companies, icon: Building2, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20", href: "/admin/companies" },
    { label: "Challenges", value: stats.challenges, icon: Trophy, color: "text-rose-400 bg-rose-500/10 border-rose-500/20", href: "/admin/challenges" },
    { label: "MVPs", value: stats.mvps, icon: ShoppingBag, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20", href: "/admin/mvps" },
    { label: "Freelance", value: stats.freelance, icon: Code, color: "text-purple-400 bg-purple-500/10 border-purple-500/20", href: "/admin/freelance" },
    { label: "Connections", value: stats.connections, icon: Link2, color: "text-amber-400 bg-amber-500/10 border-amber-500/20", href: "#" },
    { label: "Follows", value: stats.follows, icon: Heart, color: "text-pink-400 bg-pink-500/10 border-pink-500/20", href: "#" },
    { label: "Applications", value: stats.applications, icon: Send, color: "text-orange-400 bg-orange-500/10 border-orange-500/20", href: "#" },
  ];

  const total = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-wider">Dashboard</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Platform overview &amp; content management</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-emerald-400 tabular-nums">{total.toLocaleString()}</p>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Records</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="group block bg-[#0c111d] border border-white/5 hover:border-white/10 rounded-2xl p-4 transition-all hover:bg-[#0f1422] hover:shadow-lg hover:shadow-black/30">
            <div className={`inline-flex p-2 rounded-lg ${c.color} mb-3 group-hover:scale-110 transition-transform`}>
              <c.icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors tabular-nums">{c.value.toLocaleString()}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{c.label}</p>
              <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-all opacity-0 group-hover:opacity-100" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
