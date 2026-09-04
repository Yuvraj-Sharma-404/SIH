"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Bell, CheckCircle2, Search } from "lucide-react";

export default function ReminderPage() {
  const [regId, setRegId] = useState("");
  const [reminderNote, setReminderNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regId) return;
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="gov-card p-6 gov-border-t-saffron bg-white text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-gov-saffron bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
          Grievance Follow-Up
        </span>
        <h1 className="text-2xl font-extrabold text-gov-navy font-serif tracking-tight">
          Send Reminder / Clarification
        </h1>
        <p className="text-xs text-slate-600 max-w-xl mx-auto">
          If your registered grievance has exceeded the standard SLA without an update, send an official reminder to the assigned Nodal Officer.
        </p>
      </div>

      {submitted ? (
        <div className="gov-card p-8 bg-white text-center space-y-4 animate-fadeIn">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-extrabold text-slate-900">
            Reminder Successfully Dispatched
          </h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Your reminder for Registration ID <strong className="font-mono text-gov-navy">{regId}</strong> has been escalated to the Nodal PG Officer. An acknowledgment SMS has been sent.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              href={`/track?id=${encodeURIComponent(regId)}`}
              className="px-5 py-2 rounded-lg bg-gov-navy hover:bg-gov-navy-dark text-white font-bold text-xs shadow-sm transition"
            >
              Track Complaint
            </Link>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setRegId("");
                setReminderNote("");
              }}
              className="px-5 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition"
            >
              Send Another Reminder
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="gov-card p-6 sm:p-8 bg-white space-y-5">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              Grievance Registration Number *
            </label>
            <input
              type="text"
              required
              value={regId}
              onChange={(e) => setRegId(e.target.value)}
              placeholder="e.g. PS-2026-1042 or DARPG/E/2026/001"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-gov-navy focus:ring-1 focus:ring-gov-navy font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              Reminder / Clarification Note (Optional)
            </label>
            <textarea
              rows={4}
              value={reminderNote}
              onChange={(e) => setReminderNote(e.target.value)}
              placeholder="Specify additional context, delayed days, or emergency priority details..."
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-gov-navy focus:ring-1 focus:ring-gov-navy"
            ></textarea>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              Reminders are flagged with high priority on the Nodal Officer&apos;s dashboard and monitored under DARPG SLA compliance metrics.
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gov-saffron hover:bg-orange-600 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <Bell className="w-4 h-4" />
            <span>Submit Reminder to Officer</span>
          </button>
        </form>
      )}
    </div>
  );
}
