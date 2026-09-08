'use client';

import React, { useState } from 'react';
import { Video, Camera, Send, CheckCircle2, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function HardwareKioskBanner() {
  const [step, setStep] = useState<'idle' | 'recording' | 'captured' | 'submitting' | 'submitted'>('idle');
  const [activeButton, setActiveButton] = useState<number | null>(null);

  const handlePressButton = (btnNum: number) => {
    setActiveButton(btnNum);
    if (btnNum === 1) {
      // Record Video
      setStep('recording');
      setTimeout(() => setStep('captured'), 3000);
    } else if (btnNum === 2) {
      // Capture Image
      setStep('captured');
    } else if (btnNum === 3) {
      // Submit
      if (step === 'captured') {
        setStep('submitting');
        setTimeout(() => setStep('submitted'), 2500);
      }
    }
  };

  const handleReset = () => {
    setStep('idle');
    setActiveButton(null);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-amber-500/40 relative overflow-hidden my-8">
      {/* Decorative Badge */}
      <div className="absolute top-4 right-4 bg-amber-500/20 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        Accessibility Kiosk Interface (3-Button Physical Device Concept)
      </div>

      <div className="max-w-3xl">
        <h3 className="text-xl sm:text-2xl font-bold text-amber-400 flex items-center gap-2">
          <span>📟 Gram Panchayat Kiosk & Hardware Access</span>
        </h3>
        <p className="text-slate-300 text-sm mt-1 leading-relaxed">
          For citizens with low digital literacy or without smartphones. Installed at Gram Panchayat Offices, Common Service Centers (CSCs), and Bus Stands.
        </p>

        {/* The 3-Button Device Hardware Console Simulation */}
        <div className="mt-6 bg-slate-900/90 border-2 border-slate-700 rounded-xl p-5 sm:p-6 shadow-inner">
          <div className="text-xs font-mono text-slate-400 mb-3 uppercase tracking-wider flex justify-between items-center">
            <span>Physical Device Hardware Controls (Simulated)</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Kiosk #JH-RNC-04 Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* BUTTON 1: RECORD VIDEO */}
            <button
              onClick={() => handlePressButton(1)}
              disabled={step === 'recording' || step === 'submitting'}
              className={`p-4 rounded-xl font-bold text-base flex flex-col items-center justify-center gap-2 border-4 transition-all shadow-lg active:scale-95 ${
                step === 'recording'
                  ? 'bg-red-600 border-red-300 text-white animate-pulse'
                  : 'bg-red-900/80 hover:bg-red-800 border-red-500 text-white'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center border-2 border-white shadow-md">
                <Video className="w-6 h-6 text-white" />
              </div>
              <span className="text-amber-200">BUTTON 1</span>
              <span className="text-sm font-semibold">🎥 RECORD VIDEO</span>
              <span className="text-[11px] text-red-200 font-normal">Press once to record</span>
            </button>

            {/* BUTTON 2: CAPTURE IMAGE */}
            <button
              onClick={() => handlePressButton(2)}
              disabled={step === 'recording' || step === 'submitting'}
              className="p-4 rounded-xl font-bold text-base flex flex-col items-center justify-center gap-2 border-4 bg-blue-900/80 hover:bg-blue-800 border-blue-500 text-white transition-all shadow-lg active:scale-95"
            >
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center border-2 border-white shadow-md">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <span className="text-amber-200">BUTTON 2</span>
              <span className="text-sm font-semibold">📷 CAPTURE PHOTO</span>
              <span className="text-[11px] text-blue-200 font-normal">Press to snap issue</span>
            </button>

            {/* BUTTON 3: SUBMIT */}
            <button
              onClick={() => handlePressButton(3)}
              disabled={step !== 'captured' && step !== 'submitting'}
              className={`p-4 rounded-xl font-bold text-base flex flex-col items-center justify-center gap-2 border-4 transition-all shadow-lg active:scale-95 ${
                step === 'captured'
                  ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-300 text-white animate-bounce'
                  : 'bg-slate-800 border-slate-600 text-slate-400 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-emerald-700 flex items-center justify-center border-2 border-white shadow-md">
                <Send className="w-6 h-6 text-white" />
              </div>
              <span className="text-amber-200">BUTTON 3</span>
              <span className="text-sm font-semibold">✅ SUBMIT NOW</span>
              <span className="text-[11px] text-emerald-200 font-normal">Press to dispatch</span>
            </button>

          </div>

          {/* Interactive Screen Output of the Hardware Device */}
          <div className="mt-5 bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-sm">
            {step === 'idle' && (
              <div className="text-slate-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>KIOSK READY: Press Button 1 to record video or Button 2 for photo. No typing needed.</span>
              </div>
            )}

            {step === 'recording' && (
              <div className="text-red-400 flex items-center gap-2 animate-pulse">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span>[RECORDING] Audio & Video capture active (3s simulation)... Speech-to-text ready.</span>
              </div>
            )}

            {step === 'captured' && (
              <div className="text-emerald-400 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>[CAPTURED] Media & GPS Location stored. Press GREEN BUTTON 3 to Submit.</span>
                </div>
              </div>
            )}

            {step === 'submitting' && (
              <div className="text-amber-400 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                <span>[UPLOADING] Auto-extracting keywords & routing to Ranchi District PWD...</span>
              </div>
            )}

            {step === 'submitted' && (
              <div className="text-emerald-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>SUCCESS! Complaint Ticket #JH-2026-8942 Registered.</span>
                </div>
                <p className="text-xs text-slate-300">
                  SMS sent to registered mobile. Automated AI routed issue to Executive Engineer (PWD).
                </p>
                <div className="pt-2 flex gap-3">
                  <button onClick={handleReset} className="text-xs underline text-amber-400 hover:text-amber-300">
                    Test Hardware Kiosk Again
                  </button>
                  <Link href="/kiosk" className="text-xs underline text-blue-400 hover:text-blue-300">
                    Launch Full-Screen Kiosk Mode →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
