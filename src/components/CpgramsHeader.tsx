"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import CpgramsQrModal from "./CpgramsQrModal";
import PensionRedirectModal from "./PensionRedirectModal";

export default function CpgramsHeader() {
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isPensionOpen, setIsPensionOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("English");
  const [fontSize, setFontSize] = useState<"normal" | "large" | "larger">("normal");

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी (Hindi)" },
    { code: "gu", label: "ગુજરાતી (Gujarati)" },
    { code: "mr", label: "मराठी (Marathi)" },
    { code: "bn", label: "বাংলা (Bangala)" },
    { code: "te", label: "తెలుగు (Telugu)" },
    { code: "ta", label: "தமிழ் (Tamil)" },
    { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
    { code: "ml", label: "മലയാളം (Malayalam)" },
    { code: "pa", label: "ਪੰਜਾਬੀ (Punjabi)" },
    { code: "ur", label: "اردو (Urdu)" },
    { code: "as", label: "অসমীয়া (Assamese)" },
    { code: "or", label: "ଓଡ଼ିଆ (Odia)" },
  ];

  return (
    <>
      {/* 1. Indian National Tricolor Ribbon */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      {/* 2. Topbar - Government of India & Ministries with Quick Links */}
      <div className="bg-[#f0f4f8] border-b border-slate-300 text-[11px] text-slate-700 py-1 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Ministry Details */}
          <div className="flex items-center space-x-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 leading-tight">
              <span className="font-bold text-slate-900 font-devanagari">
                भारत सरकार / Government of India
              </span>
              <span className="hidden sm:inline text-slate-400">|</span>
              <span className="text-slate-600 hidden md:inline">
                कार्मिक, लोक शिकायत और पेंशन मंत्रालय (Ministry of Personnel, Public Grievances & Pensions)
              </span>
            </div>
          </div>

          {/* Right: Quick Action Links & Accessibility */}
          <div className="flex items-center space-x-3 text-[11px]">
            {/* Quick Links with Scraped Icons */}
            <div className="hidden lg:flex items-center space-x-3 font-semibold text-slate-700">
              <Link href="/" className="flex items-center space-x-1 hover:text-gov-navy transition">
                <img src="/Images/ico_home.png" alt="Home" className="w-3.5 h-3.5 object-contain" />
                <span>Home</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsQrOpen(true)}
                className="flex items-center space-x-1 hover:text-gov-navy transition"
              >
                <img src="/Images/dwnld.png" alt="Download" className="w-3.5 h-3.5 object-contain" />
                <span>Download</span>
              </button>
              <Link href="/contact" className="flex items-center space-x-1 hover:text-gov-navy transition">
                <img src="/Images/ico_contact.png" alt="Contact" className="w-3.5 h-3.5 object-contain" />
                <span>Contact Us</span>
              </Link>
              <Link href="/about" className="flex items-center space-x-1 hover:text-gov-navy transition">
                <img src="/Images/ico_about.png" alt="About" className="w-3.5 h-3.5 object-contain" />
                <span>About Us</span>
              </Link>
              <Link href="/faq" className="flex items-center space-x-1 hover:text-gov-navy transition">
                <img src="/Images/ico_help.png" alt="Help" className="w-3.5 h-3.5 object-contain" />
                <span>FAQs/Help</span>
              </Link>
              <Link href="/process-flow" className="flex items-center space-x-1 hover:text-gov-navy transition">
                <img src="/Images/sitemap.png" alt="Process Flow" className="w-3.5 h-3.5 object-contain" />
                <span>Site Map</span>
              </Link>
            </div>

            <span className="hidden lg:inline text-slate-300">|</span>

            {/* Font Resizing Controls */}
            <div className="hidden sm:flex items-center space-x-1 text-[10px] font-bold text-slate-600">
              <span>Text:</span>
              <button
                type="button"
                onClick={() => setFontSize("normal")}
                className={`px-1.5 py-0.5 rounded border ${
                  fontSize === "normal" ? "bg-gov-navy text-white border-gov-navy" : "bg-white border-slate-300 hover:bg-slate-100"
                }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize("large")}
                className={`px-1.5 py-0.5 rounded border ${
                  fontSize === "large" ? "bg-gov-navy text-white border-gov-navy" : "bg-white border-slate-300 hover:bg-slate-100"
                }`}
              >
                A+
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Government Header with Official Logo, Emblem & Swachh Bharat */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* CPGRAMS Official Logo */}
          <Link href="/" className="flex items-center gap-3 sm:gap-4 group">
            <img
              src="/Images/iconHome/logo.png"
              alt="CPGRAMS Official Logo"
              className="h-14 sm:h-16 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="space-y-0.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gov-navy font-serif">
                CPGRAMS
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 tracking-tight leading-tight font-serif">
                Centralized Public Grievance Redress And Monitoring System
              </p>
              <p className="text-[10px] text-slate-500 font-devanagari hidden sm:block">
                केंद्रीकृत लोक शिकायत निवारण और निगरानी प्रणाली
              </p>
            </div>
          </Link>

          {/* Right Header Badges: Swachh Bharat & Official Ashoka Stambh */}
          <div className="flex items-center gap-3 sm:gap-5">
            <img
              src="/Images/swachha.png"
              alt="Swachh Bharat Logo"
              className="h-10 sm:h-12 w-auto object-contain hidden md:block"
            />
            <div className="hidden sm:flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="w-8 h-8 rounded-full bg-gov-navy text-white flex flex-col items-center justify-center text-[8px] font-bold font-serif leading-none shadow-sm">
                <span>सत्यमेव</span>
                <span>जयते</span>
              </div>
              <span className="text-[9px] font-bold text-slate-600 mt-1 uppercase tracking-tighter">
                DARPG • GOI
              </span>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-gov-navy text-white hover:bg-gov-navy-dark transition"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Main CPGRAMS Dark Navbar with Official Dropdowns & Icons */}
      <nav className="bg-[#001c5a] text-white text-xs font-semibold shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="hidden lg:flex items-center justify-between h-12">
            {/* Left Nav Menu Items */}
            <div className="flex items-center space-x-1">
              {/* View Status Dropdown */}
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center space-x-1.5 px-3 py-2 rounded hover:bg-white/15 transition"
                >
                  <img src="/Images/ico_view.png" alt="View Status" className="w-4 h-4 object-contain" />
                  <span>View Status</span>
                  <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-70 group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute left-0 top-full hidden group-hover:block bg-white text-slate-800 shadow-xl rounded-b-xl border border-slate-200 min-w-[200px] py-1 animate-fadeIn z-50">
                  <Link
                    href="/track"
                    className="block px-4 py-2 hover:bg-slate-100 text-xs font-semibold text-slate-800 hover:text-gov-navy transition"
                  >
                    Grievance Status
                  </Link>
                  <Link
                    href="/track?type=appeal"
                    className="block px-4 py-2 hover:bg-slate-100 text-xs font-semibold text-slate-800 hover:text-gov-navy transition"
                  >
                    Appeal Status
                  </Link>
                </div>
              </div>

              {/* Nodal PG Officers Dropdown */}
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center space-x-1.5 px-3 py-2 rounded hover:bg-white/15 transition"
                >
                  <img src="/Images/ico_nodal.png" alt="Nodal Officers" className="w-4 h-4 object-contain" />
                  <span>Nodal PG Officers</span>
                  <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-70 group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute left-0 top-full hidden group-hover:block bg-white text-slate-800 shadow-xl rounded-b-xl border border-slate-200 min-w-[220px] py-1 animate-fadeIn z-50">
                  <Link
                    href="/nodal-officers?type=central"
                    className="block px-4 py-2 hover:bg-slate-100 text-xs font-semibold text-slate-800 hover:text-gov-navy transition"
                  >
                    Central Government
                  </Link>
                  <Link
                    href="/nodal-officers?type=state"
                    className="block px-4 py-2 hover:bg-slate-100 text-xs font-semibold text-slate-800 hover:text-gov-navy transition"
                  >
                    State Government
                  </Link>
                </div>
              </div>

              {/* Redress Process Dropdown */}
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center space-x-1.5 px-3 py-2 rounded hover:bg-white/15 transition"
                >
                  <img src="/Images/ico_redress.png" alt="Redress Process" className="w-4 h-4 object-contain" />
                  <span>Redress Process</span>
                  <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-70 group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute left-0 top-full hidden group-hover:block bg-white text-slate-800 shadow-xl rounded-b-xl border border-slate-200 min-w-[220px] py-1 animate-fadeIn z-50">
                  <Link
                    href="/process-flow"
                    className="block px-4 py-2 hover:bg-slate-100 text-xs font-semibold text-slate-800 hover:text-gov-navy transition"
                  >
                    Redress Process Flow
                  </Link>
                </div>
              </div>

              {/* Grievance Dropdown */}
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center space-x-1.5 px-3 py-2 rounded hover:bg-white/15 transition"
                >
                  <img src="/Images/ico_grievance.png" alt="Grievance" className="w-4 h-4 object-contain" />
                  <span>Grievance</span>
                  <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-70 group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute left-0 top-full hidden group-hover:block bg-white text-slate-800 shadow-xl rounded-b-xl border border-slate-200 min-w-[230px] py-1 animate-fadeIn z-50">
                  <Link
                    href="/citizen/report"
                    className="block px-4 py-2 hover:bg-slate-100 text-xs font-semibold text-slate-800 hover:text-gov-navy transition"
                  >
                    Lodge Public Grievance
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsPensionOpen(true)}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 text-xs font-semibold text-slate-800 hover:text-gov-navy transition"
                  >
                    Lodge Pension Grievance
                  </button>
                  <Link
                    href="/track"
                    className="block px-4 py-2 hover:bg-slate-100 text-xs font-semibold text-slate-800 hover:text-gov-navy transition"
                  >
                    View Status
                  </Link>
                  <Link
                    href="/reminder"
                    className="block px-4 py-2 hover:bg-slate-100 text-xs font-semibold text-slate-800 hover:text-gov-navy transition"
                  >
                    Reminder Clarification
                  </Link>
                  <Link
                    href="/track?tab=feedback"
                    className="block px-4 py-2 hover:bg-slate-100 text-xs font-semibold text-slate-800 hover:text-gov-navy transition"
                  >
                    Rate Grievance
                  </Link>
                </div>
              </div>

              {/* Nodal Authority for Appeal */}
              <Link
                href="/appeals"
                className="flex items-center space-x-1 px-3 py-2 rounded hover:bg-white/15 transition"
              >
                <span>Nodal Authority for Appeal</span>
              </Link>

              {/* Mobile App Modal Trigger */}
              <button
                type="button"
                onClick={() => setIsQrOpen(true)}
                className="flex items-center space-x-1 px-3 py-2 rounded hover:bg-white/15 transition"
              >
                <img src="/Images/mobile.png" alt="Mobile App" className="w-3.5 h-4 object-contain" />
                <span>Mobile App</span>
              </button>
            </div>

            {/* Right: Language Dropdown & Sign In Button */}
            <div className="flex items-center space-x-3">
              {/* Language Selector Dropdown */}
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition text-[11px]"
                >
                  <span className="text-slate-300 font-normal">Language:</span>
                  <span className="font-bold">{currentLang}</span>
                  <ChevronDown className="w-3 h-3 opacity-70 group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute right-0 top-full hidden group-hover:block bg-white text-slate-800 shadow-xl rounded-b-xl border border-slate-200 w-48 max-h-64 overflow-y-auto py-1 animate-fadeIn z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setCurrentLang(lang.label)}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 transition ${
                        currentLang === lang.label ? "font-bold text-gov-navy bg-slate-50" : "text-slate-700"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Official Sign In Button */}
              <Link
                href="/citizen/report"
                className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-gov-saffron hover:bg-orange-600 text-white font-bold transition shadow-sm"
              >
                <img src="/Images/signIn.png" alt="Sign In" className="w-3.5 h-3.5 object-contain" />
                <span>Sign In</span>
              </Link>
            </div>
          </div>

          {/* Mobile Collapsible Navigation Drawer */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-white/10 space-y-2 animate-fadeIn">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded hover:bg-white/10 transition font-bold"
              >
                Home
              </Link>
              <Link
                href="/citizen/report"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded hover:bg-white/10 transition text-amber-300 font-bold"
              >
                Lodge Public Grievance
              </Link>
              <Link
                href="/track"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded hover:bg-white/10 transition"
              >
                View Status
              </Link>
              <Link
                href="/nodal-officers"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded hover:bg-white/10 transition"
              >
                Nodal PG Officers (Central & State)
              </Link>
              <Link
                href="/process-flow"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded hover:bg-white/10 transition"
              >
                Redress Process Flow
              </Link>
              <Link
                href="/reminder"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded hover:bg-white/10 transition"
              >
                Reminder Clarification
              </Link>
              <Link
                href="/appeals"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded hover:bg-white/10 transition"
              >
                Nodal Authority for Appeal
              </Link>
              <div className="pt-2 border-t border-white/10 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsQrOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 rounded text-center text-xs font-semibold"
                >
                  Download Mobile App
                </button>
                <Link
                  href="/citizen/report"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 py-2 px-3 bg-gov-saffron hover:bg-orange-600 rounded text-center text-xs font-bold"
                >
                  Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Popups & Modals */}
      <CpgramsQrModal isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />
      <PensionRedirectModal isOpen={isPensionOpen} onClose={() => setIsPensionOpen(false)} />
    </>
  );
}
