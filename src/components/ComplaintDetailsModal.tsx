"use client";

import React, { useState } from "react";
import { 
  X, 
  Clock, 
  Calendar, 
  Building, 
  FileText, 
  Download, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  MessageSquare, 
  Send, 
  ArrowUpRight,
  ExternalLink,
  User,
  GraduationCap,
  Sparkles,
  Paperclip
} from "lucide-react";
import { Grievance, Role } from "@/data/mockData";

interface ComplaintDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  grievance: Grievance | null;
  role: Role;
  onOpenResponseModal?: (grievance: Grievance) => void;
  onUpdateStatus?: (grievanceId: string, status: any) => void;
}

export default function ComplaintDetailsModal({
  isOpen,
  onClose,
  grievance,
  role,
  onOpenResponseModal,
  onUpdateStatus,
}: ComplaintDetailsModalProps) {
  if (!isOpen || !grievance) return null;

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-300";
      case "High":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Medium":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "Resolved":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Escalated":
        return "bg-red-100 text-red-800 border-red-300 pulse-critical";
      case "Action Required":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "In Progress":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-pink-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-pink-50 via-white to-purple-50 border-b border-pink-100 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black bg-purple-700 text-white px-2.5 py-0.5 rounded-lg shadow-sm">
                {grievance.trackingNumber}
              </span>
              <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${getStatusBadge(grievance.status)}`}>
                {grievance.status}
              </span>
              <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${getPriorityBadge(grievance.priority)}`}>
                {grievance.priority} Urgency
              </span>
              {grievance.isDuplicateFlagged && (
                <span className="text-[10px] font-black uppercase tracking-wider bg-pink-100 text-pink-700 border border-pink-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-pink-600" />
                  AI Duplicate Flag ({grievance.duplicateScore}% Match)
                </span>
              )}
            </div>
            <h2 className="text-lg font-black text-slate-900 mt-2">{grievance.subject}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Key Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#FFF5F8] rounded-2xl border border-pink-200 text-xs">
            <div>
              <p className="text-[11px] text-slate-500 font-semibold">Complainant</p>
              <p className="font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-purple-600" />
                {grievance.complainantName}
              </p>
              <span className="text-[10px] text-slate-500">
                {grievance.isAnonymous ? "Protected Whistleblower" : grievance.complainantRole}
              </span>
            </div>

            <div>
              <p className="text-[11px] text-slate-500 font-semibold">Institution</p>
              <p className="font-bold text-slate-900 mt-0.5 truncate" title={grievance.institutionName}>
                {grievance.institutionName.split("(")[0]}
              </p>
              <span className="text-[10px] text-slate-500">{grievance.regionalBureau.split("(")[0]}</span>
            </div>

            <div>
              <p className="text-[11px] text-slate-500 font-semibold">Lodged Date</p>
              <p className="font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-600" />
                {grievance.createdAt}
              </p>
              <span className="text-[10px] text-slate-500">Updated: {grievance.lastUpdated}</span>
            </div>

            <div>
              <p className="text-[11px] text-slate-500 font-semibold">SLA Window</p>
              <p className="font-bold text-purple-700 mt-0.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {grievance.slaDaysRemaining > 0 ? `${grievance.slaDaysRemaining} Days Left` : "Overdue / Closed"}
              </p>
              <span className="text-[10px] text-slate-500">AICTE 15-Day Limit</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-purple-800 mb-1.5">
              Grievance Narrative / Complainant Statement
            </h4>
            <div className="p-4 bg-white border border-pink-100 rounded-2xl shadow-sm text-xs leading-relaxed text-slate-800">
              {grievance.description}
            </div>
          </div>

          {/* Documents Attached */}
          {grievance.documents && grievance.documents.length > 0 && (
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-purple-800 mb-2">
                Evidence & Documentation Files ({grievance.documents.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {grievance.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-pink-50/50 hover:bg-pink-50 border border-pink-200 rounded-xl text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                      <span className="font-bold text-slate-800 truncate">{doc.name}</span>
                      <span className="text-[10px] text-slate-400">({doc.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert(`Simulating secure download for file: ${doc.name}`)}
                      className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-100 transition-colors"
                      title="Download Document"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Redressal Lifecycle Timeline */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-purple-800 mb-3">
              Redressal Lifecycle & Audit Trail
            </h4>
            <div className="relative pl-6 space-y-4 border-l-2 border-purple-200 ml-2">
              {grievance.timeline.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] top-0 w-3.5 h-3.5 bg-purple-600 rounded-full ring-4 ring-purple-100" />
                  <div className="bg-[#FFF5F8] p-3 rounded-xl border border-pink-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-slate-900">{item.title}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{item.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{item.description}</p>
                    <span className="text-[10px] font-bold text-purple-700 mt-1 inline-block">
                      Action By: {item.actor}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Official Responses Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-purple-800">
                Official Responses & Inquiry Findings ({grievance.responses.length})
              </h4>
              {(role === "institution" || role === "admin") && onOpenResponseModal && (
                <button
                  onClick={() => onOpenResponseModal(grievance)}
                  className="text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  Post Official Response
                </button>
              )}
            </div>

            {grievance.responses.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-500">
                No formal response submitted yet. PGRC has been notified with the SLA timer.
              </div>
            ) : (
              <div className="space-y-3">
                {grievance.responses.map((resp) => (
                  <div
                    key={resp.id}
                    className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">{resp.responderName}</span>
                        <span className="text-[10px] font-bold uppercase bg-purple-200 text-purple-900 px-2 py-0.5 rounded-md">
                          {resp.responderRole}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">{resp.date}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{resp.message}</p>
                    {resp.documents && resp.documents.length > 0 && (
                      <div className="pt-2 border-t border-purple-200/60 flex flex-wrap gap-2">
                        {resp.documents.map((d, di) => (
                          <div
                            key={di}
                            className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-purple-200 rounded-lg text-[11px] font-semibold text-purple-800"
                          >
                            <Paperclip className="w-3 h-3 text-purple-600" />
                            <span>{d.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-pink-50/60 border-t border-pink-100 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 font-medium">
            AICTE Grievance ID: <b className="text-slate-900">{grievance.id}</b>
          </div>

          <div className="flex items-center gap-2">
            {role === "admin" && onUpdateStatus && (
              <>
                <button
                  onClick={() => onUpdateStatus(grievance.id, "Escalated")}
                  className="px-3 py-1.5 text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 rounded-xl transition-colors"
                >
                  Escalate to Ombudsman
                </button>
                <button
                  onClick={() => onUpdateStatus(grievance.id, "Resolved")}
                  className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors"
                >
                  Mark Resolved
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-white border border-pink-200 hover:bg-pink-50 rounded-xl transition-colors"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

