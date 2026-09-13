export type UserRoleType =
  | "CITIZEN"
  | "UNIVERSITY_MEMBER"
  | "GOVERNMENT_OFFICIAL"
  | "INDUSTRY_PARTNER"
  | "ADMIN";

export interface RoleConfig {
  id: UserRoleType;
  title: string;
  badge: string;
  description: string;
  dashboardUrl: string;
  requiresClearance: boolean;
  defaultPermissions: string[];
}

export const ROLE_CONFIGS: Record<UserRoleType, RoleConfig> = {
  CITIZEN: {
    id: "CITIZEN",
    title: "Citizen",
    badge: "Public User",
    description: "Submit and track grievances, view resolution progress, and participate in community initiatives.",
    dashboardUrl: "/citizen/report",
    requiresClearance: false,
    defaultPermissions: ["GRIEVANCE_LODGE", "GRIEVANCE_TRACK", "FEEDBACK_SUBMIT", "COMMUNITY_VIEW"],
  },
  UNIVERSITY_MEMBER: {
    id: "UNIVERSITY_MEMBER",
    title: "Student / University",
    badge: "Academic & R&D",
    description: "Solve societal grand challenges, submit research proposals, build pilot prototypes, and secure academic grants.",
    dashboardUrl: "/university/challenges",
    requiresClearance: false,
    defaultPermissions: ["CHALLENGES_VIEW", "PROPOSAL_SUBMIT", "TEAM_MANAGE", "RESEARCH_COLLABORATE"],
  },
  GOVERNMENT_OFFICIAL: {
    id: "GOVERNMENT_OFFICIAL",
    title: "Government Official",
    badge: "Nodal Authority",
    description: "Access department triage consoles, review AI classifications, assign officers, and monitor SLA timelines.",
    dashboardUrl: "/gov/dashboard",
    requiresClearance: true,
    defaultPermissions: [
      "GRIEVANCE_VERIFY",
      "AI_TRIAGE_OVERRIDE",
      "ASSIGN_DEPT",
      "CHALLENGE_CREATE",
      "SLA_MONITOR",
      "DEPARTMENT_ANALYTICS",
    ],
  },
  INDUSTRY_PARTNER: {
    id: "INDUSTRY_PARTNER",
    title: "Industry / Organization",
    badge: "CSR & Innovation",
    description: "Fund high-impact civic innovations, deploy CSR capital, co-develop hardware solutions, and track impact metrics.",
    dashboardUrl: "/industry/explore",
    requiresClearance: false,
    defaultPermissions: [
      "CSR_SPONSOR",
      "CHALLENGE_COFUND",
      "HARDWARE_DEPLOY",
      "IMPACT_AUDIT",
      "PORTFOLIO_TRACK",
    ],
  },
  ADMIN: {
    id: "ADMIN",
    title: "System Administrator",
    badge: "Admin",
    description: "National system oversight, audit trails, user role approvals, and system-wide configurations.",
    dashboardUrl: "/gov/dashboard",
    requiresClearance: true,
    defaultPermissions: ["*"],
  },
};

export function getDashboardForRole(role: string): string {
  const normalized = (role || "CITIZEN").toUpperCase() as UserRoleType;
  return ROLE_CONFIGS[normalized]?.dashboardUrl || "/citizen/report";
}

export function getDefaultPermissions(role: string): string[] {
  const normalized = (role || "CITIZEN").toUpperCase() as UserRoleType;
  return ROLE_CONFIGS[normalized]?.defaultPermissions || ["GRIEVANCE_LODGE", "GRIEVANCE_TRACK"];
}
