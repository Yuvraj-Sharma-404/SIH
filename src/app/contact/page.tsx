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
      <div className="gov-card p-6 gov-border-t-navy bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gov-saffron bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
            Support & Helpdesk
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-navy font-serif tracking-tight">
            Contact DARPG & SmadhanX Helpdesk
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Get in touch with the grievance redressing authorities, technical support, and ministry administrators.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* National Helpdesk Box */}
        <div className="gov-card p-6 bg-white space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
            <PhoneCall className="w-5 h-5 text-gov-saffron" />
            <h2 className="text-base font-bold text-gov-navy">National Toll-Free Grievance Helpdesk</h2>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
              <span className="text-[11px] font-bold text-orange-900 uppercase">Toll-Free Helpline Number</span>
              <p className="text-2xl font-black text-gov-navy mt-1">1800-11-4000</p>
              <p className="text-[11px] text-slate-600 mt-1">
                Direct telephonic support for grievance registration & tracking assistance.
              </p>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <div>
                <span className="font-bold text-slate-800">Operational Hours:</span>
                <p className="text-[11px] text-slate-500">9:00 AM to 5:30 PM (Monday to Friday)</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <div>
                <span className="font-bold text-slate-800">Email Support:</span>
                <p className="text-[11px] text-slate-500">cpgrams-helpdesk@nic.in</p>
              </div>
            </div>
          </div>
        </div>

        {/* DARPG Headquarters Box */}
        <div className="gov-card p-6 bg-white space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
            <Building2 className="w-5 h-5 text-gov-navy" />
            <h2 className="text-base font-bold text-gov-navy">DARPG Headquarters (New Delhi)</h2>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <MapPin className="w-5 h-5 text-gov-saffron flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">Department Address:</span>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Department of Administrative Reforms & Public Grievances (DARPG),<br />
                  5th Floor, Sardar Patel Bhawan, Sansad Marg,<br />
                  New Delhi - 110001, India.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <div>
                <span className="font-bold text-slate-800">Direct Office Lines:</span>
                <p className="text-[11px] text-slate-500">+91-11-23742143 / 23742144</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <div>
                <span className="font-bold text-slate-800">NIC Technical Team:</span>
                <p className="text-[11px] text-slate-500">support-cpgrams@nic.in</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
