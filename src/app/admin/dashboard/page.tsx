"use client";

import React, { useEffect, useState } from "react";
import { getAdminStats } from "@/app/actions/admin";
import { Loader2, Users, FileText, Briefcase, Building2, Trophy, ShoppingBag, Code, Link2, Heart, Send } from "lucide-react";

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

  const cards = [
    { label: "Users", value: stats.users, icon: Users, color: "text-blue-400 bg-blue-500/10" },
    { label: "Posts", value: stats.posts, icon: FileText, color: "text-emerald-400 bg-emerald-500/10" },
    { label: "Jobs", value: stats.jobs, icon: Briefcase, color: "text-teal-400 bg-teal-500/10" },
    { label: "Companies", value: stats.companies, icon: Building2, color: "text-cyan-400 bg-cyan-500/10" },
    { label: "Challenges", value: stats.challenges, icon: Trophy, color: "text-rose-400 bg-rose-500/10" },
    { label: "MVPs", value: stats.mvps, icon: ShoppingBag, color: "text-indigo-400 bg-indigo-500/10" },
    { label: "Freelance", value: stats.freelance, icon: Code, color: "text-purple-400 bg-purple-500/10" },
    { label: "Connections", value: stats.connections, icon: Link2, color: "text-amber-400 bg-amber-500/10" },
    { label: "Follows", value: stats.follows, icon: Heart, color: "text-pink-400 bg-pink-500/10" },
    { label: "Applications", value: stats.applications, icon: Send, color: "text-orange-400 bg-orange-500/10" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-6 uppercase tracking-wider">Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="bg-[#0c111d] border border-white/5 rounded-2xl p-4">
            <div className={`inline-flex p-2 rounded-lg ${c.color} mb-3`}>
              <c.icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-white">{c.value.toLocaleString()}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
