"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  GraduationCap,
  Landmark,
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { UserRoleType } from "@/lib/auth/permissions";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.requireOtp) {
          router.push(`/signup?step=4&email=${encodeURIComponent(email)}`);
          return;
        }
        throw new Error(data.error || "Authentication failed.");
      }

      router.push(data.redirectUrl || "/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: UserRoleType) => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, isQuickLogin: true }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Quick role login failed.");
      }

      router.push(data.redirectUrl || "/dashboard");
    } catch (err: any) {
      setError(err.message || "Could not switch to role account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4 sm:py-8">
      {/* Top Breadcrumb */}
      <div className="max-w-md mx-auto mb-4">
        <div className="flex items-center space-x-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-gov-navy transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Sign In</span>
        </div>
      </div>

      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tricolor Government Top Strip */}
        <div className="h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gov-navy text-white flex items-center justify-center font-black text-xl mx-auto mb-3 shadow-sm">
              SX
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              SmadhanX Sign In
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              National Centralized Single-Window Portal for Redressal & Innovation
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start space-x-2 text-red-800 text-xs">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {/* Standard Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gov.in or user@example.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("For demo assistance, use quick-access buttons below or demo accounts.");
                  }}
                  className="text-xs text-gov-saffron hover:underline font-semibold"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-gov-navy focus:ring-gov-navy"
                />
                <span>Remember this terminal</span>
              </label>
              <span className="text-[11px] text-slate-400">NIC / MeitY Compliant</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gov-navy hover:bg-[#002b80] text-white font-bold text-sm transition shadow-sm disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Role Evaluation Switcher */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1 text-xs font-bold text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-gov-saffron" />
                <span>Quick Role Demo Access</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400">1-Click Test</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin("CITIZEN")}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/60 transition text-left flex items-center space-x-2"
              >
                <div className="w-7 h-7 rounded bg-blue-100 text-gov-navy flex items-center justify-center font-bold">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="font-bold block text-slate-800">Citizen</span>
                  <span className="text-[10px] text-slate-500 block truncate">Public Grievances</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("UNIVERSITY_MEMBER")}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/60 transition text-left flex items-center space-x-2"
              >
                <div className="w-7 h-7 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="font-bold block text-slate-800">University</span>
                  <span className="text-[10px] text-slate-500 block truncate">R&D Challenges</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("GOVERNMENT_OFFICIAL")}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50/60 transition text-left flex items-center space-x-2"
              >
                <div className="w-7 h-7 rounded bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Landmark className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="font-bold block text-slate-800">Gov Official</span>
                  <span className="text-[10px] text-slate-500 block truncate">Nodal Triage</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("INDUSTRY_PARTNER")}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/60 transition text-left flex items-center space-x-2"
              >
                <div className="w-7 h-7 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="font-bold block text-slate-800">Industries</span>
                  <span className="text-[10px] text-slate-500 block truncate">CSR Co-Funding</span>
                </div>
              </button>
            </div>
          </div>

          {/* Footer Registration Link */}
          <div className="mt-6 pt-5 border-t border-slate-200 text-center text-xs">
            <span className="text-slate-600">Don't have a SmadhanX account? </span>
            <Link href="/signup" className="text-gov-saffron hover:underline font-bold">
              Register here
            </Link>
          </div>
        </div>
      </div>

      {/* Track grievance without login banner */}
      <div className="max-w-md mx-auto mt-4 text-center">
        <Link
          href="/track"
          className="text-xs text-slate-500 hover:text-gov-navy transition underline font-medium"
        >
          Track Grievance Status with Public ID (No Login Required)
        </Link>
      </div>
    </div>
  );
}
