"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, Loader2, Target, Calendar, MapPin, Users, DollarSign, Building2 } from "lucide-react";
import { createChallenge, updateChallenge } from "@/app/actions/challenges";
import { motion } from "framer-motion";

interface PostChallengeModalProps {
  onClose: () => void;
  onCreated: (challenge: any) => void;
  companies: any[];
  editChallenge?: any;
}

export default function PostChallengeModal({ onClose, onCreated, companies, editChallenge }: PostChallengeModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formCompany, setFormCompany] = useState(editChallenge?.companyPageId || (companies.length > 0 ? companies[0].id : ""));
  const [formTitle, setFormTitle] = useState(editChallenge?.title || "");
  const [formCategory, setFormCategory] = useState(editChallenge?.category || "Engineering");
  const [formPrize, setFormPrize] = useState(editChallenge?.prize || "");
  const [formDuration, setFormDuration] = useState(editChallenge?.duration || "");
  const [formLocation, setFormLocation] = useState(editChallenge?.location || "");
  const [formMinTeam, setFormMinTeam] = useState(editChallenge?.minTeamMembers || 1);
  const [formMaxTeam, setFormMaxTeam] = useState(editChallenge?.maxTeamMembers || 5);
  const [formDesc, setFormDesc] = useState(editChallenge?.description || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany) {
      setError("Please select a company to post this challenge.");
      return;
    }
    
    setError("");
    setSubmitting(true);

    const fd = new FormData();
    fd.append("companyPageId", formCompany);
    fd.append("title", formTitle);
    fd.append("category", formCategory);
    fd.append("prize", formPrize);
    fd.append("duration", formDuration);
    fd.append("location", formLocation);
    fd.append("minTeamMembers", formMinTeam.toString());
    fd.append("maxTeamMembers", formMaxTeam.toString());
    fd.append("description", formDesc);

    let res;
    if (editChallenge) {
      res = await updateChallenge(editChallenge.id, fd);
    } else {
      res = await createChallenge(fd);
    }

    setSubmitting(false);

    if (res.success && res.challenge) {
      onCreated(res.challenge);
    } else {
      setError(res.error || "Failed to save challenge.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#1d2226] border border-[#38434f] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="relative px-6 py-5 border-b border-white/5 bg-gradient-to-r from-violet-500/10 to-transparent shrink-0">
          <button onClick={onClose} className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-6 h-6 text-violet-400" />
            <h2 className="text-xl font-black text-white">{editChallenge ? "Edit Challenge" : "Post a New Challenge"}</h2>
          </div>
          <p className="text-xs text-slate-400 font-medium">Create engineering bottlenecks for the community to solve.</p>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
              {error}
            </div>
          )}
          
          <form id="challengeForm" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Posting Company *</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <select 
                    required 
                    value={formCompany} 
                    onChange={e => setFormCompany(e.target.value)} 
                    disabled={!!editChallenge}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white focus:border-violet-500/50 outline-none appearance-none disabled:opacity-50"
                  >
                    <option value="" disabled>Select a Company</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Challenge Title *</label>
                <input 
                  required 
                  value={formTitle} 
                  onChange={e => setFormTitle(e.target.value)} 
                  placeholder="e.g. Optimize our ML Pipeline"
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-violet-500/50 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Prize / Incentive *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input 
                    required 
                    value={formPrize} 
                    onChange={e => setFormPrize(e.target.value)} 
                    placeholder="e.g. PKR 500,000"
                    className="w-full bg-slate-900 border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white focus:border-violet-500/50 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Duration *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input 
                    required 
                    value={formDuration} 
                    onChange={e => setFormDuration(e.target.value)} 
                    placeholder="e.g. 48 Hours, 2 Weeks"
                    className="w-full bg-slate-900 border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white focus:border-violet-500/50 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input 
                    required 
                    value={formLocation} 
                    onChange={e => setFormLocation(e.target.value)} 
                    placeholder="e.g. Remote, Lahore"
                    className="w-full bg-slate-900 border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white focus:border-violet-500/50 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Category *</label>
                <select 
                  value={formCategory} 
                  onChange={e => setFormCategory(e.target.value)} 
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-violet-500/50 outline-none"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="AI / ML">AI / ML</option>
                  <option value="Hardware / Robotics">Hardware / Robotics</option>
                  <option value="Design / UX">Design / UX</option>
                  <option value="Data Science">Data Science</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1"><Users className="w-3 h-3"/> Min Team</label>
                <input 
                  type="number" min="1" required 
                  value={formMinTeam} 
                  onChange={e => setFormMinTeam(parseInt(e.target.value))} 
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-violet-500/50 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1"><Users className="w-3 h-3"/> Max Team</label>
                <input 
                  type="number" min="1" required 
                  value={formMaxTeam} 
                  onChange={e => setFormMaxTeam(parseInt(e.target.value))} 
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-violet-500/50 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Challenge Description & Requirements *</label>
              <textarea 
                required 
                rows={5}
                value={formDesc} 
                onChange={e => setFormDesc(e.target.value)} 
                placeholder="Detail the technical bottleneck, expected deliverables, and any specific technologies required..."
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-violet-500/50 outline-none resize-none leading-relaxed"
              />
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-white/5 bg-[#1d2226] shrink-0 flex items-center gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-all">Cancel</button>
          <button
            type="submit"
            form="challengeForm"
            disabled={submitting}
            className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <><Sparkles className="w-4 h-4" /> {editChallenge ? "Save Changes" : "Post Challenge"}</>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
