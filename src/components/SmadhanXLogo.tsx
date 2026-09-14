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
    sm: "w-8 h-8 sm:w-10 sm:h-10",
    md: "w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20",
    lg: "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24",
  };

  const titleSizes = {
    sm: "text-base sm:text-lg",
    md: "text-lg xs:text-xl sm:text-2xl md:text-3xl",
    lg: "text-xl sm:text-2xl md:text-4xl",
  };

  const subtitleSizes = {
    sm: "text-[9px] sm:text-[10px]",
    md: "text-[10px] xs:text-[11px] sm:text-[12px]",
    lg: "text-xs sm:text-sm",
  };

  const logoContent = (
    <div className={`flex items-center gap-2.5 sm:gap-3.5 group ${className}`}>
      {/* Official SamadhanX Emblem Icon without box */}
      <div
        className={`${iconSizes[size]} relative flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 duration-200`}
      >
        <img
          src="/Images/samadhanx-icon.png"
          alt="SamadhanX Emblem"
          className="w-full h-full object-contain"
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
          <p className={`${subtitleSizes[size]} font-sans tracking-wide leading-tight select-none flex items-center flex-wrap gap-x-1.5 pt-0.5`}>
            <span className="text-slate-500 font-medium italic">Beyond Grievances.</span>
            <span className="font-bold tracking-tight bg-gradient-to-r from-gov-navy to-gov-saffron bg-clip-text text-transparent not-italic">
              Towards Solutions
            </span>
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
