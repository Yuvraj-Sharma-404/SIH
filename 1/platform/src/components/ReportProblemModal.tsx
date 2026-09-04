'use client';

import React, { useState } from 'react';
import { 
  Video, 
  Camera, 
  Mic, 
  FileText, 
  Edit3, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  X, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  AlertTriangle,
  UploadCloud,
  Volume2
} from 'lucide-react';
import { InputType, IssueCategory, Report } from '../types';

interface ReportProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newReport: Report) => void;
}

export default function ReportProblemModal({ isOpen, onClose, onSuccess }: ReportProblemModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedMethod, setSelectedMethod] = useState<InputType | null>(null);
  
  // Form State
  const [citizenName, setCitizenName] = useState('Anand Kumar');
  const [citizenPhone, setCitizenPhone] = useState('9835123456');
  const [mediaFileUrl, setMediaFileUrl] = useState<string>('');
  const [voiceRecorded, setVoiceRecorded] = useState(false);
  const [textDescription, setTextDescription] = useState('');
  
  // Location State
  const [locationDetected, setLocationDetected] = useState(false);
  const [district, setDistrict] = useState('Ranchi');
  const [block, setBlock] = useState('Kanke Block');
  const [village, setVillage] = useState('Morabadi Gram');
  const [addressDetails, setAddressDetails] = useState('');
  
  // AI Simulation State
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiCategory, setAiCategory] = useState<IssueCategory>('Road Infrastructure');
  const [aiPriority, setAiPriority] = useState<'HIGH' | 'MEDIUM' | 'CRITICAL'>('HIGH');
  const [aiKeywords, setAiKeywords] = useState<string[]>(['damage', 'road safety', 'pothole']);

  // Generated Ticket
  const [submittedReport, setSubmittedReport] = useState<Report | null>(null);

  if (!isOpen) return null;

  const handleSelectMethod = (method: InputType) => {
    setSelectedMethod(method);
    // Auto populate sample media preview URL depending on method
    if (method === 'photo') {
      setMediaFileUrl('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80');
    } else if (method === 'video') {
      setMediaFileUrl('https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80');
    } else if (method === 'voice') {
      setVoiceRecorded(true);
    }
    setStep(2);
  };

  const handleDetectLocation = () => {
    setLocationDetected(true);
    // Simulate Browser Geolocation API result
    setVillage('Kanke Village (Auto-detected)');
    setBlock('Kanke Block');
    setDistrict('Ranchi');
  };

  const handleRunAiAnalysis = () => {
    setStep(4);
    setAiProcessing(true);
    setTimeout(() => {
      // Simulate AI analysis logic based on selection
      if (selectedMethod === 'voice' || voiceRecorded) {
        setTextDescription('Simulated Speech-to-Text: Overhead water pipeline broken near village handpump area. Dirty water accumulating.');
        setAiCategory('Water Supply');
        setAiPriority('CRITICAL');
        setAiKeywords(['water pipe', 'contamination', 'leakage', 'urgent']);
      } else if (selectedMethod === 'photo' || selectedMethod === 'video') {
        setTextDescription('Simulated Vision AI: Heavy road surface cracking and deep pothole detected near village road intersection.');
        setAiCategory('Road Infrastructure');
        setAiPriority('HIGH');
        setAiKeywords(['pothole', 'road damage', 'traffic block', 'accident risk']);
      } else {
        setAiCategory('Sanitation & Waste');
        setAiPriority('MEDIUM');
        setAiKeywords(['garbage', 'sanitation', 'cleanliness']);
      }
      setAiProcessing(false);
    }, 2000);
  };

  const handleSubmitFinalReport = () => {
    const newReportId = `JH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdReport: Report = {
      id: newReportId,
      citizenName: citizenName || 'Anonymous Citizen',
      citizenPhone: citizenPhone || '+91 9800000000',
      title: textDescription.slice(0, 60) || `${aiCategory} issue reported at ${village}`,
      description: textDescription || 'Issue reported via media capture without text.',
      inputType: selectedMethod || 'photo',
      mediaUrl: mediaFileUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      category: aiCategory,
      location: {
        village: village || 'Morabadi',
        block: block || 'Kanke',
        district: district || 'Ranchi',
        state: 'Jharkhand',
        latitude: 23.3441,
        longitude: 85.3096,
        addressDetails: addressDetails || 'Near main panchayat building'
      },
      language: 'Hindi',
      aiClassification: {
        suggestedCategory: aiCategory,
        confidence: 0.94,
        extractedKeywords: aiKeywords,
        sentimentScore: 'High Urgency',
        isDuplicateDetected: false
      },
      priority: aiPriority,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      upvotes: 1,
      isChallenge: false,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          status: 'SUBMITTED',
          title: 'Grievance Submitted via Portal',
          description: `Received input via ${selectedMethod?.toUpperCase()}. AI routed to ${aiCategory} Department.`,
          timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          updatedBy: 'System AI Engine',
          role: 'Automated System'
        }
      ]
    };

    setSubmittedReport(createdReport);
    onSuccess(createdReport);
    setStep(5);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedMethod(null);
    setSubmittedReport(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-amber-400 text-blue-950 font-bold flex items-center justify-center text-lg">
              📢
            </span>
            <div>
              <h2 className="text-lg font-bold">Report a Local Problem • समस्या दर्ज करें</h2>
              <p className="text-xs text-blue-200">Zero-Barrier Reporting • standard & accessible format</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Wizard Stepper Progress Bar */}
        <div className="bg-slate-100 px-6 py-2 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600">
          <span className={step >= 1 ? 'text-blue-900 font-bold' : ''}>1. Choose Method</span>
          <span>→</span>
          <span className={step >= 2 ? 'text-blue-900 font-bold' : ''}>2. Capture</span>
          <span>→</span>
          <span className={step >= 3 ? 'text-blue-900 font-bold' : ''}>3. Location</span>
          <span>→</span>
          <span className={step >= 4 ? 'text-blue-900 font-bold' : ''}>4. AI Review</span>
          <span>→</span>
          <span className={step === 5 ? 'text-emerald-700 font-bold' : ''}>5. Ticket</span>
        </div>

        {/* Modal Content */}
        <div className="p-6">

          {/* STEP 1: SELECT REPORTING METHOD */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">How would you like to report?</h3>
                <p className="text-sm text-slate-500 mt-1">आप समस्या कैसे बताना चाहते हैं? किसी भी एक विकल्प पर क्लिक करें।</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Method 1: Record Video */}
                <button
                  onClick={() => handleSelectMethod('video')}
                  className="p-5 rounded-xl border-2 border-slate-200 hover:border-red-500 hover:bg-red-50/50 flex items-center gap-4 transition-all text-left group shadow-xs hover:shadow-md"
                >
                  <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Video className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">🎥 Record Video</h4>
                    <p className="text-xs text-slate-500">वीडियो रिकॉर्ड करें (Speak while showing problem)</p>
                  </div>
                </button>

                {/* Method 2: Take Photo */}
                <button
                  onClick={() => handleSelectMethod('photo')}
                  className="p-5 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex items-center gap-4 transition-all text-left group shadow-xs hover:shadow-md"
                >
                  <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">📷 Take Photo</h4>
                    <p className="text-xs text-slate-500">फोटो खींचें या अपलोड करें (Instant snap)</p>
                  </div>
                </button>

                {/* Method 3: Record Voice */}
                <button
                  onClick={() => handleSelectMethod('voice')}
                  className="p-5 rounded-xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 flex items-center gap-4 transition-all text-left group shadow-xs hover:shadow-md"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mic className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">🎙️ Record Voice</h4>
                    <p className="text-xs text-slate-500">बोलकर बताएं (AI Speech-to-Text supported)</p>
                  </div>
                </button>

                {/* Method 4: Type Problem */}
                <button
                  onClick={() => handleSelectMethod('text')}
                  className="p-5 rounded-xl border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 flex items-center gap-4 transition-all text-left group shadow-xs hover:shadow-md"
                >
                  <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Edit3 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">✍️ Type Problem</h4>
                    <p className="text-xs text-slate-500">लिखकर बताएं (Simple large text box)</p>
                  </div>
                </button>

              </div>
            </div>
          )}

          {/* STEP 2: CAPTURE CONTENT */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <span>Method Selected:</span>
                  <span className="uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded text-sm font-extrabold border border-blue-200">
                    {selectedMethod}
                  </span>
                </h3>
                <button onClick={() => setStep(1)} className="text-xs text-slate-500 underline flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Change Method
                </button>
              </div>

              {/* Dynamic Capture Interface based on Method */}
              {selectedMethod === 'photo' && (
                <div className="border-2 border-dashed border-blue-300 bg-blue-50/30 rounded-xl p-6 text-center space-y-3">
                  {mediaFileUrl ? (
                    <div className="space-y-2">
                      <img src={mediaFileUrl} alt="Captured evidence" className="max-h-48 rounded-lg mx-auto shadow-md border" />
                      <p className="text-xs text-emerald-700 font-semibold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Photo Captured Successfully!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <UploadCloud className="w-12 h-12 text-blue-500 mx-auto" />
                      <p className="text-sm font-semibold text-slate-700">Click to Open Camera or Select Photo</p>
                      <button 
                        onClick={() => setMediaFileUrl('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80')}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg"
                      >
                        Simulate Camera Snap
                      </button>
                    </div>
                  )}
                </div>
              )}

              {selectedMethod === 'voice' && (
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg animate-pulse">
                    <Mic className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 text-lg">Listening... बोलिए</h4>
                    <p className="text-xs text-slate-600 mt-1">Speak in your language (Hindi, Nagpuri, Santhali, English).</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-emerald-200 text-xs text-slate-700 flex items-center justify-center gap-2">
                    <Volume2 className="w-4 h-4 text-emerald-600 animate-bounce" />
                    <span>"हमार गाँव में पानी कर पाइप टूट गेलक..." (Live Speech Waves Detected)</span>
                  </div>
                </div>
              )}

              {selectedMethod === 'text' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Describe Problem (विवरण लिखें)</label>
                  <textarea
                    rows={4}
                    value={textDescription}
                    onChange={(e) => setTextDescription(e.target.value)}
                    placeholder="Provide simple details e.g., Road broken in front of Morabadi High School..."
                    className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                  ></textarea>
                </div>
              )}

              {selectedMethod === 'video' && (
                <div className="bg-slate-900 text-white rounded-xl p-6 text-center space-y-3">
                  <Video className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
                  <p className="text-sm font-semibold">Live Camera Viewport Ready</p>
                  <button 
                    onClick={() => setMediaFileUrl('https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80')}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-5 rounded-lg"
                  >
                    Simulate 10s Video Recording
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setStep(3)}
                  className="btn-primary"
                >
                  Continue to Location →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: LOCATION */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-900">Where is this problem located?</h3>
                <p className="text-xs text-slate-500 mt-1">स्थान की जानकारी (Location Details)</p>
              </div>

              {/* Automatic Geolocation Trigger */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-950 text-sm">Use Phone/Device Location</h4>
                    <p className="text-xs text-amber-800">Auto-fetches Village, Block, and GPS Pin</p>
                  </div>
                </div>
                <button
                  onClick={handleDetectLocation}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 px-3.5 rounded-lg shadow-sm"
                >
                  {locationDetected ? '✓ Detected' : 'Detect GPS'}
                </button>
              </div>

              {/* Location Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">District (जिला)</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                  >
                    <option value="Ranchi">Ranchi (राँची)</option>
                    <option value="Dhanbad">Dhanbad (धनबाद)</option>
                    <option value="Jamshedpur">East Singhbhum (जमशेदपुर)</option>
                    <option value="Hazaribagh">Hazaribagh (हजारीबाग)</option>
                    <option value="Dumka">Dumka (दुमका)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Block (प्रखंड)</label>
                  <input
                    type="text"
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Village/Locality (गाँव)</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Landmark / Extra Details (Optional)</label>
                <input
                  type="text"
                  value={addressDetails}
                  onChange={(e) => setAddressDetails(e.target.value)}
                  placeholder="e.g. Near Primary School Gate 2"
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                />
              </div>

              <div className="flex justify-between gap-3 pt-2">
                <button onClick={() => setStep(2)} className="btn-secondary">
                  ← Back
                </button>
                <button onClick={handleRunAiAnalysis} className="btn-primary">
                  Analyze & Preview with AI →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: AI PRE-PROCESSING REVIEW */}
          {step === 4 && (
            <div className="space-y-5">
              {aiProcessing ? (
                <div className="py-12 text-center space-y-4">
                  <Loader2 className="w-12 h-12 text-blue-900 animate-spin mx-auto" />
                  <h3 className="font-bold text-lg text-slate-900">AI Automation Pipeline Active...</h3>
                  <div className="text-xs text-slate-500 space-y-1 max-w-sm mx-auto">
                    <p>• Extracting speech/keywords from media</p>
                    <p>• Classifying issue department category</p>
                    <p>• Checking spatial GIS database for duplicates</p>
                    <p>• Estimating priority severity score</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <span className="font-bold text-sm">AI Automated Structuring Complete</span>
                    </div>
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-400/30">
                      96.4% Match Accuracy
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block">Auto-Assigned Category:</span>
                        <span className="font-bold text-slate-900 text-sm">{aiCategory}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Estimated Priority:</span>
                        <span className="font-bold text-red-600 text-sm flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" /> {aiPriority}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-slate-500 block">Extracted Key Issues:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {aiKeywords.map((kw, i) => (
                          <span key={i} className="bg-white border border-slate-300 text-slate-700 text-xs px-2 py-0.5 rounded">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-slate-500 block">Location Context:</span>
                      <span className="text-xs font-semibold text-slate-800">
                        📍 {village}, {block}, {district}, Jharkhand
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between gap-3 pt-2">
                    <button onClick={() => setStep(3)} className="btn-secondary">
                      ← Edit Location
                    </button>
                    <button onClick={handleSubmitFinalReport} className="btn-primary">
                      Confirm & Submit Grievance →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: TICKET CONFIRMATION */}
          {step === 5 && submittedReport && (
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wide">
                  Grievance Successfully Registered
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                  Ticket #{submittedReport.id}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Keep this tracking code safe. SMS updates dispatched to registered phone.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-bold text-slate-900">{submittedReport.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-semibold text-slate-800">{submittedReport.location.village}, {submittedReport.location.district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-blue-900">{submittedReport.status}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <button onClick={handleReset} className="btn-secondary">
                  Report Another Problem
                </button>
                <a href={`/track?id=${submittedReport.id}`} className="btn-primary">
                  Track Ticket Status →
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
