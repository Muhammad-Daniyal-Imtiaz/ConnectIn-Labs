"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, LayoutDashboard, Users, MessageSquare, Briefcase, Building2, Trophy, LogOut, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

const adminEmails = ["daniyalimtiaz041@gmail.com", "indusfoundryventures@gmail.com"];

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/posts", label: "Posts", icon: MessageSquare },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { href: "/admin/companies", label: "Companies", icon: Building2 },
  { href: "/admin/challenges", label: "Challenges", icon: Trophy },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    const email = session?.user?.email?.toLowerCase().trim();
    if (!email || !adminEmails.includes(email)) {
      router.push("/");
      return;
    }

    if (pathname === "/admin/login") {
      setChecking(false);
      return;
    }

    const adminPass = sessionStorage.getItem("admin_authenticated");
    if (adminPass !== "true") {
      router.push("/admin/login");
      return;
    }

    setAuthed(true);
    setChecking(false);
  }, [status, session, router, pathname]);

  if (status === "loading" || checking) {
    return (
      <div className="min-h-screen bg-[#04060c] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <p className="text-xs text-slate-500 font-bold">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-[#04060c] flex">
      <aside className="w-64 bg-[#0a0f1a] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-5 border-b border-white/5">
          <Link href="/admin/dashboard" className="text-base font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2.5">
            <Shield className="w-4 h-4" />
            <span>Admin</span>
          </Link>
          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mt-1.5 ml-1.5">Content Management</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map((item) => (
            <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} pathname={pathname} />
          ))}
        </nav>
        <div className="p-3 border-t border-white/5 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[11px] font-bold text-slate-500 hover:text-slate-300 px-3 py-2 rounded-lg hover:bg-white/5 transition-all w-full"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Site
          </Link>
          <button
            onClick={() => { sessionStorage.removeItem("admin_authenticated"); router.push("/"); }}
            className="flex items-center gap-2.5 text-[11px] font-bold text-red-400/70 hover:text-red-400 px-3 py-2 rounded-lg hover:bg-red-500/5 transition-all w-full cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Exit Admin
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}

function NavItem({ href, label, icon: Icon, pathname }: { href: string; label: string; icon: any; pathname: string }) {
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 text-xs font-bold px-3 py-2.5 rounded-xl transition-all ${
        active
          ? "bg-emerald-500/10 text-emerald-400 shadow-sm shadow-emerald-500/5"
          : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
      {active && <div className="ml-auto w-1 h-1 rounded-full bg-emerald-400" />}
    </Link>
  );
}
