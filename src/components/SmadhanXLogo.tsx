"use client";

import React from "react";
import Link from "next/link";

interface SmadhanXLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export default function SmadhanXLogo({
  className = "",
  showText = true,
  size = "md",
  href = "/",
}: SmadhanXLogoProps) {
  const iconSizes = {
    sm: "w-9 h-9",
    md: "w-12 h-12 sm:w-14 sm:h-14",
    lg: "w-16 h-16 sm:w-18 sm:h-18",
  };

  const titleSizes = {
    sm: "text-xl",
    md: "text-2xl sm:text-3xl",
    lg: "text-3xl sm:text-4xl",
  };

  const logoContent = (
    <div className={`flex items-center gap-3 sm:gap-4 group ${className}`}>
      {/* Unique SmadhanX Minimalist Symbol */}
      <div
        className={`${iconSizes[size]} relative flex-shrink-0 flex items-center justify-center p-1 rounded-xl bg-gradient-to-b from-white to-slate-50 border border-slate-200/80 shadow-xs transition-transform group-hover:scale-105 duration-200`}
      >
        {/* Elegant Minimalist S & X Geometric Monogram */}
        <svg
          viewBox="0 0 64 64"
          className="w-full h-full drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="smx-saffron-pure" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFA033" />
              <stop offset="50%" stopColor="#FF7A00" />
              <stop offset="100%" stopColor="#E65100" />
            </linearGradient>
            <linearGradient id="smx-navy-pure" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="50%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#001C5A" />
            </linearGradient>
          </defs>

          {/* Fluid 'S' Ribbon */}
          <path
            d="M44 14 C38 9 26 9 20 14 C14 19 14 26 21 30 L43 34 C50 38 50 45 44 50 C38 55 26 55 20 50"
            stroke="url(#smx-navy-pure)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dynamic Precision 'X' Slash */}
          <path
            d="M20 14 L44 50"
            stroke="url(#smx-saffron-pure)"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Resolution Center Point */}
          <circle cx="32" cy="32" r="3" fill="#FFFFFF" stroke="#001C5A" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Website Typography & Subtitle */}
      {showText && (
        <div className="space-y-0.5">
          <div className="flex items-center">
            <h1 className={`${titleSizes[size]} font-normal tracking-wide text-gov-navy font-cursive flex items-center leading-none select-none`}>
              <span>Smadhan</span>
              <span className="text-gov-saffron ml-1">
                X
              </span>
            </h1>
          </div>
          <p className="text-xs sm:text-[12px] font-semibold text-slate-500 tracking-wider uppercase font-sans">
            Grievance Portal
          </p>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
