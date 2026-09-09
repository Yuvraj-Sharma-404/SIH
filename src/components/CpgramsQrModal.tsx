"use client";

import React from "react";
import { X } from "lucide-react";

interface CpgramsQrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CpgramsQrModal({ isOpen, onClose }: CpgramsQrModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-6 text-center border-2 border-slate-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 sm:-top-3.5 sm:-right-3.5 bg-gov-navy text-white hover:bg-gov-saffron rounded-full p-1.5 sm:p-2 shadow-lg transition-colors z-10"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Modal Header */}
        <div className="pb-3 border-b border-slate-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gov-saffron bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
            Official Mobile Application
          </span>
          <h2 className="text-xl font-extrabold text-gov-navy mt-2 tracking-tight">
            EXPERIENCE SMADHANX ON MOBILE
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Scan the QR code or click the download button below to install on your smartphone.
          </p>
        </div>

        {/* Modal Content */}
        <div className="py-4 space-y-5">
          {/* Android Play Store */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-gov-navy/30 transition">
            <img
              src="/Images/googlePlayStore_myGrievance.png"
              alt="CPGRAMS Google Play Store QR Code"
              className="w-28 h-28 object-contain border border-slate-300 rounded-lg p-1 bg-white shadow-sm"
              title="Scan QR to download Android app"
            />
            <div className="text-center sm:text-left space-y-2">
              <div>
                <span className="text-xs font-bold text-slate-800">Android Smartphone</span>
                <p className="text-[11px] text-slate-500">MyGrievance / CPGRAMS App</p>
              </div>
              <a
                href="https://play.google.com/store/apps/details?id=nic.org.mygrievance&pcampaignid=web_share"
                target="_blank"
                rel="noreferrer"
                className="inline-block transition-transform hover:scale-105"
              >
                <img
                  src="/Images/googleStore.png"
                  alt="Download on Google Play Store"
                  className="h-10 object-contain"
                />
              </a>
            </div>
          </div>

          <hr className="border-dashed border-slate-300" />

          {/* iOS App Store */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-gov-navy/30 transition">
            <img
              src="/Images/iosAppStore_myGrievance.png"
              alt="CPGRAMS Apple App Store QR Code"
              className="w-28 h-28 object-contain border border-slate-300 rounded-lg p-1 bg-white shadow-sm"
              title="Scan QR to download iOS app"
            />
            <div className="text-center sm:text-left space-y-2">
              <div>
                <span className="text-xs font-bold text-slate-800">Apple iPhone / iPad</span>
                <p className="text-[11px] text-slate-500">CPGRAMS iOS Application</p>
              </div>
              <a
                href="https://apps.apple.com/in/app/cpgrams/id6746528698"
                target="_blank"
                rel="noreferrer"
                className="inline-block transition-transform hover:scale-105"
              >
                <img
                  src="/Images/appleStore.png"
                  alt="Download on Apple App Store"
                  className="h-10 object-contain"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Official App by NIC & DARPG</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
