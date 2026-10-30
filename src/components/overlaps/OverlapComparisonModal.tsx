"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  Link2,
  CheckCircle,
  AlertCircle,
  Building2,
  GitMerge,
  Ban,
  FileText,
  Clock
} from "lucide-react";
import { OverlapAlert, Complaint } from "@/types";
import { StorageService } from "@/lib/storage";

interface OverlapComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: OverlapAlert | null;
  onActionComplete?: () => void;
}

export default function OverlapComparisonModal({
  isOpen,
  onClose,
  alert: alertData,
  onActionComplete,
}: OverlapComparisonModalProps) {
  const [coordinationNote, setCoordinationNote] = useState("");

  if (!isOpen || !alertData) return null;

  const compA = StorageService.getComplaintById(alertData.complaintIdA);
  const compB = StorageService.getComplaintById(alertData.complaintIdB);

  const handleLinkRelated = () => {
    StorageService.linkCases(alertData.id, "Dr. Rajesh Verma (AICTE Director)", coordinationNote.trim());
    if (onActionComplete) onActionComplete();
    alert(`Cases ${alertData.complaintIdA} and ${alertData.complaintIdB} linked as Related Cases.`);
    onClose();
  };

  const handleMarkNotRelated = () => {
    StorageService.markNotRelated(alertData.id, "Dr. Rajesh Verma (AICTE Director)", coordinationNote.trim());
    if (onActionComplete) onActionComplete();
    alert(`Cases ${alertData.complaintIdA} and ${alertData.complaintIdB} marked as Not Related.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Overlap Comparison & Human Review
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 px-2 py-0.5 rounded border border-orange-200">
                  Potential Overlap — Human Review Required
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Side-by-side case scrutiny · AI Confidence Match: <b>{alertData.similarityScore}%</b> ({alertData.confidenceIndicator})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* Explainable Detection Reasons */}
          <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-xl space-y-2">
            <span className="text-xs font-bold text-orange-900 block flex items-center gap-1.5">
              <AlertCircle size={14} className="text-orange-600" />
              Explainable Detection Signals & Rules Triggered:
            </span>
            <ul className="space-y-1 pl-4 list-disc text-slate-700">
              {alertData.detectionReasons.map((reason, i) => (
                <li key={i}>{reason}</li>
              ))}
            </ul>
            <div className="pt-2 border-t border-orange-200/80 text-[11px] text-orange-950 font-medium">
              <b>Recommended Next Action:</b> {alertData.recommendedAction}
            </div>
          </div>

          {/* Side by Side Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Case A */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  Case A: {compA?.trackingNumber || alertData.complaintIdA}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">{compA?.status}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Bureau</span>
                <p className="font-bold text-slate-900 mt-0.5">{alertData.bureauA}</p>
                <span className="text-[10px] text-slate-500">{compA?.assignedOfficer}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Institution</span>
                <p className="font-bold text-slate-900 mt-0.5">{compA?.institutionName}</p>
                <span className="text-[10px] font-mono text-slate-500">PID: {compA?.aictePermanentId}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Subject</span>
                <p className="font-bold text-slate-900 mt-0.5">{alertData.subjectA}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Description</span>
                <p className="text-slate-600 leading-relaxed mt-0.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded border border-slate-100">
                  {compA?.description}
                </p>
              </div>
            </div>

            {/* Case B */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  Case B: {compB?.trackingNumber || alertData.complaintIdB}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">{compB?.status}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Bureau</span>
                <p className="font-bold text-slate-900 mt-0.5">{alertData.bureauB}</p>
                <span className="text-[10px] text-slate-500">{compB?.assignedOfficer}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Institution</span>
                <p className="font-bold text-slate-900 mt-0.5">{compB?.institutionName}</p>
                <span className="text-[10px] font-mono text-slate-500">PID: {compB?.aictePermanentId}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Subject</span>
                <p className="font-bold text-slate-900 mt-0.5">{alertData.subjectB}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Description</span>
                <p className="text-slate-600 leading-relaxed mt-0.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded border border-slate-100">
                  {compB?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Coordination Note Input */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-900 block">
              Coordination Note / Scrutiny Remarks
            </label>
            <textarea
              rows={2}
              placeholder="Record why these cases should be linked for joint inquiry or marked unrelated..."
              value={coordinationNote}
              onChange={(e) => setCoordinationNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
            />
          </div>

          {/* Review Decision History if already reviewed */}
          {alertData.isReviewed && (
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block">Review Decision Recorded:</span>
              <p className="text-slate-600 mt-0.5">
                Status: <b>{alertData.reviewDecision === "linked" ? "Linked as Related Cases" : "Marked Not Related"}</b> by {alertData.reviewedBy} on {alertData.reviewedAt}.
              </p>
              {alertData.coordinationNote && (
                <p className="text-slate-500 text-[11px] mt-1 italic">"{alertData.coordinationNote}"</p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkNotRelated}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <Ban size={14} className="text-slate-500" />
              <span>Mark Not Related</span>
            </button>

            <button
              onClick={handleLinkRelated}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Link2 size={14} />
              <span>Link as Related Cases</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

