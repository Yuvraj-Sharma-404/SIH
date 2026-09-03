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
} from "lucide-react";
import Link from "next/link";

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

export default function CitizenTrackDynamicPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [complaint, setComplaint] = useState<any | null>(null);

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
          CPGRAMS Tracking Engine v1.0
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
          <h3 className="text-base font-bold text-slate-900">Grievance Not Found</h3>
          <p className="text-xs text-slate-500">
            No record exists for tracking ID "{id}".
          </p>
          <Link
            href="/track"
            className="inline-block px-4 py-2 rounded-lg bg-gov-navy text-white text-xs font-bold"
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
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-extrabold px-2.5 py-0.5 rounded bg-blue-50 text-gov-navy border border-blue-200">
                    Registration No: {complaint.publicProblemId}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {complaint.category}
                  </span>
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
                  Status
                </span>
                <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold font-mono bg-blue-100 text-blue-900 border border-blue-200">
                  {complaint.status.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {complaint.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Department</span>
                <p className="font-bold text-gov-navy mt-0.5">
                  {complaint.departmentName || "Public Works Department"}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Nodal Officer</span>
                <p className="font-bold text-slate-800 mt-0.5">
                  {complaint.assignedOfficer || "Er. A. K. Sharma (PWD)"}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Priority Index</span>
                <p className="font-bold text-gov-saffron mt-0.5 font-mono">
                  {complaint.priorityScore} / 100
                </p>
              </div>
            </div>
          </div>

          {/* CPGRAMS Lifecycle */}
          <div className="gov-card p-6 bg-white border border-slate-200 space-y-6">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
              CPGRAMS 8-Stage Resolution Workflow
            </h2>

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
