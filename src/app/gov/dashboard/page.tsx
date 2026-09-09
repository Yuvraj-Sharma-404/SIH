"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  ShieldCheck,
  AlertTriangle,
  GitMerge,
  Sparkles,
  MapPin,
  CheckCircle2,
  PlusCircle,
  Clock,
  Loader2,
  Filter,
  TrendingUp,
  Info,
  Calendar,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function GovernmentDashboardPage() {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Challenge Modal State
  const [selectedProblem, setSelectedProblem] = useState<any | null>(null);
  const [challengeTitle, setChallengeTitle] = useState("");
  const [challengeDesc, setChallengeDesc] = useState("");
  const [requiredExpertise, setRequiredExpertise] = useState("");
  const [budget, setBudget] = useState("₹2,50,000");
  const [isPublishing, setIsPublishing] = useState(false);

  // New Official Action Modals (PRD FR-08 & TRD Section 8 & 9)
  const [rejectProblem, setRejectProblem] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState("Issue is outside municipal jurisdiction / non-actionable.");
  const [requestInfoProblem, setRequestInfoProblem] = useState<any | null>(null);
  const [requestInfoNote, setRequestInfoNote] = useState("Please upload geotagged high-resolution photographs and nearest landmark.");
  const [overrideProblem, setOverrideProblem] = useState<any | null>(null);
  const [newPriority, setNewPriority] = useState<number>(85);
  const [overrideReason, setOverrideReason] = useState("On-ground inspection revealed acute safety hazard for local transit.");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/problems");
      const data = await res.json();
      if (data.success) {
        setProblems(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: string) => {
    try {
      const res = await fetch(`/api/problems/${id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "VERIFIED",
          assignedOfficer: "Er. A. K. Sharma (PWD)",
        }),
      });
      if (res.ok) fetchProblems();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMerge = async (primaryId: string, duplicateId: string) => {
    try {
      const res = await fetch(`/api/problems/${primaryId}/merge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duplicateProblemId: duplicateId,
          officerName: "Er. A. K. Sharma",
        }),
      });
      if (res.ok) {
        alert("Grievances merged successfully! Priority score updated.");
        fetchProblems();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectProblem) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/problems/${rejectProblem.id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REJECT",
          rejectionReason,
          assignedOfficer: "Er. A. K. Sharma (PWD)",
        }),
      });
      if (res.ok) {
        setRejectProblem(null);
        fetchProblems();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestInfoProblem) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/problems/${requestInfoProblem.id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REQUEST_INFORMATION",
          requestNote: requestInfoNote,
          assignedOfficer: "Er. A. K. Sharma (PWD)",
        }),
      });
      if (res.ok) {
        setRequestInfoProblem(null);
        fetchProblems();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOverridePriority = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideProblem) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/problems/${overrideProblem.id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "OVERRIDE_PRIORITY",
          newPriorityScore: Number(newPriority),
          overrideReason,
          assignedOfficer: "Er. A. K. Sharma (PWD)",
        }),
      });
      if (res.ok) {
        setOverrideProblem(null);
        fetchProblems();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const openChallengeModal = (prob: any) => {
    setSelectedProblem(prob);
    setChallengeTitle(`Societal Challenge: Engineering Resolution for ${prob.title}`);
    setChallengeDesc(prob.description);
    setRequiredExpertise(
      prob.aiAnalyses?.[0]?.requiredExpertise || "Civil Engineering, IoT Sensors, Water Testing"
    );
    setBudget("₹3,00,000");
  };

  const handlePublishChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProblem) return;
    setIsPublishing(true);
    try {
      const res = await fetch(`/api/problems/${selectedProblem.id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "SOLUTION_REQUIRED",
          createChallenge: true,
          challengeTitle,
          challengeDescription: challengeDesc,
          requiredExpertise,
          budgetEstimate: budget,
          assignedDepartment: selectedProblem.departmentName,
          assignedOfficer: "Er. A. K. Sharma (PWD)",
        }),
      });
      if (res.ok) {
        setSelectedProblem(null);
        fetchProblems();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPublishing(false);
    }
  };

  // Metrics
  const total = problems.length;
  const newCount = problems.filter((p) => p.status === "SUBMITTED").length;
  const inProgress = problems.filter(
    (p) =>
      p.status === "ASSIGNED" ||
      p.status === "SOLUTION_REQUIRED" ||
      p.status === "IN_PROGRESS" ||
      p.status === "VERIFIED"
  ).length;
  const highPriority = problems.filter((p) => p.priorityScore >= 80).length;
  const resolved = problems.filter((p) => p.status === "RESOLVED" || p.status === "CLOSED").length;
  const overdue = 1; // demo metric

  // Filtered List
  const filtered = problems.filter((p) => {
    if (selectedCategory !== "ALL" && p.category !== selectedCategory) return false;
    if (selectedStatus !== "ALL" && p.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="space-y-8 py-2">
      {/* Official Government Banner */}
      <div className="gov-card p-6 bg-white border border-slate-200 gov-border-t-navy flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gov-navy text-white flex items-center justify-center font-bold flex-shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-gov-navy font-serif">
                Government Official Management Workbench
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                NIC Authenticated
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Authorized Officer: <strong className="text-slate-900">Er. A. K. Sharma</strong> (Executive Engineer, PWD Wardha Division)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/map"
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition flex items-center space-x-1"
          >
            <MapPin className="w-3.5 h-3.5 text-gov-navy" />
            <span>Problem Density Map</span>
          </Link>
          <button
            onClick={fetchProblems}
            className="px-3.5 py-2 rounded-lg bg-gov-navy text-white hover:bg-gov-navy-dark text-xs font-bold transition shadow-sm"
          >
            Refresh Queue
          </button>
        </div>
      </div>

      {/* Top Actionable Overview KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="gov-card p-4 bg-white border border-slate-200 text-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Complaints
          </span>
          <p className="text-2xl font-extrabold text-gov-navy font-mono mt-1">{total}</p>
        </div>
        <div className="gov-card p-4 bg-white border border-slate-200 text-center">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
            New / Pending
          </span>
          <p className="text-2xl font-extrabold text-blue-700 font-mono mt-1">{newCount + 1}</p>
        </div>
        <div className="gov-card p-4 bg-white border border-slate-200 text-center">
          <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">
            In Progress
          </span>
          <p className="text-2xl font-extrabold text-gov-saffron font-mono mt-1">{inProgress}</p>
        </div>
        <div className="gov-card p-4 bg-white border border-slate-200 text-center">
          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
            High Priority (&gt;80)
          </span>
          <p className="text-2xl font-extrabold text-rose-600 font-mono mt-1">{highPriority}</p>
        </div>
        <div className="gov-card p-4 bg-white border border-slate-200 text-center">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
            Overdue Escalation
          </span>
          <p className="text-2xl font-extrabold text-amber-600 font-mono mt-1">{overdue}</p>
        </div>
        <div className="gov-card p-4 bg-white border border-slate-200 text-center">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
            Resolved
          </span>
          <p className="text-2xl font-extrabold text-gov-emerald font-mono mt-1">{resolved}</p>
        </div>
      </div>

      {/* Section 6: AI INSIGHTS (The Core Differentiator) */}
      <div className="gov-card p-6 bg-white border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-gov-saffron" />
            <h2 className="text-base font-bold text-gov-navy font-serif">
              AI-Generated Civic Insights & Pattern Detection
            </h2>
          </div>
          <div className="p-1 px-2.5 rounded bg-blue-50 border border-blue-200 text-[11px] text-gov-navy font-medium flex items-center space-x-1">
            <Info className="w-3.5 h-3.5 text-gov-navy" />
            <span>Advisory AI Insights • Final Decisions Reserved for Authorized Officials</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Pattern Insight */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 uppercase">
              Trend Pattern
            </span>
            <p className="text-xs font-bold text-slate-800">
              "Road-related complaints increased 32% in this district during the last 30 days."
            </p>
            <p className="text-[11px] text-slate-500">
              Correlated with recent heavy monsoon runoff along Dham River corridor.
            </p>
          </div>

          {/* Card 2: Priority Recommendation */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-900 uppercase">
              Duplicate Clustering
            </span>
            <p className="text-xs font-bold text-slate-800">
              "12 complaints appear to describe the same underlying issue."
            </p>
            <p className="text-[11px] text-slate-500">
              Multiple citizen reports corroborate structural pier vibration at Sevagram bridge.
            </p>
          </div>

          {/* Card 3: Hotspot Detection */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-900 uppercase">
              Hotspot Alert
            </span>
            <p className="text-xs font-bold text-slate-800">
              "High concentration of sanitation complaints detected in Sector 4."
            </p>
            <p className="text-[11px] text-slate-500">
              Clustered within 400m radius around Zilla Parishad school water pipeline.
            </p>
          </div>

          {/* Card 4: Suggested Action */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 uppercase">
              Recommended Action
            </span>
            <p className="text-xs font-bold text-slate-800">
              "Consider assigning a field inspection team."
            </p>
            <p className="text-[11px] text-slate-500">
              Nodal division: Public Works Division 2 or Jal Jeevan Mission field team.
            </p>
          </div>
        </div>
      </div>

      {/* Complaint List & Transparent Priority Engine */}
      <div className="gov-card p-6 bg-white border border-slate-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
          <h2 className="text-base font-bold text-gov-navy font-serif">
            Grievances Queue & Transparent Priority Assessment
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy text-slate-700"
            >
              <option value="ALL">All Categories</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Water & Sanitation">Water & Sanitation</option>
              <option value="Energy">Energy</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy text-slate-700"
            >
              <option value="ALL">All Statuses (15 Lifecycle Stages)</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="PENDING_VERIFICATION">Pending Verification</option>
              <option value="VERIFIED">Verified</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="UNDER_INVESTIGATION">Under Investigation</option>
              <option value="SOLUTION_REQUIRED">Challenge Created (R&D)</option>
              <option value="COLLABORATION">Collaboration Active</option>
              <option value="SOLUTION_PROPOSED">Solution Proposed</option>
              <option value="APPROVED">Approved / Awarded</option>
              <option value="IMPLEMENTATION">Implementation in Progress</option>
              <option value="RESOLVED">Resolved on Ground</option>
              <option value="REJECTED">Rejected</option>
              <option value="CLOSED">Closed (Citizen Confirmed)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-gov-navy animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-mono">Loading Grievance Queue...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No complaints matching the selected filter criteria.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((prob) => {
              const duplicates = prob.duplicateMatches || [];

              return (
                <div
                  key={prob.id}
                  className="p-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition space-y-4"
                >
                  {/* Header Row */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-950">
                          {prob.publicProblemId}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          {prob.category}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          Dept: {prob.departmentName || "Public Works Department"}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-gov-navy mt-1 font-serif">
                        {prob.title}
                      </h3>
                      <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{prob.address}</span>
                        </span>
                        <span>•</span>
                        <span>Complainant: {prob.reporterName}</span>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                      {prob.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {prob.description}
                  </p>

                  {/* Section 7: TRANSPARENT PRIORITY BREAKDOWN BARS */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-800">
                          Priority Score:
                        </span>
                        <span className="text-sm font-extrabold font-mono text-gov-saffron">
                          {prob.priorityScore} / 100
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                          {prob.priorityScore >= 80 ? "High Priority" : "Routine Priority"}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Multi-Factor Deterministic Calculation
                      </span>
                    </div>

                    {/* Direct Priority Score Explanation for Reviewers (Item B.3) */}
                    {prob.priorityAssessments && prob.priorityAssessments.length > 0 && (
                      <div className="p-2.5 rounded-lg bg-orange-50/70 border border-orange-200 text-xs text-orange-950 flex items-start space-x-2">
                        <Info className="w-4 h-4 text-gov-saffron flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900">Priority Audit Explanation: </span>
                          <span className="font-mono text-[11px]">{prob.priorityAssessments[prob.priorityAssessments.length - 1].explanation}</span>
                        </div>
                      </div>
                    )}

                    {/* Factor Breakdown Bars */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                          <span>Severity</span>
                          <span>{Math.round((prob.severity || 0.5) * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                          <div className="h-full bg-red-600 rounded-full" style={{ width: `${Math.round((prob.severity || 0.5) * 100)}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                          <span>Urgency</span>
                          <span>{Math.round((prob.urgency || 0.5) * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.round((prob.urgency || 0.5) * 100)}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                          <span>Recurrence</span>
                          <span>{duplicates.length > 0 ? "85%" : "30%"}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: duplicates.length > 0 ? "85%" : "30%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                          <span>Confidence</span>
                          <span>92%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                          <div className="h-full bg-purple-600 rounded-full" style={{ width: "92%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Duplicate Alert with 1-Click Merge */}
                  {duplicates.length > 0 && (
                    <div className="p-3.5 rounded-lg bg-orange-50 border border-orange-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center space-x-2 text-orange-950">
                        <GitMerge className="w-4 h-4 text-gov-saffron" />
                        <span>
                          <strong>Duplicate Cluster Detected: </strong>
                          Matches nearby report "{duplicates[0].matchedProblem?.title}" (
                          {(duplicates[0].totalDuplicateScore * 100).toFixed(0)}% match,{" "}
                          {duplicates[0].geoDistanceMeters}m away)
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleMerge(prob.id, duplicates[0].matchedProblemId)}
                        className="px-3 py-1 rounded bg-gov-saffron hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition"
                      >
                        1-Click Merge Reports
                      </button>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-mono">
                      <span>Nodal: {prob.assignedOfficer || "Er. A. K. Sharma (PWD)"}</span>
                      {prob.rejectionReason && (
                        <span className="text-rose-600 font-sans font-semibold">
                          • Rejection: {prob.rejectionReason}
                        </span>
                      )}
                      {prob.requestNote && (
                        <span className="text-amber-700 font-sans font-semibold">
                          • Info Requested: {prob.requestNote}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {(prob.status === "SUBMITTED" || prob.status === "PENDING_VERIFICATION" || prob.status === "MORE_INFO_NEEDED") && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleVerify(prob.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 text-xs font-bold transition flex items-center space-x-1 shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verify Report</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRequestInfoProblem(prob);
                              setRequestInfoNote("Please upload additional geotagged photos and landmark details.");
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold transition"
                          >
                            Request More Info
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRejectProblem(prob);
                              setRejectionReason("Non-actionable under current municipal civic jurisdiction.");
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-semibold transition"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setOverrideProblem(prob);
                          setNewPriority(Math.round(prob.priorityScore));
                          setOverrideReason("On-ground inspection assessment of public safety risk.");
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold transition"
                      >
                        Override Priority
                      </button>

                      <button
                        type="button"
                        onClick={() => openChallengeModal(prob)}
                        className="px-3.5 py-1.5 rounded-lg bg-gov-navy hover:bg-gov-navy-dark text-white text-xs font-bold shadow-sm transition flex items-center space-x-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Create Challenge</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Convert to Societal Challenge Modal */}
      {selectedProblem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="gov-card w-full max-w-2xl rounded-2xl p-6 bg-white border border-slate-300 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <PlusCircle className="w-5 h-5 text-gov-navy" />
                <h3 className="text-base font-bold text-gov-navy font-serif">
                  Publish Societal Challenge (MyGov Participation Model)
                </h3>
              </div>
              <button
                onClick={() => setSelectedProblem(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePublishChallenge} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Challenge Title
                </label>
                <input
                  type="text"
                  required
                  value={challengeTitle}
                  onChange={(e) => setChallengeTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Scope & Problem Statement
                </label>
                <textarea
                  rows={3}
                  required
                  value={challengeDesc}
                  onChange={(e) => setChallengeDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Required Disciplines / Skills
                  </label>
                  <input
                    type="text"
                    value={requiredExpertise}
                    onChange={(e) => setRequiredExpertise(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Seed Grant / Budget
                  </label>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedProblem(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="px-5 py-2 rounded-lg bg-gov-navy hover:bg-gov-navy-dark text-white text-xs font-bold shadow-sm transition flex items-center space-x-1"
                >
                  {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                  <span>Publish to MyGov Hub</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Reject Grievance Modal (PRD FR-08) */}
      {rejectProblem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="gov-card w-full max-w-lg rounded-2xl p-6 bg-white border border-rose-300 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2 text-rose-700">
                <AlertCircle className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  Reject Public Grievance
                </h3>
              </div>
              <button onClick={() => setRejectProblem(null)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleReject} className="space-y-4">
              <p className="text-xs text-slate-600">
                Rejecting report <strong>{rejectProblem.publicProblemId}</strong>: "{rejectProblem.title}". An official audit trail will be logged and the citizen will be notified with this formal reason.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Justification / Reason for Rejection
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-rose-500"
                  placeholder="State clear administrative or jurisdictional reason..."
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setRejectProblem(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition flex items-center space-x-1"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Confirm Rejection</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Request Information Modal (PRD FR-08 & TRD Section 9) */}
      {requestInfoProblem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="gov-card w-full max-w-lg rounded-2xl p-6 bg-white border border-amber-300 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2 text-amber-700">
                <Info className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  Request Information from Citizen
                </h3>
              </div>
              <button onClick={() => setRequestInfoProblem(null)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleRequestInfo} className="space-y-4">
              <p className="text-xs text-slate-600">
                Requesting clarifying evidence for <strong>{requestInfoProblem.publicProblemId}</strong>. The problem will remain in review until the citizen provides supplementary details.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Required Information / Document Specifications
                </label>
                <textarea
                  rows={3}
                  required
                  value={requestInfoNote}
                  onChange={(e) => setRequestInfoNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
                  placeholder="Specify required documents, geotagged photos, or utility meter numbers..."
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setRequestInfoProblem(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition flex items-center space-x-1"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Dispatch Information Notice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Human Priority Override Modal (TRD Section 8) */}
      {overrideProblem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="gov-card w-full max-w-lg rounded-2xl p-6 bg-white border border-slate-300 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2 text-gov-navy">
                <TrendingUp className="w-5 h-5" />
                <h3 className="text-base font-bold text-gov-navy font-serif">
                  Human Priority Override (TRD Section 8 Audited)
                </h3>
              </div>
              <button onClick={() => setOverrideProblem(null)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleOverridePriority} className="space-y-4">
              <p className="text-xs text-slate-600">
                AI priority recommendation is assistive. Government officials maintain ultimate authority to calibrate priority based on ground reality.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Adjusted Priority Score (0 to 100)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newPriority}
                    onChange={(e) => setNewPriority(Number(e.target.value))}
                    className="flex-1 accent-gov-saffron"
                  />
                  <span className="text-sm font-bold font-mono text-gov-saffron w-12 text-right">
                    {newPriority}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Justification / Ground Assessment Notes
                </label>
                <textarea
                  rows={3}
                  required
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy"
                  placeholder="State reason for priority adjustment (e.g. proximity to school, flood season)..."
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setOverrideProblem(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-lg bg-gov-navy hover:bg-gov-navy-dark text-white text-xs font-bold shadow-sm transition flex items-center space-x-1"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Save Priority Override</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
