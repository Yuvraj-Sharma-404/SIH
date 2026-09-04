'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Filter, 
  Search, 
  UserCheck, 
  Building, 
  Award, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  RefreshCw,
  BarChart3,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { INITIAL_REPORTS, INITIAL_CHALLENGES } from '../../data/mockData';
import { Report, ReportStatus, PriorityLevel, Challenge } from '../../types';

export default function AuthorityDashboardPage() {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [selectedReport, setSelectedReport] = useState<Report | null>(INITIAL_REPORTS[0]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [role, setRole] = useState<'Department Officer' | 'Verifier' | 'Super Admin'>('Department Officer');

  // Form actions inside modal
  const [newStatus, setNewStatus] = useState<ReportStatus>('IN_PROGRESS');
  const [officerNote, setOfficerNote] = useState('');
  const [assignedDepartment, setAssignedDepartment] = useState('PWD - Roads Division Ranchi');
  const [successMsg, setSuccessMsg] = useState('');

  const handleUpdateReportStatus = () => {
    if (!selectedReport) return;

    const updatedTimelineEntry = {
      id: `tl-${Date.now()}`,
      status: newStatus,
      title: `Status updated to ${newStatus.replace('_', ' ')}`,
      description: officerNote || `Department Officer updated status. Assigned: ${assignedDepartment}`,
      timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      updatedBy: 'Er. Arvind Kumar',
      role: role,
      department: assignedDepartment
    };

    const updatedReports = reports.map(r => {
      if (r.id === selectedReport.id) {
        return {
          ...r,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          assignedAuthority: {
            department: assignedDepartment,
            officerName: 'Er. Arvind Kumar',
            contactPhone: '0651-2401823'
          },
          timeline: [updatedTimelineEntry, ...r.timeline]
        };
      }
      return r;
    });

    setReports(updatedReports);
    const refreshed = updatedReports.find(r => r.id === selectedReport.id);
    if (refreshed) setSelectedReport(refreshed);

    setSuccessMsg(`Report #${selectedReport.id} successfully updated to ${newStatus}!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleConvertToChallenge = (report: Report) => {
    const newChallenge: Challenge = {
      id: `CH-2026-0${challenges.length + 1}`,
      reportId: report.id,
      title: `Hackathon Challenge: ${report.title}`,
      category: report.category,
      district: report.location.district,
      description: report.description,
      impactScore: `High Priority (${report.upvotes * 50}+ Citizens Affected)`,
      affectedPopulationEstimate: report.upvotes * 50,
      solutionsSubmittedCount: 0,
      createdAt: new Date().toISOString(),
      status: 'OPEN'
    };

    setChallenges([newChallenge, ...challenges]);
    
    // Mark report as challenge
    setReports(reports.map(r => r.id === report.id ? { ...r, isChallenge: true } : r));
    
    setSuccessMsg(`Issue #${report.id} converted into Public Challenge for Universities & NGOs!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const filteredReports = reports.filter(r => statusFilter === 'ALL' || r.status === statusFilter);

  // KPI Computations
  const totalCount = reports.length;
  const pendingCount = reports.filter(r => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW').length;
  const inProgressCount = reports.filter(r => r.status === 'IN_PROGRESS' || r.status === 'ASSIGNED').length;
  const resolvedCount = reports.filter(r => r.status === 'RESOLVED').length;
  const duplicatesCount = reports.filter(r => r.aiClassification.isDuplicateDetected).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Officer Header & RBAC Role Switcher */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border-b-4 border-amber-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-blue-900 text-amber-400 border-2 border-amber-400 flex items-center justify-center text-2xl font-bold">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">Authority & Triage Command Center</h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-mono px-2.5 py-0.5 rounded border border-emerald-500/30">
                  Live Dispatch
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Public Works, Water Supply, Electricity & Sanitation Department • Govt of Jharkhand
              </p>
            </div>
          </div>

          {/* RBAC Role Picker */}
          <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-xs flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300 font-medium">Logged Role:</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="bg-slate-900 text-amber-300 font-bold border border-slate-700 rounded px-2 py-1 focus:outline-none"
            >
              <option value="Department Officer">Executive Officer (PWD/DWSD)</option>
              <option value="Verifier">Field Verifier</option>
              <option value="Super Admin">District Magistrate Admin</option>
            </select>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between text-sm font-bold animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>{successMsg}</span>
            </div>
          </div>
        )}

        {/* KPI DASHBOARD CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Reports</p>
            <p className="text-2xl font-extrabold text-slate-900">{totalCount}</p>
            <p className="text-[11px] text-slate-400">All Jharkhand Districts</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-xs space-y-1 bg-amber-50/30">
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Pending Review</p>
            <p className="text-2xl font-extrabold text-amber-900">{pendingCount}</p>
            <p className="text-[11px] text-amber-700">Requires triage</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-xs space-y-1 bg-blue-50/30">
            <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">In Progress</p>
            <p className="text-2xl font-extrabold text-blue-900">{inProgressCount}</p>
            <p className="text-[11px] text-blue-700">Work order dispatched</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-xs space-y-1 bg-emerald-50/30">
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Resolved</p>
            <p className="text-2xl font-extrabold text-emerald-900">{resolvedCount}</p>
            <p className="text-[11px] text-emerald-700">Verified & closed</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-indigo-200 shadow-xs space-y-1 bg-indigo-50/30">
            <p className="text-xs font-bold text-indigo-800 uppercase tracking-wider">AI Duplicate Flag</p>
            <p className="text-2xl font-extrabold text-indigo-900">{duplicatesCount}</p>
            <p className="text-[11px] text-indigo-700">Grouped automatically</p>
          </div>
        </div>

        {/* MAIN TRIAGE TABLE & MANAGEMENT DETAIL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* GRIEVANCE TRIAGE TABLE (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-900" />
                  <span>Incoming Grievances Queue</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Click any row to open management actions</p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-slate-300 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="SUBMITTED">SUBMITTED</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Ticket ID</th>
                    <th className="p-3.5">Title & Location</th>
                    <th className="p-3.5">Priority</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredReports.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedReport(r)}
                      className={`cursor-pointer transition-colors hover:bg-blue-50/50 ${
                        selectedReport?.id === r.id ? 'bg-blue-50/80 font-semibold' : ''
                      }`}
                    >
                      <td className="p-3.5 font-mono font-bold text-blue-900">{r.id}</td>
                      <td className="p-3.5 space-y-0.5">
                        <p className="font-bold text-slate-900 line-clamp-1">{r.title}</p>
                        <p className="text-[11px] text-slate-500">📍 {r.location.village}, {r.location.district}</p>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          r.priority === 'CRITICAL' || r.priority === 'HIGH'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {r.priority}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === 'RESOLVED' 
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'IN_PROGRESS'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-blue-100 text-blue-900'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <button className="text-blue-900 font-bold hover:underline flex items-center gap-1">
                          Manage <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* DETAILED MANAGEMENT ACTION PANEL (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {selectedReport ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                
                {/* Header */}
                <div className="border-b border-slate-200 pb-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-blue-900 font-bold">#{selectedReport.id}</span>
                    <span className="text-slate-500">Category: {selectedReport.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedReport.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">{selectedReport.description}</p>
                </div>

                {/* AI Summary & Priority Badge */}
                <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between text-amber-400 font-bold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4" /> AI Triage Assessment
                    </span>
                    <span className="text-emerald-400">Score: {(selectedReport.aiClassification.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <p className="text-slate-300">
                    Suggested Routing: <strong className="text-white">{selectedReport.category} Department</strong>
                  </p>
                  {selectedReport.aiClassification.isDuplicateDetected && (
                    <div className="bg-indigo-950 text-indigo-200 p-2 rounded border border-indigo-800 flex items-center gap-1.5 font-semibold">
                      <AlertTriangle className="w-4 h-4 text-indigo-400" />
                      <span>Duplicate Cluster Detected (Grouped with #{selectedReport.aiClassification.duplicateOfId})</span>
                    </div>
                  )}
                </div>

                {/* MANAGEMENT ACTION CONTROLS */}
                <div className="space-y-4 pt-2">
                  <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                    Officer Action Controls
                  </h4>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Assign Department Wing</label>
                    <select
                      value={assignedDepartment}
                      onChange={(e) => setAssignedDepartment(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-white font-medium"
                    >
                      <option value="PWD - Roads Division Ranchi">PWD - Roads Division Ranchi</option>
                      <option value="Drinking Water & Sanitation (DWSD)">Drinking Water & Sanitation (DWSD)</option>
                      <option value="JBVNL Electricity Division">JBVNL Electricity Division</option>
                      <option value="Dhanbad Municipal Corporation">Dhanbad Municipal Corporation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Update Status Phase</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as any)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-white font-bold text-blue-900"
                    >
                      <option value="UNDER_REVIEW">UNDER REVIEW (जाँच जारी)</option>
                      <option value="VERIFIED">VERIFIED (सत्यापित)</option>
                      <option value="ASSIGNED">ASSIGNED (आवंटित)</option>
                      <option value="IN_PROGRESS">IN PROGRESS (कार्य प्रगति पर)</option>
                      <option value="RESOLVED">RESOLVED (समाधान पूर्ण)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Official Notes / Dispatch Instructions</label>
                    <textarea
                      rows={3}
                      value={officerNote}
                      onChange={(e) => setOfficerNote(e.target.value)}
                      placeholder="e.g. Contractor dispatched. Asphalt patching scheduled..."
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-900 outline-none"
                    ></textarea>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleUpdateReportStatus}
                      className="btn-primary w-full text-xs font-bold py-3"
                    >
                      Update Grievance Status
                    </button>
                  </div>
                </div>

                {/* SPECIAL INNOVATION ACTION: CONVERT TO CHALLENGE */}
                <div className="border-t border-slate-200 pt-4 space-y-2">
                  <h4 className="font-bold text-xs text-amber-900 flex items-center gap-1">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Collaborative Problem Solving (SIH Feature)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    If this is a recurring systemic problem requiring novel technology, publish it to Universities & Startups.
                  </p>
                  
                  <button
                    onClick={() => handleConvertToChallenge(selectedReport)}
                    disabled={selectedReport.isChallenge}
                    className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                      selectedReport.isChallenge
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 opacity-80 cursor-default'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                    }`}
                  >
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>{selectedReport.isChallenge ? '✓ Published to Hackathon Challenges' : 'Promote to University/NGO Challenge'}</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
                Select a report from the table to view management controls.
              </div>
            )}
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
