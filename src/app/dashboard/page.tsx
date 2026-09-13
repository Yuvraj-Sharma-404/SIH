"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, ShieldCheck } from "lucide-react";
import { getDashboardForRole } from "@/lib/auth/permissions";

export default function DashboardRouterPage() {
  const router = useRouter();
  const [statusText, setStatusText] = useState("Resolving authenticated session...");

  useEffect(() => {
    async function routeUser() {
      try {
        const res = await fetch("/api/auth/me");
        const json = await res.json();

        if (!res.ok || !json?.data) {
          router.push("/login");
          return;
        }

        const user = json.data;

        // Check if government verification pending
        if (user.role === "GOVERNMENT_OFFICIAL" && user.status === "VERIFICATION_PENDING") {
          setStatusText("Routing to Official Clearance Verification...");
          router.push("/auth/pending-verification");
          return;
        }

        const destination = getDashboardForRole(user.role);
        setStatusText(`Accessing ${user.role.replace(/_/g, " ")} Portal...`);
        router.push(destination);
      } catch (err) {
        console.error("Dashboard routing error:", err);
        router.push("/login");
      }
    }

    routeUser();
  }, [router]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-4 text-gov-navy">
        <RefreshCw className="w-7 h-7 animate-spin text-gov-navy" />
      </div>
      <h2 className="text-lg font-bold text-slate-800">SmadhanX Role Gateway</h2>
      <p className="text-xs text-slate-500 mt-1">{statusText}</p>
      <div className="mt-4 flex items-center space-x-1 text-[11px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Central Redressal Access Control</span>
      </div>
    </div>
  );
}
