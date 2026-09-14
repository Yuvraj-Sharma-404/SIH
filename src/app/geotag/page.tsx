"use client";

import React, { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Upload,
  Image as ImageIcon,
  Film,
  MapPin,
  Compass,
  CheckCircle2,
  AlertCircle,
  Clock,
  Globe,
  ChevronRight,
  RotateCcw,
  Loader2,
  Shield,
  Layers,
  ArrowRight,
  FileCheck,
  FileX,
  ExternalLink,
  Info,
  Sparkles,
  Search,
  Video,
  Navigation,
} from "lucide-react";
import MediaPreview from "@/components/MediaPreview";
import { MediaType } from "@/lib/geotag/types";

// Dynamically import Leaflet Map to avoid SSR errors
const ImageLocationMap = dynamic(
  () => import("@/components/ImageLocationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[380px] bg-slate-100 rounded-xl flex flex-col items-center justify-center border border-slate-300">
        <Loader2 className="w-8 h-8 text-gov-navy animate-spin mb-2" />
        <span className="text-xs text-slate-500 font-mono">Loading GIS Engine...</span>
      </div>
    ),
  }
);

export type GeotagProcessingState =
  | "idle"
  | "uploading"
  | "extractingMetadata"
  | "extractingGPS"
  | "reverseGeocoding"
  | "success"
  | "noGpsData"
  | "unsupportedFormat"
  | "error";

interface GeotagResponseData {
  hasGpsData: boolean;
  mediaType: MediaType;
  latitude?: number;
  longitude?: number;
  altitude?: number | null;
  heading?: number | null;
  capturedAt?: string | null;
  dmsLatitude?: string;
  dmsLongitude?: string;
  locationName?: string;
  city?: string | null;
  district?: string | null;
  state?: string | null;
  country?: string | null;
  source?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  duration?: number | null;
  width?: number | null;
  height?: number | null;
  message?: string;
  details?: string;
}

export default function MediaGeotagPage() {
  const [state, setState] = useState<GeotagProcessingState>("idle");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>("image");
  const [geotagData, setGeotagData] = useState<GeotagResponseData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapSectionRef = useRef<HTMLDivElement>(null);

  // Format file size nicely
  const formatBytes = (bytes?: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Format date nicely
  const formatDate = (isoStr?: string | null) => {
    if (!isoStr) return "Not recorded in metadata";
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return isoStr;
    }
  };

  // Detect media type from file
  const determineMediaType = (file: File): MediaType | null => {
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    const mime = (file.type || "").toLowerCase();

    if (
      [".jpg", ".jpeg", ".png", ".webp", ".tiff", ".heic"].includes(ext) ||
      mime.startsWith("image/")
    ) {
      return "image";
    }
    if (
      [".mp4", ".mov", ".m4v", ".3gp", ".webm"].includes(ext) ||
      mime.startsWith("video/")
    ) {
      return "video";
    }
    return null;
  };

  // Process uploaded media file
  const processMedia = useCallback(async (file: File) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setMediaFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setGeotagData(null);
    setErrorMessage(null);

    const detectedType = determineMediaType(file);
    if (!detectedType) {
      setState("unsupportedFormat");
      setErrorMessage(
        `Unsupported media format "${file.name}". Please upload an image (JPG, PNG, WebP) or video (MP4, MOV, M4V).`
      );
      return;
    }
    setMediaType(detectedType);

    // Validate size limit (15MB image, 50MB video)
    const maxLimit = detectedType === "video" ? 50 * 1024 * 1024 : 15 * 1024 * 1024;
    const maxMB = detectedType === "video" ? 50 : 15;
    if (file.size > maxLimit) {
      setState("error");
      setErrorMessage(
        `${detectedType === "video" ? "Video" : "Image"} file size (${formatBytes(file.size)}) exceeds the maximum allowed limit of ${maxMB} MB.`
      );
      return;
    }

    // Begin processing states
    setState("uploading");

    try {
      const formData = new FormData();
      formData.append("media", file);

      // State transition: extractingMetadata
      setTimeout(() => {
        setState((curr) => (curr === "uploading" ? "extractingMetadata" : curr));
      }, 300);

      // State transition: extractingGPS
      setTimeout(() => {
        setState((curr) => (curr === "extractingMetadata" ? "extractingGPS" : curr));
      }, 650);

      const response = await fetch("/api/media/geotag", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.unsupportedFormat) {
          setState("unsupportedFormat");
        } else {
          setState("error");
        }
        setErrorMessage(data.error || "Failed to extract media metadata.");
        return;
      }

      setGeotagData(data);

      if (data.hasGpsData && data.latitude !== undefined && data.longitude !== undefined) {
        // State transition: reverseGeocoding before success
        setState("reverseGeocoding");
        setTimeout(() => {
          setState("success");
        }, 350);
      } else {
        setState("noGpsData");
      }
    } catch (err: any) {
      console.error("[Geotag UI] Network error:", err);
      setState("error");
      setErrorMessage(err.message || "A network error occurred while communicating with the geotag server.");
    }
  }, [previewUrl]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processMedia(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processMedia(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setMediaFile(null);
    setPreviewUrl(null);
    setGeotagData(null);
    setErrorMessage(null);
    setState("idle");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const scrollToMap = () => {
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Helper to load sample media for immediate testing
  const loadTestSample = async (type: "image_gps" | "image_nogps" | "video_gps" | "video_nogps" | "corrupt" | "unsupported") => {
    if (type === "corrupt") {
      const blob = new Blob(["CORRUPT_BYTES_NOT_AN_IMAGE_OR_VIDEO_1234567890"], { type: "video/mp4" });
      const corruptFile = new File([blob], "corrupted-test-media.mp4", { type: "video/mp4" });
      processMedia(corruptFile);
      return;
    }

    if (type === "unsupported") {
      const blob = new Blob(["UNSUPPORTED_DATA_TEST_FILE"], { type: "application/x-msdownload" });
      const unsupportedFile = new File([blob], "binary-executable-file.exe", { type: "application/x-msdownload" });
      processMedia(unsupportedFile);
      return;
    }

    try {
      setState("uploading");
      let sampleEndpoint = "/api/images/geotag/sample";
      let sampleName = "sample.jpg";

      if (type === "image_gps") {
        sampleEndpoint = "/api/images/geotag/sample?type=gps";
        sampleName = "india-gate-geotagged.jpg";
      } else if (type === "image_nogps") {
        sampleEndpoint = "/api/images/geotag/sample?type=nogps";
        sampleName = "plain-image-no-gps.jpg";
      } else if (type === "video_gps") {
        sampleEndpoint = "/api/images/geotag/sample?type=video_gps";
        sampleName = "geotagged-video-delhi.mp4";
      } else if (type === "video_nogps") {
        sampleEndpoint = "/api/images/geotag/sample?type=video_nogps";
        sampleName = "standard-video-no-gps.mp4";
      }

      const res = await fetch(sampleEndpoint);
      if (!res.ok) throw new Error("Sample fetch failed");
      const blob = await res.blob();
      const file = new File([blob], sampleName, { type: blob.type });
      processMedia(file);
    } catch (err: any) {
      setState("error");
      setErrorMessage("Could not load sample media: " + err.message);
    }
  };

  return (
    <div className="space-y-6 py-4 max-w-[1400px] mx-auto px-4 sm:px-6">
      {/* Header & Breadcrumb */}
      <div className="gov-card p-6 bg-white border border-slate-200 gov-border-t-navy flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
            <Link href="/" className="hover:text-gov-navy transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/citizen/report" className="hover:text-gov-navy transition">
              Citizen Portal
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-gov-navy">Image & Video Geotag Extractor</span>
          </div>

          <span className="text-xs uppercase font-mono font-bold text-gov-saffron tracking-wider">
            Multimodal Geospatial Metadata Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gov-navy font-serif mt-0.5">
            Image & Video Geotag / GPS Coordinate Extractor
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            Automatically detect and extract embedded GPS location metadata from both photographs (EXIF) and videos
            (MP4, MOV, M4V, QuickTime ISO 6709). Converts coordinates into high-precision decimal degrees, performs
            reverse-geocoding, and renders interactive maps without browser geolocation.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {state !== "idle" && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Upload New Media</span>
            </button>
          )}
          <Link
            href="/citizen/report"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gov-saffron hover:bg-orange-600 rounded-lg shadow-xs transition"
          >
            <span>Lodge Grievance</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Grid: Upload & Preview (5 cols) | Location & Map (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload & Media Preview */}
        <div className="lg:col-span-5 space-y-4">
          {/* Upload Card */}
          <div className="gov-card p-6 bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-gov-navy/10 flex items-center justify-center text-gov-navy">
                  <Upload className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-gov-navy uppercase tracking-wide">
                  1. Media Upload
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                Image: 15 MB • Video: 50 MB
              </span>
            </div>

            {/* Hidden native input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,.jpg,.jpeg,.png,.webp,.mp4,.mov,.m4v,.3gp"
              onChange={handleFileInputChange}
              className="hidden"
              id="geotag-media-file-input"
            />

            {/* Drag & Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                isDragOver
                  ? "border-gov-saffron bg-gov-saffron-light/50 scale-[0.99]"
                  : "border-slate-300 hover:border-gov-navy hover:bg-slate-50"
              }`}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-gov-navy shadow-inner">
                  <Upload className="w-6 h-6 text-gov-navy" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Click to browse or drag & drop file here
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Images: JPG, PNG, WebP • Videos: MP4, MOV, M4V
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-2 px-4 py-1.5 text-xs font-bold text-white bg-gov-navy hover:bg-gov-navy-dark rounded-lg shadow-sm transition"
                >
                  + Upload Image / Video
                </button>
              </div>
            </div>

            {/* Supported Formats & Security Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              <div className="flex items-center gap-1 font-medium">
                <Shield className="w-3.5 h-3.5 text-gov-emerald" />
                <span>Zero-fabrication metadata parsing</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[10px] text-slate-600">
                <span className="px-1.5 py-0.5 bg-slate-100 rounded">JPG</span>
                <span className="px-1.5 py-0.5 bg-slate-100 rounded">PNG</span>
                <span className="px-1.5 py-0.5 bg-slate-100 rounded">MP4</span>
                <span className="px-1.5 py-0.5 bg-slate-100 rounded">MOV</span>
              </div>
            </div>

            {/* Comprehensive Quick Test Verification Bar */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                🧪 Instant Test Samples:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => loadTestSample("image_gps")}
                  className="px-2 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded transition text-center shadow-xs"
                >
                  ✓ Photo with GPS
                </button>
                <button
                  type="button"
                  onClick={() => loadTestSample("video_gps")}
                  className="px-2 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded transition text-center shadow-xs"
                >
                  ✓ Video with GPS
                </button>
                <button
                  type="button"
                  onClick={() => loadTestSample("image_nogps")}
                  className="px-2 py-1.5 bg-white hover:bg-amber-50 text-amber-800 border border-amber-300 rounded transition text-center shadow-xs"
                >
                  ∅ Photo without GPS
                </button>
                <button
                  type="button"
                  onClick={() => loadTestSample("video_nogps")}
                  className="px-2 py-1.5 bg-white hover:bg-amber-50 text-amber-800 border border-amber-300 rounded transition text-center shadow-xs"
                >
                  ∅ Video without GPS
                </button>
                <button
                  type="button"
                  onClick={() => loadTestSample("corrupt")}
                  className="px-2 py-1.5 bg-white hover:bg-rose-50 text-rose-800 border border-rose-300 rounded transition text-center shadow-xs"
                >
                  ✕ Corrupt Media
                </button>
                <button
                  type="button"
                  onClick={() => loadTestSample("unsupported")}
                  className="px-2 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded transition text-center shadow-xs"
                >
                  ✕ Unsupported File
                </button>
              </div>
            </div>
          </div>

          {/* Media Preview Card */}
          {previewUrl && (
            <div className="gov-card p-5 bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-gov-navy uppercase tracking-wide flex items-center gap-1.5">
                  {mediaType === "video" ? <Film className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                  <span>Media Preview</span>
                </span>
                {mediaFile && (
                  <span className="text-[11px] font-mono text-slate-500">
                    {formatBytes(mediaFile.size)}
                  </span>
                )}
              </div>

              {/* Responsive Media Preview Component */}
              <div className="relative">
                <MediaPreview
                  mediaType={mediaType}
                  url={previewUrl}
                  fileName={mediaFile?.name}
                  fileSize={mediaFile?.size}
                  duration={geotagData?.duration}
                  width={geotagData?.width}
                  height={geotagData?.height}
                />

                {/* Processing Overlay across all 4 in-progress states */}
                {(state === "uploading" ||
                  state === "extractingMetadata" ||
                  state === "extractingGPS" ||
                  state === "reverseGeocoding") && (
                  <div className="absolute inset-0 bg-gov-navy/85 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 rounded-xl z-20">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-400 mb-2" />
                    <span className="text-sm font-semibold">
                      {state === "uploading" && "Uploading Media..."}
                      {state === "extractingMetadata" && `Reading ${mediaType === "video" ? "MP4/QuickTime Boxes" : "EXIF Chunks"}...`}
                      {state === "extractingGPS" && "Parsing ISO 6709 & DMS Coordinates..."}
                      {state === "reverseGeocoding" && "Resolving Municipal Location..."}
                    </span>
                    <span className="text-xs text-slate-300 mt-1 font-mono">
                      {mediaType === "video" ? "Inspecting moov.udta.©xyz & ISO Base Media tags" : "Inspecting GPSLatitude, GPSLongitude & Timestamp"}
                    </span>
                  </div>
                )}
              </div>

              {/* File Info Bar */}
              {mediaFile && (
                <div className="text-[11px] text-slate-600 font-mono flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="truncate max-w-[220px]" title={mediaFile.name}>
                    {mediaFile.name}
                  </span>
                  <span className="text-slate-500 uppercase tracking-wider font-sans">
                    {mediaType}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Location Information & Map (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Location Information Card */}
          <div className="gov-card p-6 bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-gov-saffron/10 flex items-center justify-center text-gov-saffron">
                  <MapPin className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-gov-navy uppercase tracking-wide">
                  Location Information
                </h2>
              </div>

              {/* State Status Badges */}
              {state === "idle" && (
                <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-600 rounded-full border border-slate-200">
                  Ready for upload
                </span>
              )}

              {(state === "uploading" ||
                state === "extractingMetadata" ||
                state === "extractingGPS" ||
                state === "reverseGeocoding") && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>
                    {state === "uploading" && "Uploading..."}
                    {state === "extractingMetadata" && "Extracting Metadata..."}
                    {state === "extractingGPS" && "Extracting GPS..."}
                    {state === "reverseGeocoding" && "Reverse Geocoding..."}
                  </span>
                </span>
              )}

              {state === "success" && (
                <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>GPS Status: Detected</span>
                </span>
              )}

              {state === "noGpsData" && (
                <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-300">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>GPS Status: Not Available</span>
                </span>
              )}

              {state === "unsupportedFormat" && (
                <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-purple-100 text-purple-800 rounded-full border border-purple-300">
                  <FileX className="w-3.5 h-3.5 text-purple-600" />
                  <span>Unsupported Format</span>
                </span>
              )}

              {state === "error" && (
                <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-rose-100 text-rose-800 rounded-full border border-rose-300">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Processing Failed</span>
                </span>
              )}
            </div>

            {/* STATE: IDLE */}
            {state === "idle" && (
              <div className="py-10 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Compass className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-700">
                    No image or video uploaded yet
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Upload a photograph or video taken on a camera or mobile device to inspect its embedded
                    geographical coordinates and render its capture location on the map.
                  </p>
                </div>
              </div>
            )}

            {/* STATE: IN PROGRESS */}
            {(state === "uploading" ||
              state === "extractingMetadata" ||
              state === "extractingGPS" ||
              state === "reverseGeocoding") && (
              <div className="py-12 text-center space-y-4">
                <div className="relative w-14 h-14 mx-auto">
                  <div className="w-14 h-14 rounded-full border-4 border-slate-200 border-t-gov-navy animate-spin" />
                  <Compass className="w-6 h-6 text-gov-saffron absolute inset-0 m-auto" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-gov-navy">
                    {state === "uploading" && "Uploading Media Payload..."}
                    {state === "extractingMetadata" && `Scanning ${mediaType === "video" ? "Video Container Boxes" : "EXIF Metadata"}...`}
                    {state === "extractingGPS" && "Decoding Geotag Coordinates..."}
                    {state === "reverseGeocoding" && "Resolving Administrative Address..."}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {mediaType === "video" ? "Checking moov.udta.©xyz & QuickTime ISO 6709 location tags" : "Checking GPSLatitude, GPSLongitudeRef, GPSAltitude"}
                  </p>
                </div>
              </div>
            )}

            {/* STATE: SUCCESS (GPS DETECTED) */}
            {state === "success" && geotagData && (
              <div className="space-y-5 animate-fadeIn">
                {/* Verified Location Banner */}
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                        {geotagData.mediaType === "video" ? "Video Container GPS Verified" : "Image EXIF GPS Verified"}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        Location Detected
                      </h3>
                      <p className="text-xs text-slate-600">
                        {geotagData.locationName || "Valid geographical coordinates detected in media"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={scrollToMap}
                    className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-bold text-emerald-900 bg-emerald-200/80 hover:bg-emerald-300 rounded-lg transition shrink-0"
                  >
                    <span>View on Map</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Structured Coordinate & Location Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Latitude */}
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Latitude
                    </span>
                    <span className="text-base font-bold font-mono text-slate-900 block mt-0.5">
                      {geotagData.latitude?.toFixed(6)}°
                    </span>
                    {geotagData.dmsLatitude && (
                      <span className="text-[11px] text-slate-500 font-mono">
                        DMS: {geotagData.dmsLatitude}
                      </span>
                    )}
                  </div>

                  {/* Longitude */}
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Longitude
                    </span>
                    <span className="text-base font-bold font-mono text-slate-900 block mt-0.5">
                      {geotagData.longitude?.toFixed(6)}°
                    </span>
                    {geotagData.dmsLongitude && (
                      <span className="text-[11px] text-slate-500 font-mono">
                        DMS: {geotagData.dmsLongitude}
                      </span>
                    )}
                  </div>

                  {/* Resolved Address */}
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 sm:col-span-2">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Resolved Administrative Location
                    </span>
                    <span className="text-sm font-bold text-slate-900 block mt-0.5">
                      {geotagData.locationName || "Coordinates detected"}
                    </span>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[11px] text-slate-600">
                      {geotagData.city && (
                        <span>
                          <strong>City:</strong> {geotagData.city}
                        </span>
                      )}
                      {geotagData.district && (
                        <span>
                          <strong>District:</strong> {geotagData.district}
                        </span>
                      )}
                      {geotagData.state && (
                        <span>
                          <strong>State:</strong> {geotagData.state}
                        </span>
                      )}
                      {geotagData.country && (
                        <span>
                          <strong>Country:</strong> {geotagData.country}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metadata Source */}
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Source
                    </span>
                    <span className="text-xs font-bold text-gov-navy block mt-0.5">
                      {geotagData.mediaType === "video" ? "Embedded Media Metadata" : "EXIF GPS Metadata"}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {geotagData.mediaType === "video" ? "QuickTime ISO 6709 Atom" : "Exif.GPSInfo Tag"}
                    </span>
                  </div>

                  {/* Altitude, Heading, Timestamp */}
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Altitude & Timestamp
                    </span>
                    <span className="text-xs font-semibold text-slate-800 block mt-0.5 truncate">
                      {geotagData.altitude !== null && geotagData.altitude !== undefined
                        ? `${geotagData.altitude} m`
                        : "Altitude: Not recorded"}
                      {geotagData.heading !== null && geotagData.heading !== undefined && (
                        <span className="ml-2 font-mono">Heading: {geotagData.heading}°</span>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      Captured: {formatDate(geotagData.capturedAt)}
                    </span>
                  </div>
                </div>

                {/* Grievance Integration Link */}
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-gov-saffron shrink-0" />
                    <span className="text-xs text-amber-900 font-medium">
                      Lodge grievance using this verified capture location?
                    </span>
                  </div>
                  <Link
                    href={`/citizen/report?lat=${geotagData.latitude}&lng=${geotagData.longitude}&address=${encodeURIComponent(
                      geotagData.locationName || ""
                    )}`}
                    className="px-3 py-1 bg-gov-navy hover:bg-gov-navy-dark text-white rounded text-[11px] font-bold transition shadow-xs whitespace-nowrap"
                  >
                    Auto-fill Grievance Form
                  </Link>
                </div>
              </div>
            )}

            {/* STATE: NO GPS DATA */}
            {state === "noGpsData" && (
              <div className="p-6 rounded-xl bg-amber-50/70 border border-amber-200 space-y-4 animate-fadeIn">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-amber-900">
                      No GPS location data found in this {mediaType}.
                    </h3>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      The {mediaType} does not contain embedded GPS metadata. Location cannot be determined from media metadata.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-amber-200 space-y-2 text-xs text-slate-600">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-slate-500" />
                    Why might a {mediaType} lack GPS metadata?
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                    <li>Camera location / GPS recording was disabled when the {mediaType} was recorded.</li>
                    <li>The video was shared or compressed via messaging platforms (e.g. WhatsApp) which strip container metadata.</li>
                    <li>The video was re-encoded or screen-recorded by editing software.</li>
                  </ul>
                  <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 italic">
                    Privacy Guarantee: SamadhanX never fabricates coordinates or treats your upload location as the capture location.
                  </p>
                </div>
              </div>
            )}

            {/* STATE: UNSUPPORTED FORMAT */}
            {state === "unsupportedFormat" && (
              <div className="p-6 rounded-xl bg-purple-50 border border-purple-200 space-y-3 animate-fadeIn">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 border border-purple-300 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                    <FileX className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-purple-900">
                      Unsupported Media Format
                    </h3>
                    <p className="text-xs text-purple-700 mt-1">
                      {errorMessage || "The uploaded file format is not supported for metadata inspection."}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      Supported formats: <strong>Images</strong> (JPG, JPEG, PNG, WebP) and <strong>Videos</strong> (MP4, MOV, M4V).
                    </p>
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold transition"
                  >
                    Try Supported File
                  </button>
                </div>
              </div>
            )}

            {/* STATE: ERROR / CORRUPT */}
            {state === "error" && (
              <div className="p-6 rounded-xl bg-rose-50 border border-rose-200 space-y-3 animate-fadeIn">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 border border-rose-300 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-rose-900">
                      Processing Error
                    </h3>
                    <p className="text-xs text-rose-700 mt-1">
                      {errorMessage || "An unexpected error occurred while inspecting the media file."}
                    </p>
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition"
                  >
                    Try Another File
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Map Section */}
          <div ref={mapSectionRef} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gov-navy" />
                <h3 className="text-sm font-bold text-gov-navy">
                  Interactive Geospatial Map
                </h3>
              </div>
              {geotagData?.hasGpsData && (
                <span className="text-xs text-slate-500 font-mono">
                  {geotagData.latitude?.toFixed(4)}°, {geotagData.longitude?.toFixed(4)}°
                </span>
              )}
            </div>

            {state === "success" && geotagData?.latitude !== undefined && geotagData?.longitude !== undefined ? (
              <ImageLocationMap
                latitude={geotagData.latitude}
                longitude={geotagData.longitude}
                locationName={geotagData.locationName}
                imagePreviewUrl={mediaType === "image" ? previewUrl || undefined : undefined}
                fileName={mediaFile?.name}
                height="400px"
              />
            ) : (
              <div className="h-[280px] rounded-xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center p-6 text-center space-y-2">
                <Compass className="w-8 h-8 text-slate-300" />
                <p className="text-xs font-semibold text-slate-500">
                  Interactive map will activate when GPS coordinates are detected from media metadata.
                </p>
                <p className="text-[11px] text-slate-400 max-w-sm">
                  The map displays the exact coordinates where the image or video was recorded.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
