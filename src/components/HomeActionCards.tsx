"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  UserPlus,
  ClipboardList,
  Headphones,
  FileText,
  LayoutDashboard,
} from "lucide-react";
import { UserProfileData } from "./UserProfileModal";

export default function HomeActionCards() {
  const [currentUser, setCurrentUser] = useState<UserProfileData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 1. Read cached user
    try {
      const saved = localStorage.getItem("smadhanx_user");
      if (saved) {
        setCurrentUser(JSON.parse(saved));
      }
    } catch {}

    // 2. Validate session against server
    const checkAuth = async () => {
      try {
        const res = await fetch(`/api/auth/me?_t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, max-age=0",
            Pragma: "no-cache",
          },
        });
        if (res.ok) {
          const json = await res.json();
          if (json?.authenticated && json?.data) {
            setCurrentUser(json.data);
            try {
              localStorage.setItem("smadhanx_user", JSON.stringify(json.data));
            } catch {}
          } else {
            setCurrentUser(null);
          }
        }
      } catch {}
    };

    checkAuth();

    const handleAuthEvent = () => {
      try {
        const saved = localStorage.getItem("smadhanx_user");
        if (saved) {
          setCurrentUser(JSON.parse(saved));
        } else {
          setCurrentUser(null);
        }
      } catch {}
      checkAuth();
    };

    window.addEventListener("auth-changed", handleAuthEvent);
    return () => window.removeEventListener("auth-changed", handleAuthEvent);
  }, []);

  const isOfficer =
    currentUser?.role === "OFFICER" ||
    currentUser?.role === "ADMIN" ||
    currentUser?.role === "NODAL";

  const box1Href = currentUser
    ? isOfficer
      ? "/gov/dashboard"
      : "/citizen/report"
    : "/signup";

  const box1Title = currentUser
    ? isOfficer
      ? "Officer Dashboard"
      : "Lodge Grievance"
    : "Register / Login";

  const box1ButtonText = currentUser
    ? isOfficer
      ? "Go to Dashboard"
      : "Lodge Grievance"
    : "Register / Login";

  const Box1Icon = currentUser
    ? isOfficer
      ? LayoutDashboard
      : FileText
    : UserPlus;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {/* Box 1: Dynamic Auth Card */}
      <Link
        href={box1Href}
        className="group rounded-2xl p-5 sm:p-6 text-center transition-all transform hover:-translate-y-1 shadow-md hover:shadow-xl flex flex-col items-center justify-between min-h-[160px] sm:min-h-[180px] bg-sky-200 dark:bg-slate-800/90 dark:border dark:border-sky-500/40 relative overflow-hidden"
      >
        <div className="space-y-2.5 sm:space-y-3 flex flex-col items-center relative z-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/50 dark:bg-sky-500/20 border border-white/60 dark:border-sky-400/30 flex items-center justify-center text-gov-navy dark:text-sky-300 shadow-inner group-hover:scale-110 transition-transform">
            <Box1Icon className="w-7 h-7 sm:w-8 sm:h-8 text-gov-navy dark:text-sky-300" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
            {mounted ? box1Title : "Register / Login"}
          </h3>
        </div>
        <span className="mt-3 px-4 py-1.5 rounded bg-[#001c5a] dark:bg-sky-600 group-hover:bg-[#6f0047] dark:group-hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm relative z-10">
          {mounted ? box1ButtonText : "Register / Login"}
        </span>
      </Link>

      {/* Box 2: View Status */}
      <Link
        href="/track"
        className="group rounded-2xl p-5 sm:p-6 text-center transition-all transform hover:-translate-y-1 shadow-md hover:shadow-xl flex flex-col items-center justify-between min-h-[160px] sm:min-h-[180px] bg-rose-200 dark:bg-slate-800/90 dark:border dark:border-rose-500/40 relative overflow-hidden"
      >
        <div className="space-y-2.5 sm:space-y-3 flex flex-col items-center relative z-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/50 dark:bg-rose-500/20 border border-white/60 dark:border-rose-400/30 flex items-center justify-center text-gov-navy dark:text-rose-300 shadow-inner group-hover:scale-110 transition-transform">
            <ClipboardList className="w-7 h-7 sm:w-8 sm:h-8 text-gov-navy dark:text-rose-300" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
            View Status
          </h3>
        </div>
        <span className="mt-3 px-4 py-1.5 rounded bg-[#001c5a] dark:bg-rose-700 group-hover:bg-[#6f0047] dark:group-hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm relative z-10">
          View Status
        </span>
      </Link>

      {/* Box 3: Contact Us */}
      <Link
        href="/contact"
        className="group rounded-2xl p-5 sm:p-6 text-center transition-all transform hover:-translate-y-1 shadow-md hover:shadow-xl flex flex-col items-center justify-between min-h-[160px] sm:min-h-[180px] bg-amber-200 dark:bg-slate-800/90 dark:border dark:border-amber-500/40 relative overflow-hidden"
      >
        <div className="space-y-2.5 sm:space-y-3 flex flex-col items-center relative z-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/50 dark:bg-amber-500/20 border border-white/60 dark:border-amber-400/30 flex items-center justify-center text-gov-navy dark:text-amber-300 shadow-inner group-hover:scale-110 transition-transform">
            <Headphones className="w-7 h-7 sm:w-8 sm:h-8 text-gov-navy dark:text-amber-300" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
            Contact Us
          </h3>
        </div>
        <span className="mt-3 px-4 py-1.5 rounded bg-[#001c5a] dark:bg-amber-700 group-hover:bg-[#6f0047] dark:group-hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm relative z-10">
          Contact Us
        </span>
      </Link>
    </div>
  );
}
