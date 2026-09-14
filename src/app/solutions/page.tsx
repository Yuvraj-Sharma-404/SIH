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
    title: "Solar LoRaWAN Water Quality & Silt Telemetry — Harmu River",
    location: "Harmu River Corridor, Ranchi, Jharkhand",
    problem: "Untreated toxic industrial effluent and municipal sludge choking 14 residential ward channels.",
    solution: "Solar-powered multi-wavelength optical turbidity and DO telemetry pods with automated JUIDCO flood threshold triggers.",
    impact: "45,000 residents secured against monsoon sewage backflow; 3 major industrial midnight discharge violations caught.",
    status: "Implemented",
    team: "Chotanagpur Civic Sensor Labs (BIT Mesra, Ranchi)",
    department: "Jharkhand Urban Infrastructure Dev Corp (JUIDCO)",
    timeline: "February 2026 — July 2026",
    beforeMetric: "Turbidity > 42 NTU (Toxic Sludge)",
    afterMetric: "Turbidity < 8.5 NTU (Managed Flow)",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "sol-2",
    title: "Thermal Drone & Wireless Gas Mesh for Jharia Coal Fires",
    location: "BCCL Colliery Sector 7, Jharia, Dhanbad, Jharkhand",
    problem: "Subsurface mine seam fires causing toxic sulfur dioxide plumes and residential ground subsidence.",
    solution: "Edge multi-gas sensor pods (CO, SO2, CH4) coupled with weekly automated thermal GIS drone inspections.",
    impact: "85,000 residents monitored; 2 critical underground heat propagation zones evacuated 72 hours before surface collapse.",
    status: "Implemented",
    team: "Geospatial Mining Safety Lab (IIT - ISM Dhanbad)",
    department: "Jharkhand State Pollution Control Board & BCCL",
    timeline: "January 2026 — June 2026",
    beforeMetric: "Zero Pre-Subsidence Warning",
    afterMetric: "72-Hour Advance Geothermal Warning",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "sol-3",
    title: "Subarnarekha River Industrial Effluent Buoy Network",
    location: "Mango Riverbank Promenade, Jamshedpur, Jharkhand",
    problem: "Undetected industrial effluent discharge causing severe river hypoxia (DO < 2.8 mg/L) and fish mortality.",
    solution: "Autonomous solar telemetry buoy measuring BOD, COD, and conductivity, sending real-time SMS alerts to JSPCB.",
    impact: "52,000 riverbank residents protected; average regulatory response time reduced from 5 days to 18 minutes.",
    status: "Implemented",
    team: "Aquatic Telemetry Systems (NIT Jamshedpur)",
    department: "East Singhbhum District Environment Cell & JSPCB",
    timeline: "March 2026 — August 2026",
    beforeMetric: "Manual Bi-Monthly Sampling",
    afterMetric: "15-Minute Continuous Sensor Telemetry",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "sol-4",
    title: "Decentralized Solar Drinking Water Node — Dumka",
    location: "Kasturba Gandhi Balika Vidyalaya, Dumka, Jharkhand",
    problem: "Frequent 18-hour rural power cuts leaving 450 tribal residential school students without potable water.",
    solution: "5kW hybrid solar microgrid powering automated deep-borewell filtration reactor with battery telemetry.",
    impact: "450 tribal students and 8,500 villagers supplied with reliable 24x7 clean drinking water under IS 10500 standards.",
    status: "Implemented",
    team: "SolarClean Water Initiative (BIT Sindri & JREDA)",
    department: "Jharkhand Renewable Energy Development Agency (JREDA)",
    timeline: "April 2026 — July 2026",
    beforeMetric: "Zero Power for 18 hrs/day",
    afterMetric: "100% Solar Uptime for Pumping",
    imageUrl: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
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
