import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import React, { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Shield,
  Activity,
  AlertTriangle,
  Users,
} from "lucide-react";
import { JharkhandSector, JHARKHAND_SECTORS } from "@/lib/data/jharkhand-data";
import Link from "next/link";

interface GISSpatialClusterMapProps {
  sectors?: JharkhandSector[];
  selectedSector: JharkhandSector | null;
  onSelectSector: (sector: JharkhandSector) => void;
  height?: string;
  filterCategory?: string;
  filterDensity?: string;
  filterDistrict?: string;
}

export default function GISSpatialClusterMap({
  sectors = JHARKHAND_SECTORS,
  selectedSector,
  onSelectSector,
  height = "520px",
  filterCategory = "ALL",
  filterDensity = "ALL",
  filterDistrict = "All Jharkhand",
}: GISSpatialClusterMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const circlesRef = useRef<Record<string, any>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeLayer, setActiveLayer] = useState<"standard" | "topographic">("standard");
  const tileLayerRef = useRef<any>(null);

  // Filtered list of sectors
  const displaySectors = sectors.filter((sec) => {
    if (filterDistrict !== "All Jharkhand" && sec.district !== filterDistrict) {
      return false;
    }
    if (filterCategory !== "ALL" && !sec.primaryCategory.toLowerCase().includes(filterCategory.toLowerCase())) {
      return false;
    }
    if (filterDensity !== "ALL" && sec.density !== filterDensity) {
      return false;
    }
    return true;
  });

  // Initialize Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;

      try {
        const L = (await import("leaflet")).default;
        // @ts-ignore
        await import("leaflet-defaulticon-compatibility");

        if (!isMounted || !mapContainerRef.current) return;

        // Clean up previous map instance
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        // Center on Jharkhand state centroid
        const map = L.map(mapContainerRef.current, {
          center: [23.6102, 85.2799],
          zoom: 8,
          minZoom: 6,
          maxZoom: 18,
          scrollWheelZoom: true,
          zoomControl: false,
        });

        // 100% Free OpenStreetMap GIS Tile Layer
        const standardTile = L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors | Government of Jharkhand GIS Engine',
            maxZoom: 19,
          }
        );

        standardTile.addTo(map);
        tileLayerRef.current = standardTile;
        mapInstanceRef.current = map;

        // Add built-in zoom control to top-right
        L.control.zoom({ position: "topright" }).addTo(map);

        // Immediate and delayed invalidateSize to resolve Next.js dynamic sizing
        map.invalidateSize();
        setTimeout(() => {
          if (isMounted && map) {
            map.invalidateSize();
          }
        }, 150);
        setTimeout(() => {
          if (isMounted && map) {
            map.invalidateSize();
          }
        }, 450);

        renderMarkers(L, map);
      } catch (err) {
        console.error("Leaflet GIS Map failed to initialize:", err);
      }
    }

    initMap();

    const handleWindowResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener("resize", handleWindowResize);

    return () => {
      isMounted = false;
      window.removeEventListener("resize", handleWindowResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Invalidate size when fullscreen toggles
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 100);
    }
  }, [isFullscreen]);

  // Update Markers when filters or display sectors change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    async function updateMarkers() {
      const L = (await import("leaflet")).default;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
        renderMarkers(L, mapInstanceRef.current);
      }
    }
    updateMarkers();
  }, [displaySectors, selectedSector?.id]);

  // FlyTo selected sector when changed externally
  useEffect(() => {
    if (selectedSector && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(selectedSector.coordinates, 12, {
        duration: 1.2,
      });

      // Open popup of selected sector
      const marker = markersRef.current[selectedSector.id];
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedSector?.id]);

  const renderMarkers = (L: any, map: any) => {
    // Clear old markers and circles
    Object.values(markersRef.current).forEach((m: any) => m.remove());
    Object.values(circlesRef.current).forEach((c: any) => c.remove());
    markersRef.current = {};
    circlesRef.current = {};

    displaySectors.forEach((sec) => {
      const isSelected = selectedSector?.id === sec.id;
      const isHigh = sec.density === "HIGH";
      const isMed = sec.density === "MEDIUM";

      const color = isHigh ? "#dc2626" : isMed ? "#d97706" : "#059669";
      const bgColor = isHigh ? "#ef4444" : isMed ? "#f59e0b" : "#10b981";

      // Circular cluster impact radius (in meters)
      const circleRadius = isHigh ? 7500 : isMed ? 5000 : 3000;
      const clusterCircle = L.circle(sec.coordinates, {
        radius: circleRadius,
        color: color,
        fillColor: color,
        fillOpacity: isSelected ? 0.3 : 0.15,
        weight: isSelected ? 3 : 1.5,
      }).addTo(map);

      circlesRef.current[sec.id] = clusterCircle;

      // Custom guaranteed HTML Marker with explicit styles
      const customIcon = L.divIcon({
        className: "custom-gis-cluster-icon",
        html: `
          <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer; user-select: none;">
            <div style="position: absolute; inset: 2px; border-radius: 50%; border: 2px solid ${color}; opacity: ${isHigh ? 0.8 : 0.4}; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 36px; height: 36px; border-radius: 50%; background: ${bgColor}; color: #ffffff; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.4); border: 2.5px solid #ffffff; font-family: ui-monospace, SFMono-Regular, monospace; font-weight: 900; transition: transform 0.2s; ${
              isSelected ? "transform: scale(1.25); outline: 3px solid #38bdf8;" : ""
            }">
              <span style="font-size: 11px; line-height: 1; font-weight: 900;">${sec.problemsCount}</span>
              <span style="font-size: 7px; text-transform: uppercase; opacity: 0.9; line-height: 1; letter-spacing: -0.5px;">PTS</span>
            </div>
            <div style="position: absolute; bottom: 1px; right: 1px; width: 15px; height: 15px; border-radius: 50%; background: ${isHigh ? '#7f1d1d' : '#0f172a'}; color: #ffffff; border: 1.5px solid #ffffff; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 900;">
              ${isHigh ? "!" : "✓"}
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -22],
      });

      const marker = L.marker(sec.coordinates, {
        icon: customIcon,
        zIndexOffset: isSelected ? 2000 : isHigh ? 1000 : 500,
      }).addTo(map);

      // Interactive Popup Content
      const popupContent = `
        <div style="min-width: 250px; font-family: system-ui, -apple-system, sans-serif;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 800; font-family: monospace; color: #dc2626; text-transform: uppercase;">
              ${sec.publicProblemId}
            </span>
            <span style="font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 999px; background: ${color}20; color: ${color}; border: 1px solid ${color}40;">
              ${sec.density} DENSITY
            </span>
          </div>
          <h4 style="font-size: 13px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0; line-height: 1.3;">
            ${sec.name}
          </h4>
          <p style="font-size: 11px; color: #475569; margin: 0 0 8px 0; line-height: 1.4;">
            ${sec.recentIssue}
          </p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px; margin-bottom: 8px; font-size: 10px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span style="color: #64748b;">Department:</span>
              <strong style="color: #0f172a;">${sec.departmentName.split("(")[0]}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span style="color: #64748b;">Priority Score:</span>
              <strong style="color: #dc2626;">${sec.priorityScore} / 100</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">Impact Area:</span>
              <strong style="color: #0369a1;">~${sec.impactPopulation.toLocaleString()} citizens</strong>
            </div>
          </div>
          <div style="display: flex; gap: 6px;">
            <a href="/citizen/report?lat=${sec.coordinates[0]}&lng=${sec.coordinates[1]}&address=${encodeURIComponent(
        sec.address
      )}" style="flex: 1; text-align: center; background: #001c5a; color: #ffffff; text-decoration: none; font-size: 10px; font-weight: 700; padding: 5px 8px; border-radius: 6px; display: inline-block;">
              Lodge Here →
            </a>
            <a href="/track?id=${sec.publicProblemId}" style="text-align: center; background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; text-decoration: none; font-size: 10px; font-weight: 700; padding: 5px 8px; border-radius: 6px; display: inline-block;">
              Track
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 300 });

      marker.on("click", () => {
        onSelectSector(sec);
      });

      markersRef.current[sec.id] = marker;
    });
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([23.6102, 85.2799], 8, { duration: 1 });
    }
  };

  const toggleLayer = async () => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const L = (await import("leaflet")).default;

    tileLayerRef.current.remove();

    if (activeLayer === "standard") {
      // Switch to OpenStreetMap Humanitarian / Topographic free tiles
      const topoLayer = L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team',
        maxZoom: 19,
      });
      topoLayer.addTo(mapInstanceRef.current);
      tileLayerRef.current = topoLayer;
      setActiveLayer("topographic");
    } else {
      // Standard OSM
      const stdLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors | Government of Jharkhand GIS Engine',
        maxZoom: 19,
      });
      stdLayer.addTo(mapInstanceRef.current);
      tileLayerRef.current = stdLayer;
      setActiveLayer("standard");
    }
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 shadow-md ${
        isFullscreen ? "fixed inset-0 z-[99999] rounded-none h-screen" : ""
      }`}
      style={{ height: isFullscreen ? "100vh" : height }}
    >
      {/* Top Floating Map HUD */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-md border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0"></span>
          <span>Jharkhand GIS Cluster</span>
          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 ml-1">
            {displaySectors.length} Hotspots
          </span>
        </div>

        {/* Free Map API Provider Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-md border border-slate-200 dark:border-slate-700 text-[11px] font-mono font-medium text-emerald-700 dark:text-emerald-400">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>OpenStreetMap OpenGIS API (Zero API Cost)</span>
        </div>
      </div>

      {/* Floating Control Toolbar */}
      <div className="absolute top-3 right-14 z-[1000] flex items-center gap-1.5 pointer-events-auto">
        <button
          type="button"
          onClick={handleRecenter}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-md transition"
          title="Recenter Map on Jharkhand"
          aria-label="Recenter"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={toggleLayer}
          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-md transition flex items-center gap-1 text-xs font-semibold"
          title="Toggle Map Style"
        >
          <Layers className="w-3.5 h-3.5 text-gov-navy dark:text-sky-400" />
          <span className="hidden md:inline">{activeLayer === "standard" ? "Topo" : "Standard"}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-md transition"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen GIS Map"}
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Leaflet Map Target DOM */}
      <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 1 }} />

      {/* Bottom Floating Legend Bar */}
      <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-[1000] flex flex-wrap items-center gap-3 p-2.5 rounded-xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 pointer-events-auto">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Cluster Density:
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-600 animate-ping"></span>
          <span>High (Urgent)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
          <span>Low</span>
        </div>
      </div>
    </div>
  );
}
