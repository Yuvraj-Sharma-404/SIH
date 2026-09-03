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
} from "lucide-react";
import Link from "next/link";

export default function CitizenReportPage() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [reporterPhone, setReporterPhone] = useState("");
  const [department, setDepartment] = useState("Public Works Department (PWD)");
  const [category, setCategory] = useState("Infrastructure");
  const [latitude, setLatitude] = useState<number | null>(20.7453);
  const [longitude, setLongitude] = useState<number | null>(78.6022);
  const [address, setAddress] = useState("Wardha, Maharashtra");
  const [evidenceUrl, setEvidenceUrl] = useState(
    "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80"
  );

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [audioTranscript, setAudioTranscript] = useState("");

  // Loading & Submission State
  const [loading, setLoading] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<any | null>(null);

  // Voice recording simulation
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        const sampleAudio =
          "The main bridge connecting Wardha and Sevagram has severe cracks on pier number 3. Water scour has eroded the base. Buses shake badly when crossing.";
        setAudioTranscript(sampleAudio);
        if (!title) setTitle("Severe Structural Cracks on Dham River Bridge Pier");
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
    } else if (type === "water") {
      setTitle("High Turbidity & Contaminated Water in Primary School Pipeline");
      setDescription(
        "Borewell drinking water pipeline in Ward 4 has high yellow silt and foul chemical odor. Over 24 primary schoolchildren hospitalized with acute diarrhea."
      );
      setCategory("Water & Sanitation");
      setDepartment("Jal Jeevan Mission / Water Supply Board");
      setAddress("Zilla Parishad School Ward 4, Wardha");
    } else if (type === "electric") {
      setTitle("Open Sparking 11kV Transformer Next to Bus Stand");
      setDescription(
        "11kV distribution transformer fence is completely broken. Live wires hanging within hand reach of pedestrians and school children."
      );
      setCategory("Energy");
      setDepartment("State Power Distribution Corporation (DISCOM)");
      setAddress("Central Bus Station, Wardha");
    }
  };

  // Submit to Pipeline
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          reporterName: reporterName || "Citizen (Self)",
          reporterPhone: reporterPhone || "9823012345",
          latitude,
          longitude,
          address,
          evidenceType: "IMAGE",
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
          Submissions are acknowledged under CPGRAMS standards, auto-prioritized by our AI engine, and published as collaborative challenges if departmental R&D is required.
        </p>
      </div>

      {/* Preset Scenarios for Hackathon Evaluation */}
      <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 space-y-1.5 text-xs">
        <span className="font-bold text-slate-700 block">
          Demo Quick-Fill Scenarios (For SIH Presentation):
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => loadScenario("bridge")}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-gov-navy font-medium shadow-sm transition"
          >
            🌉 Dham River Bridge Cracks
          </button>
          <button
            type="button"
            onClick={() => loadScenario("water")}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-gov-navy font-medium shadow-sm transition"
          >
            🚰 Turbid Water in Ward 4
          </button>
          <button
            type="button"
            onClick={() => loadScenario("electric")}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-gov-navy font-medium shadow-sm transition"
          >
            ⚡ Open 11kV Transformer
          </button>
        </div>
      </div>

      {!submittedResult ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Multimodal Voice Input Assistant */}
          <div className="gov-card p-5 bg-white border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Mic className="w-4 h-4 text-gov-saffron" />
                  <span>Assisted Voice Input (Low-Literacy Friendly)</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  Speak in Hindi, Marathi, or English. Audio is transcribed automatically into the complaint form.
                </p>
              </div>

              <button
                type="button"
                onClick={toggleRecording}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shadow-sm ${
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
                Grievance Title / Subject *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Critical Pier Crack on Dham River Bridge"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy focus:ring-1 focus:ring-gov-navy font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy"
                >
                  <option value="Infrastructure">Infrastructure (Roads & Bridges)</option>
                  <option value="Water & Sanitation">Water Supply & Sanitation</option>
                  <option value="Energy">Electricity & Energy</option>
                  <option value="Public Health">Public Health & Sanitation</option>
                  <option value="Agriculture">Agriculture & Irrigation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Responsible Department *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy"
                >
                  <option value="Public Works Department (PWD)">Public Works Department (PWD)</option>
                  <option value="Jal Jeevan Mission / Water Supply Board">Jal Jeevan Mission / Water Board</option>
                  <option value="State Power Distribution Corporation (DISCOM)">State Power DISCOM</option>
                  <option value="Municipal Corporation">Municipal Corporation</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Description of the Societal Issue & Community Impact *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue, exact landmark, and number of citizens or vehicles affected daily..."
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
                  Photo / Document Attachment URL
                </label>
                <input
                  type="text"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy"
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
              <span>View Full CPGRAMS Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
