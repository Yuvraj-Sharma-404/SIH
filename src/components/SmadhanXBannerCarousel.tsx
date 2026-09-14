"use client";

import React, { useState, useEffect, useCallback } from "react";
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
    src: "/Images/bannerHome/baner-cpgrams_6.jpg",
    alt: "SmadhanX Mobile App Experience",
    href: "#",
  },
  {
    id: 7,
    src: "/Images/bannerHome/baner-cpgrams_7.jpg",
    alt: "Collaborative Problem Solving & Public Participation",
    href: "/challenges",
  },
];

export default function SmadhanXBannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Aspect Ratio Container for Banner Images */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] md:aspect-[28/8] w-full overflow-hidden">
        {banners.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {slide.href && slide.href !== "#" ? (
                <Link href={slide.href} className="block w-full h-full">
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className="w-full h-full object-cover object-center"
                  />
                </Link>
              ) : (
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-full object-cover object-center"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous banner"
        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-gov-navy text-white flex items-center justify-center transition-all opacity-70 sm:opacity-0 sm:group-hover:opacity-100 shadow-md backdrop-blur-sm"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next banner"
        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-gov-navy text-white flex items-center justify-center transition-all opacity-70 sm:opacity-0 sm:group-hover:opacity-100 shadow-md backdrop-blur-sm"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Slide Indicators Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-1.5 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
        {banners.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all rounded-full ${
              currentIndex === index
                ? "w-6 h-2 bg-gov-saffron"
                : "w-2 h-2 bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
