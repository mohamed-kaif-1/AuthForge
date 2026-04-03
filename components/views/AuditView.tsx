"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CheckCircle2,
  Clock,
  Loader2,
  Search,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { AuditLogRecord } from "@/lib/types/workflow";

interface LogsResponse {
  logs: AuditLogRecord[];
}

export default function AuditView() {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [search, setSearch] = useState("");
  const [activeLogId, setActiveLogId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadLogs();
  }, []);

  async function loadLogs() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/logs");
      const payload = (await response.json()) as LogsResponse & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to load audit logs.");
      }

      setLogs(payload.logs);
      setActiveLogId(payload.logs[0]?.id ?? null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  }

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return logs;

    return logs.filter((log) => {
      const haystack = `${log.eventType} ${log.message} ${log.requestId ?? ""} ${log.actionId ?? ""}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [logs, search]);

  const activeLog =
    filteredLogs.find((log) => log.id === activeLogId) ?? filteredLogs[0] ?? null;

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      <h2 className="shrink-0 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500 flex items-center gap-3">
        <Activity className="w-6 h-6 text-gray-400" /> Forensic Audit System
      </h2>

      <div className="shrink-0 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search event type, request id, or action id..."
            className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm font-mono text-gray-300 focus:outline-none focus:border-gray-500/50"
          />
        </div>
        <button
          onClick={() => void loadLogs()}
          className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      <div className="flex gap-6 flex-1 min-h-0 pb-6">
        <div className={`flex flex-col gap-4 overflow-hidden ${activeLog ? "w-2/3" : "w-full"}`}>
          <div className="bg-white/5 border border-white/10 rounded-2xl flex-1 flex flex-col overflow-hidden backdrop-blur-md">
            {loading ? (
              <div className="flex-1 flex items-center justify-center gap-3 text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading audit trail...
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-600 font-mono">
                No audit events match the current filter.
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-black/40 text-xs uppercase tracking-widest text-gray-500 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-bold">Timestamp</th>
                    <th className="px-6 py-4 font-bold">Event</th>
                    <th className="px-6 py-4 font-bold">Request</th>
                    <th className="px-6 py-4 font-bold">Action</th>
                    <th className="px-6 py-4 font-bold">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 font-mono">
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      onClick={() => setActiveLogId(log.id)}
                      className={`transition-colors cursor-pointer hover:bg-white/5 ${
                        activeLog?.id === log.id ? "bg-emerald-900/10" : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-gray-500 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-emerald-400">{log.eventType}</td>
                      <td className="px-6 py-4 text-gray-400">{log.requestId ?? "n/a"}</td>
                      <td className="px-6 py-4 text-gray-400">{log.actionId ?? "n/a"}</td>
                      <td className="px-6 py-4 text-gray-200">{log.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {activeLog && (
          <div className="w-1/3 bg-black border border-gray-800 rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{activeLog.eventType}</h3>
                <p className="text-emerald-400 font-mono text-sm">{activeLog.id}</p>
              </div>
              <button
                onClick={() => setActiveLogId(null)}
                className="p-1 px-3 bg-white/10 hover:bg-white/20 rounded text-xs uppercase tracking-widest font-bold font-mono transition-colors"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm font-mono">
              <Panel label="Timestamp" value={new Date(activeLog.createdAt).toLocaleString()} />
              <Panel label="Request ID" value={activeLog.requestId ?? "n/a"} />
              <Panel label="Action ID" value={activeLog.actionId ?? "n/a"} />
              <Panel label="Message" value={activeLog.message} />
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-[10px] font-mono tracking-widest text-gray-500 mb-3">
                EVENT CLASSIFICATION
              </div>
              <div className="flex items-center gap-2 text-sm">
                {activeLog.eventType.includes("failed") || activeLog.eventType.includes("rejected") ? (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span className="text-rose-300">Blocked or failed workflow event</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Recorded workflow progression</span>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-[10px] font-mono tracking-widest text-gray-500 mb-3">
                RAW METADATA
              </div>
              <pre className="text-xs text-gray-300 whitespace-pre-wrap break-all">
                {JSON.stringify(activeLog.metadata ?? {}, null, 2)}
              </pre>
            </div>

            <div className="text-xs font-mono text-gray-500 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              Immutable audit logging is enforced on every request transition.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Panel({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-900 rounded-lg p-3">
      <span className="text-gray-500 text-xs block mb-1">{label}</span>
      <span className="text-gray-200 break-all">{value}</span>
    </div>
  );
}
