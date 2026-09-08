'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t-4 border-orange-500 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-400 text-blue-950 font-bold rounded-full flex items-center justify-center text-xl">
                🏛️
              </div>
              <span className="font-bold text-white text-lg tracking-wide">
                CPGRAMS SAMADHAN
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Smart India Hackathon (SIH) Problem Statement 43 Prototype. Designed for zero-barrier citizen accessibility, automated AI triage, and collaborative university problem solving.
            </p>
            <div className="flex space-x-2 text-xs text-emerald-400 font-medium">
              <span>✓ CPGRAMS Compliant</span>
              <span>•</span>
              <span>✓ UMANG Integrated</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Citizen Services</h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/" className="hover:text-amber-400 transition-colors">Report a Problem (Zero Form)</Link></li>
              <li><Link href="/track" className="hover:text-amber-400 transition-colors">Track Grievance Status</Link></li>
              <li><Link href="/nearby" className="hover:text-amber-400 transition-colors">Nearby Community Map</Link></li>
              <li><Link href="/kiosk" className="hover:text-amber-400 transition-colors">Gram Panchayat Hardware Kiosk</Link></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Audio/Video Help Guides</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Department & Open Innovation</h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/authority" className="hover:text-amber-400 transition-colors">Department Officer Login</Link></li>
              <li><Link href="/challenges" className="hover:text-amber-400 transition-colors">University & Startup Challenges</Link></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">AI Duplicate Triage Protocol</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">National Public Service Guidelines</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Jharkhand IT Policy 2026</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Accessibility & Support</h3>
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 space-y-2 text-xs">
              <p className="text-amber-400 font-semibold">Toll-Free Grievance Helpline</p>
              <p className="text-lg font-bold text-white">1800-345-6543 / 1912</p>
              <p className="text-slate-400">Available 24x7 in Hindi, Santhali, Nagpuri & English</p>
            </div>
            <p className="text-[11px] text-slate-500 mt-3">
              Designed according to GIGW (Guidelines for Indian Government Websites) and WCAG 2.1 AA Standards.
            </p>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2026 Smart India Hackathon Team • Problem Statement 43 Solution.</p>
          <p className="mt-2 sm:mt-0">Designed for Ministry of Personnel, Public Grievances and Pensions & Govt of Jharkhand.</p>
        </div>
      </div>
    </footer>
  );
}
