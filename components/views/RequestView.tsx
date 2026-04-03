"use client";

import { useState } from "react";
import {
  Bot,
  CheckCircle2,
  Loader2,
  Send,
  Shield,
  ShieldAlert,
  TerminalSquare,
} from "lucide-react";
import { DEMO_USER_ID } from "@/lib/demo-config";
import { ActionRecord, RequestStatus, RiskLevel } from "@/lib/types/workflow";

interface RequestResponse {
  requestId: string;
  status: RequestStatus;
  actions: ActionRecord[];
}

export default function RequestView() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<RequestResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: DEMO_USER_ID,
          prompt,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to submit request.");
      }

      setResult(payload);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Failed to submit request.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      <h2 className="shrink-0 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
        AI Request Engine
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 flex-1 min-h-0 pb-6">
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-5 shadow-[0_4px_30px_rgba(0,0,0,0.2)] flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm font-bold text-cyan-400">
            <TerminalSquare className="w-4 h-4" /> NATURAL LANGUAGE VECTOR
          </div>

          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Send the release update to all customers and merge the production PR."
            className="w-full bg-black/50 border border-white/10 rounded-lg p-5 text-sm font-mono text-cyan-200 placeholder:text-cyan-900/60 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 resize-none h-48 shadow-inner"
          />

          <div className="flex items-center justify-between gap-4">
            <div className="text-xs font-mono text-gray-500">
              Demo requester: {DEMO_USER_ID.slice(0, 8)}...
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !prompt.trim()}
              className="bg-cyan-600 hover:bg-cyan-500 text-black px-6 py-2.5 rounded-lg text-sm font-mono font-bold flex items-center gap-3 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  Generate Execution Node
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {error}
            </div>
          )}
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-5 shadow-[0_4px_30px_rgba(0,0,0,0.2)] flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
              <Bot className="w-4 h-4" /> GOVERNANCE OUTPUT
            </div>
            {result && (
              <span className="text-[10px] font-mono tracking-widest text-gray-400">
                REQUEST {result.requestId.slice(0, 8)}
              </span>
            )}
          </div>

          {!result ? (
            <div className="flex-1 flex items-center justify-center rounded-xl border border-dashed border-white/10 text-sm font-mono text-gray-600">
              Submit a request to see extracted actions, risk, and approval routing.
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-y-auto space-y-4 custom-scrollbar pr-2">
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="text-[10px] font-mono tracking-widest text-gray-500 mb-2">
                  REQUEST STATUS
                </div>
                <div className="flex items-center gap-2 text-lg font-semibold text-white">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  {result.status.replaceAll("_", " ").toUpperCase()}
                </div>
              </div>

              {result.actions.map((action) => (
                <div
                  key={action.id}
                  className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-bold text-gray-100">
                        {labelizeAction(action.actionName)}
                      </div>
                      <div className="text-xs font-mono text-gray-500 mt-1">
                        Target: {action.target ?? "n/a"}
                      </div>
                    </div>
                    <RiskPill level={action.riskLevel ?? "medium"} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <Meta label="Recipient Type" value={action.recipientType ?? "unresolved"} />
                    <Meta label="Recipient Email" value={action.recipientEmail ?? "n/a"} />
                    <Meta label="Recipient Group" value={action.recipientGroup ?? "n/a"} />
                    <Meta label="Action Status" value={action.status} />
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {action.status === "pending_approval" ? (
                      <>
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-300">
                          Routed for approval to {action.approverId?.slice(0, 8) ?? "unassigned"}...
                        </span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-300">Eligible for direct execution</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
      <div className="text-[10px] tracking-widest text-gray-500 mb-1">{label}</div>
      <div className="text-gray-300 break-all">{value}</div>
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
