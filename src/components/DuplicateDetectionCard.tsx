"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  GitMerge, 
  CheckCircle, 
  ExternalLink,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { Grievance } from "@/data/mockData";

interface DuplicateDetectionCardProps {
  grievances: Grievance[];
  onViewGrievance: (g: Grievance) => void;
}

export default function DuplicateDetectionCard({
  grievances,
  onViewGrievance,
}: DuplicateDetectionCardProps) {
  const [mergedClusters, setMergedClusters] = useState<string[]>([]);
  const [selectedClusterId, setSelectedClusterId] = useState<string>("CLUSTER-FEE-DTU");

  const flaggedGrievances = grievances.filter((g) => g.isDuplicateFlagged);

  const clusterMap: Record<string, Grievance[]> = {};
  flaggedGrievances.forEach((g) => {
    const key = g.duplicateClusterId || "CLUSTER-GENERAL";
    if (!clusterMap[key]) clusterMap[key] = [];
    clusterMap[key].push(g);
  });

  const clusters = Object.entries(clusterMap);

  const handleMergeAction = (clusterId: string) => {
    setMergedClusters((prev) => [...prev, clusterId]);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              AI Duplicate & Related Grievance Clustering
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
              NLP Match
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Identifies overlapping complaints across colleges to prevent redundant hearings.
          </p>
        </div>

        <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
          {clusters.length} Active AI Clusters
        </span>
      </div>

      {/* Clusters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: List of Clusters */}
        <div className="space-y-2">
          {clusters.map(([cId, items]) => {
            const isSelected = selectedClusterId === cId;
            const isMerged = mergedClusters.includes(cId);

            return (
              <div
                key={cId}
                onClick={() => setSelectedClusterId(cId)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-purple-50/60 border-purple-300 shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{cId}</span>
                  <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                    {items.length} Cases
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 line-clamp-1 font-medium">
                  {items[0].subject}
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                  <span>Match: <b>94.5%</b></span>
                  {isMerged ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Clustered
                    </span>
                  ) : (
                    <span className="text-purple-600 font-semibold flex items-center gap-0.5">
                      Inspect <ChevronRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 2 Columns */}
        <div className="lg:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-4">
          {clusterMap[selectedClusterId] ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                <div>
                  <span className="text-xs font-bold text-slate-900">
                    Cluster: {selectedClusterId}
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Institution: <b>{clusterMap[selectedClusterId][0]?.institutionName}</b>
                  </p>
                </div>

                {mergedClusters.includes(selectedClusterId) ? (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Clustered
                  </span>
                ) : (
                  <button
                    onClick={() => handleMergeAction(selectedClusterId)}
                    className="text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1 transition-all"
                  >
                    <GitMerge className="w-3.5 h-3.5" />
                    Consolidate Inquiry
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {clusterMap[selectedClusterId].map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono font-bold text-purple-700">
                          {item.trackingNumber}
                        </span>
                        <span className="text-slate-400">{item.createdAt}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 mt-1 line-clamp-2">
                        {item.subject}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-600 font-medium">{item.complainantName}</span>
                      <button
                        onClick={() => onViewGrievance(item)}
                        className="text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-0.5"
                      >
                        Inspect <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>
                  <b>AI Recommendation:</b> Multiple complainants from the same batch are citing withheld refunds at DTU. Consolidating these complaints allows a single inquiry directive instead of multiple separate hearings.
                </span>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">Select a cluster to inspect.</p>
          )}
        </div>
      </div>
    </div>
  );
}
