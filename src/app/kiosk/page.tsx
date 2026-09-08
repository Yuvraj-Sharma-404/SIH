"use client";

import { useState } from "react";
import {
  Terminal,
  Mic,
  Camera,
  FileText,
  Wifi,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function KioskSimulatorPage() {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([
    "[ESP32 BOOT] Firmware v1.0.4 initialized.",
    "[WIFI] Connected to SSID: SIH_KIOSK_AP (IP: 192.168.1.104)",
    "[STANDBY] Waiting for citizen physical button press...",
  ]);
  const [lastSubmittedProblem, setLastSubmittedProblem] = useState<any | null>(null);
  const [processing, setProcessing] = useState(false);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev.slice(-8), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const triggerKioskButton = async (action: "RECORD" | "PHOTO" | "DOCUMENT") => {
    setActiveAction(action);
    setProcessing(true);
    addLog(`[GPIO INTERRUPT] Physical button pressed: ${action}`);
    addLog(`[HARDWARE] Capturing sensor buffer...`);

    let samplePayload = {
      action,
      kioskId: "ESP32-WARDHA-NODE-01",
      latitude: 20.7453,
      longitude: 78.6022,
      transcription: "",
      imageUrl: "",
    };

    if (action === "RECORD") {
      samplePayload.transcription =
        "Citizen voice input via Village Kiosk: Underground main water pipe burst near Sevagram bus stop, flooding road.";
    } else if (action === "PHOTO") {
      samplePayload.transcription =
        "Camera snapshot captured via Kiosk: Deep pothole cluster and exposed rebar on Dham River approach road.";
      samplePayload.imageUrl =
        "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80";
    } else {
      samplePayload.transcription =
        "Scanned letter via Kiosk: Gram Panchayat resolution requesting solar high-mast lighting at dark village crossroad.";
      samplePayload.imageUrl =
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80";
    }

    try {
      addLog(`[HTTP POST] Transmitting payload to /api/kiosk/submit...`);
      const res = await fetch("/api/kiosk/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(samplePayload),
      });

      const data = await res.json();
      if (data.success) {
        addLog(`[SUCCESS] Backend responded 200 OK. Problem ID: ${data.data.publicProblemId}`);
        addLog(`[AI] Priority: ${data.data.priorityScore}/100 | Dept: ${data.data.departmentName}`);
        setLastSubmittedProblem(data.data);
      } else {
        addLog(`[ERROR] Backend error: ${data.error}`);
      }
    } catch (e) {
      addLog(`[ERROR] Network failure: ${String(e)}`);
    } finally {
      setProcessing(false);
      setActiveAction(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2">
      {/* Kiosk Terminal Header */}
      <div className="gov-card p-6 bg-white border border-slate-200 gov-border-t-saffron flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-gov-saffron">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-gov-navy font-serif">
                Assisted Citizen Kiosk & Hardware Simulator
              </h1>
              <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded bg-orange-50 text-orange-900 font-bold border border-orange-200">
                PRD FR-03 & TRD Section 24 Aligned
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Provides an accessible physical 3-button input layer for citizens with limited digital literacy at Gram Panchayat terminals.
            </p>
          </div>
        </div>

        {/* Hardware Status Indicators */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>ESP32 ONLINE</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 font-semibold">
            <Wifi className="w-3.5 h-3.5" />
            <span>Wi-Fi 100%</span>
          </div>
        </div>
      </div>

      {/* The Physical 3-Button Kiosk Controller Interface */}
      <div className="gov-card p-8 rounded-2xl bg-white border-2 border-slate-300 shadow-md space-y-6 text-center">
        <div className="inline-block px-4 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold uppercase tracking-wider border border-slate-300">
          Touchscreen & Physical Push-Button Controller (GPIO 18 / 19 / 21)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          {/* Button 1: RECORD */}
          <button
            type="button"
            disabled={processing}
            onClick={() => triggerKioskButton("RECORD")}
            className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center space-y-3 transition-all transform active:scale-95 shadow-sm ${
              activeAction === "RECORD"
                ? "bg-rose-50 border-rose-500 shadow-rose-200"
                : "bg-slate-50 hover:bg-rose-50/40 border-slate-300 hover:border-rose-400 text-slate-800 hover:shadow-md"
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600">
              <Mic className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base font-extrabold text-slate-900">1. RECORD</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Voice Grievance (Speech-to-Text)</p>
            </div>
            <span className="text-[10px] font-mono text-rose-700 uppercase font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              PIN: GPIO 18
            </span>
          </button>

          {/* Button 2: PHOTO */}
          <button
            type="button"
            disabled={processing}
            onClick={() => triggerKioskButton("PHOTO")}
            className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center space-y-3 transition-all transform active:scale-95 shadow-sm ${
              activeAction === "PHOTO"
                ? "bg-blue-50 border-blue-500 shadow-blue-200"
                : "bg-slate-50 hover:bg-blue-50/40 border-slate-300 hover:border-blue-400 text-slate-800 hover:shadow-md"
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-gov-navy">
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base font-extrabold text-slate-900">2. PHOTO</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Camera Snapshot Evidence</p>
            </div>
            <span className="text-[10px] font-mono text-blue-700 uppercase font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              PIN: GPIO 19
            </span>
          </button>

          {/* Button 3: DOCUMENT */}
          <button
            type="button"
            disabled={processing}
            onClick={() => triggerKioskButton("DOCUMENT")}
            className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center space-y-3 transition-all transform active:scale-95 shadow-sm ${
              activeAction === "DOCUMENT"
                ? "bg-emerald-50 border-emerald-500 shadow-emerald-200"
                : "bg-slate-50 hover:bg-emerald-50/40 border-slate-300 hover:border-emerald-400 text-slate-800 hover:shadow-md"
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-gov-emerald">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base font-extrabold text-slate-900">3. DOCUMENT</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Scan Written Notice / Letter</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              PIN: GPIO 21
            </span>
          </button>
        </div>

        {processing && (
          <div className="flex items-center justify-center space-x-2 text-xs text-gov-navy font-mono animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Transmitting Serial Frame & Ingesting into Central Platform...</span>
          </div>
        )}
      </div>

      {/* Live Serial / Telemetry Console */}
      <div className="gov-card p-5 bg-white border border-slate-200 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-600 pb-2 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-gov-saffron" />
            <span className="font-bold text-slate-900">ESP32 UART Serial Telemetry Stream</span>
          </div>
          <span>Baud Rate: 115200</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 space-y-1 overflow-x-auto min-h-[140px]">
          {logs.map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
      </div>

      {/* Confirmation of Last Ingested Problem */}
      {lastSubmittedProblem && (
        <div className="gov-card p-6 bg-white border border-emerald-200 gov-border-t-emerald space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gov-emerald">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900 font-serif">
                Kiosk Input Processed into Central Pipeline
              </h3>
            </div>
            <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded bg-blue-50 text-gov-navy border border-blue-200">
              Registration No: {lastSubmittedProblem.publicProblemId}
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">{lastSubmittedProblem.description}</p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200">
            <span className="text-xs text-slate-600">
              Assigned Department: <strong className="text-gov-navy">{lastSubmittedProblem.departmentName}</strong>
            </span>

            <div className="flex items-center space-x-3">
              <Link
                href={`/citizen/track/${lastSubmittedProblem.publicProblemId}`}
                className="px-4 py-1.5 rounded-lg bg-gov-navy hover:bg-gov-navy-dark text-white text-xs font-bold transition flex items-center space-x-1 shadow-sm"
              >
                <span>Track Problem</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/gov/dashboard"
                className="px-4 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold hover:bg-emerald-100 transition"
              >
                <span>Verify in Govt Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Arduino Sketch Link info */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <strong className="text-slate-800">ESP32 Firmware Source: </strong>
          <span className="font-mono text-gov-navy font-semibold">hardware/esp32/kiosk_controller.ino</span>
        </div>
        <span className="text-slate-500 font-mono text-[11px]">Ready to flash via Arduino IDE / ESP-IDF</span>
      </div>
    </div>
  );
}
