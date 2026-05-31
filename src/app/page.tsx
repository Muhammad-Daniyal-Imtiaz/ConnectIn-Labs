"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  TrendingUp,
  Handshake,
  Building2,
  Briefcase,
  Trophy,
  Search,
  ArrowRight,
  Sparkles,
  MapPin,
  Code,
  Cpu,
  FileText,
  CheckCircle2,
  AlertCircle,
  Calendar,
  DollarSign,
  Globe,
  ChevronRight,
  GraduationCap,
  Terminal,
  Sliders,
  UserCheck,
  Play,
  Check,
  UploadCloud,
  X,
  Zap,
  Lock,
  Plus,
  ArrowUpRight
} from "lucide-react";

import {
  buildersData,
  investorsData,
  partnershipsData,
  govProgramsData,
  jobsData,
  challengesData,
  Builder,
  Investor,
  Partnership,
  GovProgram,
  Job,
  Challenge
} from "./data";

export default function Home() {
  // Navigation & Core States
  const [activeTab, setActiveTab] = useState<'teams' | 'funding' | 'partnerships' | 'gov' | 'jobs' | 'challenges'>('teams');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState<string>("All");

  // Dynamic graduates counter
  const [graduatesCount, setGraduatesCount] = useState(500000);
  const [matchesCount, setMatchesCount] = useState(12842);
  const [fundingBridged, setFundingBridged] = useState(482930400); // in PKR
  
  // Custom Modals & Dialog States
  const [selectedBuilder, setSelectedBuilder] = useState<Builder | null>(null);
  const [builderChatMsg, setBuilderChatMsg] = useState("");
  const [chatSuccess, setChatSuccess] = useState(false);

  const [pitchStep, setPitchStep] = useState(1);
  const [pitchData, setPitchData] = useState({
    idea: "",
    tech: "AI",
    teamSize: "1",
    fundingGoal: "PKR 5 Million"
  });
  const [pitchScore, setPitchScore] = useState<any>(null);
  const [showPitchModal, setShowPitchModal] = useState(false);

  // Challenge Submissions Drawer
  const [submittingChallenge, setSubmittingChallenge] = useState<Challenge | null>(null);
  const [challengeFile, setChallengeFile] = useState<string | null>(null);
  const [challengeProgress, setChallengeProgress] = useState<string[]>([]);
  const [challengeRunStatus, setChallengeRunStatus] = useState<'idle' | 'running' | 'done'>('idle');

  // Dream Team Creator
  const [dreamTeam, setDreamTeam] = useState<string[]>([]);
  const [dreamDomain, setDreamDomain] = useState<string>("AI");
  const [teamScore, setTeamScore] = useState<{
    score: number;
    feedback: string;
    strengths: string[];
    gap: string;
  } | null>(null);

  // Pathway Wizard
  const [pathwayProfile, setPathwayProfile] = useState<string | null>(null);
  const [wizardStep, setWizardStep] = useState(1);

  // Live Activity Terminal Log
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[SYSTEM] Indus Foundry Engine online. Welcome, stakeholder.",
    "[LIVE] Ayesha K. initiated cofounder matching for Agri-AI drone project.",
    "[LIVE] Zayn Capital submitted active interest in offline-payment protocols.",
    "[MATCH] Zain Ahmed connected with firmware expert for RISC-V layout.",
    "[GOV-ACCESS] Punjab Startup Fund matched 15M PKR equity to 3 deep tech builders.",
    "[CHALLENGE] PITB Smart Agri IoT Challenge received 12 new submissions today."
  ]);

  // Handle graduates real-time ticking
  useEffect(() => {
    const graduateInterval = setInterval(() => {
      setGraduatesCount(prev => prev + 1);
    }, 12000); // 1 graduate roughly every 12 seconds (~2.6M minutes a year, 500k graduates = 1 per ~5 minutes, but faster makes it interactive)

    const matchesInterval = setInterval(() => {
      setMatchesCount(prev => prev + Math.floor(Math.random() * 2));
      setFundingBridged(prev => prev + Math.floor(Math.random() * 8500));
      
      // Randomly append active terminal logs
      const liveNames = ["Usman", "Fatimah", "Hamza", "Zainab", "Ali", "Maham", "Bilal", "Sana"];
      const liveActions = [
        "submitted pitch deck to Indus Valley Capital",
        "applied to Remote Compiler Developer job role",
        "forged matching team with overseas Silicon Valley mentors",
        "submitted SystemVerilog code to RISC-V IoT Challenge",
        "passed skill-to-placement benchmark test for WebXR",
        "requested cofounder alignment meeting with Zahra B."
      ];
      const randomLog = `[LIVE] ${liveNames[Math.floor(Math.random() * liveNames.length)]} ${liveActions[Math.floor(Math.random() * liveActions.length)]}.`;
      setTerminalLogs(prev => [randomLog, ...prev.slice(0, 15)]);
    }, 8000);

    return () => {
      clearInterval(graduateInterval);
      clearInterval(matchesInterval);
    };
  }, []);

  // Filter lists based on tab & filters
  const filteredBuilders = buildersData.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesField = selectedField === "All" || b.field === selectedField;
    return matchesSearch && matchesField;
  });

  const filteredJobs = jobsData.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          j.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          j.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesField = selectedField === "All" || j.category === selectedField;
    return matchesSearch && matchesField;
  });

  const filteredChallenges = challengesData.filter(c => {
    return c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
           c.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Action Handlers
  const handleCofounderConnect = (builder: Builder) => {
    setSelectedBuilder(builder);
    setBuilderChatMsg(`Salam ${builder.name.split(' ')[0]}! I saw your profile on Indus Foundry Ventures. I'm building in the ${builder.field} space and would love to chat about cofounding.`);
    setChatSuccess(false);
  };

  const submitBuilderChat = () => {
    setChatSuccess(true);
    setTimeout(() => {
      setSelectedBuilder(null);
      setChatSuccess(false);
      // Log to terminal
      setTerminalLogs(prev => [
        `[MATCH-REQUEST] Cofounder connection request sent to ${selectedBuilder?.name}!`,
        ...prev
      ]);
    }, 2000);
  };

  const handleFundPitch = (e: React.FormEvent) => {
    e.preventDefault();
    setPitchStep(2);
    // Evaluate mock funding alignment score
    setTimeout(() => {
      let score = 75;
      let matchedInvestors: string[] = [];
      
      if (pitchData.tech === "AI" || pitchData.tech === "Deep Tech" || pitchData.tech === "Semiconductors") {
        score += 18;
        matchedInvestors = ["Indus Valley Capital", "Sarmayacar", "Pakistan Startup Fund"];
      } else {
        score += 8;
        matchedInvestors = ["Karavan", "Zayn Capital"];
      }

      if (parseInt(pitchData.teamSize) > 1) score += 5;

      setPitchScore({
        score: Math.min(score, 99),
        probability: score > 90 ? "High Alignment" : score > 75 ? "Moderate Alignment" : "Needs Refinement",
        recommendation: `Your deep tech application in ${pitchData.tech} matches high-priority government matching funds. We recommend pinning your deck directly to the Pakistan Startup Fund portal.`,
        investors: matchedInvestors
      });
      setPitchStep(3);
    }, 1500);
  };

  // Submit Challenge File Simulation
  const triggerChallengeRun = () => {
    if (!challengeFile) return;
    setChallengeRunStatus('running');
    setChallengeProgress([
      "Initializing Sandbox Environment...",
      "Cloning submission repository...",
      "Scanning architecture & compiling dependencies..."
    ]);

    setTimeout(() => {
      setChallengeProgress(prev => [...prev, "Running unit test suites...", "Analyzing edge performance benchmarks..."]);
    }, 1200);

    setTimeout(() => {
      setChallengeProgress(prev => [...prev, "✔ Verification Complete!", "No security vulnerabilities found.", "Compilation Status: SUCCESS", "Matches 98% of performance thresholds!"]);
      setChallengeRunStatus('done');
      
      // Update logs
      setTerminalLogs(prev => [
        `[CHALLENGE-SUBMIT] Evaluated and verified RTL/Code entry for: ${submittingChallenge?.title}`,
        ...prev
      ]);
    }, 2500);
  };

  // Assess dream team viability
  const assessDreamTeam = () => {
    if (dreamTeam.length === 0) return;
    let score = 40;
    const hasTechnical = dreamTeam.includes("Scientist") || dreamTeam.includes("Hardware") || dreamTeam.includes("Engineer");
    const hasBusiness = dreamTeam.includes("Growth") || dreamTeam.includes("Product");
    const teamSize = dreamTeam.length;

    if (hasTechnical) score += 25;
    if (hasBusiness) score += 20;
    if (teamSize >= 2 && teamSize <= 3) score += 15;
    
    // Customize feedback based on domain
    let feedback = "";
    let strengths: string[] = [];
    let gap = "";

    if (dreamDomain === "Semiconductors") {
      if (!dreamTeam.includes("Hardware")) {
        score -= 20;
        gap = "Missing a VLSI / Hardware Layout Expert. Highly recommended for physical IC layout verification.";
      } else {
        strengths.push("Excellent hardware micro-architecture baseline.");
      }
      feedback = "Semiconductor ventures require heavy CapEx. Ensure your founding team has strong technical validation before pitching HEC/MoITT grants.";
    } else if (dreamDomain === "AI") {
      if (!dreamTeam.includes("Scientist")) {
        score -= 15;
        gap = "Missing a dedicated AI/ML Research Lead. Highly needed for custom weights and token optimizations.";
      } else {
        strengths.push("Solid foundation in PyTorch and Core AI model building.");
      }
      feedback = "AI SaaS startups scale quickly. Your tech expertise is vital, but don't overlook local enterprise pilot agreements.";
    } else {
      feedback = "SaaS startups are highly reliant on rapid user feedback. Keep iteration cycles short and build with modular, responsive tools.";
    }

    if (hasTechnical && hasBusiness) strengths.push("Balanced technical-commercial leadership.");
    if (teamSize > 4) {
      score -= 10;
      gap = "Founding team is too large. Early dilution could hamper future VC investment capability.";
    }

    setTeamScore({
      score: Math.min(score, 100),
      feedback,
      strengths: strengths.length > 0 ? strengths : ["Early roles defined"],
      gap: gap || "Looking extremely balanced! Ready to register on PITB Sandbox."
    });
  };

  // Toggle roles in dream team creator
  const toggleRoleInDreamTeam = (role: string) => {
    if (dreamTeam.includes(role)) {
      setDreamTeam(prev => prev.filter(r => r !== role));
    } else {
      setDreamTeam(prev => [...prev, role]);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#060913] text-[#f8fafc] font-sans selection:bg-[#10b981] selection:text-black overflow-hidden bg-grid-pattern">
      {/* Decorative Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse-glow pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/5 blur-[120px] animate-pulse-glow pointer-events-none"></div>

      {/* 1. floating Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#060913]/85 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">
              I
              <div className="absolute inset-0 rounded-xl border border-white/20 animate-pulse"></div>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                INDUS FOUNDRY <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono tracking-widest border border-emerald-500/20">VENTURES</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider">PAKISTAN'S STARTUP & JOBS ENGINE</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/60 p-1.5 rounded-full border border-white/5">
            {[
              { id: 'teams', label: 'Teams', icon: Users },
              { id: 'funding', label: 'Funding', icon: TrendingUp },
              { id: 'partnerships', label: 'Partnerships', icon: Handshake },
              { id: 'gov', label: 'Government', icon: Building2 },
              { id: 'jobs', label: 'Jobs', icon: Briefcase },
              { id: 'challenges', label: 'Challenges', icon: Trophy },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    const element = document.getElementById("forge-workspace");
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/25"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setPathwayProfile(null);
                setWizardStep(1);
                const element = document.getElementById("pathway-wizard");
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="relative group hidden sm:inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-slate-900 border border-emerald-500/30 text-emerald-400 hover:text-white hover:bg-emerald-500/10 text-xs font-bold transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              Pathway Matcher
            </button>
            
            <button 
              onClick={() => setShowPitchModal(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 text-xs font-bold px-4 py-2 rounded-lg hover:from-emerald-400 hover:to-teal-500 transition-all shadow-md shadow-emerald-500/15 flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              Pitch Seed Deck
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 px-6 max-w-7xl mx-auto border-b border-white/5">
        {/* Animated Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-emerald-500/25 shadow-lg shadow-emerald-500/5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-widest font-mono text-emerald-400">PAKISTAN'S DEEP TECH FORGING ENGINE</span>
          </div>
        </div>

        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight text-white mb-6">
            Forging Pakistan's Future. <br />
            <span className="text-gradient-emerald">Talent, Capital & Tech.</span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Pakistan produces <span className="text-emerald-400 font-semibold underline decoration-emerald-500/40 underline-offset-4">500,000+ graduates yearly</span> — but too many remain unemployed because talent, opportunity, and capital never meet. We bridge the gap.
          </p>

          {/* Quick Metrics Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
            <div className="glass-panel p-5 rounded-2xl border border-white/5 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-red-500/40"></div>
              <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1">New Graduates This Year</p>
              <div className="text-2xl sm:text-3xl font-extrabold text-red-400 font-mono tracking-tight flex items-center justify-center gap-1.5">
                {graduatesCount.toLocaleString()}
                <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-normal animate-pulse">+1</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Critical pool of untapped builder talent</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/5 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500/40"></div>
              <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1">Cofounders & Teams Forged</p>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
                {matchesCount.toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-500 mt-2">AI, Robotics, & Semiconductor matches</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/5 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-amber-500/40"></div>
              <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1">Venture Funding Bridged</p>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
                PKR {(fundingBridged / 1000000).toFixed(1)}M
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Active matching with VC & Gov Grants</p>
            </div>
          </div>

          {/* Quick CTA cluster */}
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="#forge-workspace" 
              className="bg-emerald-500 text-slate-950 font-extrabold px-8 py-3.5 rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 text-sm tracking-wide flex items-center gap-2"
            >
              Explore Stakeholder Portals
              <ArrowRight className="w-4 h-4" />
            </a>
            <a 
              href="#dream-team" 
              className="bg-slate-900 border border-white/10 hover:border-white/20 text-white font-bold px-8 py-3.5 rounded-xl transition-all text-sm tracking-wide flex items-center gap-2"
            >
              Cofounder Simulator
              <Sliders className="w-4 h-4 text-emerald-400" />
            </a>
          </div>
        </div>
      </section>

      {/* Live Activity Marquee Ticker */}
      <div className="w-full bg-slate-950/60 border-y border-white/5 py-3 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1 font-bold text-emerald-400 tracking-wider uppercase whitespace-nowrap">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
            LIVE NETWORKS:
          </span>
          <div className="flex gap-12 animate-marquee whitespace-nowrap overflow-x-hidden text-slate-300">
            {terminalLogs.slice(0, 3).map((log, idx) => (
              <span key={idx} className="font-mono text-slate-300 flex items-center gap-2">
                <span className="text-[10px] text-emerald-500">▶</span>
                {log}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. The Core Workspace (The Stakeholders Forge) */}
      <section id="forge-workspace" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold tracking-widest uppercase mb-2">
              <span className="p-1 rounded bg-emerald-500/10"><Cpu className="w-3.5 h-3.5" /></span>
              WHAT WE FORGE
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              One Engine. Every Stakeholder.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              From unemployed to employed, founder to funded, challenge to contract. Explore our active modules below.
            </p>
          </div>

          {/* Search and Category filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search cofounders, jobs, agencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-lg bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs font-semibold focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Field selector */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-white/10 text-xs">
              {['All', 'AI', 'SaaS', 'Semiconductors', 'Robotics', 'Fintech'].map(field => (
                <button
                  key={field}
                  onClick={() => setSelectedField(field)}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                    selectedField === field 
                      ? "bg-slate-800 text-emerald-400 border border-emerald-500/20 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {field}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modular Grid Navigation Panels (Sleek visual tabs) */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-10">
          {[
            { id: 'teams', label: 'Teams', count: filteredBuilders.length, desc: 'Cofounder Matching', icon: Users, color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' },
            { id: 'funding', label: 'Funding', count: investorsData.length, desc: 'VC & Grant Bridges', icon: TrendingUp, color: 'border-amber-500/30 text-amber-400 bg-amber-500/5' },
            { id: 'partnerships', label: 'Partnerships', count: partnershipsData.length, desc: 'Corporate Alliances', icon: Handshake, color: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' },
            { id: 'gov', label: 'Gov Access', count: govProgramsData.length, desc: 'HEC & PSF Portals', icon: Building2, color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5' },
            { id: 'jobs', label: 'Jobs', count: filteredJobs.length, desc: 'Skill Placement', icon: Briefcase, color: 'border-emerald-500/30 text-teal-400 bg-teal-500/5' },
            { id: 'challenges', label: 'Challenges', count: challengesData.length, desc: 'Prizes & Contracts', icon: Trophy, color: 'border-rose-500/30 text-rose-400 bg-rose-500/5' },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSearchTerm("");
                }}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-32 transition-all duration-300 relative group cursor-pointer ${
                  isActive 
                    ? `bg-slate-900/80 ${tab.color.split(' ')[0]} shadow-lg shadow-emerald-500/5 scale-[1.02]`
                    : 'bg-slate-950/40 border-white/5 hover:bg-slate-900/40 hover:border-white/10'
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <div className={`p-2 rounded-xl bg-slate-900 border border-white/5 ${isActive ? tab.color.split(' ')[1] : 'text-slate-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-white/5">
                    {tab.count} Active
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white tracking-wide">{tab.label}</h4>
                  <p className="text-[10px] text-slate-400 font-medium tracking-wide leading-tight mt-0.5">{tab.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content Area with smooth transition */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/5 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {/* TAB 1: TEAMS */}
              {activeTab === 'teams' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                        👥 Cofounder Matching for Builders
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Connect with specialized Pakistani developers, hardware designers, and growth hackers. Filtered by domains.
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        const elem = document.getElementById("dream-team");
                        elem?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold hover:bg-emerald-500/20 transition-all"
                    >
                      <Sliders className="w-3.5 h-3.5 animate-pulse" />
                      Assemble Team Simulation
                    </button>
                  </div>

                  {filteredBuilders.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl">
                      <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm font-semibold">No builders found matching "{searchTerm}"</p>
                      <button onClick={() => { setSearchTerm(""); setSelectedField("All"); }} className="text-xs text-emerald-400 mt-2 underline">Clear all filters</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredBuilders.map(builder => (
                        <div 
                          key={builder.id} 
                          className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden hover:border-emerald-500/30 transition-all duration-350 flex flex-col justify-between"
                        >
                          {/* Match tag */}
                          <div className="absolute top-4 right-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <Sparkles className="w-2.5 h-2.5" />
                            {builder.matchScore}% Match
                          </div>

                          <div>
                            {/* Profile Header */}
                            <div className="flex gap-4 items-center mb-4">
                              <img 
                                src={builder.avatar} 
                                alt={builder.name} 
                                className="w-12 h-12 rounded-xl object-cover border border-white/10"
                              />
                              <div>
                                <h4 className="font-extrabold text-sm text-white tracking-wide">{builder.name}</h4>
                                <p className="text-[11px] text-slate-400 font-medium">{builder.role}</p>
                              </div>
                            </div>

                            {/* Location & category */}
                            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold mb-3">
                              <span className="flex items-center gap-1 text-slate-400 bg-slate-900 border border-white/5 px-2 py-0.5 rounded">
                                <MapPin className="w-3 h-3 text-emerald-400" />
                                {builder.city}
                              </span>
                              <span className="flex items-center gap-1 text-slate-400 bg-slate-900 border border-white/5 px-2 py-0.5 rounded">
                                <Cpu className="w-3 h-3 text-emerald-400" />
                                {builder.field}
                              </span>
                            </div>

                            {/* Bio & Details */}
                            <p className="text-xs text-slate-300 leading-relaxed mb-4">{builder.bio}</p>
                            <p className="text-[10.5px] text-slate-400 font-medium border-l-2 border-emerald-500/50 pl-2 py-0.5 mb-4">{builder.experience}</p>
                          </div>

                          {/* Tech stack & Action */}
                          <div>
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {builder.skills.map((skill, sIdx) => (
                                <span key={sIdx} className="text-[9.5px] font-bold font-mono bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-white/5">
                                  {skill}
                                </span>
                              ))}
                            </div>

                            <button 
                              onClick={() => handleCofounderConnect(builder)}
                              className="w-full bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 border border-white/10 hover:border-transparent text-slate-300 text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 group cursor-pointer"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              Forge Alignment
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: FUNDING */}
              {activeTab === 'funding' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                        💰 Funding & Venture Bridges
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Direct channel to local VCs, active overseas diaspora angels, corporate funds, and state-backed grant matches.
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowPitchModal(true)}
                      className="bg-emerald-500 text-slate-950 text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-400 transition-all flex items-center gap-1 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Create Seed Pitch
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Active Matchmaking widget */}
                    <div className="glass-panel p-5 rounded-2xl border border-dashed border-emerald-500/20 bg-emerald-500/[0.02] flex flex-col justify-between">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold mb-3 border border-emerald-500/20">
                          <Zap className="w-3 h-3 text-emerald-400 animate-pulse" />
                          AUTOMATED DEAL FLOW
                        </div>
                        <h4 className="font-extrabold text-base text-white tracking-wide mb-2">Evaluate Your Startup Stage</h4>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                          Tell our Venture Matchmaker what you are building. We will cross-reference your stack with the investment mandates of Zayn Capital, IVC, and PSF matching equity rules.
                        </p>
                        <ul className="text-xs text-slate-300 space-y-2 mb-5">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            Direct pitch submission
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            Instant cap-table compliance check
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            Up to 30% matching via PSF grant scheme
                          </li>
                        </ul>
                      </div>
                      <button 
                        onClick={() => setShowPitchModal(true)}
                        className="w-full bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl hover:bg-emerald-400 transition-all text-xs tracking-wider flex items-center justify-center gap-1.5"
                      >
                        Launch Matching Wizard
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* VCs Cards */}
                    {investorsData.map(investor => (
                      <div 
                        key={investor.id}
                        className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-amber-500/30 transition-all"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center font-black text-amber-400 font-mono text-sm tracking-tighter">
                              {investor.logo}
                            </div>
                            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/5 text-slate-400">
                              {investor.type}
                            </span>
                          </div>

                          <h4 className="font-extrabold text-sm text-white tracking-wide mb-1">{investor.name}</h4>
                          <p className="text-xs text-slate-400 font-medium mb-3">Cheque Range: <span className="text-amber-400 font-bold">{investor.chequeSize}</span></p>
                          <p className="text-xs text-slate-300 leading-relaxed mb-4">{investor.description}</p>
                        </div>

                        <div>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {investor.focus.map((focus, fIdx) => (
                              <span key={fIdx} className="text-[9px] font-bold font-mono bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-white/5">
                                {focus}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between pt-3 border-t border-white/5">
                            <span className="text-[10px] text-slate-500 font-medium">{investor.portfolioCount} Active Portfolio Cos</span>
                            <button 
                              onClick={() => {
                                setPitchData(prev => ({ ...prev, tech: investor.focus[0] || "AI" }));
                                setShowPitchModal(true);
                              }}
                              className="text-xs font-bold text-amber-400 hover:text-white flex items-center gap-1 group transition-all"
                            >
                              Pitch Directly
                              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: PARTNERSHIPS */}
              {activeTab === 'partnerships' && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                      🤝 Partnerships & Diaspora Networks
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Direct corporate pilots, university research-lab access, and overseas mentorship hubs connecting Pakistani builders to global systems.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {partnershipsData.map(partnership => (
                      <div 
                        key={partnership.id}
                        className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all flex items-start gap-4"
                      >
                        <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-indigo-400">
                          {partnership.icon === 'Globe' && <Globe className="w-6 h-6" />}
                          {partnership.icon === 'Building' && <Building2 className="w-6 h-6" />}
                          {partnership.icon === 'GraduationCap' && <GraduationCap className="w-6 h-6" />}
                          {partnership.icon === 'Network' && <Handshake className="w-6 h-6" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/5 text-slate-400">
                              {partnership.type}
                            </span>
                            <span className="text-[10px] font-bold text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                              {partnership.activeOpportunities} Open Channels
                            </span>
                          </div>
                          <h4 className="font-extrabold text-base text-white tracking-wide mt-1">{partnership.name}</h4>
                          <p className="text-xs text-slate-400 font-bold mt-0.5">{partnership.entity}</p>
                          <p className="text-xs text-slate-300 mt-3 leading-relaxed">{partnership.benefit}</p>
                          
                          <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                            <button 
                              onClick={() => {
                                setTerminalLogs(prev => [
                                  `[PARTNERSHIP-CONNECT] Initiated sandbox setup with: ${partnership.name}`,
                                  ...prev
                                ]);
                                alert(`Application initiated! You will receive a direct channel link with the coordinators at ${partnership.entity} in your registered email.`);
                              }}
                              className="text-xs font-bold text-indigo-400 hover:text-white flex items-center gap-1 group transition-all"
                            >
                              Request Connect & Sandbox Access
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: GOV ACCESS */}
              {activeTab === 'gov' && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                      🏛️ Government Access & Grants
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Tap into Pakistan Startup Fund, Punjab IT Board sandbox incubators, HEC research-to-market grants, and FBR IT export tax exemption certificates.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {govProgramsData.map(prog => (
                      <div 
                        key={prog.id}
                        className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/5 text-slate-400">
                              {prog.agency}
                            </span>
                            <span className="text-[10px] font-extrabold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                              {prog.type}
                            </span>
                          </div>

                          <h4 className="font-extrabold text-base text-white tracking-wide mb-2">{prog.title}</h4>
                          <p className="text-xs text-slate-400 font-bold mb-3">Funding Envelope: <span className="text-cyan-400 font-extrabold font-mono">{prog.fundingCap}</span></p>
                          
                          <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5 mb-4 text-xs">
                            <p className="text-slate-400 font-semibold mb-1">Eligibility Criteria:</p>
                            <p className="text-slate-300">{prog.eligibility}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                          <span className="text-[10.5px] font-semibold text-red-400 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Deadline: {prog.deadline}
                          </span>
                          
                          <button 
                            onClick={() => {
                              setTerminalLogs(prev => [
                                `[GOV-PORTAL] Commencing auto-compliance assessment for ${prog.title}`,
                                ...prev
                              ]);
                              alert("Auto-checking your profile capabilities... Checked NUST/FAST university ties: OK. Checked deep tech tags: OK. Eligible! Proceeding to HEC/PITB portal matching.");
                            }}
                            className="bg-slate-900 border border-white/10 hover:border-transparent hover:bg-cyan-500 hover:text-slate-950 font-bold text-xs py-2 px-4 rounded-lg transition-all flex items-center gap-1"
                          >
                            Apply via Single Portal
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: JOBS */}
              {activeTab === 'jobs' && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                      💼 Jobs & Global Remote Placements
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Direct startup hiring, international remote developer roles, and localized deep-tech internships. Match your skillset.
                    </p>
                  </div>

                  {filteredJobs.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl">
                      <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm font-semibold">No job roles found matching "{searchTerm}"</p>
                      <button onClick={() => { setSearchTerm(""); setSelectedField("All"); }} className="text-xs text-emerald-400 mt-2 underline">Clear search</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {filteredJobs.map(job => (
                        <div 
                          key={job.id}
                          className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-extrabold text-sm text-white tracking-wide">{job.title}</h4>
                                <p className="text-xs text-slate-400 font-semibold">{job.company}</p>
                              </div>
                              <span className="text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/25">
                                {job.type}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold mb-3">
                              <span className="flex items-center gap-0.5">
                                <MapPin className="w-3 h-3" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-0.5 text-emerald-400 font-extrabold">
                                <DollarSign className="w-3 h-3" />
                                {job.salary}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-4">
                              {job.skills.map((skill, sIdx) => (
                                <span key={sIdx} className="text-[9px] font-bold font-mono bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-white/5">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                            <button 
                              onClick={() => {
                                setTerminalLogs(prev => [
                                  `[JOB-APPLICATION] Submitted resume match sequence to ${job.company} for ${job.title}`,
                                  ...prev
                                ]);
                                alert(`Applying! Indus Foundry's skill-placement agent is validating your profile. You will receive an interview slot or technical benchmark evaluation prompt shortly.`);
                              }}
                              className="flex-1 bg-emerald-500 text-slate-950 text-xs font-bold py-2 rounded-lg hover:bg-emerald-400 transition-all text-center"
                            >
                              Instant Apply via Matcher
                            </button>
                            <button 
                              onClick={() => {
                                setActiveTab('challenges');
                                const chall = challengesData.find(c => c.category === job.category) || challengesData[0];
                                setSearchTerm(chall.title);
                              }}
                              className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10 hover:border-emerald-500/30 text-slate-300 text-xs font-bold hover:text-emerald-400 transition-all"
                              title="Skip resume check - prove your skill in a practical challenge for direct interview slot!"
                            >
                              Bypass via Challenge
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: CHALLENGES */}
              {activeTab === 'challenges' && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                      🏆 The Challenge Arena
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Government ministries & corporate giants post real problems. Individuals or newly forged teams submit solutions to compete for pilot contracts, procurement slots, and cash.
                    </p>
                  </div>

                  {filteredChallenges.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl">
                      <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm font-semibold">No challenges found matching "{searchTerm}"</p>
                      <button onClick={() => setSearchTerm("")} className="text-xs text-emerald-400 mt-2 underline">Clear search</button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredChallenges.map(challenge => (
                        <div 
                          key={challenge.id}
                          className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-rose-500/20 transition-all flex flex-col md:flex-row justify-between gap-6"
                        >
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/5 text-slate-400">
                                {challenge.postedBy}
                              </span>
                              <span className="text-[10px] font-extrabold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                                {challenge.category}
                              </span>
                            </div>

                            <h4 className="font-extrabold text-lg text-white tracking-wide mb-2">{challenge.title}</h4>
                            <p className="text-xs text-slate-300 leading-relaxed mb-4">{challenge.description}</p>
                            
                            <div className="p-4 bg-slate-900/60 rounded-xl border border-white/5 text-xs text-slate-300">
                              <p className="font-bold text-rose-400 flex items-center gap-1 mb-1.5">
                                <Terminal className="w-3.5 h-3.5" />
                                PROBLEM STATEMENT:
                              </p>
                              <p className="italic leading-relaxed">{challenge.problemStatement}</p>
                            </div>
                          </div>

                          <div className="w-full md:w-72 bg-slate-900/80 p-5 rounded-2xl border border-white/5 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">PRIZE & REWARD</p>
                                <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                                  {challenge.daysLeft} Days Left
                                </span>
                              </div>
                              <p className="text-sm font-extrabold text-amber-400 mb-1">{challenge.prizePool}</p>
                              <p className="text-[10.5px] text-slate-400 font-medium">Core reward: <span className="text-emerald-400 font-bold">{challenge.rewardType}</span></p>

                              <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-4 border-t border-white/5">
                                <span>Active Teams competing</span>
                                <span className="font-extrabold text-white">{challenge.participantsCount}</span>
                              </div>
                            </div>

                            <button 
                              onClick={() => {
                                setSubmittingChallenge(challenge);
                                setChallengeFile(null);
                                setChallengeProgress([]);
                                setChallengeRunStatus('idle');
                              }}
                              className="w-full mt-6 bg-rose-500 hover:bg-rose-400 text-slate-950 text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-rose-500/10 flex items-center justify-center gap-1.5"
                            >
                              <Trophy className="w-3.5 h-3.5" />
                              Compete & Submit Solution
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* 4. The Interactive Dream Team Simulator */}
      <section id="dream-team" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5 bg-slate-950/20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-emerald-500/[0.02] rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center mb-12">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20">
            TEAM FORGER SIMULATOR (SANDBOX)
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-4">
            Assemble the Perfect Deep Tech Team
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Select standard co-founder skill blocks to evaluate your startup viability and check for matching resources in Pakistan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start max-w-6xl mx-auto">
          {/* Controls */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 md:col-span-2">
            <h3 className="font-extrabold text-base text-white tracking-wide mb-4 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              Configuration Parameters
            </h3>

            {/* Select tech domain */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Venture Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['AI', 'SaaS', 'Semiconductors', 'Robotics', 'Fintech', 'AR/VR', 'Deep Tech'].map(dom => (
                  <button
                    key={dom}
                    onClick={() => {
                      setDreamDomain(dom);
                      setTeamScore(null);
                    }}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                      dreamDomain === dom 
                        ? "bg-emerald-500 text-slate-950 border-transparent shadow-md shadow-emerald-500/10"
                        : "bg-slate-900 text-slate-400 border-white/5 hover:border-white/10"
                    }`}
                  >
                    {dom}
                  </button>
                ))}
              </div>
            </div>

            {/* Select cofounder skill profiles */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Add Co-Founder Roles (Choose up to 4)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { role: 'Scientist', label: 'AI/ML Research Scientist', desc: 'PyTorch, model fine-tuning & research' },
                  { role: 'Hardware', label: 'Semiconductor Layout Engineer', desc: 'Verilog, FPGA layout, chip logic design' },
                  { role: 'Engineer', label: 'Full-Stack Software Dev', desc: 'Next.js, architecture and SaaS databases' },
                  { role: 'Growth', label: 'B2B Sales & Growth Lead', desc: 'Pipeline building, enterprise contracts' },
                  { role: 'Product', label: 'Product Manager & UX Designer', desc: 'Mockups, roadmap and customer validation' },
                  { role: 'Operations', label: 'Legal & Procurement Specialist', desc: 'Gov compliance, startup law & logistics' },
                ].map(item => {
                  const isSelected = dreamTeam.includes(item.role);
                  return (
                    <button
                      key={item.role}
                      onClick={() => {
                        toggleRoleInDreamTeam(item.role);
                        setTeamScore(null);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between cursor-pointer ${
                        isSelected 
                          ? "bg-slate-900 border-emerald-500/40 text-white shadow-sm"
                          : "bg-slate-950/40 border-white/5 hover:bg-slate-900/40 hover:border-white/10 text-slate-400"
                      }`}
                    >
                      <div>
                        <p className={`text-xs font-extrabold tracking-wide ${isSelected ? "text-emerald-400" : "text-slate-200"}`}>{item.label}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-tight">{item.desc}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? "bg-emerald-500 border-emerald-500 text-slate-950" : "border-slate-600"}`}>
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button 
              onClick={assessDreamTeam}
              disabled={dreamTeam.length === 0}
              className={`w-full font-extrabold py-3.5 rounded-xl transition-all text-xs tracking-wider flex items-center justify-center gap-1.5 ${
                dreamTeam.length > 0 
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/10 cursor-pointer"
                  : "bg-slate-900 text-slate-500 cursor-not-allowed border border-white/5"
              }`}
            >
              <Cpu className="w-4 h-4" />
              Assess Forge Viability & Match Founders
            </button>
          </div>

          {/* Results Display */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[420px]">
            {teamScore ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider mb-4">Forge Viability Analysis</h4>
                  
                  {/* Gauge representation */}
                  <div className="flex items-center gap-4 mb-5 bg-slate-900/60 p-4 rounded-2xl border border-white/5">
                    <div className="relative w-16 h-16 rounded-full bg-slate-950 border border-white/5 flex items-center justify-center">
                      <span className="font-mono font-black text-lg text-emerald-400">{teamScore.score}%</span>
                      {/* circular border representing progress */}
                      <svg className="absolute top-0 left-0 w-full h-full -rotate-90">
                        <circle 
                          cx="32" 
                          cy="32" 
                          r="28" 
                          fill="transparent" 
                          stroke="rgba(16, 185, 129, 0.2)" 
                          strokeWidth="3.5"
                        />
                        <circle 
                          cx="32" 
                          cy="32" 
                          r="28" 
                          fill="transparent" 
                          stroke="#10b981" 
                          strokeWidth="3.5"
                          strokeDasharray={2 * Math.PI * 28}
                          strokeDashoffset={2 * Math.PI * 28 * (1 - teamScore.score / 100)}
                        />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-extrabold text-sm text-white tracking-wide">
                        {teamScore.score > 85 ? "Excellent Alignment" : teamScore.score > 65 ? "Solid Foundation" : "Incomplete Stack"}
                      </h5>
                      <p className="text-[10px] text-slate-400 font-semibold tracking-wide">Domain target: {dreamDomain} startup</p>
                    </div>
                  </div>

                  {/* Feedback details */}
                  <div className="space-y-4 text-xs">
                    <div>
                      <p className="font-extrabold text-emerald-400 tracking-wide mb-1">Key Strengths:</p>
                      <ul className="space-y-1">
                        {teamScore.strengths.map((str, sIdx) => (
                          <li key={sIdx} className="flex items-center gap-1.5 text-slate-300 font-semibold">
                            <span className="text-emerald-400 font-black">✔</span>
                            {str}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-extrabold text-amber-400 tracking-wide mb-1">Identified Stack Gaps:</p>
                      <p className="text-slate-300 leading-relaxed font-semibold">{teamScore.gap}</p>
                    </div>

                    <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5">
                      <p className="text-slate-400 font-medium leading-relaxed">{teamScore.feedback}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5">
                  <p className="text-[10px] text-slate-400 font-medium mb-3">Recommended cofounders currently online:</p>
                  <div className="flex gap-2">
                    {buildersData.filter(b => b.field === (dreamDomain === "AR/VR" ? "AR/VR" : dreamDomain === "Semiconductors" ? "Semiconductors" : "AI")).slice(0, 2).map(b => (
                      <button 
                        key={b.id}
                        onClick={() => {
                          setActiveTab('teams');
                          setSearchTerm(b.name);
                          const el = document.getElementById("forge-workspace");
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="flex-1 flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-white/10 hover:border-emerald-500/30 text-left transition-all"
                      >
                        <img src={b.avatar} className="w-6 h-6 rounded-full object-cover" />
                        <div>
                          <p className="text-[10px] font-bold text-white leading-tight">{b.name.split(' ')[0]}</p>
                          <p className="text-[8px] text-slate-500 leading-none mt-0.5">{b.role.substring(0, 15)}...</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <Sliders className="w-12 h-12 text-slate-600 mb-4 animate-bounce" style={{ animationDuration: '4s' }} />
                <h4 className="font-extrabold text-sm text-slate-300 tracking-wide">Awaiting Team Parameters</h4>
                <p className="text-xs text-slate-400 max-w-[200px] mt-1 leading-relaxed">
                  Select a category and add potential co-founder roles to run the viability compiler.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. The Stakeholder Pathway Wizard */}
      <section id="pathway-wizard" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5 scroll-mt-20 relative">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs font-bold border border-amber-500/20">
            THE STAKEHOLDER PATHWAY MATCH
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-4">
            Interactive Setup Wizard
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Identify your target stakeholder profile to discover custom funding portals, cofounders, or jobs tailored for your journey.
          </p>
        </div>

        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 max-w-3xl mx-auto relative overflow-hidden">
          {wizardStep === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="font-extrabold text-lg text-white mb-6 text-center">Which stakeholder profile best describes you?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'graduate', title: '🎓 Unemployed Graduate / Skill Seeker', desc: 'Looking for paid internship programs, local engineering mentors, and remote global placements.' },
                  { id: 'builder', title: '💻 Active Tech Founder / Builder', desc: 'Looking for highly specialized cofounders, incubator sandbox facilities, and early pre-seed cheques.' },
                  { id: 'investor', title: '💰 Investor / Diaspora Capital', desc: 'Looking to invest in vetted deep-tech startups and claim PITB/HEC matching fund compliance.' },
                  { id: 'corporate', title: '🏛️ Corporate or Gov Agency', desc: 'Looking to post real problems/challenges, procure innovative tech, or launch pilot partnerships.' },
                ].map(prof => (
                  <button
                    key={prof.id}
                    onClick={() => {
                      setPathwayProfile(prof.id);
                      setWizardStep(2);
                    }}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-emerald-500/40 text-left transition-all hover:bg-slate-900 group cursor-pointer"
                  >
                    <h4 className="font-extrabold text-sm text-white group-hover:text-emerald-400 transition-all">{prof.title}</h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{prof.desc}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {wizardStep === 2 && pathwayProfile && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 2: Recommended Pathway Roadmap</span>
                <button onClick={() => setWizardStep(1)} className="text-xs text-emerald-400 font-bold hover:underline">Back</button>
              </div>

              {pathwayProfile === 'graduate' && (
                <div className="space-y-6">
                  <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-xs text-slate-300">
                    <p className="font-bold text-emerald-400 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      YOUR UNEMPLOYED TO EMPLOYED ACTION ENGINE:
                    </p>
                    Pakistan produces 500k grads yearly — we prevent you from becoming a statistic by bypassing regular resumes. Proving your skills is your direct ticket to high-paying teams.
                  </div>

                  <div className="relative border-l border-emerald-500/30 ml-4 pl-6 space-y-6 text-xs">
                    <div className="relative">
                      <span className="absolute left-[-30px] top-0 w-4 h-4 rounded-full bg-emerald-500 border border-slate-950 flex items-center justify-center font-bold text-[8px] text-slate-950">1</span>
                      <h4 className="font-bold text-white">Join The Challenge Arena</h4>
                      <p className="text-slate-400 mt-1 leading-relaxed">Skip job applications. Go directly to active Challenges, build working telemetry solutions, and gain instant visibility.</p>
                      <button onClick={() => { setActiveTab('challenges'); const el = document.getElementById("forge-workspace"); el?.scrollIntoView({ behavior: 'smooth' }); }} className="text-emerald-400 font-bold mt-2 hover:underline">Explore active challenges →</button>
                    </div>

                    <div className="relative">
                      <span className="absolute left-[-30px] top-0 w-4 h-4 rounded-full bg-emerald-500 border border-slate-950 flex items-center justify-center font-bold text-[8px] text-slate-950">2</span>
                      <h4 className="font-bold text-white">Skill-to-Placement Matching</h4>
                      <p className="text-slate-400 mt-1 leading-relaxed">Search for remote developer listings and check your capabilities using our automated test benches.</p>
                      <button onClick={() => { setActiveTab('jobs'); const el = document.getElementById("forge-workspace"); el?.scrollIntoView({ behavior: 'smooth' }); }} className="text-emerald-400 font-bold mt-2 hover:underline">Browse job placements →</button>
                    </div>

                    <div className="relative">
                      <span className="absolute left-[-30px] top-0 w-4 h-4 rounded-full bg-slate-700 border border-slate-950 flex items-center justify-center font-bold text-[8px] text-white">3</span>
                      <h4 className="font-bold text-white">Silicon Valley Mentorship</h4>
                      <p className="text-slate-400 mt-1 leading-relaxed">Connect to the Overseas Diaspora channels for feedback on your product portfolios.</p>
                      <button onClick={() => { setActiveTab('partnerships'); const el = document.getElementById("forge-workspace"); el?.scrollIntoView({ behavior: 'smooth' }); }} className="text-emerald-400 font-bold mt-2 hover:underline">Browse diaspora networks →</button>
                    </div>
                  </div>
                </div>
              )}

              {pathwayProfile === 'builder' && (
                <div className="space-y-6">
                  <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-xs text-slate-300">
                    <p className="font-bold text-emerald-400 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      YOUR FOUNDER TO FUNDED PLATFORM PATH:
                    </p>
                    We help deep-tech builders assemble optimal local architectures, meet world-class funding networks, and claim federal matching grants quickly.
                  </div>

                  <div className="relative border-l border-emerald-500/30 ml-4 pl-6 space-y-6 text-xs">
                    <div className="relative">
                      <span className="absolute left-[-30px] top-0 w-4 h-4 rounded-full bg-emerald-500 border border-slate-950 flex items-center justify-center font-bold text-[8px] text-slate-950">1</span>
                      <h4 className="font-bold text-white">Simulate and Connect Teams</h4>
                      <p className="text-slate-400 mt-1 leading-relaxed">Analyze your founding stack with our Team Simulator and browse local engineering resumes to cover gaps.</p>
                      <button onClick={() => { setActiveTab('teams'); const el = document.getElementById("forge-workspace"); el?.scrollIntoView({ behavior: 'smooth' }); }} className="text-emerald-400 font-bold mt-2 hover:underline">Explore cofounder profiles →</button>
                    </div>

                    <div className="relative">
                      <span className="absolute left-[-30px] top-0 w-4 h-4 rounded-full bg-emerald-500 border border-slate-950 flex items-center justify-center font-bold text-[8px] text-slate-950">2</span>
                      <h4 className="font-bold text-white">Direct-Pitch Venture Investors</h4>
                      <p className="text-slate-400 mt-1 leading-relaxed">Launch our pitch deck alignment calculator to evaluate pre-seed checklist compliance before sending decks.</p>
                      <button onClick={() => setShowPitchModal(true)} className="text-emerald-400 font-bold mt-2 hover:underline">Submit a seed pitch →</button>
                    </div>

                    <div className="relative">
                      <span className="absolute left-[-30px] top-0 w-4 h-4 rounded-full bg-slate-700 border border-slate-950 flex items-center justify-center font-bold text-[8px] text-white">3</span>
                      <h4 className="font-bold text-white">State Matching Grants</h4>
                      <p className="text-slate-400 mt-1 leading-relaxed">Ensure compliance with Punjab Startup Fund matching rules to double your pre-seed cheque value automatically.</p>
                      <button onClick={() => { setActiveTab('gov'); const el = document.getElementById("forge-workspace"); el?.scrollIntoView({ behavior: 'smooth' }); }} className="text-emerald-400 font-bold mt-2 hover:underline">Check HEC & PITB rules →</button>
                    </div>
                  </div>
                </div>
              )}

              {pathwayProfile === 'investor' && (
                <div className="space-y-6">
                  <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-xs text-slate-300">
                    <p className="font-bold text-emerald-400 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      YOUR BRIDGING DEEP TECH INVESTOR PATHWAY:
                    </p>
                    Tap into fully vetted deep-tech opportunities in semiconductors, agricultural AI, and financial protocols, complete with tax remittance incentives.
                  </div>

                  <div className="relative border-l border-emerald-500/30 ml-4 pl-6 space-y-6 text-xs">
                    <div className="relative">
                      <span className="absolute left-[-30px] top-0 w-4 h-4 rounded-full bg-emerald-500 border border-slate-950 flex items-center justify-center font-bold text-[8px] text-slate-950">1</span>
                      <h4 className="font-bold text-white">Access Pre-vetted Deep Tech Startups</h4>
                      <p className="text-slate-400 mt-1 leading-relaxed">Direct dashboard monitoring of startups matching TSMC chip tape-outs, Agri-IoT projects, and payments APIs.</p>
                      <button onClick={() => { setActiveTab('funding'); const el = document.getElementById("forge-workspace"); el?.scrollIntoView({ behavior: 'smooth' }); }} className="text-emerald-400 font-bold mt-2 hover:underline">Browse VC networks →</button>
                    </div>

                    <div className="relative">
                      <span className="absolute left-[-30px] top-0 w-4 h-4 rounded-full bg-emerald-500 border border-slate-950 flex items-center justify-center font-bold text-[8px] text-slate-950">2</span>
                      <h4 className="font-bold text-white">Review Corporate & Diaspora Exchange Opportunities</h4>
                      <p className="text-slate-400 mt-1 leading-relaxed">Establish accelerator tracks with the HEC-backed universities and Systems Ltd incubation sandbox structures.</p>
                      <button onClick={() => { setActiveTab('partnerships'); const el = document.getElementById("forge-workspace"); el?.scrollIntoView({ behavior: 'smooth' }); }} className="text-emerald-400 font-bold mt-2 hover:underline">Explore alliance opportunities →</button>
                    </div>
                  </div>
                </div>
              )}

              {pathwayProfile === 'corporate' && (
                <div className="space-y-6">
                  <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-xs text-slate-300">
                    <p className="font-bold text-emerald-400 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      YOUR CHALLENGE-TO-CONTRACT INTERACTION PATH:
                    </p>
                    Post real-world engineering obstacles. Let individuals, universities, or sandbox teams compete. Solve your operational issues and claim direct intellectual property.
                  </div>

                  <div className="relative border-l border-emerald-500/30 ml-4 pl-6 space-y-6 text-xs">
                    <div className="relative">
                      <span className="absolute left-[-30px] top-0 w-4 h-4 rounded-full bg-emerald-500 border border-slate-950 flex items-center justify-center font-bold text-[8px] text-slate-950">1</span>
                      <h4 className="font-bold text-white">Establish Custom Procurement Challenges</h4>
                      <p className="text-slate-400 mt-1 leading-relaxed">Post dynamic hackathons with pre-determined prize pools or pilot contracts. Let Pakistan's leading talent compete under closed sandbox conditions.</p>
                      <button onClick={() => { setActiveTab('challenges'); const el = document.getElementById("forge-workspace"); el?.scrollIntoView({ behavior: 'smooth' }); }} className="text-emerald-400 font-bold mt-2 hover:underline">Explore Challenge Arena →</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-4 border-t border-white/5 flex justify-end">
                <button 
                  onClick={() => setWizardStep(1)} 
                  className="bg-slate-900 border border-white/10 hover:border-emerald-500/30 text-white font-bold text-xs py-2 px-5 rounded-lg transition-all"
                >
                  Restart Selection
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* 6. Footer section */}
      <footer className="border-t border-white/5 bg-[#03060c] py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <span className="font-black text-lg tracking-wider text-white">INDUS FOUNDRY VENTURES</span>
            <p className="text-xs text-slate-400 mt-3 max-w-sm leading-relaxed">
              Pakistan's premier deep-tech startup, cofounder matching, and job placement engine. Solving the graduation unemployment paradox by bridging builders, venture capital, and local resources.
            </p>
            <p className="text-[10px] text-slate-500 mt-6">
              © {new Date().getFullYear()} Indus Foundry Ventures. All Rights Reserved. Built with Next.js & Tailwind CSS.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-4">WHAT WE FORGE</h4>
            <ul className="text-xs text-slate-400 space-y-2.5 font-medium">
              <li><button onClick={() => { setActiveTab('teams'); const el = document.getElementById("forge-workspace"); el?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-all cursor-pointer text-left">👥 Cofounder Matching</button></li>
              <li><button onClick={() => { setActiveTab('funding'); const el = document.getElementById("forge-workspace"); el?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-all cursor-pointer text-left">💰 Venture Capital Bridge</button></li>
              <li><button onClick={() => { setActiveTab('partnerships'); const el = document.getElementById("forge-workspace"); el?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-all cursor-pointer text-left">🤝 Corporate Alliances</button></li>
              <li><button onClick={() => { setActiveTab('gov'); const el = document.getElementById("forge-workspace"); el?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-all cursor-pointer text-left">🏛️ PSF & Gov Access</button></li>
              <li><button onClick={() => { setActiveTab('jobs'); const el = document.getElementById("forge-workspace"); el?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-all cursor-pointer text-left">💼 Skill-to-Placement Jobs</button></li>
              <li><button onClick={() => { setActiveTab('challenges'); const el = document.getElementById("forge-workspace"); el?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-all cursor-pointer text-left">🏆 Procurement Challenges</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-4">CONNECTIVITY</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Connect to incubator hubs in Lahore, Karachi, Islamabad, Peshawar, or access Silicon Valley diaspora channels.
            </p>
            <div className="flex gap-2">
              <span className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-xs text-slate-400 hover:text-white cursor-pointer transition-all">FB</span>
              <span className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-xs text-slate-400 hover:text-white cursor-pointer transition-all">TW</span>
              <span className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-xs text-slate-400 hover:text-white cursor-pointer transition-all">LN</span>
              <span className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-xs text-slate-400 hover:text-white cursor-pointer transition-all">GH</span>
            </div>
          </div>
        </div>
      </footer>


      {/* -------------------- MODALS & DRAWERS -------------------- */}

      {/* Modal 1: Cofounder Connection Dialogue */}
      {selectedBuilder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-[#020408]/80 backdrop-blur-sm cursor-pointer" onClick={() => setSelectedBuilder(null)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 rounded-2xl border border-emerald-500/20 max-w-md w-full relative z-10 shadow-2xl shadow-emerald-500/5"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-extrabold text-base text-white tracking-wide flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                Initiate Cofounder Alignment
              </h3>
              <button onClick={() => setSelectedBuilder(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-3 items-center p-3 bg-slate-900/60 rounded-xl border border-white/5 mb-4 text-xs">
              <img src={selectedBuilder.avatar} className="w-10 h-10 rounded-lg object-cover" />
              <div>
                <p className="font-bold text-white">{selectedBuilder.name}</p>
                <p className="text-slate-400">{selectedBuilder.role} ({selectedBuilder.city})</p>
              </div>
            </div>

            {chatSuccess ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 animate-bounce" />
                <h4 className="font-extrabold text-sm text-white">Connection Proposal Sent!</h4>
                <p className="text-xs text-slate-400 max-w-[240px] mx-auto mt-1 leading-relaxed">
                  Salam message delivered to {selectedBuilder.name.split(' ')[0]}. A sandbox channel will open once they accept.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Your Salam Alignment Message</label>
                  <textarea
                    rows={4}
                    value={builderChatMsg}
                    onChange={(e) => setBuilderChatMsg(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500/50 resize-none font-medium leading-relaxed"
                  />
                </div>

                <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-[10px] text-slate-400 leading-normal flex items-start gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  We auto-verify your technical parameters to confirm matching co-founder interests and lower early-stage legal friction.
                </div>

                <button 
                  onClick={submitBuilderChat}
                  className="w-full bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl hover:bg-emerald-400 transition-all text-xs tracking-wider flex items-center justify-center gap-1.5"
                >
                  Send Sandbox Proposal
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Modal 2: Direct Venture Pitch Wizard */}
      {showPitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-[#020408]/80 backdrop-blur-sm cursor-pointer" onClick={() => setShowPitchModal(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 rounded-2xl border border-amber-500/20 max-w-lg w-full relative z-10 shadow-2xl shadow-amber-500/5"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-extrabold text-base text-white tracking-wide flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                Direct Seed Pitch Engine
              </h3>
              <button onClick={() => setShowPitchModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {pitchStep === 1 && (
              <form onSubmit={handleFundPitch} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">1. Describe your core innovation / startup idea</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Building low-latency RISC-V edge processing chips tailored for localized language translations or deep hardware acceleration."
                    value={pitchData.idea}
                    onChange={(e) => setPitchData(prev => ({ ...prev, idea: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500/50 resize-none font-medium leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tech Category</label>
                    <select 
                      value={pitchData.tech}
                      onChange={(e) => setPitchData(prev => ({ ...prev, tech: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500/50 font-medium"
                    >
                      <option value="AI">AI / Deep Learning</option>
                      <option value="Semiconductors">Semiconductors</option>
                      <option value="Robotics">Robotics & IoT</option>
                      <option value="Fintech">Fintech Protocols</option>
                      <option value="SaaS">B2B SaaS</option>
                      <option value="Deep Tech">Deep Tech (General)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Team Size</label>
                    <select
                      value={pitchData.teamSize}
                      onChange={(e) => setPitchData(prev => ({ ...prev, teamSize: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500/50 font-medium"
                    >
                      <option value="1">Solo Founder (1)</option>
                      <option value="2">Co-founders (2)</option>
                      <option value="3">Small Team (3-4)</option>
                      <option value="5">Scaled Team (5+)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Cheque size</label>
                  <select
                    value={pitchData.fundingGoal}
                    onChange={(e) => setPitchData(prev => ({ ...prev, fundingGoal: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500/50 font-medium"
                  >
                    <option value="PKR 5 Million">PKR 5 - 10 Million (Pre-seed Grant)</option>
                    <option value="PKR 25 Million">PKR 25 - 50 Million (Seed Matching PSF)</option>
                    <option value="PKR 100 Million">PKR 100 Million+ (Series A Venture)</option>
                  </select>
                </div>

                <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 text-[10px] text-slate-400 leading-normal flex items-start gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  Pitches submitted here are automatically converted to unified investment term-sheets compliant with SECP & PITB sandbox rules.
                </div>

                <button 
                  type="submit"
                  className="w-full bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl hover:bg-amber-400 transition-all text-xs tracking-wider flex items-center justify-center gap-1.5"
                >
                  Analyze Mandate Alignment
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {pitchStep === 2 && (
              <div className="text-center py-12 flex flex-col justify-center items-center">
                <Terminal className="w-12 h-12 text-amber-400 animate-spin mb-4" style={{ animationDuration: '3s' }} />
                <h4 className="font-extrabold text-sm text-white">Running Mandate Analysis...</h4>
                <p className="text-xs text-slate-400 max-w-[240px] mt-1 leading-relaxed">
                  Matching parameters with Zayn Capital portfolios, Sarmayacar seed constraints, and Pakistan Startup Fund regulations...
                </p>
              </div>
            )}

            {pitchStep === 3 && pitchScore && (
              <div className="space-y-5">
                <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-xl border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-slate-950 border border-white/5 flex items-center justify-center text-amber-400 font-mono font-black text-sm">
                    {pitchScore.score}%
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-white tracking-wide">{pitchScore.probability}</h5>
                    <p className="text-[10px] text-slate-400 font-semibold tracking-wide">Federal Tax Remittance Check: OK</p>
                  </div>
                </div>

                <div className="text-xs space-y-3">
                  <div>
                    <p className="font-extrabold text-emerald-400 tracking-wide">Direct Fund Matches (Eligible to pitch):</p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {pitchScore.investors.map((inv: string, idx: number) => (
                        <span key={idx} className="text-[10px] font-bold font-mono bg-slate-900 text-slate-200 px-2 py-0.5 rounded border border-white/5">
                          {inv}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-extrabold text-amber-400 tracking-wide">Platform Recommendation:</p>
                    <p className="text-slate-300 leading-relaxed font-semibold mt-0.5">{pitchScore.recommendation}</p>
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-[10px] text-slate-400 leading-normal flex items-start gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  Your compliance documents are locked. Ready to dispatch seed data packet.
                </div>

                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={() => setPitchStep(1)} 
                    className="flex-1 bg-slate-900 border border-white/10 hover:border-white/20 text-white font-bold text-xs py-2.5 rounded-xl transition-all"
                  >
                    Modify Pitch
                  </button>
                  <button 
                    onClick={() => {
                      setShowPitchModal(false);
                      setTerminalLogs(prev => [
                        `[VC-PITCH-SUBMIT] Seed pitch dispatched to matched VCs: ${pitchScore.investors.join(', ')}`,
                        ...prev
                      ]);
                      alert("Successfully submitted pitch data packet! Matched investors have been alerted, and you will receive a calendar invite once reviewed.");
                    }} 
                    className="flex-1 bg-amber-500 text-slate-950 font-bold text-xs py-2.5 rounded-xl hover:bg-amber-400 transition-all"
                  >
                    Confirm & Dispatch Pitch
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Modal 3: Challenge Solution Upload & Run Sandbox */}
      {submittingChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-[#020408]/80 backdrop-blur-sm cursor-pointer" onClick={() => setSubmittingChallenge(null)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 rounded-2xl border border-rose-500/20 max-w-lg w-full relative z-10 shadow-2xl shadow-rose-500/5"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-extrabold text-base text-white tracking-wide flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-rose-400" />
                  Challenge Submission Workbench
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wide leading-tight mt-0.5">{submittingChallenge.title}</p>
              </div>
              <button onClick={() => setSubmittingChallenge(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {challengeRunStatus === 'idle' ? (
              <div className="space-y-5">
                <div className="p-4 bg-rose-500/[0.02] border border-rose-500/10 rounded-xl text-xs text-slate-300">
                  <p className="font-bold text-rose-400 mb-1">COMPETE FOR: {submittingChallenge.prizePool}</p>
                  Submit your code, RTL (SystemVerilog/Verilog), or PDF methodology document. Our system will execute a compilation sandbox validation sequence to verify your edge performance score.
                </div>

                <div 
                  onClick={() => setChallengeFile("rtl_silicon_design_v1.sv")}
                  className="p-8 rounded-xl border border-dashed border-white/10 hover:border-rose-500/40 bg-slate-900/40 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
                >
                  <UploadCloud className="w-10 h-10 text-slate-500" />
                  <p className="text-xs font-bold text-white">
                    {challengeFile ? `✔ Selected: ${challengeFile}` : "Drag and drop your Code/RTL or click to browse"}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-none">Accepts .zip, .sv, .v, .py, .pdf files up to 50MB</p>
                </div>

                <button 
                  onClick={triggerChallengeRun}
                  disabled={!challengeFile}
                  className={`w-full font-bold py-2.5 rounded-xl text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                    challengeFile 
                      ? "bg-rose-500 hover:bg-rose-400 text-slate-950 shadow-md shadow-rose-500/10 cursor-pointer"
                      : "bg-slate-900 text-slate-500 border border-white/5 cursor-not-allowed"
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Execute Sandbox Compiler Verification
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-white/5 font-mono text-[11px] text-slate-300 min-h-[180px]">
                  <p className="text-rose-400 font-bold mb-2">[$] Sandbox Terminal Log:</p>
                  {challengeProgress.map((prog, pIdx) => (
                    <p key={pIdx} className="leading-relaxed mt-1">
                      <span className="text-emerald-500">&gt;</span> {prog}
                    </p>
                  ))}
                  {challengeRunStatus === 'running' && (
                    <p className="animate-pulse text-amber-400 mt-2 font-black">Executing verify loop...</p>
                  )}
                </div>

                {challengeRunStatus === 'done' ? (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setChallengeRunStatus('idle')}
                      className="flex-1 bg-slate-900 border border-white/10 hover:border-white/20 text-white font-bold text-xs py-2.5 rounded-xl transition-all"
                    >
                      Re-upload
                    </button>
                    <button 
                      onClick={() => {
                        setSubmittingChallenge(null);
                        alert(`Successfully submitted and logged! Your solution scored 98% in performance metrics, unlocking a Direct Interview slot & procurement audit session.`);
                      }}
                      className="flex-1 bg-emerald-500 text-slate-950 font-bold text-xs py-2.5 rounded-xl hover:bg-emerald-400 transition-all"
                    >
                      Finalize Entry Submission
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-2 text-xs text-slate-500 font-bold">
                    Running compliance loops. Please wait...
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}

    </div>
  );
}
