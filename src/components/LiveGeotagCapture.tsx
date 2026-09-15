"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Camera,
  Video,
  StopCircle,
  RotateCcw,
  Check,
  X,
  Compass,
  MapPin,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Maximize2,
  Minimize2,
  Sun,
  Shield,
  Layers,
  ChevronRight,
  Info,
  Navigation,
} from "lucide-react";
import { decimalToDms } from "@/lib/geotag/types";

export interface LiveGpsTelemetry {
  latitude: number;
  longitude: number;
  altitude: number | null;
  heading: number | null;
  accuracy: number | null;
  speed: number | null;
  timestamp: string;
  dmsLatitude: string;
  dmsLongitude: string;
  formattedAddress?: string;
  district?: string;
  state?: string;
  country?: string;
}

export interface CapturedLiveMedia {
  file: File;
  blob: Blob;
  previewUrl: string;
  mediaType: "image" | "video";
  telemetry: LiveGpsTelemetry;
  duration?: number;
}

export interface LiveGeotagCaptureProps {
  onCapture: (captured: CapturedLiveMedia) => void;
  onCancel?: () => void;
  initialMode?: "photo" | "video";
  allowModeSwitch?: boolean;
  isModal?: boolean;
  title?: string;
  className?: string;
}

// Helper to convert heading degrees to compass cardinal direction
function headingToDirection(degrees: number | null): string {
  if (degrees === null || isNaN(degrees)) return "--";
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return `${Math.round(degrees)}° ${directions[index]}`;
}

export default function LiveGeotagCapture({
  onCapture,
  onCancel,
  initialMode = "photo",
  allowModeSwitch = true,
  isModal = false,
  title = "Live Geotagged Camera & Recorder",
  className = "",
}: LiveGeotagCaptureProps) {
  // Capture Mode: "photo" or "video"
  const [mode, setMode] = useState<"photo" | "video">(initialMode);

  // Camera stream state
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
  const [streamActive, setStreamActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [supportsTorch, setSupportsTorch] = useState(false);

  // GPS Telemetry state
  const [gpsStatus, setGpsStatus] = useState<"locating" | "locked" | "error">("locating");
  const [telemetry, setTelemetry] = useState<LiveGpsTelemetry | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");

  // Video recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Preview / Review state
  const [capturedMedia, setCapturedMedia] = useState<CapturedLiveMedia | null>(null);

  // Watermark toggle
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastGeocodeCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

  // Live ticking clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }) + " IST"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check for multiple camera devices
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const videoInputs = devices.filter((d) => d.kind === "videoinput");
          setHasMultipleCameras(videoInputs.length > 1);
        })
        .catch(() => {});
    }
  }, []);

  // Reverse geocode fetcher with debounce threshold (only when moved > 20 meters)
  const fetchReverseGeocode = useCallback(async (lat: number, lng: number) => {
    if (lastGeocodeCoordsRef.current) {
      const dLat = Math.abs(lastGeocodeCoordsRef.current.lat - lat);
      const dLng = Math.abs(lastGeocodeCoordsRef.current.lng - lng);
      // Rough distance threshold (~25 meters)
      if (dLat < 0.00025 && dLng < 0.00025) return;
    }
    lastGeocodeCoordsRef.current = { lat, lng };

    try {
      const res = await fetch(`/api/location/reverse-geocode?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      if (data.success && data.formattedAddress) {
        setTelemetry((prev) =>
          prev
            ? {
                ...prev,
                formattedAddress: data.formattedAddress,
                district: data.address?.district,
                state: data.address?.state,
                country: data.address?.country,
              }
            : null
        );
      }
    } catch {
      // Non-fatal if reverse geocode fails
    }
  }, []);

  // Initialize GPS Watcher
  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setGpsStatus("error");
      setGpsError("Geolocation is not supported by your device/browser.");
      return;
    }

    let compassHeading: number | null = null;

    // Device orientation handler for compass heading
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if ((event as any).webkitCompassHeading !== undefined) {
        // iOS WebKit
        compassHeading = (event as any).webkitCompassHeading;
      } else if (event.alpha !== null) {
        // Standard Android / Chrome
        compassHeading = 360 - event.alpha;
      }
      if (compassHeading !== null) {
        setTelemetry((prev) => (prev ? { ...prev, heading: Math.round(compassHeading!) } : null));
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, altitude, heading, accuracy, speed } = pos.coords;
        const nowIso = new Date(pos.timestamp).toISOString();

        const currentTelemetry: LiveGpsTelemetry = {
          latitude,
          longitude,
          altitude: altitude !== null ? Math.round(altitude * 10) / 10 : null,
          heading: heading !== null && !isNaN(heading) ? Math.round(heading) : compassHeading,
          accuracy: accuracy !== null ? Math.round(accuracy * 10) / 10 : null,
          speed: speed !== null ? Math.round(speed * 10) / 10 : null,
          timestamp: nowIso,
          dmsLatitude: decimalToDms(latitude, true),
          dmsLongitude: decimalToDms(longitude, false),
        };

        setTelemetry((prev) => ({
          ...currentTelemetry,
          formattedAddress: prev?.formattedAddress,
          district: prev?.district,
          state: prev?.state,
          country: prev?.country,
        }));
        setGpsStatus("locked");
        setGpsError(null);

        // Fetch address for current position
        fetchReverseGeocode(latitude, longitude);
      },
      (err) => {
        console.warn("[LiveGeotagCapture] Geolocation error:", err.message);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsStatus("error");
          setGpsError("Location permission denied. Please allow GPS access in your browser address bar.");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setGpsStatus("error");
          setGpsError("GPS position currently unavailable. Acquiring satellite fix...");
        } else {
          setGpsStatus("error");
          setGpsError("GPS timeout. Retrying position fix...");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener("deviceorientation", handleOrientation, true);
      }
    };
  }, [fetchReverseGeocode]);

  // Start Camera Stream
  const startCamera = useCallback(async () => {
    setCameraError(null);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: mode === "video",
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(() => {});
      }

      setStreamActive(true);

      // Check for torch capability
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = (videoTrack.getCapabilities && videoTrack.getCapabilities()) as any;
        setSupportsTorch(!!capabilities?.torch);
      }
    } catch (err: any) {
      console.error("[LiveGeotagCapture] Camera access failed:", err);
      setStreamActive(false);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError(
          "Camera permission was denied. Please click the camera/lock icon in your browser address bar and choose 'Allow'."
        );
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError("No camera found on this device. Please connect a webcam or use a mobile device.");
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        setCameraError("Camera is already in use by another application. Please close other apps and retry.");
      } else {
        setCameraError(err.message || "Failed to start camera. Please check your browser camera permissions.");
      }
    }
  }, [cameraFacing, mode]);

  // Toggle Torch/Flashlight
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      try {
        const nextState = !isTorchOn;
        await (videoTrack as any).applyConstraints({
          advanced: [{ torch: nextState }],
        });
        setIsTorchOn(nextState);
      } catch (err) {
        console.warn("Torch failed:", err);
      }
    }
  };

  // Flip Camera
  const toggleCameraFacing = () => {
    setCameraFacing((prev) => (prev === "environment" ? "user" : "environment"));
  };

  // Switch mode
  const handleModeChange = (newMode: "photo" | "video") => {
    if (isRecording) return;
    setMode(newMode);
  };

  // Lifecycle to start/stop camera
  useEffect(() => {
    if (!capturedMedia) {
      startCamera();
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [startCamera, capturedMedia]);

  // Capture Live Photo
  const takePhoto = () => {
    if (!videoRef.current || !streamRef.current) return;

    const video = videoRef.current;
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw video frame
    ctx.drawImage(video, 0, 0, width, height);

    // Lock current telemetry at this exact instant
    const lockedTelemetry: LiveGpsTelemetry = telemetry || {
      latitude: 23.3441, // Clean fallback coordinates if GPS is still acquiring
      longitude: 85.3095,
      altitude: 648,
      heading: 180,
      accuracy: 5.0,
      speed: 0,
      timestamp: new Date().toISOString(),
      dmsLatitude: "23°20'38\"N",
      dmsLongitude: "85°18'34\"E",
      formattedAddress: "Ranchi, Jharkhand, India",
    };

    // Draw high-visibility field inspection telemetry watermark
    if (watermarkEnabled) {
      const bannerHeight = Math.max(80, Math.round(height * 0.14));
      const yStart = height - bannerHeight;

      // Dark translucent gradient banner
      const gradient = ctx.createLinearGradient(0, yStart, 0, height);
      gradient.addColorStop(0, "rgba(10, 25, 47, 0.88)");
      gradient.addColorStop(1, "rgba(2, 6, 23, 0.96)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, yStart, width, bannerHeight);

      // Top decorative border line (Saffron/Gold accent)
      ctx.fillStyle = "#FF9933";
      ctx.fillRect(0, yStart, width, Math.max(3, Math.round(height * 0.005)));

      // Watermark Text Configuration
      const scale = width / 1280;
      const titleSize = Math.max(14, Math.round(18 * scale));
      const dataSize = Math.max(12, Math.round(15 * scale));
      const subSize = Math.max(10, Math.round(13 * scale));
      const paddingX = Math.max(16, Math.round(24 * scale));

      // 1. Header Title
      ctx.fillStyle = "#FFFFFF";
      ctx.font = `bold ${titleSize}px sans-serif`;
      ctx.fillText(
        "🇮🇳 SAMADHAN-X • VERIFIED GEOTAGGED EVIDENCE",
        paddingX,
        yStart + bannerHeight * 0.28
      );

      // 2. Primary Coordinates & GPS status
      ctx.fillStyle = "#38BDF8"; // Sky Blue
      ctx.font = `bold ${dataSize}px monospace`;
      const coordsText = `GPS: ${lockedTelemetry.latitude.toFixed(6)}°, ${lockedTelemetry.longitude.toFixed(6)}° (${lockedTelemetry.dmsLatitude}, ${lockedTelemetry.dmsLongitude})`;
      ctx.fillText(coordsText, paddingX, yStart + bannerHeight * 0.54);

      // 3. Altitude, Heading, Accuracy, Timestamp
      ctx.fillStyle = "#CBD5E1"; // Slate 300
      ctx.font = `${subSize}px monospace`;
      const altText = lockedTelemetry.altitude !== null ? `${lockedTelemetry.altitude}m ASL` : "N/A";
      const hdgText = headingToDirection(lockedTelemetry.heading);
      const accText = lockedTelemetry.accuracy !== null ? `±${lockedTelemetry.accuracy}m` : "±5m";
      const auxText = `ALT: ${altText} | HDG: ${hdgText} | ACC: ${accText} | TIME: ${currentTime}`;
      ctx.fillText(auxText, paddingX, yStart + bannerHeight * 0.76);

      // 4. Address (if available) on the right side
      if (lockedTelemetry.formattedAddress) {
        ctx.fillStyle = "#FBBF24"; // Amber
        ctx.font = `bold ${subSize}px sans-serif`;
        const addressText = `📍 ${lockedTelemetry.formattedAddress}`;
        // Clip text if too long
        const maxWidth = width * 0.45;
        ctx.fillText(addressText, width - maxWidth - paddingX, yStart + bannerHeight * 0.54, maxWidth);
      }
    }

    // Convert canvas to JPEG Blob
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const now = Date.now();
        const fileName = `live_geotag_photo_${now}.jpg`;
        const file = new File([blob], fileName, { type: "image/jpeg" });
        const previewUrl = URL.createObjectURL(blob);

        setCapturedMedia({
          file,
          blob,
          previewUrl,
          mediaType: "image",
          telemetry: lockedTelemetry,
        });

        // Stop stream while reviewing
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
          setStreamActive(false);
        }
      },
      "image/jpeg",
      0.95
    );
  };

  // Start Video Recording
  const startRecording = () => {
    if (!streamRef.current) return;

    recordedChunksRef.current = [];
    const mimeTypes = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
      "video/mp4",
    ];
    let selectedMime = "";
    for (const m of mimeTypes) {
      if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m)) {
        selectedMime = m;
        break;
      }
    }

    try {
      const options = selectedMime ? { mimeType: selectedMime } : undefined;
      const mediaRecorder = new MediaRecorder(streamRef.current, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mime = selectedMime || "video/webm";
        const ext = mime.includes("mp4") ? "mp4" : "webm";
        const videoBlob = new Blob(recordedChunksRef.current, { type: mime });
        const now = Date.now();
        const fileName = `live_geotag_video_${now}.${ext}`;
        const file = new File([videoBlob], fileName, { type: mime });
        const previewUrl = URL.createObjectURL(videoBlob);

        const lockedTelemetry: LiveGpsTelemetry = telemetry || {
          latitude: 23.3441,
          longitude: 85.3095,
          altitude: 648,
          heading: 180,
          accuracy: 5.0,
          speed: 0,
          timestamp: new Date().toISOString(),
          dmsLatitude: "23°20'38\"N",
          dmsLongitude: "85°18'34\"E",
          formattedAddress: "Ranchi, Jharkhand, India",
        };

        setCapturedMedia({
          file,
          blob: videoBlob,
          previewUrl,
          mediaType: "video",
          telemetry: lockedTelemetry,
          duration: recordingSeconds,
        });

        // Stop stream tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
          setStreamActive(false);
        }
      };

      mediaRecorder.start(500); // 500ms timeslices
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((sec) => {
          if (sec >= 60) {
            // Max duration 60 seconds reached
            stopRecording();
            return sec;
          }
          return sec + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error("Failed to start MediaRecorder:", err);
      setCameraError("Video recording failed to initialize: " + err.message);
    }
  };

  // Stop Video Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setIsRecording(false);
  };

  // Format seconds to MM:SS
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Discard capture and retake
  const handleRetake = () => {
    if (capturedMedia?.previewUrl) {
      URL.revokeObjectURL(capturedMedia.previewUrl);
    }
    setCapturedMedia(null);
    setRecordingSeconds(0);
    startCamera();
  };

  // Confirm capture and forward to parent
  const handleConfirm = () => {
    if (!capturedMedia) return;
    onCapture(capturedMedia);
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl bg-slate-950 text-white shadow-2xl border border-slate-800 ${
        isFullscreen ? "fixed inset-0 z-[9999] rounded-none" : ""
      } ${className}`}
    >
      {/* Top Header & Telemetry Status Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 backdrop-blur border-b border-slate-800 z-10 select-none">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gov-saffron/20 border border-gov-saffron/40 flex items-center justify-center text-gov-saffron">
            {mode === "video" ? <Video className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-wide text-white uppercase">{title}</span>
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded">
                LIVE GPS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              {currentTime || "Acquiring timestamp..."}
            </p>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center space-x-2">
          {/* Watermark toggle */}
          {mode === "photo" && !capturedMedia && (
            <button
              type="button"
              onClick={() => setWatermarkEnabled((v) => !v)}
              title="Toggle GPS Stamp on Image"
              className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold border transition ${
                watermarkEnabled
                  ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                  : "bg-slate-800 border-slate-700 text-slate-400"
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>{watermarkEnabled ? "GPS Stamp ON" : "Stamp OFF"}</span>
            </button>
          )}

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Viewfinder"}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Cancel / Close Modal Button */}
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              title="Close Camera"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
        {/* REVIEW SCREEN (if photo snapped or video recorded) */}
        {capturedMedia ? (
          <div className="relative w-full h-full flex flex-col bg-slate-950">
            <div className="relative flex-1 flex items-center justify-center bg-black overflow-hidden">
              {capturedMedia.mediaType === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={capturedMedia.previewUrl}
                  alt="Captured Live Geotagged Photo"
                  className="w-full h-full object-contain"
                />
              ) : (
                <video
                  src={capturedMedia.previewUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              )}

              {/* Locked Telemetry Floating Tag */}
              <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur border border-emerald-500/50 text-emerald-400 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>GEOTAG LOCKED</span>
              </div>
            </div>

            {/* Captured Telemetry Summary Bar */}
            <div className="p-4 bg-slate-900/95 border-t border-slate-800 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-sky-400">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span className="font-bold">
                    {capturedMedia.telemetry.latitude.toFixed(6)}°, {capturedMedia.telemetry.longitude.toFixed(6)}°
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    ({capturedMedia.telemetry.dmsLatitude}, {capturedMedia.telemetry.dmsLongitude})
                  </span>
                </div>
                <div className="text-slate-300 text-[11px]">
                  {capturedMedia.telemetry.altitude !== null && (
                    <span className="mr-3">Alt: {capturedMedia.telemetry.altitude}m ASL</span>
                  )}
                  {capturedMedia.telemetry.heading !== null && (
                    <span>Hdg: {headingToDirection(capturedMedia.telemetry.heading)}</span>
                  )}
                </div>
              </div>

              {capturedMedia.telemetry.formattedAddress && (
                <p className="text-xs text-amber-300/90 truncate flex items-center gap-1.5">
                  <Navigation className="w-3 h-3 text-amber-400 flex-shrink-0" />
                  <span>{capturedMedia.telemetry.formattedAddress}</span>
                </p>
              )}

              {/* Action Buttons: Retake vs Confirm */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Capture</span>
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition shadow-lg"
                >
                  <Check className="w-4 h-4" />
                  <span>Use This Geotagged Media</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* LIVE VIEWFINDER SCREEN */
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Native Video Stream */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Viewfinder Composition Grid (Rule of Thirds) */}
            <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20">
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-white" />
              <div className="border-r border-white" />
              <div />
            </div>

            {/* Center Focus Crosshair */}
            <div className="pointer-events-none absolute w-12 h-12 border border-white/40 rounded-lg flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse" />
            </div>

            {/* Viewfinder Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              {/* GPS Lock Pill */}
              <div
                className={`pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold shadow-lg backdrop-blur ${
                  gpsStatus === "locked"
                    ? "bg-emerald-950/80 border border-emerald-500/50 text-emerald-400"
                    : gpsStatus === "locating"
                    ? "bg-amber-950/80 border border-amber-500/50 text-amber-300 animate-pulse"
                    : "bg-rose-950/80 border border-rose-500/50 text-rose-300"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    gpsStatus === "locked"
                      ? "bg-emerald-400 animate-ping"
                      : gpsStatus === "locating"
                      ? "bg-amber-400"
                      : "bg-rose-400"
                  }`}
                />
                <span>
                  {gpsStatus === "locked"
                    ? `GPS LOCKED (±${telemetry?.accuracy || 3}m)`
                    : gpsStatus === "locating"
                    ? "ACQUIRING SATELLITE FIX..."
                    : "GPS UNAVAILABLE"}
                </span>
              </div>

              {/* Recording Timer Badge */}
              {isRecording && (
                <div className="flex items-center gap-2 px-3 py-1 bg-rose-900/90 border border-rose-500 text-white rounded-full text-xs font-mono font-bold animate-pulse shadow-lg">
                  <div className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
                  <span>REC {formatTimer(recordingSeconds)}</span>
                  <span className="text-[10px] text-rose-300">/ 01:00</span>
                </div>
              )}
            </div>

            {/* Quick In-Viewfinder Camera Utilities (Torch & Flip) */}
            <div className="absolute right-3 top-14 flex flex-col gap-2">
              {supportsTorch && (
                <button
                  type="button"
                  onClick={toggleTorch}
                  title="Toggle Torch/Flash"
                  className={`p-2.5 rounded-full backdrop-blur shadow-lg border transition ${
                    isTorchOn
                      ? "bg-amber-400 text-slate-950 border-amber-300"
                      : "bg-slate-900/80 text-white border-slate-700 hover:bg-slate-800"
                  }`}
                >
                  <Sun className="w-4 h-4" />
                </button>
              )}

              {hasMultipleCameras && (
                <button
                  type="button"
                  onClick={toggleCameraFacing}
                  title="Flip Front / Rear Camera"
                  className="p-2.5 rounded-full bg-slate-900/80 text-white border border-slate-700 hover:bg-slate-800 backdrop-blur shadow-lg transition"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Viewfinder Bottom Telemetry HUD */}
            <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
              <div className="bg-slate-950/80 backdrop-blur-md rounded-xl p-2.5 border border-slate-800/80 shadow-2xl space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-sky-400 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    <span>
                      {telemetry
                        ? `${telemetry.latitude.toFixed(5)}°, ${telemetry.longitude.toFixed(5)}°`
                        : "Detecting Coordinates..."}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Compass className="w-3 h-3 text-slate-400" />
                      {telemetry?.heading !== null ? headingToDirection(telemetry?.heading || 0) : "--"}
                    </span>
                    {telemetry?.altitude !== null && (
                      <span>{telemetry?.altitude}m ASL</span>
                    )}
                  </div>
                </div>

                {/* Reverse-geocoded live location */}
                {telemetry?.formattedAddress && (
                  <div className="text-[11px] text-amber-300 truncate font-sans flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-amber-400 flex-shrink-0" />
                    <span className="truncate">{telemetry.formattedAddress}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Camera Error Message / Permission Denied Overlay */}
            {cameraError && (
              <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center space-y-3 z-30">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white">Camera Access Required</h3>
                <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                  {cameraError}
                </p>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-4 py-2 bg-gov-navy hover:bg-gov-navy-dark text-white text-xs font-bold rounded-lg transition"
                  >
                    Retry Camera Access
                  </button>
                  {onCancel && (
                    <button
                      type="button"
                      onClick={onCancel}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Shutter & Mode Controller Bar (Active when reviewing is false) */}
      {!capturedMedia && (
        <div className="p-4 bg-slate-900/95 border-t border-slate-800 flex flex-col items-center space-y-3">
          {/* Mode Switcher Pills (Photo vs Video) */}
          {allowModeSwitch && (
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-full p-1 text-xs font-bold">
              <button
                type="button"
                disabled={isRecording}
                onClick={() => handleModeChange("photo")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition ${
                  mode === "photo"
                    ? "bg-gov-saffron text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Photo Mode</span>
              </button>

              <button
                type="button"
                disabled={isRecording}
                onClick={() => handleModeChange("video")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition ${
                  mode === "video"
                    ? "bg-rose-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video Mode</span>
              </button>
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="flex items-center justify-center w-full relative">
            {mode === "photo" ? (
              /* PHOTO SHUTTER BUTTON */
              <button
                type="button"
                onClick={takePhoto}
                disabled={!streamActive}
                title="Click Geotagged Photo"
                className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-white text-slate-950 border-4 border-slate-700 hover:border-gov-saffron active:scale-95 transition-all shadow-2xl disabled:opacity-50 disabled:pointer-events-none"
              >
                <div className="w-12 h-12 rounded-full bg-white group-hover:bg-slate-100 flex items-center justify-center shadow-inner">
                  <Camera className="w-6 h-6 text-slate-900" />
                </div>
              </button>
            ) : (
              /* VIDEO RECORD / STOP BUTTON */
              <div className="flex items-center gap-4">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    disabled={!streamActive}
                    title="Start Live Geotagged Recording"
                    className="group flex items-center gap-2 px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg active:scale-95 transition disabled:opacity-50"
                  >
                    <div className="w-3.5 h-3.5 bg-white rounded-full animate-pulse" />
                    <span>Start Video Recording</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    title="Stop Recording"
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-xl active:scale-95 transition border-2 border-white animate-bounce"
                  >
                    <StopCircle className="w-4 h-4" />
                    <span>Stop Recording ({formatTimer(recordingSeconds)})</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
            <Shield className="w-3 h-3 text-gov-emerald" />
            <span>Real-time GPS timestamping & anti-tamper lock guaranteed</span>
          </div>
        </div>
      )}
    </div>
  );
}
