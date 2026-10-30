"use client";

import React, { useState } from "react";
import { 
  X, 
  Send, 
  UploadCloud, 
  Paperclip, 
  ShieldCheck, 
  CheckCircle2, 
  Building2,
  FileCheck
} from "lucide-react";
import { Grievance, GrievanceResponse, Role } from "@/data/mockData";

interface ResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  grievance: Grievance | null;
  role: Role;
  onSubmitResponse: (grievanceId: string, response: GrievanceResponse, updatedStatus?: any) => void;
}

export default function ResponseModal({
  isOpen,
  onClose,
  grievance,
  role,
  onSubmitResponse,
}: ResponseModalProps) {
  const [responderName, setResponderName] = useState(
    role === "institution" ? "DTU PGRC Committee Convener" : "AICTE Central Redressal Officer"
  );
  const [message, setMessage] = useState("");
  const [proposedStatus, setProposedStatus] = useState<string>("In Progress");
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string }[]>([
    { name: "PGRC_Hearing_Notice_Signed.pdf", size: "1.1 MB" },
  ]);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !grievance) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    const newResponse: GrievanceResponse = {
      id: `R-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      responderRole: role,
      responderName,
      message,
      documents: attachedFiles,
    };

    setIsSuccess(true);
    setTimeout(() => {
      onSubmitResponse(grievance.id, newResponse, proposedStatus);
      setIsSuccess(false);
      onClose();
    }, 1000);
  };

  const addSampleDoc = () => {
    const list = [
      { name: "Action_Taken_Report_ATR.pdf", size: "2.3 MB" },
      { name: "Committee_Minutes_Signed.pdf", size: "950 KB" },
      { name: "Accounts_Disbursement_Challan.pdf", size: "640 KB" },
      { name: "Affidavit_Undertaking.pdf", size: "1.5 MB" },
    ];
    const picked = list[Math.floor(Math.random() * list.length)];
    setAttachedFiles((prev) => [...prev, picked]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-pink-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-pink-50 via-white to-purple-50 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-200">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                {role === "institution" ? "Submit Institution Response" : "AICTE Authority Directive"}
              </h2>
              <p className="text-xs text-slate-500">
                Tracking: <span className="font-bold text-purple-700">{grievance.trackingNumber}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-10 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h3 className="text-lg font-black text-slate-900">Official Response Recorded</h3>
            <p className="text-xs text-slate-600">
              Response and documentation synced with Complainant and AICTE Central Monitoring desk.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Grievance Context Card */}
            <div className="p-3 bg-pink-50/70 border border-pink-200 rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Subject</span>
              <p className="text-xs font-bold text-slate-900 line-clamp-2 mt-0.5">{grievance.subject}</p>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-600">
                <span>Complainant: <b className="text-slate-900">{grievance.complainantName}</b></span>
                <span>•</span>
                <span>Institution: <b className="text-slate-900">{grievance.institutionName}</b></span>
              </div>
            </div>

            {/* Responder Identity */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Authorized Officer / Committee Convener
              </label>
              <input
                type="text"
                value={responderName}
                onChange={(e) => setResponderName(e.target.value)}
                required
                className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Status Update Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Update Case Status
              </label>
              <select
                value={proposedStatus}
                onChange={(e) => setProposedStatus(e.target.value)}
                className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="In Progress">In Progress (Under Active Examination)</option>
                <option value="Action Required">Action Required from Complainant</option>
                <option value="Resolved">Resolved (Satisfactory Remedy Provided)</option>
                <option value="Escalated">Escalated to AICTE Ombudsman / Legal Panel</option>
              </select>
            </div>

            {/* Official Response / ATR */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Findings, Remedial Action & Official Remarks
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="State the committee findings, actions taken, meeting minutes reference, or directives issued..."
                required
                className="w-full bg-white border border-pink-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Supporting Documents */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Upload Supporting Evidence / Inquiry Report
                </label>
                <button
                  type="button"
                  onClick={addSampleDoc}
                  className="text-[11px] font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                >
                  <Paperclip className="w-3 h-3" />
                  + Attach Document
                </button>
              </div>

              <div 
                onClick={addSampleDoc}
                className="border border-dashed border-pink-300 hover:border-purple-400 bg-pink-50/40 rounded-xl p-3 text-center cursor-pointer transition-colors"
              >
                <UploadCloud className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-xs font-bold text-slate-800">
                  Click to attach Action Taken Report (ATR) / Committee Minutes
                </p>
              </div>

              {attachedFiles.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {attachedFiles.map((file, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-1.5 bg-[#FFF5F8] border border-pink-200 rounded-xl text-xs">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-3.5 h-3.5 text-purple-600" />
                        <span className="font-semibold text-slate-800">{file.name}</span>
                        <span className="text-[10px] text-slate-400">({file.size})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachedFiles(attachedFiles.filter((_, idx) => idx !== i))}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-pink-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-black text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl shadow-md shadow-purple-200 transition-all flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Official Response
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

