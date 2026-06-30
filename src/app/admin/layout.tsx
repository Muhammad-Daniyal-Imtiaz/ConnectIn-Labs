"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const adminEmails = ["daniyalimtiaz041@gmail.com", "indusfoundryventures@gmail.com"];

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
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-[#04060c] flex">
      <aside className="w-64 bg-[#0c111d] border-r border-white/5 p-4 flex flex-col shrink-0">
        <Link href="/admin/dashboard" className="text-lg font-black text-emerald-400 mb-6 uppercase tracking-wider">
          Admin Panel
        </Link>
        <nav className="flex flex-col gap-1">
          <NavItem href="/admin/dashboard" label="Dashboard" pathname={pathname} />
          <NavItem href="/admin/users" label="Users" pathname={pathname} />
          <NavItem href="/admin/posts" label="Posts" pathname={pathname} />
          <NavItem href="/admin/jobs" label="Jobs" pathname={pathname} />
          <NavItem href="/admin/companies" label="Companies" pathname={pathname} />
          <NavItem href="/admin/challenges" label="Challenges" pathname={pathname} />
        </nav>
        <div className="mt-auto pt-4 border-t border-white/5">
          <button
            onClick={() => { sessionStorage.removeItem("admin_authenticated"); router.push("/"); }}
            className="text-xs text-red-400 hover:text-red-300 font-bold w-full text-left py-2"
          >
            Exit Admin
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}

function NavItem({ href, label, pathname }: { href: string; label: string; pathname: string }) {
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`text-xs font-bold px-3 py-2 rounded-lg transition-all ${
        active ? "bg-emerald-500/10 text-emerald-400" : "text-slate-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {label}
    </Link>
  );
}
