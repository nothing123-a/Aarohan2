"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Bell, 
  Search, 
  ShieldCheck, 
  ChevronDown, 
  LogOut, 
  ExternalLink,
  GraduationCap,
  Building2,
  UserCheck,
  Plus
} from "lucide-react";
import { Role } from "@/data/mockData";

interface NavbarProps {
  currentRole: Role;
  onRoleChange?: (role: Role) => void;
  userName?: string;
  userSubtitle?: string;
  onOpenNewComplaint?: () => void;
}

export default function Navbar({
  currentRole,
  userName = "Aarav Sharma",
  userSubtitle = "B.Tech Final Year • DTU",
  onOpenNewComplaint,
}: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">
                  AICTE <span className="text-purple-600">Grievance360</span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  Smart Redressal Ecosystem
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Clean Segmented Role Switcher */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60 text-xs font-semibold text-slate-600">
            <Link
              href="/student"
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentRole === "student"
                  ? "bg-white text-purple-700 shadow-sm font-bold"
                  : "hover:text-slate-900"
              }`}
            >
              Student Portal
            </Link>
            <Link
              href="/institution"
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentRole === "institution"
                  ? "bg-white text-purple-700 shadow-sm font-bold"
                  : "hover:text-slate-900"
              }`}
            >
              Institution PGRC
            </Link>
            <Link
              href="/admin"
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentRole === "admin"
                  ? "bg-white text-purple-700 shadow-sm font-bold"
                  : "hover:text-slate-900"
              }`}
            >
              AICTE Admin
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-600 rounded-full" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 font-bold text-slate-900">
                    <span>Notifications</span>
                    <span className="text-[10px] text-purple-600">2 Unread</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 bg-purple-50/50 rounded-xl">
                      <p className="font-semibold text-slate-900">Grievance Status Updated</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">DTU Accounts logged a response on GRV-2026-001</p>
                    </div>
                    <div className="p-2 hover:bg-slate-50 rounded-xl">
                      <p className="font-semibold text-slate-900">Notice Registered</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">Committee hearing assigned for GRV-2026-002</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  {userName.charAt(0)}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <span className="font-bold text-slate-900 block leading-tight">{userName}</span>
                  <span className="text-[10px] text-slate-400">{userSubtitle}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl mb-1">
                    <p className="font-bold text-slate-900">{userName}</p>
                    <p className="text-[11px] text-slate-500">{userSubtitle}</p>
                  </div>
                  <Link
                    href="/"
                    className="flex items-center gap-2 p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Return to Portal Home</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Main Action Button */}
            {onOpenNewComplaint && (
              <button
                onClick={onOpenNewComplaint}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lodge Grievance</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
