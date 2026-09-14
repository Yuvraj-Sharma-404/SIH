"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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

      if (data.user) {
        localStorage.setItem("smadhanx_user", JSON.stringify(data.user));
      }
      window.dispatchEvent(new Event("auth-changed"));

      router.push(data.redirectUrl || "/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4 sm:py-8">
      {/* Top Breadcrumb */}
      <div className="max-w-md mx-auto mb-4">
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
          <Link href="/" className="hover:text-gov-navy dark:hover:text-sky-400 transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">Sign In</span>
        </div>
      </div>

      <div className="max-w-md mx-auto bg-white dark:bg-slate-800/95 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
        {/* Tricolor Government Top Strip */}
        <div className="h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gov-navy dark:bg-sky-600 text-white flex items-center justify-center font-black text-xl mx-auto mb-3 shadow-sm">
              SX
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              SmadhanX Sign In
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              National Centralized Single-Window Portal for Redressal & Innovation
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-start space-x-2 text-red-800 dark:text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {/* Standard Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gov.in or user@example.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy dark:focus:ring-sky-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
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
                <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy dark:focus:ring-sky-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-gov-navy dark:text-sky-500 focus:ring-gov-navy dark:bg-slate-900"
                />
                <span>Remember this terminal</span>
              </label>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">NIC / MeitY Compliant</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gov-navy hover:bg-[#002b80] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-sm transition shadow-sm disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
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

          {/* Footer Registration Link */}
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-700 text-center text-xs">
            <span className="text-slate-600 dark:text-slate-400">Don&apos;t have a SmadhanX account? </span>
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
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-gov-navy dark:hover:text-sky-400 transition underline font-medium"
        >
          Track Grievance Status with Public ID (No Login Required)
        </Link>
      </div>
    </div>
  );
}
