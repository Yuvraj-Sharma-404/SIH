import {
  Search,
  ArrowRight,
  AlertCircle,
  Info,
  BellOff,
} from "lucide-react";
import SmadhanXBannerCarousel from "@/components/SmadhanXBannerCarousel";
import HomeActionCards from "@/components/HomeActionCards";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* 1. Official SmadhanX Email Warning Banner */}
      <div className="bg-[#6e0747] dark:bg-[#500533] text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl text-center shadow-md flex items-center justify-center gap-2 border border-pink-900/30">
        <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-300" />
        <span>
          Any Grievance sent by email will not be attended to / entertained. Please lodge your grievance on this portal.
        </span>
      </div>

      {/* 2. Official SmadhanX Hero Banner Carousel */}
      <SmadhanXBannerCarousel />

      {/* 3. Quick Grievance Tracking / Search Strip */}
      <div className="gov-card p-4 sm:p-6 gov-border-t-navy bg-white dark:bg-slate-800/90 dark:border-slate-700/60 shadow-sm transition-colors">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="text-center space-y-1">
            <h2 className="text-lg sm:text-xl font-extrabold text-gov-navy dark:text-sky-400 font-serif">
              Track Grievance / Complaint Status
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Enter your unique Registration Number (e.g. <span className="font-mono font-bold text-gov-navy dark:text-sky-300">DARPG/E/2026/00001</span>) to check live status.
            </p>
          </div>

          <form action="/track" method="GET" className="flex flex-col sm:flex-row gap-2 pt-1">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="id"
                placeholder="Enter Registration ID / Grievance Number"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-gov-navy dark:focus:border-sky-400 focus:ring-1 focus:ring-gov-navy dark:focus:ring-sky-400 transition"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#001c5a] hover:bg-[#00133d] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-xs sm:text-sm shadow-sm transition whitespace-nowrap flex items-center justify-center gap-1.5"
            >
              <span>View Status</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* 4. Authentic "ABOUT SMADHANX" & "WHAT'S NEW" Two-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-slate-800/90 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
        {/* Left Column (8 Cols): About SmadhanX & Guidelines */}
        <div className="lg:col-span-8 space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
            <h2 className="text-xl font-extrabold text-gov-navy dark:text-sky-400 font-serif uppercase tracking-tight">
              About SmadhanX
            </h2>
          </div>

          <div className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 text-left sm:text-justify">
            <p>
              <strong>SmadhanX</strong> is an online platform available to the citizens 24x7 to lodge their grievances to the public authorities on any subject related to service delivery. It is a single portal connected to all the Ministries/Departments of Government of India and States. Every Ministry and State has role-based access to this system. SmadhanX is also accessible to the citizens through standalone mobile application downloadable through Google Play store and mobile application integrated with UMANG.
            </p>
            <p>
              The status of the grievance filed in SmadhanX can be tracked with the unique registration ID provided at the time of registration of the complainant. SmadhanX also provides appeal facility to the citizens if they are not satisfied with the resolution by the Grievance Officer. After closure of grievance if the complainant is not satisfied with the resolution, he/she can provide feedback. If the rating is &apos;Poor&apos; the option to file an appeal is enabled. The status of the Appeal can also be tracked by the petitioner with the grievance registration number.
            </p>
          </div>

          {/* Issues not taken up for redress */}
          <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-gov-navy dark:text-sky-400 font-bold text-xs">
              <Info className="w-4 h-4 text-gov-saffron flex-shrink-0" />
              <span>Issues which are not taken up for redress :</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300 pt-1">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gov-saffron"></span>
                <span>RTI Matters</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gov-saffron"></span>
                <span>Court related / Subjudice matters</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gov-saffron"></span>
                <span>Religious matters</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gov-saffron"></span>
                <span>Grievances of Government employees regarding service matters</span>
              </li>
            </ul>
          </div>

          {/* Official Notes */}
          <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-700/40 rounded-xl p-3 space-y-1.5">
            <p className="font-bold text-amber-950 dark:text-amber-300">Note :</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>
                If you have not got a satisfactory redress of your grievance within a reasonable period of time relating to Ministries/Departments and Organisations under the purview of Directorate of Public Grievances (DPG), Cabinet Secretariat, GOI, you may seek help of DPG in resolution.
              </li>
              <li>
                <strong>Government is not charging fee from the public for filing grievances.</strong> All money being paid by the public for filing grievance is going only to M/s CSC only.
              </li>
            </ol>
          </div>
        </div>

        {/* Right Column (4 Cols): WHAT'S NEW */}
        <div className="lg:col-span-4 space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
            <h2 className="text-xl font-extrabold text-gov-navy dark:text-sky-400 uppercase tracking-tight">
              What&apos;s New
            </h2>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-8 text-center space-y-2.5 flex flex-col items-center justify-center min-h-[220px]">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
              <BellOff className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Nothing new for now
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[220px]">
              Latest updates, notices, and official circulars will be published here.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Action Quick Access Cards (Auth-aware) */}
      <HomeActionCards />
    </div>
  );
}
