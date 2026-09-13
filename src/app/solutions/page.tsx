import {
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Building2,
  GraduationCap,
  Calendar,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface SolutionItem {
  id: string;
  title: string;
  location: string;
  problem: string;
  solution: string;
  impact: string;
  status: string;
  team: string;
  department: string;
  timeline: string;
  beforeMetric: string;
  afterMetric: string;
  imageUrl: string;
}

const IMPLEMENTED_SOLUTIONS: SolutionItem[] = [
  {
    id: "sol-1",
    title: "Smart Waste Monitoring — Rohtak",
    location: "Rohtak Municipal Corporation, Haryana",
    problem: "Low municipal waste segregation and unauthorized residential overflow dumping.",
    solution: "IoT-based optical fill-level sensor network with automated fleet route optimization.",
    impact: "28% improvement in segregation; 42% reduction in uncollected garbage complaints.",
    status: "Implemented",
    team: "CleanCity Innovators (NIT Kurukshetra)",
    department: "Municipal Corporation",
    timeline: "March 2026 — August 2026",
    beforeMetric: "34% Segregation Rate",
    afterMetric: "62% Segregation Rate",
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "sol-2",
    title: "Solar LoRaWAN Bridge Vibration Telemetry — Wardha",
    location: "Dham River Bridge, Sevagram Road, Wardha, Maharashtra",
    problem: "Severe pier cracks and scour erosion threatening 18,500 daily school van and bus commuters.",
    solution: "Solar-powered tri-axial MEMS accelerometer mesh network with automated SMS alert threshold siren.",
    impact: "18,500 daily commuters secured; 2 critical crack propagation alerts successfully caught before monsoon crest.",
    status: "Implemented",
    team: "SensorGrid Dynamics Lab (Govt College of Engineering, Amravati)",
    department: "Public Works Department (PWD)",
    timeline: "January 2026 — June 2026",
    beforeMetric: "Zero Continuous Telemetry",
    afterMetric: "100Hz Real-Time Frequency FFT",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "sol-3",
    title: "Decentralized Solar UV-C Drinking Water Node — Ward 4",
    location: "Zilla Parishad School Ward 4, Wardha",
    problem: "Yellow silt turbidity and high microbial contamination causing repeated child hospitalizations.",
    solution: "Solar-powered multi-stage UV-C purification reactor with optical turbidity telemetry.",
    impact: "1,200 primary school students supplied with clean drinking water conforming to IS 10500 standards.",
    status: "Implemented",
    team: "AquaSense Innovation Lab (IIT Bombay Collaboration)",
    department: "Jal Jeevan Mission / Water Supply Board",
    timeline: "April 2026 — July 2026",
    beforeMetric: "Turbidity: 18.5 NTU (High Silt)",
    afterMetric: "Turbidity: <1.2 NTU (Potable)",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
  },
];

export default function PublicSolutionsPage() {
  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="gov-card p-6 bg-white border border-slate-200 gov-border-t-emerald flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-mono font-bold text-gov-emerald">
            Public Transparency & Verified Impact
          </span>
          <h1 className="text-2xl font-bold text-gov-navy font-serif mt-0.5">
            Implemented Civic Solutions & Case Studies
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Closing the societal loop: Demonstrating completed engineering solutions developed by university teams and deployed on the ground.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
            ✔ 100% Field Verified
          </span>
        </div>
      </div>

      {/* Solutions Cards Grid (Matching Section 13 exact format) */}
      <div className="space-y-6">
        {IMPLEMENTED_SOLUTIONS.map((item) => (
          <div
            key={item.id}
            className="gov-card p-6 bg-white border border-slate-200 space-y-5 gov-card-hover"
          >
            {/* Title & Status */}
            <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.location}</span>
                </span>
                <h2 className="text-xl font-bold text-gov-navy font-serif mt-1">
                  {item.title}
                </h2>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                ● {item.status}
              </span>
            </div>

            {/* Content Breakdown: Problem, Solution, Impact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-3 text-xs">
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block font-semibold text-[11px] uppercase tracking-wider">
                    Problem:
                  </strong>
                  <p className="text-slate-700 leading-relaxed">{item.problem}</p>
                </div>

                <div className="p-3.5 rounded-lg bg-blue-50/60 border border-blue-200 space-y-1">
                  <strong className="text-gov-navy block font-semibold text-[11px] uppercase tracking-wider">
                    Solution:
                  </strong>
                  <p className="text-slate-800 leading-relaxed font-medium">{item.solution}</p>
                </div>

                <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-1">
                  <strong className="text-emerald-800 block font-semibold text-[11px] uppercase tracking-wider">
                    Measurable Impact:
                  </strong>
                  <p className="text-emerald-950 font-bold leading-relaxed">{item.impact}</p>
                </div>

                {/* Team & Department Attribution */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px] text-slate-600">
                  <p>
                    <strong>Implementing Team: </strong>
                    <span className="text-slate-900 font-semibold">{item.team}</span>
                  </p>
                  <p>
                    <strong>Nodal Department: </strong>
                    <span className="text-slate-900 font-semibold">{item.department}</span>
                  </p>
                </div>
              </div>

              {/* Before / After Metrics & Image Snapshot */}
              <div className="space-y-3">
                <div className="rounded-xl overflow-hidden border border-slate-300 aspect-video relative shadow-sm">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Before / After Comparison */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Before</span>
                    <p className="font-bold text-slate-700 mt-0.5">{item.beforeMetric}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">After</span>
                    <p className="font-extrabold text-gov-emerald mt-0.5">{item.afterMetric}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              <span>Implementation Timeline: {item.timeline}</span>
              <span className="font-mono text-gov-navy font-bold">Government Audit Verified</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
