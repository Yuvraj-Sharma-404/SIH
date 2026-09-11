
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  phone: 'phone',
  name: 'name',
  role: 'role',
  status: 'status',
  passwordHash: 'passwordHash',
  verificationCode: 'verificationCode',
  verificationExpiresAt: 'verificationExpiresAt',
  department: 'department',
  organization: 'organization',
  designation: 'designation',
  profileData: 'profileData',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserRoleScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  role: 'role',
  permissions: 'permissions',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.ProblemScalarFieldEnum = {
  id: 'id',
  publicProblemId: 'publicProblemId',
  citizenId: 'citizenId',
  reporterName: 'reporterName',
  reporterPhone: 'reporterPhone',
  title: 'title',
  description: 'description',
  category: 'category',
  problemType: 'problemType',
  status: 'status',
  severity: 'severity',
  urgency: 'urgency',
  priorityScore: 'priorityScore',
  departmentId: 'departmentId',
  departmentName: 'departmentName',
  assignedOfficer: 'assignedOfficer',
  latitude: 'latitude',
  longitude: 'longitude',
  address: 'address',
  district: 'district',
  state: 'state',
  rejectionReason: 'rejectionReason',
  requestNote: 'requestNote',
  aiCategory: 'aiCategory',
  aiSubcategory: 'aiSubcategory',
  aiDepartment: 'aiDepartment',
  aiPriority: 'aiPriority',
  aiSummary: 'aiSummary',
  aiUrgencyReason: 'aiUrgencyReason',
  aiLocation: 'aiLocation',
  aiConfidence: 'aiConfidence',
  aiStatus: 'aiStatus',
  aiReviewStatus: 'aiReviewStatus',
  aiProcessedAt: 'aiProcessedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EvidenceScalarFieldEnum = {
  id: 'id',
  problemId: 'problemId',
  type: 'type',
  fileUrl: 'fileUrl',
  fileName: 'fileName',
  fileSize: 'fileSize',
  mimeType: 'mimeType',
  createdAt: 'createdAt'
};

exports.Prisma.AIAnalysisScalarFieldEnum = {
  id: 'id',
  problemId: 'problemId',
  provider: 'provider',
  summary: 'summary',
  extractedCategory: 'extractedCategory',
  urgencyScore: 'urgencyScore',
  severityScore: 'severityScore',
  recommendedDepartment: 'recommendedDepartment',
  requiredExpertise: 'requiredExpertise',
  confidence: 'confidence',
  rawOutput: 'rawOutput',
  createdAt: 'createdAt'
};

exports.Prisma.DuplicateMatchScalarFieldEnum = {
  id: 'id',
  sourceProblemId: 'sourceProblemId',
  matchedProblemId: 'matchedProblemId',
  semanticScore: 'semanticScore',
  geoDistanceMeters: 'geoDistanceMeters',
  categoryMatch: 'categoryMatch',
  totalDuplicateScore: 'totalDuplicateScore',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.PriorityAssessmentScalarFieldEnum = {
  id: 'id',
  problemId: 'problemId',
  totalScore: 'totalScore',
  populationImpact: 'populationImpact',
  severityFactor: 'severityFactor',
  urgencyFactor: 'urgencyFactor',
  recurrenceFactor: 'recurrenceFactor',
  safetyFactor: 'safetyFactor',
  explanation: 'explanation',
  humanOverride: 'humanOverride',
  overrideReason: 'overrideReason',
  createdAt: 'createdAt'
};

exports.Prisma.ChallengeScalarFieldEnum = {
  id: 'id',
  problemId: 'problemId',
  title: 'title',
  description: 'description',
  category: 'category',
  department: 'department',
  requiredExpertise: 'requiredExpertise',
  status: 'status',
  budgetEstimate: 'budgetEstimate',
  deadline: 'deadline',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TeamScalarFieldEnum = {
  id: 'id',
  name: 'name',
  institution: 'institution',
  leadName: 'leadName',
  leadEmail: 'leadEmail',
  leadPhone: 'leadPhone',
  skills: 'skills',
  createdAt: 'createdAt'
};

exports.Prisma.ProposalScalarFieldEnum = {
  id: 'id',
  challengeId: 'challengeId',
  teamId: 'teamId',
  title: 'title',
  description: 'description',
  technicalApproach: 'technicalApproach',
  prototypeUrl: 'prototypeUrl',
  researchUrl: 'researchUrl',
  estimatedCost: 'estimatedCost',
  expectedImpact: 'expectedImpact',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.EvaluationScalarFieldEnum = {
  id: 'id',
  proposalId: 'proposalId',
  reviewerName: 'reviewerName',
  feasibilityScore: 'feasibilityScore',
  scalabilityScore: 'scalabilityScore',
  innovationScore: 'innovationScore',
  technicalViability: 'technicalViability',
  overallScore: 'overallScore',
  comments: 'comments',
  createdAt: 'createdAt'
};

exports.Prisma.ImplementationScalarFieldEnum = {
  id: 'id',
  proposalId: 'proposalId',
  challengeId: 'challengeId',
  title: 'title',
  status: 'status',
  progressPercentage: 'progressPercentage',
  startedAt: 'startedAt',
  completedAt: 'completedAt'
};

exports.Prisma.MilestoneScalarFieldEnum = {
  id: 'id',
  implementationId: 'implementationId',
  title: 'title',
  description: 'description',
  orderIndex: 'orderIndex',
  dueDate: 'dueDate',
  status: 'status',
  proofEvidenceUrl: 'proofEvidenceUrl',
  completedAt: 'completedAt'
};

exports.Prisma.ImpactRecordScalarFieldEnum = {
  id: 'id',
  implementationId: 'implementationId',
  problemTitle: 'problemTitle',
  peopleImpacted: 'peopleImpacted',
  metricsSummary: 'metricsSummary',
  verifiedBy: 'verifiedBy',
  beforeAfterProofUrl: 'beforeAfterProofUrl',
  verifiedAt: 'verifiedAt'
};

exports.Prisma.FeedbackScalarFieldEnum = {
  id: 'id',
  problemId: 'problemId',
  citizenId: 'citizenId',
  rating: 'rating',
  comments: 'comments',
  isResolvedConfirmed: 'isResolvedConfirmed',
  createdAt: 'createdAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  entityType: 'entityType',
  entityId: 'entityId',
  action: 'action',
  performedBy: 'performedBy',
  details: 'details',
  createdAt: 'createdAt'
};

exports.Prisma.SponsorshipScalarFieldEnum = {
  id: 'id',
  challengeId: 'challengeId',
  organizationName: 'organizationName',
  contactEmail: 'contactEmail',
  contactPhone: 'contactPhone',
  pledgeType: 'pledgeType',
  amountOrDetails: 'amountOrDetails',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  User: 'User',
  UserRole: 'UserRole',
  Problem: 'Problem',
  Evidence: 'Evidence',
  AIAnalysis: 'AIAnalysis',
  DuplicateMatch: 'DuplicateMatch',
  PriorityAssessment: 'PriorityAssessment',
  Challenge: 'Challenge',
  Team: 'Team',
  Proposal: 'Proposal',
  Evaluation: 'Evaluation',
  Implementation: 'Implementation',
  Milestone: 'Milestone',
  ImpactRecord: 'ImpactRecord',
  Feedback: 'Feedback',
  AuditLog: 'AuditLog',
  Sponsorship: 'Sponsorship'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
