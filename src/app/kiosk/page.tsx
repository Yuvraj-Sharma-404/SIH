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
  Download,
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
    <div className="max-w-4xl mx-auto space-y-8 py-4 animate-fade-in">
      {/* Kiosk Terminal Header */}
      <div className="glass-panel p-6 rounded-2xl border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">
                Assisted Citizen Kiosk & IoT Simulator
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                Hardware Input Layer
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Demonstrates physical 3-button terminal interface designed for low-digital-literacy rural citizens.
            </p>
          </div>
        </div>

        {/* Hardware Status Indicators */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>ESP32 ONLINE</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <Wifi className="w-3.5 h-3.5" />
            <span>Wi-Fi 100%</span>
          </div>
        </div>
      </div>

      {/* The Physical 3-Button Kiosk Controller Interface */}
      <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-slate-700 shadow-2xl space-y-6 text-center">
        <div className="inline-block px-4 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-mono uppercase tracking-widest border border-slate-700">
          Physical Push-Button Simulation (GPIO 18 / 19 / 21)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          {/* Button 1: RECORD */}
          <button
            type="button"
            disabled={processing}
            onClick={() => triggerKioskButton("RECORD")}
            className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center space-y-3 transition-all transform active:scale-95 shadow-xl ${
              activeAction === "RECORD"
                ? "bg-rose-500/30 border-rose-400 shadow-rose-500/40"
                : "bg-slate-800/80 hover:bg-slate-800 border-rose-500/40 hover:border-rose-400 text-rose-400 hover:shadow-rose-500/20"
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Mic className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base font-extrabold text-white">RECORD</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Voice Grievance</p>
            </div>
            <span className="text-[10px] font-mono text-rose-400 uppercase font-semibold">
              PIN: GPIO 18
            </span>
          </button>

          {/* Button 2: PHOTO */}
          <button
            type="button"
            disabled={processing}
            onClick={() => triggerKioskButton("PHOTO")}
            className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center space-y-3 transition-all transform active:scale-95 shadow-xl ${
              activeAction === "PHOTO"
                ? "bg-sky-500/30 border-sky-400 shadow-sky-500/40"
                : "bg-slate-800/80 hover:bg-slate-800 border-sky-500/40 hover:border-sky-400 text-sky-400 hover:shadow-sky-500/20"
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base font-extrabold text-white">PHOTO</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Capture Snapshot</p>
            </div>
            <span className="text-[10px] font-mono text-sky-400 uppercase font-semibold">
              PIN: GPIO 19
            </span>
          </button>

          {/* Button 3: DOCUMENT */}
          <button
            type="button"
            disabled={processing}
            onClick={() => triggerKioskButton("DOCUMENT")}
            className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center space-y-3 transition-all transform active:scale-95 shadow-xl ${
              activeAction === "DOCUMENT"
                ? "bg-emerald-500/30 border-emerald-400 shadow-emerald-500/40"
                : "bg-slate-800/80 hover:bg-slate-800 border-emerald-500/40 hover:border-emerald-400 text-emerald-400 hover:shadow-emerald-500/20"
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base font-extrabold text-white">DOCUMENT</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Scan Notice / Letter</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
              PIN: GPIO 21
            </span>
          </button>
        </div>

        {processing && (
          <div className="flex items-center justify-center space-x-2 text-xs text-sky-400 font-mono animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Transmitting Serial Frame & Executing Pipeline...</span>
          </div>
        )}
      </div>

      {/* Live Serial / Telemetry Console */}
      <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-rose-400" />
            <span className="font-bold text-white">ESP32 UART Serial Telemetry Stream</span>
          </div>
          <span>Baud: 115200</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono text-xs text-emerald-400 space-y-1 overflow-x-auto min-h-[140px]">
          {logs.map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
      </div>

      {/* Confirmation of Last Ingested Problem */}
      {lastSubmittedProblem && (
        <div className="glass-panel p-6 rounded-2xl border-emerald-500/40 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">
                Kiosk Input Processed into Central Pipeline
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-sky-400">
              {lastSubmittedProblem.publicProblemId}
            </span>
          </div>

          <p className="text-xs text-slate-300">{lastSubmittedProblem.description}</p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800">
            <span className="text-xs text-slate-400">
              Assigned Department: <strong className="text-white">{lastSubmittedProblem.departmentName}</strong>
            </span>

            <div className="flex items-center space-x-3">
              <Link
                href={`/citizen/track/${lastSubmittedProblem.publicProblemId}`}
                className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition flex items-center space-x-1"
              >
                <span>Track Problem</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/gov/dashboard"
                className="px-4 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 transition"
              >
                <span>Verify in Govt Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Arduino Sketch Link info */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <div>
          <strong className="text-slate-300">ESP32 Firmware Location: </strong>
          <span className="font-mono text-sky-400">hardware/esp32/kiosk_controller.ino</span>
        </div>
        <span className="text-slate-500">Ready to flash via Arduino IDE / ESP-IDF</span>
      </div>
    </div>
  );
}
