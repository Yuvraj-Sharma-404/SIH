# PRD — PS43 Societal Challenge Crowdsourcing & Collaborative Problem-Solving Platform

**Version:** 1.0  
**Status:** Draft / SIH Prototype  
**Category:** Digital Governance / Social Innovation / AI / Civic Technology

---

## 1. Product Overview

Build a digital platform that allows citizens to report, document, and track societal challenges and connects verified challenges with government departments, universities, researchers, startups, and industry partners.

The product is designed around:

> **REPORT → UNDERSTAND → PRIORITIZE → COLLABORATE → SOLVE → MEASURE**

The platform must support low-digital-literacy citizens through a simple citizen interface and an optional assisted kiosk/hardware input layer.

---

## 2. Problem

Existing complaint/reporting systems primarily focus on registration and departmental resolution. They do not adequately create a structured bridge between:

- Citizens who experience problems
- Government departments that own the problem
- Universities/researchers that can develop solutions
- Industry/startups that can provide technology, expertise, funding, or implementation
- Evidence and measurable real-world impact

PS43 requires a complete lifecycle from citizen report to measurable impact.

---

## 3. Product Goals

### Primary Goals

1. Make societal problem reporting accessible to citizens with limited digital literacy.
2. Accept text, images, videos, voice, documents, and location.
3. Convert unstructured reports into structured problems.
4. Detect duplicate/related reports.
5. Assist verification, prioritization, and department assignment.
6. Convert verified problems into collaborative societal challenges.
7. Allow university and industry participation.
8. Support proposal evaluation and implementation tracking.
9. Allow citizens to track progress and provide feedback.
10. Measure resolution and social impact.

### Non-Goals for MVP

- Replacing existing government departmental systems.
- Fully autonomous government decision-making.
- Building separate AI models for every regional language.
- Fully autonomous verification of sensitive/high-impact claims.
- Building a production-grade nationwide hardware network during the SIH prototype.

---

## 4. Target Users

| User | Main Need |
|---|---|
| Citizen | Report and track problems easily |
| Low-literacy Citizen | Report through assisted/simple interface |
| Government Official | Verify, prioritize, assign, and track problems |
| University Team | Discover challenges and submit solutions |
| Researcher | Find research-oriented societal problems |
| Industry Partner | Mentor, sponsor, implement, or provide expertise |
| Administrator | Manage users, departments, challenges, moderation, and platform configuration |

---

## 5. Core User Journeys

### Citizen

Register/Login → Report Problem → Add Evidence/Location → Submit → Receive Problem ID → Track Status → Receive Updates → Give Resolution Feedback.

### Government

Login → View Incoming Reports → Review AI-structured information → Verify/Reject/Request Information → Merge Duplicates → Assign Department → Prioritize → Track Resolution.

### University

Register Institution → Create Team → Set Skills → Browse Verified Challenges → Apply → Submit Proposal → Track Evaluation → Develop/Implement Solution.

### Industry

Register Organization → Define Expertise → Discover Challenges → Offer Support/Mentorship/Funding/Implementation → Collaborate → Track Impact.

---

## 6. Functional Requirements

### FR-01 Authentication & Profiles

- Citizen registration/login
- Role-based authentication
- Profile management
- Notification preferences
- Privacy controls
- Submitted-problem history

### FR-02 Problem Submission

A citizen can submit:

- Text
- Image
- Video
- Voice recording
- Document
- Location

The submission flow must minimize the number of steps.

### FR-03 Assisted Kiosk

The optional kiosk/hardware layer provides simple physical controls such as:

- Record
- Capture Photo
- Upload/Scan Document

The kiosk is an accessibility/input layer; central processing remains on the platform.

### FR-04 Location

Support:

- GPS location
- Manual location
- District/block/village mapping
- Interactive maps
- Heatmaps
- Location-based filtering

### FR-05 AI-Assisted Structuring

Extract/estimate:

- Category
- Problem type
- Location
- Severity
- Relevant department
- Required expertise
- Keywords/entities

AI output must be treated as assistance, not final authority.

### FR-06 Multilingual/Voice Workflow

Preferred pipeline:

**Voice → Speech Processing → Structured Problem Data**

The architecture should use reusable speech/language services where practical rather than requiring a separate custom model for every language.

### FR-07 Duplicate Detection

Identify related submissions using signals such as:

- Semantic similarity
- Location proximity
- Category similarity
- Evidence similarity
- Time/recurrence

Related reports should be grouped around one underlying societal problem while preserving affected-citizen evidence.

### FR-08 Verification

Lifecycle:

**Submitted → AI Processed → Pending Verification → Verified/Rejected/More Information**

Officials can:

- Verify
- Reject
- Request information
- Merge duplicates
- Assign departments

### FR-09 Priority Assessment

Priority should consider:

- Affected population
- Severity
- Location
- Recurrence
- Evidence quality
- Urgency
- Public impact

The system should explain why a problem received a particular priority.

### FR-10 Government Dashboard

Display:

- Total problems
- Pending
- Verified
- Under investigation
- Resolved
- High priority
- Department-wise distribution
- District-wise distribution
- Map visualization
- Analytics

### FR-11 University Collaboration Hub

University users can:

- Discover challenges
- Form teams
- Apply
- Submit proposals
- Upload research
- Develop prototypes
- Track milestones

### FR-12 Industry Collaboration

Industry can provide:

- Technology
- Mentorship
- Sponsorship
- Infrastructure
- Expertise
- Product development
- Implementation partnership

### FR-13 Challenge Management

Verified problems requiring external expertise can be converted into formal Societal Challenges.

### FR-14 Proposal Management

Proposal fields:

- Solution description
- Technical approach
- Prototype/research
- Estimated cost
- Implementation plan
- Expected impact
- Required resources

### FR-15 Evaluation

Authorized evaluators score proposals on:

- Feasibility
- Cost
- Scalability
- Innovation
- Expected impact
- Technical viability
- Implementation requirements

### FR-16 Implementation Tracking

Track:

**Approved → Implementation Started → Milestones → Progress Updates → Deployment → Impact Measurement**

### FR-17 Citizen Feedback

Citizens can:

- Track status
- View appropriate responsible department information
- Receive updates
- Provide feedback
- Confirm whether a reported issue appears resolved

### FR-18 Notifications

Notify on:

- Submission
- Verification
- Assignment
- Status changes
- Information requests
- Proposal events
- Implementation start
- Resolution

### FR-19 Search & Discovery

Filter by:

- Category
- Location
- Severity
- Status
- Expertise
- Department
- Keywords
- Date

### FR-20 Analytics & Impact

Measure:

- Problems reported
- Problems resolved
- Average resolution time
- Category/geographic distribution
- Participating universities
- Industry partners
- Solutions developed
- People impacted

### FR-21 Administration

Admins manage:

- Users
- Roles
- Departments
- Universities
- Industry partners
- Problems
- Categories
- Challenges
- Proposals
- Reports
- Moderation
- Platform configuration

### FR-22 Moderation

Moderate:

- Text
- Images
- Videos
- Audio
- Documents

Detect or flag inappropriate, irrelevant, malicious, or invalid submissions.

---

## 7. Problem Lifecycle

```text
SUBMITTED
   ↓
AI PROCESSED
   ↓
PENDING VERIFICATION
   ↓
VERIFIED
   ↓
ASSIGNED
   ↓
UNDER INVESTIGATION
   ↓
SOLUTION REQUIRED
   ↓
COLLABORATION
   ↓
SOLUTION PROPOSED
   ↓
APPROVED
   ↓
IMPLEMENTATION
   ↓
RESOLVED
   ↓
CITIZEN FEEDBACK
   ↓
CLOSED
```

---

## 8. Key Product Objects

- User
- Citizen Profile
- Organization
- Government Department
- University
- Industry Partner
- Problem
- Evidence
- Location
- AI Analysis
- Verification
- Priority Assessment
- Societal Challenge
- Team
- Proposal
- Evaluation
- Milestone
- Implementation
- Impact Record
- Feedback
- Notification
- Audit Log

---

## 9. MVP Scope for SIH

### Must Have

1. Citizen submission
2. Image/voice/text support
3. Location capture
4. AI-assisted categorization
5. Duplicate detection
6. Verification workflow
7. Priority score
8. Government dashboard
9. Challenge creation
10. University team/proposal workflow
11. Basic industry participation
12. Citizen tracking
13. Notifications
14. Map/analytics
15. Role-based access

### Demo Hardware

A simple kiosk/controller with 3 physical actions:

**RECORD | PHOTO | DOCUMENT**

The prototype should demonstrate how the hardware submits input to the same backend used by the web application.

---

## 10. Success Metrics

| Metric | Target for Prototype |
|---|---:|
| Submission completion | >90% in usability test |
| AI categorization usefulness | >80% acceptable by evaluator |
| Duplicate detection precision | >80% on demo dataset |
| Citizen status visibility | 100% of submitted demo cases |
| Role authorization | 100% tested protected routes |
| End-to-end demo lifecycle | At least 1 complete challenge |
| Dashboard response | <2 sec for normal queries |

---

## 11. Product Principles

1. **Simplicity first** for citizens.
2. **Human-in-the-loop** for government decisions.
3. **Evidence over assumptions.**
4. **One underlying problem, multiple citizen reports.**
5. **Transparent lifecycle.**
6. **Privacy by design.**
7. **AI as an assistant, not an authority.**
8. **Impact must be measurable.**
