"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BannerSlide {
  id: number;
  src: string;
  alt: string;
  href?: string;
  badge?: string;
}

const banners: BannerSlide[] = [
  {
    id: 0,
    src: "/Images/bannerHome/baner-cpgrams_9.png",
    alt: "AI Powered SmadhanX - Instant Grievance Redressal Assistant",
    href: "/citizen/report",
    badge: "AI Powered Assistant",
  },
  {
    id: 1,
    src: "/Images/bannerHome/baner-cpgrams_1.jpg",
    alt: "SmadhanX National Public Grievance Redressal Portal",
    href: "/citizen/report",
  },
  {
    id: 2,
    src: "/Images/bannerHome/baner-cpgrams_2.jpg",
    alt: "Grievance Monitoring & Nodal PG Officers Network",
    href: "/nodal-officers",
  },
  {
    id: 3,
    src: "/Images/bannerHome/baner-cpgrams_3.jpg",
    alt: "Transparent 9-Stage Grievance Tracking Lifecycle",
    href: "/track",
  },
  {
    id: 4,
    src: "/Images/bannerHome/baner-cpgrams_4.jpg",
    alt: "Citizen Empowerment & Appellate Redressal System",
    href: "/appeals",
  },
  {
    id: 5,
    src: "/Images/bannerHome/baner-cpgrams_5.jpg",
    alt: "Smart Governance under DARPG Government of India",
    href: "/about",
  },
  {
    id: 6,
    src: "/Images/bannerHome/baner-cpgrams_7.jpg",
    alt: "Collaborative Problem Solving & Public Participation",
    href: "/challenges",
  },
];

export default function SmadhanXBannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch swipe handling for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      // Swiped left -> next
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> prev
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-sm sm:shadow-md border border-slate-200 dark:border-slate-800 bg-slate-900 group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 
        Native banner aspect ratio container (1347 x 446 px = ~3.02:1).
        Using explicit aspect ratio ensures 100% of the banner graphic & text is visible
        on both mobile phones and desktop PCs with ZERO cropping on any edge.
      */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "1347 / 446" }}
      >
        {banners.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {slide.href && slide.href !== "#" ? (
                <Link href={slide.href} className="block w-full h-full">
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className="w-full h-full object-contain object-center"
                    loading={index === 0 ? "eager" : "lazy"}
                    draggable={false}
                  />
                </Link>
              ) : (
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-full object-contain object-center"
                  loading={index === 0 ? "eager" : "lazy"}
                  draggable={false}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows - Sleek on desktop hover, unobtrusive on mobile */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous banner"
        className="absolute left-1.5 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-gov-navy text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-md backdrop-blur-xs cursor-pointer"
      >
        <ChevronLeft className="w-3.5 h-3.5 sm:w-6 sm:h-6" />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next banner"
        className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-gov-navy text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-md backdrop-blur-xs cursor-pointer"
      >
        <ChevronRight className="w-3.5 h-3.5 sm:w-6 sm:h-6" />
      </button>

      {/* Slide Indicators Dots - Compact & placed so they never obscure banner text */}
      <div className="absolute bottom-1.5 sm:bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-1 sm:space-x-1.5 bg-black/40 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full backdrop-blur-xs">
        {banners.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all rounded-full cursor-pointer ${
              currentIndex === index
                ? "w-3.5 sm:w-5 h-1 sm:h-1.5 bg-gov-saffron"
                : "w-1 sm:w-1.5 h-1 sm:h-1.5 bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
