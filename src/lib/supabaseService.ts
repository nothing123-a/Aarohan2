import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { Complaint, Institution, OverlapAlert, NotificationItem, ComplaintStatus, Bureau } from "@/types";
import { initialComplaints, initialInstitutions, initialNotifications, initialOverlapAlerts } from "./mockData";
import { StorageService } from "./storage";

export const SupabaseService = {
  isConfigured(): boolean {
    return isSupabaseConfigured();
  },

  // Seed Supabase with initial demo records if tables are empty
  async seedInitialDataIfEmpty(): Promise<void> {
    if (!supabase) return;

    try {
      const { data: instData } = await supabase.from("institutions").select("aicte_permanent_id").limit(1);
      if (!instData || instData.length === 0) {
        const instRows = initialInstitutions.map(i => ({
          aicte_permanent_id: i.aictePermanentId,
          name: i.name,
          type: i.type,
          state: i.state,
          district: i.district,
          nodal_officer_name: i.nodalOfficerName,
          nodal_officer_email: i.nodalOfficerEmail,
          nodal_officer_phone: i.nodalOfficerPhone,
          total_complaints: i.totalComplaints,
          pending_complaints: i.pendingComplaints,
          resolved_complaints: i.resolvedComplaints,
          overdue_complaints: i.overdueComplaints,
          associated_bureaus: i.associatedBureaus,
        }));
        await supabase.from("institutions").upsert(instRows);
      }

      const { data: compData } = await supabase.from("complaints").select("id").limit(1);
      if (!compData || compData.length === 0) {
        const compRows = initialComplaints.map(c => ({
          id: c.id,
          tracking_number: c.trackingNumber,
          complainant_name: c.complainantName,
          complainant_type: c.complainantType,
          complainant_email: c.complainantEmail,
          complainant_phone: c.complainantPhone,
          is_anonymous: c.isAnonymous,
          institution_name: c.institutionName,
          aicte_permanent_id: c.aictePermanentId,
          institution_type: c.institutionType,
          state: c.state,
          district: c.district,
          category: c.category,
          subject: c.subject,
          description: c.description,
          priority: c.priority,
          assigned_bureau: c.assignedBureau,
          assigned_officer: c.assignedOfficer,
          status: c.status,
          received_date: c.receivedDate,
          last_action_date: c.lastActionDate,
          expected_disposal_date: c.expectedDisposalDate,
          sla_days_remaining: c.slaDaysRemaining,
          supporting_documents: c.supportingDocuments,
          timeline: c.timeline,
          clarification_requests: c.clarificationRequests,
          institutional_response: c.institutionalResponse || null,
          internal_remarks: c.internalRemarks,
          linked_related_case_ids: c.linkedRelatedCaseIds,
          marked_not_related_case_ids: c.markedNotRelatedCaseIds,
          coordination_notes: c.coordinationNotes || null,
        }));
        await supabase.from("complaints").upsert(compRows);
      }
    } catch (err) {
      console.warn("Could not seed Supabase initial data:", err);
    }
  },

  // Complaints
  async getComplaints(): Promise<Complaint[]> {
    if (!supabase) {
      return StorageService.getComplaints();
    }

    try {
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data) throw error;

      return data.map((row: any): Complaint => ({
        id: row.id,
        trackingNumber: row.tracking_number,
        complainantName: row.complainant_name,
        complainantType: row.complainant_type,
        complainantEmail: row.complainant_email,
        complainantPhone: row.complainant_phone,
        isAnonymous: row.is_anonymous,
        institutionName: row.institution_name,
        aictePermanentId: row.aicte_permanent_id,
        institutionType: row.institution_type,
        state: row.state,
        district: row.district,
        category: row.category,
        subject: row.subject,
        description: row.description,
        priority: row.priority,
        assignedBureau: row.assigned_bureau,
        assignedOfficer: row.assigned_officer,
        status: row.status,
        receivedDate: row.received_date,
        lastActionDate: row.last_action_date,
        expectedDisposalDate: row.expected_disposal_date,
        slaDaysRemaining: row.sla_days_remaining,
        supportingDocuments: row.supporting_documents || [],
        timeline: row.timeline || [],
        clarificationRequests: row.clarification_requests || [],
        institutionalResponse: row.institutional_response || undefined,
        internalRemarks: row.internal_remarks || [],
        linkedRelatedCaseIds: row.linked_related_case_ids || [],
        markedNotRelatedCaseIds: row.marked_not_related_case_ids || [],
        coordinationNotes: row.coordination_notes || undefined,
      }));
    } catch (e) {
      console.warn("Failed to fetch complaints from Supabase. Falling back to local storage:", e);
      return StorageService.getComplaints();
    }
  },

  async saveNewComplaint(complaint: Complaint): Promise<void> {
    // Always persist to LocalStorage for instant optimistic UI
    StorageService.saveNewComplaint(complaint);

    if (!supabase) return;

    try {
      const row = {
        id: complaint.id,
        tracking_number: complaint.trackingNumber,
        complainant_name: complaint.complainantName,
        complainant_type: complaint.complainantType,
        complainant_email: complaint.complainantEmail,
        complainant_phone: complaint.complainantPhone,
        is_anonymous: complaint.isAnonymous,
        institution_name: complaint.institutionName,
        aicte_permanent_id: complaint.aictePermanentId,
        institution_type: complaint.institutionType,
        state: complaint.state,
        district: complaint.district,
        category: complaint.category,
        subject: complaint.subject,
        description: complaint.description,
        priority: complaint.priority,
        assigned_bureau: complaint.assignedBureau,
        assigned_officer: complaint.assignedOfficer,
        status: complaint.status,
        received_date: complaint.receivedDate,
        last_action_date: complaint.lastActionDate,
        expected_disposal_date: complaint.expectedDisposalDate,
        sla_days_remaining: complaint.slaDaysRemaining,
        supporting_documents: complaint.supportingDocuments,
        timeline: complaint.timeline,
        clarification_requests: complaint.clarificationRequests,
        institutional_response: complaint.institutionalResponse || null,
        internal_remarks: complaint.internalRemarks,
        linked_related_case_ids: complaint.linkedRelatedCaseIds,
        marked_not_related_case_ids: complaint.markedNotRelatedCaseIds,
        coordination_notes: complaint.coordinationNotes || null,
      };

      await supabase.from("complaints").insert([row]);
    } catch (e) {
      console.error("Error inserting complaint into Supabase:", e);
    }
  },

  async updateComplaintStatus(id: string, newStatus: ComplaintStatus, actor: string, reason?: string): Promise<void> {
    StorageService.updateComplaintStatus(id, newStatus, actor, reason);

    if (!supabase) return;

    try {
      const updated = StorageService.getComplaintById(id);
      if (updated) {
        await supabase.from("complaints").update({
          status: newStatus,
          last_action_date: updated.lastActionDate,
          sla_days_remaining: updated.slaDaysRemaining,
          timeline: updated.timeline,
        }).eq("id", id);
      }
    } catch (e) {
      console.error("Error updating complaint status in Supabase:", e);
    }
  },

  async submitInstitutionalResponse(
    complaintId: string,
    resp: { officerName: string; designation: string; explanation: string; correctiveAction: string; documents: { name: string; size: string }[] }
  ): Promise<void> {
    StorageService.submitInstitutionalResponse(complaintId, resp);

    if (!supabase) return;

    try {
      const updated = StorageService.getComplaintById(complaintId);
      if (updated) {
        await supabase.from("complaints").update({
          status: "Under Review",
          last_action_date: updated.lastActionDate,
          institutional_response: updated.institutionalResponse,
          timeline: updated.timeline,
        }).eq("id", complaintId);
      }
    } catch (e) {
      console.error("Error updating institutional response in Supabase:", e);
    }
  },

  // Institutions
  async getInstitutions(): Promise<Institution[]> {
    if (!supabase) {
      return StorageService.getInstitutions();
    }

    try {
      const { data, error } = await supabase.from("institutions").select("*").order("name");
      if (error || !data || data.length === 0) throw error;

      return data.map((row: any): Institution => ({
        aictePermanentId: row.aicte_permanent_id,
        name: row.name,
        type: row.type,
        state: row.state,
        district: row.district,
        nodalOfficerName: row.nodal_officer_name,
        nodalOfficerEmail: row.nodal_officer_email,
        nodalOfficerPhone: row.nodal_officer_phone,
        totalComplaints: row.total_complaints,
        pendingComplaints: row.pending_complaints,
        resolvedComplaints: row.resolved_complaints,
        overdueComplaints: row.overdue_complaints,
        associatedBureaus: row.associated_bureaus || [],
      }));
    } catch (e) {
      return StorageService.getInstitutions();
    }
  },
};
