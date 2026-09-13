"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  CheckCircle2,
  Clock,
  Building2,
  Shield,
  MapPin,
  Calendar,
  AlertTriangle,
  Star,
  Loader2,
  FileText,
  User,
  ArrowRight,
} from "lucide-react";

// CPGRAMS 8-Stage Lifecycle
const CPGRAMS_STAGES = [
  { key: "SUBMITTED", label: "Submitted", desc: "Grievance received via Portal / Kiosk" },
  { key: "ACKNOWLEDGED", label: "Acknowledged", desc: "Digital receipt generated" },
  { key: "UNDER_REVIEW", label: "Under Review", desc: "Initial verification & AI categorization" },
  { key: "ASSIGNED", label: "Assigned", desc: "Forwarded to competent nodal department" },
  { key: "IN_PROGRESS", label: "In Progress", desc: "Field inspection / challenge active" },
  { key: "RESOLVED", label: "Resolved", desc: "On-ground repair / deployment completed" },
  { key: "CITIZEN_FEEDBACK", label: "Citizen Feedback", desc: "Citizen confirmation on resolution" },
  { key: "CLOSED", label: "Closed", desc: "Formally closed in National Grievance Ledger" },
];

function TrackComplaintContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id")?.trim() || "";

  const [complaintId, setComplaintId] = useState(initialId);
  const [searchedId, setSearchedId] = useState(initialId);
  const [hasSearched, setHasSearched] = useState(Boolean(initialId));
  const [loading, setLoading] = useState(false);
  const [complaint, setComplaint] = useState<any | null>(null);

  // Feedback Form State
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    const idParam = searchParams.get("id")?.trim();
    if (idParam) {
      setComplaintId(idParam);
      setSearchedId(idParam);
      setHasSearched(true);
      loadComplaint(idParam);
    } else {
      setComplaintId("");
      setSearchedId("");
      setHasSearched(false);
      setComplaint(null);
    }
  }, [searchParams]);

  const loadComplaint = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/problems/${encodeURIComponent(id.trim())}`);
      const data = await res.json();
      if (data.success) {
        setComplaint(data.data);
      } else {
        setComplaint(null);
      }
    } catch (e) {
      console.error(e);
      setComplaint(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintId.trim()) return;
    setSearchedId(complaintId.trim());
    setHasSearched(true);
    loadComplaint(complaintId.trim());
  };

  // Map backend status to CPGRAMS index (1 to 8)
  const getStageIndex = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return 1;
      case "AI_PROCESSED":
      case "PENDING_VERIFICATION":
        return 2;
      case "VERIFIED":
        return 3;
      case "ASSIGNED":
        return 4;
      case "SOLUTION_REQUIRED":
      case "COLLABORATION":
      case "IN_PROGRESS":
      case "SOLUTION_PROPOSED":
      case "APPROVED":
        return 5;
      case "RESOLVED":
        return 6;
      case "CITIZEN_FEEDBACK":
        return 7;
      case "CLOSED":
        return 8;
      default:
        return 2;
    }
  };

  const submitCitizenFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint) return;
    setSubmittingFeedback(true);
    try {
      const res = await fetch(`/api/problems/${complaint.id}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comments,
          isResolvedConfirmed: true,
        }),
      });
      if (res.ok) {
        setFeedbackSubmitted(true);
        loadComplaint(complaint.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div className="gov-card p-6 rounded-xl border border-slate-200 bg-white gov-border-t-navy space-y-4">
        <div>
          <span className="text-xs uppercase font-mono font-bold text-gov-saffron">
            SmadhanX Standard Workflow
          </span>
          <h1 className="text-2xl font-bold text-gov-navy font-serif mt-0.5">
            Track Citizen Grievance / Problem Status
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Enter your registration number to inspect complete chronological activity history, department assignment, and expected resolution milestones.
          </p>
        </div>

        {/* Complaint ID Search Box */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 pt-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
              placeholder="Enter Registration / Complaint ID (e.g. DARPG/E/2026/00001)"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-gov-navy font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-gov-navy hover:bg-gov-navy-dark text-white font-bold text-xs shadow-sm transition flex items-center justify-center space-x-1.5"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Track Dossier</span>
          </button>
        </form>
      </div>

      {/* Main Complaint Tracker Dossier */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-gov-navy animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-mono">Retrieving SmadhanX record...</p>
        </div>
      ) : !hasSearched ? (
        <div className="gov-card p-12 text-center space-y-3 bg-white border border-slate-200">
          <FileText className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Track Grievance Status</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Please enter your Grievance Registration Number in the search box above to inspect real-time departmental progress, assigned officers, and resolution milestones.
          </p>
        </div>
      ) : !complaint ? (
        <div className="gov-card p-12 text-center space-y-3 bg-white border border-slate-200">
          <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Grievance Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No record found matching &quot;{searchedId}&quot;. Please verify the registration number and try again.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Dossier Summary Header */}
          <div className="gov-card p-6 bg-white border border-slate-200 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-extrabold px-2.5 py-0.5 rounded bg-blue-50 text-gov-navy border border-blue-200">
                    Registration No: {complaint.publicProblemId}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {complaint.category}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gov-navy mt-2 font-serif">
                  {complaint.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-1.5">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{complaint.address || "Location not specified"}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Lodge Date: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                  </span>
                </div>
              </div>

              {/* 3-State High-Level Status Badge */}
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">
                  3-State Status
                </span>
                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                    complaint.status === "RESOLVED" || complaint.status === "CLOSED"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : complaint.status === "SUBMITTED" || complaint.status === "AI_PROCESSED" || complaint.status === "PENDING_VERIFICATION"
                      ? "bg-amber-100 text-amber-900 border-amber-300"
                      : "bg-blue-100 text-blue-900 border-blue-300"
                  }`}
                >
                  ● {complaint.status === "RESOLVED" || complaint.status === "CLOSED"
                    ? "RESOLVED"
                    : complaint.status === "SUBMITTED" || complaint.status === "AI_PROCESSED" || complaint.status === "PENDING_VERIFICATION"
                    ? "PENDING"
                    : "IN PROGRESS"}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {complaint.description}
            </p>

            {/* Department & Expected Timeline Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Competent Department
                </span>
                <p className="font-bold text-gov-navy mt-0.5">
                  {complaint.departmentName || "Pending Department Assignment"}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Assigned Authority / Officer
                </span>
                <p className="font-bold text-slate-800 mt-0.5">
                  {complaint.assignedOfficer || "Officer Assignment in Progress"}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Citizen Priority Index
                </span>
                <p className="font-bold text-gov-saffron mt-0.5 font-mono">
                  {complaint.priorityScore ?? 0} / 100
                  {complaint.priorityScore != null && (
                    <span className="text-[10px] font-sans font-medium text-slate-600 ml-1.5">
                      ({complaint.priorityScore >= 75 ? "High Priority" : complaint.priorityScore >= 40 ? "Medium Priority" : "Standard Priority"})
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Visual 8-Stage CPGRAMS Lifecycle Tracker */}
          <div className="gov-card p-6 bg-white border border-slate-200 space-y-6">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
              SmadhanX 8-Stage Resolution Workflow
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {CPGRAMS_STAGES.map((stage, idx) => {
                const stageIndex = idx + 1;
                const currentIndex = getStageIndex(complaint.status);
                const isCompleted = currentIndex > stageIndex;
                const isCurrent = currentIndex === stageIndex;

                return (
                  <div key={stage.key} className="relative">
                    <div
                      className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isCompleted
                          ? "bg-gov-emerald border-gov-emerald text-white"
                          : isCurrent
                          ? "bg-gov-saffron border-orange-400 text-white"
                          : "bg-white border-slate-300"
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="w-3 h-3" />}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <p
                          className={`text-xs font-bold ${
                            isCurrent
                              ? "text-gov-saffron font-extrabold"
                              : isCompleted
                              ? "text-slate-900"
                              : "text-slate-400"
                          }`}
                        >
                          {stageIndex}. {stage.label}
                        </p>
                        <p className="text-[11px] text-slate-500">{stage.desc}</p>
                      </div>

                      {isCurrent && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200 self-start sm:self-auto">
                          Active Stage
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-[10px] font-mono font-semibold text-gov-emerald">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Citizen Feedback Form (When in Resolved / Feedback Stage) */}
          <div className="gov-card p-6 bg-white border border-slate-200 space-y-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 font-serif">
                Citizen Feedback & Satisfaction Rating
              </h3>
            </div>

            {feedbackSubmitted || complaint.status === "CLOSED" ? (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  Thank you! Your satisfaction feedback has been recorded in the National Grievance Audit Ledger.
                </span>
              </div>
            ) : (
              <form onSubmit={submitCitizenFeedback} className="space-y-4">
                <p className="text-xs text-slate-600">
                  Are you satisfied with the on-ground departmental resolution of this grievance?
                </p>

                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          s <= rating
                            ? "text-amber-500 fill-amber-500"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-slate-600 font-semibold ml-2">
                    ({rating} out of 5 Stars)
                  </span>
                </div>

                <textarea
                  rows={2}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Enter resolution remarks (e.g. Bridge sensor telemetry active; road potholes repaired smoothly)..."
                  className="w-full p-3 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy"
                />

                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="px-5 py-2.5 rounded-lg bg-gov-emerald hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
                >
                  {submittingFeedback ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>Confirm Resolution & Close Grievance</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackComplaintPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-slate-500 font-medium">
            <Loader2 className="w-6 h-6 animate-spin text-gov-navy" />
            <span>Loading grievance tracker...</span>
          </div>
        </div>
      }
    >
      <TrackComplaintContent />
    </Suspense>
  );
}
