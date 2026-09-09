"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mic,
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
} from "lucide-react";
import Link from "next/link";

export default function CitizenReportPage() {
  const router = useRouter();

  // Form State
  const [submissionMode, setSubmissionMode] = useState<"QUICK" | "DETAILED">("QUICK");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [reporterPhone, setReporterPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [category, setCategory] = useState("");
  const [latitude, setLatitude] = useState<number | null>(20.7453);
  const [longitude, setLongitude] = useState<number | null>(78.6022);
  const [address, setAddress] = useState("Wardha, Maharashtra");
  const [evidenceType, setEvidenceType] = useState<"IMAGE" | "VIDEO" | "DOCUMENT" | "AUDIO">("IMAGE");
  const [evidenceUrl, setEvidenceUrl] = useState(
    "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80"
  );

  // Audio Recording State with Multilingual Simulation (PRD FR-06)
  const [voiceLang, setVoiceLang] = useState<"en" | "hi" | "mr">("en");
  const [isRecording, setIsRecording] = useState(false);
  const [audioTranscript, setAudioTranscript] = useState("");

  // Loading & Submission State
  const [loading, setLoading] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<any | null>(null);

  // Voice recording simulation (Supports English, Hindi, and Marathi)
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        let sampleAudio = "";
        let sampleTitle = "";

        if (voiceLang === "hi") {
          sampleAudio =
            "वर्धा और सेवाग्राम को जोड़ने वाले मुख्य पुल के पिलर नंबर 3 में गहरी दरारें आ गई हैं। नदी के पानी से नीचे की नींव कट रही है और स्कूल बसें निकलते समय पुल कांपता है।";
          sampleTitle = "धाम नदी पुल के पिलर में गंभीर दरारें और कंपन";
        } else if (voiceLang === "mr") {
          sampleAudio =
            "वर्धा आणि सेवाग्रामला जोडणाऱ्या मुख्य पुलाच्या खांब क्रमांक ३ ला मोठी उभी भेग पडली आहे. पायाची तीव्र झीज झाली असून बसेस जाताना पूल प्रचंड थरथर कापतो.";
          sampleTitle = "धाम नदी पुलाच्या खांबाला गंभीर तडे व कंपन";
        } else {
          sampleAudio =
            "The main bridge connecting Wardha and Sevagram has severe vertical cracks on pier number 3. Water scour has eroded the foundation. School buses shake heavily during crossing.";
          sampleTitle = "Severe Structural Cracks on Dham River Bridge Pier";
        }

        setAudioTranscript(sampleAudio);
        if (!title) setTitle(sampleTitle);
        if (!description) setDescription(sampleAudio);
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  // Quick Demo Presets
  const loadScenario = (type: string) => {
    if (type === "bridge") {
      setTitle("Severe Structural Pier Cracks & Vibration on Dham River Bridge");
      setDescription(
        "Severe vertical crack noticed along Pier #3 of Dham River Bridge on Sevagram Road. High vibration during school bus crossings. Immediate engineering safety inspection needed."
      );
      setCategory("Infrastructure");
      setDepartment("Public Works Department (PWD)");
      setAddress("Sevagram Road, Wardha, Maharashtra");
      setEvidenceType("IMAGE");
      setEvidenceUrl("https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80");
    } else if (type === "water") {
      setTitle("High Turbidity & Contaminated Water in Primary School Pipeline");
      setDescription(
        "Borewell drinking water pipeline in Ward 4 has high yellow silt and foul chemical odor. Over 24 primary schoolchildren hospitalized with acute diarrhea."
      );
      setCategory("Water & Sanitation");
      setDepartment("Jal Jeevan Mission / Water Supply Board");
      setAddress("Zilla Parishad School Ward 4, Wardha");
      setEvidenceType("DOCUMENT");
      setEvidenceUrl("https://cpgrams.gov.in/docs/Ward4_Water_Lab_Report.pdf");
    } else if (type === "electric") {
      setTitle("Open Sparking 11kV Transformer Next to Bus Stand");
      setDescription(
        "11kV distribution transformer fence is completely broken. Live wires hanging within hand reach of pedestrians and school children."
      );
      setCategory("Energy");
      setDepartment("State Power Distribution Corporation (DISCOM)");
      setAddress("Central Bus Station, Wardha");
      setEvidenceType("IMAGE");
      setEvidenceUrl("https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80");
    }
  };

  // Submit to Pipeline
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          evidenceUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedResult(data);
      } else {
        alert(data.error || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting complaint");
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

      {/* Visually Separated Hackathon / Testing Demo Panel */}
      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 text-amber-950 space-y-2 text-xs">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold uppercase text-[10px]">
            Demo & Testing Controls
          </span>
          <span className="text-slate-600 font-medium">Quickly load realistic test cases for evaluation:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => loadScenario("bridge")}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-amber-100 border border-amber-300 text-gov-navy font-semibold shadow-sm transition"
          >
            🌉 Dham River Bridge Cracks
          </button>
          <button
            type="button"
            onClick={() => loadScenario("water")}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-amber-100 border border-amber-300 text-gov-navy font-semibold shadow-sm transition"
          >
            🚰 Turbid Water in Ward 4
          </button>
          <button
            type="button"
            onClick={() => loadScenario("electric")}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-amber-100 border border-amber-300 text-gov-navy font-semibold shadow-sm transition"
          >
            ⚡ Open 11kV Transformer
          </button>
        </div>
      </div>

      {!submittedResult ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Submission Mode Selector (Accessible / Low Digital Literacy Mode) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs gap-2 sm:gap-3">
            <span className="font-bold text-slate-800">Submission Method:</span>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                type="button"
                onClick={() => setSubmissionMode("QUICK")}
                className={`px-3 py-2 sm:py-1.5 rounded-lg font-bold transition text-center ${
                  submissionMode === "QUICK"
                    ? "bg-gov-navy text-white shadow-sm"
                    : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-300"
                }`}
              >
                📸 1-Tap Quick Report (Photo/Voice + Pin)
              </button>
              <button
                type="button"
                onClick={() => setSubmissionMode("DETAILED")}
                className={`px-3 py-2 sm:py-1.5 rounded-lg font-bold transition text-center ${
                  submissionMode === "DETAILED"
                    ? "bg-gov-navy text-white shadow-sm"
                    : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-300"
                }`}
              >
                📝 Full Detailed Form
              </button>
            </div>
          </div>

          {/* Multimodal Voice Input Assistant */}
          <div className="gov-card p-5 bg-white border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Mic className="w-4 h-4 text-gov-saffron" />
                  <span>Assisted Voice Input (Low-Literacy Friendly - PRD FR-06)</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  Select your preferred language and speak. Audio is transcribed automatically into the complaint form.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setVoiceLang("en")}
                    className={`px-2 py-1 rounded font-medium transition ${
                      voiceLang === "en" ? "bg-gov-navy text-white" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setVoiceLang("hi")}
                    className={`px-2 py-1 rounded font-medium transition font-devanagari ${
                      voiceLang === "hi" ? "bg-gov-navy text-white" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    हिंदी
                  </button>
                  <button
                    type="button"
                    onClick={() => setVoiceLang("mr")}
                    className={`px-2 py-1 rounded font-medium transition font-devanagari ${
                      voiceLang === "mr" ? "bg-gov-navy text-white" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    मराठी
                  </button>
                </div>

                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shadow-sm whitespace-nowrap ${
                    isRecording
                      ? "bg-red-600 text-white animate-pulse"
                      : "bg-orange-50 text-gov-saffron border border-orange-200 hover:bg-orange-100"
                  }`}
                >
                  {isRecording ? (
                    <>
                      <Square className="w-3.5 h-3.5" />
                      <span>Listening... (3s)</span>
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

            {audioTranscript && (
              <div className="p-3 rounded-lg bg-orange-50/60 border border-orange-200 text-xs text-orange-950 flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-gov-saffron flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Speech-to-Text Transcribed: </span>
                  <span>"{audioTranscript}"</span>
                </div>
              </div>
            )}
          </div>

          {/* Core Grievance Fields */}
          <div className="gov-card p-6 bg-white border border-slate-200 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Grievance Title / Subject {submissionMode === "DETAILED" && "*"}
              </label>
              <input
                type="text"
                required={submissionMode === "DETAILED"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Critical Pier Crack on Dham River Bridge (Optional in Quick mode)"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy focus:ring-1 focus:ring-gov-navy font-medium"
              />
            </div>

            {submissionMode === "DETAILED" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category (Optional - Auto-structured by AI)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy"
                  >
                    <option value="">✨ AI Auto-Detect Category</option>
                    <option value="Infrastructure">Infrastructure (Roads & Bridges)</option>
                    <option value="Water & Sanitation">Water Supply & Sanitation</option>
                    <option value="Energy">Electricity & Energy</option>
                    <option value="Public Health">Public Health & Sanitation</option>
                    <option value="Agriculture">Agriculture & Irrigation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Responsible Department (Optional - Auto-assigned by AI)
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy"
                  >
                    <option value="">✨ AI Auto-Recommend Department</option>
                    <option value="Public Works Department (PWD)">Public Works Department (PWD)</option>
                    <option value="Jal Jeevan Mission / Water Supply Board">Jal Jeevan Mission / Water Board</option>
                    <option value="State Power Distribution Corporation (DISCOM)">State Power DISCOM</option>
                    <option value="Municipal Corporation">Municipal Corporation</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Description of the Issue & Impact {submissionMode === "DETAILED" && "*"}
              </label>
              <textarea
                required={submissionMode === "DETAILED"}
                rows={submissionMode === "QUICK" ? 2 : 4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue or record a voice note above..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy focus:ring-1 focus:ring-gov-navy"
              />
            </div>

            {/* Location & Evidence Photo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Location / Village / District Landmark
                </label>
                <div className="flex space-x-1.5">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy"
                  />
                  <button
                    type="button"
                    onClick={() => setAddress("Wardha, Maharashtra (GPS Detected)")}
                    className="px-2.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[11px] font-semibold text-slate-700 flex items-center space-x-1 whitespace-nowrap"
                  >
                    <MapPin className="w-3.5 h-3.5 text-gov-navy" />
                    <span>GPS</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Evidence Media Attachment (PRD FR-03 / TRD Section 6)
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
                      setEvidenceUrl("https://cpgrams.gov.in/docs/Wardha_PWD_Structural_Inspection_Report.pdf");
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
                      setEvidenceUrl("https://cpgrams.gov.in/audio/citizen_voice_complaint_0912.mp3");
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
                  placeholder="https://... URL or file path"
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

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number (For SMS Tracking Updates)
                </label>
                <input
                  type="tel"
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  placeholder="9823012345"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy font-mono"
                />
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-lg bg-gov-navy hover:bg-gov-navy-dark text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting & AI Ingesting Grievance...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Grievance to National Portal</span>
              </>
            )}
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
                {submittedResult.data.publicProblemId}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Category</span>
              <p className="font-bold text-slate-900 mt-0.5">{submittedResult.data.category}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Priority Index</span>
              <p className="font-bold text-gov-saffron font-mono mt-0.5">{submittedResult.data.priorityScore} / 100</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Status</span>
              <p className="font-bold text-blue-800 font-mono mt-0.5">{submittedResult.data.status}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Nodal Dept</span>
              <p className="font-bold text-slate-900 mt-0.5 truncate">{submittedResult.data.departmentName}</p>
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
              onClick={() => setSubmittedResult(null)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Lodge Another Grievance
            </button>

            <Link
              href={`/track?id=${submittedResult.data.publicProblemId}`}
              className="px-5 py-2 rounded-lg bg-gov-navy hover:bg-gov-navy-dark text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
            >
              <span>View Full SmadhanX Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
