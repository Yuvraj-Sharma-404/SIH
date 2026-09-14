import React from "react";
import Link from "next/link";
import { Building2, Clock, Mail, MapPin, Phone, PhoneCall } from "lucide-react";

export const metadata = {
  title: "Contact Us | DARPG & SmadhanX Helpdesk",
  description: "Official Contact and Helpdesk details for Department of Administrative Reforms & Public Grievances (DARPG).",
};

export default function ContactPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="gov-card p-6 gov-border-t-navy bg-white dark:bg-slate-800/95 dark:border-slate-700 transition-colors">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gov-saffron bg-orange-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-orange-200 dark:border-amber-800/60">
            Support & Helpdesk
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-navy dark:text-white font-serif tracking-tight">
            Contact DARPG & SmadhanX Helpdesk
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Get in touch with the grievance redressing authorities, technical support, and ministry administrators.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* National Helpdesk Box */}
        <div className="gov-card p-6 bg-white dark:bg-slate-800/95 dark:border-slate-700 space-y-4 transition-colors">
          <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-700 pb-3">
            <PhoneCall className="w-5 h-5 text-gov-saffron" />
            <h2 className="text-base font-bold text-gov-navy dark:text-white">National Toll-Free Grievance Helpdesk</h2>
          </div>

          <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-4 rounded-xl bg-orange-50 dark:bg-amber-950/30 border border-orange-200 dark:border-amber-800/50">
              <span className="text-[11px] font-bold text-orange-900 dark:text-amber-300 uppercase">Toll-Free Helpline Number</span>
              <p className="text-2xl font-black text-gov-navy dark:text-white mt-1">1800-11-4000</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                Direct telephonic support for grievance registration & tracking assistance.
              </p>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
              <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">Operational Hours:</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">9:00 AM to 5:30 PM (Monday to Friday)</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
              <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">Email Support:</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">cpgrams-helpdesk@nic.in</p>
              </div>
            </div>
          </div>
        </div>

        {/* DARPG Headquarters Box */}
        <div className="gov-card p-6 bg-white dark:bg-slate-800/95 dark:border-slate-700 space-y-4 transition-colors">
          <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-700 pb-3">
            <Building2 className="w-5 h-5 text-gov-navy dark:text-sky-400" />
            <h2 className="text-base font-bold text-gov-navy dark:text-white">DARPG Headquarters (New Delhi)</h2>
          </div>

          <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
              <MapPin className="w-5 h-5 text-gov-saffron flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">Department Address:</span>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Department of Administrative Reforms & Public Grievances (DARPG),<br />
                  5th Floor, Sardar Patel Bhawan, Sansad Marg,<br />
                  New Delhi - 110001, India.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
              <Phone className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">Direct Office Lines:</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">+91-11-23742143 / 23742144</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
              <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">NIC Technical Team:</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">support-cpgrams@nic.in</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
