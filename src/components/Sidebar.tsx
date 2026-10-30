"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FilePlus,
  Compass,
  History,
  Building,
  FileCheck2,
  UploadCloud,
  FileText,
  ShieldAlert,
  BarChart3,
  Copy,
  Users2,
  PhoneCall,
  Layers
} from "lucide-react";
import { Role } from "@/data/mockData";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isAction?: boolean;
}

interface SidebarProps {
  role: Role;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onOpenNewComplaint?: () => void;
}

export default function Sidebar({
  role,
  activeTab = "dashboard",
  onTabChange,
  onOpenNewComplaint
}: SidebarProps) {
  const studentNavItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "submit", label: "Lodge New Grievance", icon: FilePlus, isAction: true },
    { id: "track", label: "Track Live Status", icon: Compass },
    { id: "history", label: "Grievance History", icon: History },
    { id: "guidelines", label: "AICTE Regulations", icon: FileText },
  ];

  const institutionNavItems: NavItem[] = [
    { id: "dashboard", label: "PGRC Overview", icon: LayoutDashboard },
    { id: "pending", label: "Action Required", icon: ShieldAlert, badge: "3 Pending" },
    { id: "all", label: "All Grievances", icon: FileCheck2 },
    { id: "documents", label: "Documents & Evidence", icon: UploadCloud },
    { id: "committee", label: "Inquiry Committee", icon: Users2 },
  ];

  const adminNavItems: NavItem[] = [
    { id: "dashboard", label: "National Overview", icon: LayoutDashboard },
    { id: "all-complaints", label: "Master Registry", icon: Layers },
    { id: "rb-pgrc", label: "RB & PGRC Monitoring", icon: Building },
    { id: "duplicate-detection", label: "AI Duplicate Clustering", icon: Copy, badge: "2 Active" },
    { id: "analytics", label: "Analytics & Reports", icon: BarChart3 },
  ];

  const navItems: NavItem[] = 
    role === "student" ? studentNavItems :
    role === "institution" ? institutionNavItems :
    adminNavItems;

  return (
    <aside className="w-60 bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)] shrink-0">
      <div className="space-y-4">
        {/* Simple navigation menu */}
        <nav className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">
            Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            if (item.isAction && onOpenNewComplaint) {
              return (
                <button
                  key={item.id}
                  onClick={onOpenNewComplaint}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-sm mb-2"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onTabChange && onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-purple-50 text-purple-700 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-purple-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Helpline Box (Subtle, not loud pink) */}
      <div className="pt-4 border-t border-slate-100 space-y-2">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
          <div className="flex items-center gap-1.5 text-slate-900 font-bold text-[11px] mb-0.5">
            <PhoneCall className="w-3.5 h-3.5 text-purple-600" />
            <span>AICTE National Helpline</span>
          </div>
          <p className="text-[11px] text-slate-600">
            Anti-Ragging: <span className="font-bold text-slate-900">1800-180-5522</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
