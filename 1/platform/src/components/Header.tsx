'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldAlert, 
  MapPin, 
  Search, 
  Globe, 
  Award, 
  Layers, 
  UserCheck, 
  Monitor, 
  PhoneCall, 
  Type, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState('HI');
  const [fontSize, setFontSize] = useState('normal'); // 'small' | 'normal' | 'large'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const languages = [
    { code: 'EN', label: 'English' },
    { code: 'HI', label: 'हिन्दी (Hindi)' },
    { code: 'NGP', label: 'नागपुरी (Nagpuri)' },
    { code: 'SNT', label: 'संथाली (Santhali)' },
    { code: 'BN', label: 'বাংলা (Bengali)' },
  ];

  const navItems = [
    { label: 'Citizen Home', path: '/', icon: ShieldAlert },
    { label: 'Track My Report', path: '/track', icon: Search },
    { label: 'Nearby Problems', path: '/nearby', icon: MapPin },
    { label: 'Co-Solve Challenges', path: '/challenges', icon: Award },
    { label: 'Authority Portal', path: '/authority', icon: Layers },
    { label: 'Hardware Kiosk', path: '/kiosk', icon: Monitor, highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Tricolor Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>

      {/* Top Utility Accessibility Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-8 flex flex-wrap justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1 font-medium text-orange-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Govt. Digital Grievance Public Portal (SIH-43 Prototype)
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:flex items-center gap-1 text-slate-300">
            <PhoneCall className="w-3 h-3 text-emerald-400" /> Helpline: 1800-345-6543 (Toll Free)
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Font Size Adjuster */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded text-xs border border-slate-700">
            <Type className="w-3 h-3 text-slate-400 mr-1" />
            <button 
              onClick={() => setFontSize('small')} 
              className={`px-1 rounded hover:bg-slate-700 ${fontSize === 'small' ? 'text-orange-400 font-bold' : 'text-slate-300'}`}
              title="Decrease Font Size"
            >
              A-
            </button>
            <button 
              onClick={() => setFontSize('normal')} 
              className={`px-1 rounded hover:bg-slate-700 ${fontSize === 'normal' ? 'text-orange-400 font-bold' : 'text-slate-300'}`}
              title="Default Font Size"
            >
              A
            </button>
            <button 
              onClick={() => setFontSize('large')} 
              className={`px-1 rounded hover:bg-slate-700 ${fontSize === 'large' ? 'text-orange-400 font-bold' : 'text-slate-300'}`}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-100">
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Government Branding Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3.5 group">
          {/* Simulated Ashoka Emblem / Govt Emblem */}
          <div className="w-12 h-12 bg-blue-900 text-amber-400 rounded-full flex items-center justify-center font-bold text-xl border-2 border-amber-400 shadow-md group-hover:scale-105 transition-transform">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
                CPGRAMS <span className="text-blue-700 font-extrabold">SAMADHAN</span>
              </h1>
              <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-200">
                SIH 2026
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Citizen Grievance & Collaborative Public Problem Platform • Govt. of Jharkhand
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  item.highlight
                    ? 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 shadow-xs'
                    : isActive
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-blue-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${item.highlight ? 'text-amber-600' : isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-slate-50 px-4 py-3 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-base font-medium ${
                  isActive ? 'bg-blue-900 text-white' : 'text-slate-800 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
