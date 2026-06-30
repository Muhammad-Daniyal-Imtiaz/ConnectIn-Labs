"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ShieldAlert, Loader2, Lock, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.email) { router.push("/login"); return; }
    const adminEmails = ["daniyalimtiaz041@gmail.com", "indusfoundryventures@gmail.com"];
    if (!adminEmails.includes(session.user.email.toLowerCase().trim())) { router.push("/"); return; }
    if (sessionStorage.getItem("admin_authenticated") === "true") { router.push("/admin/dashboard"); }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem("admin_authenticated", "true");
        router.push("/admin/dashboard");
      } else {
        setError("Invalid admin password.");
      }
    } catch {
      setError("Failed to verify. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#04060c] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#04060c] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-[#0c111d] border border-white/10 rounded-3xl p-6 sm:p-8">
        <h1 className="text-xl font-black text-white text-center mb-2 uppercase tracking-wider">Admin Access</h1>
        <p className="text-xs text-slate-400 text-center mb-6 font-semibold">
          Enter the admin password to continue
        </p>
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/25 rounded-2xl flex items-center gap-2 text-xs text-red-400 font-bold">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="password"
              required
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#05070c] border border-white/5 text-white placeholder-slate-600 text-xs font-semibold rounded-xl focus:outline-none focus:border-emerald-500/30 transition-all outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black uppercase text-xs py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Access Dashboard</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
        <button
          onClick={() => { router.push("/"); }}
          className="mt-4 w-full text-center text-xs text-slate-500 hover:text-slate-300 font-bold transition-all cursor-pointer"
        >
          Back to site
        </button>
      </div>
    </div>
  );
}
