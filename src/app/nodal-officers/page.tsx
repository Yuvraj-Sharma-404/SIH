"use client";

import React, { useState } from "react";
import { Building2, Mail, MapPin, Phone, Search, ShieldCheck } from "lucide-react";

const centralOfficers = [
  {
    sno: 1,
    org: "Administrative Reforms and Public Grievances - PG Division",
    officer: "Sardendu Kumar Pandey",
    designation: "Director",
    address: "5th Floor Sardar Patel Bhawan Sansad Marg, New Delhi",
    phone: "011-23401455",
    email: "director-pg@gov.in",
  },
  {
    sno: 2,
    org: "Agriculture and Farmers Welfare",
    officer: "Shri Rajesh Kumar",
    designation: "Deputy Secretary PG",
    address: "Room No. 434 Krishi Bhavan New Delhi",
    phone: "011-23074238",
    email: "rajesh.kumar67@nic.in",
  },
  {
    sno: 3,
    org: "Agriculture Research and Education",
    officer: "Narendra Kumar",
    designation: "Deputy Secretary",
    address: "R No. 207, Krishi Bhawan, New Delhi",
    phone: "011-23046678",
    email: "narendra.kumar74@nic.in",
  },
  {
    sno: 4,
    org: "Animal Husbandry, Dairying",
    officer: "RPS Rathore",
    designation: "Director",
    address: "Room No. 297, 2nd Floor, Krishi Bhavan, New Delhi",
    phone: "011-23385797",
    email: "r.rathore@gov.in",
  },
  {
    sno: 5,
    org: "Atomic Energy",
    officer: "Shri K.V. Madhavadas",
    designation: "Deputy Secretary",
    address: "D/o Atomic Energy, Anushakti Bhavan, 3rd Floor, C S M Marg, Mumbai",
    phone: "022-22862516",
    email: "dsscs@dae.gov.in",
  },
  {
    sno: 6,
    org: "Ayush",
    officer: "Dr Srinivas Rao Chinta",
    designation: "Joint Adviser",
    address: "AYUSH BHAWAN, GPO COMPLEX, B BLOCK, INA, New Delhi",
    phone: "011-24656948",
    email: "ayush-cdn@gov.in",
  },
  {
    sno: 7,
    org: "Bio Technology",
    officer: "Rajesh Kumar Singh",
    designation: "Director",
    address: "Room No. 504, Block No. 3, 5th Floor, CGO Complex, Lodi Road, New Delhi",
    phone: "011-24363656",
    email: "rajesh.kumar@gov.in",
  },
  {
    sno: 8,
    org: "Central Board of Direct Taxes (Income Tax)",
    officer: "Swapna Devireddy",
    designation: "Addl. Director of Income Tax TPS-II",
    address: "4th Floor, Mayur Bhawan, Connaught Circus, New Delhi",
    phone: "011-23416133",
    email: "delhi.addldit.eservices@incometax.gov.in",
  },
  {
    sno: 9,
    org: "Central Board of Indirect Taxes and Customs",
    officer: "Ms. Ranjana Chaudhary",
    designation: "Joint Director",
    address: "Directorate General of Taxpayer Services, Central Revenue Building, I.P. Estate, New Delhi",
    phone: "011-23370576",
    email: "ranjana.chaudhary@gov.in",
  },
  {
    sno: 10,
    org: "Chemicals and Petrochemicals",
    officer: "Shri Chitvan Singh Dhillon",
    designation: "Deputy Director",
    address: "Room No. 223 A, Shastri Bhavan, New Delhi",
    phone: "011-23386083",
    email: "chitvan.dhillon@gov.in",
  },
  {
    sno: 11,
    org: "Civil Aviation",
    officer: "Shri S. K. Mishra",
    designation: "Joint Secretary",
    address: "Rajiv Gandhi Bhawan, Safdarjung Airport, New Delhi",
    phone: "011-24610368",
    email: "sk.mishra@nic.in",
  },
  {
    sno: 12,
    org: "Consumer Affairs",
    officer: "Shri Vineet Mathur",
    designation: "Joint Secretary",
    address: "Krishi Bhawan, New Delhi",
    phone: "011-23384416",
    email: "js-ca@nic.in",
  },
];

const stateOfficers = [
  {
    sno: 1,
    org: "Andhra Pradesh",
    officer: "Chinna Rao",
    designation: "CGO-CMO",
    address: "Public Grievance Redressal Cell, CMO Block-01, Ground Floor, A.P. State Secretariat, Velagapudi, Amaravathi",
    phone: "09154267973",
    email: "pgrs-helpdesk@ap.gov.in",
  },
  {
    sno: 2,
    org: "Arunachal Pradesh",
    officer: "Shri Mari Angu",
    designation: "Joint Secretary",
    address: "Civil Secretariat Block No. 04, Floor No. 05, Room No.08, Itanagar",
    phone: "0360-2222222",
    email: "mari.angu@gov.in",
  },
  {
    sno: 3,
    org: "Assam",
    officer: "Shri Utpal Borah ACS",
    designation: "State Nodal Officer",
    address: "Joint Secretary to the Govt. of Assam, Administrative Reforms, Training, Pension and Public Grievances Department, Assam Secretariat, Dispur",
    phone: "0361-2237323",
    email: "artassamdept@gmail.com",
  },
  {
    sno: 4,
    org: "Bihar",
    officer: "Miss Vineeta",
    designation: "Deputy Secretary",
    address: "General Administration Department, Old Secretariat, Patna",
    phone: "0612-2215409",
    email: "publicgrievances-bih@gov.in",
  },
  {
    sno: 5,
    org: "Chhattisgarh",
    officer: "Shri Hemant Kumar Pandey",
    designation: "Under Secretary",
    address: "Public Grievance Redressal Department, Mantralaya Mahanadi Bhavan, Nava Raipur Atal Nagar",
    phone: "0771-2510974",
    email: "pgc-gad.cg@gov.in",
  },
  {
    sno: 6,
    org: "Goa",
    officer: "Diksha N Tari",
    designation: "Under Secretary PG",
    address: "2nd Floor, Secretariat, Porvorim, Goa",
    phone: "0832-2419864",
    email: "us-pgc.goa@nic.in",
  },
  {
    sno: 7,
    org: "Gujarat",
    officer: "Shri H. K. Patel, IAS",
    designation: "Secretary (Grievances)",
    address: "Chief Minister's Office, Swarnim Sankul-1, New Sachivalaya, Gandhinagar",
    phone: "079-23250001",
    email: "sec-swagat@gujarat.gov.in",
  },
  {
    sno: 8,
    org: "Haryana",
    officer: "Shri Rameshwar Mehra",
    designation: "Special Secretary",
    address: "Chief Minister's Grievance Cell, Haryana Civil Secretariat, Sector 1, Chandigarh",
    phone: "0172-2740001",
    email: "cmgrievance-hry@nic.in",
  },
  {
    sno: 9,
    org: "Karnataka",
    officer: "Shri P. Ravi Kumar, IAS",
    designation: "Chief Nodal Officer",
    address: "DPAR (e-Governance), Vidhana Soudha, Bengaluru",
    phone: "080-22252442",
    email: "pg.dpar@karnataka.gov.in",
  },
  {
    sno: 10,
    org: "Maharashtra",
    officer: "Smt. Manisha Patankar-Mhaiskar, IAS",
    designation: "Principal Secretary & State PG Nodal Officer",
    address: "General Administration Department, Mantralaya, Mumbai",
    phone: "022-22025114",
    email: "pg.gad@maharashtra.gov.in",
  },
];

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
                  <td colSpan={5} className="py-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                    No nodal officers found matching &quot;{searchTerm}&quot;.
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
