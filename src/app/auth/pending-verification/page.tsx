"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Landmark,
  Building,
  User,
  FileCheck,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export default function PendingVerificationPage() {
  const router = useRouter();
  const [officer, setOfficer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Fetch current session / officer details
    async function fetchMe() {
      try {
        const res = await fetch("/api/auth/me?role=GOVERNMENT_OFFICIAL");
        const json = await res.json();
        if (json?.data) {
          setOfficer(json.data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchMe();
  }, []);

  const handleSimulateApproval = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/gov-approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: officer?.email,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Clearance could not be granted.");
      }
      setSuccess("Administrative clearance approved! Redirecting to Nodal Dashboard...");
      setTimeout(() => {
        router.push(data.redirectUrl || "/gov/dashboard");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Failed to grant clearance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 max-w-3xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="h-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />
        <div className="p-6 sm:p-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 uppercase tracking-wider mb-1">
                Departmental Clearance Required
              </span>
              <h1 className="text-2xl font-bold text-slate-900">
                Official Credential Verification Pending
              </h1>
            </div>
          </div>

          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            In accordance with the Central Public Grievance Security Protocol, government officer
            accounts require administrative verification by the National Nodal Division before
            granting access to citizen records, departmental triage consoles, and AI escalation
            parameters.
          </p>

          {/* Officer Reference Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center space-x-1.5">
              <FileCheck className="w-4 h-4 text-gov-navy" />
              <span>Application Reference Dossier</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Officer Name:</span>
                <span className="font-bold text-slate-900 text-sm">
                  {officer?.name || "Official Applicant"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Registered Official Email:</span>
                <span className="font-semibold text-slate-900">
                  {officer?.email || "government.official@gov.in"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Department / Ministry:</span>
                <span className="font-semibold text-slate-900">
                  {officer?.department || "Public Works Department (PWD)"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Designation:</span>
                <span className="font-semibold text-slate-900">
                  {officer?.designation || "Executive Engineer / Nodal PG Officer"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Verification Protocol:</span>
                <span className="inline-flex items-center text-amber-700 font-bold space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Stage 2 of 3: SPARROW / NIC Roster Audit</span>
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Dossier Reference ID:</span>
                <span className="font-mono font-bold text-gov-navy">
                  SX-GOV-AUDIT-{officer?.id ? officer.id.slice(0, 8).toUpperCase() : "8F2B90EA"}
                </span>
              </div>
            </div>
          </div>

          {/* Status Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {/* Interactive Simulation Panel for Hackathon / Evaluation */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-gov-navy" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gov-navy">
                    Evaluation & Demonstration Mode
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  In live deployment, the Central Nodal Officer verifies SPARROW and NIC credentials.
                  For evaluation purposes, you can simulate instantaneous administrative approval below:
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleSimulateApproval}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gov-navy hover:bg-[#002b80] text-white font-bold text-xs transition shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Granting Clearance...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Grant Clearance & Unlock Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
              <span className="text-[11px] text-slate-500">
                Immediately updates user status to ACTIVE and routes to /gov/dashboard.
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              ← Return to SmadhanX Home
            </Link>

            <Link
              href="/track"
              className="text-xs font-bold text-gov-navy hover:underline"
            >
              Track Public Grievances
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
