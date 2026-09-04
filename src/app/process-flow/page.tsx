import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, HelpCircle, Shield, Users } from "lucide-react";

export const metadata = {
  title: "Redress Process Flow | CPGRAMS",
  description: "Official Public Grievance Redress Process Flow and 8-Stage Lifecycle Architecture under CPGRAMS.",
};

export default function ProcessFlowPage() {
  const stages = [
    {
      step: "01",
      title: "Grievance Lodging",
      desc: "Citizen submits grievance via CPGRAMS web portal, mobile application, UMANG, or CSCs with automatic Registration ID generation.",
    },
    {
      step: "02",
      title: "Departmental Triage & Categorization",
      desc: "The portal categorizes the grievance and routes it directly to the concerned Central Ministry, Department, or State Government.",
    },
    {
      step: "03",
      title: "Nodal Officer Assignment",
      desc: "The Central/State Nodal PG Officer reviews the grievance and assigns it to the designated Sub-Nodal / Action Officer with a defined SLA.",
    },
    {
      step: "04",
      title: "Field Investigation & Action",
      desc: "Field officers inspect on-ground conditions, initiate necessary administrative or corrective action, and coordinate with local authorities.",
    },
    {
      step: "05",
      title: "Inter-Departmental Examination",
      desc: "If multiple departments or subordinate offices are involved, the nodal authority coordinates joint examination to ensure resolution.",
    },
    {
      step: "06",
      title: "Resolution & Evidence Upload",
      desc: "Officer submits photographic evidence and formal action-taken report before marking the grievance as resolved.",
    },
    {
      step: "07",
      title: "Citizen Feedback & Rating",
      desc: "Citizen receives SMS/email notification with resolution summary. The citizen rates the resolution from Excellent to Poor.",
    },
    {
      step: "08",
      title: "Appellate Review (If Rating is Poor)",
      desc: "If citizen rates resolution as 'Poor' or is dissatisfied, the portal enables filing an Appeal to the Appellate Nodal Authority for re-investigation.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="gov-card p-6 gov-border-t-navy bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gov-saffron bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
            CPGRAMS Standard Operating Procedure
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-navy font-serif tracking-tight">
            Redress Process Flow & Lifecycle
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Comprehensive workflow diagram illustrating grievance submission, departmental allocation, investigation, resolution, and appellate review.
          </p>
        </div>
      </div>

      {/* Official Flow Chart Image from Scraped Assets */}
      <div className="gov-card p-6 sm:p-8 bg-white text-center shadow-lg border border-slate-200">
        <h2 className="text-lg font-bold text-gov-navy mb-4 font-serif">
          Official Grievance Redressal Architecture Diagram
        </h2>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 inline-block max-w-full">
          <img
            src="/Images/flowChart.jpg"
            alt="Official CPGRAMS Redress Process Flow Chart"
            className="max-h-[600px] w-auto mx-auto object-contain rounded-lg shadow-sm"
          />
        </div>
        <p className="text-xs text-slate-500 mt-4">
          Source: Department of Administrative Reforms and Public Grievances (DARPG), Government of India.
        </p>
      </div>

      {/* Step by Step Breakdown */}
      <div className="gov-card p-6 sm:p-8 bg-white space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl font-bold text-gov-navy font-serif">
            8-Stage Grievance Redress Lifecycle
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Transparent milestones tracked in real time on the National Civic Problem-Solving Platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stages.map((stage) => (
            <div
              key={stage.step}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 hover:border-gov-navy hover:bg-white transition shadow-sm"
            >
              <div className="w-10 h-10 rounded-lg bg-gov-navy text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm">
                {stage.step}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">{stage.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{stage.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button Links */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
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
