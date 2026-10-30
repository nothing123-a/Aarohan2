import { Complaint, Institution, NotificationItem, OverlapAlert, UserRole, ComplaintStatus, Bureau, Priority } from "@/types";
import { initialComplaints, initialInstitutions, initialNotifications, initialOverlapAlerts } from "./mockData";
import { analyzeOverlapBetweenComplaints } from "./overlapDetector";

const STORAGE_KEYS = {
  COMPLAINTS: "aicte_g360_complaints",
  INSTITUTIONS: "aicte_g360_institutions",
  NOTIFICATIONS: "aicte_g360_notifications",
  OVERLAPS: "aicte_g360_overlaps",
  ROLE: "aicte_g360_current_role",
};

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
}

export const StorageService = {
  init() {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(STORAGE_KEYS.COMPLAINTS)) {
      safeSet(STORAGE_KEYS.COMPLAINTS, initialComplaints);
    }
    if (!localStorage.getItem(STORAGE_KEYS.INSTITUTIONS)) {
      safeSet(STORAGE_KEYS.INSTITUTIONS, initialInstitutions);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      safeSet(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
    }
    if (!localStorage.getItem(STORAGE_KEYS.OVERLAPS)) {
      safeSet(STORAGE_KEYS.OVERLAPS, initialOverlapAlerts);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ROLE)) {
      safeSet(STORAGE_KEYS.ROLE, "student_teacher");
    }
  },

  // Role
  getCurrentRole(): UserRole {
    return safeGet<UserRole>(STORAGE_KEYS.ROLE, "student_teacher");
  },

  setCurrentRole(role: UserRole): void {
    safeSet(STORAGE_KEYS.ROLE, role);
  },

  // Complaints
  getComplaints(): Complaint[] {
    return safeGet<Complaint[]>(STORAGE_KEYS.COMPLAINTS, initialComplaints);
  },

  getComplaintById(id: string): Complaint | undefined {
    const complaints = this.getComplaints();
    return complaints.find(c => c.id === id || c.trackingNumber.toLowerCase() === id.toLowerCase());
  },

  saveNewComplaint(complaint: Complaint): void {
    const complaints = this.getComplaints();
    const updated = [complaint, ...complaints];
    safeSet(STORAGE_KEYS.COMPLAINTS, updated);

    // Update institution count
    const institutions = this.getInstitutions();
    const instIdx = institutions.findIndex(i => i.aictePermanentId === complaint.aictePermanentId);
    if (instIdx !== -1) {
      institutions[instIdx].totalComplaints += 1;
      institutions[instIdx].pendingComplaints += 1;
      safeSet(STORAGE_KEYS.INSTITUTIONS, institutions);
    }

    const timestampStr = new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

    // 1. Notify AICTE Admin
    this.addNotification({
      id: `NOTIF-${Date.now()}-adm`,
      targetRole: "aicte_admin",
      title: "New Grievance Registered",
      message: `Case ${complaint.trackingNumber} filed against ${complaint.institutionName} (${complaint.category}).`,
      date: timestampStr,
      complaintId: complaint.id,
      isRead: false,
      type: "status_change",
    });

    // 2. Notify Institution Nodal Officer
    this.addNotification({
      id: `NOTIF-${Date.now()}-inst`,
      targetRole: "institution_nodal",
      title: "New Complaint Assigned",
      message: `Case ${complaint.trackingNumber} received. Institutional explanation & Action Taken Report (ATR) required within 15 days.`,
      date: timestampStr,
      complaintId: complaint.id,
      isRead: false,
      type: "new_complaint",
    });

    // 3. Notify Student / Teacher Complainant
    this.addNotification({
      id: `NOTIF-${Date.now()}-std`,
      targetRole: "student_teacher",
      targetUser: complaint.complainantName,
      title: "Grievance Successfully Lodged",
      message: `Your grievance has been assigned Tracking ID ${complaint.trackingNumber} under ${complaint.assignedBureau}.`,
      date: timestampStr,
      complaintId: complaint.id,
      isRead: false,
      type: "status_change",
    });

    // 4. Automatic Real-Time Cross-Bureau Overlap Detection
    try {
      const existingAlerts = this.getOverlapAlerts();
      const newAlerts: OverlapAlert[] = [];
      for (const existing of complaints) {
        if (existing.id === complaint.id) continue;
        const alert = analyzeOverlapBetweenComplaints(complaint, existing);
        if (alert && alert.similarityScore >= 45) {
          const alreadyExists = existingAlerts.some(
            a => (a.complaintIdA === complaint.id && a.complaintIdB === existing.id) ||
                 (a.complaintIdA === existing.id && a.complaintIdB === complaint.id)
          );
          if (!alreadyExists) {
            newAlerts.push(alert);
          }
        }
      }

      if (newAlerts.length > 0) {
        safeSet(STORAGE_KEYS.OVERLAPS, [...newAlerts, ...existingAlerts]);
        this.addNotification({
          id: `NOTIF-${Date.now()}-ovl`,
          targetRole: "aicte_admin",
          title: "Cross-Bureau Overlap Flagged",
          message: `Case ${complaint.trackingNumber} exhibits ${newAlerts[0].similarityScore}% correlation with case ${newAlerts[0].complaintIdB}.`,
          date: timestampStr,
          complaintId: complaint.id,
          isRead: false,
          type: "status_change",
        });
      }
    } catch (err) {
      console.error("Error during real-time overlap analysis:", err);
    }
  },

  updateComplaintStatus(id: string, newStatus: ComplaintStatus, actor: string, reason?: string): void {
    const complaints = this.getComplaints();
    const idx = complaints.findIndex(c => c.id === id);
    if (idx === -1) return;

    const prev = complaints[idx];
    const prevStatus = prev.status;
    const now = new Date().toISOString().split("T")[0];

    const timelineEntry = {
      id: `TL-${Date.now()}`,
      date: now,
      title: `Status Changed to ${newStatus}`,
      actor,
      description: reason || `Status updated from ${prevStatus} to ${newStatus}.`,
      previousStatus: prevStatus,
      newStatus,
    };

    complaints[idx] = {
      ...prev,
      status: newStatus,
      lastActionDate: now,
      slaDaysRemaining: newStatus === "Resolved / Disposed" || newStatus === "Closed" ? 0 : prev.slaDaysRemaining,
      timeline: [...prev.timeline, timelineEntry],
    };

    safeSet(STORAGE_KEYS.COMPLAINTS, complaints);

    // Add notification
    this.addNotification({
      id: `NOTIF-${Date.now()}`,
      targetRole: "student_teacher",
      targetUser: prev.complainantName,
      title: `Complaint Status Updated: ${newStatus}`,
      message: `Your grievance ${prev.trackingNumber} has been updated to "${newStatus}" by ${actor}.`,
      date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      complaintId: prev.id,
      isRead: false,
      type: "status_change",
    });
  },

  updateBureauAndOfficer(id: string, bureau: Bureau, officer: string, actor: string): void {
    const complaints = this.getComplaints();
    const idx = complaints.findIndex(c => c.id === id);
    if (idx === -1) return;

    const prev = complaints[idx];
    const now = new Date().toISOString().split("T")[0];

    complaints[idx] = {
      ...prev,
      assignedBureau: bureau,
      assignedOfficer: officer,
      lastActionDate: now,
      timeline: [
        ...prev.timeline,
        {
          id: `TL-${Date.now()}`,
          date: now,
          title: `Reassigned to ${bureau}`,
          actor,
          description: `Assigned officer: ${officer}.`,
        }
      ]
    };

    safeSet(STORAGE_KEYS.COMPLAINTS, complaints);
  },

  submitClarificationResponse(complaintId: string, requestId: string, response: string): void {
    const complaints = this.getComplaints();
    const idx = complaints.findIndex(c => c.id === complaintId);
    if (idx === -1) return;

    const prev = complaints[idx];
    const now = new Date().toISOString().split("T")[0];

    const updatedRequests = prev.clarificationRequests.map(r => {
      if (r.id === requestId) {
        return { ...r, response, responseDate: now };
      }
      return r;
    });

    complaints[idx] = {
      ...prev,
      status: "Under Process",
      lastActionDate: now,
      clarificationRequests: updatedRequests,
      timeline: [
        ...prev.timeline,
        {
          id: `TL-${Date.now()}`,
          date: now,
          title: "Complainant Clarification Received",
          actor: prev.complainantName,
          description: `Clarification provided: "${response.slice(0, 60)}..."`,
        }
      ]
    };

    safeSet(STORAGE_KEYS.COMPLAINTS, complaints);
  },

  submitInstitutionalResponse(
    complaintId: string, 
    resp: { officerName: string; designation: string; explanation: string; correctiveAction: string; documents: { name: string; size: string }[] }
  ): void {
    const complaints = this.getComplaints();
    const idx = complaints.findIndex(c => c.id === complaintId);
    if (idx === -1) return;

    const prev = complaints[idx];
    const now = new Date().toISOString().split("T")[0];

    complaints[idx] = {
      ...prev,
      status: "Under Review",
      lastActionDate: now,
      institutionalResponse: {
        ...resp,
        date: now,
      },
      timeline: [
        ...prev.timeline,
        {
          id: `TL-${Date.now()}`,
          date: now,
          title: "Institutional Response Logged",
          actor: `${resp.officerName} (${resp.designation})`,
          description: `Explanation and corrective action plan submitted with ${resp.documents.length} supporting documents.`,
        }
      ]
    };

    safeSet(STORAGE_KEYS.COMPLAINTS, complaints);

    this.addNotification({
      id: `NOTIF-${Date.now()}-adm`,
      targetRole: "aicte_admin",
      title: "Institution Response Submitted",
      message: `${prev.institutionName} submitted formal response for case ${prev.trackingNumber}.`,
      date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      complaintId: prev.id,
      isRead: false,
      type: "response_submitted",
    });

    this.addNotification({
      id: `NOTIF-${Date.now()}-std`,
      targetRole: "student_teacher",
      targetUser: prev.complainantName,
      title: "Institution Response Received",
      message: `${prev.institutionName} has submitted an explanation and Action Taken Report for your case ${prev.trackingNumber}.`,
      date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      complaintId: prev.id,
      isRead: false,
      type: "response_submitted",
    });
  },

  addInternalRemark(complaintId: string, officer: string, bureau: string, remark: string): void {
    const complaints = this.getComplaints();
    const idx = complaints.findIndex(c => c.id === complaintId);
    if (idx === -1) return;

    const prev = complaints[idx];
    const now = new Date().toISOString().split("T")[0];

    complaints[idx] = {
      ...prev,
      internalRemarks: [
        ...prev.internalRemarks,
        {
          id: `REM-${Date.now()}`,
          date: now,
          officer,
          bureau,
          remark,
        }
      ]
    };

    safeSet(STORAGE_KEYS.COMPLAINTS, complaints);
  },

  // Overlap Center workflows
  getOverlapAlerts(): OverlapAlert[] {
    return safeGet<OverlapAlert[]>(STORAGE_KEYS.OVERLAPS, initialOverlapAlerts);
  },

  linkCases(alertId: string, officerName: string, coordinationNote?: string): void {
    const alerts = this.getOverlapAlerts();
    const alertIdx = alerts.findIndex(a => a.id === alertId);
    if (alertIdx === -1) return;

    const a = alerts[alertIdx];
    const now = new Date().toISOString().split("T")[0];

    alerts[alertIdx] = {
      ...a,
      isReviewed: true,
      reviewDecision: "linked",
      coordinationNote: coordinationNote || a.recommendedAction,
      reviewedBy: officerName,
      reviewedAt: now,
    };
    safeSet(STORAGE_KEYS.OVERLAPS, alerts);

    // Link on both complaint objects
    const complaints = this.getComplaints();
    const compAIdx = complaints.findIndex(c => c.id === a.complaintIdA);
    const compBIdx = complaints.findIndex(c => c.id === a.complaintIdB);

    if (compAIdx !== -1) {
      if (!complaints[compAIdx].linkedRelatedCaseIds.includes(a.complaintIdB)) {
        complaints[compAIdx].linkedRelatedCaseIds.push(a.complaintIdB);
        complaints[compAIdx].timeline.push({
          id: `TL-${Date.now()}-A`,
          date: now,
          title: "Linked as Related Case",
          actor: officerName,
          description: `Linked with ${a.complaintIdB} (${complaints[compBIdx]?.trackingNumber || "Related"}). ${coordinationNote || ""}`,
        });
      }
    }

    if (compBIdx !== -1) {
      if (!complaints[compBIdx].linkedRelatedCaseIds.includes(a.complaintIdA)) {
        complaints[compBIdx].linkedRelatedCaseIds.push(a.complaintIdA);
        complaints[compBIdx].timeline.push({
          id: `TL-${Date.now()}-B`,
          date: now,
          title: "Linked as Related Case",
          actor: officerName,
          description: `Linked with ${a.complaintIdA} (${complaints[compAIdx]?.trackingNumber || "Related"}). ${coordinationNote || ""}`,
        });
      }
    }

    safeSet(STORAGE_KEYS.COMPLAINTS, complaints);
  },

  markNotRelated(alertId: string, officerName: string, reason?: string): void {
    const alerts = this.getOverlapAlerts();
    const alertIdx = alerts.findIndex(a => a.id === alertId);
    if (alertIdx === -1) return;

    const a = alerts[alertIdx];
    const now = new Date().toISOString().split("T")[0];

    alerts[alertIdx] = {
      ...a,
      isReviewed: true,
      reviewDecision: "not_related",
      coordinationNote: reason || "Reviewed and determined to be independent cases.",
      reviewedBy: officerName,
      reviewedAt: now,
    };
    safeSet(STORAGE_KEYS.OVERLAPS, alerts);

    const complaints = this.getComplaints();
    const compAIdx = complaints.findIndex(c => c.id === a.complaintIdA);
    const compBIdx = complaints.findIndex(c => c.id === a.complaintIdB);

    if (compAIdx !== -1 && !complaints[compAIdx].markedNotRelatedCaseIds.includes(a.complaintIdB)) {
      complaints[compAIdx].markedNotRelatedCaseIds.push(a.complaintIdB);
    }
    if (compBIdx !== -1 && !complaints[compBIdx].markedNotRelatedCaseIds.includes(a.complaintIdA)) {
      complaints[compBIdx].markedNotRelatedCaseIds.push(a.complaintIdA);
    }
    safeSet(STORAGE_KEYS.COMPLAINTS, complaints);
  },

  // Institutions
  getInstitutions(): Institution[] {
    return safeGet<Institution[]>(STORAGE_KEYS.INSTITUTIONS, initialInstitutions);
  },

  getInstitutionByPermanentId(pid: string): Institution | undefined {
    const insts = this.getInstitutions();
    return insts.find(i => i.aictePermanentId === pid);
  },

  // Notifications
  getNotifications(role?: UserRole): NotificationItem[] {
    const all = safeGet<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
    if (!role) return all;
    return all.filter(n => n.targetRole === role);
  },

  addNotification(n: NotificationItem): void {
    const all = safeGet<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
    safeSet(STORAGE_KEYS.NOTIFICATIONS, [n, ...all]);
  },

  markNotificationRead(id: string): void {
    const all = safeGet<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
    const updated = all.map(n => n.id === id ? { ...n, isRead: true } : n);
    safeSet(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  markAllNotificationsRead(role?: UserRole): void {
    const all = safeGet<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
    const updated = all.map(n => !role || n.targetRole === role ? { ...n, isRead: true } : n);
    safeSet(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  // Reset to original deterministic seed data
  resetDemoData(): void {
    safeSet(STORAGE_KEYS.COMPLAINTS, initialComplaints);
    safeSet(STORAGE_KEYS.INSTITUTIONS, initialInstitutions);
    safeSet(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
    safeSet(STORAGE_KEYS.OVERLAPS, initialOverlapAlerts);
    safeSet(STORAGE_KEYS.ROLE, "student_teacher");
  }
};

