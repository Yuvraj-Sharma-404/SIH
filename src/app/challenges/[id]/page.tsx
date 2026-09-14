"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  GraduationCap,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  Award,
  Loader2,
  ArrowLeft,
  HeartHandshake,
  Send,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function CanonicalChallengeDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState<any | null>(null);

  useEffect(() => {
    if (id) {
      fetchChallengeDetails(id);
    }
  }, [id]);

  const fetchChallengeDetails = async (challengeId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/challenges/${challengeId}`);
      const data = await res.json();
      if (data.success) {
        setChallenge(data.data);
      } else {
        setChallenge(null);
      }
    } catch (e) {
      console.error(e);
      setChallenge(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-2">
      <div className="flex items-center justify-between">
        <Link
          href="/challenges"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gov-navy hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to National Challenges Directory</span>
        </Link>
        <span className="text-xs font-mono text-slate-500">
          Canonical Challenge Dossier • Shared Role Route
        </span>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-gov-navy animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-mono">Loading Canonical Challenge Record...</p>
        </div>
      ) : !challenge ? (
        <div className="gov-card p-12 text-center space-y-3 bg-white border border-slate-200">
          <h3 className="text-base font-bold text-slate-900 font-serif">Challenge Not Found</h3>
          <p className="text-xs text-slate-500">
            No challenge record exists for ID "{id}".
          </p>
          <Link
            href="/challenges"
            className="inline-block px-4 py-2 rounded-lg bg-gov-navy text-white text-xs font-bold shadow-sm"
          >
            Browse All Challenges
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Challenge Card Header */}
          <div className="gov-card p-6 bg-white border border-slate-200 gov-border-t-emerald space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-gov-emerald bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                    {challenge.category}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                    Dept: {challenge.department}
                  </span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-amber-50 text-amber-900 font-bold border border-amber-200">
                    Seed Grant: {challenge.budgetEstimate || "₹2,50,000"}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gov-navy font-serif leading-snug">
                  {challenge.title}
                </h1>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Status</span>
                <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold font-mono bg-blue-50 text-blue-900 border border-blue-200">
                  {challenge.status}
                </span>
              </div>
            </div>

            {/* Scope & Description */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                Problem Statement & Technical Scope
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {challenge.description}
              </p>
            </div>

            {/* Required Disciplines */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-600">
                Required Disciplines & Key Technical Expertise:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {challenge.requiredExpertise?.split(",").map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded bg-white text-slate-800 border border-slate-300 font-medium text-[11px]"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Underlying Problem Context */}
            {challenge.problem && (
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2 text-xs">
                <span className="font-bold text-gov-navy flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-gov-saffron" />
                  <span>Originating Citizen Report ({challenge.problem.publicProblemId})</span>
                </span>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>Location:</strong> {challenge.problem.address || "Ranchi District, Jharkhand"} •{" "}
                  <strong>Citizen Reporter:</strong> {challenge.problem.reporterName}
                </p>
              </div>
            )}
          </div>

          {/* CSR Sponsorship Commitments Section */}
          <div className="gov-card p-6 bg-white border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center space-x-2 text-purple-900">
                <Briefcase className="w-5 h-5 text-purple-700" />
                <h2 className="text-sm font-bold text-gov-navy font-serif">
                  Corporate Social Responsibility (CSR) Industry Support ({challenge.sponsorships?.length || 0})
                </h2>
              </div>
              <Link
                href="/industry/explore"
                className="text-xs font-bold text-purple-700 hover:underline flex items-center space-x-1"
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Pledge Corporate CSR Grant →</span>
              </Link>
            </div>

            {challenge.sponsorships && challenge.sponsorships.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {challenge.sponsorships.map((s: any) => (
                  <div key={s.id} className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 text-xs space-y-1">
                    <span className="font-bold text-purple-950 block text-sm">{s.organizationName}</span>
                    <p className="text-slate-700">
                      <strong>Type:</strong> {s.pledgeType.replace(/_/g, " ")} • <strong>Commitment:</strong> {s.amountOrDetails}
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono block">Status: {s.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No corporate CSR pledges recorded yet for this challenge.</p>
            )}
          </div>

          {/* University Proposals & Implementation Progress Section */}
          <div className="gov-card p-6 bg-white border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center space-x-2 text-gov-navy">
                <GraduationCap className="w-5 h-5 text-gov-emerald" />
                <h2 className="text-sm font-bold text-gov-navy font-serif">
                  Submitted Academic R&D Proposals ({challenge.proposals?.length || 0})
                </h2>
              </div>
              <Link
                href="/university/challenges"
                className="text-xs font-bold text-gov-emerald hover:underline flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit University R&D Proposal →</span>
              </Link>
            </div>

            {challenge.proposals && challenge.proposals.length > 0 ? (
              <div className="space-y-4">
                {challenge.proposals.map((p: any) => (
                  <div key={p.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{p.title}</h3>
                        <p className="text-[11px] text-slate-600">
                          By: <strong>{p.team?.name}</strong> ({p.team?.institution})
                        </p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-100 text-blue-900 border border-blue-200">
                        Status: {p.status}
                      </span>
                    </div>

                    <p className="text-slate-700 leading-relaxed">
                      <strong>Technical Approach:</strong> {p.technicalApproach}
                    </p>

                    {/* Implementation Progress if active */}
                    {p.implementation && (
                      <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 space-y-2">
                        <div className="flex items-center justify-between text-emerald-950 font-bold">
                          <span>Implementation Progress ({p.implementation.status})</span>
                          <span className="font-mono">{p.implementation.progressPercentage}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full bg-gov-emerald"
                            style={{ width: `${p.implementation.progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No university proposals submitted yet for this challenge.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
