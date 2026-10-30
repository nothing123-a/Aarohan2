"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Shield,
  FileCheck2,
  Clock,
  RefreshCw,
  Lock,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Info,
  ShieldCheck,
  GraduationCap,
  Copy,
  Users2,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Send
} from "lucide-react";
import { StorageService } from "@/lib/storage";
import { UserRole, Complaint } from "@/types";
import NewComplaintModal from "@/components/complaints/NewComplaintModal";

export default function LandingPage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "urgent">("all");
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  const loadData = () => {
    StorageService.init();
    setComplaints(StorageService.getComplaints());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = complaints.filter((rec) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return rec.status !== "Resolved / Disposed" && rec.status !== "Closed";
    if (activeTab === "urgent") return rec.slaDaysRemaining <= 5 || rec.status === "Escalated";
    return true;
  });

  const handleRoleSelect = (role: UserRole) => {
    StorageService.setCurrentRole(role);
    setModalOpen(false);
    if (role === "student_teacher") router.push("/student");
    else if (role === "institution_nodal") router.push("/institution");
    else if (role === "aicte_admin") router.push("/admin");
  };

  return (
    <div className="w-full relative overflow-hidden bg-gradient-to-b from-white via-orange-50/20 to-slate-50 text-slate-900 font-sans min-h-screen flex flex-col">
      {/* ─── Hero Public Navigation (Aarohan 1:1) ─── */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 flex items-center justify-center shadow-xs flex-shrink-0 text-white">
              <Building2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                  Aarohan
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200/90 shadow-2xs">
                  <Sparkles size={10} className="text-orange-500" />
                  Team Aarohan · SIH 26264
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 leading-tight mt-0.5">
                <span className="font-semibold text-slate-700">AICTE Regulation Bureau</span>
                <span className="text-slate-300">·</span>
                <span>All India Council for Technical Education</span>
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#" className="hover:text-orange-600 transition-colors">Home</a>
            <a href="#features" className="hover:text-orange-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-orange-600 transition-colors">How It Works</a>
            <a href="#about" className="hover:text-orange-600 transition-colors">About</a>
            <a href="#preview" className="text-orange-600 hover:text-orange-700 font-bold">Live Registry</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNewComplaintOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200/90 shadow-2xs flex items-center gap-1.5 transition-all"
            >
              <Send size={13} className="text-orange-600" />
              <span>Lodge Grievance</span>
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-xs flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <span>Access Portal</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Hero Content (Clean, Airy & Non-Crowded) ─── */}
      <section className="pt-12 sm:pt-16 pb-12 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100/70 border border-orange-200 text-orange-800 text-xs font-bold mb-6 shadow-2xs">
            <Sparkles size={13} className="text-orange-600" />
            <span>AICTE Regulation Bureau · Centralized Grievance Redressal Portal</span>
          </div>

          {/* Clean Big Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-none max-w-4xl mx-auto">
            Smart, Secure & Simplified <br className="hidden sm:inline" />
            <span className="text-orange-600">Grievance Redressal</span>
          </h1>

          {/* Concise, Spacious Subtitle */}
          <p className="mt-5 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A centralized digital platform for managing complaints, institutional accountability, and student welfare across technical institutions, streamlining document submission, cross-bureau scrutiny, and administrative workflows.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => setIsNewComplaintOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-xs flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
            >
              <Send size={15} />
              <span>Lodge Grievance</span>
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-all flex items-center justify-center gap-2"
            >
              <span>Access Dashboards</span>
              <ArrowRight size={14} />
            </button>
            <a
              href="#features"
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 py-2 px-2 transition-colors"
            >
              <Info size={15} />
              <span>Explore Features</span>
            </a>
          </div>

          {/* ─── Interactive Mockup Window (1:1 with Aarohan Reference) ─── */}
          <div id="preview" className="mt-12 sm:mt-16 max-w-5xl mx-auto relative text-left">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-orange-400/20 via-orange-500/20 to-amber-400/20 blur-xl opacity-70 -z-10" />

            <div className="w-full rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden text-left font-sans text-slate-800 transition-all hover:shadow-2xl">
              {/* Mock Window Top Bar */}
              <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/80 inline-block" />
                  </div>
                  <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-orange-500 inline-block animate-pulse" />
                      Aarohan
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
                      portal.aicte-india.org/grievance
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700">
                    <ShieldCheck size={11} className="text-green-400" />
                    10,480 Technical Institutes Connected
                  </span>
                  <span className="text-[11px] text-orange-400 font-mono bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                    AICTE Regulation Bureau
                  </span>
                </div>
              </div>

              {/* Internal Mini Header with 3 Tabs */}
              <div className="p-4 sm:p-6 bg-slate-50/70 border-b border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 tracking-tight">
                      AICTE Institutional Grievance & Redressal Registry
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Real-time monitoring of complaints submitted across approved technical institutes.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs self-start sm:self-auto">
                    <button
                      onClick={() => setActiveTab("all")}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                        activeTab === "all"
                          ? "bg-orange-500 text-white shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      All Records ({complaints.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("active")}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                        activeTab === "active"
                          ? "bg-orange-500 text-white shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Active ({complaints.filter(c => c.status !== "Resolved / Disposed" && c.status !== "Closed").length})
                    </button>
                    <button
                      onClick={() => setActiveTab("urgent")}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                        activeTab === "urgent"
                          ? "bg-orange-500 text-white shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Urgent SLA ({complaints.filter(c => c.slaDaysRemaining <= 5 && c.status !== "Resolved / Disposed" && c.status !== "Closed").length})
                    </button>
                  </div>
                </div>

                {/* Synthetic Data Disclaimer Banner */}
                <div className="flex items-center justify-between px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px] font-medium mt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block" />
                    <span>Synthetic Demonstration Data · Prototype Environment (Not live AICTE statistics)</span>
                  </div>
                  <span className="text-[10px] text-amber-700/80 font-mono font-bold">SIH 26264 DEMO</span>
                </div>

                {/* 5 Clean Metric Stat Cards (Exactly like Aarohan) */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-3 pt-3 border-t border-slate-200/60">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total Grievances</p>
                    <p className="text-base font-bold text-slate-900 mt-0.5">{complaints.length}</p>
                    <span className="text-[10px] text-slate-500 font-medium">Across all zones</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Under Inquiry</p>
                    <p className="text-base font-bold text-slate-900 mt-0.5">
                      {complaints.filter(c => c.status === "Under Review" || c.status === "Submitted" || c.status === "Under Process").length}
                    </p>
                    <span className="text-[10px] text-blue-600 font-medium flex items-center gap-0.5">
                      <ShieldCheck size={10} /> Institutional PGRC
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Overlap Alerts</p>
                    <p className="text-base font-bold text-orange-600 mt-0.5">
                      {StorageService.getOverlapAlerts().filter(a => !a.isReviewed).length}
                    </p>
                    <span className="text-[10px] text-orange-600 font-medium flex items-center gap-0.5">
                      <Copy size={10} /> Cross-bureau flagged
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">SLA Deadlines</p>
                    <p className="text-base font-bold text-amber-600 mt-0.5">
                      {complaints.filter(c => c.slaDaysRemaining <= 5 && c.status !== "Resolved / Disposed" && c.status !== "Closed").length}
                    </p>
                    <span className="text-[10px] text-amber-600 font-medium flex items-center gap-0.5">
                      <Clock size={10} /> Within 5 days
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Resolved Cases</p>
                    <p className="text-base font-bold text-emerald-600 mt-0.5">
                      {complaints.filter(c => c.status === "Resolved / Disposed" || c.status === "Closed").length}
                    </p>
                    <span className="text-[10px] text-emerald-600 font-medium">
                      Disposed with ATR
                    </span>
                  </div>
                </div>
              </div>

              {/* Clean Preview Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4 text-left">Tracking ID #</th>
                      <th className="py-2.5 px-4 text-left">Institution Name</th>
                      <th className="py-2.5 px-4 text-left">Category / Assigned Bureau</th>
                      <th className="py-2.5 px-4 text-center">SLA Timeline</th>
                      <th className="py-2.5 px-4 text-center">Status</th>
                      <th className="py-2.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filtered.slice(0, 4).map((item) => (
                      <tr key={item.id} className="hover:bg-orange-50/30 transition-colors">
                        <td className="py-3 px-4 font-mono font-medium text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                            <span>{item.trackingNumber}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800 max-w-[180px] truncate" title={item.institutionName}>
                          {item.institutionName}
                        </td>
                        <td className="py-3 px-4 text-slate-600 max-w-xs">
                          <div>
                            <span className="font-medium text-slate-800 truncate block">{item.subject}</span>
                            <span className="text-[11px] text-slate-400 block">{item.assignedBureau}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-700">
                          {item.slaDaysRemaining > 0 ? `${item.slaDaysRemaining}d remaining` : "Overdue"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === "Resolved / Disposed" || item.status === "Closed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : item.status === "Escalated"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : item.status === "Awaiting Information"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              item.status === "Resolved / Disposed" || item.status === "Closed" ? "bg-emerald-500" :
                              item.status === "Escalated" ? "bg-red-500" :
                              item.status === "Awaiting Information" ? "bg-amber-500" : "bg-blue-500"
                            }`} />
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              StorageService.setCurrentRole("student_teacher");
                              router.push(`/student?track=${item.trackingNumber}`);
                            }}
                            className="px-2.5 py-1 rounded text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors inline-flex items-center gap-1"
                          >
                            <span>Track</span>
                            <ChevronRight size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Preview Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span className="text-[11px]">Simulated live AICTE Administrative Workbench</span>
                <span className="text-orange-600 font-semibold flex items-center gap-1 text-[11px]">
                  Encrypted Central Ledger
                  <ArrowUpRight size={12} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Core Capabilities (Aarohan Clean Features Grid) ─── */}
      <section id="features" className="py-20 sm:py-28 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-orange-600 uppercase tracking-widest">
              Core Capabilities
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Built for Redressal Scrutiny, Overlap Detection & Accountability
            </p>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              Comprehensive institutional management ensuring total visibility and compliance for student and faculty complaints submitted to AICTE.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Building2 size={22} className="text-orange-600" />,
                title: "Centralized Institution Registry",
                desc: "Unified institution-wise and complaint-wise repository replacing siloed bureau handling with single-screen visibility.",
              },
              {
                icon: <Copy size={22} className="text-orange-500" />,
                title: "Cross-Bureau Overlap Engine",
                desc: "Identifies potentially related complaints assigned across RB and PGRC with explainable token similarity and rule-based scoring.",
              },
              {
                icon: <Clock size={22} className="text-blue-600" />,
                title: "15-Day Statutory SLA Monitoring",
                desc: "Automated countdown timers tracking institutional response deadlines to prevent cases from lingering unresolved.",
              },
              {
                icon: <Shield size={22} className="text-green-600" />,
                title: "Whistleblower Protection",
                desc: "Confidential submission channels ensuring student safety against institutional retaliation under AICTE regulations.",
              },
              {
                icon: <FileCheck2 size={22} className="text-purple-600" />,
                title: "Institutional Action Taken Reports",
                desc: "Structured workflows for Nodal Officers to submit inquiry committee minutes and official remedy documentation.",
              },
              {
                icon: <RefreshCw size={22} className="text-slate-700" />,
                title: "State Ombudsman Escalation",
                desc: "Automatic escalation workflow transferring unresolved or overdue disputes to the Regional AICTE Ombudsman.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs hover:shadow-md hover:border-orange-300 transition-all text-left"
              >
                <div className="h-11 w-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {f.desc}
                </p>
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-orange-600">
                  <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-1 hover:gap-1.5 transition-all">
                    <span>Explore module</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Standard Operating Procedure (5 Stages) ─── */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-orange-600 uppercase tracking-widest">
              Standard Operating Procedure
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              How AICTE Grievance360 Operates
            </p>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              A transparent, five-step lifecycle ensuring regulatory compliance from initial complaint submission to final disposal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6 relative">
            {[
              {
                step: "01",
                title: "Complaint Lodged",
                desc: "Student or faculty member files grievance with evidence. Optional whistleblower anonymous encryption.",
              },
              {
                step: "02",
                title: "Intake & Assignment",
                desc: "Automated intake routes case to Regional Bureau (RB) or Public Grievance Redressal Cell (PGRC).",
              },
              {
                step: "03",
                title: "Overlap Detection",
                desc: "Algorithm checks institution identifier and text similarity to flag related cross-bureau cases.",
              },
              {
                step: "04",
                title: "Institutional ATR",
                desc: "Nodal officer logs factual findings, attaches committee minutes, and details corrective remedies.",
              },
              {
                step: "05",
                title: "Disposal / Ombudsman",
                desc: "Grievance resolved or automatically escalated to AICTE State Ombudsman upon 15-day SLA breach.",
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs relative flex flex-col justify-between text-left"
              >
                <div>
                  <span className="text-xs font-black text-orange-500 font-mono tracking-widest">
                    STEP {s.step}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">
                    {s.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Demo Login Modal ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Select Stakeholder Persona</h3>
                <p className="text-slate-500 text-[11px]">Choose demo role to enter dedicated workbench</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleRoleSelect("student_teacher")}
                className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-orange-300 bg-slate-50 hover:bg-white text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold">
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">1. Student / Teacher Portal</h4>
                    <p className="text-[11px] text-slate-500">Lodge grievances, track status, submit clarifications</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleRoleSelect("institution_nodal")}
                className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-orange-300 bg-slate-50 hover:bg-white text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">2. Institution Nodal Officer</h4>
                    <p className="text-[11px] text-slate-500">View complaints, submit explanations, upload ATR minutes</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleRoleSelect("aicte_admin")}
                className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-orange-300 bg-slate-50 hover:bg-white text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">3. AICTE Central Admin</h4>
                    <p className="text-[11px] text-slate-500">Master register, Overlap Detection Center, analytics</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <p className="text-[11px] text-slate-400 text-center pt-1">
              Prototype demonstration using fictional data. Not an official AICTE service.
            </p>
          </div>
        </div>
      )}

      {/* ─── Lodge New Grievance Modal ─── */}
      <NewComplaintModal
        isOpen={isNewComplaintOpen}
        onClose={() => setIsNewComplaintOpen(false)}
        onComplaintCreated={() => {
          loadData();
        }}
      />

      {/* ─── Footer ─── */}
      <footer id="about" className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-orange-600" />
            <span className="font-bold text-slate-900">Aarohan Grievance360</span>
            <span>· Smart India Hackathon 2026 (Problem Statement 26264)</span>
          </div>

          <p className="text-[11px] text-slate-400 text-center sm:text-right">
            AICTE Regulation Bureau · Centralized Grievance Redressal Architecture · Government of India
          </p>
        </div>
      </footer>
    </div>
  );
}
