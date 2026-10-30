"use client";

import React, { useState } from "react";
import { 
  X, 
  Send, 
  Upload, 
  AlertCircle, 
  Shield, 
  CheckCircle2, 
  Paperclip,
  Building,
  GraduationCap
} from "lucide-react";
import { Grievance, mockCategories, mockInstitutions, Priority, Category } from "@/data/mockData";

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newGrievance: Partial<Grievance>) => void;
}

export default function ComplaintModal({ isOpen, onClose, onSubmit }: ComplaintModalProps) {
  const [complainantName, setComplainantName] = useState("Aarav Sharma");
  const [complainantEmail, setComplainantEmail] = useState("aarav.sharma@dtu.ac.in");
  const [complainantRole, setComplainantRole] = useState<"Student" | "Faculty">("Student");
  const [selectedInstId, setSelectedInstId] = useState(mockInstitutions[0].id);
  const [category, setCategory] = useState<Category>("Academic & Curriculum");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string }[]>([
    { name: "Supporting_Evidence_Document.pdf", size: "1.4 MB" }
  ]);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;

    const matchedInst = mockInstitutions.find((i) => i.id === selectedInstId) || mockInstitutions[0];

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const tracking = `AICTE-2026-${randomSuffix}`;

    const newGrievance: Partial<Grievance> = {
      id: `GRV-2026-${randomSuffix}`,
      trackingNumber: tracking,
      complainantName: isAnonymous ? "Anonymous Complainant" : complainantName,
      complainantEmail: isAnonymous ? "confidential@aicte.gov.in" : complainantEmail,
      complainantRole,
      isAnonymous,
      institutionName: matchedInst.name,
      institutionId: matchedInst.id,
      regionalBureau: matchedInst.region as any,
      pgrcCell: `PGRC Cell - ${matchedInst.name.split("(")[0].trim()}`,
      category,
      subject,
      description,
      priority,
      status: "Submitted",
      createdAt: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
      slaDaysRemaining: priority === "Critical" ? 3 : priority === "High" ? 7 : 14,
      documents: uploadedFiles,
      responses: [],
      timeline: [
        {
          date: new Date().toISOString().split("T")[0],
          title: "Grievance Lodged",
          actor: isAnonymous ? "Anonymous Complainant" : complainantName,
          description: "New grievance submitted through AICTE Grievance360."
        }
      ]
    };

    setIsSuccess(true);
    setTimeout(() => {
      onSubmit(newGrievance);
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  const handleSimulateFileUpload = () => {
    const sampleFiles = [
      { name: "Dean_Office_Letter.pdf", size: "890 KB" },
      { name: "Fee_Challan_Copy.png", size: "2.1 MB" },
      { name: "Audio_Transcript_Log.pdf", size: "430 KB" },
    ];
    const randomPick = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
    setUploadedFiles((prev) => [...prev, randomPick]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-pink-200 overflow-hidden my-8">
        {/* Header with Pink and Purple Accent */}
        <div className="p-6 bg-gradient-to-r from-pink-50 via-white to-purple-50 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-200">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Lodge Official Grievance</h2>
              <p className="text-xs text-slate-500">Under AICTE Redressal Regulations (Gazette Notification)</p>
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
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Grievance Lodged Successfully!</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your grievance has been safely transmitted to the institution's Public Grievance Redressal Cell (PGRC) and registered in the AICTE Master Registry with SLA tracking initiated.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Complainant Role & Anonymity Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  I am filing as
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setComplainantRole("Student")}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      complainantRole === "Student"
                        ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                        : "bg-white text-slate-700 border-pink-200 hover:bg-pink-50"
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setComplainantRole("Faculty")}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      complainantRole === "Faculty"
                        ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                        : "bg-white text-slate-700 border-pink-200 hover:bg-pink-50"
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    Faculty / Staff
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Identity Protection
                </label>
                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`w-full flex items-center justify-between py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    isAnonymous
                      ? "bg-pink-100 text-pink-900 border-pink-300"
                      : "bg-white text-slate-600 border-pink-200 hover:bg-pink-50"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Shield className={`w-4 h-4 ${isAnonymous ? "text-pink-600" : "text-slate-400"}`} />
                    {isAnonymous ? "Whistleblower Confidential Mode" : "Public Identity (Standard)"}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${isAnonymous ? "bg-pink-500 text-white" : "bg-slate-200 text-slate-600"}`}>
                    {isAnonymous ? "ANONYMOUS" : "SHOWN"}
                  </span>
                </button>
              </div>
            </div>

            {/* Complainant Name & Contact Info (Disabled if anonymous) */}
            {!isAnonymous && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FFF5F8] p-3 rounded-2xl border border-pink-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Complainant Full Name
                  </label>
                  <input
                    type="text"
                    value={complainantName}
                    onChange={(e) => setComplainantName(e.target.value)}
                    required
                    className="w-full bg-white border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Institutional Email Address
                  </label>
                  <input
                    type="email"
                    value={complainantEmail}
                    onChange={(e) => setComplainantEmail(e.target.value)}
                    required
                    className="w-full bg-white border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}

            {/* Institution Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target AICTE Approved Institution
              </label>
              <select
                value={selectedInstId}
                onChange={(e) => setSelectedInstId(e.target.value)}
                className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {mockInstitutions.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} ({inst.region})
                  </option>
                ))}
              </select>
            </div>

            {/* Category & Priority Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Grievance Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {mockCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Severity / Urgency Level
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(["Low", "Medium", "High", "Critical"] as Priority[]).map((p) => {
                    const isSelected = priority === p;
                    const colors = 
                      p === "Critical" ? "hover:border-red-500 text-red-700" :
                      p === "High" ? "hover:border-amber-500 text-amber-700" :
                      p === "Medium" ? "hover:border-purple-500 text-purple-700" :
                      "hover:border-emerald-500 text-emerald-700";

                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`py-2 px-1 text-[11px] font-bold rounded-xl border text-center transition-all ${
                          isSelected
                            ? p === "Critical"
                              ? "bg-red-600 text-white border-red-600"
                              : p === "High"
                              ? "bg-amber-500 text-white border-amber-500"
                              : p === "Medium"
                              ? "bg-purple-600 text-white border-purple-600"
                              : "bg-emerald-600 text-white border-emerald-600"
                            : `bg-white border-pink-200 ${colors}`
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Subject / Grievance Summary
              </label>
              <input
                type="text"
                placeholder="e.g. Unfair withholding of semester hall ticket / Fee refund delay"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full bg-white border border-pink-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Detailed Statement of Grievance
              </label>
              <textarea
                rows={4}
                placeholder="Provide specific dates, departments involved, formal communications submitted, and the redressal requested..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full bg-white border border-pink-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Document Upload Simulator */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Supporting Documents / Evidence (PDF, PNG, JPG)
                </label>
                <button
                  type="button"
                  onClick={handleSimulateFileUpload}
                  className="text-[11px] font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                >
                  <Paperclip className="w-3 h-3" />
                  + Add Sample File
                </button>
              </div>

              <div 
                onClick={handleSimulateFileUpload}
                className="border-2 border-dashed border-pink-300 hover:border-purple-400 bg-pink-50/50 hover:bg-pink-50 rounded-2xl p-4 text-center cursor-pointer transition-colors"
              >
                <Upload className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                <p className="text-xs font-bold text-slate-800">
                  Click to browse or drop supporting evidence here
                </p>
                <p className="text-[11px] text-slate-500">
                  PDF, DOCX, JPG or PNG up to 10MB per file
                </p>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-2.5 space-y-1.5">
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-1.5 bg-white border border-pink-200 rounded-xl text-xs">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-3.5 h-3.5 text-purple-600" />
                        <span className="font-semibold text-slate-800">{f.name}</span>
                        <span className="text-[10px] text-slate-400">({f.size})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadedFiles(uploadedFiles.filter((_, idx) => idx !== i))}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-pink-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>Protected under AICTE Whistleblower & Grievance Norms 2024</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-black text-white bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl shadow-md shadow-purple-200 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Grievance
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

