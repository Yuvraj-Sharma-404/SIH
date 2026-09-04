'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HardwareKioskBanner from '../components/HardwareKioskBanner';
import ReportProblemModal from '../components/ReportProblemModal';
import { 
  Video, 
  Camera, 
  Mic, 
  FileText, 
  Edit3, 
  Search, 
  MapPin, 
  Award, 
  PhoneCall, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import { INITIAL_REPORTS } from '../data/mockData';
import { Report } from '../types';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);

  const handleReportCreated = (newReport: Report) => {
    setReports([newReport, ...reports]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Main Citizen Hero Section */}
      <main className="flex-1">
        <div className="bg-gradient-to-b from-blue-950 via-blue-900 to-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500 relative overflow-hidden">
          
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
            
            {/* National Emblem Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-900/90 border border-blue-700/60 text-amber-300 text-xs font-semibold px-4 py-1.5 rounded-full shadow-inner">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Jharkhand Public Grievance Portal • No Technical Knowledge Required</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Report Any Local Problem in Seconds
              <span className="block text-amber-400 mt-1 font-serif italic text-2xl sm:text-4xl">
                "आपकी समस्या, सरकार का समाधान"
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed">
              No long forms. No confusing government jargon. Speak, take a photo, record a voice message, or upload a video. AI automatically routes it to the right department officer.
            </p>

            {/* PRIMARY BIG CTA BUTTON */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-extrabold text-xl py-5 px-10 rounded-2xl shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 border-2 border-amber-300"
              >
                <span className="text-2xl">📢</span>
                <span>REPORT A PROBLEM NOW</span>
                <ArrowRight className="w-6 h-6 text-slate-950" />
              </button>

              <Link
                href="/track"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold text-base py-5 px-8 rounded-2xl border border-white/30 backdrop-blur-xs flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5 text-amber-400" />
                <span>Track My Grievance Status</span>
              </Link>
            </div>

            {/* Quick 5 Input Methods Cards directly under CTA */}
            <div className="pt-8">
              <p className="text-xs text-amber-300/80 font-bold uppercase tracking-wider mb-4">
                Choose your preferred reporting method:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-4xl mx-auto">
                
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 p-3.5 rounded-xl text-center transition-all group"
                >
                  <Video className="w-6 h-6 text-red-400 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white block">🎥 Video</span>
                  <span className="text-[10px] text-slate-300 font-normal">Record issue</span>
                </button>

                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 p-3.5 rounded-xl text-center transition-all group"
                >
                  <Camera className="w-6 h-6 text-blue-400 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white block">📷 Photo</span>
                  <span className="text-[10px] text-slate-300 font-normal">Snap evidence</span>
                </button>

                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 p-3.5 rounded-xl text-center transition-all group"
                >
                  <Mic className="w-6 h-6 text-emerald-400 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white block">🎙️ Voice</span>
                  <span className="text-[10px] text-slate-300 font-normal">Speak problem</span>
                </button>

                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 p-3.5 rounded-xl text-center transition-all group"
                >
                  <FileText className="w-6 h-6 text-indigo-400 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white block">📄 Document</span>
                  <span className="text-[10px] text-slate-300 font-normal">Upload PDF/App</span>
                </button>

                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 p-3.5 rounded-xl text-center transition-all group col-span-2 sm:col-span-1"
                >
                  <Edit3 className="w-6 h-6 text-amber-400 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white block">✍️ Text</span>
                  <span className="text-[10px] text-slate-300 font-normal">Simple note</span>
                </button>

              </div>
            </div>

          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
          
          {/* HARDWARE KIOSK ACCESSIBILITY PROMOTIONAL BANNER */}
          <HardwareKioskBanner />

          {/* QUICK PORTAL NAVIGATION CARDS */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-900 rounded-full"></span>
              Key Public Services • मुख्य सेवाएँ
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Track Grievance */}
              <Link href="/track" className="card hover:shadow-lg hover:border-blue-300 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center mb-4 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-900">
                  Track My Reports
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Enter your tracking ticket number to view live step-by-step resolution timeline and officer notes.
                </p>
                <div className="mt-4 flex items-center text-xs font-bold text-blue-900 gap-1">
                  <span>Track Status Now</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>

              {/* Card 2: Nearby Community Map */}
              <Link href="/nearby" className="card hover:shadow-lg hover:border-emerald-300 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center mb-4 group-hover:bg-emerald-900 group-hover:text-white transition-colors">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-900">
                  Nearby Problems & GIS Map
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  View reported infrastructure issues around your village or district. Upvote recurring problems.
                </p>
                <div className="mt-4 flex items-center text-xs font-bold text-emerald-900 gap-1">
                  <span>View Map & Issues</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>

              {/* Card 3: Collaborative Innovation Challenges */}
              <Link href="/challenges" className="card hover:shadow-lg hover:border-amber-300 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-4 group-hover:bg-amber-900 group-hover:text-white transition-colors">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-amber-900">
                  University & NGO Challenges
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Verified public problems converted into structured innovation challenges for students and startups.
                </p>
                <div className="mt-4 flex items-center text-xs font-bold text-amber-900 gap-1">
                  <span>Submit Solution</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>

            </div>
          </div>

          {/* RECENTLY REPORTED PUBLIC ISSUES FEED */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span>RECENT PUBLIC GRIEVANCES</span>
                  <span className="text-xs bg-blue-100 text-blue-900 font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                    Live Feed
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Transparent updates from Ranchi, Dhanbad, and surrounding districts.
                </p>
              </div>

              <Link href="/nearby" className="text-xs font-bold text-blue-900 hover:underline flex items-center gap-1">
                View All Community Reports →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.slice(0, 4).map((report) => (
                <div key={report.id} className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 transition-colors bg-slate-50/50 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-500 font-semibold">{report.id}</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        report.status === 'RESOLVED' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : report.status === 'IN_PROGRESS'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}>
                        ● {report.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{report.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{report.description}</p>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      📍 {report.location.village}, {report.location.district}
                    </span>
                    <Link href={`/track?id=${report.id}`} className="text-blue-900 font-bold hover:underline">
                      Timeline →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IMPACT METRICS & GOVERNMENT TRANSPARENCY SECTION */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-amber-400">14,280+</p>
                <p className="text-xs text-slate-300 uppercase tracking-wider font-semibold">Issues Resolved</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">4.2 Days</p>
                <p className="text-xs text-slate-300 uppercase tracking-wider font-semibold">Avg Resolution Time</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-sky-400">92.4%</p>
                <p className="text-xs text-slate-300 uppercase tracking-wider font-semibold">Citizen Satisfaction</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-orange-400">3,450+</p>
                <p className="text-xs text-slate-300 uppercase tracking-wider font-semibold">Gram Panchayats Active</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* REPORT PROBLEM MODAL WIZARD */}
      <ReportProblemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleReportCreated}
      />

      <Footer />
    </div>
  );
}
