import React from "react";
import Link from "next/link";
import { ArrowRight, FileCheck, HelpCircle, Scale, Shield, UserCheck } from "lucide-react";

export const metadata = {
  title: "Nodal Authority for Appeal | SmadhanX",
  description: "Guidelines and appellate mechanism under SmadhanX for unsatisfied grievance redressals.",
};

export default function AppealsPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="gov-card p-6 gov-border-t-navy bg-white dark:bg-slate-800/95 dark:border-slate-700 transition-colors">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gov-saffron bg-orange-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-orange-200 dark:border-amber-800/60">
            Appellate Mechanism
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-navy dark:text-white font-serif tracking-tight">
            Nodal Appellate Authorities & Appeal Process
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Citizens dissatisfied with the action taken report by the Grievance Redress Officer can file an official Appeal.
          </p>
        </div>
      </div>

      {/* Appellate Guidelines */}
      <div className="gov-card p-6 sm:p-8 bg-white dark:bg-slate-800/95 dark:border-slate-700 space-y-6 transition-colors">
        <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 space-y-4 text-justify">
          <h2 className="text-lg font-bold text-gov-navy dark:text-white font-serif">
            When can an Appeal be filed?
          </h2>
          <p>
            An appeal can be filed by a citizen within <strong className="text-slate-900 dark:text-white">30 days</strong> of the closure of a grievance if the complainant is not satisfied with the resolution or reply provided by the subordinate Grievance Officer.
          </p>
          <p>
            Upon closure, the complainant receives an alert to submit feedback rating (Excellent, Good, Average, or Poor). When the rating provided is <strong className="text-slate-900 dark:text-white">Poor</strong>, an &apos;Appeal&apos; button is enabled against the registration ID on the portal.
          </p>
        </div>

        {/* 3 Step Appellate Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-gov-navy dark:text-blue-300 flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">1. Closure & Rating</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Review the closure remarks and action-taken report uploaded by the department and submit feedback.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/50 text-gov-saffron flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">2. Submit Appeal Grounds</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Provide detailed justification and supporting photos/documents explaining why the redress is inadequate.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">3. Joint Secretary Review</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Appellate Authority (Joint Secretary level officer) independently reviews the case and issues a final directive.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/track"
            className="px-6 py-2.5 rounded-lg bg-gov-navy hover:bg-[#002b80] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <span>Check Grievance Status to File Appeal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/nodal-officers"
            className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-200 font-bold text-xs transition"
          >
            <span>View Appellate Authorities Directory</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
