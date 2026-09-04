"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Search,
  Calendar,
  AlertTriangle,
  Star,
  Loader2,
  ArrowLeft,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

const CPGRAMS_STAGES = [
  { key: "SUBMITTED", label: "Submitted", desc: "Grievance received via Portal / Kiosk" },
  { key: "ACKNOWLEDGED", label: "Acknowledged", desc: "Digital receipt generated with unique tracking ID" },
  { key: "UNDER_REVIEW", label: "Under Review", desc: "Initial verification & AI categorization" },
  { key: "ASSIGNED", label: "Assigned", desc: "Forwarded to competent nodal department" },
  { key: "IN_PROGRESS", label: "In Progress / Challenge Active", desc: "Field inspection / societal challenge underway" },
  { key: "RESOLVED", label: "Resolved", desc: "On-ground repair / deployment completed" },
  { key: "CITIZEN_FEEDBACK", label: "Citizen Feedback", desc: "Citizen confirmation on resolution" },
  { key: "CLOSED", label: "Closed", desc: "Formally closed in National Grievance Ledger" },
];

export default function CitizenTrackDynamicPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [complaint, setComplaint] = useState<any | null>(null);

  // Citizen Feedback Form State (PRD FR-17)
  const [rating, setRating] = useState(5);
  const [feedbackComments, setFeedbackComments] = useState("The structural repair was completed and vibration is gone.");
  const [isResolvedConfirmed, setIsResolvedConfirmed] = useState(true);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackDone, setFeedbackDone] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDetails(id);
    }
  }, [id]);

  const fetchDetails = async (problemId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/problems/${problemId}`);
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
      case "IMPLEMENTATION":
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

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint) return;
    setSubmittingFeedback(true);
    try {
      const res = await fetch(`/api/problems/${complaint.id}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comments: feedbackComments,
          isResolvedConfirmed,
        }),
      });

      if (res.ok) {
        setFeedbackDone(true);
        fetchDetails(id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2">
      <div className="flex items-center justify-between">
        <Link
          href="/track"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gov-navy hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Complaint Search</span>
        </Link>
        <span className="text-xs font-mono text-slate-500">
          CPGRAMS Lifecycle Engine • PRD FR-17 Aligned
        </span>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-gov-navy animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-mono">Loading dossier...</p>
        </div>
      ) : !complaint ? (
        <div className="gov-card p-12 text-center space-y-3 bg-white border border-slate-200">
          <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 font-serif">Grievance Not Found</h3>
          <p className="text-xs text-slate-500">
            No record exists for tracking ID "{id}".
          </p>
          <Link
            href="/track"
            className="inline-block px-4 py-2 rounded-lg bg-gov-navy text-white text-xs font-bold shadow-sm"
          >
            Search Complaints
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Dossier Card */}
          <div className="gov-card p-6 bg-white border border-slate-200 gov-border-t-navy space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-extrabold px-2.5 py-0.5 rounded bg-blue-50 text-gov-navy border border-blue-200">
                    Registration No: {complaint.publicProblemId}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {complaint.category}
                  </span>
                  {complaint.requestNote && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                      Action Required: Info Requested
                    </span>
                  )}
                </div>
                <h1 className="text-xl font-bold text-gov-navy mt-2 font-serif">
                  {complaint.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-1.5">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{complaint.address || "Wardha District, Maharashtra"}</span>
                  </span>
                  <span>•</span>
                  <span>Lodge Date: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">
                  Current Status
                </span>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                  complaint.status === "RESOLVED" || complaint.status === "CLOSED"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                    : complaint.status === "REJECTED"
                    ? "bg-rose-50 text-rose-800 border-rose-300"
                    : "bg-blue-50 text-blue-900 border-blue-200"
                }`}>
                  {complaint.status.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {complaint.description}
            </p>

            {/* Department & Officer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Responsible Department</span>
                <p className="font-bold text-gov-navy mt-0.5">
                  {complaint.departmentName || "Public Works Department"}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Designated Nodal Officer</span>
                <p className="font-bold text-slate-800 mt-0.5">
                  {complaint.assignedOfficer || "Er. A. K. Sharma (PWD Wardha)"}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Priority Assessment Index</span>
                <p className="font-bold text-gov-saffron mt-0.5 font-mono">
                  {complaint.priorityScore} / 100
                </p>
              </div>
            </div>

            {/* Evidence Preview if attached */}
            {complaint.evidence && complaint.evidence.length > 0 && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Submitted Evidence Media:</span>
                <div className="flex flex-wrap gap-3">
                  {complaint.evidence.map((ev: any) => (
                    <div key={ev.id} className="relative group rounded-lg overflow-hidden border border-slate-300 w-28 h-20 bg-slate-100">
                      <img src={ev.fileUrl} alt="Evidence" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-slate-900/70 text-white text-[9px] font-mono px-1 py-0.5 text-center truncate">
                        {ev.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Citizen Feedback Form (PRD FR-17 & TRD Section 13) */}
          {(complaint.status === "RESOLVED" || complaint.status === "CLOSED" || complaint.status === "CITIZEN_FEEDBACK") && (
            <div className="gov-card p-6 bg-white border border-emerald-200 gov-border-t-emerald space-y-4">
              <div className="flex items-center space-x-2 text-gov-emerald">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-base font-bold text-gov-navy font-serif">
                  Citizen Feedback & Resolution Confirmation (PRD FR-17)
                </h3>
              </div>

              {feedbackDone || complaint.status === "CLOSED" ? (
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                  <p className="font-bold text-sm">Thank you for confirming resolution!</p>
                  <p>Your feedback has been verified and this grievance is permanently archived as resolved on the public grievance ledger.</p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <p className="text-xs text-slate-600">
                    The designated department has marked this grievance as <strong>RESOLVED</strong>. Please verify if the issue was satisfactorily resolved on the ground.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Did the physical repair / resolution occur on ground?
                    </label>
                    <div className="flex items-center space-x-4 text-xs font-bold">
                      <label className="flex items-center space-x-1.5 cursor-pointer text-emerald-800">
                        <input
                          type="radio"
                          name="isResolved"
                          checked={isResolvedConfirmed}
                          onChange={() => setIsResolvedConfirmed(true)}
                          className="accent-gov-emerald"
                        />
                        <span>Yes, issue is resolved satisfactorily</span>
                      </label>
                      <label className="flex items-center space-x-1.5 cursor-pointer text-rose-800">
                        <input
                          type="radio"
                          name="isResolved"
                          checked={!isResolvedConfirmed}
                          onChange={() => setIsResolvedConfirmed(false)}
                          className="accent-rose-600"
                        />
                        <span>No, issue remains unresolved / dissatisfied</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Rate Resolution Quality (1 to 5 Stars)
                    </label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 text-amber-400 hover:scale-110 transition"
                        >
                          <Star className={`w-6 h-6 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                        </button>
                      ))}
                      <span className="text-xs font-mono font-bold text-slate-600 ml-2">
                        {rating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Citizen Feedback Remarks
                    </label>
                    <textarea
                      rows={2}
                      value={feedbackComments}
                      onChange={(e) => setFeedbackComments(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy"
                      placeholder="Provide any comments on quality of repair or service..."
                    />
                  </div>

                  {!isResolvedConfirmed && (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-700" />
                      <div>
                        <strong>Dissatisfied with Department Action?</strong>
                        <p className="mt-0.5">
                          Under statutory CPGRAMS rules, you have the right to file an Appeal with the Joint Secretary level Appellate Authority.{" "}
                          <Link href="/appeals" className="text-gov-navy underline font-bold">
                            File an Appeal to Nodal Appellate Authority →
                          </Link>
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="px-5 py-2.5 rounded-lg bg-gov-emerald hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center space-x-1.5"
                  >
                    {submittingFeedback ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>Submit Feedback & Close Grievance</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* CPGRAMS 8-Stage Resolution Workflow */}
          <div className="gov-card p-6 bg-white border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs font-bold text-gov-navy uppercase tracking-wider font-mono">
                CPGRAMS Resolution Lifecycle Tracking
              </h2>
              <span className="text-[11px] text-slate-500 font-mono">
                Real-Time Public Ledger
              </span>
            </div>

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
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
