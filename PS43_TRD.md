# TRD — PS43 Societal Challenge Crowdsourcing & Collaborative Problem-Solving Platform

**Version:** 1.0  
**Status:** Technical Design / SIH Prototype  
**Architecture Style:** Modular monolith initially, service-oriented boundaries for future scale

---

## 1. Technical Objective

Build a secure, modular, API-first platform capable of handling the complete chain:

**Citizen → Problem → Evidence → Location → AI Processing → Verification → Priority → Department → Challenge → University/Industry → Proposal → Evaluation → Implementation → Impact**

The architecture should be simple enough for an SIH team to implement but structured enough to demonstrate production-oriented engineering.

---

## 2. Recommended Stack

### Frontend

- Next.js / React
- TypeScript
- Tailwind CSS
- MapLibre GL or Leaflet
- React Query/TanStack Query
- Accessible component system

### Backend

- Node.js
- NestJS or Express + TypeScript
- REST API
- WebSocket/SSE for selected real-time updates

### Database

- PostgreSQL
- PostGIS for geospatial data
- pgvector for semantic similarity/embeddings where available

### Object Storage

- S3-compatible object storage
- Store images, videos, audio, and documents outside the relational database

### Cache / Queue

- Redis
- BullMQ or equivalent job queue

### AI/ML

Use API/model abstraction rather than coupling the product to one model provider.

Services:

- Speech-to-text
- Text classification
- Embeddings
- Similarity search
- Moderation
- Structured extraction

### Authentication

- JWT access/refresh tokens or managed identity provider
- RBAC
- Secure password hashing if local authentication is used

### Maps

- OpenStreetMap-compatible map data/provider
- PostGIS for geographic queries

### Deployment

Prototype:

- Docker Compose
- Cloud VM/container platform

Production path:

- Managed PostgreSQL
- Object storage
- Redis
- Containerized backend
- CDN
- Reverse proxy/load balancer

---

## 3. High-Level Architecture

```text
                         ┌─────────────────────┐
                         │   Citizen Web/App   │
                         └──────────┬──────────┘
                                    │
                         ┌──────────▼──────────┐
                         │   Kiosk / Hardware  │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ API Gateway / BFF   │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼──────────────────────┐
              │                     │                      │
              ▼                     ▼                      ▼
      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
      │ Auth & RBAC  │      │ Problem Core │      │ Collaboration│
      └──────────────┘      └──────┬───────┘      └──────────────┘
                                    │
                         ┌──────────▼──────────┐
                         │ Async Processing    │
                         │ Queue / Workers     │
                         └───────┬───────┬─────┘
                                 │       │
                    ┌────────────┘       └─────────────┐
                    ▼                                  ▼
             ┌─────────────┐                    ┌─────────────┐
             │ AI Services │                    │ Moderation  │
             └──────┬──────┘                    └─────────────┘
                    │
                    ▼
          ┌────────────────────┐
          │ PostgreSQL/PostGIS │
          │ + pgvector         │
          └─────────┬──────────┘
                    │
          ┌─────────▼──────────┐
          │ Object Storage     │
          │ Media/Documents    │
          └────────────────────┘
```

---

## 4. Architecture Modules

### 4.1 Identity Module

Responsibilities:

- Authentication
- Authorization
- Role management
- Organization membership
- Profile management
- Session management

Roles:

```text
CITIZEN
GOVERNMENT_OFFICIAL
UNIVERSITY_MEMBER
INDUSTRY_PARTNER
RESEARCHER
ADMIN
```

Use least-privilege authorization.

---

### 4.2 Problem Module

Responsibilities:

- Create problem
- Update draft
- Submit
- Retrieve
- Track lifecycle
- Link evidence
- Link location
- Link affected-citizen reports

Core status enum:.

```text
DRAFT
SUBMITTED
AI_PROCESSED
PENDING_VERIFICATION
VERIFIED
REJECTED
ASSIGNED
UNDER_INVESTIGATION
SOLUTION_REQUIRED
COLLABORATION
SOLUTION_PROPOSED
APPROVED
IMPLEMENTATION
RESOLVED
CLOSED
```

---

### 4.3 Evidence Module

Store metadata in PostgreSQL and binary files in object storage.

Supported types:

```text
IMAGE
VIDEO
AUDIO
DOCUMENT
TEXT
```

Metadata:

- id
- problem_id
- type
- object_key
- MIME type
- size
- checksum
- upload status
- created_at
- moderation status

Generate signed URLs for controlled access.

---

### 4.4 Geospatial Module

PostGIS entities:

- latitude
- longitude
- district
- block
- village
- geometry

Required operations:

- Nearby problems
- Geographic clustering
- District filtering
- Heatmap aggregation
- Radius search

Example:

```sql
SELECT *
FROM problems
WHERE ST_DWithin(
  location,
  ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
  :radius
);
```

---

## 5. AI Processing Architecture

AI processing should be asynchronous.

```text
Upload
  ↓
Create Problem
  ↓
Queue AI Job
  ↓
Speech-to-Text (if audio/video)
  ↓
Text Normalization
  ↓
Classification
  ↓
Entity/Field Extraction
  ↓
Embedding Generation
  ↓
Duplicate Search
  ↓
Priority Recommendation
  ↓
Persist AI Analysis
  ↓
Human Verification
```

### AI Output Schema

```json
{
  "category": "Infrastructure",
  "problem_type": "Bridge Damage",
  "severity": 0.86,
  "urgency": 0.78,
  "department": "Public Works",
  "required_expertise": ["Civil Engineering", "GIS"],
  "summary": "Reported bridge damage affecting local access",
  "confidence": 0.91
}
```

AI output must include confidence and source/reference fields where possible.

---

## 6. Multilingual Strategy

Avoid creating a separate custom model for every language.

Recommended architecture:

```text
Voice / Video
      ↓
Speech-to-Text Service
      ↓
Detected Language
      ↓
Normalized Text
      ↓
Multilingual Embedding / LLM Processing
      ↓
Structured Problem
```

For unsupported/low-confidence speech:

- Preserve original audio.
- Ask for confirmation where practical.
- Allow official/manual correction.
- Do not block the report solely because automated transcription failed.

---

## 7. Duplicate Detection

Use a hybrid approach rather than relying only on AI.

### Signals

1. Text embedding similarity
2. Geographic distance
3. Category match
4. Time proximity
5. Evidence similarity
6. Shared entities/keywords

Conceptual score:

```text
DuplicateScore =
  0.45 * SemanticSimilarity +
  0.25 * GeoSimilarity +
  0.15 * CategorySimilarity +
  0.10 * TimeSimilarity +
  0.05 * EvidenceSimilarity
```

Thresholds should be configurable and validated against the team's dataset.

Suggested behavior:

```text
Score < 0.50       → New Problem
0.50–0.80          → Possible Duplicate
> 0.80             → Strong Duplicate Candidate
```

Do not automatically merge high-impact reports without authorized review.

---

## 8. Priority Engine

Priority is a recommendation, not a final government decision.

Example:

```text
PriorityScore =
  PopulationImpact +
  Severity +
  Urgency +
  Recurrence +
  EvidenceQuality +
  PublicImpact
```

Normalize every component to 0–1.

Store:

- Score
- Factors
- Version of scoring logic
- Generated timestamp
- Human override
- Override reason

This makes the decision auditable.

---

## 9. Verification Workflow

```text
SUBMITTED
    ↓
AI PROCESSING
    ↓
PENDING VERIFICATION
    ├──→ REQUEST INFORMATION
    ├──→ REJECT
    └──→ VERIFY
              ↓
           ASSIGN
```

Every action should create an audit event.

---

## 10. Challenge Architecture

A verified problem becomes a challenge when external expertise is required.

Relationship:

```text
Problem 1 ─────── Challenge 1
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
     University   Industry   Researcher
        Team       Partner
          │          │
          └───── Proposal ─────┘
```

---

## 11. Proposal & Evaluation

Proposal contains:

```text
id
challenge_id
team_id
title
description
technical_approach
prototype_url
research_url
estimated_cost
implementation_plan
expected_impact
required_resources
status
created_at
```

Evaluation contains:

```text
feasibility
cost
scalability
innovation
impact
technical_viability
implementation
overall_score
reviewer_id
comments
```

Use configurable weighted scoring rather than hard-coding one universal formula.

---

## 12. Collaboration & Team Model

A team can have:

- Team owner
- Members
- Skills
- Institution
- Projects
- Proposals

Industry members can be attached to a challenge/project through explicit collaboration records.

---

## 13. Implementation Tracking

Entities:

- Implementation
- Milestone
- Progress Update
- Deployment
- Impact Record

Example:

```text
Approved
   ↓
Implementation
   ↓
Milestone 1
   ↓
Milestone 2
   ↓
Deployment
   ↓
Impact Measurement
```

Each milestone contains:

- title
- description
- due date
- status
- evidence
- progress percentage
- update history

---

## 14. Data Model

Simplified relational model:

```text
users
  │
  ├── profiles
  └── organization_memberships

problems
  ├── problem_evidence
  ├── problem_locations
  ├── ai_analyses
  ├── priority_assessments
  ├── verifications
  ├── assignments
  ├── status_history
  └── feedback

problems
   │
   └── challenges
          ├── teams
          │    └── team_members
          ├── proposals
          │    └── evaluations
          └── implementations
                 ├── milestones
                 ├── progress_updates
                 └── impact_records
```

---

## 15. Important Database Tables

### users

```text
id
email/phone
password_hash or external_identity_id
role
status
created_at
updated_at
```

### problems

```text
id
public_problem_id
citizen_id
title
description
category_id
problem_type
status
severity
priority_score
department_id
location_id
created_at
updated_at
```

### ai_analyses

```text
id
problem_id
model/provider
model_version
summary
classification
confidence
raw_output
created_at
```

### challenges

```text
id
problem_id
title
description
required_expertise
status
deadline
created_by
created_at
```

### proposals

```text
id
challenge_id
team_id
title
description
technical_approach
estimated_cost
expected_impact
status
created_at
```

---

## 16. API Design

Base path:

```text
/api/v1
```

### Authentication

```http
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET  /auth/me
```

### Problems

```http
POST   /problems
GET    /problems
GET    /problems/:id
PATCH  /problems/:id
POST   /problems/:id/submit
GET    /problems/:id/timeline
POST   /problems/:id/feedback
```

### Evidence

```http
POST /problems/:id/evidence/upload
GET  /problems/:id/evidence
DELETE /evidence/:id
```

### Verification

```http
POST /problems/:id/verify
POST /problems/:id/reject
POST /problems/:id/request-information
POST /problems/:id/merge
POST /problems/:id/assign
```

### Challenges

```http
POST /challenges
GET  /challenges
GET  /challenges/:id
PATCH /challenges/:id
```

### Teams

```http
POST /teams
GET  /teams/:id
POST /teams/:id/members
DELETE /teams/:id/members/:memberId
```

### Proposals

```http
POST /challenges/:id/proposals
GET  /challenges/:id/proposals
GET  /proposals/:id
POST /proposals/:id/evaluations
```

### Implementation

```http
POST /proposals/:id/implementation
POST /implementations/:id/milestones
POST /milestones/:id/progress
POST /implementations/:id/impact
```

---

## 17. Async Jobs

Use a queue for expensive work.

Queues:

```text
media-processing
speech-transcription
ai-classification
embedding-generation
duplicate-detection
moderation
notifications
analytics
```

Benefits:

- Non-blocking uploads
- Retry failed jobs
- Better scalability
- Fault isolation
- Observable processing

---

## 18. File Upload Architecture

```text
Client
  ↓
Request Upload URL
  ↓
Backend Authorization
  ↓
Signed Upload URL
  ↓
Object Storage
  ↓
Upload Complete Event
  ↓
Processing Queue
  ↓
Moderation / Transcription / Metadata
```

Never store large media directly inside PostgreSQL.

Recommended protections:

- MIME validation
- File-size limits
- Malware scanning where available
- Checksum
- Signed URLs
- Access-control checks

---

## 19. Security Requirements

### Authentication

- Strong password hashing
- Token expiration
- Refresh-token rotation where applicable
- Rate limiting
- Account/session controls

### Authorization

Enforce RBAC on the backend, not only in frontend UI.

### Data Protection

- HTTPS
- Encryption at rest through managed infrastructure where available
- Minimal collection of personal information
- Private evidence by default
- Signed media URLs

### Abuse Protection

- Rate limiting
- Input validation
- File validation
- Content moderation
- Audit logs

### Auditability

Log:

- Verification actions
- Rejections
- Duplicate merges
- Assignments
- Priority overrides
- Proposal evaluations
- Implementation status changes
- Administrative changes

---

## 20. Privacy

Separate:

1. Public challenge information
2. Citizen identity/profile information
3. Sensitive evidence
4. Internal government workflow information

A citizen's personal information should not automatically become public challenge information.

Provide configurable privacy controls and retention policies.

---

## 21. Observability

Use:

- Structured application logs
- Request IDs
- Error tracking
- Queue metrics
- Database performance metrics
- API latency metrics
- AI processing latency
- Job failure/retry metrics

Important dashboards:

```text
API health
Queue health
AI processing
Database
Storage
Authentication failures
```

---

## 22. Testing Strategy

### Unit Tests

- Priority calculations
- Duplicate scoring
- Authorization policies
- Validation
- State transitions

### Integration Tests

- Authentication flow
- Problem submission
- Evidence upload
- AI processing pipeline
- Verification
- Challenge creation
- Proposal submission

### End-to-End Test

Test the full flow:

```text
Citizen submits bridge problem
→ AI processes
→ duplicate reports grouped
→ official verifies
→ high priority assigned
→ challenge published
→ university team applies
→ proposal evaluated
→ implementation created
→ milestone updated
→ impact recorded
→ citizen feedback
```

---

## 23. State-Machine Rules

Prevent invalid transitions.

Example:

```text
DRAFT → SUBMITTED
SUBMITTED → AI_PROCESSED
AI_PROCESSED → PENDING_VERIFICATION
PENDING_VERIFICATION → VERIFIED
PENDING_VERIFICATION → REJECTED
PENDING_VERIFICATION → REQUEST_INFORMATION
VERIFIED → ASSIGNED
ASSIGNED → UNDER_INVESTIGATION
UNDER_INVESTIGATION → SOLUTION_REQUIRED
SOLUTION_REQUIRED → COLLABORATION
COLLABORATION → SOLUTION_PROPOSED
SOLUTION_PROPOSED → APPROVED
APPROVED → IMPLEMENTATION
IMPLEMENTATION → RESOLVED
RESOLVED → CLOSED
```

All transitions should be permission-checked and audited.

---

## 24. Hardware/Kiosk Technical Design

### Objective

Provide a simple physical interface for users who may struggle with a conventional digital interface.

### Prototype Hardware

Possible components:

- ESP32
- Physical push buttons
- Microphone
- Camera module or connected camera
- Optional document scanner
- Wi-Fi
- Status LEDs/buzzer/display

### Interaction

```text
[ RECORD ] [ PHOTO ] [ DOCUMENT ]
```

Pressing a button starts the corresponding capture workflow.

The controller communicates with a kiosk application/backend gateway.

### Important Architecture Decision

The hardware should **not** run the AI pipeline.

```text
Hardware
   ↓
Kiosk Client
   ↓
Backend
   ↓
AI / Processing
```

This keeps the device inexpensive and maintainable.

---

## 25. API Security for Hardware

Use device registration and short-lived credentials.

Each device should have:

```text
device_id
device_status
location
firmware_version
last_seen
credential_reference
```

Do not embed a permanent privileged backend secret in firmware.

---

## 26. Performance Targets

Prototype targets:

- API p95 latency: <500 ms for normal CRUD operations
- Dashboard query: <2 s under demo load
- Upload initiation: <500 ms
- Async AI processing: preferably <30 s for normal text/image cases
- Queue retries: exponential backoff
- Pagination on all large collections

Targets should be benchmarked rather than treated as guaranteed production SLAs.

---

## 27. Scalability Strategy

### SIH

Start with:

```text
Next.js
   +
Node/NestJS
   +
PostgreSQL/PostGIS
   +
Redis
   +
Object Storage
```

### Future Scale

Separate high-load components:

```text
API
AI Workers
Media Processing
Notification Service
Search
Analytics
```

Use horizontal workers and queues rather than prematurely creating many microservices.

---

## 28. Deployment

### Development

```text
Docker Compose
├── frontend
├── backend
├── postgres
├── redis
└── object-storage
```

### Production Direction

```text
CDN
 ↓
Load Balancer
 ↓
Frontend / API
 ↓
Managed PostgreSQL
 ↓
Redis
 ↓
Worker Fleet
 ↓
Object Storage
```

Use CI/CD with:

- Lint
- Type checking
- Unit tests
- Integration tests
- Build
- Security checks
- Deployment

---

## 29. Suggested Repository Structure

```text
ps43-platform/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   ├── ui/
│   ├── types/
│   └── config/
├── workers/
│   ├── ai/
│   ├── media/
│   └── notifications/
├── hardware/
│   └── kiosk-controller/
├── database/
│   ├── migrations/
│   └── seeds/
├── docs/
│   ├── PRD.md
│   ├── TRD.md
│   └── API.md
└── docker-compose.yml
```

---

## 30. SIH Implementation Priority

### Phase 1 — Foundation

- Authentication
- RBAC
- Database
- Citizen submission
- Media storage
- Basic location

### Phase 2 — Intelligence

- Speech-to-text
- Classification
- Structured extraction
- Duplicate detection
- Priority recommendation

### Phase 3 — Governance

- Verification
- Department assignment
- Government dashboard
- Lifecycle tracking

### Phase 4 — Collaboration

- Challenges
- University teams
- Proposals
- Industry participation
- Evaluation

### Phase 5 — Impact

- Implementation
- Milestones
- Citizen feedback
- Analytics
- Impact dashboard

### Phase 6 — Hardware Demo

- ESP32/controller
- Three-button interaction
- Capture/upload
- Backend integration

---

## 31. Architecture Decision Summary

| Decision | Choice | Reason |
|---|---|---|
| Initial backend | Modular monolith | Faster SIH development |
| Database | PostgreSQL | Strong relational model |
| Geospatial | PostGIS | Native location queries |
| Similarity | pgvector | Avoid separate vector DB initially |
| Media | Object storage | Efficient large-file handling |
| Async | Redis + queue | AI/media workloads |
| AI | Provider/model abstraction | Avoid vendor lock-in |
| Hardware | Input layer | Keeps device simple |
| Auth | RBAC | Multiple stakeholder types |
| Verification | Human-in-loop | Governance safety |
| Deployment | Docker | Reproducibility |

---

## 32. Final Technical Principle

The platform should not be presented as simply an AI complaint portal.

Its technical differentiator is the **end-to-end societal problem graph and lifecycle**:

```text
CITIZEN
   ↓
PROBLEM
   ↓
EVIDENCE + LOCATION
   ↓
AI STRUCTURING
   ↓
DUPLICATE DETECTION
   ↓
VERIFICATION
   ↓
PRIORITIZATION
   ↓
DEPARTMENT
   ↓
SOCIETAL CHALLENGE
   ↓
UNIVERSITY / INDUSTRY
   ↓
PROPOSAL
   ↓
EVALUATION
   ↓
IMPLEMENTATION
   ↓
IMPACT
   ↓
CITIZEN FEEDBACK
```

The architecture should preserve traceability across every stage so that the original citizen report remains connected to the final solution and measurable impact.
