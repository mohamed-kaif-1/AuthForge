"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  UserCheck,
  XCircle,
} from "lucide-react";
import { DEMO_APPROVER_ID } from "@/lib/demo-config";
import { ApprovalWithAction, RiskLevel } from "@/lib/types/workflow";

interface ApprovalsResponse {
  approvals: ApprovalWithAction[];
}

export default function ApprovalView() {
  const [approvals, setApprovals] = useState<ApprovalWithAction[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedApproval = useMemo(
    () => approvals.find((approval) => approval.id === selectedId) ?? approvals[0] ?? null,
    [approvals, selectedId],
  );

  useEffect(() => {
    void loadApprovals();
  }, []);

  async function loadApprovals() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/approvals?approverId=${encodeURIComponent(DEMO_APPROVER_ID)}`,
      );
      const payload = (await response.json()) as ApprovalsResponse & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to load approvals.");
      }

      setApprovals(payload.approvals);
      setSelectedId((current) => current ?? payload.approvals[0]?.id ?? null);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load approvals.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function submitDecision(kind: "approve" | "reject") {
    if (!selectedApproval) return;

    setActioning(kind);
    setError(null);

    try {
      const response = await fetch(`/api/${kind}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvalId: selectedApproval.id,
          approverId: DEMO_APPROVER_ID,
          reason:
            kind === "approve"
              ? "Approved from AuthForge dashboard."
              : "Rejected from AuthForge dashboard.",
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? `Failed to ${kind} action.`);
      }

      await loadApprovals();
    } catch (decisionError) {
      setError(
        decisionError instanceof Error
          ? decisionError.message
          : `Failed to ${kind} action.`,
      );
    } finally {
      setActioning(null);
    }
  }

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      <h2 className="shrink-0 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">
        Approval Queue Engine
      </h2>

      <div className="flex gap-6 flex-1 min-h-0 pb-6">
        <div className="w-[360px] flex flex-col gap-4 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
          <div className="text-xs font-mono text-gray-500">
            Acting approver: {DEMO_APPROVER_ID.slice(0, 8)}...
          </div>

          {loading ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 flex items-center gap-3 text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading approvals...
            </div>
          ) : approvals.length === 0 ? (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-emerald-300">
              No pending approvals for this approver.
            </div>
          ) : (
            approvals.map((approval) => {
              const isSelected = selectedApproval?.id === approval.id;
              const riskLevel = approval.action?.riskLevel ?? "medium";

              return (
                <button
                  key={approval.id}
                  onClick={() => setSelectedId(approval.id)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-amber-950/30 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-mono text-amber-300">
                      {approval.id.slice(0, 8)}
                    </span>
                    <RiskPill level={riskLevel} />
                  </div>
                  <div className="mt-3 text-gray-100 font-semibold">
                    {labelizeAction(approval.action?.actionName ?? "unknown_action")}
                  </div>
                  <div className="mt-2 text-xs font-mono text-gray-500">
                    Request {approval.action?.requestId.slice(0, 8) ?? "n/a"} | expires{" "}
                    {approval.expiresAt ? new Date(approval.expiresAt).toLocaleString() : "n/a"}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="flex-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 shadow-lg flex flex-col overflow-y-auto custom-scrollbar relative">
          {!selectedApproval ? (
            <div className="flex-1 flex items-center justify-center text-gray-600 font-mono">
              Select an approval to inspect and decide.
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-white/10 shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert className="w-5 h-5 text-amber-500 animate-pulse" />
                    <h3 className="text-xl font-bold text-gray-100">
                      {labelizeAction(selectedApproval.action?.actionName ?? "unknown_action")}
                    </h3>
                  </div>
                  <div className="text-sm font-mono text-gray-400">
                    APPROVAL ID:{" "}
                    <span className="text-amber-200">{selectedApproval.id}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-gray-500 tracking-widest mb-1">
                    ASSIGNED APPROVER
                  </div>
                  <div className="flex items-center gap-2 justify-end text-sm">
                    <UserCheck className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-200 font-bold">
                      {selectedApproval.approverId}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Panel
                  label="Risk"
                  value={(selectedApproval.action?.riskLevel ?? "medium").toUpperCase()}
                />
                <Panel
                  label="Recipient Type"
                  value={selectedApproval.action?.recipientType ?? "unresolved"}
                />
                <Panel
                  label="Target"
                  value={selectedApproval.action?.target ?? "n/a"}
                />
                <Panel
                  label="Current Status"
                  value={selectedApproval.action?.status ?? "unknown"}
                />
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-5">
                <div className="text-[10px] font-mono tracking-widest text-gray-500 mb-3">
                  BACKEND RATIONALE
                </div>
                <div className="text-sm text-gray-300 leading-relaxed">
                  {selectedApproval.action?.rationale ??
                    "Approval required because the deterministic backend policy flagged this as elevated risk."}
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                  {error}
                </div>
              )}

              <div className="mt-auto pt-8 flex justify-center gap-4">
                <button
                  onClick={() => submitDecision("reject")}
                  disabled={actioning !== null}
                  className="flex items-center gap-2 px-8 py-3 bg-rose-950/50 border border-rose-500/50 text-rose-400 rounded-lg font-mono font-bold hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
                >
                  {actioning === "reject" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  Deny
                </button>
                <button
                  onClick={() => submitDecision("approve")}
                  disabled={actioning !== null}
                  className="flex items-center gap-2 px-8 py-3 bg-emerald-950/50 border border-emerald-500/50 text-emerald-400 rounded-lg font-mono font-bold hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                >
                  {actioning === "approve" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Authorize
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {!loading && approvals.length > 0 && (
        <div className="text-xs font-mono text-gray-500 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          High-risk actions will never execute without explicit approval.
        </div>
      )}
    </div>
  );
}

function Panel({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
      <div className="text-[10px] font-mono tracking-widest text-gray-500 mb-2">
        {label.toUpperCase()}
      </div>
      <div className="text-gray-100 break-all">{value}</div>
    </div>
  );
}

function RiskPill({ level }: { level: RiskLevel }) {
  const styles: Record<RiskLevel, string> = {
    low: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    medium: "border-amber-500/40 bg-amber-500/10 text-amber-300",
    high: "border-rose-500/40 bg-rose-500/10 text-rose-300",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[10px] font-mono tracking-widest ${styles[level]}`}
    >
      {level.toUpperCase()}
    </span>
  );
}

function labelizeAction(actionName: string) {
  return actionName
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
