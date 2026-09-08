'use client';

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Building, 
  MapPin, 
  PhoneCall, 
  FileText, 
  AlertCircle,
  Share2,
  Sparkles
} from 'lucide-react';
import { INITIAL_REPORTS } from '../../data/mockData';
import { Report, ReportStatus } from '../../types';

export default function TrackReportPage() {
  const [searchQuery, setSearchQuery] = useState('JH-2026-0042');
  const [selectedReport, setSelectedReport] = useState<Report | null>(INITIAL_REPORTS[0]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const found = INITIAL_REPORTS.find(
      r => r.id.toLowerCase() === searchQuery.trim().toLowerCase() || r.citizenPhone.includes(searchQuery.trim())
    );
    if (found) {
      setSelectedReport(found);
      setErrorMessage('');
    } else {
      setSelectedReport(null);
      setErrorMessage(`No grievance ticket found matching "${searchQuery}". Please check the ID or Phone Number.`);
    }
  };

  const statusSteps: { key: ReportStatus; label: string }[] = [
    { key: 'SUBMITTED', label: 'Report Submitted' },
    { key: 'UNDER_REVIEW', label: 'Under Review' },
    { key: 'ASSIGNED', label: 'Assigned to Authority' },
    { key: 'IN_PROGRESS', label: 'Work in Progress' },
    { key: 'RESOLVED', label: 'Resolved' }
  ];

  const getStepIndex = (status: ReportStatus) => {
    switch (status) {
      case 'SUBMITTED': return 0;
      case 'UNDER_REVIEW': return 1;
      case 'VERIFIED': return 1;
      case 'ASSIGNED': return 2;
      case 'IN_PROGRESS': return 3;
      case 'RESOLVED': return 4;
      case 'CLOSED': return 4;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Page Header */}
        <div className="text-center space-y-2">
          <span className="bg-blue-100 text-blue-900 text-xs font-bold px-3 py-1 rounded-full border border-blue-200 uppercase tracking-wide">
            Public Transparency Portal
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">Track My Grievance Status</h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Enter your unique Ticket Number (e.g. JH-2026-0042) to check real-time progress and department notes.
          </p>
        </div>

        {/* Search Bar Container */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Ticket ID (e.g. JH-2026-0042)..."
              className="w-full bg-white border-2 border-slate-300 rounded-xl pl-11 pr-4 py-3 text-base focus:border-blue-900 focus:ring-2 focus:ring-blue-900 outline-none font-mono"
            />
          </div>
          <button type="submit" className="btn-primary py-3 px-6 text-base font-bold">
            Search Status
          </button>
        </form>

        {/* Quick Sample Tickets Bar */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <span>Try sample tickets:</span>
          {INITIAL_REPORTS.map(r => (
            <button
              key={r.id}
              onClick={() => { setSearchQuery(r.id); setSelectedReport(r); setErrorMessage(''); }}
              className="font-mono bg-white border border-slate-200 px-2 py-0.5 rounded text-blue-900 font-semibold hover:border-blue-500 hover:bg-blue-50"
            >
              {r.id}
            </button>
          ))}
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center text-sm font-semibold flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* REPORT DETAILS & VISUAL TIMELINE */}
        {selectedReport && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Top Overview Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded border border-blue-200">
                      #{selectedReport.id}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-medium">
                      Category: {selectedReport.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-2">{selectedReport.title}</h2>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    📍 {selectedReport.location.village}, {selectedReport.location.block}, {selectedReport.location.district}
                  </p>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-3 py-1.5 rounded-full font-bold text-xs uppercase tracking-wide ${
                    selectedReport.status === 'RESOLVED' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    Status: {selectedReport.status.replace('_', ' ')}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">Submitted: {new Date(selectedReport.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* VISUAL TIMELINE STEPPER */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
                  Grievance Progress Stepper Timeline
                </h3>

                <div className="relative py-4">
                  {/* Timeline Bar Line */}
                  <div className="hidden sm:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                    {statusSteps.map((step, idx) => {
                      const currentIdx = getStepIndex(selectedReport.status);
                      const isCompleted = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={step.key} className="flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center bg-white p-2 rounded-lg">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all border-2 ${
                            isCompleted 
                              ? 'bg-emerald-600 border-emerald-500 text-white' 
                              : isCurrent
                              ? 'bg-amber-500 border-amber-400 text-slate-950 animate-pulse'
                              : 'bg-slate-100 border-slate-300 text-slate-400'
                          }`}>
                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                          </div>

                          <div>
                            <span className={`block text-xs font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                              {step.label}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] text-amber-700 font-extrabold bg-amber-50 px-1.5 py-0.5 rounded">
                                Current Stage
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Assigned Department Box */}
              {selectedReport.assignedAuthority && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-900 text-amber-400 flex items-center justify-center">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-blue-950">Assigned Department & Officer</h4>
                      <p className="text-xs text-blue-900 font-medium">{selectedReport.assignedAuthority.department}</p>
                      <p className="text-xs text-slate-600">Officer: {selectedReport.assignedAuthority.officerName}</p>
                    </div>
                  </div>

                  <a 
                    href={`tel:${selectedReport.assignedAuthority.contactPhone}`}
                    className="bg-white border border-blue-300 text-blue-900 hover:bg-blue-100 text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-4 h-4 text-emerald-600" />
                    <span>Contact Officer</span>
                  </a>
                </div>
              )}

            </div>

            {/* Audit Logs & Media Evidence Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Detailed Activity Logs */}
              <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-900" />
                  <span>Official Activity & Field Inspection Log</span>
                </h3>

                <div className="space-y-4 border-l-2 border-slate-200 pl-4 ml-2">
                  {selectedReport.timeline.map((entry) => (
                    <div key={entry.id} className="relative space-y-1">
                      <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-blue-900 border-2 border-white"></div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-900">{entry.title}</span>
                        <span className="text-slate-400 font-mono">{entry.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{entry.description}</p>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-0.5">
                        <span>Updated by: {entry.updatedBy} ({entry.role})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Citizen Media Evidence */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-900" />
                  <span>Submitted Evidence</span>
                </h3>

                {selectedReport.mediaUrl ? (
                  <div className="space-y-2">
                    <img
                      src={selectedReport.mediaUrl}
                      alt="Citizen evidence photo"
                      className="w-full h-48 object-cover rounded-xl border border-slate-200 shadow-xs"
                    />
                    <p className="text-[11px] text-slate-500 italic">
                      Uploaded via {selectedReport.inputType.toUpperCase()} capture method.
                    </p>
                  </div>
                ) : (
                  <div className="p-8 bg-slate-50 rounded-xl text-center text-xs text-slate-400">
                    No visual media attached. Text/Voice description provided.
                  </div>
                )}

                {/* AI Analysis Summary */}
                <div className="bg-slate-900 text-slate-200 p-4 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Pre-Analysis Result</span>
                  </div>
                  <p className="text-slate-300">Category Confidence: {(selectedReport.aiClassification.confidence * 100).toFixed(0)}%</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {selectedReport.aiClassification.extractedKeywords.map((kw, i) => (
                      <span key={i} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
