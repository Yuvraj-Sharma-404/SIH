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
  size = "md",
  href = "/",
}: SmadhanXLogoProps) {
  const heights = {
    sm: "h-10 sm:h-12",
    md: "h-14 sm:h-16",
    lg: "h-20 sm:h-24",
  };

  const logoContent = (
    <div className={`flex items-center group ${className}`}>
      <img
        src="/Images/samadhanx-logo.png"
        alt="SamadhanX - From Problems to Solutions"
        className={`${heights[size]} w-auto object-contain transition-transform group-hover:scale-102 duration-200 drop-shadow-xs`}
      />
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
