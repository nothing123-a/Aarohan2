"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Send,
  Upload,
  CheckCircle2,
  Paperclip,
  Building2,
  Shield,
  FileCheck,
  Compass,
  Building,
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { Complaint, ComplainantType, Bureau, Priority } from "@/types";
import { StorageService } from "@/lib/storage";

interface NewComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplaintCreated: (c: Complaint) => void;
}

export default function NewComplaintModal({
  isOpen,
  onClose,
  onComplaintCreated,
}: NewComplaintModalProps) {
  const router = useRouter();
  const institutions = StorageService.getInstitutions();

  const [complainantName, setComplainantName] = useState("Aarav Sharma");
  const [complainantType, setComplainantType] = useState<ComplainantType>("Student");
  const [complainantEmail, setComplainantEmail] = useState("aarav.sharma@dtu.ac.in");
  const [complainantPhone, setComplainantPhone] = useState("+91 98712 34567");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedInstId, setSelectedInstId] = useState(institutions[0].aictePermanentId);

  const [category, setCategory] = useState("Fee Refund & Caution Money");
  const [priority, setPriority] = useState<Priority>("High");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [declaration, setDeclaration] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; type: string }[]>([
    { name: "Caution_Deposit_Clearance_Copy.pdf", size: "1.2 MB", type: "application/pdf" },
  ]);

  const [createdComplaint, setCreatedComplaint] = useState<Complaint | null>(null);

  if (!isOpen) return null;

  const matchedInst = institutions.find(i => i.aictePermanentId === selectedInstId) || institutions[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim() || !declaration) return;

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const tracking = `AICTE-2026-${matchedInst.state.slice(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newComplaint: Complaint = {
      id: `GRV-2026-${randomSuffix}`,
      trackingNumber: tracking,
      complainantName: isAnonymous ? "Anonymous Complainant" : complainantName,
      complainantType,
      complainantEmail: isAnonymous ? "confidential@aicte-grievance360.gov.in" : complainantEmail,
      complainantPhone: isAnonymous ? "+91 XXXXX XXXXX" : complainantPhone,
      isAnonymous,
      institutionName: matchedInst.name,
      aictePermanentId: matchedInst.aictePermanentId,
      institutionType: matchedInst.type,
      state: matchedInst.state,
      district: matchedInst.district,
      category,
      subject: subject.trim(),
      description: description.trim(),
      priority,
      assignedBureau: category === "Fee Refund & Caution Money" || category === "Admission Irregularity" 
        ? "Public Grievance Redressal Cell (PGRC)" 
        : "Regional Bureau (RB)",
      assignedOfficer: "Assigned Intake Officer",
      status: "Submitted",
      receivedDate: new Date().toISOString().split("T")[0],
      lastActionDate: new Date().toISOString().split("T")[0],
      expectedDisposalDate: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
      slaDaysRemaining: 15,
      supportingDocuments: uploadedFiles,
      timeline: [
        {
          id: `TL-${Date.now()}`,
          date: new Date().toISOString().split("T")[0],
          title: "Complaint Lodged",
          actor: isAnonymous ? "Anonymous Whistleblower" : complainantName,
          description: "Grievance submitted via AICTE Grievance360 portal.",
        }
      ],
      clarificationRequests: [],
      internalRemarks: [],
      linkedRelatedCaseIds: [],
      markedNotRelatedCaseIds: [],
    };

    StorageService.saveNewComplaint(newComplaint);
    setCreatedComplaint(newComplaint);
    onComplaintCreated(newComplaint);
  };

  const addSampleFile = () => {
    const samples = [
      { name: "Dean_Office_Letter.pdf", size: "850 KB", type: "application/pdf" },
      { name: "Bank_Challan_Stamp.jpg", size: "1.4 MB", type: "image/jpeg" },
      { name: "Student_Affidavit.pdf", size: "620 KB", type: "application/pdf" },
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    setUploadedFiles(prev => [...prev, picked]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-xs">
              <Send size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {createdComplaint ? "Complaint Submission Confirmation" : "Lodge Official Grievance"}
              </h2>
              <p className="text-xs text-slate-500">
                AICTE Grievance Redressal System · Problem Statement 26264
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

        {/* Confirmation Screen */}
        {createdComplaint ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Registered Successfully
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Your Complaint Has Been Logged
              </h3>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left max-w-md mx-auto space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Complaint ID:</span>
                <span className="font-mono font-bold text-slate-900">{createdComplaint.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tracking Number:</span>
                <span className="font-mono font-bold text-orange-600">{createdComplaint.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Institution:</span>
                <span className="font-semibold text-slate-900 truncate max-w-[200px]">{createdComplaint.institutionName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Status:</span>
                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{createdComplaint.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Expected SLA Disposal:</span>
                <span className="font-semibold text-slate-700">{createdComplaint.expectedDisposalDate}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your grievance has been stored and propagated across all stakeholder portals in real time.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-lg mx-auto">
              <button
                onClick={() => {
                  StorageService.setCurrentRole("student_teacher");
                  onClose();
                  router.push(`/student?track=${createdComplaint.trackingNumber}`);
                }}
                className="p-2.5 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all"
              >
                <div className="flex items-center gap-1">
                  <Compass size={14} className="text-orange-600" />
                  <span>Track Case</span>
                </div>
                <span className="text-[10px] font-normal text-orange-600">Student Portal</span>
              </button>

              <button
                onClick={() => {
                  StorageService.setCurrentRole("institution_nodal");
                  onClose();
                  router.push("/institution");
                }}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all"
              >
                <div className="flex items-center gap-1">
                  <Building size={14} className="text-slate-600" />
                  <span>Institution Desk</span>
                </div>
                <span className="text-[10px] font-normal text-slate-500">Nodal Officer</span>
              </button>

              <button
                onClick={() => {
                  StorageService.setCurrentRole("aicte_admin");
                  onClose();
                  router.push("/admin");
                }}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all"
              >
                <div className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-slate-600" />
                  <span>Admin Bureau</span>
                </div>
                <span className="text-[10px] font-normal text-slate-500">AICTE Master</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Done & Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
            {/* Complainant Type & Anonymity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Complainant Role</label>
                <select
                  value={complainantType}
                  onChange={(e) => setComplainantType(e.target.value as ComplainantType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-900 focus:outline-none"
                >
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Faculty">Faculty Member</option>
                  <option value="Other">Other Stakeholder</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Identity Confidentiality</label>
                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg border text-xs font-semibold transition-all ${
                    isAnonymous ? "bg-orange-50 border-orange-300 text-orange-900" : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Shield size={14} className={isAnonymous ? "text-orange-600" : "text-slate-400"} />
                    {isAnonymous ? "Whistleblower Confidential" : "Standard Identity"}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isAnonymous ? "bg-orange-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                    {isAnonymous ? "ACTIVE" : "OFF"}
                  </span>
                </button>
              </div>
            </div>

            {/* Complainant Details (if not anonymous) */}
            {!isAnonymous && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Full Name</label>
                  <input
                    type="text"
                    value={complainantName}
                    onChange={(e) => setComplainantName(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 rounded-md p-1.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Email Address</label>
                  <input
                    type="email"
                    value={complainantEmail}
                    onChange={(e) => setComplainantEmail(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 rounded-md p-1.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Phone Number</label>
                  <input
                    type="tel"
                    value={complainantPhone}
                    onChange={(e) => setComplainantPhone(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 rounded-md p-1.5 text-xs text-slate-900"
                  />
                </div>
              </div>
            )}

            {/* Target Institution Selection */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Target Institution & AICTE Permanent ID
              </label>
              <select
                value={selectedInstId}
                onChange={(e) => setSelectedInstId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-900 focus:outline-none"
              >
                {institutions.map(inst => (
                  <option key={inst.aictePermanentId} value={inst.aictePermanentId}>
                    {inst.name} — PID: {inst.aictePermanentId} ({inst.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Complaint Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-900 focus:outline-none"
                >
                  <option value="Fee Refund & Caution Money">Fee Refund & Caution Money</option>
                  <option value="Ragging & Student Safety">Ragging & Student Safety</option>
                  <option value="Academic Discrepancy & Evaluation">Academic Discrepancy & Evaluation</option>
                  <option value="Faculty Misconduct & Salary">Faculty Misconduct & Salary</option>
                  <option value="Infrastructure & Hostel Facilities">Infrastructure & Hostel Facilities</option>
                  <option value="Admission Irregularity">Admission Irregularity</option>
                  <option value="Degree & Marksheet Withholding">Degree & Marksheet Withholding</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Urgency / Priority</label>
                <div className="grid grid-cols-4 gap-1">
                  {(["Low", "Medium", "High", "Critical"] as Priority[]).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-1.5 rounded-md font-bold text-center border text-xs transition-colors ${
                        priority === p
                          ? p === "Critical" ? "bg-red-600 text-white border-red-600"
                            : p === "High" ? "bg-orange-600 text-white border-orange-600"
                            : "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Complaint Subject</label>
              <input
                type="text"
                placeholder="Brief summary of the issue (e.g. Unfair withholding of caution deposit)..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none"
              />
            </div>

            {/* Detailed Description */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Detailed Description of Grievance</label>
              <textarea
                rows={3}
                placeholder="Include chronological dates, communications sent, departments involved..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none"
              />
            </div>

            {/* Supporting Document Upload */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">Supporting Documents (PDF, JPG)</label>
                <button
                  type="button"
                  onClick={addSampleFile}
                  className="text-orange-600 hover:text-orange-800 font-bold flex items-center gap-1"
                >
                  <Paperclip size={12} />
                  <span>+ Attach Sample File</span>
                </button>
              </div>

              <div
                onClick={addSampleFile}
                className="p-3 border border-dashed border-slate-300 hover:border-orange-400 bg-slate-50/70 rounded-xl text-center cursor-pointer transition-colors"
              >
                <Upload size={18} className="text-slate-400 mx-auto mb-1" />
                <p className="font-semibold text-slate-700">Click to browse or drop supporting evidence</p>
                <span className="text-[10px] text-slate-400">PDF, JPG, PNG up to 10MB</span>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-2 space-y-1">
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-800">{f.name} ({f.size})</span>
                      <button
                        type="button"
                        onClick={() => setUploadedFiles(uploadedFiles.filter((_, idx) => idx !== i))}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Statutory Declaration Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={declaration}
                  onChange={(e) => setDeclaration(e.target.checked)}
                  required
                  className="mt-0.5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-slate-600 text-[11px] leading-relaxed">
                  I hereby declare that the particulars provided in this grievance are true to the best of my knowledge and that this matter is submitted for administrative redressal under AICTE norms.
                </span>
              </label>
            </div>

            {/* Submit Action */}
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
                disabled={!declaration}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5 shadow-xs ${
                  declaration ? "bg-orange-600 hover:bg-orange-700" : "bg-slate-300 cursor-not-allowed"
                }`}
              >
                <Send size={13} />
                <span>Submit Grievance</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

