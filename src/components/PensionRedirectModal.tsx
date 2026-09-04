"use client";

import React from "react";
import { AlertTriangle, ExternalLink, X } from "lucide-react";

interface PensionRedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PensionRedirectModal({ isOpen, onClose }: PensionRedirectModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 text-center border-2 border-amber-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="text-base font-bold text-slate-900 leading-snug">
          You are being redirected to Grievance System of Department of Pension & Pensioner&apos;s Welfare
        </h3>
        
        <p className="text-xs text-slate-600 mt-2 font-medium">
          आपको पेंशन और पेंशनभोगी कल्याण विभाग की शिकायत प्रणाली पर पुनर्निर्देशित किया जा रहा है।
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
          >
            Cancel / रद्द करें
          </button>
          <a
            href="https://pgportal.gov.in/pension/"
            target="_blank"
            rel="noreferrer"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gov-navy hover:bg-gov-navy-dark text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <span>Proceed / आगे बढ़ें</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
