"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Database,
  Loader2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { DEMO_APPROVER_ID } from "@/lib/demo-config";
import {
  ApprovalWithAction,
  AuditLogRecord,
  RequestWithActions,
} from "@/lib/types/workflow";

export default function DashboardView() {
  const [requests, setRequests] = useState<RequestWithActions[]>([]);
  const [approvals, setApprovals] = useState<ApprovalWithAction[]>([]);
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);

    try {
      const [requestsResponse, approvalsResponse, logsResponse] = await Promise.all([
        fetch("/api/requests"),
        fetch(`/api/approvals?approverId=${encodeURIComponent(DEMO_APPROVER_ID)}`),
        fetch("/api/logs"),
      ]);

      const requestsPayload = await requestsResponse.json();
      const approvalsPayload = await approvalsResponse.json();
      const logsPayload = await logsResponse.json();

      if (requestsResponse.ok) setRequests(requestsPayload.requests ?? []);
      if (approvalsResponse.ok) setApprovals(approvalsPayload.approvals ?? []);
      if (logsResponse.ok) setLogs(logsPayload.logs ?? []);
    } finally {
      setLoading(false);
    }
  }

  const metrics = useMemo(() => {
    const actionCount = requests.reduce((sum, request) => sum + request.actions.length, 0);
    const highRiskCount = requests.reduce(
      (sum, request) =>
        sum + request.actions.filter((action) => action.riskLevel === "high").length,
      0,
    );

    return {
      actions: actionCount,
      pending: approvals.length,
      logs: logs.length,
      highRisk: highRiskCount,
    };
  }, [approvals.length, logs.length, requests]);

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      <h2 className="shrink-0 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
        System Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        <MetricCard
          label="ACTIONS PROCESSED"
          value={loading ? "..." : metrics.actions.toString()}
          icon={<Activity className="text-blue-400" />}
          color="border-blue-500/30"
        />
        <MetricCard
          label="PENDING APPROVALS"
          value={loading ? "..." : metrics.pending.toString()}
          icon={<AlertTriangle className="text-amber-400" />}
          color="border-amber-500/30"
        />
        <MetricCard
          label="AUDIT EVENTS"
          value={loading ? "..." : metrics.logs.toString()}
          icon={<Database className="text-purple-400" />}
          color="border-purple-500/30"
        />
        <MetricCard
          label="HIGH RISK ACTIONS"
          value={loading ? "..." : metrics.highRisk.toString()}
          icon={<ShieldCheck className="text-rose-400" />}
          color="border-rose-500/30"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 flex-1 min-h-0 pb-6">
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-5 flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" /> LIVE ACTIVITY TAPE
            </h3>
            <button
              onClick={() => void loadDashboardData()}
              className="text-xs font-mono text-gray-400 hover:text-white"
            >
              Refresh
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2 min-h-0">
            {loading ? (
              <div className="flex items-center gap-3 text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading activity...
              </div>
            ) : logs.length === 0 ? (
              <div className="text-gray-600 font-mono text-sm">
                No audit activity yet.
              </div>
            ) : (
              logs.slice(0, 10).map((log) => (
                <div
                  key={log.id}
                  className="flex gap-4 p-3 rounded-lg border border-white/5 bg-black/20"
                >
                  <div className="text-[10px] text-gray-500 font-mono w-28 shrink-0 pt-0.5">
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-blue-300">{log.message}</div>
                    <div className="text-[10px] text-gray-500 font-mono mt-1">
                      {log.eventType}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-5 flex flex-col min-h-0">
          <h3 className="text-sm font-bold text-gray-300 mb-4">Recent Requests</h3>
          <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2">
            {loading ? (
              <div className="flex items-center gap-3 text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading requests...
              </div>
            ) : requests.length === 0 ? (
              <div className="text-gray-600 font-mono text-sm">
                No requests submitted yet.
              </div>
            ) : (
              requests.slice(0, 6).map((request) => (
                <div
                  key={request.id}
                  className="rounded-xl border border-white/10 bg-black/30 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-mono text-blue-300">
                      {request.id.slice(0, 8)}
                    </span>
                    <span className="text-[10px] font-mono tracking-widest text-gray-400">
                      {request.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-gray-200">
                    {request.originalPrompt}
                  </div>
                  <div className="mt-3 text-[10px] font-mono text-gray-500">
                    {request.actions.length} action(s) |{" "}
                    {new Date(request.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  color: string;
}) {
  return (
    <div
      className={`bg-white/5 backdrop-blur-md border ${color} p-5 rounded-xl flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.2)]`}
    >
      <div>
        <div className="text-[10px] text-gray-400 font-mono tracking-widest mb-1">
          {label}
        </div>
        <div className="text-2xl font-bold text-gray-100">{value}</div>
      </div>
      <div className="p-3 bg-white/5 rounded-lg">{icon}</div>
    </div>
  );
}
