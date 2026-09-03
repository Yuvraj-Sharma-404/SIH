"use client";

import { useState } from "react";
import {
  Users,
  GraduationCap,
  Sparkles,
  PlusCircle,
  Send,
  CheckCircle2,
  Clock,
  Search,
  UserPlus,
  Briefcase,
  Layers,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface Member {
  name: string;
  role: string;
  institution: string;
  skills: string[];
}

interface TeamItem {
  id: string;
  name: string;
  institution: string;
  challengeTitle: string;
  members: Member[];
  skills: string[];
  proposalStatus: "Draft" | "Submitted" | "Under Review" | "Approved";
}

const DEMO_TEAMS: TeamItem[] = [
  {
    id: "team-1",
    name: "GreenTech Solutions",
    institution: "Government College of Engineering, Amravati",
    challengeTitle: "IoT-Based Structural Health Monitoring for Scour-Vulnerable Bridges",
    members: [
      { name: "Aman", role: "Frontend", institution: "GCOE Amravati", skills: ["Next.js", "UI/UX"] },
      { name: "Rahul", role: "AI/ML", institution: "GCOE Amravati", skills: ["TensorFlow", "Edge AI"] },
      { name: "Priya", role: "Hardware", institution: "GCOE Amravati", skills: ["ESP32", "LoRaWAN", "Sensors"] },
      { name: "Karan", role: "Backend", institution: "GCOE Amravati", skills: ["Node.js", "PostgreSQL"] },
    ],
    skills: ["AI", "IoT", "Web Development", "Data Analytics"],
    proposalStatus: "Approved",
  },
  {
    id: "team-2",
    name: "AquaSense Innovation Lab",
    institution: "IIT Bombay Innovation Hub & Tata CSR",
    challengeTitle: "Low-Cost Solar Drinking Water Purification & Real-Time Quality Sensing",
    members: [
      { name: "Dr. Sandeep", role: "Faculty Lead", institution: "IIT Bombay", skills: ["Chemical Filtration"] },
      { name: "Neha", role: "IoT Firmware", institution: "Industry Mentor", skills: ["Embedded C", "Solar telemetry"] },
      { name: "Vikram", role: "Data Scientist", institution: "Student Researcher", skills: ["Water Analytics"] },
    ],
    skills: ["Chemical Engineering", "IoT", "Solar Tech", "Microbiology"],
    proposalStatus: "Under Review",
  },
];

export default function TeamFormationPage() {
  const [teams, setTeams] = useState<TeamItem[]>(DEMO_TEAMS);
  const [selectedTeam, setSelectedTeam] = useState<TeamItem>(DEMO_TEAMS[0]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");
  const [searchSkill, setSearchSkill] = useState("");

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName) return;

    const updatedMembers = [
      ...selectedTeam.members,
      {
        name: newMemberName,
        role: newMemberRole || "Researcher",
        institution: "Collaborating Member",
        skills: ["Embedded Systems"],
      },
    ];

    const updated = { ...selectedTeam, members: updatedMembers };
    setSelectedTeam(updated);
    setTeams(teams.map((t) => (t.id === updated.id ? updated : t)));
    setNewMemberName("");
    setNewMemberRole("");
    setShowInviteModal(false);
  };

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="gov-card p-6 bg-white border border-slate-200 gov-border-t-navy flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-mono font-bold text-gov-navy">
            University & Industry Collaborative R&D
          </span>
          <h1 className="text-2xl font-bold text-gov-navy font-serif mt-0.5">
            Team Formation & Proposal Submissions
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Build interdisciplinary engineering teams, discover potential student & industry teammates, and submit formal proposals for active societal challenges.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/challenges"
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition"
          >
            Browse Challenges
          </Link>
        </div>
      </div>

      {/* Main Team Showcase Section (Matches Section 10 format) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Selector List */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            Participating Teams ({teams.length})
          </p>
          {teams.map((team) => (
            <div
              key={team.id}
              onClick={() => setSelectedTeam(team)}
              className={`gov-card p-4 rounded-xl border cursor-pointer transition ${
                selectedTeam.id === team.id
                  ? "border-gov-navy bg-blue-50/50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gov-navy font-serif">{team.name}</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {team.proposalStatus}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{team.institution}</p>
              <p className="text-[11px] text-slate-500 mt-2 font-mono">
                {team.members.length} Members • {team.skills.join(", ")}
              </p>
            </div>
          ))}
        </div>

        {/* Selected Team Dossier (Exact layout from Section 10) */}
        <div className="lg:col-span-2 gov-card p-6 bg-white border border-slate-200 gov-border-t-emerald space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-slate-500">
                Team Dossier
              </span>
              <h2 className="text-xl font-bold text-gov-navy font-serif mt-0.5">
                Team: {selectedTeam.name}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                {selectedTeam.institution}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">
                Proposal Workflow
              </span>
              <span className="inline-block mt-0.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-200">
                {selectedTeam.proposalStatus}
              </span>
            </div>
          </div>

          {/* Members Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
              Members
            </h4>
            <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-200">
              {selectedTeam.members.map((member, idx) => (
                <div key={idx} className="p-3 bg-slate-50 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[11px]">
                      {member.name[0]}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900">{member.name}</span>
                      <span className="text-slate-500"> — {member.role}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500">{member.institution}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Badges */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
              Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedTeam.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-blue-50 text-gov-navy border border-blue-200 text-xs font-bold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Associated Challenge */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Applying to Societal Challenge:
            </span>
            <p className="font-bold text-slate-900">{selectedTeam.challengeTitle}</p>
          </div>

          {/* Action Buttons (from Section 10) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowInviteModal(true)}
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5"
            >
              <UserPlus className="w-3.5 h-3.5 text-gov-navy" />
              <span>[Invite Member]</span>
            </button>

            <Link
              href="/challenges"
              className="px-5 py-2 rounded-lg bg-gov-navy hover:bg-gov-navy-dark text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>[Submit Proposal]</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="gov-card w-full max-w-md bg-white rounded-xl p-6 border border-slate-300 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-sm font-bold text-gov-navy font-serif">
                Invite Teammate to {selectedTeam.name}
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Candidate Name *
                </label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Sneha Sharma"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Role / Expertise *
                </label>
                <input
                  type="text"
                  required
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  placeholder="e.g. Embedded Hardware / IoT"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-gov-navy"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-gov-navy text-white text-xs font-bold shadow-sm"
                >
                  Add to Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
