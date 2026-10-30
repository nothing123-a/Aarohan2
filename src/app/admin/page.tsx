"use client";

import React, { useState, useEffect, Suspense } from "react";
import AppNavbar from "@/components/layout/AppNavbar";
import AppSidebar from "@/components/layout/AppSidebar";
import ComplaintDetailModal from "@/components/complaints/ComplaintDetailModal";
import OverlapComparisonModal from "@/components/overlaps/OverlapComparisonModal";
import { Complaint, ComplaintStatus, Bureau, Priority, Institution, OverlapAlert } from "@/types";
import { StorageService } from "@/lib/storage";
import {
  Layers,
  Copy,
  Building,
  Users2,
  BarChart3,
  Search,
  Filter,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Link2,
  ArrowRight,
  ExternalLink,
  GitMerge,
  Ban,
  Download,
  Eye,
  User,
  ShieldCheck,
  X
} from "lucide-react";

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [overlapAlerts, setOverlapAlerts] = useState<OverlapAlert[]>([]);
  const [activeTab, setActiveTab] = useState<string>("overview");

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [selectedOverlapAlert, setSelectedOverlapAlert] = useState<OverlapAlert | null>(null);
  const [isOverlapModalOpen, setIsOverlapModalOpen] = useState(false);

  // Filters for Complaint Register
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [bureauFilter, setBureauFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [institutionFilter, setInstitutionFilter] = useState<string>("All");

  // Selected Institution profile in directory
  const [selectedDirectoryInst, setSelectedDirectoryInst] = useState<Institution | null>(null);

  const refreshData = () => {
    StorageService.init();
    setComplaints(StorageService.getComplaints());
    setInstitutions(StorageService.getInstitutions());
    setOverlapAlerts(StorageService.getOverlapAlerts());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Filtered complaints register
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch =
      c.subject.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.trackingNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.institutionName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.complainantName.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    const matchesBureau = bureauFilter === "All" || c.assignedBureau === bureauFilter;
    const matchesPriority = priorityFilter === "All" || c.priority === priorityFilter;
    const matchesInst = institutionFilter === "All" || c.aictePermanentId === institutionFilter;

    return matchesSearch && matchesStatus && matchesBureau && matchesPriority && matchesInst;
  });

  // Section 3A. Administrative overview calculations:
  const totalComplaints = complaints.length;
  const newSubmitted = complaints.filter(c => c.status === "Submitted").length;
  const underReview = complaints.filter(c => c.status === "Under Review" || c.status === "Under Process").length;
  const awaitingInfo = complaints.filter(c => c.status === "Awaiting Information").length;
  const escalatedCount = complaints.filter(c => c.status === "Escalated").length;
  const resolvedCount = complaints.filter(c => c.status === "Resolved / Disposed" || c.status === "Closed").length;
  const overdueCount = complaints.filter(c => c.slaDaysRemaining <= 0 && c.status !== "Resolved / Disposed" && c.status !== "Closed").length;
  const potentialOverlapsCount = overlapAlerts.filter(a => !a.isReviewed).length;

  // CSV Export Functionality (Section 3B)
  const handleExportCSV = () => {
    const headers = ["Complaint ID", "Tracking Number", "Institution", "AICTE PID", "Category", "Priority", "Assigned Bureau", "Officer", "Status", "Received Date", "SLA Days Left"];
    const rows = filteredComplaints.map(c => [
      c.id,
      c.trackingNumber,
      `"${c.institutionName.replace(/"/g, '""')}"`,
      c.aictePermanentId,
      `"${c.category}"`,
      c.priority,
      `"${c.assignedBureau}"`,
      `"${c.assignedOfficer}"`,
      c.status,
      c.receivedDate,
      c.slaDaysRemaining
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AICTE_Grievance_Master_Register_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenOverlapModal = (alertItem: OverlapAlert) => {
    setSelectedOverlapAlert(alertItem);
    setIsOverlapModalOpen(true);
  };

  const handleOpenRelatedCase = (relatedId: string) => {
    const found = StorageService.getComplaintById(relatedId);
    if (found) {
      setSelectedComplaint(found);
      setIsDetailOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <AppNavbar currentRole="aicte_admin" pageTitle="AICTE Central Admin Dashboard" />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <AppSidebar
          role="aicte_admin"
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-x-hidden">
          {/* Header Bar */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  Apex Regulatory Oversight
                </span>
                <span className="text-xs text-slate-400">· Problem Statement 26264</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Centralized Redressal Command Center
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                One Institution. One Unified View. Complete Accountability across Regional Bureaus & PGRC.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-orange-600 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <FileSpreadsheet size={15} className="text-orange-600" />
                <span>Export Master Register (CSV)</span>
              </button>
            </div>
          </div>

          {/* Section 3A: Administrative Overview Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-medium text-slate-500 block">Total Complaints</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalComplaints}</p>
              <span className="text-[11px] text-slate-400">All India Register</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-medium text-slate-500 block">Active Scrutiny</span>
              <p className="text-2xl font-extrabold text-blue-600 mt-1">{underReview + newSubmitted}</p>
              <span className="text-[11px] text-slate-400">RB / PGRC In Process</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-medium text-slate-500 block">Potential Overlaps</span>
              <p className="text-2xl font-extrabold text-orange-600 mt-1">{potentialOverlapsCount}</p>
              <span className="text-[11px] text-orange-700 font-semibold">Human Review Required</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-medium text-slate-500 block">Escalated / Overdue</span>
              <p className="text-2xl font-extrabold text-red-600 mt-1">{escalatedCount + overdueCount}</p>
              <span className="text-[11px] text-red-500 font-semibold">State Ombudsman Action</span>
            </div>
          </div>

          {/* TAB 1: OVERVIEW & CENTRAL REGISTER */}
          {(activeTab === "overview" || activeTab === "all-complaints") && (
            <div className="space-y-6">
              {/* Overlap Detection Banner if pending */}
              {potentialOverlapsCount > 0 && (
                <div className="p-4 bg-orange-50/80 border border-orange-200 rounded-xl flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0">
                      <Copy size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        {potentialOverlapsCount} Potential Case Overlaps Detected by Cross-Bureau Engine
                      </p>
                      <p className="text-slate-600 text-[11px]">
                        Identical institutions with overlapping grievance descriptions require human comparison.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("overlaps")}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 transition-colors shadow-2xs shrink-0"
                  >
                    Open Overlap Center →
                  </button>
                </div>
              )}

              {/* Section 3B: Complete Complaint Register */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">National Master Complaint Register</h2>
                    <p className="text-slate-500">Global register with multi-bureau filtering, sorting, and case actions</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    Showing {filteredComplaints.length} of {complaints.length} Cases
                  </span>
                </div>

                {/* Filter Controls Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="relative">
                    <Search size={13} className="text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search ID, college, complainant..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>

                  <select
                    value={bureauFilter}
                    onChange={(e) => setBureauFilter(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none"
                  >
                    <option value="All">All Bureaus / Cells</option>
                    <option value="Regional Bureau (RB)">Regional Bureau (RB)</option>
                    <option value="Public Grievance Redressal Cell (PGRC)">Public Grievance Redressal Cell (PGRC)</option>
                    <option value="Approval Bureau">Approval Bureau</option>
                    <option value="Policy & Academic Planning Bureau">Policy & Academic Planning Bureau</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Under Process">Under Process</option>
                    <option value="Awaiting Information">Awaiting Information</option>
                    <option value="Escalated">Escalated</option>
                    <option value="Resolved / Disposed">Resolved / Disposed</option>
                  </select>

                  <select
                    value={institutionFilter}
                    onChange={(e) => setInstitutionFilter(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none"
                  >
                    <option value="All">All Institutions</option>
                    {institutions.map(i => (
                      <option key={i.aictePermanentId} value={i.aictePermanentId}>{i.name.split("(")[0]}</option>
                    ))}
                  </select>
                </div>

                {/* Register Table with Complaint ID, Subject, Institution, AICTE PID, Category, Priority, Assigned Bureau, Officer, Status, Received Date, Expected Disposal */}
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Tracking ID</th>
                        <th className="py-3 px-4">Subject & Institution</th>
                        <th className="py-3 px-4">PID</th>
                        <th className="py-3 px-4">Assigned Bureau</th>
                        <th className="py-3 px-4">Priority</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">SLA Deadline</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredComplaints.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-slate-400">
                            No complaints match current filters.
                          </td>
                        </tr>
                      ) : (
                        filteredComplaints.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-orange-600">
                              {c.trackingNumber}
                            </td>
                            <td className="py-3 px-4 max-w-xs">
                              <p className="font-bold text-slate-900 truncate">{c.subject}</p>
                              <span className="text-[10px] text-slate-500 truncate block">{c.institutionName}</span>
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-500">{c.aictePermanentId}</td>
                            <td className="py-3 px-4">
                              <span className="font-semibold text-slate-800 block">{c.assignedBureau}</span>
                              <span className="text-[10px] text-slate-400">{c.assignedOfficer}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  c.priority === "Critical" ? "bg-red-50 text-red-700" :
                                  c.priority === "High" ? "bg-orange-50 text-orange-700" :
                                  "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {c.priority}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  c.status === "Resolved / Disposed" || c.status === "Closed"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : c.status === "Escalated"
                                    ? "bg-red-50 text-red-700"
                                    : "bg-blue-50 text-blue-700"
                                }`}
                              >
                                {c.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-medium text-slate-700 block">{c.expectedDisposalDate}</span>
                              <span className={`text-[10px] font-bold ${c.slaDaysRemaining > 0 ? "text-orange-600" : "text-emerald-600"}`}>
                                {c.slaDaysRemaining > 0 ? `${c.slaDaysRemaining}d remaining` : "Disposed"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => {
                                  setSelectedComplaint(c);
                                  setIsDetailOpen(true);
                                }}
                                className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                              >
                                Manage Case
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: OVERLAP DETECTION CENTER (Most Important Feature) */}
          {activeTab === "overlaps" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Overlap Detection Center
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full border border-orange-200">
                    Core Intelligence Engine
                  </span>
                </div>
                <p className="text-slate-500 mt-1 leading-relaxed">
                  Identifies potentially related complaints assigned across different AICTE bureaus (Regional Bureau vs PGRC) concerning the same institution.
                  Enables officers to <b>Compare Cases side-by-side</b>, <b>Link as Related</b>, or <b>Mark Not Related</b>.
                </p>
              </div>

              {/* Seeded Scenarios Notice Card */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 space-y-1">
                <span className="font-bold text-slate-900 block">Demonstration Scenarios Loaded:</span>
                <p>• <b>Scenario 1 (High Match):</b> DTU Caution Money delay filed in RB vs PGRC (Cross-bureau duplicate detection).</p>
                <p>• <b>Scenario 2 (Same Institution, Distinct Topic):</b> COEP Anti-Ragging vs Laboratory grant allocation.</p>
                <p>• <b>Scenario 3 (Different Institutions, Similar Wording):</b> MIT Chennai vs RVCE Bangalore equipment purchase bottleneck.</p>
              </div>

              {/* Overlap Alerts List */}
              <div className="space-y-3">
                {overlapAlerts.map((alertItem) => (
                  <div
                    key={alertItem.id}
                    className={`p-4 rounded-xl border transition-all ${
                      alertItem.isReviewed
                        ? alertItem.reviewDecision === "linked"
                          ? "bg-emerald-50/40 border-emerald-200"
                          : "bg-slate-50 border-slate-200 opacity-80"
                        : "bg-white border-orange-200 shadow-xs"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                          {alertItem.id}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">
                          {alertItem.institutionName}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          PID: {alertItem.aictePermanentId}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                          {alertItem.similarityScore}% Similarity Match ({alertItem.confidenceIndicator})
                        </span>
                        {alertItem.isReviewed && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            alertItem.reviewDecision === "linked" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                          }`}>
                            {alertItem.reviewDecision === "linked" ? "LINKED RELATED" : "MARKED NOT RELATED"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Side-by-side subjects */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-3">
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                        <div className="flex justify-between items-center text-[10px] mb-1">
                          <span className="font-mono font-bold text-slate-700">{alertItem.complaintIdA}</span>
                          <span className="font-bold text-orange-600">{alertItem.bureauA}</span>
                        </div>
                        <p className="font-bold text-slate-900 line-clamp-2">{alertItem.subjectA}</p>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                        <div className="flex justify-between items-center text-[10px] mb-1">
                          <span className="font-mono font-bold text-slate-700">{alertItem.complaintIdB}</span>
                          <span className="font-bold text-orange-600">{alertItem.bureauB}</span>
                        </div>
                        <p className="font-bold text-slate-900 line-clamp-2">{alertItem.subjectB}</p>
                      </div>
                    </div>

                    {/* Explanations */}
                    <div className="text-[11px] text-slate-600 space-y-1">
                      <span className="font-bold text-slate-800">Trigger Reasons:</span>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {alertItem.detectionReasons.slice(0, 2).map((r, ri) => (
                          <li key={ri}>{r}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {alertItem.isReviewed ? `Reviewed by ${alertItem.reviewedBy}` : "Pending Officer Decision"}
                      </span>
                      <button
                        onClick={() => handleOpenOverlapModal(alertItem)}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <Eye size={13} />
                        <span>Compare Cases Side-by-Side</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3E: INSTITUTION DIRECTORY */}
          {activeTab === "institutions" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-5 text-xs">
              <div>
                <h2 className="text-base font-bold text-slate-900">Institution Directory & Unified Profiles</h2>
                <p className="text-slate-500">Searchable technical institute repository with consolidated complaint history</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {institutions.map(inst => (
                  <div
                    key={inst.aictePermanentId}
                    onClick={() => setSelectedDirectoryInst(inst)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedDirectoryInst?.aictePermanentId === inst.aictePermanentId
                        ? "bg-orange-50/70 border-orange-400 shadow-xs"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        {inst.aictePermanentId}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">{inst.state}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 mt-2 text-sm line-clamp-1">{inst.name}</h3>
                    <p className="text-slate-500 text-[11px] mt-0.5">{inst.type}</p>

                    <div className="grid grid-cols-3 gap-1 pt-3 mt-3 border-t border-slate-100 text-center">
                      <div>
                        <span className="font-bold text-slate-900">{inst.totalComplaints}</span>
                        <span className="text-[10px] text-slate-400 block">Total</span>
                      </div>
                      <div>
                        <span className="font-bold text-amber-600">{inst.pendingComplaints}</span>
                        <span className="text-[10px] text-slate-400 block">Pending</span>
                      </div>
                      <div>
                        <span className="font-bold text-emerald-600">{inst.resolvedComplaints}</span>
                        <span className="text-[10px] text-slate-400 block">Resolved</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Institution Unified Dossier */}
              {selectedDirectoryInst && (
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4 pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-xs font-bold text-orange-600">Unified Institution Dossier</span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedDirectoryInst.name}</h3>
                      <p className="text-slate-500 text-xs">AICTE Permanent ID: <b>{selectedDirectoryInst.aictePermanentId}</b> · Nodal Officer: <b>{selectedDirectoryInst.nodalOfficerName}</b> ({selectedDirectoryInst.nodalOfficerEmail})</p>
                    </div>
                    <button
                      onClick={() => setSelectedDirectoryInst(null)}
                      className="p-1 text-slate-400 hover:text-slate-600"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                      Cross-Bureau Complaints History ({complaints.filter(c => c.aictePermanentId === selectedDirectoryInst.aictePermanentId).length})
                    </span>
                    <div className="space-y-2">
                      {complaints.filter(c => c.aictePermanentId === selectedDirectoryInst.aictePermanentId).map(c => (
                        <div key={c.id} className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="font-mono font-bold text-orange-600 mr-2">{c.trackingNumber}</span>
                            <span className="font-bold text-slate-900">{c.subject}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Assigned to: {c.assignedBureau} · Status: <b>{c.status}</b></span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedComplaint(c);
                              setIsDetailOpen(true);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
                          >
                            Inspect
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 3D: BUREAU COORDINATION */}
          {activeTab === "coordination" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-5 text-xs">
              <div>
                <h2 className="text-base font-bold text-slate-900">Inter-Bureau Coordination Panel</h2>
                <p className="text-slate-500">
                  Regional Bureau (RB) and Public Grievance Redressal Cell (PGRC) synchronized oversight
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-slate-900 text-sm">Regional Bureau (RB) Cases</span>
                    <span className="text-xs font-bold text-orange-600">
                      {complaints.filter(c => c.assignedBureau === "Regional Bureau (RB)").length} Active
                    </span>
                  </div>
                  <div className="space-y-2">
                    {complaints.filter(c => c.assignedBureau === "Regional Bureau (RB)").slice(0, 4).map(c => (
                      <div key={c.id} className="p-2.5 bg-white rounded-lg border border-slate-200">
                        <span className="font-mono text-orange-600 font-bold">{c.trackingNumber}</span>
                        <p className="font-bold text-slate-900 line-clamp-1">{c.subject}</p>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{c.institutionName} · Officer: {c.assignedOfficer}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-slate-900 text-sm">Public Grievance Redressal Cell (PGRC)</span>
                    <span className="text-xs font-bold text-orange-600">
                      {complaints.filter(c => c.assignedBureau === "Public Grievance Redressal Cell (PGRC)").length} Active
                    </span>
                  </div>
                  <div className="space-y-2">
                    {complaints.filter(c => c.assignedBureau === "Public Grievance Redressal Cell (PGRC)").slice(0, 4).map(c => (
                      <div key={c.id} className="p-2.5 bg-white rounded-lg border border-slate-200">
                        <span className="font-mono text-orange-600 font-bold">{c.trackingNumber}</span>
                        <p className="font-bold text-slate-900 line-clamp-1">{c.subject}</p>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{c.institutionName} · Officer: {c.assignedOfficer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: ANALYTICS & REPORTS */}
          {activeTab === "analytics" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Analytics & Redressal Performance</h2>
                  <p className="text-slate-500">Real-time metrics, bureau distribution, and category trends</p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Download size={13} />
                  <span>Download Report (CSV)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Complaints by Category Progress */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-900 text-sm block">Complaints by Category</span>
                  {[
                    { name: "Fee Refund & Caution Money", pct: 35, count: "7 Cases", color: "bg-orange-500" },
                    { name: "Academic Discrepancy & Evaluation", pct: 25, count: "5 Cases", color: "bg-blue-500" },
                    { name: "Infrastructure & Hostel Facilities", pct: 20, count: "4 Cases", color: "bg-purple-500" },
                    { name: "Ragging & Student Safety", pct: 10, count: "2 Cases", color: "bg-red-500" },
                    { name: "Faculty Misconduct & Salary", pct: 10, count: "2 Cases", color: "bg-amber-500" },
                  ].map((cat, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-800">{cat.name}</span>
                        <span className="text-slate-500">{cat.count} ({cat.pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bureau Performance SLA */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-900 text-sm block">15-Day SLA Disposal Performance</span>
                  {[
                    { bureau: "Regional Bureau (RB)", score: 92, status: "Compliant" },
                    { bureau: "Public Grievance Redressal Cell (PGRC)", score: 95, status: "Excellent" },
                    { bureau: "Approval Bureau", score: 88, status: "Under Review" },
                    { bureau: "Policy & Academic Planning Bureau", score: 94, status: "Compliant" },
                  ].map((b, i) => (
                    <div key={i} className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{b.bureau}</p>
                        <span className="text-[11px] text-slate-500">SLA Adherence: <b>{b.score}%</b></span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3F: USER MANAGEMENT */}
          {activeTab === "users" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4 text-xs max-w-2xl">
              <div>
                <h2 className="text-base font-bold text-slate-900">Demo User & Access Management</h2>
                <p className="text-slate-500">Role-based access controls for prototype demonstration</p>
              </div>

              <div className="space-y-2">
                {[
                  { name: "Dr. Rajesh Verma", role: "AICTE Central Admin", desc: "Full permissions: Reassignment, Overlap reviews, Status changes", current: true },
                  { name: "Prof. S. K. Mahajan", role: "Institution Nodal Officer", desc: "Restricted to DTU assigned cases, response filing and ATR uploads", current: false },
                  { name: "Aarav Sharma", role: "Student / Complainant", desc: "Complainant submission, status tracking, clarification submission", current: false },
                ].map((u, i) => (
                  <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{u.name}</p>
                      <span className="text-xs font-semibold text-orange-600 block">{u.role}</span>
                      <p className="text-slate-500 text-[11px] mt-0.5">{u.desc}</p>
                    </div>
                    {u.current && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ACTIVE SESSION
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Case Details Modal */}
      <ComplaintDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        complaint={selectedComplaint}
        role="aicte_admin"
        onComplaintUpdated={() => refreshData()}
        onOpenRelatedCase={handleOpenRelatedCase}
      />

      {/* Overlap Comparison Modal */}
      <OverlapComparisonModal
        isOpen={isOverlapModalOpen}
        onClose={() => setIsOverlapModalOpen(false)}
        alert={selectedOverlapAlert}
        onActionComplete={() => refreshData()}
      />
    </div>
  );
}
