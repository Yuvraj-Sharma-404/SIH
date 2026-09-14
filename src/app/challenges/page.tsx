"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Users,
  Calendar,
  Building2,
  CheckCircle2,
  ArrowRight,
  Send,
  Loader2,
  Sparkles,
  Shield,
  Layers,
  Repeat,
  Award,
} from "lucide-react";
import Link from "next/link";

interface ChallengeItem {
  id: string;
  title: string;
  category: string;
  department: string;
  description: string;
  requiredExpertise: string;
  budgetEstimate: string;
  status: string;
  participantsCount: number;
  deadline: string;
}

const DEMO_CHALLENGES: ChallengeItem[] = [
  {
    id: "ch-1",
    title: "REAL-TIME OPTICAL SILT & INDUSTRIAL EFFLUENT TELEMETRY — HARMU RIVER RANCHI",
    category: "Water & Sanitation",
    department: "Jharkhand Urban Infrastructure Dev Corp (JUIDCO)",
    description:
      "Design and deploy solar-powered multi-parameter river sensors measuring siltation, dissolved oxygen, and toxic runoff levels along the 12km Harmu drainage canal to prevent residential monsoon flooding across Ranchi wards.",
    requiredExpertise: "Embedded IoT Sensors, Water Quality Analysis, LoRaWAN Telemetry, Civil Environmental Engineering",
    budgetEstimate: "₹4,50,000",
    status: "Open",
    participantsCount: 248,
    deadline: "24 Sept 2026",
  },
  {
    id: "ch-2",
    title: "DRONE-ASSISTED THERMAL INFRARED MAPPING & WIRELESS GAS MESH FOR JHARIA COAL FIRES",
    category: "Environment & Mining",
    department: "Jharkhand State Pollution Control Board & BCCL, Dhanbad",
    description:
      "Deploy edge toxic gas sensor pods (CO, SO2, CH4) paired with thermal infrared drone survey telemetry to track underground coalfire migration and alert settlements prior to surface subsidence.",
    requiredExpertise: "Thermal Drone GIS, Toxic Gas Telemetry, Geotechnical Engineering, Edge AI",
    budgetEstimate: "₹6,00,000",
    status: "Open",
    participantsCount: 184,
    deadline: "15 Oct 2026",
  },
  {
    id: "ch-3",
    title: "SUBARNAREKHA RIVER INDUSTRIAL EFFLUENT BUOY SENSOR NETWORK — JAMSHEDPUR",
    category: "Environment",
    department: "East Singhbhum District Environment Cell & JSPCB",
    description:
      "Deploy autonomous floating solar telemetry buoys along Subarnarekha river near Mango and Adityapur industrial clusters measuring BOD, COD, and heavy metal concentrations in real time.",
    requiredExpertise: "Aquatic Sensor Buoys, Industrial Effluent Chemistry, GSM Telemetry, GIS Dashboards",
    budgetEstimate: "₹3,75,000",
    status: "Open",
    participantsCount: 162,
    deadline: "02 Nov 2026",
  },
  {
    id: "ch-4",
    title: "HIGH-VOLUME PILGRIMAGE CROWD SANITATION & DRAINAGE TELEMETRY — BAIDYANATH DHAM DEOGHAR",
    category: "Sanitation & Tourism",
    department: "Deoghar Municipal Corporation & Tourism Dept",
    description:
      "Automated greywater level telemetry and decentralized smart biodigester monitoring for Shivaganga tank surrounding drainage to manage 200,000+ daily pilgrims during Shravani Mela.",
    requiredExpertise: "Crowd Sanitation IoT, Ultrasonic Drainage Gauges, Microbial Waste Treatment",
    budgetEstimate: "₹3,20,000",
    status: "Open",
    participantsCount: 119,
    deadline: "18 Nov 2026",
  },
];

export default function MyGovChallengesPage() {
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeItem | null>(null);
  const [participated, setParticipated] = useState(false);

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="gov-card p-6 bg-white border border-slate-200 gov-border-t-emerald flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-mono font-bold text-gov-emerald">
            MyGov Participation Model
          </span>
          <h1 className="text-2xl font-bold text-gov-navy font-serif mt-0.5">
            National Societal Challenges Hub
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Discover verified government problem statements inviting collaborative engineering solutions, student prototypes, and industry CSR partnerships.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <Link
            href="/teams"
            className="px-3.5 py-2 rounded-lg bg-gov-navy text-white hover:bg-gov-navy-dark font-bold transition shadow-sm"
          >
            Form a Team & Apply
          </Link>
        </div>
      </div>

      {/* The Closed Feedback Loop Banner (Fixing MyGov's #1 weakness) */}
      <div className="gov-card p-5 bg-gradient-to-r from-emerald-50/70 via-white to-blue-50/70 border border-emerald-200 text-xs text-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-emerald-100">
          <div className="flex items-center space-x-2">
            <Repeat className="w-4 h-4 text-gov-emerald" />
            <span className="font-bold text-gov-navy uppercase tracking-wider font-mono">
              The PS-43 Closed Feedback Loop Guarantee
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
            Fixing MyGov's Weak Spot
          </span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Unlike conventional portals where student proposals disappear without feedback, PS-43 guarantees real-time transparent progress tracking directly back to universities and industry teams:
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px] font-bold">
          <span className="px-2.5 py-1 rounded bg-white border border-slate-300 text-slate-700 shadow-sm">1. Proposal Submitted</span>
          <span className="text-slate-400">→</span>
          <span className="px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-blue-800 shadow-sm">2. Transparent Evaluation Scorecard</span>
          <span className="text-slate-400">→</span>
          <span className="px-2.5 py-1 rounded bg-purple-50 border border-purple-200 text-purple-800 shadow-sm">3. Shortlist & Grant Award</span>
          <span className="text-slate-400">→</span>
          <span className="px-2.5 py-1 rounded bg-orange-50 border border-orange-200 text-orange-800 shadow-sm">4. Milestone Progress Telemetry</span>
          <span className="text-slate-400">→</span>
          <span className="px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-sm">5. Citizen Outcome Verification</span>
        </div>
      </div>

      {/* Challenge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DEMO_CHALLENGES.map((challenge) => (
          <div
            key={challenge.id}
            className="gov-card p-6 bg-white border border-slate-200 flex flex-col justify-between space-y-5 gov-card-hover"
          >
            <div className="space-y-3">
              {/* Category & Status */}
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  {challenge.category}
                </span>
                <span className="font-mono text-[11px] font-bold text-emerald-600">
                  ● {challenge.status}
                </span>
              </div>

              {/* Title in Section 9 exact format */}
              <h2 className="text-base font-extrabold text-gov-navy font-serif leading-snug tracking-tight">
                {challenge.title}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed">
                {challenge.description}
              </p>

              <div className="pt-2 border-t border-slate-100 text-xs space-y-1 text-slate-600">
                <p>
                  <strong>Government Department: </strong>
                  <span>{challenge.department}</span>
                </p>
                <p>
                  <strong>Participants: </strong>
                  <span className="font-bold text-gov-navy">{challenge.participantsCount} Teams</span>
                </p>
                <p>
                  <strong>Deadline: </strong>
                  <span className="font-bold text-gov-saffron">{challenge.deadline}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedChallenge(challenge)}
              className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-gov-navy hover:text-white text-gov-navy text-xs font-bold border border-slate-300 transition flex items-center justify-center space-x-1.5 shadow-sm"
            >
              <span>View Challenge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Challenge Detail Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="gov-card w-full max-w-2xl bg-white rounded-2xl p-6 border border-slate-300 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-gov-emerald">
                  Challenge Dossier
                </span>
                <h3 className="text-lg font-bold text-gov-navy font-serif mt-0.5">
                  {selectedChallenge.title}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedChallenge(null);
                  setParticipated(false);
                }}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Structured Challenge Details */}
            <div className="space-y-4 text-xs text-slate-700">
              <div>
                <strong className="text-slate-900 block mb-1">Problem Statement & Objective:</strong>
                <p className="leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {selectedChallenge.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 block">Nodal Department:</strong>
                  <span>{selectedChallenge.department}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 block">Seed Grant / Prize:</strong>
                  <span className="font-bold text-gov-navy">{selectedChallenge.budgetEstimate}</span>
                </div>
              </div>

              <div>
                <strong className="text-slate-900 block mb-1">Eligibility:</strong>
                <p>Accredited University engineering teams, faculty researchers, registered startups, and industry R&D laboratories.</p>
              </div>

              <div>
                <strong className="text-slate-900 block mb-1">Required Disciplines:</strong>
                <p className="font-mono text-slate-600">{selectedChallenge.requiredExpertise}</p>
              </div>

              <div>
                <strong className="text-slate-900 block mb-1">Evaluation Criteria:</strong>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Technical feasibility & durability in harsh field conditions (30%)</li>
                  <li>Cost-effectiveness and local scalability (25%)</li>
                  <li>Innovation and edge autonomy (25%)</li>
                  <li>Real-world measurable social impact (20%)</li>
                </ul>
              </div>
            </div>

            {participated ? (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>
                  Participation Registered! You can now form your team or submit your proposal in the Teams & Proposals section.
                </span>
              </div>
            ) : null}

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
              <Link
                href="/teams"
                className="text-xs font-bold text-gov-navy hover:underline flex items-center space-x-1"
              >
                <span>Discover Teammates by Skills</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedChallenge(null);
                    setParticipated(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => setParticipated(true)}
                  className="px-5 py-2 rounded-lg bg-gov-emerald hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
                >
                  Participate in Challenge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
