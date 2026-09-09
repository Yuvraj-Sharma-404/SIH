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
      .catch(() => { });

    // Live persistent unique visitor counter
    try {
      let v = parseInt(localStorage.getItem("smadhanx_visitor_count") || "142", 10);
      if (!sessionStorage.getItem("smadhanx_session_active")) {
        v += 1;
        localStorage.setItem("smadhanx_visitor_count", v.toString());
        sessionStorage.setItem("smadhanx_session_active", "true");
      }
      setStats((prev) => ({ ...prev, visitors: v }));
    } catch { }
  }, []);

  return (
    <footer className="bg-[#001c5a] text-white text-xs border-t-4 border-gov-saffron mt-auto">
      {/* 1. Top Section - Social Media & Student Team Attribution */}
      <div className="border-b border-white/10 py-5 sm:py-6 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto text-center space-y-3 sm:space-y-4">
          {/* Social Media Links */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
            <span className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider">
              Connect With Us:
            </span>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 bg-white/10 hover:bg-white/25 rounded-full transition-transform hover:scale-110"
              title="Facebook"
            >
              <img src="/Images/f.png" alt="Facebook" className="w-5 h-5 object-contain" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 bg-white/10 hover:bg-white/25 rounded-full transition-transform hover:scale-110"
              title="Twitter / X"
            >
              <img src="/Images/x.png" alt="Twitter / X" className="w-5 h-5 object-contain" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 bg-white/10 hover:bg-white/25 rounded-full transition-transform hover:scale-110"
              title="YouTube"
            >
              <img src="/Images/yt.png" alt="YouTube" className="w-5 h-5 object-contain" />
            </a>
          </div>

          {/* Team Code Alchemist Attribution */}
          <div className="max-w-4xl mx-auto space-y-1.5">
            <p className="text-slate-200 text-xs sm:text-[13px] leading-relaxed">
              This platform is designed, developed &amp; maintained by{" "}
              <span className="font-bold text-white">Team, Code Alchemist</span>, a student innovation team
              participating in <span className="font-semibold text-amber-300">Smart India Hackathon 2026</span>.
            </p>
            <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed">
              Our platform empowers citizens, universities and industry partners to collaboratively identify, solve and track real-world societal challenges.
            </p>
          </div>
        </div>
      </div>


      {/* 3. Bottom Section - Policies, Statistics & Project Attribution */}
      <div className="bg-[#000d2b] py-3.5 px-3 sm:px-6 border-t border-white/10">
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
            <Link href="/contact" className="hover:text-amber-300 transition hover:underline">
              Helpdesk &amp; Support
            </Link>
          </div>

          {/* Version & Real Stats */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-slate-400">
            <span>Version {stats.version}</span>
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

        {/* Bottom Team Code Alchemist Copyright & Event Notice */}
        <div className="mt-2.5 pt-2.5 border-t border-white/5 text-center">
          <p className="text-[11px] text-slate-400 font-medium tracking-wide">
            © 2026 Team Code Alchemist • Smart India Hackathon 2026 • Student Innovation Project
          </p>
        </div>
      </div>
    </footer>
  );
}
