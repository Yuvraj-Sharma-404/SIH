import React from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, ArrowRight } from "lucide-react";

export const metadata = {
  title: "FAQs & Help | SmadhanX",
  description: "Frequently Asked Questions regarding SmadhanX public grievance redressal, tracking, appeals, and guidelines.",
};

const faqs = [
  {
    q: "What is SmadhanX?",
    a: "SmadhanX is an online AI-powered 24x7 web portal of Government of India facilitating citizens to lodge their grievances against Central Ministries, Departments, and State Governments with automated deduplication and real-time SLA tracking.",
  },
  {
    q: "How can I track the status of my grievance?",
    a: "After lodging a grievance, you receive a unique Registration Number via SMS and Email. You can enter this Registration ID on the 'View Status' page at any time to monitor the real-time 8-stage progress.",
  },
  {
    q: "What are the issues that cannot be redressed through SmadhanX?",
    a: "Issues related to RTI applications, court subjudice matters, religious disputes, and internal service matters of government employees (unless proper hierarchical channels are exhausted) cannot be entertained on SmadhanX.",
  },
  {
    q: "What if I am not satisfied with the grievance resolution?",
    a: "When a grievance is closed, the citizen is requested to provide feedback. If the rating provided is 'Poor', the option to file an Appeal is enabled on the portal, routing the case to the designated Appellate Authority.",
  },
  {
    q: "Is there any fee charged for filing a grievance on SmadhanX?",
    a: "No. The Government of India does NOT charge any fee from citizens for lodging grievances on SmadhanX through this official portal.",
  },
  {
    q: "How long does it take for a grievance to be redressed?",
    a: "As per DARPG guidelines, grievances are typically redressed within a standard time frame of 30 to 45 days, depending on the complexity of the matter and inter-departmental inquiries.",
  },
];

export default function FaqPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="gov-card p-6 gov-border-t-navy bg-white dark:bg-slate-800/95 dark:border-slate-700 transition-colors">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gov-saffron bg-orange-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-orange-200 dark:border-amber-800/60">
            Citizen Helpdesk & Guidance
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-navy dark:text-white font-serif tracking-tight">
            Frequently Asked Questions (FAQs)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Find answers to commonly asked questions regarding grievance registration, processing SLAs, appellate reviews, and portal features.
          </p>
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="gov-card p-6 sm:p-8 bg-white dark:bg-slate-800/95 dark:border-slate-700 space-y-4 transition-colors">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 hover:border-gov-navy dark:hover:border-sky-500 transition space-y-2"
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gov-navy dark:bg-sky-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                Q
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{faq.q}</h3>
            </div>
            <div className="pl-9 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{faq.a}</div>
          </div>
        ))}

        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 text-center space-y-3">
          <p className="text-xs text-slate-600 dark:text-slate-400">Still have questions or need personalized assistance?</p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/contact"
              className="px-5 py-2 rounded-lg bg-gov-navy hover:bg-[#002b80] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition"
            >
              Contact DARPG Support
            </Link>
            <Link
              href="/citizen/report"
              className="px-5 py-2 rounded-lg bg-gov-saffron hover:bg-orange-600 text-white font-bold text-xs shadow-sm transition"
            >
              Lodge a Grievance
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
