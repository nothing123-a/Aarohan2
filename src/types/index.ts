export type UserRole = "student_teacher" | "institution_nodal" | "aicte_admin";

export type Bureau = 
  | "Regional Bureau (RB)" 
  | "Public Grievance Redressal Cell (PGRC)" 
  | "Approval Bureau" 
  | "Policy & Academic Planning Bureau";

export type ComplaintStatus = 
  | "Submitted" 
  | "Under Review" 
  | "Under Process" 
  | "Awaiting Information" 
  | "Transferred" 
  | "Escalated" 
  | "Resolved / Disposed" 
  | "Closed" 
  | "Rejected";

export type Priority = "Low" | "Medium" | "High" | "Critical";

export type ComplainantType = "Student" | "Teacher" | "Faculty" | "Other";

export interface TimelineEntry {
  id: string;
  date: string;
  title: string;
  actor: string;
  description: string;
  previousStatus?: string;
  newStatus?: string;
}

export interface ClarificationRequest {
  id: string;
  date: string;
  requestedBy: string;
  question: string;
  response?: string;
  responseDate?: string;
}

export interface InstitutionalResponse {
  date: string;
  officerName: string;
  designation: string;
  explanation: string;
  correctiveAction: string;
  documents: { name: string; size: string }[];
}

export interface InternalRemark {
  id: string;
  date: string;
  officer: string;
  bureau: string;
  remark: string;
}

export interface Complaint {
  id: string;
  trackingNumber: string;
  complainantName: string;
  complainantType: ComplainantType;
  complainantEmail: string;
  complainantPhone: string;
  isAnonymous: boolean;
  institutionName: string;
  aictePermanentId: string;
  institutionType: string;
  state: string;
  district: string;
  category: string;
  subject: string;
  description: string;
  priority: Priority;
  assignedBureau: Bureau;
  assignedOfficer: string;
  status: ComplaintStatus;
  receivedDate: string;
  lastActionDate: string;
  expectedDisposalDate: string;
  slaDaysRemaining: number;
  supportingDocuments: { name: string; size: string; type: string }[];
  timeline: TimelineEntry[];
  clarificationRequests: ClarificationRequest[];
  institutionalResponse?: InstitutionalResponse;
  internalRemarks: InternalRemark[];
  linkedRelatedCaseIds: string[];
  markedNotRelatedCaseIds: string[];
  coordinationNotes?: string;
}

export interface Institution {
  aictePermanentId: string;
  name: string;
  type: string;
  state: string;
  district: string;
  nodalOfficerName: string;
  nodalOfficerEmail: string;
  nodalOfficerPhone: string;
  totalComplaints: number;
  pendingComplaints: number;
  resolvedComplaints: number;
  overdueComplaints: number;
  associatedBureaus: Bureau[];
}

export interface NotificationItem {
  id: string;
  targetRole: UserRole;
  targetUser?: string;
  title: string;
  message: string;
  date: string;
  complaintId?: string;
  isRead: boolean;
  type: "status_change" | "clarification_request" | "response_submitted" | "overlap_detected" | "deadline_alert" | "new_complaint";
}

export interface OverlapAlert {
  id: string;
  complaintIdA: string;
  complaintIdB: string;
  institutionName: string;
  aictePermanentId: string;
  bureauA: Bureau;
  bureauB: Bureau;
  subjectA: string;
  subjectB: string;
  statusA: ComplaintStatus;
  statusB: ComplaintStatus;
  similarityScore: number;
  confidenceIndicator: "High" | "Medium" | "Low";
  detectionReasons: string[];
  recommendedAction: string;
  isReviewed: boolean;
  reviewDecision?: "linked" | "not_related" | "pending";
  coordinationNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

