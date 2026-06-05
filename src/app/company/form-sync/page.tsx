"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Building2, Upload, Globe, X as XIcon, Link2, MapPin,
  ChevronRight, AlertCircle, CheckCircle2, Loader2,
  Plus, X, Users, Calendar, Briefcase, Tag
} from "lucide-react";
import { getMyCompanyPage, updateCompanyPage } from "@/app/actions/company";

const INDUSTRIES = ["AI", "SaaS", "Fintech", "Robotics", "Semiconductors", "EdTech", "HealthTech", "AgriTech", "CleanTech", "E-commerce", "Cybersecurity", "Blockchain", "Other"];
const SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"];
const STAGES = ["Idea", "Startup", "Growth", "Scale-up", "Enterprise"];

export default function EditCompanyPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loadingPage, setLoadingPage] = useState(true);
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [pageId, setPageId] = useState("");

  const [form, setForm] = useState({
    name: "", tagline: "", about: "", industry: "", companySize: "",
    stage: "Startup", founded: "", headquarters: "", website: "",
    linkedinUrl: "", twitterUrl: "", logoUrl: "", bannerUrl: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  useEffect(() => {
    async function load() {
      if (status === "loading") return;
      if (!session) { router.push("/login"); return; }
      const res = await getMyCompanyPage();
      if (!res.success || !res.page) {
        router.push("/company/create");
        return;
      }
      const p = res.page;
      setPageId(p.id);
      setForm({
        name: p.name || "",
        tagline: p.tagline || "",
        about: p.about || "",
        industry: p.industry || "",
        companySize: p.companySize || "",
        stage: p.stage || "Startup",
        founded: p.founded || "",
        headquarters: p.headquarters || "",
        website: p.website || "",
        linkedinUrl: p.linkedinUrl || "",
        twitterUrl: p.twitterUrl || "",
        logoUrl: p.logoUrl || "",
        bannerUrl: p.bannerUrl || "",
      });
      setSpecialties(p.specialties || []);
      setLoadingPage(false);
    }
    load();
  }, [session, status, router]);

  const addSpecialty = () => {
    const s = specialty.trim();
    if (s && !specialties.includes(s) && specialties.length < 10) {
      setSpecialties((p) => [...p, s]);
      setSpecialty("");
    }
  };

  const handleSubmit = async () => {
    setError("");
    setSaving(true);
    const fd = new FormData();
    fd.append("pageId", pageId);
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append("specialties", JSON.stringify(specialties));

    const res = await updateCompanyPage(fd);
    setSaving(false);
    if (res.success) {
      router.push(`/company/${res.slug}`);
    } else {
      setError(res.error || "Failed to update page.");
    }
  };

  if (status === "loading" || loadingPage) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  const totalSteps = 3;
  const canProceed1 = form.name && form.tagline && form.industry && form.companySize;
  const canProceed2 = form.about;

  return (
    <div className="min-h-screen bg-[var(--background)] text-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/company" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-bold transition-all mb-6">
            <ChevronRight className="w-3.5 h-3.5 rotate-180" /> Back to Companies
          </Link>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[9px] font-black border border-emerald-500/20 mb-3 uppercase tracking-widest">
            <Building2 className="w-3 h-3" /> Edit Company Page
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Sync Your Company Presence</h1>
          <p className="text-slate-400 text-xs mt-1">Update your company details, branding, and public profile.</p>
        </div>

        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <React.Fragment key={i}>
              <div className={`flex items-center gap-1.5 text-xs font-bold transition-all ${step > i + 1 ? "text-emerald-400" : step === i + 1 ? "text-white" : "text-slate-600"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${step > i + 1 ? "bg-emerald-500 text-slate-950" : step === i + 1 ? "bg-slate-800 border border-emerald-500 text-emerald-400" : "bg-slate-900 border border-white/10 text-slate-600"}`}>
                  {step > i + 1 ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className="hidden sm:inline">{["Basics", "About", "Links"][i]}</span>
              </div>
              {i < totalSteps - 1 && <div className={`flex-1 h-px transition-all ${step > i + 1 ? "bg-emerald-500/50" : "bg-white/10"}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-[#1d2226] border border-[#38434f] rounded-xl p-6 shadow-xl">
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-white">Company Basics</h2>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Company Name *</label>
                <input value={form.name} onChange={set("name")} maxLength={80}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
                  placeholder="e.g. Nexus AI Technologies" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Tagline *</label>
                <input value={form.tagline} onChange={set("tagline")} maxLength={120}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
                  placeholder="e.g. Building AI infrastructure for South Asia" />
                <p className="text-[10px] text-slate-500 mt-1">{form.tagline.length}/120</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Industry *</label>
                  <select value={form.industry} onChange={set("industry")}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all">
                    <option value="">Select industry</option>
                    {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Company Size *</label>
                  <select value={form.companySize} onChange={set("companySize")}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all">
                    <option value="">Select size</option>
                    {SIZES.map((s) => <option key={s} value={s}>{s} employees</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Stage</label>
                  <select value={form.stage} onChange={set("stage")}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all">
                    {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Founded Year</label>
                  <input value={form.founded} onChange={set("founded")} type="number" min="1900" max="2026"
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
                    placeholder="2024" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Headquarters</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input value={form.headquarters} onChange={set("headquarters")}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
                    placeholder="Lahore, Pakistan" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Specialties <span className="text-slate-500 font-normal">(up to 10)</span></label>
                <div className="flex gap-2 mb-2">
                  <input value={specialty} onChange={(e) => setSpecialty(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSpecialty())}
                    className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
                    placeholder="e.g. Machine Learning, NLP" />
                  <button onClick={addSpecialty} type="button"
                    className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {specialties.map((s) => (
                      <span key={s} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 border border-white/10 text-xs text-slate-300">
                        {s}
                        <button onClick={() => setSpecialties((p) => p.filter((x) => x !== s))} className="text-slate-500 hover:text-red-400 transition-all cursor-pointer"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={() => setStep(2)} disabled={!canProceed1}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 text-sm font-black transition-all cursor-pointer">
                Continue <ChevronRight className="inline w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-white">About Your Company</h2>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Company Description *</label>
                <textarea value={form.about} onChange={set("about")} rows={6} maxLength={2000}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all resize-none"
                  placeholder="Tell the ecosystem about your company..." />
                <p className="text-[10px] text-slate-500 mt-1">{form.about.length}/2000</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Logo URL</label>
                <div className="relative">
                  <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input value={form.logoUrl} onChange={set("logoUrl")}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
                    placeholder="https://..." />
                </div>
                {form.logoUrl && (
                  <img src={form.logoUrl} alt="logo preview" className="mt-2 w-16 h-16 rounded-xl object-cover border border-white/10" onError={(e) => (e.currentTarget.style.display = "none")} />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Banner URL</label>
                <div className="relative">
                  <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input value={form.bannerUrl} onChange={set("bannerUrl")}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
                    placeholder="https://..." />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl bg-slate-800 border border-white/10 text-slate-300 text-sm font-bold hover:bg-slate-700 transition-all cursor-pointer">Back</button>
                <button onClick={() => setStep(3)} disabled={!canProceed2}
                  className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 text-sm font-black transition-all cursor-pointer">
                  Continue <ChevronRight className="inline w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-white">Online Presence</h2>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input value={form.website} onChange={set("website")}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
                    placeholder="https://yourcompany.com" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">LinkedIn URL</label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input value={form.linkedinUrl} onChange={set("linkedinUrl")}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
                    placeholder="https://linkedin.com/company/..." />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Twitter / X</label>
                <div className="relative">
                  <XIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input value={form.twitterUrl} onChange={set("twitterUrl")}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
                    placeholder="https://x.com/..." />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl bg-slate-800 border border-white/10 text-slate-300 text-sm font-bold hover:bg-slate-700 transition-all cursor-pointer">Back</button>
                <button onClick={handleSubmit} disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer">
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><CheckCircle2 className="w-4 h-4" /> Save Changes</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
