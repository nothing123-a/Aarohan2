"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FilePlus,
  Compass,
  FileText,
  Bell,
  User,
  Building2,
  FileCheck2,
  Send,
  Clock,
  Layers,
  Copy,
  Building,
  Users2,
  BarChart3,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { UserRole } from "@/types";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  isAction?: boolean;
}

interface AppSidebarProps {
  role: UserRole;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onOpenNewComplaint?: () => void;
}

export default function AppSidebar({
  role,
  activeTab,
  onTabChange,
  onOpenNewComplaint,
}: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Strictly implement Section 9 application navigation
  const studentNavItems: NavItem[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={17} /> },
    { id: "submit", label: "Submit Complaint", icon: <FilePlus size={17} />, isAction: true },
    { id: "track", label: "Track Complaint", icon: <Compass size={17} /> },
    { id: "my-complaints", label: "My Complaints", icon: <FileText size={17} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={17} /> },
    { id: "profile", label: "Profile", icon: <User size={17} /> },
  ];

  const institutionNavItems: NavItem[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={17} /> },
    { id: "profile", label: "Institution Profile", icon: <Building2 size={17} /> },
    { id: "register", label: "Complaint Register", icon: <FileCheck2 size={17} /> },
    { id: "submit-response", label: "Submit Response", icon: <Send size={17} /> },
    { id: "deadlines", label: "Deadlines", icon: <Clock size={17} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={17} /> },
  ];

  const adminNavItems: NavItem[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={17} /> },
    { id: "all-complaints", label: "All Complaints", icon: <Layers size={17} /> },
    { id: "overlaps", label: "Overlap Detection Center", icon: <Copy size={17} />, badge: "2 Alert" },
    { id: "institutions", label: "Institution Directory", icon: <Building size={17} /> },
    { id: "coordination", label: "Bureau Coordination", icon: <Users2 size={17} /> },
    { id: "analytics", label: "Analytics & Reports", icon: <BarChart3 size={17} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={17} /> },
    { id: "users", label: "User Management", icon: <User size={17} /> },
  ];

  const navItems = 
    role === "student_teacher" ? studentNavItems :
    role === "institution_nodal" ? institutionNavItems :
    adminNavItems;

  const roleTitle = 
    role === "student_teacher" ? "Student Portal" :
    role === "institution_nodal" ? "Institution PGRC" :
    "Central Admin";

  return (
    <aside
      className={`relative flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out shrink-0 select-none min-h-[calc(100vh-4rem)] ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Sidebar Header */}
      <div className={`flex items-center gap-3 px-4 h-14 border-b border-slate-100 shrink-0 ${collapsed ? "justify-center px-0" : ""}`}>
        <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white shadow-xs shrink-0">
          <ShieldCheck size={18} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-900 leading-tight">AICTE Grievance360</p>
            <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">{roleTitle}</p>
          </div>
        )}
      </div>

      {/* Collapse / Expand Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-12 z-20 h-6 w-6 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-400 hover:text-orange-600 hover:border-orange-300 transition-colors cursor-pointer"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeft
          size={12}
          className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
        />
      </button>

      {/* Navigation items */}
      <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;

          if (item.isAction && onOpenNewComplaint) {
            return (
              <button
                key={item.id}
                onClick={onOpenNewComplaint}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-xs transition-colors mb-2 ${
                  collapsed ? "justify-center px-0" : ""
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full group flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-orange-50 text-orange-700 shadow-2xs font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              } ${collapsed ? "justify-center px-0" : ""}`}
            >
              <span
                className={`shrink-0 transition-colors ${
                  isActive ? "text-orange-600" : "text-slate-400 group-hover:text-slate-600"
                }`}
              >
                {item.icon}
              </span>
              {!collapsed && (
                <>
                  <span className="truncate flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-orange-100 text-orange-700">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0 ml-auto" />
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Notice */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-100 text-[10px] text-slate-400 text-center">
          <p className="font-semibold text-slate-600">Smart India Hackathon 2026</p>
          <p>PS ID: 26264 · Prototype</p>
        </div>
      )}
    </aside>
  );
}

