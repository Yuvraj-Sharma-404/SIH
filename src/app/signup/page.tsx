"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  GraduationCap,
  Landmark,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  RefreshCw,
  Building,
  MapPin,
  FileBadge,
} from "lucide-react";
import { UserRoleType, ROLE_CONFIGS } from "@/lib/auth/permissions";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi (NCT)",
];

export default function UnifiedSignupPage() {
  const router = useRouter();

  // Multi-step tracking: 1 = Role, 2 = Common Info, 3 = Role Specifics, 4 = OTP Verification
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [role, setRole] = useState<UserRoleType>("CITIZEN");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Role-Specific State
  // Citizen
  const [state, setState] = useState("Maharashtra");
  const [district, setDistrict] = useState("");
  const [identityRef, setIdentityRef] = useState("");
  const [prefLang, setPrefLang] = useState("English");

  // University
  const [institution, setInstitution] = useState("");
  const [department, setDepartment] = useState("");
  const [studentOrEmpId, setStudentOrEmpId] = useState("");
  const [academicDesignation, setAcademicDesignation] = useState("Student / Researcher");

  // Government Official
  const [govMinistry, setGovMinistry] = useState("");
  const [govEmpId, setGovEmpId] = useState("");
  const [govDesignation, setGovDesignation] = useState("");
  const [govOfficeDistrict, setGovOfficeDistrict] = useState("");

  // Industry Partner
  const [companyName, setCompanyName] = useState("");
  const [cinNumber, setCinNumber] = useState("");
  const [industrySector, setIndustrySector] = useState("Smart Infrastructure & Civil");
  const [corporateDesignation, setCorporateDesignation] = useState("");

  // Verification state
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const passwordStrength = getPasswordStrength(password);

  // If already authenticated with a valid session, redirect away from signup
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.authenticated && data?.data) {
          router.replace("/dashboard");
        }
      })
      .catch(() => {});
  }, [router]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentStep === 4 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentStep, timer]);

  // Step Validation Handlers
  const handleNextFromRole = () => {
    setError(null);
    setCurrentStep(2);
  };

  const handleNextFromCommon = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setCurrentStep(3);
  };

  const handleInitiateRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Package role-specific fields
      let roleData: Record<string, any> = {};
      let primaryDept = null;
      let primaryOrg = null;
      let primaryDesignation = null;

      if (role === "CITIZEN") {
        roleData = { state, district, identityRef, prefLang };
      } else if (role === "UNIVERSITY_MEMBER") {
        roleData = { institution, department, studentOrEmpId, academicDesignation };
        primaryOrg = institution;
        primaryDept = department;
        primaryDesignation = academicDesignation;
      } else if (role === "GOVERNMENT_OFFICIAL") {
        roleData = {
          ministry: govMinistry,
          empId: govEmpId,
          designation: govDesignation,
          officeDistrict: govOfficeDistrict,
        };
        primaryDept = govMinistry;
        primaryDesignation = govDesignation;
      } else if (role === "INDUSTRY_PARTNER") {
        roleData = {
          companyName,
          cinNumber,
          industrySector,
          corporateDesignation,
        };
        primaryOrg = companyName;
        primaryDesignation = corporateDesignation;
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          role,
          department: primaryDept,
          organization: primaryOrg,
          designation: primaryDesignation,
          roleData,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Registration initiation failed.");
      }

      setSuccessMsg(data.message || `A verification code has been dispatched to ${email}.`);
      setTimer(60);
      setCurrentStep(4);
    } catch (err: any) {
      setError(err.message || "Failed to submit registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otp.trim()) {
      setError("Please enter the 6-digit verification code.");
      return;
    }
    if (!termsAccepted) {
      setError("Please accept the terms and conditions to proceed.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: otp.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Verification failed. Please check code.");
      }

      // Successful verification
      if (data.user) {
        localStorage.setItem("smadhanx_user", JSON.stringify(data.user));
      }
      window.dispatchEvent(new Event("auth-changed"));

      window.location.href = data.redirectUrl || "/citizen/report";
    } catch (err: any) {
      setError(err.message || "Verification code could not be validated.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    setError(null);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("A fresh verification code has been dispatched to your email.");
        setTimer(60);
      } else {
        setError(data.error || "Could not resend OTP.");
      }
    } catch {
      setError("Network error while requesting new OTP.");
    }
  };

  return (
    <div className="py-2 sm:py-6">
      {/* Top Indian Government Portal Breadcrumbs & Banner */}
      <div className="max-w-4xl mx-auto mb-4 sm:mb-6">
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
          <Link href="/" className="hover:text-gov-navy dark:hover:text-sky-400 transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">User Registration</span>
        </div>

        {/* Official Header Banner */}
        <div className="bg-white dark:bg-slate-800/95 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
          <div className="h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-gov-navy dark:bg-sky-600 text-white flex items-center justify-center font-black text-xl shadow-sm">
                SX
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  SmadhanX Unified Registration
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  National Centralized Single-Window Onboarding for Public Service Redressal
                </p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>SSL Encrypted 256-Bit</span>
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="px-4 sm:px-6 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div
                className={`flex items-center justify-center space-x-1.5 pb-1 border-b-2 font-semibold transition ${
                  currentStep >= 1
                    ? "border-gov-saffron text-gov-navy dark:text-sky-400"
                    : "border-transparent text-slate-400"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    currentStep > 1
                      ? "bg-emerald-600 text-white"
                      : currentStep === 1
                      ? "bg-gov-saffron text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {currentStep > 1 ? "✓" : "1"}
                </span>
                <span className="hidden sm:inline">Account Type</span>
              </div>

              <div
                className={`flex items-center justify-center space-x-1.5 pb-1 border-b-2 font-semibold transition ${
                  currentStep >= 2
                    ? "border-gov-saffron text-gov-navy dark:text-amber-400"
                    : "border-transparent text-slate-400 dark:text-slate-500"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    currentStep > 2
                      ? "bg-emerald-600 text-white"
                      : currentStep === 2
                      ? "bg-gov-saffron text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {currentStep > 2 ? "✓" : "2"}
                </span>
                <span className="hidden sm:inline">Personal Info</span>
              </div>

              <div
                className={`flex items-center justify-center space-x-1.5 pb-1 border-b-2 font-semibold transition ${
                  currentStep >= 3
                    ? "border-gov-saffron text-gov-navy dark:text-amber-400"
                    : "border-transparent text-slate-400 dark:text-slate-500"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    currentStep > 3
                      ? "bg-emerald-600 text-white"
                      : currentStep === 3
                      ? "bg-gov-saffron text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {currentStep > 3 ? "✓" : "3"}
                </span>
                <span className="hidden sm:inline">Role Credentials</span>
              </div>

              <div
                className={`flex items-center justify-center space-x-1.5 pb-1 border-b-2 font-semibold transition ${
                  currentStep >= 4
                    ? "border-gov-saffron text-gov-navy dark:text-amber-400"
                    : "border-transparent text-slate-400 dark:text-slate-500"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    currentStep === 4
                      ? "bg-gov-saffron text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  4
                </span>
                <span className="hidden sm:inline">Verification</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Registration Container */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800/95 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 sm:p-8 transition-colors">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-start space-x-3 text-red-800 dark:text-red-300 text-sm">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Notice: </span>
              {error}
            </div>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && currentStep === 4 && (
          <div className="mb-6 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start space-x-3 text-emerald-800 dark:text-emerald-300 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>{successMsg}</div>
          </div>
        )}

        {/* STEP 1: CHOOSE ACCOUNT TYPE */}
        {currentStep === 1 && (
          <div>
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-amber-300 dark:border-amber-700/50">
                Step 1 of 4
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">How will you use SmadhanX?</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                Select the primary stakeholder account suited to your function. All 4 categories
                share unified governance and verified audit records.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Option 1: Citizen */}
              <div
                onClick={() => setRole("CITIZEN")}
                className={`relative p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  role === "CITIZEN"
                    ? "border-gov-navy bg-blue-50/50 shadow-md ring-2 ring-gov-navy/20 dark:border-sky-500 dark:bg-sky-950/40 dark:ring-sky-500/30"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/40"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-gov-navy dark:text-blue-300 flex items-center justify-center font-bold">
                    <User className="w-6 h-6" />
                  </div>
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      role === "CITIZEN"
                        ? "border-gov-navy bg-gov-navy text-white dark:border-sky-400 dark:bg-sky-500"
                        : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                    }`}
                  >
                    {role === "CITIZEN" && <div className="w-2 h-2 rounded-full bg-white" />}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">Citizen</h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300">
                      Public User
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
                    Submit and track grievances, participate in civic initiatives, monitor local
                    resolution SLAs, and confirm community work.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-between">
                  <span>Access: Public Redressal & Tracking</span>
                  <span className="text-gov-navy dark:text-sky-400 font-semibold">Instant Access</span>
                </div>
              </div>

              {/* Option 2: University / Student */}
              <div
                onClick={() => setRole("UNIVERSITY_MEMBER")}
                className={`relative p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  role === "UNIVERSITY_MEMBER"
                    ? "border-gov-navy bg-blue-50/50 shadow-md ring-2 ring-gov-navy/20 dark:border-sky-500 dark:bg-sky-950/40 dark:ring-sky-500/30"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/40"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      role === "UNIVERSITY_MEMBER"
                        ? "border-gov-navy bg-gov-navy text-white dark:border-sky-400 dark:bg-sky-500"
                        : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                    }`}
                  >
                    {role === "UNIVERSITY_MEMBER" && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">Student / University</h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300">
                      Academic R&D
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
                    Solve societal grand challenges, submit innovative engineering proposals, build
                    pilot prototypes, and secure academic grants.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-between">
                  <span>Access: R&D Proposals & Grand Challenges</span>
                  <span className="text-indigo-700 dark:text-indigo-400 font-semibold">Academic Verification</span>
                </div>
              </div>

              {/* Option 3: Government Official */}
              <div
                onClick={() => setRole("GOVERNMENT_OFFICIAL")}
                className={`relative p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  role === "GOVERNMENT_OFFICIAL"
                    ? "border-gov-navy bg-blue-50/50 shadow-md ring-2 ring-gov-navy/20 dark:border-sky-500 dark:bg-sky-950/40 dark:ring-sky-500/30"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/40"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      role === "GOVERNMENT_OFFICIAL"
                        ? "border-gov-navy bg-gov-navy text-white dark:border-sky-400 dark:bg-sky-500"
                        : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                    }`}
                  >
                    {role === "GOVERNMENT_OFFICIAL" && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">Government Official</h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                      Nodal Authority
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
                    Access department triage consoles, review AI priority classifications, dispatch
                    field officers, and monitor statutory resolution SLAs.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-xs text-amber-700 dark:text-amber-400 font-semibold flex items-center justify-between">
                  <span>Access: Official Grievance Portals</span>
                  <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded text-[11px]">
                    Requires Clearance
                  </span>
                </div>
              </div>

              {/* Option 4: Industry / Organization */}
              <div
                onClick={() => setRole("INDUSTRY_PARTNER")}
                className={`relative p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  role === "INDUSTRY_PARTNER"
                    ? "border-gov-navy bg-blue-50/50 shadow-md ring-2 ring-gov-navy/20 dark:border-sky-500 dark:bg-sky-950/40 dark:ring-sky-500/30"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/40"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      role === "INDUSTRY_PARTNER"
                        ? "border-gov-navy bg-gov-navy text-white dark:border-sky-400 dark:bg-sky-500"
                        : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                    }`}
                  >
                    {role === "INDUSTRY_PARTNER" && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">Industry / Organization</h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                      CSR & Innovation
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
                    Fund high-impact civic innovations, deploy corporate CSR grants, co-develop
                    hardware deployments, and track real-world impact metrics.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-between">
                  <span>Access: CSR Pledging & Co-Funding</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Corporate Verification</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
                <Link href="/login" className="text-gov-navy dark:text-sky-400 font-bold hover:underline">
                  Sign In here
                </Link>
              </div>

              <button
                type="button"
                onClick={handleNextFromRole}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-gov-navy dark:bg-sky-600 hover:bg-[#002b80] dark:hover:bg-sky-500 text-white font-bold transition shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: COMMON BASIC INFORMATION */}
        {currentStep === 2 && (
          <form onSubmit={handleNextFromCommon}>
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-700">
              <div>
                <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 rounded-full text-xs font-bold uppercase tracking-wider mb-1 border border-amber-300 dark:border-amber-700/50">
                  Step 2 of 4
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Personal & Account Information</h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Enter your core contact and secure login credentials.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Selected Role</span>
                <span className="inline-flex items-center space-x-1 text-xs font-bold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 text-gov-navy dark:text-sky-300 border border-slate-200 dark:border-slate-600">
                  <span>{ROLE_CONFIGS[role].title}</span>
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name (as in Official ID) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar Sharma"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy dark:focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={
                        role === "GOVERNMENT_OFFICIAL"
                          ? "name@gov.in or name@nic.in"
                          : "name@example.com"
                      }
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy dark:focus:ring-sky-500"
                    />
                  </div>
                  {role === "GOVERNMENT_OFFICIAL" && (
                    <span className="text-[11px] text-amber-700 dark:text-amber-400 mt-1 block">
                      Recommended: Use your official .gov.in or .nic.in domain for faster clearance.
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Mobile Number (for SMS Alerts) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="9876543210"
                      className="w-full pl-12 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy dark:focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Account Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy dark:focus:ring-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                        <span>Strength:</span>
                        <span className="font-bold">
                          {passwordStrength <= 1
                            ? "Weak"
                            : passwordStrength === 2
                            ? "Medium"
                            : passwordStrength === 3
                            ? "Strong"
                            : "Very Secure"}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex gap-1">
                        <div
                          className={`h-full flex-1 rounded-full ${
                            passwordStrength >= 1 ? "bg-red-500" : "bg-transparent"
                          }`}
                        />
                        <div
                          className={`h-full flex-1 rounded-full ${
                            passwordStrength >= 2 ? "bg-amber-500" : "bg-transparent"
                          }`}
                        />
                        <div
                          className={`h-full flex-1 rounded-full ${
                            passwordStrength >= 3 ? "bg-blue-500" : "bg-transparent"
                          }`}
                        />
                        <div
                          className={`h-full flex-1 rounded-full ${
                            passwordStrength >= 4 ? "bg-emerald-500" : "bg-transparent"
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy dark:focus:ring-sky-500"
                    />
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <span className="text-[11px] text-red-600 dark:text-red-400 mt-1 block">
                      Passwords do not match.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center space-x-1.5 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Change Role</span>
              </button>

              <button
                type="submit"
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-gov-navy dark:bg-sky-600 hover:bg-[#002b80] dark:hover:bg-sky-500 text-white font-bold transition shadow-sm"
              >
                <span>Continue to Role Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: ROLE-SPECIFIC DETAILS */}
        {currentStep === 3 && (
          <form onSubmit={handleInitiateRegistration}>
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-700">
              <div>
                <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 rounded-full text-xs font-bold uppercase tracking-wider mb-1 border border-amber-300 dark:border-amber-700/50">
                  Step 3 of 4
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {role === "CITIZEN" && "Citizen Profile & Jurisdiction"}
                  {role === "UNIVERSITY_MEMBER" && "University & Academic Credentials"}
                  {role === "GOVERNMENT_OFFICIAL" && "Official Departmental Clearance Details"}
                  {role === "INDUSTRY_PARTNER" && "Organization & Corporate Details"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Specific metadata required for your designated role tier.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-50 dark:bg-slate-700 text-gov-navy dark:text-sky-300 border border-blue-200 dark:border-slate-600">
                {ROLE_CONFIGS[role].title}
              </span>
            </div>

            {/* DYNAMIC ROLE FIELDS */}
            <div className="space-y-4 mb-8">
              {/* 1. CITIZEN ROLE FIELDS */}
              {role === "CITIZEN" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        State / Union Territory <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy dark:focus:ring-sky-500 bg-white"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        District / City
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          placeholder="e.g. Pune / New Delhi"
                          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy dark:focus:ring-sky-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Aadhaar / Voter ID (Optional Reference)
                      </label>
                      <input
                        type="text"
                        value={identityRef}
                        onChange={(e) => setIdentityRef(e.target.value)}
                        placeholder="XXXX-XXXX-1234 (Encrypted & Masked)"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy dark:focus:ring-sky-500"
                      />
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                        Optional. Accelerates identity verification for priority civic grievances.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Preferred Language for Status Updates
                      </label>
                      <select
                        value={prefLang}
                        onChange={(e) => setPrefLang(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy dark:focus:ring-sky-500 bg-white"
                      >
                        <option value="English">English</option>
                        <option value="Hindi">हिन्दी (Hindi)</option>
                        <option value="Marathi">मराठी (Marathi)</option>
                        <option value="Tamil">தமிழ் (Tamil)</option>
                        <option value="Telugu">తెలుగు (Telugu)</option>
                        <option value="Bengali">বাংলা (Bengali)</option>
                        <option value="Gujarati">ગુજરાતી (Gujarati)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* 2. UNIVERSITY MEMBER ROLE FIELDS */}
              {role === "UNIVERSITY_MEMBER" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        University / Institution Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={institution}
                          onChange={(e) => setInstitution(e.target.value)}
                          placeholder="e.g. IIT Bombay / Govt. College of Engineering"
                          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy dark:focus:ring-sky-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Department / Branch <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. Civil Engineering / AI & IoT Labs"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy dark:focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Student ID / Faculty Registration Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FileBadge className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={studentOrEmpId}
                          onChange={(e) => setStudentOrEmpId(e.target.value)}
                          placeholder="e.g. 2024-BTECH-CV-104"
                          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy dark:focus:ring-sky-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Academic Status
                      </label>
                      <select
                        value={academicDesignation}
                        onChange={(e) => setAcademicDesignation(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy dark:focus:ring-sky-500 bg-white"
                      >
                        <option value="Student / Researcher">Undergraduate / Graduate Student</option>
                        <option value="PhD Scholar">PhD Research Scholar</option>
                        <option value="Faculty / Professor">Faculty Member / Professor</option>
                        <option value="Lab Director / Dean">Department Head / Dean</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* 3. GOVERNMENT OFFICIAL ROLE FIELDS */}
              {role === "GOVERNMENT_OFFICIAL" && (
                <>
                  <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 flex items-start space-x-3 text-amber-900 dark:text-amber-200 text-xs">
                    <ShieldCheck className="w-5 h-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Official Statutory Clearance Notice: </span>
                      Government accounts have access to citizen data and nodal enforcement
                      dashboards. After email verification, your credentials will be placed under
                      administrative review. You will receive an immediate tracking ticket.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Department / Ministry <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={govMinistry}
                        onChange={(e) => setGovMinistry(e.target.value)}
                        placeholder="e.g. Public Works Department (PWD) / Jal Shakti"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy dark:focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Government Employee ID / SPARROW ID <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FileBadge className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={govEmpId}
                          onChange={(e) => setGovEmpId(e.target.value)}
                          placeholder="e.g. GOV-MH-PWD-4092"
                          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy dark:focus:ring-sky-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Official Designation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={govDesignation}
                        onChange={(e) => setGovDesignation(e.target.value)}
                        placeholder="e.g. Executive Engineer / Nodal PG Officer"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy dark:focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Office Jurisdiction / District <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={govOfficeDistrict}
                        onChange={(e) => setGovOfficeDistrict(e.target.value)}
                        placeholder="e.g. Pune Central Division"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy dark:focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* 4. INDUSTRY PARTNER ROLE FIELDS */}
              {role === "INDUSTRY_PARTNER" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Company / Organization Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Tata Sustainability / L&T Infrastructure"
                          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy dark:focus:ring-sky-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        CIN / NGO Darpan / Reg ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={cinNumber}
                        onChange={(e) => setCinNumber(e.target.value)}
                        placeholder="e.g. U72900MH2018PTC123456"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy dark:focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Domain / Sector Focus
                      </label>
                      <select
                        value={industrySector}
                        onChange={(e) => setIndustrySector(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy dark:focus:ring-sky-500 bg-white"
                      >
                        <option value="Smart Infrastructure & Civil">Smart Infrastructure & Civil</option>
                        <option value="Water & Sanitation (Jal Jeevan)">Water & Sanitation (Jal Jeevan)</option>
                        <option value="Clean Energy & Solar">Clean Energy & Solar</option>
                        <option value="Public Health & Bio-Waste">Public Health & Bio-Waste</option>
                        <option value="CSR Foundation / Grants">CSR Foundation / Grants</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Authorized Officer Designation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={corporateDesignation}
                        onChange={(e) => setCorporateDesignation(e.target.value)}
                        placeholder="e.g. Head of CSR / VP Corporate Strategy"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-gov-navy dark:focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center space-x-1.5 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-gov-saffron hover:bg-orange-600 text-white font-bold transition shadow-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generating OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Generate OTP & Proceed</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: OTP VERIFICATION */}
        {currentStep === 4 && (
          <form onSubmit={handleVerifyOtp}>
            <div className="text-center max-w-md mx-auto mb-6">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950/60 text-gov-saffron flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6" />
              </div>
              <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-amber-300 dark:border-amber-700/50">
                Step 4 of 4
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Verify Your Identity</h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                A 6-digit verification code has been dispatched to{" "}
                <span className="font-bold text-slate-900 dark:text-white">{email}</span>
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-5">
              {/* Real Email Dispatch Notice */}
              <div className="p-4 bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-900 dark:text-blue-200 flex items-start gap-3">
                <Mail className="w-5 h-5 text-gov-navy dark:text-sky-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900 dark:text-white">Verification Email Dispatched</p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    A secure 6-digit OTP has been sent to <strong className="text-gov-navy dark:text-sky-300">{email}</strong>. Please check your inbox or spam folder. The code remains valid for 10 minutes.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 text-center mb-2">
                  Enter 6-Digit Verification Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[1em] text-2xl font-mono py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:border-gov-navy dark:focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 dark:focus:ring-sky-500/20"
                />
              </div>

              {/* Resend OTP & Countdown Timer */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Didn't receive the code?</span>
                {timer > 0 ? (
                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                    Resend available in <strong className="text-slate-900 dark:text-white">{timer}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-gov-saffron hover:underline font-bold"
                  >
                    Resend Verification OTP
                  </button>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                <label className="flex items-start space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 dark:border-slate-600 text-gov-navy focus:ring-gov-navy"
                  />
                  <span className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    I solemnly declare that the credentials provided are accurate. I understand
                    that official misuse is punishable under the Information Technology Act and
                    Central Redressal Guidelines.
                  </span>
                </label>
              </div>

              {/* In-Step Error Alert */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-start space-x-2 text-red-700 dark:text-red-300 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Verification Button */}
              <button
                type="submit"
                disabled={loading || otp.length < 6 || !termsAccepted}
                className="w-full py-3 rounded-lg bg-gov-navy dark:bg-sky-600 hover:bg-[#002b80] dark:hover:bg-sky-500 text-white font-bold text-sm transition shadow-sm disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>Complete Verification & Sign In</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition"
                >
                  ← Correct Registration Details
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
