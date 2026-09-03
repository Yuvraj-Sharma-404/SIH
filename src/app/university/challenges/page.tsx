"use client";

import { useEffect, useState } from "react";
import {
  GraduationCap,
  Sparkles,
  Layers,
  Send,
  CheckCircle2,
  Clock,
  DollarSign,
  Building2,
  TrendingUp,
  FileText,
  Upload,
  Loader2,
  Users,
} from "lucide-react";

export default function UniversityChallengesPage() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Proposal Modal State
  const [selectedChallenge, setSelectedChallenge] = useState<any | null>(null);
  const [teamName, setTeamName] = useState("SensorGrid Dynamics Lab");
  const [institution, setInstitution] = useState(
    "Government College of Engineering, Amravati"
  );
  const [leadName, setLeadName] = useState("Dr. Sandeep Kulkarni / Student Lead");
  const [leadEmail, setLeadEmail] = useState("dr.kulkarni@engg.edu");
  const [proposalTitle, setProposalTitle] = useState("");
  const [technicalApproach, setTechnicalApproach] = useState("");
  const [cost, setCost] = useState("₹1,85,000");
  const [impact, setImpact] = useState(
    "Protects ~18,000 daily commuters; real-time sensor triggers PWD emergency alert before scour failure."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState(false);

  // Milestone Update State
  const [updatingMilestone, setUpdatingMilestone] = useState(false);

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

  const openProposalModal = (challenge: any) => {
    setSelectedChallenge(challenge);
    setProposalTitle(`Solar LoRaWAN Sensor Mesh Solution for ${challenge.title}`);
    setTechnicalApproach(
      "1. High-frequency tri-axial MEMS accelerometers on Pier 3 and Pier 4\n2. Solar-charged edge node with local threshold buzzer\n3. LoRaWAN telemetry to PWD cloud gateway\n4. Real-time vibration FFT analysis"
    );
  };

  const submitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallenge) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `/api/challenges/${selectedChallenge.id}/proposals`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teamName,
            institution,
            leadName,
            leadEmail,
            title: proposalTitle,
            description: proposalTitle,
            technicalApproach,
            estimatedCost: cost,
            expectedImpact: impact,
          }),
        }
      );

      if (res.ok) {
        setProposalSuccess(true);
        setTimeout(() => {
          setProposalSuccess(false);
          setSelectedChallenge(null);
          fetchChallenges();
        }, 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Complete a Milestone
  const completeMilestone = async (milestoneId: string) => {
    setUpdatingMilestone(true);
    try {
      const res = await fetch(`/api/implementations/${milestoneId}/milestones`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "COMPLETED",
          proofEvidenceUrl:
            "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
        }),
      });
      if (res.ok) {
        alert("Milestone verified and updated! Progress recorded on public ledger.");
        fetchChallenges();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingMilestone(false);
    }
  };

  return (
    <div className="space-y-8 py-4 animate-fade-in">
      {/* University Header */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">
                University & Researcher Collaboration Hub
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                NIRF & Academic Credit Aligned
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Apply engineering R&D, prototype prototypes for verified Indian societal challenges, and earn research grants.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Open Challenges: <strong className="text-emerald-400">{challenges.length}</strong>
        </div>
      </div>

      {/* Challenge Cards List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Loading Open Challenges...</p>
        </div>
      ) : challenges.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center border-slate-800">
          <p className="text-sm font-bold text-white">No Open Challenges Yet</p>
          <p className="text-xs text-slate-400 mt-1">
            Government officials will publish verified problems as challenges here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {challenges.map((challenge) => {
            const proposals = challenge.proposals || [];
            const activeProposal = proposals.find((p: any) => p.implementation);
            const implementation = activeProposal?.implementation;
            const milestones = implementation?.milestones || [];

            return (
              <div
                key={challenge.id}
                className="glass-panel p-6 rounded-2xl border-slate-800 space-y-5 hover:border-slate-700 transition"
              >
                {/* Challenge Header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                        {challenge.category}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                        {challenge.department}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold border border-amber-500/30">
                        Grant: {challenge.budgetEstimate || "₹2,50,000"}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mt-2 leading-snug">
                      {challenge.title}
                    </h3>
                  </div>

                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {challenge.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {challenge.description}
                </p>

                {/* Required Skills Badges */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Required Disciplines:
                  </span>
                  {challenge.requiredExpertise.split(",").map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700 text-[11px]"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>

                {/* Active Implementation Milestones Section (if accepted) */}
                {implementation && (
                  <div className="p-5 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                          Active Implementation: {activeProposal.team.name} ({activeProposal.team.institution})
                        </h4>
                      </div>
                      <span className="text-xs font-mono font-extrabold text-emerald-400">
                        {implementation.progressPercentage}% Completed
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                        style={{ width: `${implementation.progressPercentage}%` }}
                      />
                    </div>

                    {/* Milestones List */}
                    <div className="space-y-2 pt-2">
                      {milestones.map((m: any) => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs"
                        >
                          <div className="flex items-center space-x-2">
                            {m.status === "COMPLETED" ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            ) : (
                              <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
                            )}
                            <div>
                              <p className="font-semibold text-slate-200">{m.title}</p>
                              <p className="text-[10px] text-slate-400">{m.description}</p>
                            </div>
                          </div>

                          <div>
                            {m.status === "COMPLETED" ? (
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                                Verified
                              </span>
                            ) : (
                              <button
                                type="button"
                                disabled={updatingMilestone}
                                onClick={() => completeMilestone(m.id)}
                                className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] transition"
                              >
                                Submit Proof & Complete
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Card Footer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                  <span className="text-xs text-slate-400">
                    Proposals Submitted: <strong className="text-white">{proposals.length}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => openProposalModal(challenge)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit University Proposal</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* University Proposal Submission Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 border-slate-700 space-y-4 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Submit Technical Proposal & R&D Bid
                </h3>
              </div>
              <button
                onClick={() => setSelectedChallenge(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {proposalSuccess ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Proposal Successfully Submitted!</h4>
                <p className="text-xs text-slate-400">
                  Transmitted to PWD evaluation panel. Review status updated to UNDER_EVALUATION.
                </p>
              </div>
            ) : (
              <form onSubmit={submitProposal} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Team / Lab Name
                    </label>
                    <input
                      type="text"
                      required
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Institution / College
                    </label>
                    <input
                      type="text"
                      required
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Lead Researcher / Student Name
                    </label>
                    <input
                      type="text"
                      required
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Lead Email
                    </label>
                    <input
                      type="email"
                      required
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Proposal Title
                  </label>
                  <input
                    type="text"
                    required
                    value={proposalTitle}
                    onChange={(e) => setProposalTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Technical Approach & Architecture
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={technicalApproach}
                    onChange={(e) => setTechnicalApproach(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Estimated Cost / Budget
                    </label>
                    <input
                      type="text"
                      required
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Expected Measurable Impact
                    </label>
                    <input
                      type="text"
                      required
                      value={impact}
                      onChange={(e) => setImpact(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedChallenge(null)}
                    className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/25 flex items-center space-x-1.5"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Submit Proposal to Panel</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
