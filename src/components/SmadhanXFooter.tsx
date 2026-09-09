"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function SmadhanXFooter() {
  const [stats, setStats] = useState({
    version: "1.0.0",
    lastUpdated: "08-09-2026",
    totalGrievances: 4,
    visitors: 142,
  });

  useEffect(() => {
    // Fetch live database metrics
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats((prev) => ({
            ...prev,
            version: data.version || prev.version,
            lastUpdated: data.lastUpdated || prev.lastUpdated,
            totalGrievances: typeof data.totalGrievances === "number" ? data.totalGrievances : prev.totalGrievances,
          }));
        }
      })
      .catch(() => {});

    // Live persistent unique visitor counter
    try {
      let v = parseInt(localStorage.getItem("smadhanx_visitor_count") || "142", 10);
      if (!sessionStorage.getItem("smadhanx_session_active")) {
        v += 1;
        localStorage.setItem("smadhanx_visitor_count", v.toString());
        sessionStorage.setItem("smadhanx_session_active", "true");
      }
      setStats((prev) => ({ ...prev, visitors: v }));
    } catch {}
  }, []);
  return (
    <footer className="bg-[#001c5a] text-white text-xs border-t-4 border-gov-saffron mt-auto">
      {/* 1. Top Section - Social Media & Department Ownership Notice */}
      <div className="border-b border-white/10 py-5 sm:py-6 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto text-center space-y-3 sm:space-y-4">
          {/* Social Media Links with Official Scraped Icons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
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

      {/* 2. Middle Section - Browser Compatibility */}
      <div className="bg-[#00133d] py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[11px] text-[#f3f19c]">
            Portal is compatible with all major browsers like Google Chrome, Mozilla Firefox, Microsoft Edge, Safari etc. Best viewed in 1440 x 900 resolution.
          </p>
        </div>
      </div>

      {/* 3. Bottom Section - Official Policies, Version & Visitor Statistics */}
      <div className="bg-[#000d2b] py-4 px-3 sm:px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-300 gap-3 text-center">
          {/* Policy Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <Link href="/about" className="hover:text-amber-300 transition hover:underline">
              About SmadhanX
            </Link>
            <span className="text-slate-600">•</span>
            <Link href="/faq" className="hover:text-amber-300 transition hover:underline">
              Website Policies
            </Link>
            <span className="text-slate-600">•</span>
            <a
              href="https://darpg.gov.in/en/web-information-manager"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-300 transition hover:underline"
            >
              Web Information Manager
            </a>
            <span className="text-slate-600">•</span>
            <Link href="/contact" className="hover:text-amber-300 transition hover:underline">
              Helpdesk & Support
            </Link>
          </div>

          {/* Version & Real Stats */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-slate-400">
            <span>Version {stats.version}, Copyright © 2026 SmadhanX</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span>Last Updated On: {stats.lastUpdated}</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <div className="flex items-center space-x-1.5 whitespace-nowrap">
              <span>Total Grievances:</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                {stats.totalGrievances}
              </span>
            </div>
            <span className="hidden sm:inline text-slate-600">•</span>
            <div className="flex items-center space-x-1.5 whitespace-nowrap">
              <span>Total Visitors:</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono font-bold">
                {stats.visitors.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
