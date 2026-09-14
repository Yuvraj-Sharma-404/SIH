"use client";

import React, { useState, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Film,
  Image as ImageIcon,
  Clock,
  Monitor,
  AlertCircle,
} from "lucide-react";
import { MediaType } from "@/lib/geotag/types";

interface MediaPreviewProps {
  mediaType: MediaType;
  url: string;
  fileName?: string;
  fileSize?: number;
  duration?: number | null;
  width?: number | null;
  height?: number | null;
  className?: string;
}

export default function MediaPreview({
  mediaType,
  url,
  fileName,
  fileSize,
  duration,
  width,
  height,
  className = "",
}: MediaPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState<number | null>(duration || null);
  const [hasError, setHasError] = useState(false);

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration || duration || null);
    }
  };

  return (
    <div className={`relative rounded-xl overflow-hidden bg-slate-900 border border-slate-300 shadow-inner ${className}`}>
      {mediaType === "video" ? (
        <div className="relative w-full aspect-video flex items-center justify-center bg-black">
          {hasError ? (
            <div className="flex flex-col items-center justify-center p-6 text-center text-slate-300 space-y-2">
              <Film className="w-10 h-10 text-slate-500 mb-1" />
              <p className="text-xs font-semibold">Video Preview Not Directly Playable</p>
              <p className="text-[11px] text-slate-400 max-w-xs">
                Metadata has been extracted. Format may require a desktop media player.
              </p>
            </div>
          ) : (
            <>
              {/* Native video element with autoplay disabled */}
              <video
                ref={videoRef}
                src={url}
                className="w-full h-full object-contain"
                playsInline
                preload="metadata"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                onError={() => setHasError(true)}
              />

              {/* Central Play/Pause Watermark Button */}
              <button
                type="button"
                onClick={handlePlayPause}
                aria-label={isPlaying ? "Pause video" : "Play video"}
                className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-gov-navy/80 hover:bg-gov-navy text-white flex items-center justify-center transition shadow-lg backdrop-blur-xs opacity-90 hover:opacity-100 hover:scale-105"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              {/* Bottom Video Controls Toolbar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5 flex items-center justify-between text-white text-xs z-10">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handlePlayPause}
                    className="p-1 hover:text-amber-400 transition"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    className="p-1 hover:text-amber-400 transition"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span className="text-[11px] font-mono text-slate-300">
                    {formatTime(currentTime)} / {formatTime(videoDuration || 0)}
                  </span>
                </div>

                {/* Video Info Badges */}
                <div className="flex items-center space-x-1.5 text-[10px] font-mono font-semibold">
                  {width && height && (
                    <span className="px-1.5 py-0.5 rounded bg-white/20 text-slate-200">
                      {width}x{height}
                    </span>
                  )}
                  <span className="px-1.5 py-0.5 rounded bg-gov-saffron text-white uppercase tracking-wider">
                    VIDEO
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        /* Image Preview Frame */
        <div className="relative w-full aspect-video flex items-center justify-center bg-slate-950 p-1">
          <img
            src={url}
            alt={fileName || "Uploaded image preview"}
            className="max-h-full max-w-full object-contain"
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-1">
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-gov-navy/90 text-white uppercase tracking-wider shadow-sm">
              IMAGE
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
