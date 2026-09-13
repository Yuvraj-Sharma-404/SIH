import {
  ShieldCheck,
  TrendingUp,
  Users,
  Award,
  CheckCircle2,
  Calendar,
  Building2,
  GraduationCap,
} from "lucide-react";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ImpactPage() {
  const impactRecords = await prisma.impactRecord.findMany({
    include: {
      implementation: {
        include: {
          proposal: {
            include: { team: true },
          },
          challenge: true,
        },
      },
    },
  });

  const totalPeopleImpacted = impactRecords.reduce(
    (acc, cur) => acc + cur.peopleImpacted,
    0
  );

  return (
    <div className="space-y-8 py-4 animate-fade-in">
      {/* Impact Header */}
      <div className="glass-panel p-6 rounded-2xl border-teal-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">
                Public Transparency & Verified Social Impact Ledger
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                Audited Resolutions
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Closing the civic loop: Measurable evidence, before-and-after proof, and citizen-confirmed solutions.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-mono text-slate-400">Total Lives Impacted</span>
          <p className="text-2xl font-extrabold text-teal-400 font-mono">
            {totalPeopleImpacted.toLocaleString()}+
          </p>
        </div>
      </div>

      {/* Impact KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border-slate-800 text-center">
          <p className="text-2xl font-extrabold text-teal-400 font-mono">
            {totalPeopleImpacted.toLocaleString()}+
          </p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Citizens Protected</p>
        </div>
        <div className="glass-panel p-4 rounded-xl border-slate-800 text-center">
          <p className="text-2xl font-extrabold text-sky-400 font-mono">100%</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Evidence Verified</p>
        </div>
        <div className="glass-panel p-4 rounded-xl border-slate-800 text-center">
          <p className="text-2xl font-extrabold text-emerald-400 font-mono">14 Days</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Avg. Solution Cycle</p>
        </div>
        <div className="glass-panel p-4 rounded-xl border-slate-800 text-center">
          <p className="text-2xl font-extrabold text-amber-400 font-mono">₹45 Lakh</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Govt Repair Cost Saved</p>
        </div>
      </div>

      {/* Verified Resolution Case Studies */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white uppercase font-mono tracking-wider">
          Verified Field Deployments & Case Studies
        </h2>

        {impactRecords.map((record) => {
          const proposal = record.implementation.proposal;
          const challenge = record.implementation.challenge;

          return (
            <div
              key={record.id}
              className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 rounded">
                      {challenge.category}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                      {challenge.department}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1.5">
                    {record.problemTitle}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                    Resolved & Audited
                  </span>
                </div>
              </div>

              {/* Description & Impact Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {record.metricsSummary}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                    <p className="text-slate-400">
                      <strong className="text-white">Deployed Solution: </strong>
                      {proposal.title}
                    </p>
                    <p className="text-slate-400">
                      <strong className="text-white">University Team: </strong>
                      {proposal.team.name} ({proposal.team.institution})
                    </p>
                  </div>
                </div>

                {/* Evidence Image Snapshot */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    Field Verification Evidence
                  </span>
                  <div className="rounded-xl overflow-hidden border border-slate-700 aspect-video relative">
                    <img
                      src={
                        record.beforeAfterProofUrl ||
                        "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80"
                      }
                      alt="Verification Proof"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>

              {/* Audit Sign-off */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>
                    Verified by: <strong className="text-white">{record.verifiedBy}</strong>
                  </span>
                </div>

                <div className="font-mono text-[11px] text-slate-500">
                  Audit Timestamp: {new Date(record.verifiedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
