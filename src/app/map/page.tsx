"use client";

import { useState } from "react";
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
} from "lucide-react";
import Link from "next/link";

interface SectorData {
  id: string;
  name: string;
  district: string;
  density: "HIGH" | "MEDIUM" | "LOW";
  coordinates: [number, number];
  problemsCount: number;
  highPriorityCount: number;
  activeProjectsCount: number;
  challengesCount: number;
  primaryCategory: string;
  recentIssue: string;
}

const DEMO_SECTORS: SectorData[] = [
  {
    id: "sec-4",
    name: "Sector 4 — Sevagram Corridor",
    district: "Wardha",
    density: "HIGH",
    coordinates: [20.7453, 78.6022],
    problemsCount: 142,
    highPriorityCount: 23,
    activeProjectsCount: 7,
    challengesCount: 3,
    primaryCategory: "Infrastructure & Bridge Health",
    recentIssue: "Severe Pier #3 cracks & vibration on Dham River Bridge during bus transits.",
  },
  {
    id: "sec-2",
    name: "Ward 4 — ZP School Enclave",
    district: "Wardha",
    density: "HIGH",
    coordinates: [20.7389, 78.5954],
    problemsCount: 88,
    highPriorityCount: 19,
    activeProjectsCount: 3,
    challengesCount: 2,
    primaryCategory: "Water & Sanitation",
    recentIssue: "Yellow silt turbidity & chemical contamination in school drinking water pipeline.",
  },
  {
    id: "sec-7",
    name: "Central Bus Station & Market Yard",
    district: "Wardha",
    density: "MEDIUM",
    coordinates: [20.7512, 78.611],
    problemsCount: 45,
    highPriorityCount: 8,
    activeProjectsCount: 2,
    challengesCount: 1,
    primaryCategory: "Energy & Electrical Safety",
    recentIssue: "Open 11kV distribution transformer fence broken near pedestrian walkway.",
  },
  {
    id: "sec-1",
    name: "Collectorate & Civil Lines",
    district: "Wardha",
    density: "LOW",
    coordinates: [20.735, 78.588],
    problemsCount: 16,
    highPriorityCount: 2,
    activeProjectsCount: 4,
    challengesCount: 0,
    primaryCategory: "Administrative Services",
    recentIssue: "Streetlight timer synchronization in civil lines quadrant.",
  },
];

export default function ProblemMapPage() {
  const [selectedSector, setSelectedSector] = useState<SectorData>(DEMO_SECTORS[0]);
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterDensity, setFilterDensity] = useState("ALL");

  const filteredSectors = DEMO_SECTORS.filter((s) => {
    if (filterCategory !== "ALL" && !s.primaryCategory.toLowerCase().includes(filterCategory.toLowerCase())) {
      return false;
    }
    if (filterDensity !== "ALL" && s.density !== filterDensity) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 py-2">
      {/* Map Header & Filter Toolbar */}
      <div className="gov-card p-6 bg-white border border-slate-200 gov-border-t-navy flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-mono font-bold text-gov-navy">
            National Geospatial Civic Density Engine
          </span>
          <h1 className="text-2xl font-bold text-gov-navy font-serif">
            Interactive Problem Map & Hotspot Explorer
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Geographic clustering of citizen grievances, municipal infrastructure density, and active collaborative challenges.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center space-x-1 border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-transparent focus:outline-none text-slate-700 font-medium"
            >
              <option value="ALL">All Categories</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Water">Water & Sanitation</option>
              <option value="Energy">Energy</option>
            </select>
          </div>

          <div className="flex items-center space-x-1 border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={filterDensity}
              onChange={(e) => setFilterDensity(e.target.value)}
              className="bg-transparent focus:outline-none text-slate-700 font-medium"
            >
              <option value="ALL">All Densities</option>
              <option value="HIGH">High Concentration</option>
              <option value="MEDIUM">Medium Concentration</option>
              <option value="LOW">Low Concentration</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Map + Side Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map Visualizer (2 Cols) */}
        <div className="lg:col-span-2 gov-card p-6 bg-white border border-slate-200 flex flex-col justify-between space-y-6">
          {/* Map Top Bar */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 font-mono text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <span>Live Hotspot Feeds • Wardha District (Demo Zone)</span>
            </div>
            {/* Density Legend */}
            <div className="flex items-center space-x-3 text-[11px] font-semibold text-slate-600">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                <span>High Density</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Medium</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span>Low</span>
              </span>
            </div>
          </div>

          {/* Graphical Map Grid Visualization */}
          <div className="relative w-full h-[400px] rounded-xl bg-slate-100 border border-slate-300 overflow-hidden flex items-center justify-center p-4">
            {/* Grid Pattern Background */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Geographical River SVG / Road Landmark Outline */}
            <svg
              className="absolute inset-0 w-full h-full text-slate-300 pointer-events-none"
              viewBox="0 0 600 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 20 180 Q 200 240 380 160 T 580 220"
                stroke="#93c5fd"
                strokeWidth="16"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 120 20 L 260 380"
                stroke="#cbd5e1"
                strokeWidth="6"
                strokeDasharray="8 6"
              />
              <path
                d="M 380 30 L 410 370"
                stroke="#cbd5e1"
                strokeWidth="6"
                strokeDasharray="8 6"
              />
            </svg>

            {/* Interactive Sector Hotspot Nodes */}
            <div className="relative w-full h-full">
              {filteredSectors.map((sector) => {
                const isSelected = selectedSector.id === sector.id;

                // Position calculation for visual representation
                let topPos = "50%";
                let leftPos = "50%";
                if (sector.id === "sec-4") {
                  topPos = "38%";
                  leftPos = "48%";
                } else if (sector.id === "sec-2") {
                  topPos = "65%";
                  leftPos = "28%";
                } else if (sector.id === "sec-7") {
                  topPos = "25%";
                  leftPos = "72%";
                } else {
                  topPos = "78%";
                  leftPos = "68%";
                }

                return (
                  <div
                    key={sector.id}
                    onClick={() => setSelectedSector(sector)}
                    style={{ top: topPos, left: leftPos }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all transform hover:scale-110 z-10 ${
                      isSelected ? "scale-110 z-20" : ""
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-white shadow-lg border-2 ${
                          sector.density === "HIGH"
                            ? "bg-red-600 border-white ring-4 ring-red-200"
                            : sector.density === "MEDIUM"
                            ? "bg-amber-500 border-white ring-4 ring-amber-200"
                            : "bg-emerald-600 border-white ring-4 ring-emerald-200"
                        }`}
                      >
                        <MapPin className="w-5 h-5" />
                      </div>

                      <span
                        className={`mt-1.5 px-2 py-0.5 rounded text-[11px] font-bold whitespace-nowrap shadow-sm border ${
                          isSelected
                            ? "bg-gov-navy text-white border-gov-navy"
                            : "bg-white text-slate-800 border-slate-300"
                        }`}
                      >
                        {sector.name.split("—")[0]} ({sector.problemsCount})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
            <span>Coordinates: 20.7453° N, 78.6022° E</span>
            <span>Click any hotspot node to inspect the sector briefing panel.</span>
          </div>
        </div>

        {/* Section 14 Clean Information Panel (Sector Details) */}
        <div className="gov-card p-6 bg-white border border-slate-200 gov-border-t-saffron flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-200">
              <span className="text-[10px] uppercase font-mono font-bold text-gov-saffron">
                Selected Sector Dossier
              </span>
              <h2 className="text-xl font-bold text-gov-navy font-serif mt-0.5">
                {selectedSector.name}
              </h2>
              <p className="text-xs text-slate-500">
                District: <strong>{selectedSector.district}</strong> • Density Level:{" "}
                <span
                  className={`font-bold ${
                    selectedSector.density === "HIGH"
                      ? "text-red-600"
                      : selectedSector.density === "MEDIUM"
                      ? "text-amber-600"
                      : "text-emerald-600"
                  }`}
                >
                  {selectedSector.density}
                </span>
              </p>
            </div>

            {/* 4 Standard Metrics from Section 14 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Total Problems
                </span>
                <p className="text-2xl font-extrabold text-gov-navy font-mono mt-0.5">
                  {selectedSector.problemsCount}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200">
                <span className="text-[10px] text-rose-700 uppercase font-semibold block">
                  High Priority
                </span>
                <p className="text-2xl font-extrabold text-rose-700 font-mono mt-0.5">
                  {selectedSector.highPriorityCount}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] text-emerald-700 uppercase font-semibold block">
                  Active Projects
                </span>
                <p className="text-2xl font-extrabold text-gov-emerald font-mono mt-0.5">
                  {selectedSector.activeProjectsCount}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-orange-50 border border-orange-200">
                <span className="text-[10px] text-gov-saffron uppercase font-semibold block">
                  Challenges
                </span>
                <p className="text-2xl font-extrabold text-gov-saffron font-mono mt-0.5">
                  {selectedSector.challengesCount}
                </p>
              </div>
            </div>

            {/* Recent Critical Issue Spotlight */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Primary Issue in this Quadrant:
              </span>
              <p className="font-bold text-slate-800">
                {selectedSector.primaryCategory}
              </p>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                "{selectedSector.recentIssue}"
              </p>
            </div>
          </div>

          {/* Explore Area CTA */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <Link
              href="/challenges"
              className="w-full py-2.5 rounded-lg bg-gov-navy hover:bg-gov-navy-dark text-white font-bold text-xs shadow-sm transition flex items-center justify-center space-x-1.5"
            >
              <span>Explore Sector Challenges</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/citizen/report"
              className="w-full py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center justify-center space-x-1"
            >
              <span>Report Grievance in this Area</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
