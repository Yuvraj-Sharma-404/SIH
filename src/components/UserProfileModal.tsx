"use client";

import React from "react";
import Link from "next/link";
import {
  X,
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  MapPin,
  Calendar,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Copy,
  Check,
  FileText,
} from "lucide-react";
import { getDashboardForRole } from "@/lib/auth/permissions";

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  status: string;
  department?: string | null;
  organization?: string | null;
  designation?: string | null;
  profileData?: string | null;
  createdAt?: string | Date;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfileData | null;
  onSignOut: () => void;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  user,
  onSignOut,
}: UserProfileModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !user) return null;

  // Parse any extra role-specific metadata
  let metadata: Record<string, any> = {};
  try {
    if (user.profileData) {
      metadata = typeof user.profileData === "string" ? JSON.parse(user.profileData) : user.profileData;
    }
  } catch {}

  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "GOVERNMENT_OFFICIAL":
        return { label: "Government Official", bg: "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800" };
      case "UNIVERSITY_MEMBER":
        return { label: "Student / Researcher", bg: "bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800" };
      case "INDUSTRY_PARTNER":
        return { label: "Industry Partner", bg: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" };
      case "ADMIN":
        return { label: "System Administrator", bg: "bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800" };
      case "CITIZEN":
      default:
        return { label: "Verified Citizen", bg: "bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800" };
    }
  };

  const roleInfo = getRoleBadge(user?.role || "CITIZEN");
  const dashboardUrl = getDashboardForRole(user?.role || "CITIZEN");

  // Format creation date safely
  let formattedDate = "Recent Member";
  if (user?.createdAt) {
    try {
      const d = new Date(user.createdAt);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      }
    } catch {}
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-700 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Indian National Tricolor Ribbon */}
        <div className="h-1.5 w-full flex">
          <div className="flex-1 bg-[#FF9933]"></div>
          <div className="flex-1 bg-white"></div>
          <div className="flex-1 bg-[#138808]"></div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Profile"
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header Card */}
        <div className="p-6 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-center">
          <div className="relative inline-block mb-3">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-gov-navy to-[#003da5] text-white flex items-center justify-center text-2xl sm:text-3xl font-black shadow-md border-4 border-white dark:border-slate-700">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-white dark:border-slate-700 shadow-xs" title="Verified Account">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
            {user.name}
          </h2>

          <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${roleInfo.bg}`}>
              {roleInfo.label}
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Active Session
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Contact Details Group */}
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Contact & Identification
            </span>

            {/* Email */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Mail className="w-3.5 h-3.5 text-gov-navy dark:text-sky-400 shrink-0" />
                <span className="font-medium text-slate-500 dark:text-slate-400">Email:</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]" title={user.email}>
                {user.email}
              </span>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Phone className="w-3.5 h-3.5 text-gov-navy dark:text-sky-400 shrink-0" />
                <span className="font-medium text-slate-500 dark:text-slate-400">Phone:</span>
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {user.phone || metadata.phone || "Not provided"}
              </span>
            </div>

            {/* Unique User ID */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/80 dark:border-slate-700">
              <span className="font-medium text-slate-500 dark:text-slate-400">Citizen / Account ID:</span>
              <button
                type="button"
                onClick={handleCopyId}
                className="flex items-center gap-1 font-mono text-[11px] font-bold text-gov-navy dark:text-sky-400 hover:underline bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700"
                title="Click to copy ID"
              >
                <span>{user.id ? (user.id.length > 12 ? `${user.id.slice(0, 10)}...` : user.id) : "CITIZEN-01"}</span>
                {copied ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
              </button>
            </div>
          </div>

          {/* Role & Affiliation Details (if applicable) */}
          {(user.department || user.organization || user.designation || metadata.state) && (
            <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Official Affiliation
              </span>

              {user.designation && (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Briefcase className="w-3.5 h-3.5 text-gov-navy dark:text-sky-400 shrink-0" />
                    <span className="font-medium text-slate-500 dark:text-slate-400">Designation:</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{user.designation}</span>
                </div>
              )}

              {user.organization && (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Building2 className="w-3.5 h-3.5 text-gov-navy dark:text-sky-400 shrink-0" />
                    <span className="font-medium text-slate-500 dark:text-slate-400">Organization:</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{user.organization}</span>
                </div>
              )}

              {user.department && (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Building2 className="w-3.5 h-3.5 text-gov-navy dark:text-sky-400 shrink-0" />
                    <span className="font-medium text-slate-500 dark:text-slate-400">Department:</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{user.department}</span>
                </div>
              )}

              {metadata.state && (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-gov-navy dark:text-sky-400 shrink-0" />
                    <span className="font-medium text-slate-500 dark:text-slate-400">Jurisdiction:</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {metadata.district ? `${metadata.district}, ` : ""}{metadata.state}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Account Metadata */}
          <div className="flex items-center justify-between px-2 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>Registered: {formattedDate}</span>
            </div>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              Government Level-1 Verified
            </span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
          <Link
            href={dashboardUrl}
            onClick={onClose}
            className="flex-1 py-2 px-3 bg-gov-navy hover:bg-[#002b80] text-white rounded-lg text-center font-bold text-xs transition shadow-xs flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Go to My Portal</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              onClose();
              onSignOut();
            }}
            className="py-2 px-3.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs transition shadow-xs flex items-center justify-center gap-1.5 shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
