"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MapPin,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Navigation,
  Layers,
} from "lucide-react";

interface ImageLocationMapProps {
  latitude: number;
  longitude: number;
  locationName?: string;
  imagePreviewUrl?: string;
  fileName?: string;
  zoom?: number;
  height?: string;
  className?: string;
}

export default function ImageLocationMap({
  latitude,
  longitude,
  locationName,
  imagePreviewUrl,
  fileName,
  zoom = 15,
  height = "380px",
  className = "",
}: ImageLocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;

      try {
        // Dynamically import Leaflet and default icon fix
        const L = (await import("leaflet")).default;
        // @ts-ignore
        await import("leaflet-defaulticon-compatibility");

        if (!isMounted || !mapContainerRef.current) return;

        // Clean up previous instance if any
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        // Initialize Map
        const map = L.map(mapContainerRef.current, {
          center: [latitude, longitude],
          zoom: zoom,
          scrollWheelZoom: true,
          zoomControl: false, // We'll add custom positioned or built-in
        });

        // Add standard OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        // Add standard zoom control at top-right
        L.control.zoom({ position: "topright" }).addTo(map);

        // Custom pulsing marker icon
        const customHtmlIcon = L.divIcon({
          className: "custom-exif-pin",
          html: `
            <div style="
              position: relative;
              width: 36px;
              height: 36px;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <span style="
                position: absolute;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background-color: rgba(230, 81, 0, 0.35);
                animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></span>
              <div style="
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background: #e65100;
                border: 3px solid #ffffff;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ffffff;
              ">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -36],
        });

        const marker = L.marker([latitude, longitude], { icon: customHtmlIcon }).addTo(map);

        const popupContent = document.createElement("div");
        popupContent.style.minWidth = "200px";
        popupContent.style.padding = "4px";

        popupContent.innerHTML = `
          <div style="font-family: 'Inter', sans-serif;">
            <div style="display: flex; items-center; gap: 6px; margin-bottom: 6px;">
              <span style="background: #e65100; color: #fff; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
                EXIF GPS
              </span>
              ${fileName ? `<span style="font-size: 11px; color: #64748b; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px;">${fileName}</span>` : ""}
            </div>
            ${imagePreviewUrl ? `
              <div style="margin-bottom: 8px; border-radius: 6px; overflow: hidden; max-height: 100px; border: 1px solid #e2e8f0;">
                <img src="${imagePreviewUrl}" alt="EXIF Location Source" style="width: 100%; height: 90px; object-fit: cover;" />
              </div>
            ` : ""}
            <div style="font-weight: 600; font-size: 13px; color: #0f172a; line-height: 1.3; margin-bottom: 4px;">
              ${locationName || "Photo Capture Location"}
            </div>
            <div style="font-family: monospace; font-size: 11px; color: #475569; background: #f8fafc; padding: 4px 6px; border-radius: 4px; border: 1px solid #e2e8f0;">
              ${latitude.toFixed(6)}°, ${longitude.toFixed(6)}°
            </div>
          </div>
        `;

        marker.bindPopup(popupContent).openPopup();

        mapInstanceRef.current = map;
        markerRef.current = marker;
        setMapLoaded(true);
      } catch (err) {
        console.error("[ImageLocationMap] Failed to initialize Leaflet:", err);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, locationName, imagePreviewUrl, fileName, zoom]);

  // Handle re-centering when coordinates change without re-creating map
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([latitude, longitude], 16, {
        duration: 0.8,
      });
      if (markerRef.current) {
        markerRef.current.openPopup();
      }
    }
  };

  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  const osmUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-slate-300 bg-slate-100 shadow-sm transition-all ${
        isFullscreen ? "fixed inset-4 z-50 shadow-2xl" : ""
      } ${className}`}
      style={{ height: isFullscreen ? "calc(100vh - 32px)" : height }}
    >
      {/* Dynamic Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Loading Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/90 z-10">
          <div className="w-8 h-8 border-3 border-gov-navy border-t-transparent rounded-full animate-spin mb-2" />
          <span className="text-xs text-slate-600 font-medium font-mono">
            Rendering OpenStreetMap...
          </span>
        </div>
      )}

      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-xs font-semibold text-slate-700">
        <MapPin className="w-4 h-4 text-gov-saffron fill-gov-saffron/20" />
        <span className="font-mono text-[11px] text-slate-800">
          {latitude.toFixed(6)}°, {longitude.toFixed(6)}°
        </span>
      </div>

      {/* Bottom Action Controls */}
      <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs p-1.5 rounded-lg border border-slate-200 shadow-sm">
        <button
          type="button"
          onClick={handleRecenter}
          title="Re-center on detected photo location"
          className="p-1.5 text-slate-600 hover:text-gov-navy hover:bg-slate-100 rounded-md transition"
        >
          <Navigation className="w-4 h-4" />
        </button>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Open in Google Maps"
          className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:text-gov-navy hover:bg-slate-100 rounded-md transition"
        >
          <span>Google Maps</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>

        <a
          href={osmUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Open in OpenStreetMap"
          className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:text-gov-navy hover:bg-slate-100 rounded-md transition"
        >
          <span>OSM</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>

        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
          className="p-1.5 text-slate-600 hover:text-gov-navy hover:bg-slate-100 rounded-md transition"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
