"use client";

import React, { useState } from "react";
import { Building2, Search } from "lucide-react";

interface NodalOfficer {
  sno: number;
  org: string;
  officer: string;
  designation: string;
  address: string;
  phone: string;
  email: string;
}

const centralOfficers: NodalOfficer[] = [];

const stateOfficers: NodalOfficer[] = [];


export default function NodalOfficersPage() {
  const [activeTab, setActiveTab] = useState<"central" | "state">("central");
  const [searchTerm, setSearchTerm] = useState("");

  const list = activeTab === "central" ? centralOfficers : stateOfficers;
  const filteredList = list.filter(
    (item) =>
      item.org.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.officer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="gov-card p-6 gov-border-t-navy bg-white dark:bg-slate-800/95 dark:border-slate-700 transition-colors">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gov-saffron bg-orange-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-orange-200 dark:border-amber-800/60">
            SmadhanX Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-navy dark:text-white font-serif tracking-tight">
            List Of Nodal Public Grievance Officers
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Official Directory of Nodal Public Grievance Officers across Central Ministries, Departments, and State Governments.
          </p>
        </div>
      </div>

      {/* Main Card with Tabs and Search */}
      <div className="gov-card p-6 sm:p-8 bg-white dark:bg-slate-800/95 dark:border-slate-700 space-y-5 transition-colors">
        {/* Tab Switcher & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                setActiveTab("central");
                setSearchTerm("");
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === "central"
                  ? "bg-[#001c5a] dark:bg-sky-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Central Government ({centralOfficers.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("state");
                setSearchTerm("");
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === "state"
                  ? "bg-[#001c5a] dark:bg-sky-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              State Governments ({stateOfficers.length})
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ministry, officer, state..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 text-xs focus:outline-none focus:border-gov-navy dark:focus:border-sky-500 focus:ring-1 focus:ring-gov-navy dark:focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Authentic Data Table */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300 border-collapse">
            <thead className="bg-[#001c5a] dark:bg-slate-900 text-white uppercase text-[11px] font-bold">
              <tr>
                <th className="py-3 px-3 w-12 text-center">S.No.</th>
                <th className="py-3 px-4">
                  {activeTab === "central" ? "Ministry / Department / Organisation" : "State / UT"}
                </th>
                <th className="py-3 px-4">Nodal Officer & Designation</th>
                <th className="py-3 px-4">Official Address</th>
                <th className="py-3 px-4">Phone No. & Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800/60">
              {filteredList.map((item, idx) => (
                <tr key={item.sno} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition">
                  <td className="py-3 px-3 text-center font-bold text-slate-500 dark:text-slate-400">{idx + 1}</td>
                  <td className="py-3 px-4 font-extrabold text-gov-navy dark:text-sky-400">{item.org}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 dark:text-white block">{item.officer}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.designation}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-[11px] leading-tight max-w-xs">
                    {item.address}
                  </td>
                  <td className="py-3 px-4 space-y-0.5">
                    <div className="font-mono text-slate-800 dark:text-slate-200 font-semibold">{item.phone}</div>
                    <div className="text-gov-navy dark:text-sky-400 font-medium text-[11px]">{item.email}</div>
                  </td>
                </tr>
              ))}
              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Building2 className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                      <p className="font-medium text-sm text-slate-600 dark:text-slate-300">
                        {searchTerm
                          ? `No nodal officers found matching "${searchTerm}".`
                          : "No nodal public grievance officers listed at this time."}
                      </p>
                      <p className="text-slate-400 dark:text-slate-500 text-xs">
                        Official directory records will be displayed once published.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
