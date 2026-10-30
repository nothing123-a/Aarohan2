export type Role = "student" | "institution" | "admin";

export type GrievanceStatus = 
  | "Submitted" 
  | "Under Review" 
  | "Forwarded to PGRC" 
  | "Action Required" 
  | "In Progress" 
  | "Resolved" 
  | "Escalated";

export type Priority = "Low" | "Medium" | "High" | "Critical";

export type RegionalBureau = 
  | "Northern Region (RO Kanpur)"
  | "Southern Region (RO Chennai)"
  | "Western Region (RO Mumbai)"
  | "Eastern Region (RO Kolkata)"
  | "Central Region (RO Bhopal)"
  | "North-West Region (RO Chandigarh)"
  | "South-West Region (RO Bangalore)";

export type Category = 
  | "Ragging & Harassment"
  | "Academic & Curriculum"
  | "Fee Dispute & Scholarship"
  | "Hostel & Infrastructure"
  | "Faculty & Staff Conduct"
  | "Examination & Results"
  | "Admission Irregularity";

export interface GrievanceTimelineItem {
  date: string;
  title: string;
  actor: string;
  description: string;
}

export interface GrievanceResponse {
  id: string;
  date: string;
  responderRole: "institution" | "admin" | "student";
  responderName: string;
  message: string;
  documents?: { name: string; size: string }[];
}

export interface Grievance {
  id: string;
  trackingNumber: string;
  complainantName: string;
  complainantEmail: string;
  complainantRole: "Student" | "Faculty" | "Staff";
  isAnonymous: boolean;
  institutionName: string;
  institutionId: string;
  regionalBureau: RegionalBureau;
  pgrcCell: string; // e.g. "PGRC Cell - Delhi Tech University"
  category: Category;
  subject: string;
  description: string;
  priority: Priority;
  status: GrievanceStatus;
  createdAt: string;
  lastUpdated: string;
  slaDaysRemaining: number;
  documents: { name: string; size: string }[];
  responses: GrievanceResponse[];
  timeline: GrievanceTimelineItem[];
  isDuplicateFlagged?: boolean;
  duplicateClusterId?: string;
  duplicateScore?: number; // e.g. 94% similarity
}

export const initialGrievances: Grievance[] = [
  {
    id: "GRV-2026-001",
    trackingNumber: "AICTE-2026-DL-8901",
    complainantName: "Aarav Sharma",
    complainantEmail: "aarav.sharma@dtu.ac.in",
    complainantRole: "Student",
    isAnonymous: false,
    institutionName: "Delhi Technological University (DTU)",
    institutionId: "AICTE-1-4921029",
    regionalBureau: "North-West Region (RO Chandigarh)",
    pgrcCell: "PGRC Cell - DTU Main Campus",
    category: "Fee Dispute & Scholarship",
    subject: "Refusal to refund caution deposit after degree completion",
    description: "I graduated in July 2025 and applied for my caution deposit refund (INR 15,000) through proper channels. The accounts department has delayed it over 8 months without written justification.",
    priority: "Medium",
    status: "Under Review",
    createdAt: "2026-10-22",
    lastUpdated: "2026-10-24",
    slaDaysRemaining: 7,
    documents: [
      { name: "No_Dues_Certificate.pdf", size: "1.2 MB" },
      { name: "Fee_Receipt_Original.pdf", size: "840 KB" }
    ],
    responses: [
      {
        id: "R-1",
        date: "2026-10-24 11:30 AM",
        responderRole: "institution",
        responderName: "DTU Accounts Cell",
        message: "The application has been forwarded to the finance auditor for reconciliation. Batch clearance will be issued within 10 working days.",
        documents: [{ name: "Internal_Audit_Memo.pdf", size: "450 KB" }]
      }
    ],
    timeline: [
      { date: "2026-10-22", title: "Grievance Lodged", actor: "Complainant", description: "Complaint filed via AICTE Grievance360 portal." },
      { date: "2026-10-23", title: "Automated AICTE Screening", actor: "System", description: "Verified complainant credentials and mapped to DTU PGRC." },
      { date: "2026-10-24", title: "Institution Response Logged", actor: "DTU PGRC Cell", description: "Audit memo attached by Accounts Officer." }
    ],
    isDuplicateFlagged: true,
    duplicateClusterId: "CLUSTER-FEE-DTU",
    duplicateScore: 92
  },
  {
    id: "GRV-2026-002",
    trackingNumber: "AICTE-2026-MH-4421",
    complainantName: "Ananya Deshmukh",
    complainantEmail: "ananya.d@coep.ac.in",
    complainantRole: "Student",
    isAnonymous: false,
    institutionName: "College of Engineering Pune (COEP)",
    institutionId: "AICTE-1-1029384",
    regionalBureau: "Western Region (RO Mumbai)",
    pgrcCell: "PGRC Cell - COEP Pune",
    category: "Ragging & Harassment",
    subject: "Hostel Block B senior batch verbal harassment during late night roll call",
    description: "Seniors from 4th year forced 1st year students to assemble after 11 PM and verbally harassed junior students. Warden notified but no formal inquiry was initiated.",
    priority: "Critical",
    status: "Escalated",
    createdAt: "2026-10-26",
    lastUpdated: "2026-10-29",
    slaDaysRemaining: 2,
    documents: [
      { name: "Warden_Complaint_Copy.pdf", size: "620 KB" }
    ],
    responses: [
      {
        id: "R-2",
        date: "2026-10-27 03:15 PM",
        responderRole: "institution",
        responderName: "COEP Anti-Ragging Committee",
        message: "Anti-Ragging Squad conducted a preliminary meeting. Statements of hostel residents are being recorded.",
        documents: [{ name: "Meeting_Minutes_AntiRagging.pdf", size: "1.8 MB" }]
      },
      {
        id: "R-3",
        date: "2026-10-29 10:00 AM",
        responderRole: "admin",
        responderName: "AICTE Western Bureau Officer",
        message: "Escalated to State Level Anti-Ragging Monitoring Committee. Immediate hearing mandated within 48 hours."
      }
    ],
    timeline: [
      { date: "2026-10-26", title: "Critical Grievance Lodged", actor: "Complainant", description: "Marked Critical under AICTE Anti-Ragging Regulations 2009." },
      { date: "2026-10-27", title: "Assigned to Institutional PGRC", actor: "AICTE Portal", description: "Immediate 72-hour timer initiated." },
      { date: "2026-10-29", title: "Escalated by AICTE Central Admin", actor: "AICTE Admin", description: "Breach of preliminary resolution window. Hearing mandated." }
    ]
  },
  {
    id: "GRV-2026-003",
    trackingNumber: "AICTE-2026-TN-7712",
    complainantName: "Prof. K. Venkatesh",
    complainantEmail: "k.venkatesh@mitindia.edu",
    complainantRole: "Faculty",
    isAnonymous: false,
    institutionName: "Madras Institute of Technology (MIT)",
    institutionId: "AICTE-1-8829103",
    regionalBureau: "Southern Region (RO Chennai)",
    pgrcCell: "PGRC Cell - MIT Chennai",
    category: "Faculty & Staff Conduct",
    subject: "Non-compliance with 7th Pay Commission scale arrears for adjunct faculty",
    description: "The management has withheld arrears approved by AICTE gazette notification dated March 2024 despite multiple formal reminders to the Registrar.",
    priority: "High",
    status: "In Progress",
    createdAt: "2026-10-15",
    lastUpdated: "2026-10-25",
    slaDaysRemaining: 4,
    documents: [
      { name: "Salary_Slips_Arrears_Statement.pdf", size: "2.4 MB" },
      { name: "AICTE_Gazette_Ref.pdf", size: "900 KB" }
    ],
    responses: [
      {
        id: "R-4",
        date: "2026-10-20 02:00 PM",
        responderRole: "institution",
        responderName: "Registrar MIT Chennai",
        message: "Financial sanction request submitted to University Syndicate. Resolution expected in upcoming board meeting.",
      }
    ],
    timeline: [
      { date: "2026-10-15", title: "Grievance Lodged", actor: "Complainant", description: "Pay scale disparity lodged under AICTE Faculty Welfare Portal." },
      { date: "2026-10-20", title: "Syndicate Referral", actor: "Institution", description: "Institution registered formal response." }
    ]
  },
  {
    id: "GRV-2026-004",
    trackingNumber: "AICTE-2026-UP-3319",
    complainantName: "Pooja Verma",
    complainantEmail: "pooja.v@ietlucknow.ac.in",
    complainantRole: "Student",
    isAnonymous: true,
    institutionName: "Institute of Engineering and Technology (IET Lucknow)",
    institutionId: "AICTE-1-5501928",
    regionalBureau: "Northern Region (RO Kanpur)",
    pgrcCell: "PGRC Cell - IET Lucknow",
    category: "Hostel & Infrastructure",
    subject: "Dysfunctional drinking water RO plant and broken geysers in Gargi Hostel",
    description: "Students are forced to buy bottled water for the past 3 weeks. Multiple complaints to the estate officer have yielded no repairs.",
    priority: "Medium",
    status: "Resolved",
    createdAt: "2026-10-10",
    lastUpdated: "2026-10-18",
    slaDaysRemaining: 0,
    documents: [
      { name: "Hostel_Notice_Board_Photos.pdf", size: "3.1 MB" }
    ],
    responses: [
      {
        id: "R-5",
        date: "2026-10-18 04:30 PM",
        responderRole: "institution",
        responderName: "Estate Officer IET Lucknow",
        message: "New commercial RO filtration units (250 LPH) installed and commissioned on Oct 17. Water quality certificate tested by Jal Sansthan attached.",
        documents: [{ name: "Water_Quality_Testing_Report.pdf", size: "1.1 MB" }]
      }
    ],
    timeline: [
      { date: "2026-10-10", title: "Grievance Lodged", actor: "Complainant", description: "Filed anonymously regarding drinking water safety." },
      { date: "2026-10-18", title: "Resolved & Closed", actor: "Institution", description: "Repair & maintenance completed. Student confirmed satisfaction." }
    ]
  },
  {
    id: "GRV-2026-005",
    trackingNumber: "AICTE-2026-WB-9912",
    complainantName: "Rohan Mukherjee",
    complainantEmail: "rohan.m@jadavpur.edu",
    complainantRole: "Student",
    isAnonymous: false,
    institutionName: "Jadavpur University Faculty of Tech",
    institutionId: "AICTE-1-7729110",
    regionalBureau: "Eastern Region (RO Kolkata)",
    pgrcCell: "PGRC Cell - JU Salt Lake Campus",
    category: "Academic & Curriculum",
    subject: "Arbitrary internal marking without answer script inspection rights",
    description: "Despite AICTE transparency norms, department refused to show mid-semester evaluated answer scripts before final grade moderation.",
    priority: "Medium",
    status: "Action Required",
    createdAt: "2026-10-25",
    lastUpdated: "2026-10-27",
    slaDaysRemaining: 6,
    documents: [
      { name: "Representation_To_HOD.pdf", size: "750 KB" }
    ],
    responses: [],
    timeline: [
      { date: "2026-10-25", title: "Grievance Lodged", actor: "Complainant", description: "Request for answer script scrutiny." },
      { date: "2026-10-27", title: "Notice Sent to Institution", actor: "AICTE Portal", description: "Action required within 7 days by Examination Controller." }
    ]
  },
  {
    id: "GRV-2026-006",
    trackingNumber: "AICTE-2026-DL-8908",
    complainantName: "Sneha Kapur",
    complainantEmail: "sneha.k@dtu.ac.in",
    complainantRole: "Student",
    isAnonymous: false,
    institutionName: "Delhi Technological University (DTU)",
    institutionId: "AICTE-1-4921029",
    regionalBureau: "North-West Region (RO Chandigarh)",
    pgrcCell: "PGRC Cell - DTU Main Campus",
    category: "Fee Dispute & Scholarship",
    subject: "Pending alumni security caution money reimbursement 2025 batch",
    description: "I have not received my security money back after graduating in 2025. Accounts office keeps giving indefinite dates.",
    priority: "Medium",
    status: "Under Review",
    createdAt: "2026-10-24",
    lastUpdated: "2026-10-25",
    slaDaysRemaining: 8,
    documents: [
      { name: "Clearance_Form_DTU.pdf", size: "910 KB" }
    ],
    responses: [],
    timeline: [
      { date: "2026-10-24", title: "Grievance Lodged", actor: "Complainant", description: "Security refund delay reported." }
    ],
    isDuplicateFlagged: true,
    duplicateClusterId: "CLUSTER-FEE-DTU",
    duplicateScore: 95
  },
  {
    id: "GRV-2026-007",
    trackingNumber: "AICTE-2026-KA-5601",
    complainantName: "Dr. Sandeep Rao",
    complainantEmail: "sandeep.rao@rvce.edu.in",
    complainantRole: "Faculty",
    isAnonymous: false,
    institutionName: "R.V. College of Engineering Bangalore",
    institutionId: "AICTE-1-9876543",
    regionalBureau: "South-West Region (RO Bangalore)",
    pgrcCell: "PGRC Cell - RVCE Bangalore",
    category: "Academic & Curriculum",
    subject: "Lab equipment shortage in Artificial Intelligence & Robotics department",
    description: "Allocated AICTE modernization grants for GPU computing servers have been diverted to administrative computing blocks without faculty consultation.",
    priority: "High",
    status: "Forwarded to PGRC",
    createdAt: "2026-10-27",
    lastUpdated: "2026-10-28",
    slaDaysRemaining: 9,
    documents: [
      { name: "Grant_Utilization_Discrepancy.pdf", size: "1.9 MB" }
    ],
    responses: [],
    timeline: [
      { date: "2026-10-27", title: "Grievance Lodged", actor: "Complainant", description: "Equipment diversion reported." },
      { date: "2026-10-28", title: "Forwarded to PGRC", actor: "AICTE Portal", description: "Pending principal's committee feedback." }
    ]
  }
];

export const mockInstitutions = [
  { id: "AICTE-1-4921029", name: "Delhi Technological University (DTU)", region: "North-West Region (RO Chandigarh)" },
  { id: "AICTE-1-1029384", name: "College of Engineering Pune (COEP)", region: "Western Region (RO Mumbai)" },
  { id: "AICTE-1-8829103", name: "Madras Institute of Technology (MIT)", region: "Southern Region (RO Chennai)" },
  { id: "AICTE-1-5501928", name: "Institute of Engineering and Technology (IET Lucknow)", region: "Northern Region (RO Kanpur)" },
  { id: "AICTE-1-7729110", name: "Jadavpur University Faculty of Tech", region: "Eastern Region (RO Kolkata)" },
  { id: "AICTE-1-9876543", name: "R.V. College of Engineering Bangalore", region: "South-West Region (RO Bangalore)" },
];

export const mockCategories: Category[] = [
  "Ragging & Harassment",
  "Academic & Curriculum",
  "Fee Dispute & Scholarship",
  "Hostel & Infrastructure",
  "Faculty & Staff Conduct",
  "Examination & Results",
  "Admission Irregularity",
];

export const mockRegionalBureaus: RegionalBureau[] = [
  "Northern Region (RO Kanpur)",
  "Southern Region (RO Chennai)",
  "Western Region (RO Mumbai)",
  "Eastern Region (RO Kolkata)",
  "Central Region (RO Bhopal)",
  "North-West Region (RO Chandigarh)",
  "South-West Region (RO Bangalore)",
];

