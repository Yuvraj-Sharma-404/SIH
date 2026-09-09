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
    sm: "w-7 h-7 sm:w-8 sm:h-8",
    md: "w-9 h-9 xs:w-11 xs:h-11 sm:w-12 sm:h-12 md:w-14 md:h-14",
    lg: "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16",
  };

  const titleSizes = {
    sm: "text-base sm:text-lg",
    md: "text-lg xs:text-xl sm:text-2xl md:text-3xl",
    lg: "text-xl sm:text-2xl md:text-4xl",
  };

  const logoContent = (
    <div className={`flex items-center gap-2.5 sm:gap-3.5 group ${className}`}>
      {/* New Official SamadhanX Emblem Icon */}
      <div
        className={`${iconSizes[size]} relative flex-shrink-0 flex items-center justify-center p-0.5 rounded-xl bg-white border border-slate-200/80 shadow-xs transition-transform group-hover:scale-105 duration-200`}
      >
        <img
          src="/Images/samadhanx-icon.png"
          alt="SamadhanX Emblem"
          className="w-full h-full object-contain drop-shadow-xs"
        />
      </div>

      {/* Website Written Typography & Subtitle */}
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
          <p className="text-xs sm:text-[13px] font-medium italic text-slate-600 tracking-normal font-sans">
            Grievance Portal
          </p>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
