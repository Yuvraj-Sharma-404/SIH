import { Report, Challenge, SolutionSubmission } from '../types';

export const INITIAL_REPORTS: Report[] = [
  {
    id: 'JH-2026-0042',
    citizenName: 'Rameshwar Mahato',
    citizenPhone: '+91 98351 *****',
    title: 'Severe Road Damage & Crater on NH-33 Village Crossing',
    description: 'Deep road potholes near Morabadi-Kanke bypass causing regular motorcycle accidents and heavy traffic delay.',
    inputType: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    category: 'Road Infrastructure',
    location: {
      village: 'Kanke Panchayat',
      block: 'Kanke Block',
      district: 'Ranchi',
      state: 'Jharkhand',
      latitude: 23.4012,
      longitude: 85.3201,
      addressDetails: 'Near Kanke Block Chowk, opposite Primary Health Center'
    },
    language: 'Hindi',
    aiClassification: {
      suggestedCategory: 'Road Infrastructure',
      confidence: 0.96,
      extractedKeywords: ['pothole', 'road damage', 'traffic block', 'accident hazard'],
      sentimentScore: 'High Urgency',
      isDuplicateDetected: false
    },
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assignedAuthority: {
      department: 'Public Works Department (PWD) - Roads Division Ranchi',
      officerName: 'Er. Arvind Kumar (Executive Engineer)',
      contactPhone: '0651-2401823'
    },
    createdAt: '2026-09-01T09:30:00Z',
    updatedAt: '2026-09-03T14:20:00Z',
    upvotes: 42,
    isChallenge: false,
    timeline: [
      {
        id: 'tl-1',
        status: 'SUBMITTED',
        title: 'Report Received via Photo Upload',
        description: 'Grievance submitted by citizen via Mobile App. Auto GPS recorded Kanke Block.',
        timestamp: '01 Sep 2026, 09:30 AM',
        updatedBy: 'System AI Engine',
        role: 'Automated System'
      },
      {
        id: 'tl-2',
        status: 'VERIFIED',
        title: 'Field Verification Completed',
        description: 'Junior Engineer verified severity score (8.5/10). Road width damage > 1.2 meters.',
        timestamp: '02 Sep 2026, 11:15 AM',
        updatedBy: 'Sanjay Minz',
        role: 'Field Inspector',
        department: 'PWD Ranchi'
      },
      {
        id: 'tl-3',
        status: 'ASSIGNED',
        title: 'Work Order Issued to Road Repair Wing',
        description: 'Assigned to Contractor M/s Jharkhand Infra Infra-Tech for cold-mix patching.',
        timestamp: '02 Sep 2026, 03:45 PM',
        updatedBy: 'Er. Arvind Kumar',
        role: 'Executive Engineer',
        department: 'PWD'
      },
      {
        id: 'tl-4',
        status: 'IN_PROGRESS',
        title: 'Heavy Machinery & Tar Crew Deployed',
        description: 'Leveling and bitumen filling in progress. Expected resolution within 48 hours.',
        timestamp: '03 Sep 2026, 02:20 PM',
        updatedBy: 'Site Supervisor',
        role: 'Department Representative'
      }
    ]
  },
  {
    id: 'JH-2026-0089',
    citizenName: 'Sunita Devi',
    citizenPhone: '+91 70042 *****',
    title: 'Drinking Water Pipeline Leakage & Contamination',
    description: 'Main overhead pipeline broken near village handpump area. Dirty water accumulating and clean drinking water stopped.',
    inputType: 'voice',
    mediaUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80',
    category: 'Water Supply',
    location: {
      village: 'Tupudana Village',
      block: 'Namkum Block',
      district: 'Ranchi',
      state: 'Jharkhand',
      latitude: 23.2981,
      longitude: 85.3129,
      addressDetails: 'Tupudana Industrial Area Road No 4'
    },
    language: 'Nagpuri',
    aiClassification: {
      suggestedCategory: 'Water Supply',
      confidence: 0.92,
      extractedKeywords: ['water pipe broken', 'dirty water', 'handpump dry', 'villagers issue'],
      sentimentScore: 'Critical Need',
      isDuplicateDetected: true,
      duplicateOfId: 'JH-2026-0085'
    },
    priority: 'CRITICAL',
    status: 'ASSIGNED',
    assignedAuthority: {
      department: 'Drinking Water & Sanitation Department (DWSD)',
      officerName: 'Smt. Priya Soreng (Assistant Engineer)',
      contactPhone: '0651-2281900'
    },
    createdAt: '2026-09-02T11:10:00Z',
    updatedAt: '2026-09-03T10:00:00Z',
    upvotes: 89,
    isChallenge: true,
    timeline: [
      {
        id: 'tl-10',
        status: 'SUBMITTED',
        title: 'Voice Grievance Recorded',
        description: 'Audio message transcribed using AI Speech-to-Text service.',
        timestamp: '02 Sep 2026, 11:10 AM',
        updatedBy: 'AI Audio Processing',
        role: 'Automated System'
      },
      {
        id: 'tl-11',
        status: 'UNDER_REVIEW',
        title: 'Duplicate Grouping & Cluster Identification',
        description: 'Merged with 4 similar complaints from same locality.',
        timestamp: '02 Sep 2026, 01:00 PM',
        updatedBy: 'System AI Classifier',
        role: 'Automated System'
      },
      {
        id: 'tl-12',
        status: 'ASSIGNED',
        title: 'Assigned to DWSD Namkum Maintenance Division',
        description: 'Water tanker dispatched while pipe repair team evaluates main valve replacing.',
        timestamp: '03 Sep 2026, 10:00 AM',
        updatedBy: 'Priya Soreng',
        role: 'Assistant Engineer',
        department: 'DWSD'
      }
    ]
  },
  {
    id: 'JH-2026-0112',
    citizenName: 'Birsa Munda Youth Club',
    citizenPhone: '+91 94311 *****',
    title: 'Transformer Burnt & Village Power Blackout for 4 Days',
    description: '100 KVA electrical transformer blew out during storm. Entire Panchayat streetlights and homes without power.',
    inputType: 'video',
    mediaUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    category: 'Electricity & Streetlights',
    location: {
      village: 'Ormanjhi Panchayat',
      block: 'Ormanjhi Block',
      district: 'Ranchi',
      state: 'Jharkhand',
      latitude: 23.4792,
      longitude: 85.4719,
      addressDetails: 'Behind Ormanjhi High School Ground'
    },
    language: 'Hindi',
    aiClassification: {
      suggestedCategory: 'Electricity & Streetlights',
      confidence: 0.98,
      extractedKeywords: ['transformer burnt', 'no light', 'blackout', 'storm damage'],
      sentimentScore: 'High Severity',
      isDuplicateDetected: false
    },
    priority: 'HIGH',
    status: 'RESOLVED',
    assignedAuthority: {
      department: 'Jharkhand Bijli Vitran Nigam Limited (JBVNL)',
      officerName: 'Shri R.K. Verma (Sub-Divisional Officer)',
      contactPhone: '1912'
    },
    createdAt: '2026-08-30T16:00:00Z',
    updatedAt: '2026-09-02T17:30:00Z',
    upvotes: 124,
    isChallenge: false,
    timeline: [
      {
        id: 'tl-20',
        status: 'SUBMITTED',
        title: 'Video Evidence Uploaded',
        description: 'Citizen captured video footage of smoke from transformer unit.',
        timestamp: '30 Aug 2026, 04:00 PM',
        updatedBy: 'Citizen App',
        role: 'Citizen User'
      },
      {
        id: 'tl-21',
        status: 'VERIFIED',
        title: 'JBVNL Quick Response Team Inspection',
        description: 'Coil burnout confirmed. Replacement unit requisitioned from Ranchi Central Store.',
        timestamp: '31 Aug 2026, 09:00 AM',
        updatedBy: 'R.K. Verma',
        role: 'SDO',
        department: 'JBVNL'
      },
      {
        id: 'tl-22',
        status: 'IN_PROGRESS',
        title: 'New Transformer Mounted & Crane Support',
        description: 'Fresh 100KVA unit delivered to Ormanjhi site.',
        timestamp: '01 Sep 2026, 02:00 PM',
        updatedBy: 'Linesman Team 4',
        role: 'Field Team'
      },
      {
        id: 'tl-23',
        status: 'RESOLVED',
        title: 'Electricity Restored & Tested',
        description: 'Power grid energized. Village sarpanch digital confirmation logged.',
        timestamp: '02 Sep 2026, 05:30 PM',
        updatedBy: 'Shri R.K. Verma',
        role: 'SDO JBVNL'
      }
    ]
  },
  {
    id: 'JH-2026-0145',
    citizenName: 'Anita Hembram',
    citizenPhone: '+91 88771 *****',
    title: 'Solid Waste Dumping Near Rural Health Center',
    description: 'Unchecked plastic waste dump accumulating near maternal health clinic, spreading foul odor and flies.',
    inputType: 'text',
    category: 'Sanitation & Waste',
    location: {
      village: 'Gobindpur',
      block: 'Gobindpur Block',
      district: 'Dhanbad',
      state: 'Jharkhand',
      latitude: 23.8340,
      longitude: 86.5218,
      addressDetails: 'Adjacent to Community Health Center Gate 2'
    },
    language: 'Santhali',
    aiClassification: {
      suggestedCategory: 'Sanitation & Waste',
      confidence: 0.89,
      extractedKeywords: ['garbage dump', 'health clinic', 'smell', 'mosquito hazard'],
      sentimentScore: 'Moderate Concern',
      isDuplicateDetected: false
    },
    priority: 'MEDIUM',
    status: 'SUBMITTED',
    createdAt: '2026-09-04T08:15:00Z',
    updatedAt: '2026-09-04T08:15:00Z',
    upvotes: 18,
    isChallenge: false,
    timeline: [
      {
        id: 'tl-30',
        status: 'SUBMITTED',
        title: 'Grievance Registered',
        description: 'Complaint entered into system queue for Dhanbad Municipal Corporation triage.',
        timestamp: '04 Sep 2026, 08:15 AM',
        updatedBy: 'System Portal',
        role: 'Automated System'
      }
    ]
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'CH-2026-01',
    reportId: 'JH-2026-0089',
    title: 'Low-Cost Sustainable Water Purification & Leak Alert System for Rural Namkum',
    category: 'Water Supply',
    district: 'Ranchi District',
    description: 'Namkum block experiences recurring contamination and main pipeline pressure drops due to illegal taps and soil erosion. We invite engineering institutes, startups, and innovation labs to propose decentralized low-cost sensor or filtration models.',
    impactScore: 'High Impact (5,000+ Villagers Affected)',
    affectedPopulationEstimate: 5200,
    solutionsSubmittedCount: 6,
    createdAt: '2026-09-03T12:00:00Z',
    status: 'OPEN'
  },
  {
    id: 'CH-2026-02',
    reportId: 'JH-2026-0042',
    title: 'Smart Pothole & Blackspot Predictive Warning Dashboard using Citizen Crowdsourcing',
    category: 'Road Infrastructure',
    district: 'Ranchi & Ramgarh',
    description: 'Transform raw photo/video reports into GIS heatmaps that auto-estimate repair material budgets and alert highway authorities before monsoon erosion deepens.',
    impactScore: 'Statewide Safety Initiative',
    affectedPopulationEstimate: 45000,
    solutionsSubmittedCount: 11,
    createdAt: '2026-08-28T10:00:00Z',
    status: 'UNDER_REVIEW'
  }
];

export const INITIAL_SOLUTIONS: SolutionSubmission[] = [
  {
    id: 'SOL-101',
    challengeId: 'CH-2026-01',
    contributorName: 'Team JalShakti - BIT Mesra',
    organizationType: 'University',
    organizationName: 'Birla Institute of Technology (BIT) Mesra',
    title: 'IoT Pressure Node & Bio-Sand Solar Filtration Unit',
    proposalSummary: 'Deploying ₹850 LoRaWAN pressure sensors on main valves coupled with gravity-fed bio-sand filters requiring zero grid power.',
    estimatedCost: '₹45,000 per village cluster',
    timelineDays: 21,
    submittedAt: '2026-09-04T06:00:00Z',
    status: 'SHORTLISTED'
  },
  {
    id: 'SOL-102',
    challengeId: 'CH-2026-01',
    contributorName: 'CleanWater Foundation NGO',
    organizationType: 'NGO',
    organizationName: 'Gramin Vikas Samiti Ranchi',
    title: 'Community Water Safety Committee & Chlorination Kit Distribution',
    proposalSummary: 'Empowering local Jal Sahiya women groups with handheld digital water quality testers and rapid dosing kits.',
    estimatedCost: '₹12,000 total block budget',
    timelineDays: 10,
    submittedAt: '2026-09-03T18:30:00Z',
    status: 'SUBMITTED'
  }
];
