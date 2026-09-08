'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { 
  MapPin, 
  Filter, 
  ThumbsUp, 
  AlertCircle, 
  Layers, 
  Search, 
  ExternalLink,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { INITIAL_REPORTS } from '../../data/mockData';
import { IssueCategory, Report } from '../../types';

export default function NearbyProblemsPage() {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [activeReport, setActiveReport] = useState<Report | null>(INITIAL_REPORTS[0]);

  const handleUpvote = (id: string) => {
    setReports(reports.map(r => {
      if (r.id === id) {
        return { ...r, upvotes: r.upvotes + 1 };
      }
      return r;
    }));
  };

  const filteredReports = reports.filter(r => {
    const categoryMatch = selectedCategory === 'ALL' || r.category === selectedCategory;
    const districtMatch = selectedDistrict === 'ALL' || r.location.district === selectedDistrict;
    return categoryMatch && districtMatch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                Community GIS Map
              </span>
              <span className="text-xs text-slate-500">• Privacy Protected</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Nearby Problems & Community Map
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Discover issues reported by nearby citizens in Ranchi, Dhanbad, and surrounding Panchayats. Upvote to highlight high-impact problems.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-slate-800 font-medium outline-none cursor-pointer"
              >
                <option value="ALL">All Categories (सभी विभाग)</option>
                <option value="Road Infrastructure">Road Infrastructure</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Electricity & Streetlights">Electricity & Streetlights</option>
                <option value="Sanitation & Waste">Sanitation & Waste</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs">
              <MapPin className="w-4 h-4 text-slate-400" />
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-transparent text-slate-800 font-medium outline-none cursor-pointer"
              >
                <option value="ALL">All Districts (सभी जिले)</option>
                <option value="Ranchi">Ranchi</option>
                <option value="Dhanbad">Dhanbad</option>
                <option value="East Singhbhum">East Singhbhum</option>
              </select>
            </div>
          </div>
        </div>

        {/* Split View Container: Simulated Map & List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT LIST COLUMN (5 cols) */}
          <div className="lg:col-span-5 space-y-4 max-h-[750px] overflow-y-auto pr-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between items-center">
              <span>Showing {filteredReports.length} Public Issues</span>
              <span>Sorted by Impact</span>
            </div>

            {filteredReports.map((report) => (
              <div
                key={report.id}
                onClick={() => setActiveReport(report)}
                className={`card p-5 cursor-pointer transition-all border-2 ${
                  activeReport?.id === report.id
                    ? 'border-blue-900 shadow-md bg-blue-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500">{report.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    report.status === 'RESOLVED' 
                      ? 'bg-emerald-100 text-emerald-800'
                      : report.status === 'IN_PROGRESS'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-blue-100 text-blue-900'
                  }`}>
                    ● {report.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base mt-2 line-clamp-1">{report.title}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{report.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1 font-medium">
                    📍 {report.location.village}, {report.location.district}
                  </span>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleUpvote(report.id); }}
                    className="flex items-center gap-1.5 bg-white border border-slate-300 hover:border-amber-500 text-slate-700 px-2.5 py-1 rounded-lg font-bold hover:bg-amber-50 transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-amber-600" />
                    <span>{report.upvotes} Citizens Affected</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT MAP & DETAILED PREVIEW COLUMN (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Simulated GIS Interactive Map Canvas */}
            <div className="bg-slate-900 rounded-2xl border-2 border-slate-700 p-4 text-white h-80 relative overflow-hidden shadow-inner flex flex-col justify-between">
              
              {/* Map Background Simulation */}
              <div 
                className="absolute inset-0 opacity-40 bg-cover bg-center"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80')` }}
              ></div>

              <div className="relative z-10 flex justify-between items-center bg-slate-950/80 p-3 rounded-xl border border-slate-800 backdrop-blur-xs">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-slate-200">GIS Geo-Cluster Map • Jharkhand District Heatmap</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  ● Real-time GPS Pins Active
                </span>
              </div>

              {/* Map Pins Simulation */}
              <div className="relative z-10 flex items-center justify-around py-8">
                {filteredReports.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setActiveReport(r)}
                    className={`p-2.5 rounded-full shadow-lg font-bold text-xs flex items-center gap-1 border-2 transition-transform transform hover:scale-125 ${
                      activeReport?.id === r.id 
                        ? 'bg-amber-500 border-white text-slate-950 ring-4 ring-amber-500/50 scale-110' 
                        : 'bg-blue-900 border-amber-400 text-white'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{r.location.village}</span>
                  </button>
                ))}
              </div>

              <div className="relative z-10 text-[11px] text-slate-400 text-right bg-slate-950/80 p-2 rounded border border-slate-800">
                OpenStreetMap GIS Coordinates • Ranchi District (23.3441° N, 85.3096° E)
              </div>
            </div>

            {/* Selected Problem Detail Card */}
            {activeReport && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-xs text-blue-900 font-bold font-mono">
                      REPORT #{activeReport.id}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">{activeReport.title}</h3>
                  </div>
                  <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
                    Priority: {activeReport.priority}
                  </span>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">{activeReport.description}</p>

                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-500 block">Category:</span>
                    <span className="font-bold text-slate-900">{activeReport.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Location:</span>
                    <span className="font-bold text-slate-900">
                      {activeReport.location.village}, {activeReport.location.district}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Reported By:</span>
                    <span className="font-medium text-slate-800">{activeReport.citizenName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Current Status:</span>
                    <span className="font-bold text-emerald-700">{activeReport.status}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => handleUpvote(activeReport.id)}
                    className="btn-secondary text-xs flex items-center gap-1.5"
                  >
                    <ThumbsUp className="w-4 h-4 text-amber-600" />
                    <span>Upvote Issue ({activeReport.upvotes} affected)</span>
                  </button>

                  <a href={`/track?id=${activeReport.id}`} className="btn-primary text-xs flex items-center gap-1">
                    <span>Full Audit Timeline</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
