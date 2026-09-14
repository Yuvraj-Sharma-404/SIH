import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  MapPin,
  Cpu,
  Globe2,
  GitPullRequest,
  Building2,
  Wrench,
  RotateCcw,
  TrendingUp,
} from "lucide-react";

export const metadata = {
  title: "Redress Process Flow | SAMADHAN X",
  description: "Official Public Grievance Redress Process Flow and 9-Stage Collaborative Lifecycle Architecture under SAMADHAN X.",
};

export default function ProcessFlowPage() {
  const stages = [
    {
      step: "01",
      title: "Citizen Reports a Problem",
      subtitle: "Mobile/Web Interface or Simple Kiosk",
      desc: "Citizens easily report local civic issues (e.g. damaged roads, water leakage, waste accumulation, broken streetlights) through intuitive digital touchpoints or village kiosks.",
      icon: Sparkles,
      color: "bg-blue-600",
    },
    {
      step: "02",
      title: "Location & Evidence",
      subtitle: "Rich Media & Granular Geotagging",
      desc: "Captures problem descriptions, photos, videos, and voice recordings with verified geo-tagging down to District, Block, and Village/Locality level.",
      icon: MapPin,
      color: "bg-emerald-600",
    },
    {
      step: "03",
      title: "AI Analysis",
      subtitle: "Classification, Clustering & Urgency",
      desc: "AI classification identifies the grievance category, clusters identical/duplicate reports, and assesses severity scores to prioritize critical community hazards.",
      icon: Cpu,
      color: "bg-indigo-600",
    },
    {
      step: "04",
      title: "Geo-Intelligence",
      subtitle: "Heatmaps & Pattern Recognition",
      desc: "Aggregates individual complaints across geographical boundaries to detect systemic patterns, spatial density, and civic problem hotspots.",
      icon: Globe2,
      color: "bg-purple-600",
    },
    {
      step: "05",
      title: "Smart Routing",
      subtitle: "Automated Dispatch with Tracking ID",
      desc: "AI automatically routes tickets to the concerned Government authority with a unique Tracking ID: Submitted → Under Review → Assigned → In Progress → Resolved.",
      icon: GitPullRequest,
      color: "bg-amber-600",
    },
    {
      step: "06",
      title: "Collaboration Engine",
      subtitle: "Government, University & Industry",
      desc: "Connects persistent or complex public challenges with academia and industry innovators for collaborative, tech-driven, and sustainable problem solving.",
      icon: Building2,
      color: "bg-cyan-700",
    },
    {
      step: "07",
      title: "Solution & Implementation",
      subtitle: "Action Plan to Field Execution",
      desc: "A concrete, cost-effective solution is formulated and deployed by the designated nodal authority, academic teams, or collaborative partners.",
      icon: Wrench,
      color: "bg-teal-600",
    },
    {
      step: "08",
      title: "Citizen Tracking & Appeal",
      subtitle: "Live Status & Democratic Recourse",
      desc: "Citizens track progress in real-time. If the resolution is inadequate or dissatisfied, a built-in appellate mechanism ensures fair re-evaluation.",
      icon: RotateCcw,
      color: "bg-rose-600",
    },
    {
      step: "09",
      title: "Impact Tracking",
      subtitle: "Measurable Outcomes & Prevention",
      desc: "Monitors lasting civic impact: problems solved, citizens benefited, and systemic recurring complaints eliminated across communities.",
      icon: TrendingUp,
      color: "bg-green-700",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="gov-card p-6 gov-border-t-navy bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gov-saffron bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            SAMADHAN X Architecture & Standard Operating Procedure
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-navy font-serif tracking-tight">
            Redress Process Flow & Solution Architecture
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            From Citizen Problem to Collaborative Solution: Comprehensive next-generation grievance redressal architecture powered by AI, geo-intelligence, and multi-stakeholder collaboration.
          </p>
        </div>
      </div>

      {/* Official SAMADHAN X Architecture Diagram */}
      <div className="gov-card p-6 sm:p-8 bg-white text-center shadow-lg border border-slate-200">
        <div className="max-w-4xl mx-auto mb-5">
          <span className="text-[11px] font-bold text-gov-navy uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
            Official System Workflow
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gov-navy mt-2 font-serif">
            SAMADHAN X Collaborative Redressal Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            From Citizen Problem to Collaborative Solution — From Reporting Problems to Creating Measurable Impact
          </p>
        </div>

        <div className="bg-gradient-to-b from-slate-50 to-slate-100/70 p-3 sm:p-5 rounded-2xl border border-slate-200 inline-block w-full max-w-5xl shadow-inner">
          <img
            src="/Images/samadhanx-flow.png"
            alt="SAMADHAN X - From Citizen Problem to Collaborative Solution Process Flow Diagram"
            className="w-full h-auto max-h-[750px] mx-auto object-contain rounded-xl shadow-md bg-white border border-slate-200"
          />
        </div>
        <p className="text-xs text-slate-500 mt-4">
          SAMADHAN X — Next-Generation National Civic Problem-Solving & Grievance Redressal Architecture.
        </p>
      </div>

      {/* Step by Step Breakdown */}
      <div className="gov-card p-6 sm:p-8 bg-white space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-gov-navy font-serif">
                9-Stage Collaborative Redress Lifecycle
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Milestones tracked end-to-end with full transparency, accountability, and citizen participation.
              </p>
            </div>
            <span className="text-xs font-semibold text-gov-navy bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Stages 01 – 09
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.step}
                className="p-5 rounded-xl bg-slate-50/80 border border-slate-200 hover:border-gov-navy hover:bg-white transition shadow-xs hover:shadow-md flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-9 h-9 rounded-lg bg-gov-navy text-white flex items-center justify-center font-black text-xs shadow-xs group-hover:bg-gov-saffron transition-colors">
                      {stage.step}
                    </span>
                    <div className={`p-2 rounded-lg text-white ${stage.color} shadow-xs`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-gov-navy transition-colors">
                      {stage.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-gov-saffron mt-0.5">
                      {stage.subtitle}
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-200/60">
                    {stage.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button Links */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 border-t border-slate-200">
          <Link
            href="/citizen/report"
            className="px-6 py-2.5 rounded-lg bg-gov-saffron hover:bg-orange-600 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <span>Lodge a Grievance</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/track"
            className="px-6 py-2.5 rounded-lg bg-gov-navy hover:bg-gov-navy-dark text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <span>Track Grievance Status</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
