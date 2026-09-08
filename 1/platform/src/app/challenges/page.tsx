'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { 
  Award, 
  Building2, 
  Users, 
  Lightbulb, 
  Send, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  PlusCircle, 
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';
import { INITIAL_CHALLENGES, INITIAL_SOLUTIONS } from '../../data/mockData';
import { Challenge, SolutionSubmission } from '../../types';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [solutions, setSolutions] = useState<SolutionSubmission[]>(INITIAL_SOLUTIONS);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(INITIAL_CHALLENGES[0]);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Solution Form state
  const [contributorName, setContributorName] = useState('Team JalShakti');
  const [orgType, setOrgType] = useState<'University' | 'Student Team' | 'NGO' | 'Startup'>('University');
  const [orgName, setOrgName] = useState('BIT Mesra Ranchi');
  const [solutionTitle, setSolutionTitle] = useState('');
  const [proposalSummary, setProposalSummary] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('₹35,000');
  const [timelineDays, setTimelineDays] = useState(14);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmitSolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChallenge) return;

    const newSolution: SolutionSubmission = {
      id: `SOL-${Math.floor(100 + Math.random() * 900)}`,
      challengeId: activeChallenge.id,
      contributorName,
      organizationType: orgType,
      organizationName: orgName,
      title: solutionTitle || 'Low-Cost Community Filtration Model',
      proposalSummary: proposalSummary || 'Deploying solar-powered IoT monitoring units for instant contamination alerts.',
      estimatedCost: estimatedCost || '₹40,000',
      timelineDays: Number(timelineDays) || 15,
      submittedAt: new Date().toISOString(),
      status: 'SUBMITTED'
    };

    setSolutions([newSolution, ...solutions]);
    
    // Increment solutions count
    setChallenges(challenges.map(c => c.id === activeChallenge.id ? { ...c, solutionsSubmittedCount: c.solutionsSubmittedCount + 1 } : c));
    
    setIsSubmitModalOpen(false);
    setSuccessMsg('Your proposal has been submitted to District Administration & Department Review Panel!');
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const challengeSolutions = solutions.filter(s => s.challengeId === activeChallenge?.id);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Page Hero */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white rounded-2xl p-8 shadow-lg relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-black/20 text-amber-100 text-xs font-bold px-3 py-1 rounded-full border border-amber-300/30">
              <Award className="w-4 h-4 text-amber-300" />
              <span>SIH Open Innovation Portal • University & Industry Collaboration</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Public Societal Challenges & Hackathon
            </h1>
            <p className="text-sm text-amber-100 leading-relaxed">
              We convert recurring local grievances (water contamination, road erosion, garbage dumps) into structured innovation challenges. Universities, Students, NGOs, and Startups can submit real engineering solutions.
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-md flex items-center justify-between text-sm font-bold animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>{successMsg}</span>
            </div>
          </div>
        )}

        {/* MAIN LAYOUT: CHALLENGES LIST & PROPOSAL DETAIL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: CHALLENGES SELECTOR (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center justify-between">
              <span>Active Public Challenges ({challenges.length})</span>
              <span className="text-xs text-slate-500 font-normal">Updated Daily</span>
            </h3>

            {challenges.map((ch) => (
              <div
                key={ch.id}
                onClick={() => setActiveChallenge(ch)}
                className={`card p-5 cursor-pointer transition-all border-2 ${
                  activeChallenge?.id === ch.id
                    ? 'border-amber-500 shadow-md bg-amber-50/20'
                    : 'border-slate-200 hover:border-amber-300'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">
                    {ch.id}
                  </span>
                  <span className="text-slate-500 font-medium">📍 {ch.district}</span>
                </div>

                <h4 className="font-bold text-slate-900 text-base mt-2">{ch.title}</h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{ch.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> {ch.impactScore}
                  </span>

                  <span className="bg-slate-100 text-slate-700 font-bold px-2 py-1 rounded">
                    {ch.solutionsSubmittedCount} Solutions Submitted
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: CHALLENGE DETAILS & SUBMISSION LIST (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {activeChallenge && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                
                {/* Header Info */}
                <div className="border-b border-slate-200 pb-5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-amber-700">{activeChallenge.id}</span>
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                      Status: {activeChallenge.status}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {activeChallenge.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {activeChallenge.description}
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400 block">Category:</span>
                      <span className="font-bold text-slate-900">{activeChallenge.category}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">District:</span>
                      <span className="font-bold text-slate-900">{activeChallenge.district}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Impact Estimate:</span>
                      <span className="font-bold text-emerald-700">{activeChallenge.affectedPopulationEstimate}+ Citizens</span>
                    </div>
                  </div>
                </div>

                {/* SUBMIT SOLUTION CTA */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-amber-950 text-sm">Have an Engineering or Community Solution?</h4>
                    <p className="text-xs text-amber-800 mt-0.5">Universities, Student Teams, Startups & NGOs can submit proposals.</p>
                  </div>

                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-3 px-5 rounded-lg shadow-sm flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Submit Solution Proposal</span>
                  </button>
                </div>

                {/* SUBMITTED SOLUTIONS LIST */}
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>Submitted Proposals ({challengeSolutions.length})</span>
                  </h3>

                  {challengeSolutions.length > 0 ? (
                    <div className="space-y-3">
                      {challengeSolutions.map((sol) => (
                        <div key={sol.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-blue-900">{sol.contributorName}</span>
                            <span className="bg-white border border-slate-300 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                              {sol.organizationType} • {sol.organizationName}
                            </span>
                          </div>

                          <h5 className="font-bold text-slate-900 text-sm">{sol.title}</h5>
                          <p className="text-xs text-slate-600">{sol.proposalSummary}</p>

                          <div className="flex justify-between items-center text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                            <span>Cost: <strong className="text-slate-900">{sol.estimatedCost}</strong></span>
                            <span>Timeline: <strong className="text-slate-900">{sol.timelineDays} Days</strong></span>
                            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                              {sol.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-xl border">
                      No solutions submitted yet. Be the first university team to propose a solution!
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

        </div>

      </main>

      {/* SUBMIT SOLUTION MODAL */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Submit Solution Proposal</h3>
              <button onClick={() => setIsSubmitModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitSolution} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Organization / Institution Type</label>
                  <select
                    value={orgType}
                    onChange={(e) => setOrgType(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 bg-white font-medium"
                  >
                    <option value="University">University / Engineering Institute</option>
                    <option value="Student Team">Student Team / Hackathon Participant</option>
                    <option value="NGO">NGO / Non-Profit</option>
                    <option value="Startup">Tech Startup / Industry</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Institution Name</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. BIT Mesra / IIT ISM Dhanbad"
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Team Leader / Contributor Name</label>
                <input
                  type="text"
                  value={contributorName}
                  onChange={(e) => setContributorName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Solution Title</label>
                <input
                  type="text"
                  value={solutionTitle}
                  onChange={(e) => setSolutionTitle(e.target.value)}
                  placeholder="e.g. Solar Gravity Bio-Sand Filter Unit"
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Proposal Summary & Technical Approach</label>
                <textarea
                  rows={3}
                  value={proposalSummary}
                  onChange={(e) => setProposalSummary(e.target.value)}
                  placeholder="Explain how your solution works, materials required, and deployment plan..."
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Budget</label>
                  <input
                    type="text"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Deployment Timeline (Days)</label>
                  <input
                    type="number"
                    value={timelineDays}
                    onChange={(e) => setTimelineDays(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsSubmitModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Submit Proposal →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
