/**
 * State Machine for Problem Status Transitions
 */

export const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
  SUBMITTED: ["AI_PROCESSED", "PENDING_VERIFICATION", "REJECTED"],
  AI_PROCESSED: ["PENDING_VERIFICATION", "REJECTED"],
  PENDING_VERIFICATION: ["VERIFIED", "MORE_INFO_NEEDED", "REJECTED"],
  MORE_INFO_NEEDED: ["PENDING_VERIFICATION", "SUBMITTED", "REJECTED"],
  VERIFIED: ["ASSIGNED", "SOLUTION_REQUIRED", "REJECTED"],
  ASSIGNED: ["UNDER_INVESTIGATION", "SOLUTION_REQUIRED", "IN_PROGRESS", "REJECTED"],
  UNDER_INVESTIGATION: ["SOLUTION_REQUIRED", "ASSIGNED", "IN_PROGRESS", "REJECTED"],
  SOLUTION_REQUIRED: ["COLLABORATION", "SOLUTION_PROPOSED", "IN_PROGRESS", "REJECTED"],
  COLLABORATION: ["APPROVED", "IMPLEMENTATION", "IN_PROGRESS", "REJECTED"],
  SOLUTION_PROPOSED: ["APPROVED", "IMPLEMENTATION", "IN_PROGRESS", "REJECTED"],
  APPROVED: ["IMPLEMENTATION", "IN_PROGRESS", "RESOLVED", "REJECTED"],
  IMPLEMENTATION: ["IN_PROGRESS", "RESOLVED", "REJECTED"],
  IN_PROGRESS: ["RESOLVED", "REJECTED"],
  RESOLVED: ["CLOSED", "IN_PROGRESS", "REJECTED"],
  REJECTED: ["PENDING_VERIFICATION"],
  CLOSED: ["PENDING_VERIFICATION"],
};

export function canTransition(fromStatus: string, toStatus: string): boolean {
  if (fromStatus === toStatus) return true;
  const allowed = VALID_STATUS_TRANSITIONS[fromStatus];
  if (!allowed) return false;
  return allowed.includes(toStatus);
}

export function assertValidTransition(fromStatus: string, toStatus: string): void {
  if (!canTransition(fromStatus, toStatus)) {
    throw new Error(
      `Invalid status transition from '${fromStatus}' to '${toStatus}'.`
    );
  }
}
