import React from "react";
import Link from "next/link";
import { ArrowRight, FileCheck, HelpCircle, Scale, Shield, UserCheck } from "lucide-react";

export const metadata = {
  title: "Nodal Authority for Appeal | CPGRAMS",
  description: "Guidelines and appellate mechanism under CPGRAMS for unsatisfied grievance redressals.",
};

export default function AppealsPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="gov-card p-6 gov-border-t-navy bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gov-saffron bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
            Appellate Mechanism
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-navy font-serif tracking-tight">
            Nodal Appellate Authorities & Appeal Process
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Citizens dissatisfied with the action taken report by the Grievance Redress Officer can file an official Appeal.
          </p>
        </div>
      </div>

      {/* Appellate Guidelines */}
      <div className="gov-card p-6 sm:p-8 bg-white space-y-6">
        <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 space-y-4 text-justify">
          <h2 className="text-lg font-bold text-gov-navy font-serif">
            When can an Appeal be filed?
          </h2>
          <p>
            An appeal can be filed by a citizen within <strong>30 days</strong> of the closure of a grievance if the complainant is not satisfied with the resolution or reply provided by the subordinate Grievance Officer.
          </p>
          <p>
            Upon closure, the complainant receives an alert to submit feedback rating (Excellent, Good, Average, or Poor). When the rating provided is <strong>Poor</strong>, an &apos;Appeal&apos; button is enabled against the registration ID on the portal.
          </p>
        </div>

        {/* 3 Step Appellate Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-gov-navy flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">1. Closure & Rating</h3>
            <p className="text-xs text-slate-600">
              Review the closure remarks and action-taken report uploaded by the department and submit feedback.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-orange-100 text-gov-saffron flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">2. Submit Appeal Grounds</h3>
            <p className="text-xs text-slate-600">
              Provide detailed justification and supporting photos/documents explaining why the redress is inadequate.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">3. Joint Secretary Review</h3>
            <p className="text-xs text-slate-600">
              Appellate Authority (Joint Secretary level officer) independently reviews the case and issues a final directive.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/track"
            className="px-6 py-2.5 rounded-lg bg-gov-navy hover:bg-gov-navy-dark text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <span>Check Grievance Status to File Appeal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/nodal-officers"
            className="px-6 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs transition"
          >
            <span>View Appellate Authorities Directory</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
