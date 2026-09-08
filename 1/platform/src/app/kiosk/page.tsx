'use client';

import React, { useState } from 'react';
import { Video, Camera, Send, CheckCircle2, ArrowLeft, Volume2, RefreshCw, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function KioskPage() {
  const [step, setStep] = useState<'idle' | 'recording' | 'captured' | 'submitting' | 'submitted'>('idle');
  const [mediaType, setMediaType] = useState<'video' | 'photo' | null>(null);

  const handlePressButton = (btnNum: number) => {
    if (btnNum === 1) {
      setMediaType('video');
      setStep('recording');
      setTimeout(() => setStep('captured'), 3000);
    } else if (btnNum === 2) {
      setMediaType('photo');
      setStep('captured');
    } else if (btnNum === 3) {
      if (step === 'captured') {
        setStep('submitting');
        setTimeout(() => setStep('submitted'), 2500);
      }
    }
  };

  const handleReset = () => {
    setStep('idle');
    setMediaType(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-amber-500">
      
      {/* Top Kiosk Header */}
      <div className="flex justify-between items-center bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-center space-x-4">
          <Link href="/" className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl border border-slate-700 flex items-center gap-2 text-xs font-bold text-slate-200">
            <ArrowLeft className="w-5 h-5 text-amber-400" />
            <span>Exit Kiosk Mode</span>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-amber-400">
              Gram Panchayat Physical Grievance Kiosk
            </h1>
            <p className="text-xs text-slate-300">
              Location: Kanke Panchayat Office, District Ranchi • Device ID: #JH-HARDWARE-04
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-emerald-950 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Online & Audio Guided</span>
        </div>
      </div>

      {/* Center 3 Giant Hardware Buttons Container */}
      <div className="max-w-5xl mx-auto w-full my-8 space-y-8">
        
        {/* Instructions banner */}
        <div className="bg-blue-900/80 border-2 border-blue-500 rounded-2xl p-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-lg">
            <Volume2 className="w-6 h-6 animate-pulse" />
            <span>जन सहायता बटन • दबाएँ और अपनी समस्या दर्ज करें</span>
          </div>
          <p className="text-sm text-slate-200">
            No typing needed. Just press RED for video, BLUE for photo, and GREEN to submit.
          </p>
        </div>

        {/* 3 GIANT PHYSICAL BUTTONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* BUTTON 1: RED VIDEO */}
          <button
            onClick={() => handlePressButton(1)}
            disabled={step === 'recording' || step === 'submitting'}
            className={`p-8 rounded-3xl font-extrabold text-xl flex flex-col items-center justify-center gap-4 border-4 transition-all shadow-2xl active:scale-95 ${
              step === 'recording'
                ? 'bg-red-600 border-red-200 text-white animate-pulse'
                : 'bg-gradient-to-b from-red-600 to-red-900 hover:from-red-500 hover:to-red-800 border-red-400 text-white hover:scale-105'
            }`}
          >
            <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center border-4 border-white shadow-xl">
              <Video className="w-10 h-10 text-white" />
            </div>
            <span className="text-amber-300 text-xs tracking-widest uppercase font-mono">BUTTON 1</span>
            <span className="text-2xl font-black">🎥 RECORD VIDEO</span>
            <span className="text-xs text-red-100 font-normal">वीडियो रिकॉर्ड करें</span>
          </button>

          {/* BUTTON 2: BLUE PHOTO */}
          <button
            onClick={() => handlePressButton(2)}
            disabled={step === 'recording' || step === 'submitting'}
            className="p-8 rounded-3xl font-extrabold text-xl flex flex-col items-center justify-center gap-4 border-4 bg-gradient-to-b from-blue-600 to-blue-900 hover:from-blue-500 hover:to-blue-800 border-blue-400 text-white transition-all shadow-2xl hover:scale-105 active:scale-95"
          >
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center border-4 border-white shadow-xl">
              <Camera className="w-10 h-10 text-white" />
            </div>
            <span className="text-amber-300 text-xs tracking-widest uppercase font-mono">BUTTON 2</span>
            <span className="text-2xl font-black">📷 CAPTURE PHOTO</span>
            <span className="text-xs text-blue-100 font-normal">फोटो खींचें</span>
          </button>

          {/* BUTTON 3: GREEN SUBMIT */}
          <button
            onClick={() => handlePressButton(3)}
            disabled={step !== 'captured' && step !== 'submitting'}
            className={`p-8 rounded-3xl font-extrabold text-xl flex flex-col items-center justify-center gap-4 border-4 transition-all shadow-2xl active:scale-95 ${
              step === 'captured'
                ? 'bg-gradient-to-b from-emerald-500 to-emerald-800 border-emerald-200 text-white animate-bounce hover:scale-105'
                : 'bg-slate-800 border-slate-700 text-slate-500 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="w-20 h-20 rounded-full bg-emerald-700 flex items-center justify-center border-4 border-white shadow-xl">
              <Send className="w-10 h-10 text-white" />
            </div>
            <span className="text-amber-300 text-xs tracking-widest uppercase font-mono">BUTTON 3</span>
            <span className="text-2xl font-black">✅ SUBMIT NOW</span>
            <span className="text-xs text-emerald-100 font-normal">जमा करें</span>
          </button>

        </div>

        {/* SCREEN DISPLAY DISPLAY */}
        <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 font-mono text-center space-y-3 shadow-inner">
          {step === 'idle' && (
            <p className="text-slate-300 text-base">
              [KIOSK STATE]: Stand in front of device and press Button 1 or Button 2.
            </p>
          )}

          {step === 'recording' && (
            <p className="text-red-400 font-bold text-lg animate-pulse">
              ● RECORDING IN PROGRESS... Speak clearly into the microphone.
            </p>
          )}

          {step === 'captured' && (
            <p className="text-emerald-400 font-bold text-lg">
              ✓ MEDIA & GPS CAPTURED! Now press GREEN BUTTON 3 to submit to PWD Department.
            </p>
          )}

          {step === 'submitting' && (
            <p className="text-amber-400 font-bold text-lg flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Transcribing audio & dispatching complaint ticket...</span>
            </p>
          )}

          {step === 'submitted' && (
            <div className="space-y-3 py-2">
              <h3 className="text-2xl font-extrabold text-emerald-400 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-8 h-8" />
                <span>SUCCESS! Complaint Ticket #JH-2026-8942 Created.</span>
              </h3>
              <p className="text-xs text-slate-300">
                Printed physical receipt issued. Routed to Executive Engineer (PWD Ranchi Division).
              </p>
              <button onClick={handleReset} className="btn-primary text-xs py-2 px-6 mt-2">
                Reset Kiosk for Next Citizen
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 border-t border-slate-900 pt-4">
        Smart India Hackathon Problem Statement 43 • Hardware Accessibility Integration Layer
      </div>
    </div>
  );
}
