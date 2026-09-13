"use client";

import { useEffect, useState } from "react";
import {
  GraduationCap,
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  DollarSign,
  Building2,
  TrendingUp,
  FileText,
  Loader2,
  Users,
  Award,
  Star,
  Check,
  X,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import Link from "next/link";

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
  const [skills, setSkills] = useState("IoT, Structural Health Monitoring, Embedded C, Civil Engineering");
  const [proposalTitle, setProposalTitle] = useState("");
  const [technicalApproach, setTechnicalApproach] = useState("");
  const [cost, setCost] = useState("₹1,85,000");
  const [impact, setImpact] = useState(
    "Protects ~18,000 daily commuters; real-time sensor triggers PWD emergency alert before scour failure."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState(false);

  // Proposal Evaluation Modal State (TRD Section 11)
  const [evaluatingProposal, setEvaluatingProposal] = useState<any | null>(null);
  const [reviewerName, setReviewerName] = useState("Er. A. K. Sharma (PWD Technical Reviewer)");
  const [feasibilityScore, setFeasibilityScore] = useState(9);
  const [technicalViability, setTechnicalViability] = useState(9);
  const [innovationScore, setInnovationScore] = useState(8.5);
  const [impactScore, setImpactScore] = useState(9);
  const [scalabilityScore, setScalabilityScore] = useState(8.5);
  const [costScore, setCostScore] = useState(8);
  const [evalComments, setEvalComments] = useState("Solid engineering approach with solar LoRaWAN nodes to eliminate power cabling cost.");
  const [evalDecision, setEvalDecision] = useState<"ACCEPT" | "REJECT">("ACCEPT");
  const [isEvaluating, setIsEvaluating] = useState(false);

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
            skills,
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
        }, 1800);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Evaluation (TRD Section 11)
  const submitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatingProposal) return;
    setIsEvaluating(true);
    try {
      const res = await fetch(`/api/proposals/${evaluatingProposal.id}/evaluations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewerName,
          feasibilityScore,
          scalabilityScore,
          innovationScore,
          technicalViability,
          costScore,
          impactScore,
          comments: evalComments,
          decision: evalDecision,
        }),
      });

      if (res.ok) {
        alert(
          evalDecision === "ACCEPT"
            ? "Proposal Approved! Implementation lifecycle and milestone tracker initialized."
            : "Proposal review recorded."
        );
        setEvaluatingProposal(null);
        fetchChallenges();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
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
    <div className="space-y-6 py-2">
      {/* Header Banner */}
      <div className="gov-card p-6 bg-white border border-slate-200 gov-border-t-emerald flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-gov-emerald">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-gov-navy font-serif">
                University & Researcher Collaboration Hub
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                National Innovation Network
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Connect academia, student engineering cells, and research institutes with verified civic problems requiring R&D solutions.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Open Challenges</span>
            <span className="text-lg font-bold font-mono text-gov-emerald">{challenges.length}</span>
          </div>
        </div>
      </div>

      {/* Challenge Cards List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-gov-emerald animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-mono">Loading Open Societal Challenges...</p>
        </div>
      ) : challenges.length === 0 ? (
        <div className="gov-card p-12 rounded-xl text-center border border-slate-200 bg-white space-y-2">
          <p className="text-sm font-bold text-slate-800">No Open Challenges Yet</p>
          <p className="text-xs text-slate-500">
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
            const sponsorships = challenge.sponsorships || [];

            return (
              <div
                key={challenge.id}
                className="gov-card p-6 bg-white border border-slate-200 space-y-5 gov-card-hover"
              >
                {/* Challenge Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-gov-emerald bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                        {challenge.category}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                        Department: {challenge.department}
                      </span>
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200">
                        Seed Grant: {challenge.budgetEstimate || "₹2,50,000"}
                      </span>
                    </div>

                    <Link
                      href={`/challenges/${challenge.id}`}
                      className="text-lg font-bold text-gov-navy hover:text-gov-emerald mt-2 leading-snug font-serif transition block"
                    >
                      {challenge.title}
                    </Link>
                  </div>

                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                    Status: {challenge.status}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {challenge.description}
                </p>

                {/* Required Skills Badges */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-600">
                    Required Disciplines & Expertise:
                  </span>
                  {challenge.requiredExpertise?.split(",").map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded bg-white text-slate-800 border border-slate-300 text-[11px] font-medium shadow-2xs"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>

                {/* Industry Sponsorship Badges (PRD FR-12) */}
                {sponsorships.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 space-y-2">
                    <div className="flex items-center space-x-1.5 text-purple-900 text-xs font-bold">
                      <Briefcase className="w-4 h-4 text-purple-700" />
                      <span>Committed Industry CSR Partners & Mentors</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sponsorships.map((s: any) => (
                        <div key={s.id} className="p-2 rounded-lg bg-white border border-purple-200 text-xs shadow-2xs">
                          <span className="font-bold text-purple-950">{s.organizationName}</span>
                          <span className="text-[11px] text-slate-600 ml-2">
                            ({s.pledgeType.replace(/_/g, " ")}: <strong>{s.amountOrDetails}</strong>)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submitted Proposals & TRD Section 11 Evaluation Section */}
                {proposals.length > 0 && (
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-gov-navy uppercase font-mono tracking-wider">
                        Submitted Proposals ({proposals.length})
                      </h4>
                      <span className="text-[11px] text-slate-500 font-mono">
                        6-Factor Evaluated
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {proposals.map((p: any) => {
                        const evaluations = p.evaluations || [];
                        const latestEval = evaluations[0];

                        return (
                          <div
                            key={p.id}
                            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <span className="font-bold text-slate-900 text-sm">
                                  {p.title}
                                </span>
                                <p className="text-[11px] text-slate-600">
                                  By: <strong>{p.team?.name}</strong> ({p.team?.institution}) • Lead: {p.team?.leadName}
                                </p>
                              </div>

                              <div className="flex items-center space-x-2">
                                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                                  p.status === "ACCEPTED"
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                    : p.status === "REJECTED"
                                    ? "bg-rose-100 text-rose-800 border border-rose-300"
                                    : "bg-blue-100 text-blue-800 border border-blue-300"
                                }`}>
                                  {p.status}
                                </span>

                                {latestEval && (
                                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold text-[10px] border border-amber-200">
                                    Score: {latestEval.overallScore}/10
                                  </span>
                                )}

                                <button
                                  type="button"
                                  onClick={() => {
                                    setEvaluatingProposal(p);
                                    setFeasibilityScore(latestEval?.feasibilityScore || 9);
                                    setTechnicalViability(latestEval?.technicalViability || 9);
                                    setInnovationScore(latestEval?.innovationScore || 8.5);
                                    setImpactScore(latestEval?.overallScore || 9);
                                  }}
                                  className="px-2.5 py-1 rounded bg-gov-navy hover:bg-gov-navy-dark text-white text-[11px] font-bold transition shadow-xs"
                                >
                                  {latestEval ? "Re-Score" : "Evaluate & Score"}
                                </button>
                              </div>
                            </div>

                            <p className="text-slate-600 text-[11px]">
                              <strong>Approach:</strong> {p.technicalApproach}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200">
                              <span>Estimated Cost: <strong className="text-slate-800">{p.estimatedCost}</strong></span>
                              <span>Expected Impact: <strong className="text-slate-800">{p.expectedImpact}</strong></span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Active Implementation Milestones Section (if accepted) */}
                {implementation && (
                  <div className="p-5 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-gov-emerald" />
                        <h4 className="text-xs font-bold text-gov-emerald uppercase font-mono tracking-wider">
                          Active Implementation: {activeProposal.team?.name} ({activeProposal.team?.institution})
                        </h4>
                      </div>
                      <span className="text-xs font-mono font-extrabold text-gov-emerald">
                        {implementation.progressPercentage}% Completed
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-gov-emerald transition-all duration-500"
                        style={{ width: `${implementation.progressPercentage}%` }}
                      />
                    </div>

                    {/* Milestones List */}
                    <div className="space-y-2 pt-2">
                      {milestones.map((m: any) => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 text-xs shadow-2xs"
                        >
                          <div className="flex items-center space-x-2">
                            {m.status === "COMPLETED" ? (
                              <CheckCircle2 className="w-4 h-4 text-gov-emerald flex-shrink-0" />
                            ) : (
                              <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 animate-pulse" />
                            )}
                            <div>
                              <p className="font-semibold text-slate-900">{m.title}</p>
                              <p className="text-[10px] text-slate-500">{m.description}</p>
                            </div>
                          </div>

                          <div>
                            {m.status === "COMPLETED" ? (
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                                Verified
                              </span>
                            ) : (
                              <button
                                type="button"
                                disabled={updatingMilestone}
                                onClick={() => completeMilestone(m.id)}
                                className="px-3 py-1 rounded bg-gov-emerald hover:bg-emerald-700 text-white font-bold text-[10px] transition shadow-2xs"
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
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
                  <span className="text-xs text-slate-600">
                    Proposals Submitted: <strong className="text-gov-navy">{proposals.length}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => openProposalModal(challenge)}
                    className="px-4 py-2 rounded-lg bg-gov-emerald hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center space-x-1.5"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="gov-card w-full max-w-2xl rounded-2xl p-6 bg-white border border-slate-300 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-gov-emerald" />
                <h3 className="text-base font-bold text-gov-navy font-serif">
                  Submit Technical Proposal & R&D Bid
                </h3>
              </div>
              <button
                onClick={() => setSelectedChallenge(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {proposalSuccess ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-gov-emerald mx-auto" />
                <h4 className="text-lg font-bold text-slate-900 font-serif">Proposal Successfully Submitted!</h4>
                <p className="text-xs text-slate-600">
                  Transmitted to department evaluation panel. Status updated to UNDER_EVALUATION.
                </p>
              </div>
            ) : (
              <form onSubmit={submitProposal} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Team / Lab Name
                    </label>
                    <input
                      type="text"
                      required
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      University / Institution
                    </label>
                    <input
                      type="text"
                      required
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Faculty / Team Lead Name
                    </label>
                    <input
                      type="text"
                      required
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Institutional Email
                    </label>
                    <input
                      type="email"
                      required
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Proposal Title
                  </label>
                  <input
                    type="text"
                    required
                    value={proposalTitle}
                    onChange={(e) => setProposalTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Technical Approach & Architecture
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={technicalApproach}
                    onChange={(e) => setTechnicalApproach(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Estimated Prototype Budget
                    </label>
                    <input
                      type="text"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Team Skills / Disciplines
                    </label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Expected Societal Impact
                  </label>
                  <textarea
                    rows={2}
                    value={impact}
                    onChange={(e) => setImpact(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSelectedChallenge(null)}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-lg bg-gov-emerald hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center space-x-1"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Submit to Evaluation Board</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Proposal Evaluation & Scoring Modal (TRD Section 11) */}
      {evaluatingProposal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="gov-card w-full max-w-2xl rounded-2xl p-6 bg-white border border-slate-300 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-gov-navy" />
                <h3 className="text-base font-bold text-gov-navy font-serif">
                  Evaluate Proposal (Weighted Scoring)
                </h3>
              </div>
              <button
                onClick={() => setEvaluatingProposal(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitEvaluation} className="space-y-4">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <p className="font-bold text-slate-900">{evaluatingProposal.title}</p>
                <p className="text-slate-600 mt-0.5">
                  Applicant: <strong>{evaluatingProposal.team?.name}</strong> ({evaluatingProposal.team?.institution}) • Cost: <strong>{evaluatingProposal.estimatedCost}</strong>
                </p>
              </div>

              {/* 6 TRD Evaluation Scoring Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>1. Feasibility (25%)</span>
                    <span className="font-mono font-bold text-gov-navy">{feasibilityScore}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={feasibilityScore}
                    onChange={(e) => setFeasibilityScore(Number(e.target.value))}
                    className="w-full accent-gov-navy"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>2. Technical Viability (25%)</span>
                    <span className="font-mono font-bold text-gov-navy">{technicalViability}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={technicalViability}
                    onChange={(e) => setTechnicalViability(Number(e.target.value))}
                    className="w-full accent-gov-navy"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>3. Innovation (15%)</span>
                    <span className="font-mono font-bold text-gov-navy">{innovationScore}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={innovationScore}
                    onChange={(e) => setInnovationScore(Number(e.target.value))}
                    className="w-full accent-gov-navy"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>4. Expected Impact (15%)</span>
                    <span className="font-mono font-bold text-gov-navy">{impactScore}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={impactScore}
                    onChange={(e) => setImpactScore(Number(e.target.value))}
                    className="w-full accent-gov-navy"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>5. Scalability (10%)</span>
                    <span className="font-mono font-bold text-gov-navy">{scalabilityScore}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={scalabilityScore}
                    onChange={(e) => setScalabilityScore(Number(e.target.value))}
                    className="w-full accent-gov-navy"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>6. Cost Efficiency (10%)</span>
                    <span className="font-mono font-bold text-gov-navy">{costScore}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={costScore}
                    onChange={(e) => setCostScore(Number(e.target.value))}
                    className="w-full accent-gov-navy"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Evaluator Technical Comments & Feedback
                </label>
                <textarea
                  rows={2}
                  required
                  value={evalComments}
                  onChange={(e) => setEvalComments(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Evaluation Decision
                </label>
                <div className="flex items-center space-x-4 text-xs font-bold">
                  <label className="flex items-center space-x-1.5 cursor-pointer text-emerald-800">
                    <input
                      type="radio"
                      name="decision"
                      value="ACCEPT"
                      checked={evalDecision === "ACCEPT"}
                      onChange={() => setEvalDecision("ACCEPT")}
                      className="accent-gov-emerald"
                    />
                    <span>Approve Proposal & Award Implementation</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer text-rose-800">
                    <input
                      type="radio"
                      name="decision"
                      value="REJECT"
                      checked={evalDecision === "REJECT"}
                      onChange={() => setEvalDecision("REJECT")}
                      className="accent-rose-600"
                    />
                    <span>Reject Proposal</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEvaluatingProposal(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEvaluating}
                  className={`px-5 py-2 rounded-lg text-white text-xs font-bold shadow-sm transition flex items-center space-x-1 ${
                    evalDecision === "ACCEPT" ? "bg-gov-emerald hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
                  }`}
                >
                  {isEvaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>{evalDecision === "ACCEPT" ? "Approve & Start Implementation" : "Submit Rejection"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
