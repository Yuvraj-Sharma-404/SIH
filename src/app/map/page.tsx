"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  MapPin,
  Layers,
  Filter,
  AlertTriangle,
  Building2,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Loader2,
  Users,
  Activity,
  Compass,
  FileText,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Globe,
} from "lucide-react";
import Link from "next/link";
import {
  JHARKHAND_SECTORS,
  JHARKHAND_DISTRICTS,
  JHARKHAND_GIS_STATS,
  JharkhandSector,
} from "@/lib/data/jharkhand-data";

// Dynamically import Leaflet Map to avoid SSR errors
const GISSpatialClusterMap = dynamic(
  () => import("@/components/GISSpatialClusterMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] bg-slate-100 dark:bg-slate-900 rounded-2xl flex flex-col items-center justify-center border border-slate-300 dark:border-slate-700">
        <Loader2 className="w-9 h-9 text-gov-navy dark:text-sky-400 animate-spin mb-3" />
        <span className="text-sm font-bold text-gov-navy dark:text-sky-400">Loading Free OpenGIS Map Engine...</span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">Fetching OpenStreetMap Tiles & Jharkhand Civic Clusters</span>
      </div>
    ),
  }
);

export default function ProblemMapPage() {
  const [selectedSector, setSelectedSector] = useState<JharkhandSector>(JHARKHAND_SECTORS[0]);
  const [filterDistrict, setFilterDistrict] = useState("All Jharkhand");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterDensity, setFilterDensity] = useState("ALL");

  const filteredSectors = JHARKHAND_SECTORS.filter((s) => {
    if (filterDistrict !== "All Jharkhand" && s.district !== filterDistrict) {
      return false;
    }
    if (filterCategory !== "ALL" && !s.primaryCategory.toLowerCase().includes(filterCategory.toLowerCase())) {
      return false;
    }
    if (filterDensity !== "ALL" && s.density !== filterDensity) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 py-2 max-w-[1440px] mx-auto">
      {/* Header & Filter Toolbar */}
      <div className="gov-card p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 gov-border-t-navy flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Link href="/" className="hover:text-gov-navy dark:hover:text-sky-400 transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-gov-navy dark:text-sky-400">GIS Spatial Cluster Engine</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-bold text-gov-saffron">Jharkhand State</span>
          </div>

          <span className="text-xs uppercase font-mono font-bold text-gov-saffron tracking-wider">
            Government of Jharkhand • Multimodal Civic Density Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gov-navy dark:text-white font-serif mt-0.5">
            Interactive Problem Map & GIS Spatial Clusters
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
            Real-time geographical clustering of citizen grievances, municipal infrastructure density, and active collaborative R&D challenges across all 24 districts of Jharkhand powered by open-source GIS.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* District Selector */}
          <div className="flex items-center space-x-1.5 border border-slate-300 dark:border-slate-600 rounded-lg px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 shadow-xs">
            <Compass className="w-3.5 h-3.5 text-gov-saffron" />
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="bg-transparent focus:outline-none text-slate-700 dark:text-slate-200 font-semibold cursor-pointer"
            >
              {JHARKHAND_DISTRICTS.map((d) => (
                <option key={d} value={d} className="dark:bg-slate-900">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-1.5 border border-slate-300 dark:border-slate-600 rounded-lg px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 shadow-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-transparent focus:outline-none text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
            >
              <option value="ALL" className="dark:bg-slate-900">All Categories</option>
              <option value="Water" className="dark:bg-slate-900">Water & Sanitation</option>
              <option value="Infrastructure" className="dark:bg-slate-900">Infrastructure & Bridges</option>
              <option value="Environment" className="dark:bg-slate-900">Environment & Mining</option>
              <option value="Health" className="dark:bg-slate-900">Public Health & Waste</option>
              <option value="Agriculture" className="dark:bg-slate-900">Agriculture & Canals</option>
            </select>
          </div>

          {/* Density Filter */}
          <div className="flex items-center space-x-1.5 border border-slate-300 dark:border-slate-600 rounded-lg px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 shadow-xs">
            <Layers className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <select
              value={filterDensity}
              onChange={(e) => setFilterDensity(e.target.value)}
              className="bg-transparent focus:outline-none text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
            >
              <option value="ALL" className="dark:bg-slate-900">All Densities</option>
              <option value="HIGH" className="dark:bg-slate-900">High Concentration</option>
              <option value="MEDIUM" className="dark:bg-slate-900">Medium Concentration</option>
              <option value="LOW" className="dark:bg-slate-900">Low Concentration</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jharkhand State GIS Metric Quick-Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="gov-card p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-gov-navy dark:text-sky-400 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Grievances Mapped
            </span>
            <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
              {JHARKHAND_GIS_STATS.totalGrievances.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="gov-card p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              High-Risk Clusters
            </span>
            <span className="text-lg font-black text-red-600 dark:text-red-400 font-mono">
              {JHARKHAND_GIS_STATS.highPriorityClusters} Hotspots
            </span>
          </div>
        </div>

        <div className="gov-card p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Avg Resolution Time
            </span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {JHARKHAND_GIS_STATS.averageResolutionDays} Days
            </span>
          </div>
        </div>

        <div className="gov-card p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              GIS Coverage
            </span>
            <span className="text-lg font-black text-purple-600 dark:text-purple-400 font-mono">
              {JHARKHAND_GIS_STATS.coveragePercentage}
            </span>
          </div>
        </div>
      </div>

      {/* Main Map + Side Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Free Leaflet Map Visualizer (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="gov-card p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gov-saffron animate-pulse"></span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-gov-navy dark:text-sky-400">
                  Interactive GIS Hotspot Canvas • Jharkhand
                </h2>
              </div>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Click any hotspot marker to inspect on-ground telemetry
              </span>
            </div>

            {/* Live Leaflet OpenStreetMap Component */}
            <GISSpatialClusterMap
              sectors={JHARKHAND_SECTORS}
              selectedSector={selectedSector}
              onSelectSector={(s) => setSelectedSector(s)}
              height="500px"
              filterCategory={filterCategory}
              filterDensity={filterDensity}
              filterDistrict={filterDistrict}
            />
          </div>

          {/* Quick Hotspot Directory Grid */}
          <div className="gov-card p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <h3 className="text-xs font-bold text-gov-navy dark:text-sky-400 uppercase tracking-wide">
                Active Spatial Hotspots in {filterDistrict} ({filteredSectors.length})
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Sorted by AI Priority Score
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
              {filteredSectors.map((sector) => {
                const isSelected = selectedSector.id === sector.id;
                const isHigh = sector.density === "HIGH";

                return (
                  <button
                    key={sector.id}
                    type="button"
                    onClick={() => setSelectedSector(sector)}
                    className={`text-left p-3 rounded-xl border transition flex items-start justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-sky-50 dark:bg-sky-950/40 border-sky-500 shadow-sm ring-1 ring-sky-400"
                        : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 hover:border-gov-navy dark:hover:border-sky-400"
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold text-gov-saffron">
                          {sector.district}
                        </span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border ${
                            isHigh
                              ? "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
                              : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                          }`}
                        >
                          {sector.density} DENSITY
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {sector.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {sector.recentIssue}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black font-mono text-gov-navy dark:text-sky-400 block">
                        {sector.priorityScore}
                      </span>
                      <span className="text-[9px] text-slate-400 block">Priority</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Sector Deep-Dive Dossier (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="gov-card p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 gov-border-t-navy">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
              <div>
                <span className="font-mono text-[10px] font-extrabold text-gov-saffron uppercase tracking-wide block">
                  {selectedSector.publicProblemId}
                </span>
                <h3 className="text-base font-bold text-gov-navy dark:text-white mt-0.5">
                  {selectedSector.name}
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-gov-saffron shrink-0" />
                  <span>{selectedSector.district}, Jharkhand</span>
                </span>
              </div>

              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                  selectedSector.density === "HIGH"
                    ? "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
                    : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                }`}
              >
                {selectedSector.density} DENSITY
              </span>
            </div>

            {/* AI Priority & Impact Score */}
            <div className="bg-slate-50 dark:bg-slate-900/70 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-gov-saffron" />
                  <span>AI Grievance Priority Score</span>
                </span>
                <span className="font-mono font-black text-sm text-red-600 dark:text-red-400">
                  {selectedSector.priorityScore} / 100
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-red-600 rounded-full"
                  style={{ width: `${selectedSector.priorityScore}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono pt-0.5">
                <span>Severity: {(selectedSector.severity * 100).toFixed(0)}%</span>
                <span>Urgency: {(selectedSector.urgency * 100).toFixed(0)}%</span>
                <span>Impact: ~{selectedSector.impactPopulation.toLocaleString()} citizens</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Problem Description
                </span>
                <p className="text-slate-800 dark:text-slate-200 mt-1 leading-relaxed text-xs">
                  {selectedSector.description}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Jurisdictional Department
                  </span>
                  <span className="font-semibold text-gov-navy dark:text-sky-400">
                    {selectedSector.primaryCategory}
                  </span>
                </div>
                <p className="font-bold text-slate-900 dark:text-white">
                  {selectedSector.departmentName}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Officer: <strong>{selectedSector.assignedOfficer}</strong>
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-base font-bold font-mono text-gov-navy dark:text-sky-400 block">
                    {selectedSector.problemsCount}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                    Complaints
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-base font-bold font-mono text-red-600 dark:text-red-400 block">
                    {selectedSector.highPriorityCount}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                    Critical
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 block">
                    {selectedSector.challengesCount}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                    R&D Tasks
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <Link
                href={`/citizen/report?lat=${selectedSector.coordinates[0]}&lng=${selectedSector.coordinates[1]}&address=${encodeURIComponent(
                  selectedSector.address
                )}`}
                className="w-full py-2.5 px-4 rounded-lg bg-gov-saffron hover:bg-orange-600 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <span>Lodge Grievance in this Sector</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href={`/track?id=${selectedSector.publicProblemId}`}
                className="w-full py-2.5 px-4 rounded-lg bg-gov-navy dark:bg-slate-700 hover:bg-gov-navy-dark dark:hover:bg-slate-600 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Track Sector Dossier #{selectedSector.publicProblemId}</span>
              </Link>
            </div>
          </div>

          {/* Academic & University Engineering Link Box */}
          <div className="gov-card p-4 bg-gradient-to-br from-slate-50 to-emerald-50/40 dark:from-slate-800 dark:to-emerald-950/20 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <div className="flex items-center space-x-1.5 text-emerald-800 dark:text-emerald-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>State Academic R&D Consortium</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Hotspots with Priority &gt; 85 automatically invite collaborative problem-solving proposals from:
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
              {JHARKHAND_GIS_STATS.participatingInstitutions.map((inst) => (
                <li key={inst}>{inst}</li>
              ))}
            </ul>
            <Link
              href="/challenges"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-gov-navy dark:text-sky-400 hover:underline pt-1"
            >
              <span>Explore MyGov Societal Challenges</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
