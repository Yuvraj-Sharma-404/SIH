"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  HeartHandshake,
  DollarSign,
  Award,
  Sparkles,
  CheckCircle2,
  Building2,
  Cpu,
  Loader2,
} from "lucide-react";

export default function IndustryPortal() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pledgedId, setPledgedId] = useState<string | null>(null);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/challenges");
      const data = await res.json();
      if (data.success) {
        setChallenges(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePledge = (challengeId: string) => {
    setPledgedId(challengeId);
    setTimeout(() => {
      alert("Thank you! Your CSR sponsorship pledge has been recorded for this challenge.");
      setPledgedId(null);
    }, 1500);
  };

  return (
    <div className="space-y-8 py-4 animate-fade-in">
      {/* Industry Header */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">
                Corporate Social Responsibility (CSR) & Industry Hub
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                Companies Act 2013 Section 135 Compliant
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Co-fund student prototypes, provide hardware & compute sponsorships, and adopt regional societal challenges.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-purple-300">
          Partnered Enterprises: <strong className="text-white">Tata Steel, L&T, Infosys</strong>
        </div>
      </div>

      {/* Challenges to Sponsor */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Loading CSR Investment Opportunities...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((c) => (
            <div
              key={c.id}
              className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4 hover:border-purple-500/30 transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded">
                    {c.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    Seed Requirement: {c.budgetEstimate || "₹2,50,000"}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">{c.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-3">{c.description}</p>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400">
                  <span className="font-semibold text-slate-200">Department: </span>
                  <span>{c.department}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {c.proposals?.length || 0} University Team(s) Bidding
                </span>

                <button
                  type="button"
                  disabled={pledgedId === c.id}
                  onClick={() => handlePledge(c.id)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition flex items-center space-x-1.5"
                >
                  {pledgedId === c.id ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Recording Pledge...</span>
                    </>
                  ) : (
                    <>
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>Pledge CSR Grant</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
