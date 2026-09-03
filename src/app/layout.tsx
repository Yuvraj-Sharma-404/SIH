import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import {
  Building2,
  GraduationCap,
  MapPin,
  Search,
  PlusCircle,
  FileText,
  Users,
  CheckCircle2,
  ExternalLink,
  Shield,
  HelpCircle,
  Layers,
} from "lucide-react";

export const metadata: Metadata = {
  title: "राष्ट्रीय नागरिक समस्या समाधान मंच | National Civic Problem-Solving Platform (PS43)",
  description:
    "Government of India crowdsourcing and collaborative platform bridging citizens, government departments, universities, and industry under Smart India Hackathon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-orange-100 selection:text-orange-900">
        {/* Indian Tricolor Ribbon */}
        <div className="h-1.5 w-full flex">
          <div className="flex-1 bg-[#FF9933]"></div>
          <div className="flex-1 bg-white"></div>
          <div className="flex-1 bg-[#138808]"></div>
        </div>

        {/* Top Government of India Header Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-1.5 text-xs text-slate-600">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-3">
              <span className="font-semibold text-slate-800">
                भारत सरकार | Government of India
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="hidden sm:inline text-slate-600">
                Ministry of Electronics & IT / Smart India Hackathon PS-43
              </span>
            </div>

            {/* Accessibility & Language Bar */}
            <div className="flex items-center space-x-4 text-[11px]">
              <div className="hidden md:flex items-center space-x-1.5 font-semibold text-slate-700">
                <span>Font Size:</span>
                <button type="button" className="px-1.5 py-0.5 rounded hover:bg-slate-200 border border-slate-300">A-</button>
                <button type="button" className="px-1.5 py-0.5 rounded hover:bg-slate-200 border border-slate-300">A</button>
                <button type="button" className="px-1.5 py-0.5 rounded hover:bg-slate-200 border border-slate-300 font-bold">A+</button>
              </div>

              <span className="hidden md:inline text-slate-300">|</span>

              <div className="flex items-center space-x-1 text-slate-700 font-medium">
                <span className="px-1.5 py-0.5 rounded bg-slate-200 font-bold">English</span>
                <span>/</span>
                <button type="button" className="hover:text-gov-navy hover:underline">हिन्दी</button>
              </div>
            </div>
          </div>
        </div>

        {/* Main National Portal Header */}
        <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Official Emblem & Portal Title */}
              <Link href="/" className="flex items-center space-x-3.5 group">
                <div className="w-12 h-12 rounded-xl bg-gov-navy text-white flex flex-col items-center justify-center font-serif font-bold shadow-md shadow-gov-navy/20 flex-shrink-0">
                  <span className="text-xs uppercase tracking-tighter">सत्यमेव</span>
                  <span className="text-[10px] tracking-tight">जयते</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-lg sm:text-xl tracking-tight text-gov-navy font-serif">
                      जन-समाधान मंच
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200 uppercase font-mono">
                      PS-43 Portal
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium tracking-tight">
                    National Civic Problem-Solving & Collaborative Implementation Platform
                  </p>
                </div>
              </Link>

              {/* Portal Mode Switcher */}
              <div className="hidden lg:flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
                <Link
                  href="/"
                  className="px-3 py-1.5 rounded-lg bg-white text-gov-navy shadow-sm border border-slate-200 font-bold"
                >
                  Citizen Portal
                </Link>
                <Link
                  href="/gov/dashboard"
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-gov-navy hover:bg-slate-200 transition"
                >
                  Government Official
                </Link>
                <Link
                  href="/challenges"
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-gov-navy hover:bg-slate-200 transition"
                >
                  University & Industry
                </Link>
              </div>

              {/* Citizen Quick Action Header Button */}
              <div className="flex items-center space-x-3">
                <Link
                  href="/track"
                  className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
                >
                  <Search className="w-3.5 h-3.5 text-slate-500" />
                  <span>Track Complaint</span>
                </Link>
                <Link
                  href="/citizen/report"
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-gov-saffron hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Report a Problem</span>
                </Link>
              </div>
            </div>
          </div>

          {/* India.gov Inspired Navigation Bar */}
          <nav className="bg-gov-navy text-white text-xs font-medium border-t border-gov-navy-dark hidden md:block">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-1 py-1">
              <Link
                href="/"
                className="px-3.5 py-2 rounded hover:bg-white/10 transition font-semibold"
              >
                Home
              </Link>
              <Link
                href="/citizen/report"
                className="px-3.5 py-2 rounded hover:bg-white/10 transition"
              >
                Report Problem
              </Link>
              <Link
                href="/track"
                className="px-3.5 py-2 rounded hover:bg-white/10 transition font-semibold text-orange-200"
              >
                Track Complaint (CPGRAMS)
              </Link>
              <Link
                href="/challenges"
                className="px-3.5 py-2 rounded hover:bg-white/10 transition"
              >
                Explore Challenges (MyGov)
              </Link>
              <Link
                href="/map"
                className="px-3.5 py-2 rounded hover:bg-white/10 transition"
              >
                Problem Map
              </Link>
              <Link
                href="/teams"
                className="px-3.5 py-2 rounded hover:bg-white/10 transition"
              >
                Teams & Proposals
              </Link>
              <Link
                href="/solutions"
                className="px-3.5 py-2 rounded hover:bg-white/10 transition"
              >
                Public Solutions
              </Link>
              <Link
                href="/gov/dashboard"
                className="ml-auto px-3.5 py-2 rounded bg-white/10 hover:bg-white/20 transition font-semibold flex items-center space-x-1.5 text-amber-200"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Govt Dashboard</span>
              </Link>
            </div>
          </nav>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-8">
          {children}
        </main>

        {/* Mobile Sticky Bottom Navigation */}
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 py-2 px-3 flex items-center justify-around z-50 md:hidden shadow-lg text-slate-700">
          <Link
            href="/citizen/report"
            className="flex flex-col items-center text-[10px] font-semibold hover:text-gov-navy"
          >
            <PlusCircle className="w-5 h-5 text-gov-saffron mb-0.5" />
            <span>Report</span>
          </Link>
          <Link
            href="/track"
            className="flex flex-col items-center text-[10px] font-semibold hover:text-gov-navy"
          >
            <Search className="w-5 h-5 text-gov-navy mb-0.5" />
            <span>Track</span>
          </Link>
          <Link
            href="/challenges"
            className="flex flex-col items-center text-[10px] font-semibold hover:text-gov-navy"
          >
            <FileText className="w-5 h-5 text-gov-emerald mb-0.5" />
            <span>Challenges</span>
          </Link>
          <Link
            href="/map"
            className="flex flex-col items-center text-[10px] font-semibold hover:text-gov-navy"
          >
            <MapPin className="w-5 h-5 text-indigo-600 mb-0.5" />
            <span>Map</span>
          </Link>
        </div>

        {/* Official Indian Government Portal Footer */}
        <footer className="mt-auto bg-slate-900 text-slate-300 text-xs border-t border-slate-800 pt-10 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <p className="font-bold text-sm text-white font-serif">
                  जन-समाधान मंच (PS-43)
                </p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  National Civic Problem Crowdsourcing, AI Prioritization & Collaborative Solution Platform for Smart India Hackathon.
                </p>
                <div className="text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-bold">24x7 Citizen Helpline: </span>
                  <span className="font-mono font-bold text-white">1800-11-0001</span>
                </div>
              </div>

              <div>
                <p className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                  Citizen Services
                </p>
                <ul className="space-y-2 text-slate-400">
                  <li><Link href="/citizen/report" className="hover:text-white transition">Lodge New Grievance</Link></li>
                  <li><Link href="/track" className="hover:text-white transition">Track Status via CPGRAMS ID</Link></li>
                  <li><Link href="/map" className="hover:text-white transition">View Interactive Problem Density Map</Link></li>
                  <li><Link href="/solutions" className="hover:text-white transition">Implemented Civic Solutions</Link></li>
                </ul>
              </div>

              <div>
                <p className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                  Collaboration Hub
                </p>
                <ul className="space-y-2 text-slate-400">
                  <li><Link href="/challenges" className="hover:text-white transition">MyGov Societal Challenges</Link></li>
                  <li><Link href="/teams" className="hover:text-white transition">University & Researcher Teams</Link></li>
                  <li><Link href="/gov/dashboard" className="hover:text-white transition">Government Official Workbench</Link></li>
                  <li><Link href="/kiosk" className="hover:text-white transition">Rural Assisted Kiosk (ESP32)</Link></li>
                </ul>
              </div>

              <div>
                <p className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                  Government Guidelines
                </p>
                <ul className="space-y-2 text-slate-400">
                  <li>Digital Personal Data Protection (DPDP) Act 2023 Compliant</li>
                  <li>CPGRAMS Workflow Compatibility</li>
                  <li>UMANG Simplicity Guidelines</li>
                  <li>Open Geospatial & Semantic Graph Architecture</li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
              <p>
                Platform Designed for Smart India Hackathon (SIH 2026) • All demonstration data is fictional for academic evaluation.
              </p>
              <p>
                Content Managed by Respective Government Departments & Universities
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
