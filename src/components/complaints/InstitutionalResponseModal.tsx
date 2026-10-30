"use client";

import React, { useState } from "react";
import {
  X,
  Send,
  UploadCloud,
  FileCheck2,
  Paperclip,
  CheckCircle2
} from "lucide-react";
import { Complaint } from "@/types";
import { StorageService } from "@/lib/storage";

interface InstitutionalResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint | null;
  onResponseSubmitted?: () => void;
}

export default function InstitutionalResponseModal({
  isOpen,
  onClose,
  complaint,
  onResponseSubmitted,
}: InstitutionalResponseModalProps) {
  const [officerName, setOfficerName] = useState("Prof. S. K. Mahajan");
  const [designation, setDesignation] = useState("PGRC Convener & Dean");
  const [explanation, setExplanation] = useState("");
  const [correctiveAction, setCorrectiveAction] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string }[]>([
    { name: "PGRC_Hearing_Minutes_Signed.pdf", size: "1.4 MB" }
  ]);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !complaint) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!explanation.trim() || !correctiveAction.trim()) return;

    StorageService.submitInstitutionalResponse(complaint.id, {
      officerName,
      designation,
      explanation: explanation.trim(),
      correctiveAction: correctiveAction.trim(),
      documents: attachedFiles,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      if (onResponseSubmitted) onResponseSubmitted();
      onClose();
    }, 1200);
  };

  const addSampleDoc = () => {
    const list = [
      { name: "Action_Taken_Report_ATR.pdf", size: "2.1 MB" },
      { name: "Accounts_Disbursement_Challan.pdf", size: "640 KB" },
      { name: "Committee_Resolution_Extract.pdf", size: "950 KB" },
    ];
    const picked = list[Math.floor(Math.random() * list.length)];
    setAttachedFiles(prev => [...prev, picked]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Submit Institutional Response & Action Taken Report
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Case Ref: <span className="font-bold text-orange-600">{complaint.trackingNumber}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Institutional Response Logged</h3>
            <p className="text-xs text-slate-500">
              Formal explanation and corrective action plan registered in AICTE Master Registry.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Context Box */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Subject</span>
              <p className="font-bold text-slate-900 mt-0.5">{complaint.subject}</p>
              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-600">
                <span>Complainant: <b>{complaint.complainantName}</b></span>
                <span>·</span>
                <span>Category: <b>{complaint.category}</b></span>
              </div>
            </div>

            {/* Officer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Responding Officer Name</label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Written Explanation */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Institutional Findings / Written Explanation</label>
              <textarea
                rows={3}
                placeholder="State the committee's factual inquiry findings and verification of complainant claims..."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900"
              />
            </div>

            {/* Corrective Action Taken */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Corrective Action Taken & Remedy Provided</label>
              <textarea
                rows={2}
                placeholder="Detail remedial steps, refund orders issued, disciplinary measures, or policy updates..."
                value={correctiveAction}
                onChange={(e) => setCorrectiveAction(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900"
              />
            </div>

            {/* Document Upload */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">Supporting Documents / Inquiry Minutes</label>
                <button
                  type="button"
                  onClick={addSampleDoc}
                  className="text-orange-600 hover:text-orange-800 font-bold flex items-center gap-1"
                >
                  <Paperclip size={12} />
                  <span>+ Attach Document</span>
                </button>
              </div>

              <div
                onClick={addSampleDoc}
                className="p-3 border border-dashed border-slate-300 hover:border-orange-400 bg-slate-50/70 rounded-xl text-center cursor-pointer transition-colors"
              >
                <UploadCloud size={18} className="text-slate-400 mx-auto mb-1" />
                <p className="font-semibold text-slate-700">Attach Action Taken Report (ATR) / Minutes</p>
                <span className="text-[10px] text-slate-400">PDF, XLSX up to 10MB</span>
              </div>

              {attachedFiles.length > 0 && (
                <div className="mt-2 space-y-1">
                  {attachedFiles.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-800">{file.name} ({file.size})</span>
                      <button
                        type="button"
                        onClick={() => setAttachedFiles(attachedFiles.filter((_, idx) => idx !== i))}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Send size={13} />
                <span>Submit Institutional Response</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

