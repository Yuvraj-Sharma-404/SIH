"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Mic,
  MicOff,
  Square,
  MapPin,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Shield,
  Loader2,
  FileText,
  AlertCircle,
  HelpCircle,
  Camera,
  Video,
  Music,
  Globe,
  X,
  Phone,
  User,
  AlertTriangle,
  Volume2,
  RotateCcw,
  Sparkle,
} from "lucide-react";
import Link from "next/link";

export default function CitizenReportPage() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [reporterPhone, setReporterPhone] = useState("");
  const [latitude, setLatitude] = useState<number | null>(20.7453);
  const [longitude, setLongitude] = useState<number | null>(78.6022);
  const [address, setAddress] = useState("");
  const [evidenceType, setEvidenceType] = useState<"IMAGE" | "VIDEO" | "DOCUMENT" | "AUDIO">("IMAGE");
  const [evidenceUrl, setEvidenceUrl] = useState(
    "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80"
  );

  // Audio Recording State with Real Multilingual Web Speech API (English & Hindi)
  const [voiceLang, setVoiceLang] = useState<"en" | "hi">("en");
  const [isRecording, setIsRecording] = useState(false);
  const [audioTranscript, setAudioTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const isExplicitStopRef = useRef(false);
  const baseTranscriptRef = useRef("");
  const sessionFinalRef = useRef("");

  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationErrorBanner, setValidationErrorBanner] = useState<string | null>(null);

  // Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Loading & Submission State
  const [loading, setLoading] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<any | null>(null);

  // Clean up speech recognition on unmount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSpeechSupported(false);
      }
    }
    return () => {
      isExplicitStopRef.current = true;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // Continuous, unlimited speech recognition loop
  const initAndStartRecognition = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      setSpeechError(
        "Voice speech recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari."
      );
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = voiceLang === "hi" ? "hi-IN" : "en-IN";
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let currentFinal = "";
        let currentInterim = "";

        for (let i = 0; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            currentFinal += item[0].transcript + " ";
          } else {
            currentInterim += item[0].transcript;
          }
        }

        sessionFinalRef.current = currentFinal.trim();
        setInterimTranscript(currentInterim);

        const combinedParts = [
          baseTranscriptRef.current,
          sessionFinalRef.current,
          currentInterim.trim(),
        ].filter(Boolean);

        const fullCombined = combinedParts.join(" ").replace(/\s+/g, " ").trim();

        if (fullCombined) {
          setAudioTranscript(fullCombined);
          setDescription(fullCombined);
          setErrors((prev) => {
            const next = { ...prev };
            delete next.description;
            return next;
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition event:", event.error);
        if (event.error === "not-allowed" || event.error === "permission-denied") {
          isExplicitStopRef.current = true;
          setSpeechError(
            "Microphone permission was denied. Please click the camera/mic lock icon in your browser address bar and allow Microphone access."
          );
          setIsRecording(false);
        } else if (event.error === "no-speech") {
          // Natural speech pause between sentences - DO NOT STOP! Keep listening.
        } else if (event.error === "network") {
          setSpeechError("Network error with speech recognition service. You can also type or use sample audio.");
        } else {
          setSpeechError(`Speech recognition note: ${event.error}`);
        }
      };

      recognition.onend = () => {
        // Fold finalized chunk into base transcript
        if (sessionFinalRef.current) {
          baseTranscriptRef.current = [
            baseTranscriptRef.current,
            sessionFinalRef.current,
          ]
            .filter(Boolean)
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();
          sessionFinalRef.current = "";
        }
        setInterimTranscript("");

        // Auto-restart if user has not clicked Stop Recording (truly unlimited recording)
        if (!isExplicitStopRef.current) {
          setTimeout(() => {
            if (!isExplicitStopRef.current) {
              try {
                initAndStartRecognition();
              } catch (e) {
                console.warn("Speech recognition restart retry:", e);
              }
            }
          }, 150);
          return;
        }

        setIsRecording(false);
      };

      recognition.start();
    } catch (err: any) {
      console.error("Speech recognition start failed:", err);
      if (!isExplicitStopRef.current) {
        setSpeechError(err.message || "Could not start microphone. Please check permissions.");
      }
      setIsRecording(false);
    }
  };

  const startRecording = () => {
    setSpeechError(null);
    isExplicitStopRef.current = false;
    sessionFinalRef.current = "";
    baseTranscriptRef.current = description.trim();
    initAndStartRecognition();
  };

  const stopRecording = () => {
    isExplicitStopRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
    if (sessionFinalRef.current) {
      baseTranscriptRef.current = [
        baseTranscriptRef.current,
        sessionFinalRef.current,
      ]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      sessionFinalRef.current = "";
    }
    setIsRecording(false);
    setInterimTranscript("");
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Fallback demo speech simulation for testing without mic or unsupported browsers
  const handleSampleAudio = () => {
    let sampleAudio = "";

    if (voiceLang === "hi") {
      sampleAudio =
        "वर्धा और सेवाग्राम को जोड़ने वाले मुख्य पुल के पिलर नंबर 3 में गहरी दरारें आ गई हैं। नदी के पानी से नीचे की नींव कट रही है और स्कूल बसें निकलते समय पुल कांपता है।";
    } else {
      sampleAudio =
        "The main bridge connecting Wardha and Sevagram has severe vertical cracks on pier number 3. Water scour has eroded the foundation. School buses shake heavily during crossing.";
    }

    setAudioTranscript(sampleAudio);
    setDescription(sampleAudio);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.description;
      return next;
    });
    setSpeechError(null);
  };

  const clearVoiceInput = () => {
    stopRecording();
    baseTranscriptRef.current = "";
    sessionFinalRef.current = "";
    setAudioTranscript("");
    setInterimTranscript("");
    if (description === audioTranscript) {
      setDescription("");
    }
  };

  // Helper to validate all required fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Grievance Title / Subject is required.";
    }

    const effectiveDesc = description.trim() || audioTranscript.trim();
    if (!effectiveDesc) {
      newErrors.description = "Description of the issue is required (or record a voice note).";
    }

    if (!address.trim()) {
      newErrors.address = "Location / Village / District Landmark is required (or click GPS).";
    }

    const cleanPhone = reporterPhone.trim().replace(/[\s-]/g, "");
    if (!cleanPhone) {
      newErrors.reporterPhone = "Mobile number is required for SMS tracking updates.";
    } else if (!/^[6-9]\d{9}$/.test(cleanPhone) && !/^\d{10}$/.test(cleanPhone)) {
      newErrors.reporterPhone = "Please enter a valid 10-digit mobile number (e.g., 9823012345).";
    }

    return newErrors;
  };

  // Step 1: Citizen initiates form submission -> run validation & trigger confirmation modal
  const handleInitiateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setValidationErrorBanner("Please complete all required fields before submitting your grievance.");
      // Scroll to first error smoothly
      window.scrollTo({ top: 180, behavior: "smooth" });
      return;
    }

    // Clear any previous error states and open confirmation popup
    setErrors({});
    setValidationErrorBanner(null);
    setShowConfirmModal(true);
  };

  // Step 2: Citizen confirms in modal -> execute final submission
  const handleFinalSubmit = async () => {
    setLoading(true);

    const finalTitle = title.trim() || (audioTranscript ? `Voice Grievance (${voiceLang.toUpperCase()})` : "Civic Grievance Report");
    const finalDescription = description.trim() || audioTranscript || "Reported via citizen portal with attached media evidence and location pin.";

    try {
      const res = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: finalTitle,
          description: finalDescription,
          reporterName: reporterName.trim() || undefined,
          reporterPhone: reporterPhone.trim() || undefined,
          latitude,
          longitude,
          address: address.trim() || undefined,
          evidenceType,
          evidenceUrl: evidenceUrl.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowConfirmModal(false);
        setSubmittedResult(data);
      } else {
        alert(data.error || "Submission failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting complaint. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-2">
      {/* Header */}
      <div className="gov-card p-6 bg-white border border-slate-200 gov-border-t-saffron space-y-2">
        <span className="text-xs uppercase font-mono font-bold text-gov-saffron">
          Citizen Public Grievance Portal
        </span>
        <h1 className="text-2xl font-bold text-gov-navy font-serif">
          Lodge a Societal Problem or Complaint
        </h1>
        <p className="text-xs text-slate-600">
          Submissions are acknowledged under SmadhanX standards, auto-prioritized by our AI engine, and published as collaborative challenges if departmental R&D is required.
        </p>
      </div>

      {!submittedResult ? (
        <form onSubmit={handleInitiateSubmit} noValidate className="space-y-6">
          {/* Validation Error Banner */}
          {validationErrorBanner && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-900 space-y-1.5 text-xs animate-in fade-in duration-200">
              <div className="flex items-center space-x-2 font-bold text-red-800">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{validationErrorBanner}</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-red-700 pl-6 space-y-0.5">
                {Object.values(errors).map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Multimodal Voice Input Assistant */}
          <div className="gov-card p-5 bg-white border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Mic className="w-4 h-4 text-gov-saffron" />
                  <span>Assisted Voice Input (बोलकर शिकायत दर्ज करें)</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  Select your preferred language and speak clearly. Real-time audio is transcribed directly into your complaint.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceLang("en");
                      if (isRecording) {
                        stopRecording();
                      }
                    }}
                    className={`px-3 py-1 rounded font-medium transition ${
                      voiceLang === "en" ? "bg-gov-navy text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceLang("hi");
                      if (isRecording) {
                        stopRecording();
                      }
                    }}
                    className={`px-3 py-1 rounded font-medium transition font-devanagari ${
                      voiceLang === "hi" ? "bg-gov-navy text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    हिंदी
                  </button>
                </div>

                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 shadow-sm whitespace-nowrap ${
                    isRecording
                      ? "bg-red-600 text-white animate-pulse shadow-red-200 ring-2 ring-red-400"
                      : "bg-orange-50 text-gov-saffron border border-orange-200 hover:bg-orange-100"
                  }`}
                >
                  {isRecording ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Stop Recording</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5" />
                      <span>Record Voice</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Live Recording Sound Wave Visualizer & Status */}
            {isRecording && (
              <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-200 flex items-center justify-between gap-3 animate-in fade-in duration-200">
                <div className="flex items-center space-x-3">
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
                    <span className="absolute w-full h-full rounded-full bg-red-400 animate-ping opacity-40"></span>
                    <Volume2 className="w-4 h-4 text-red-600 z-10" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                      <span>Listening... Speak into microphone</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-red-200 text-red-800">
                        {voiceLang === "hi" ? "Hindi (हिंदी)" : "English (India)"}
                      </span>
                    </p>
                    <p className="text-[11px] text-red-700">
                      {interimTranscript ? `"${interimTranscript}"` : "Say grievance details, location, and issue..."}
                    </p>
                  </div>
                </div>

                {/* Animated Equalizer Waves */}
                <div className="flex items-end space-x-1 h-6 px-2">
                  <div className="w-1 bg-red-500 rounded-full animate-[bounce_0.6s_infinite_100ms] h-4"></div>
                  <div className="w-1 bg-red-600 rounded-full animate-[bounce_0.8s_infinite_200ms] h-6"></div>
                  <div className="w-1 bg-red-500 rounded-full animate-[bounce_0.5s_infinite_300ms] h-3"></div>
                  <div className="w-1 bg-red-600 rounded-full animate-[bounce_0.7s_infinite_150ms] h-5"></div>
                  <div className="w-1 bg-red-500 rounded-full animate-[bounce_0.6s_infinite_250ms] h-4"></div>
                </div>
              </div>
            )}

            {/* Speech Error Banner with Quick Action */}
            {speechError && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>{speechError}</span>
                </div>
                <button
                  type="button"
                  onClick={handleSampleAudio}
                  className="px-3 py-1 rounded bg-amber-200/80 hover:bg-amber-300 text-amber-900 font-semibold text-[11px] whitespace-nowrap transition"
                >
                  Load Sample Voice Audio
                </button>
              </div>
            )}

            {/* Speech-to-Text Transcribed Result Bar */}
            {audioTranscript && (
              <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200 text-xs text-orange-950 flex items-start justify-between gap-2">
                <div className="flex items-start space-x-2.5">
                  <Sparkles className="w-4 h-4 text-gov-saffron flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">Speech-to-Text Live Transcript:</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        Transcribed
                      </span>
                    </div>
                    <p className="text-slate-800 leading-relaxed italic">"{audioTranscript}"</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={clearVoiceInput}
                    title="Clear Voice Input"
                    className="p-1 rounded text-slate-500 hover:text-red-600 hover:bg-red-50 transition text-[11px] flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Demo Test Option */}
            {!audioTranscript && !isRecording && (
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span>Microphone not connected? You can test with a sample voice note:</span>
                <button
                  type="button"
                  onClick={handleSampleAudio}
                  className="text-gov-navy hover:text-gov-saffron font-semibold underline underline-offset-2 transition"
                >
                  Insert Sample Voice Grievance ({voiceLang === "hi" ? "हिंदी" : "English"})
                </button>
              </div>
            )}
          </div>

          {/* Core Grievance Fields */}
          <div className="gov-card p-6 bg-white border border-slate-200 space-y-4">
            {/* Title / Subject (Mandatory) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Grievance Title / Subject <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.title;
                      return next;
                    });
                  }
                }}
                placeholder="e.g. Critical Pier Crack on Dham River Bridge"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-xs font-medium focus:outline-none transition ${
                  errors.title
                    ? "border-red-500 ring-1 ring-red-500 bg-red-50/20"
                    : "border-slate-300 focus:border-gov-navy focus:ring-1 focus:ring-gov-navy"
                }`}
              />
              {errors.title && (
                <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>{errors.title}</span>
                </p>
              )}
            </div>

            {/* Description (Mandatory) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Description of the Issue & Impact <span className="text-red-500 font-bold">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.description;
                      return next;
                    });
                  }
                }}
                placeholder="Describe the issue in detail or record a voice note above..."
                className={`w-full px-3.5 py-2.5 rounded-lg border text-xs focus:outline-none transition ${
                  errors.description
                    ? "border-red-500 ring-1 ring-red-500 bg-red-50/20"
                    : "border-slate-300 focus:border-gov-navy focus:ring-1 focus:ring-gov-navy"
                }`}
              />
              {errors.description && (
                <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>{errors.description}</span>
                </p>
              )}
            </div>

            {/* Location & Evidence Photo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              {/* Location (Mandatory) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Location / Village / District Landmark <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="flex space-x-1.5">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.address;
                          return next;
                        });
                      }
                    }}
                    placeholder="e.g. Wardha, Maharashtra or use GPS"
                    className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none transition ${
                      errors.address
                        ? "border-red-500 ring-1 ring-red-500 bg-red-50/20"
                        : "border-slate-300 focus:border-gov-navy"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAddress("Wardha, Maharashtra (GPS Detected)");
                      setLatitude(20.7453);
                      setLongitude(78.6022);
                      if (errors.address) {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.address;
                          return next;
                        });
                      }
                    }}
                    className="px-2.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[11px] font-semibold text-slate-700 flex items-center space-x-1 whitespace-nowrap transition"
                  >
                    <MapPin className="w-3.5 h-3.5 text-gov-navy" />
                    <span>GPS</span>
                  </button>
                </div>
                {errors.address && (
                  <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{errors.address}</span>
                  </p>
                )}
              </div>

              {/* Evidence Media Attachment (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Evidence Media Attachment (Optional)
                </label>
                <div className="flex items-center space-x-1 mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEvidenceType("IMAGE");
                      setEvidenceUrl("https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80");
                    }}
                    className={`flex items-center space-x-1 px-2 py-1 rounded text-[11px] font-semibold transition ${
                      evidenceType === "IMAGE" ? "bg-gov-navy text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Camera className="w-3 h-3" />
                    <span>Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEvidenceType("VIDEO");
                      setEvidenceUrl("https://assets.mixkit.co/videos/preview/mixkit-traffic-crossing-a-bridge-under-the-sun-41553-large.mp4");
                    }}
                    className={`flex items-center space-x-1 px-2 py-1 rounded text-[11px] font-semibold transition ${
                      evidenceType === "VIDEO" ? "bg-gov-navy text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Video className="w-3 h-3" />
                    <span>Video</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEvidenceType("DOCUMENT");
                      setEvidenceUrl("https://smadhanx.gov.in/docs/Wardha_PWD_Structural_Inspection_Report.pdf");
                    }}
                    className={`flex items-center space-x-1 px-2 py-1 rounded text-[11px] font-semibold transition ${
                      evidenceType === "DOCUMENT" ? "bg-gov-navy text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <FileText className="w-3 h-3" />
                    <span>Doc/PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEvidenceType("AUDIO");
                      setEvidenceUrl("https://smadhanx.gov.in/audio/citizen_voice_complaint_0912.mp3");
                    }}
                    className={`flex items-center space-x-1 px-2 py-1 rounded text-[11px] font-semibold transition ${
                      evidenceType === "AUDIO" ? "bg-gov-navy text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Music className="w-3 h-3" />
                    <span>Audio</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="https://... URL or file path (Optional)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy font-mono"
                />
              </div>
            </div>

            {/* Citizen Identity Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Complainant Name (Optional)
                </label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Ramesh Pawar"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy"
                />
              </div>

              {/* Mobile Number (Mandatory) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number (For SMS Tracking Updates) <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="tel"
                  value={reporterPhone}
                  onChange={(e) => {
                    setReporterPhone(e.target.value);
                    if (errors.reporterPhone) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.reporterPhone;
                        return next;
                      });
                    }
                  }}
                  placeholder="9823012345"
                  maxLength={10}
                  className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none font-mono transition ${
                    errors.reporterPhone
                      ? "border-red-500 ring-1 ring-red-500 bg-red-50/20"
                      : "border-slate-300 focus:border-gov-navy"
                  }`}
                />
                {errors.reporterPhone && (
                  <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{errors.reporterPhone}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-lg bg-gov-navy hover:bg-gov-navy-dark text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Submit Grievance to National Portal</span>
          </button>
        </form>
      ) : (
        /* Immediate Post-Submission Receipt Card */
        <div className="gov-card p-8 bg-white border border-slate-200 gov-border-t-emerald space-y-6">
          <div className="flex items-start justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-gov-emerald flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-gov-emerald">
                  Acknowledgment Generated
                </span>
                <h2 className="text-xl font-bold text-gov-navy font-serif">
                  Grievance Registered Successfully
                </h2>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">
                Registration / Complaint ID
              </span>
              <p className="text-lg font-mono font-extrabold text-gov-navy">
                {submittedResult.data?.publicProblemId || submittedResult.data?.id}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Category</span>
              <p className="font-bold text-slate-900 mt-0.5">{submittedResult.data?.category || "Infrastructure"}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Priority Index</span>
              <p className="font-bold text-gov-saffron font-mono mt-0.5">
                {submittedResult.data?.priorityScore || 85} / 100
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Status</span>
              <p className="font-bold text-blue-800 font-mono mt-0.5">{submittedResult.data?.status || "UNDER_REVIEW"}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Nodal Dept</span>
              <p className="font-bold text-slate-900 mt-0.5 truncate">
                {submittedResult.data?.departmentName || "Public Works Department (PWD)"}
              </p>
            </div>
          </div>

          {submittedResult.duplicatesFound && (
            <div className="p-3.5 rounded-lg bg-orange-50 border border-orange-200 text-xs text-orange-950 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-gov-saffron flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Corroborating Reports Detected: </span>
                <span>
                  Our AI engine identified related nearby submissions. These have been grouped together to accelerate departmental action without creating duplicate tickets.
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                setSubmittedResult(null);
                setTitle("");
                setDescription("");
                setAudioTranscript("");
                setReporterName("");
                setReporterPhone("");
                setAddress("");
              }}
              className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Lodge Another Grievance
            </button>

            <Link
              href={`/track?id=${submittedResult.data?.publicProblemId || submittedResult.data?.id}`}
              className="px-5 py-2 rounded-lg bg-gov-navy hover:bg-gov-navy-dark text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
            >
              <span>View Full SmadhanX Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Confirmation & Final Verification Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-50/80 flex items-start justify-between rounded-t-2xl">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gov-navy text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                  <Shield className="w-5 h-5 text-gov-saffron" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gov-navy font-serif">
                    Review Your Information
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Please check your grievance details and credentials carefully before submitting. Once submitted, the information will be sent to the National Portal.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={loading}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/60 transition disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content / Summary Data */}
            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {/* Title */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                    Grievance Subject / Title
                  </span>
                  <p className="text-sm font-bold text-gov-navy mt-0.5">{title}</p>
                </div>

                {/* Description */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                    Problem Description & Impact
                  </span>
                  <p className="text-slate-800 mt-0.5 whitespace-pre-wrap leading-relaxed">
                    {description || audioTranscript}
                  </p>
                </div>

                {/* Location & Contact Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gov-saffron flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Location / Landmark
                      </span>
                      <p className="font-semibold text-slate-900">{address}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Phone className="w-4 h-4 text-gov-saffron flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Contact Mobile (For SMS)
                      </span>
                      <p className="font-semibold font-mono text-slate-900">{reporterPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Citizen Name & Method */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  <div className="flex items-start space-x-2">
                    <User className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Complainant Name
                      </span>
                      <p className="font-medium text-slate-700">
                        {reporterName.trim() ? reporterName : <span className="italic text-slate-400">Anonymous (Optional)</span>}
                      </p>
                    </div>
                  </div>
                </div>



                {/* Evidence */}
                {evidenceUrl && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Evidence Media ({evidenceType})
                    </span>
                    <p className="font-mono text-[11px] text-slate-600 truncate mt-0.5">{evidenceUrl}</p>
                  </div>
                )}
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span>
                  By confirming, you certify that the provided information is true to the best of your knowledge and will be dispatched to the national grievance pipeline.
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
              >
                Go Back / Edit
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gov-navy hover:bg-gov-navy-dark text-white text-xs font-bold transition flex items-center justify-center space-x-2 shadow-sm disabled:opacity-75"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting to National Portal...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-gov-saffron" />
                    <span>Confirm & Submit</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
