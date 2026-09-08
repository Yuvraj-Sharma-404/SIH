import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Globe, Shield, Sparkles } from "lucide-react";

export const metadata = {
  title: "About SmadhanX | DARPG - Government of India",
  description: "About SmadhanX - Smart Centralized Public Grievance Redress And Monitoring System.",
};

export default function AboutPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="gov-card p-6 gov-border-t-navy bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gov-saffron bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
            About the Platform
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-navy font-serif tracking-tight">
            Centralized Public Grievance Redress And Monitoring System (SmadhanX)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Department of Administrative Reforms & Public Grievances (DARPG), Ministry of Personnel, Public Grievances & Pensions, Government of India.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="gov-card p-6 sm:p-8 bg-white space-y-6">
        <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 space-y-4 text-justify">
          <p>
            <strong>SmadhanX</strong> is an online web-enabled system developed in association with DARPG with the objective of speedy redress, intelligent deduplication, and effective monitoring of grievances by Ministries/Departments/Organizations of Government of India and State Governments.
          </p>
          <p>
            The system enables a citizen to lodge their grievance from anywhere, anytime 24x7 to the concerned Ministry/Department/Organization, which assigns it to the designated field officer. Each grievance is provided with a unique registration number which can be used to track the status of the grievance online.
          </p>
          <p>
            The system also facilitates the Grievance Officer in tracking and processing the grievance received by their organization. The system is customized to meet the functional requirements of different Ministries/Departments/State Governments.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-gov-navy flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">24x7 Universal Access</h3>
            <p className="text-xs text-slate-600">
              Citizens can lodge public grievances round the clock from web, mobile app, UMANG, and community service centres.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Appellate Mechanism</h3>
            <p className="text-xs text-slate-600">
              Complainants not satisfied with the resolution can file an appeal with the designated Appellate Authority.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-orange-100 text-gov-saffron flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Role-Based Access</h3>
            <p className="text-xs text-slate-600">
              Every Ministry, Central Department, and State Government has dedicated role-based officer access for rapid monitoring and resolution.
            </p>
          </div>
        </div>

        {/* Action Links */}
        <div className="pt-4 flex items-center justify-center gap-4">
          <Link
            href="/citizen/report"
            className="px-6 py-2.5 rounded-lg bg-gov-saffron hover:bg-orange-600 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <span>Lodge Grievance</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/process-flow"
            className="px-6 py-2.5 rounded-lg bg-gov-navy hover:bg-gov-navy-dark text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <span>View Process Flow</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
