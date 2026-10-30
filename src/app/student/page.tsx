"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AppNavbar from "@/components/layout/AppNavbar";
import AppSidebar from "@/components/layout/AppSidebar";
import NewComplaintModal from "@/components/complaints/NewComplaintModal";
import ComplaintDetailModal from "@/components/complaints/ComplaintDetailModal";
import { Complaint, ComplaintStatus } from "@/types";
import { StorageService } from "@/lib/storage";
import {
  FilePlus,
  Compass,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Eye,
  Plus,
  Bell,
  User,
  Shield,
  Download,
  Send
} from "lucide-react";

function StudentDashboardContent() {
  const searchParams = useSearchParams();
  const trackQuery = searchParams.get("track") || "";

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Filters for My Complaints
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Tracking tab search state
  const [trackingSearch, setTrackingSearch] = useState(trackQuery || "AICTE-2026-DL-8901");
  const [trackedComplaint, setTrackedComplaint] = useState<Complaint | null>(null);
  const [clarificationText, setClarificationText] = useState("");

  const refreshData = () => {
    StorageService.init();
    const all = StorageService.getComplaints();
    setComplaints(all);
    if (trackQuery) {
      const found = all.find(c => c.trackingNumber.toLowerCase() === trackQuery.toLowerCase() || c.id.toLowerCase() === trackQuery.toLowerCase());
      if (found) {
        setTrackedComplaint(found);
        setActiveTab("track");
      }
    } else if (!trackedComplaint && all.length > 0) {
      setTrackedComplaint(all[0]);
    }
  };

  useEffect(() => {
    refreshData();
  }, [trackQuery]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackingSearch.trim().toLowerCase();
    const found = complaints.find(
      c => c.trackingNumber.toLowerCase() === query || c.id.toLowerCase() === query
    );
    if (found) {
      setTrackedComplaint(found);
    } else {
      alert(`No grievance record found with identifier "${trackingSearch}".`);
    }
  };

  const handleClarificationSubmit = (requestId: string) => {
    if (!clarificationText.trim() || !trackedComplaint) return;
    StorageService.submitClarificationResponse(trackedComplaint.id, requestId, clarificationText.trim());
    setClarificationText("");
    refreshData();
    const updated = StorageService.getComplaintById(trackedComplaint.id);
    if (updated) setTrackedComplaint(updated);
    alert("Clarification response recorded and dispatched to assigned bureau officer.");
  };

  // Filtered complaints for Student (demo user Aarav Sharma or all)
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch =
      c.subject.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.trackingNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.institutionName.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesStatus = selectedStatus === "All" || c.status === selectedStatus;
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // KPI Overview calculations strictly following requirement 1:
  // - Total complaints submitted
  // - Under-review complaints
  // - Complaints requiring additional information
  // - Resolved complaints
  const totalSubmitted = complaints.length;
  const underReviewCount = complaints.filter(c => c.status === "Under Review" || c.status === "Submitted" || c.status === "Under Process").length;
  const requiringInfoCount = complaints.filter(c => c.status === "Awaiting Information").length;
  const resolvedCount = complaints.filter(c => c.status === "Resolved / Disposed" || c.status === "Closed").length;

  const notifications = StorageService.getNotifications("student_teacher");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <AppNavbar currentRole="student_teacher" pageTitle="Student / Teacher Portal" />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <AppSidebar
          role="student_teacher"
          activeTab={activeTab}
          onTabChange={(tabId) => {
            if (tabId === "submit") {
              setIsNewModalOpen(true);
            } else {
              setActiveTab(tabId);
            }
          }}
          onOpenNewComplaint={() => setIsNewModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-x-hidden">
          {/* Header Bar */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  Complainant Redressal Desk
                </span>
                <span className="text-xs text-slate-400">· SIH 26264</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Welcome back, Aarav Sharma
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Submit complaints, track case progress, upload clarifications, and view statutory action history.
              </p>
            </div>

            <button
              onClick={() => setIsNewModalOpen(true)}
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-xs flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Plus size={15} />
              <span>Submit Complaint</span>
            </button>
          </div>

          {/* 4 Summary Cards strictly fulfilling 1. Dashboard Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-medium text-slate-500 block">Total Submitted</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{totalSubmitted}</p>
              <span className="text-[11px] text-slate-400">Lodged Complaints</span>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-medium text-slate-500 block">Under Review</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-1">{underReviewCount}</p>
              <span className="text-[11px] text-slate-400">Active Scrutiny / Process</span>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-medium text-slate-500 block">Awaiting Information</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">{requiringInfoCount}</p>
              <span className="text-[11px] text-amber-700 font-semibold">Clarification Required</span>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-medium text-slate-500 block">Resolved</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">{resolvedCount}</p>
              <span className="text-[11px] text-slate-400">Remedy Disposed</span>
            </div>
          </div>

          {/* TAB 1: OVERVIEW & RECENT CASES */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Notice regarding whistleblowers */}
              <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-xl flex items-start gap-3 text-xs text-orange-950">
                <Shield size={18} className="text-orange-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <b>AICTE Whistleblower & Non-Retaliation Policy:</b> Students and faculty can file complaints openly or in confidential mode. Approved technical institutions are prohibited from taking punitive action against any complainant.
                </div>
              </div>

              {/* Recent Complaints Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900">Recent Complaints</h2>
                    <p className="text-xs text-slate-500">Overview of active cases and latest status changes</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("my-complaints")}
                    className="text-xs font-bold text-orange-600 hover:text-orange-800"
                  >
                    View All & Filter →
                  </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Tracking ID</th>
                        <th className="py-3 px-4">Subject & Institution</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Assigned Bureau</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {complaints.slice(0, 5).map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-orange-600">{c.trackingNumber}</td>
                          <td className="py-3 px-4 max-w-xs">
                            <p className="font-bold text-slate-900 truncate">{c.subject}</p>
                            <span className="text-[10px] text-slate-400 truncate block">{c.institutionName}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{c.category}</td>
                          <td className="py-3 px-4 text-slate-600">{c.assignedBureau}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                c.status === "Resolved / Disposed" || c.status === "Closed"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : c.status === "Escalated"
                                  ? "bg-red-50 text-red-700"
                                  : c.status === "Awaiting Information"
                                  ? "bg-amber-50 text-amber-700 font-bold"
                                  : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              {c.status}
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
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TRACK COMPLAINT (Fulfills Feature 5: Search by ID, timeline, clarifications) */}
          {activeTab === "track" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Track Complaint Status</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Search by Complaint ID or Tracking Number to view full investigation timeline and pending requests.
                </p>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleTrackSubmit} className="flex gap-2 max-w-md">
                <div className="relative flex-1">
                  <Search size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={trackingSearch}
                    onChange={(e) => setTrackingSearch(e.target.value)}
                    placeholder="Enter Tracking ID (e.g. AICTE-2026-DL-8901)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors shadow-xs"
                >
                  Track
                </button>
              </form>

              {/* Tracked Case Details */}
              {trackedComplaint ? (
                <div className="pt-4 border-t border-slate-100 space-y-5 text-xs">
                  {/* Meta summary card */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                          {trackedComplaint.trackingNumber}
                        </span>
                        <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {trackedComplaint.status}
                        </span>
                        <span className="text-slate-500 font-semibold">{trackedComplaint.category}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{trackedComplaint.subject}</h3>
                      <p className="text-slate-500 text-[11px] mt-0.5">{trackedComplaint.institutionName}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Assigned Bureau</span>
                      <span className="font-bold text-slate-900 text-xs block">{trackedComplaint.assignedBureau}</span>
                      <span className="text-[10px] text-orange-600 font-semibold">
                        SLA: {trackedComplaint.slaDaysRemaining > 0 ? `${trackedComplaint.slaDaysRemaining} Days Left` : "Resolved"}
                      </span>
                    </div>
                  </div>

                  {/* Clarification Request & Response Interface */}
                  {trackedComplaint.clarificationRequests.length > 0 && (
                    <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
                      <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                        <AlertCircle size={15} className="text-amber-600" />
                        <span>Action Required: Request for Additional Information</span>
                      </div>
                      {trackedComplaint.clarificationRequests.map((req) => (
                        <div key={req.id} className="p-3 bg-white rounded-lg border border-amber-200 space-y-2">
                          <p className="font-semibold text-slate-900">Query from AICTE Officer ({req.requestedBy}):</p>
                          <p className="text-slate-700 italic">"{req.question}"</p>

                          {req.response ? (
                            <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200">
                              <span className="text-[10px] font-bold text-emerald-800 block">Your Submitted Response</span>
                              <p className="text-slate-700 mt-0.5">{req.response}</p>
                              <span className="text-[10px] text-slate-400 block mt-1">Submitted: {req.responseDate}</span>
                            </div>
                          ) : (
                            <div className="pt-2 border-t border-slate-100 space-y-2">
                              <textarea
                                rows={2}
                                placeholder="Type your clarification or provide certificate details..."
                                value={clarificationText}
                                onChange={(e) => setClarificationText(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs text-slate-900"
                              />
                              <button
                                onClick={() => handleClarificationSubmit(req.id)}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 transition-colors flex items-center gap-1"
                              >
                                <Send size={12} />
                                <span>Submit Clarification</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Timeline */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-3">
                      Action Timeline & Procedural Progress
                    </span>
                    <div className="relative pl-6 space-y-3 border-l-2 border-slate-200 ml-2">
                      {trackedComplaint.timeline.map((entry) => (
                        <div key={entry.id} className="relative">
                          <div className="absolute -left-[31px] top-0.5 w-3 h-3 bg-orange-600 rounded-full ring-4 ring-orange-100" />
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-slate-900">{entry.title}</span>
                              <span className="text-[10px] text-slate-400">{entry.date}</span>
                            </div>
                            <p className="text-slate-600 text-[11px] mt-0.5">{entry.description}</p>
                            <span className="text-[10px] font-semibold text-slate-400 mt-1 block">By: {entry.actor}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center py-8 text-slate-400">Search for a complaint tracking number above.</p>
              )}
            </div>
          )}

          {/* TAB 3: MY COMPLAINTS (Fulfills Feature 6: Search & filter by status, category, date) */}
          {activeTab === "my-complaints" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Complaint Register & History</h2>
                  <p className="text-slate-500">Complete historical record of grievances lodged under your profile</p>
                </div>

                {/* Filter Row */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search size={13} className="text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search subject or ID..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none"
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
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none"
                  >
                    <option value="All">All Categories</option>
                    <option value="Fee Refund & Caution Money">Fee Refund & Caution Money</option>
                    <option value="Ragging & Student Safety">Ragging & Student Safety</option>
                    <option value="Academic Discrepancy & Evaluation">Academic Discrepancy & Evaluation</option>
                    <option value="Infrastructure & Hostel Facilities">Infrastructure & Hostel Facilities</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Tracking ID</th>
                      <th className="py-3 px-4">Subject & Institution</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Submitted Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredComplaints.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          No grievances match the filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredComplaints.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-orange-600">{c.trackingNumber}</td>
                          <td className="py-3 px-4 max-w-xs">
                            <p className="font-bold text-slate-900 truncate">{c.subject}</p>
                            <span className="text-[10px] text-slate-400 truncate block">{c.institutionName}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{c.category}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                c.status === "Resolved / Disposed" || c.status === "Closed"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : c.status === "Escalated"
                                  ? "bg-red-50 text-red-700"
                                  : c.status === "Awaiting Information"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-500">{c.receivedDate}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedComplaint(c);
                                setIsDetailOpen(true);
                              }}
                              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                            >
                              View Case
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

          {/* TAB 4: NOTIFICATIONS (Fulfills Feature 7) */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Notifications & Alerts</h2>
                  <p className="text-slate-500">Procedural status changes and information requests from AICTE</p>
                </div>
                <button
                  onClick={() => {
                    StorageService.markAllNotificationsRead("student_teacher");
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

          {/* TAB 5: PROFILE (Fulfills Feature 8) */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4 text-xs max-w-xl">
              <div>
                <h2 className="text-base font-bold text-slate-900">Complainant Registered Profile</h2>
                <p className="text-slate-500">Demographic and institutional affiliation details</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-bold text-base flex items-center justify-center">
                    A
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Aarav Sharma</h3>
                    <p className="text-slate-500 text-xs">Role: Student (Final Year B.Tech)</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Registered Email</span>
                    <span className="font-semibold text-slate-800">aarav.sharma@dtu.ac.in</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Institutional ID</span>
                    <span className="font-semibold text-slate-800">DTU / 2023CS104</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Affiliated Institution</span>
                    <span className="font-semibold text-slate-800">Delhi Technological University</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">AICTE Permanent ID</span>
                    <span className="font-semibold text-slate-800">1-4921029</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* New Complaint Modal */}
      <NewComplaintModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onComplaintCreated={() => refreshData()}
      />

      {/* Case Details Modal */}
      <ComplaintDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        complaint={selectedComplaint}
        role="student_teacher"
        onComplaintUpdated={() => refreshData()}
      />
    </div>
  );
}

export default function StudentDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">Loading Portal...</div>}>
      <StudentDashboardContent />
    </Suspense>
  );
}
