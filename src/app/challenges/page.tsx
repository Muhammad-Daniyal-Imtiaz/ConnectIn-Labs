"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { Target, Search, Plus, Trophy, Calendar, MapPin, Users, Loader2, AlertCircle, Building2, Zap, Edit } from "lucide-react";
import { getAllChallenges } from "@/app/actions/challenges";
import { getMyCompanyPages } from "@/app/actions/company";
import PostChallengeModal from "@/components/PostChallengeModal";

export default function ChallengesPage() {
  const { data: session } = useSession();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const [showPostModal, setShowPostModal] = useState(false);
  const [editChallenge, setEditChallenge] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [chalRes, compRes] = await Promise.all([
          getAllChallenges(),
          session ? getMyCompanyPages() : Promise.resolve({ success: true, pages: [] })
        ]);
        if (chalRes.success && chalRes.challenges) {
          setChallenges(chalRes.challenges);
        }
        if (compRes.success && compRes.pages) {
          setCompanies(compRes.pages);
        }
      } catch (err) {
        console.error("Error loading challenges:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [session]);

  const filteredChallenges = challenges.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = selectedTag === "All" || c.category === selectedTag;

    return matchesSearch && matchesTag;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  const currentUserEmail = session?.user?.email?.toLowerCase().trim();

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[#f8fafc] py-12 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[140px] pointer-events-none animate-pulse-glow"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] rounded-full bg-amber-500/5 blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 font-mono text-[10px] font-bold border border-violet-500/20 mb-4">
              <Target className="w-3.5 h-3.5" />
              MODULE 03 / COMPETITIVE ARENA
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2">
              The Challenge Arena
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Compete on real engineering bottlenecks posted by government departments and corporate partners. Secure prize capital, pilot integrations, or direct equity checks.
            </p>
          </div>

          <button 
            onClick={() => {
              if (!session) {
                alert("Please log in to post a challenge.");
                return;
              }
              if (companies.length === 0) {
                alert("You must create a Company Page first before posting a challenge.");
                return;
              }
              setEditChallenge(null);
              setShowPostModal(true);
            }}
            className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-violet-600/20 flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            Post a Challenge
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search bottlenecks (e.g. Traffic API, Hardware)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1d2226] border border-[#38434f] text-white placeholder-slate-500 text-xs font-semibold focus:outline-none focus:border-violet-500/50"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#1d2226] p-1 rounded-lg border border-[#38434f] text-xs overflow-x-auto shrink-0">
            {['All', 'Engineering', 'AI / ML', 'Hardware / Robotics', 'Data Science'].map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all whitespace-nowrap ${
                  selectedTag === tag 
                    ? "bg-slate-800 text-violet-400 border border-violet-500/30 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Challenge List */}
        <div className="space-y-6 mb-16">
          {filteredChallenges.length === 0 ? (
            <div className="text-center py-16 bg-[#1d2226] border border-[#38434f] rounded-2xl">
              <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-white text-sm font-bold">No active challenges found.</p>
              <p className="text-xs text-slate-500 mt-1">Check back later or post one yourself.</p>
            </div>
          ) : (
            filteredChallenges.map(challenge => {
              const isOwner = companies.some(c => c.id === challenge.companyPageId);
              
              return (
                <div 
                  key={challenge.id}
                  className="bg-[#1d2226] p-6 rounded-2xl border border-[#38434f] hover:border-violet-500/30 transition-all flex flex-col md:flex-row justify-between gap-6 relative group"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {challenge.companyLogo ? (
                        <img src={challenge.companyLogo} alt={challenge.companyName} className="w-5 h-5 rounded-md object-cover bg-slate-800" />
                      ) : (
                        <Building2 className="w-5 h-5 text-slate-400" />
                      )}
                      <span className="text-xs font-bold text-slate-300">{challenge.companyName}</span>
                      <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20 ml-2">
                        {challenge.category}
                      </span>
                      {challenge.status === "Open" ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          {challenge.status}
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-xl text-white tracking-wide mb-3">{challenge.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-5 max-w-3xl whitespace-pre-line">{challenge.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-400">
                      <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-white/5">
                        <Calendar className="w-3.5 h-3.5 text-violet-400" /> Duration: {challenge.duration}
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-white/5">
                        <MapPin className="w-3.5 h-3.5 text-violet-400" /> {challenge.location}
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-white/5">
                        <Users className="w-3.5 h-3.5 text-violet-400" /> Team: {challenge.minTeamMembers}-{challenge.maxTeamMembers}
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-72 bg-slate-900 p-5 rounded-xl border border-white/5 flex flex-col justify-center shrink-0 items-center text-center">
                    <Trophy className="w-8 h-8 text-amber-400 mb-3 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Prize / Incentive</p>
                    <p className="text-base font-extrabold text-amber-400">{challenge.prize}</p>

                    <div className="w-full flex gap-2 mt-6">
                      {isOwner && (
                        <button 
                          onClick={() => { setEditChallenge(challenge); setShowPostModal(true); }}
                          className="flex-1 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all border border-white/10 flex items-center justify-center gap-1.5"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                      )}
                      <button 
                        onClick={() => alert(`Entering challenge Arena for ${challenge.title}...`)}
                        className="flex-[2] py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-violet-600/20"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" /> Compete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <AnimatePresence>
        {showPostModal && (
          <PostChallengeModal 
            onClose={() => { setShowPostModal(false); setEditChallenge(null); }}
            onCreated={(c) => {
              if (editChallenge) {
                setChallenges(prev => prev.map(ch => ch.id === c.id ? c : ch));
              } else {
                setChallenges(prev => [c, ...prev]);
              }
              setShowPostModal(false);
              setEditChallenge(null);
            }}
            companies={companies}
            editChallenge={editChallenge}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
