"use client";

import React, { useState, useEffect, Suspense } from "react";
import AppNavbar from "@/components/layout/AppNavbar";
import AppSidebar from "@/components/layout/AppSidebar";
import InstitutionalResponseModal from "@/components/complaints/InstitutionalResponseModal";
import ComplaintDetailModal from "@/components/complaints/ComplaintDetailModal";
import { Complaint, ComplaintStatus, Institution } from "@/types";
import { StorageService } from "@/lib/storage";
import {
  Building2,
  FileCheck2,
  Send,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Download,
  Bell,
  Building,
  User,
  Shield
} from "lucide-react";

export default function InstitutionDashboard() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [selectedInstPID, setSelectedInstPID] = useState<string>("1-4921029"); // Default: Delhi Technological University (DTU)
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);

  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  const refreshData = () => {
    StorageService.init();
    const all = StorageService.getComplaints();
    const allInst = StorageService.getInstitutions();
    setInstitutions(allInst);

    if (selectedInstPID === "all") {
      setComplaints(all);
    } else {
      setComplaints(all.filter(c => c.aictePermanentId === selectedInstPID));
    }
  };

  useEffect(() => {
    refreshData();
  }, [selectedInstPID]);

  const currentInstitution = selectedInstPID === "all"
    ? null
    : institutions.find(i => i.aictePermanentId === selectedInstPID) || institutions[0];

  const institution = currentInstitution || institutions[0];

  // Filtered institution register
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch =
      c.subject.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.trackingNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.complainantName.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || c.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // KPI Calculations strictly fulfilling 1. Institution overview:
  // - Total complaints
  // - Pending complaints
  // - Responses submitted
  // - Overdue cases
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => c.status !== "Resolved / Disposed" && c.status !== "Closed").length;
  const responsesSubmitted = complaints.filter(c => !!c.institutionalResponse).length;
  const overdueCases = complaints.filter(c => c.slaDaysRemaining <= 0 && c.status !== "Resolved / Disposed" && c.status !== "Closed").length;

  const handleOpenResponse = (c: Complaint) => {
    setSelectedComplaint(c);
    setIsResponseModalOpen(true);
  };

  const notifications = StorageService.getNotifications("institution_nodal");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <AppNavbar currentRole="institution_nodal" pageTitle="Institution Nodal Dashboard" />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <AppSidebar
          role="institution_nodal"
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-x-hidden">
          {/* Institution Header Card strictly fulfilling 1. Institution overview */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  Institutional PGRC Portal
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {currentInstitution ? `PID: ${currentInstitution.aictePermanentId}` : "All Institutions Scope"}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {currentInstitution ? currentInstitution.name : "All Connected Technical Institutions"}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentInstitution
                  ? `${currentInstitution.type} · ${currentInstitution.district}, ${currentInstitution.state} · Nodal Officer: ${currentInstitution.nodalOfficerName}`
                  : "Consolidated Institutional PGRC Register across all AICTE-approved campuses"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
              <label className="text-[11px] font-bold text-slate-500">Active Institution:</label>
              <select
                value={selectedInstPID}
                onChange={(e) => setSelectedInstPID(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer shadow-2xs"
              >
                <option value="all">★ All Institutions (Demo Consolidated View)</option>
                {institutions.map(inst => (
                  <option key={inst.aictePermanentId} value={inst.aictePermanentId}>
                    {inst.name} ({inst.aictePermanentId})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4 Summary Cards strictly fulfilling 1. Institution overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-medium text-slate-500 block">Total Complaints</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{totalComplaints}</p>
              <span className="text-[11px] text-slate-400">Pertaining to Institution</span>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-medium text-slate-500 block">Pending Redressal</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">{pendingComplaints}</p>
              <span className="text-[11px] text-amber-700 font-semibold">Active Institutional Cases</span>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-medium text-slate-500 block">Responses Submitted</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">{responsesSubmitted}</p>
              <span className="text-[11px] text-slate-400">Formal ATRs Dispatched</span>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-medium text-slate-500 block">Overdue Cases</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-red-600 mt-1">{overdueCases}</p>
              <span className="text-[11px] text-red-500 font-semibold">SLA Breach Warning</span>
            </div>
          </div>

          {/* TAB 1: OVERVIEW & REGISTER (Fulfills 2. Institution complaint register) */}
          {(activeTab === "overview" || activeTab === "register") && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Institution Complaint Register</h2>
                  <p className="text-slate-500">
                    Complaints routed to Delhi Technological University by Regional Bureau & PGRC
                  </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search size={13} className="text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search register..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Under Process">Under Process</option>
                    <option value="Awaiting Information">Awaiting Information</option>
                    <option value="Resolved / Disposed">Resolved / Disposed</option>
                  </select>
                </div>
              </div>

              {/* Table strictly displaying: Complaint ID, Category, Received date, Current status, Assigned bureau, Response deadline, Last updated */}
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Complaint ID</th>
                      <th className="py-3 px-4">Subject & Complainant</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Received Date</th>
                      <th className="py-3 px-4">Assigned Bureau</th>
                      <th className="py-3 px-4">Response Deadline</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredComplaints.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400">
                          No grievances in institution queue.
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
                            <span className="text-[10px] text-slate-400">
                              {c.isAnonymous ? "Anonymous Whistleblower" : `${c.complainantName} (${c.complainantType})`}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{c.category}</td>
                          <td className="py-3 px-4 text-slate-500">{c.receivedDate}</td>
                          <td className="py-3 px-4 text-slate-700 font-medium">{c.assignedBureau}</td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-800 block">{c.expectedDisposalDate}</span>
                            <span className={`text-[10px] font-bold ${c.slaDaysRemaining > 0 ? "text-orange-600" : "text-emerald-600"}`}>
                              {c.slaDaysRemaining > 0 ? `${c.slaDaysRemaining}d remaining` : "Disposed"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                c.status === "Resolved / Disposed" || c.status === "Closed"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-1.5">
                            <button
                              onClick={() => {
                                setSelectedComplaint(c);
                                setIsDetailOpen(true);
                              }}
                              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                            >
                              Review
                            </button>
                            <button
                              onClick={() => handleOpenResponse(c)}
                              className="px-2.5 py-1 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded transition-colors inline-flex items-center gap-1"
                            >
                              <Send size={11} />
                              <span>Respond</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: INSTITUTION PROFILE (Fulfills Feature 1 & 6) */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4 text-xs max-w-2xl">
              <div>
                <h2 className="text-base font-bold text-slate-900">Institution Permanent Profile</h2>
                <p className="text-slate-500">Official AICTE Accreditation and Nodal Registry Details</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{institution?.name}</h3>
                    <p className="text-slate-500 text-xs">AICTE Permanent ID: <b className="font-mono text-slate-900">{institution?.aictePermanentId}</b></p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Institution Type</span>
                    <span className="font-semibold text-slate-800">{institution?.type}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">State & District</span>
                    <span className="font-semibold text-slate-800">{institution?.district}, {institution?.state}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Nodal Officer</span>
                    <span className="font-semibold text-slate-800">{institution?.nodalOfficerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Nodal Contact</span>
                    <span className="font-semibold text-slate-800">{institution?.nodalOfficerEmail}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SUBMIT RESPONSE (Fulfills Feature 4 & 5: Track responses) */}
          {activeTab === "submit-response" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4 text-xs">
              <div>
                <h2 className="text-base font-bold text-slate-900">Action Taken Reports & Responses</h2>
                <p className="text-slate-500">Select pending grievance from queue to file institutional ATR</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complaints.map(c => (
                  <div key={c.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-orange-600">{c.trackingNumber}</span>
                      <span className="text-[10px] font-bold text-slate-500">{c.receivedDate}</span>
                    </div>
                    <p className="font-bold text-slate-900 line-clamp-1">{c.subject}</p>

                    {c.institutionalResponse ? (
                      <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900">
                        <span className="font-bold block text-[11px]">Response Logged ({c.institutionalResponse.date})</span>
                        <p className="text-[11px] line-clamp-2 mt-0.5">{c.institutionalResponse.explanation}</p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-amber-700 font-bold text-[11px]">Response Required</span>
                        <button
                          onClick={() => handleOpenResponse(c)}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Send size={12} />
                          <span>File Response</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DEADLINES (Fulfills Feature 7: Deadlines & Overdue alerts) */}
          {activeTab === "deadlines" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4 text-xs">
              <div>
                <h2 className="text-base font-bold text-slate-900">SLA Deadlines & Compliance Tracker</h2>
                <p className="text-slate-500">Statutory 15-day resolution windows mandated by AICTE</p>
              </div>

              <div className="space-y-3">
                {complaints.map(c => (
                  <div key={c.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{c.trackingNumber}</span>
                        <span className="font-semibold text-slate-600">{c.category}</span>
                      </div>
                      <p className="font-bold text-slate-900 text-xs mt-1">{c.subject}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Expected Disposal Date</span>
                      <span className="font-bold text-slate-900 block">{c.expectedDisposalDate}</span>
                      <span className={`text-[11px] font-bold ${c.slaDaysRemaining <= 3 && c.slaDaysRemaining > 0 ? "text-red-600" : "text-orange-600"}`}>
                        {c.slaDaysRemaining > 0 ? `${c.slaDaysRemaining} Days Remaining` : "Disposed"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Institution Notices & Requisitions</h2>
                  <p className="text-slate-500">Directives from AICTE Regional Bureau and Central PGRC</p>
                </div>
                <button
                  onClick={() => {
                    StorageService.markAllNotificationsRead("institution_nodal");
                    refreshData();
                  }}
                  className="text-xs font-bold text-orange-600 hover:text-orange-800"
                >
                  Mark all as read
                </button>
              </div>

              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${
                      n.isRead ? "bg-white border-slate-200" : "bg-orange-50/60 border-orange-200"
                    }`}
                  >
                    <div>
                      <p className="font-bold text-slate-900">{n.title}</p>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.date}</span>
                    </div>
                    {!n.isRead && (
                      <button
                        onClick={() => {
                          StorageService.markNotificationRead(n.id);
                          refreshData();
                        }}
                        className="text-[10px] font-bold text-orange-600 hover:text-orange-800 shrink-0"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <InstitutionalResponseModal
        isOpen={isResponseModalOpen}
        onClose={() => setIsResponseModalOpen(false)}
        complaint={selectedComplaint}
        onResponseSubmitted={() => refreshData()}
      />

      <ComplaintDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        complaint={selectedComplaint}
        role="institution_nodal"
        onComplaintUpdated={() => refreshData()}
      />
    </div>
  );
}
