"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Bell,
  Search,
  User,
  LogOut,
  Sparkles,
  RotateCcw,
  ChevronDown,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Send,
  Plus
} from "lucide-react";
import { UserRole, NotificationItem } from "@/types";
import { StorageService } from "@/lib/storage";
import NewComplaintModal from "@/components/complaints/NewComplaintModal";

interface AppNavbarProps {
  currentRole: UserRole;
  pageTitle?: string;
  onSearch?: (query: string) => void;
}

export default function AppNavbar({ currentRole, pageTitle, onSearch }: AppNavbarProps) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLodgeModalOpen, setIsLodgeModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    return StorageService.getNotifications(currentRole);
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleRoleSwitch = (role: UserRole) => {
    StorageService.setCurrentRole(role);
    if (role === "student_teacher") router.push("/student");
    else if (role === "institution_nodal") router.push("/institution");
    else if (role === "aicte_admin") router.push("/admin");
  };

  const handleResetData = () => {
    if (confirm("Reset demo data to initial sample records? All custom entries will be restored to default.")) {
      StorageService.resetDemoData();
      window.location.reload();
    }
  };

  const handleMarkAllRead = () => {
    StorageService.markAllNotificationsRead(currentRole);
    setNotifications(StorageService.getNotifications(currentRole));
  };

  const roleLabels: Record<UserRole, { title: string; subtitle: string }> = {
    student_teacher: { title: "Aarav Sharma", subtitle: "Student · DTU Delhi" },
    institution_nodal: { title: "Prof. S. K. Mahajan", subtitle: "Nodal Officer · DTU (1-4921029)" },
    aicte_admin: { title: "Dr. Rajesh Verma", subtitle: "AICTE Central Director · HQ New Delhi" },
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Left */}
        <div className="flex items-center gap-3.5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 flex items-center justify-center shadow-xs text-white group-hover:scale-105 transition-transform">
              <Building2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 tracking-tight text-base sm:text-lg">
                  AICTE <span className="text-orange-600">Grievance360</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200/90 shadow-2xs">
                  <Sparkles size={10} className="text-orange-500" />
                  SIH 26264
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">
                One Institution. One Unified View. Complete Accountability.
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Role Switcher Segmented Control */}
        <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60 text-xs font-semibold text-slate-600">
          <button
            onClick={() => handleRoleSwitch("student_teacher")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currentRole === "student_teacher"
                ? "bg-white text-orange-700 shadow-xs font-bold"
                : "hover:text-slate-900"
            }`}
          >
            Student / Teacher
          </button>
          <button
            onClick={() => handleRoleSwitch("institution_nodal")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currentRole === "institution_nodal"
                ? "bg-white text-orange-700 shadow-xs font-bold"
                : "hover:text-slate-900"
            }`}
          >
            Institution Nodal
          </button>
          <button
            onClick={() => handleRoleSwitch("aicte_admin")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currentRole === "aicte_admin"
                ? "bg-white text-orange-700 shadow-xs font-bold"
                : "hover:text-slate-900"
            }`}
          >
            AICTE Admin
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Lodge Grievance Action */}
          <button
            onClick={() => setIsLodgeModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-xs transition-all hover:scale-105"
          >
            <Send size={12} />
            <span>Lodge Grievance</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={handleResetData}
            title="Reset persistent LocalStorage data to original sample records"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-orange-600 hover:bg-orange-50 border border-slate-200 transition-all"
          >
            <RotateCcw size={13} />
            <span>Reset Demo</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-orange-600 hover:border-orange-300 transition-all cursor-pointer"
              aria-label="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 font-bold text-slate-900">
                  <div className="flex items-center gap-2">
                    <span>Notifications</span>
                    <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">
                      {unreadCount} Unread
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[11px] text-orange-600 hover:text-orange-800 font-semibold"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-center py-4 text-slate-400">No notifications.</p>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border transition-colors ${
                          n.isRead ? "bg-white border-slate-100" : "bg-orange-50/50 border-orange-100"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <p className="font-bold text-slate-900 leading-tight">{n.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-2">{n.date}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 hover:border-orange-300 transition-colors"
            >
              <div className="w-7 h-7 rounded-md bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                {roleLabels[currentRole].title.charAt(0)}
              </div>
              <div className="hidden md:block text-left text-xs">
                <span className="font-bold text-slate-900 block leading-tight">
                  {roleLabels[currentRole].title}
                </span>
                <span className="text-[10px] text-slate-400">
                  {roleLabels[currentRole].subtitle}
                </span>
              </div>
              <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl mb-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Active Persona</p>
                  <p className="font-bold text-slate-900 text-sm">{roleLabels[currentRole].title}</p>
                  <p className="text-[11px] text-orange-600 font-semibold">{roleLabels[currentRole].subtitle}</p>
                </div>

                <div className="py-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Switch Demo Persona</p>
                  <button
                    onClick={() => { handleRoleSwitch("student_teacher"); setShowProfileMenu(false); }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 font-medium text-slate-700"
                  >
                    1. Student / Teacher Portal
                  </button>
                  <button
                    onClick={() => { handleRoleSwitch("institution_nodal"); setShowProfileMenu(false); }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 font-medium text-slate-700"
                  >
                    2. Institution Nodal Officer
                  </button>
                  <button
                    onClick={() => { handleRoleSwitch("aicte_admin"); setShowProfileMenu(false); }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 font-medium text-slate-700"
                  >
                    3. AICTE Central Admin
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1 mt-1">
                  <Link
                    href="/"
                    className="flex items-center gap-2 p-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
                  >
                    <LogOut size={14} />
                    <span>Return to Portal Home</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Lodge New Grievance Modal */}
      <NewComplaintModal
        isOpen={isLodgeModalOpen}
        onClose={() => setIsLodgeModalOpen(false)}
        onComplaintCreated={() => {
          setNotifications(StorageService.getNotifications(currentRole));
          window.location.reload();
        }}
      />
    </header>
  );
}

