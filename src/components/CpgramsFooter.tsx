"use client";

import React from "react";
import Link from "next/link";

export default function CpgramsFooter() {
  return (
    <footer className="bg-[#001c5a] text-white text-xs border-t-4 border-gov-saffron mt-auto">
      {/* 1. Top Section - Social Media & Department Ownership Notice */}
      <div className="border-b border-white/10 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          {/* Social Media Links with Official Scraped Icons */}
          <div className="flex items-center justify-center gap-4">
            <span className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider">
              Connect With DARPG:
            </span>
            <a
              href="https://www.facebook.com/DARPGIndia/"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 bg-white/10 hover:bg-white/25 rounded-full transition-transform hover:scale-110"
              title="DARPG on Facebook"
            >
              <img src="/Images/f.png" alt="Facebook" className="w-5 h-5 object-contain" />
            </a>
            <a
              href="https://twitter.com/DARPG_GoI"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 bg-white/10 hover:bg-white/25 rounded-full transition-transform hover:scale-110"
              title="DARPG on X (Twitter)"
            >
              <img src="/Images/x.png" alt="Twitter / X" className="w-5 h-5 object-contain" />
            </a>
            <a
              href="https://youtube.com/@darpg5380?si=Z2Va_V5kGY1dX_yb"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 bg-white/10 hover:bg-white/25 rounded-full transition-transform hover:scale-110"
              title="DARPG on YouTube"
            >
              <img src="/Images/yt.png" alt="YouTube" className="w-5 h-5 object-contain" />
            </a>
          </div>

          {/* Official NIC & DARPG Ownership Statement */}
          <p className="max-w-4xl mx-auto text-slate-300 text-xs sm:text-[13px] leading-relaxed">
            This portal is designed, developed & hosted by{" "}
            <span className="font-bold text-white">National Informatics Centre (NIC)</span>, Ministry of
            Electronics & Information Technology (MeitY), Government of India. Content owned and maintained by{" "}
            <span className="font-bold text-white">
              Department of Administrative Reforms & Public Grievances (DARPG)
            </span>
            .
          </p>
        </div>
      </div>

      {/* 2. Middle Section - Official Government Initiative Badges */}
      <div className="bg-[#00133d] py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-2">
            <a
              href="https://gandhi.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="bg-white p-2 rounded-lg hover:shadow-lg transition-transform hover:scale-105 inline-block"
            >
              <img src="/Images/gandhi-150.jpg" alt="150 Years of Mahatma Gandhi" className="h-9 w-auto object-contain" />
            </a>
            <a
              href="https://digitalindiaawards.gov.in"
              target="_blank"
              rel="noreferrer"
              className="bg-white p-2 rounded-lg hover:shadow-lg transition-transform hover:scale-105 inline-block"
            >
              <img src="/Images/digi-awards.jpg" alt="Digital India Awards" className="h-9 w-auto object-contain" />
            </a>
            <a
              href="http://goidirectory.nic.in"
              target="_blank"
              rel="noreferrer"
              className="bg-white p-2 rounded-lg hover:shadow-lg transition-transform hover:scale-105 inline-block"
            >
              <img src="/Images/web-directory.jpg" alt="Government of India Web Directory" className="h-9 w-auto object-contain" />
            </a>
            <a
              href="http://www.makeinindia.com"
              target="_blank"
              rel="noreferrer"
              className="bg-white p-2 rounded-lg hover:shadow-lg transition-transform hover:scale-105 inline-block"
            >
              <img src="/Images/made-in-india.jpg" alt="Make in India" className="h-9 w-auto object-contain" />
            </a>
            <a
              href="https://www.digitalindia.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="bg-white p-2 rounded-lg hover:shadow-lg transition-transform hover:scale-105 inline-block"
            >
              <img src="/Images/digital-india-logo.jpg" alt="Digital India" className="h-9 w-auto object-contain" />
            </a>
            <a
              href="https://www.india.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="bg-white p-2 rounded-lg hover:shadow-lg transition-transform hover:scale-105 inline-block"
            >
              <img src="/Images/india-gov-logo.jpg" alt="National Portal of India (india.gov.in)" className="h-9 w-auto object-contain" />
            </a>
            <a
              href="https://www.nic.in/"
              target="_blank"
              rel="noreferrer"
              className="bg-white p-2 rounded-lg hover:shadow-lg transition-transform hover:scale-105 inline-block"
            >
              <img src="/Images/niclogo.jpg" alt="National Informatics Centre" className="h-9 w-auto object-contain" />
            </a>
          </div>

          <p className="text-[11px] text-[#f3f19c]">
            Portal is compatible with all major browsers like Google Chrome, Mozilla Firefox, Microsoft Edge, Safari etc. Best viewed in 1440 x 900 resolution.
          </p>
        </div>
      </div>

      {/* 3. Bottom Section - Official Policies, Version & Visitor Statistics */}
      <div className="bg-[#000d2b] py-4 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-300 gap-3">
          {/* Policy Links */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/about" className="hover:text-amber-300 transition hover:underline">
              About CPGRAMS
            </Link>
            <span>•</span>
            <Link href="/faq" className="hover:text-amber-300 transition hover:underline">
              Website Policies
            </Link>
            <span>•</span>
            <a
              href="https://darpg.gov.in/en/web-information-manager"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-300 transition hover:underline"
            >
              Web Information Manager
            </a>
            <span>•</span>
            <Link href="/contact" className="hover:text-amber-300 transition hover:underline">
              Helpdesk & Support
            </Link>
          </div>

          {/* Version & Visitor Stats */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400">
            <span>Version 7.0.01092019.0.0, Copyright © 2026</span>
            <span className="hidden sm:inline">•</span>
            <span>Last Updated On: 21-08-2026</span>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center space-x-1">
              <span>Total Visitors:</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono font-bold">
                7,945,041
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
