"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, CheckCircle2, AlertCircle, FileText, User, Mail, DollarSign, Globe } from "lucide-react";
import { submitFreelanceProposal } from "@/app/actions/freelance";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

interface FreelanceProposalModalProps {
  project: any;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function FreelanceProposalModal({ project, onClose, onSuccess }: FreelanceProposalModalProps) {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [proposalText, setProposalText] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  const handleApply = async () => {
    if (!name.trim() || !email.trim() || !proposalText.trim()) {
      setError("Name, Email, and Proposal Text are required.");
      return;
    }
    setError("");
    setLoading(true);

    const fd = new FormData();
    fd.append("name", name.trim());
    fd.append("email", email.trim());
    fd.append("proposalText", proposalText.trim());
    if (portfolioLink.trim()) fd.append("portfolioLink", portfolioLink.trim());
    if (bidAmount.trim()) fd.append("bidAmount", bidAmount.trim());

    const res = await submitFreelanceProposal(project.id, fd);
    setLoading(false);
    if (res.success) {
      setSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(onClose, 2500);
    } else {
      setError(res.error || "Failed to submit proposal.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#1d2226] border border-[#38434f] rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="relative px-6 py-5 border-b border-white/5 bg-gradient-to-br from-teal-500/10 to-transparent">
          <button onClick={onClose} className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-teal-400" />
            <h2 className="text-base font-black text-white">Submit Proposal</h2>
          </div>
          <p className="text-xs text-slate-400">
            <span className="font-bold text-white">{project.title}</span> for {project.client}
          </p>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-pulse">
              <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-teal-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Proposal Submitted!</h3>
              <p className="text-sm text-slate-400 max-w-xs">
                Your pitch has been sent to the client. Good luck!
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-300 mb-1.5">
                    <User className="w-3.5 h-3.5 text-teal-400" /> Name *
                  </label>
                  <input
                    value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white focus:border-teal-500/50 outline-none"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-300 mb-1.5">
                    <Mail className="w-3.5 h-3.5 text-teal-400" /> Email *
                  </label>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white focus:border-teal-500/50 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-300 mb-1.5">
                  <FileText className="w-3.5 h-3.5 text-teal-400" /> Proposal / Cover Letter *
                </label>
                <textarea
                  rows={4}
                  value={proposalText} onChange={(e) => setProposalText(e.target.value)}
                  placeholder="Explain why you're a great fit for this project..."
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:border-teal-500/50 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-300 mb-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-teal-400" /> Bid Amount (Optional)
                  </label>
                  <input
                    type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={project.budget}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white focus:border-teal-500/50 outline-none"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-300 mb-1.5">
                    <Globe className="w-3.5 h-3.5 text-teal-400" /> Portfolio Link
                  </label>
                  <input
                    value={portfolioLink} onChange={(e) => setPortfolioLink(e.target.value)}
                    placeholder="https://yourwork.com"
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white focus:border-teal-500/50 outline-none"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}
            </>
          )}
        </div>

        {!success && (
          <div className="px-6 py-4 border-t border-white/5 flex items-center gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700">Cancel</button>
            <button
              onClick={handleApply}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-60 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Proposal"}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
