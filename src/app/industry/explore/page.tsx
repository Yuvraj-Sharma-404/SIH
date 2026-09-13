"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  HeartHandshake,
  DollarSign,
  Award,
  Sparkles,
  CheckCircle2,
  Building2,
  Cpu,
  Loader2,
  PlusCircle,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

export default function IndustryPortal() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Sponsorship Modal State
  const [selectedChallenge, setSelectedChallenge] = useState<any | null>(null);
  const [orgName, setOrgName] = useState("Tata Steel CSR Foundation");
  const [contactEmail, setContactEmail] = useState("csr@tatasteel.com");
  const [contactPhone, setContactPhone] = useState("9733099881");
  const [pledgeType, setPledgeType] = useState("CSR_GRANT");
  const [amountOrDetails, setAmountOrDetails] = useState("₹2,50,000 (Hardware Co-Funding)");
  const [isPledging, setIsPledging] = useState(false);
  const [pledgeSuccess, setPledgeSuccess] = useState(false);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/challenges");
      const data = await res.json();
      if (data.success) {
        setChallenges(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPledge = (challenge: any) => {
    setSelectedChallenge(challenge);
    setAmountOrDetails(challenge.budgetEstimate || "₹2,50,000");
  };

  const submitPledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallenge) return;
    setIsPledging(true);
    try {
      const res = await fetch(`/api/challenges/${selectedChallenge.id}/sponsorship`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationName: orgName,
          contactEmail,
          contactPhone,
          pledgeType,
          amountOrDetails,
        }),
      });

      if (res.ok) {
        setPledgeSuccess(true);
        setTimeout(() => {
          setPledgeSuccess(false);
          setSelectedChallenge(null);
          fetchChallenges();
        }, 1800);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPledging(false);
    }
  };

  return (
    <div className="space-y-6 py-2">
      {/* Industry Header */}
      <div className="gov-card p-6 bg-white border border-slate-200 gov-border-t-navy flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-gov-navy font-serif">
                Corporate Social Responsibility (CSR) & Industry Hub
              </h1>
              <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded bg-purple-50 text-purple-900 font-bold border border-purple-200">
                Companies Act 2013 Sec 135 Compliant
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Co-fund student prototypes, provide hardware & cloud compute sponsorships, and adopt regional societal challenges with direct audit trails.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-600 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          Participating CSR Entities: <strong className="text-gov-navy">Tata Steel, L&T, Infosys Foundation</strong>
        </div>
      </div>

      {/* Challenges to Sponsor */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-purple-700 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-mono">Loading CSR Investment Opportunities...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((c) => {
            const sponsorships = c.sponsorships || [];
            return (
              <div
                key={c.id}
                className="gov-card p-6 bg-white border border-slate-200 space-y-4 gov-card-hover flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-purple-800 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded">
                      {c.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Seed Grant: {c.budgetEstimate || "₹2,50,000"}
                    </span>
                  </div>

                  <Link
                    href={`/challenges/${c.id}`}
                    className="text-base font-bold text-gov-navy hover:text-purple-700 leading-snug font-serif transition block"
                  >
                    {c.title}
                  </Link>
                  <p className="text-xs text-slate-600 line-clamp-3">{c.description}</p>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                    <span>Nodal Dept: <strong className="text-slate-800">{c.department}</strong></span>
                    <span>Proposals: <strong className="text-slate-800">{c.proposals?.length || 0}</strong></span>
                  </div>

                  {sponsorships.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                      <span className="font-bold block text-[11px] uppercase tracking-wider">
                        Committed CSR Co-Sponsors ({sponsorships.length}):
                      </span>
                      {sponsorships.map((s: any) => (
                        <div key={s.id} className="text-[11px]">
                          • <strong>{s.organizationName}</strong>: {s.amountOrDetails} ({s.pledgeType.replace(/_/g, " ")})
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <Link
                    href={`/challenges/${c.id}`}
                    className="text-[11px] font-semibold text-gov-navy hover:underline"
                  >
                    View Canonical Dossier →
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleOpenPledge(c)}
                    className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-sm transition flex items-center space-x-1.5"
                  >
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>Pledge CSR Grant / Mentorship</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CSR Sponsorship Pledge Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="gov-card w-full max-w-lg rounded-2xl p-5 sm:p-6 bg-white border border-slate-300 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2 text-purple-900">
                <HeartHandshake className="w-5 h-5" />
                <h3 className="text-base font-bold text-gov-navy font-serif">
                  Corporate CSR / Industry Partnership Pledge
                </h3>
              </div>
              <button
                onClick={() => setSelectedChallenge(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {pledgeSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">CSR Pledge Committed!</h4>
                <p className="text-xs text-slate-600">
                  Your corporate commitment has been recorded on the public challenge ledger.
                </p>
              </div>
            ) : (
              <form onSubmit={submitPledge} className="space-y-4">
                <p className="text-xs text-slate-600">
                  Supporting: <strong>{selectedChallenge.title}</strong>
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Corporate / Enterprise Name
                  </label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Contact Email
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pledge Category
                  </label>
                  <select
                    value={pledgeType}
                    onChange={(e) => setPledgeType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-purple-600 bg-white"
                  >
                    <option value="CSR_GRANT">Financial CSR Grant (Section 135)</option>
                    <option value="MENTORSHIP">Technical Mentorship & Domain Guidance</option>
                    <option value="HARDWARE_ACCESS">Hardware, Compute & Laboratory Access</option>
                    <option value="CO_IMPLEMENTATION">On-Ground Implementation Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Committed Amount or Resource Description
                  </label>
                  <input
                    type="text"
                    required
                    value={amountOrDetails}
                    onChange={(e) => setAmountOrDetails(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-purple-600"
                    placeholder="e.g. ₹2,50,000 or 5 Industrial Sensor Units"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSelectedChallenge(null)}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPledging}
                    className="px-5 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-sm transition flex items-center space-x-1"
                  >
                    {isPledging ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    <span>Record Official CSR Commitment</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
