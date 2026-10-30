"use client";

import React, { useState } from "react";
import {
  X,
  Clock,
  Calendar,
  Building2,
  FileText,
  Download,
  AlertTriangle,
  Send,
  User,
  Shield,
  MessageSquare,
  Link2,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Paperclip
} from "lucide-react";
import { Complaint, UserRole, ComplaintStatus, Bureau, Priority } from "@/types";
import { StorageService } from "@/lib/storage";

interface ComplaintDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint | null;
  role: UserRole;
  onComplaintUpdated?: () => void;
  onOpenRelatedCase?: (relatedId: string) => void;
}

export default function ComplaintDetailModal({
  isOpen,
  onClose,
  complaint,
  role,
  onComplaintUpdated,
  onOpenRelatedCase,
}: ComplaintDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"details" | "timeline" | "responses" | "remarks">("details");

  // Admin action states
  const [newStatus, setNewStatus] = useState<ComplaintStatus>(complaint?.status || "Under Review");
  const [statusReason, setStatusReason] = useState("");
  const [newBureau, setNewBureau] = useState<Bureau>(complaint?.assignedBureau || "Regional Bureau (RB)");
  const [newOfficer, setNewOfficer] = useState(complaint?.assignedOfficer || "");
  const [internalRemark, setInternalRemark] = useState("");

  // Student clarification response
  const [clarificationResponse, setClarificationResponse] = useState("");

  if (!isOpen || !complaint) return null;

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    const actorName = 
      role === "aicte_admin" ? "Dr. Rajesh Verma (AICTE Admin)" :
      role === "institution_nodal" ? "DTU Nodal Officer" :
      "Student Complainant";

    StorageService.updateComplaintStatus(complaint.id, newStatus, actorName, statusReason);
    if (onComplaintUpdated) onComplaintUpdated();
    alert(`Case ${complaint.trackingNumber} updated to "${newStatus}".`);
  };

  const handleReassignBureau = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.updateBureauAndOfficer(complaint.id, newBureau, newOfficer || "Duty Officer", "AICTE Central Admin");
    if (onComplaintUpdated) onComplaintUpdated();
    alert(`Reassigned to ${newBureau} under ${newOfficer}.`);
  };

  const handleAddRemark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!internalRemark.trim()) return;
    StorageService.addInternalRemark(complaint.id, "Dr. Rajesh Verma", "Central Redressal Bureau", internalRemark.trim());
    setInternalRemark("");
    if (onComplaintUpdated) onComplaintUpdated();
    alert("Internal coordination remark recorded in case file.");
  };

  const handleSubmitClarification = (requestId: string) => {
    if (!clarificationResponse.trim()) return;
    StorageService.submitClarificationResponse(complaint.id, requestId, clarificationResponse);
    setClarificationResponse("");
    if (onComplaintUpdated) onComplaintUpdated();
    alert("Clarification response submitted to AICTE.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                {complaint.trackingNumber}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                {complaint.status}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Priority: {complaint.priority}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {complaint.subject}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab navigation inside modal */}
        <div className="flex items-center gap-4 px-6 border-b border-slate-200 text-xs font-semibold text-slate-600 bg-white">
          <button
            onClick={() => setActiveTab("details")}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === "details" ? "border-orange-600 text-orange-600 font-bold" : "border-transparent hover:text-slate-900"
            }`}
          >
            Case Details
          </button>
          <button
            onClick={() => setActiveTab("timeline")}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === "timeline" ? "border-orange-600 text-orange-600 font-bold" : "border-transparent hover:text-slate-900"
            }`}
          >
            Action Timeline ({complaint.timeline.length})
          </button>
          <button
            onClick={() => setActiveTab("responses")}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === "responses" ? "border-orange-600 text-orange-600 font-bold" : "border-transparent hover:text-slate-900"
            }`}
          >
            Responses & Clarifications
          </button>
          {role === "aicte_admin" && (
            <button
              onClick={() => setActiveTab("remarks")}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === "remarks" ? "border-orange-600 text-orange-600 font-bold" : "border-transparent hover:text-slate-900"
              }`}
            >
              Internal Remarks ({complaint.internalRemarks.length})
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs">
          {activeTab === "details" && (
            <div className="space-y-5">
              {/* Key metadata grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Complainant</span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {complaint.isAnonymous && role === "institution_nodal" ? "Anonymous Whistleblower" : complaint.complainantName}
                  </p>
                  <span className="text-[10px] text-slate-500">{complaint.complainantType}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Institution</span>
                  <p className="font-bold text-slate-900 mt-0.5 truncate" title={complaint.institutionName}>
                    {complaint.institutionName}
                  </p>
                  <span className="text-[10px] text-slate-500 font-mono">PID: {complaint.aictePermanentId}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Bureau</span>
                  <p className="font-bold text-slate-900 mt-0.5 truncate">{complaint.assignedBureau}</p>
                  <span className="text-[10px] text-slate-500">{complaint.assignedOfficer}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">SLA Window</span>
                  <p className="font-bold text-orange-600 mt-0.5">
                    {complaint.slaDaysRemaining > 0 ? `${complaint.slaDaysRemaining} Days Left` : "Overdue / Resolved"}
                  </p>
                  <span className="text-[10px] text-slate-400">Filed: {complaint.receivedDate}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Grievance Narrative / Description
                </span>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 leading-relaxed">
                  {complaint.description}
                </div>
              </div>

              {/* Linked Related Cases (Section 4 Overlap Linkage) */}
              {complaint.linkedRelatedCaseIds && complaint.linkedRelatedCaseIds.length > 0 && (
                <div className="p-3.5 bg-orange-50/70 border border-orange-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-orange-800 font-bold">
                    <Link2 size={14} className="text-orange-600" />
                    <span>Linked Related Cases ({complaint.linkedRelatedCaseIds.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {complaint.linkedRelatedCaseIds.map((relId) => (
                      <div key={relId} className="flex items-center justify-between p-2 bg-white rounded-lg border border-orange-200">
                        <span className="font-mono font-bold text-slate-800">{relId}</span>
                        {onOpenRelatedCase && (
                          <button
                            onClick={() => onOpenRelatedCase(relId)}
                            className="text-orange-600 hover:text-orange-800 font-semibold flex items-center gap-1"
                          >
                            <span>Inspect Related</span>
                            <ArrowRight size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Supporting Documents */}
              {complaint.supportingDocuments.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                    Supporting Documents ({complaint.supportingDocuments.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {complaint.supportingDocuments.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText size={15} className="text-orange-600 shrink-0" />
                          <span className="font-semibold text-slate-800 truncate">{doc.name}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">({doc.size})</span>
                        </div>
                        <button
                          onClick={() => alert(`Simulating secure document download: ${doc.name}`)}
                          className="p-1 text-slate-500 hover:text-orange-600"
                          title="Download"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Administrative Action Section (for AICTE Admin) */}
              {role === "aicte_admin" && (
                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Administrative Bureau Oversight Actions
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Status Update Form */}
                    <form onSubmit={handleUpdateStatus} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <label className="font-bold text-slate-900 block">Update Complaint Status</label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none"
                      >
                        <option value="Under Review">Under Review</option>
                        <option value="Under Process">Under Process</option>
                        <option value="Awaiting Information">Awaiting Information</option>
                        <option value="Transferred">Transferred</option>
                        <option value="Escalated">Escalated</option>
                        <option value="Resolved / Disposed">Resolved / Disposed</option>
                        <option value="Closed">Closed</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Reason or justification for status change..."
                        value={statusReason}
                        onChange={(e) => setStatusReason(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800"
                      />
                      <button
                        type="submit"
                        className="w-full py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-lg transition-colors"
                      >
                        Update Status
                      </button>
                    </form>

                    {/* Bureau Reassignment Form */}
                    <form onSubmit={handleReassignBureau} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <label className="font-bold text-slate-900 block">Reassign Bureau & Officer</label>
                      <select
                        value={newBureau}
                        onChange={(e) => setNewBureau(e.target.value as Bureau)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none"
                      >
                        <option value="Regional Bureau (RB)">Regional Bureau (RB)</option>
                        <option value="Public Grievance Redressal Cell (PGRC)">Public Grievance Redressal Cell (PGRC)</option>
                        <option value="Approval Bureau">Approval Bureau</option>
                        <option value="Policy & Academic Planning Bureau">Policy & Academic Planning Bureau</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Officer Name..."
                        value={newOfficer}
                        onChange={(e) => setNewOfficer(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800"
                      />
                      <button
                        type="submit"
                        className="w-full py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
                      >
                        Reassign Bureau
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === "timeline" && (
            <div className="space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Immutable Action Timeline & Audit Trail
              </span>
              <div className="relative pl-6 space-y-3.5 border-l-2 border-slate-200 ml-2">
                {complaint.timeline.map((entry) => (
                  <div key={entry.id} className="relative">
                    <div className="absolute -left-[31px] top-0 w-3 h-3 bg-orange-600 rounded-full ring-4 ring-orange-100" />
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{entry.title}</span>
                        <span className="text-[10px] text-slate-400">{entry.date}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1">{entry.description}</p>
                      <span className="text-[10px] font-semibold text-slate-500 mt-1 block">
                        Actor: {entry.actor}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Responses & Clarifications Tab */}
          {activeTab === "responses" && (
            <div className="space-y-5">
              {/* Institutional Response */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Institutional Response (Action Taken Report)
                </span>
                {complaint.institutionalResponse ? (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {complaint.institutionalResponse.officerName} ({complaint.institutionalResponse.designation})
                      </span>
                      <span className="text-[10px] text-slate-400">{complaint.institutionalResponse.date}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Written Explanation</span>
                      <p className="text-slate-700 leading-relaxed mt-0.5">{complaint.institutionalResponse.explanation}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Corrective Action Taken</span>
                      <p className="text-slate-700 leading-relaxed mt-0.5">{complaint.institutionalResponse.correctiveAction}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-center py-4 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No institutional response submitted yet.
                  </p>
                )}
              </div>

              {/* Clarification Requests */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Requests for Additional Information ({complaint.clarificationRequests.length})
                </span>
                {complaint.clarificationRequests.length === 0 ? (
                  <p className="text-center py-4 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No clarification requests pending.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {complaint.clarificationRequests.map((req) => (
                      <div key={req.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">Requested by: {req.requestedBy}</span>
                          <span className="text-[10px] text-slate-400">{req.date}</span>
                        </div>
                        <p className="text-slate-700 font-medium">Q: {req.question}</p>

                        {req.response ? (
                          <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                            <span className="text-[10px] font-bold text-emerald-700 block">Complainant Clarification</span>
                            <p className="text-slate-700 mt-0.5">{req.response}</p>
                            <span className="text-[10px] text-slate-400 block mt-1">Submitted on: {req.responseDate}</span>
                          </div>
                        ) : role === "student_teacher" ? (
                          <div className="pt-2 border-t border-slate-200 space-y-2">
                            <textarea
                              rows={2}
                              placeholder="Type clarification response..."
                              value={clarificationResponse}
                              onChange={(e) => setClarificationResponse(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                            />
                            <button
                              onClick={() => handleSubmitClarification(req.id)}
                              className="px-3 py-1 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
                            >
                              Submit Clarification
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold inline-block">
                            Awaiting response from complainant
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Internal Remarks Tab (Admin Only) */}
          {activeTab === "remarks" && role === "aicte_admin" && (
            <div className="space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Privileged Inter-Bureau Coordination Remarks
              </span>

              <form onSubmit={handleAddRemark} className="space-y-2">
                <textarea
                  rows={3}
                  placeholder="Record coordination note or bureau recommendation..."
                  value={internalRemark}
                  onChange={(e) => setInternalRemark(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-lg transition-colors"
                >
                  Save Internal Remark
                </button>
              </form>

              <div className="space-y-2 pt-2">
                {complaint.internalRemarks.map((r) => (
                  <div key={r.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-900">{r.officer} ({r.bureau})</span>
                      <span className="text-slate-400">{r.date}</span>
                    </div>
                    <p className="text-slate-700 mt-1 leading-relaxed">{r.remark}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">ID: {complaint.id}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

