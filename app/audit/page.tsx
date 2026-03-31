"use client";

import React, { useState } from "react";
import { 
  Activity, ShieldAlert, KeyRound, Database, Network, 
  CheckCircle2, XCircle, Search, Filter, Server, ChevronRight, User, Terminal,
  Clock, Play
} from "lucide-react";

type AuditEntry = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  risk: "high" | "medium" | "low";
  system: string;
  decision: "Approved" | "Auto-Approved" | "Rejected";
  result: "Success" | "Failed";
  tokens: string[];
};

const MOCK_LOGS: AuditEntry[] = [
  {
    id: "LOG-0x12F4A",
    timestamp: "10:30:15 AM",
    user: "System Auto",
    action: "Send Daily Brief",
    system: "SendGrid API",
    risk: "low",
    decision: "Auto-Approved",
    result: "Success",
    tokens: ["sendgrid_mail_send"]
  },
  {
    id: "LOG-0x12F4B",
    timestamp: "10:32:41 AM",
    user: "Merlin - SecOps",
    action: "Merge PR #4992 (Production)",
    system: "GitHub Enterprise",
    risk: "high",
    decision: "Approved",
    result: "Success",
    tokens: ["gh_bot_merge", "vault_secret_gh"]
  },
  {
    id: "LOG-0x12F4C",
    timestamp: "10:35:05 AM",
    user: "Alice - DevOps",
    action: "Drop User Table",
    system: "Production DB",
    risk: "high",
    decision: "Rejected",
    result: "Failed",
    tokens: ["db_admin_root"]
  },
  {
    id: "LOG-0x12F4D",
    timestamp: "10:45:11 AM",
    user: "Billing Bot",
    action: "Sync Stripe Invoices",
    system: "Stripe API",
    risk: "medium",
    decision: "Auto-Approved",
    result: "Success",
    tokens: ["stripe_read_invoices"]
  }
];

export default function ForensicAnalyzer() {
  const [activeLog, setActiveLog] = useState<AuditEntry | null>(null);
  const [replayState, setReplayState] = useState<number>(-1);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "text-red-400 bg-red-500/10 border-red-500/30";
      case "medium": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      case "low": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    }
  };

  const handleReplay = (log: AuditEntry) => {
    setActiveLog(log);
    setReplayState(0);
    
    // Simulate replay
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setReplayState(step);
      if (step >= 4) clearInterval(interval);
    }, 800);
  };

  return (
    <div className="h-full bg-[#050505] p-6 text-gray-200 font-sans flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-widest text-emerald-100 uppercase">Forensic Analyzer</h1>
            <p className="text-sm font-mono text-gray-500 tracking-wide">Immutable governance audit trail</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-sm bg-white/5 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
             <Filter className="w-4 h-4 text-emerald-500" />
             <span className="font-mono text-gray-400">Filters: <span className="text-white">All</span></span>
          </div>
          <div className="flex items-center gap-2 text-sm bg-black/40 px-4 py-2 rounded-lg border border-gray-800">
             <Search className="w-4 h-4 text-gray-500" />
             <input type="text" placeholder="Search events..." className="bg-transparent border-none outline-none text-gray-200" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* MAIN TABLE */}
        <div className={`flex flex-col gap-4 overflow-hidden transition-all duration-500 ${activeLog ? 'w-2/3' : 'w-full'}`}>
          <div className="bg-white/5 border border-white/10 rounded-2xl flex-1 flex flex-col overflow-hidden backdrop-blur-md">
            
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-black/40 text-xs uppercase tracking-widest text-gray-500 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-bold">Timestamp</th>
                  <th className="px-6 py-4 font-bold">Event ID</th>
                  <th className="px-6 py-4 font-bold">Actor</th>
                  <th className="px-6 py-4 font-bold">Action</th>
                  <th className="px-6 py-4 font-bold">Risk</th>
                  <th className="px-6 py-4 font-bold">Decision</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 font-mono">
                {MOCK_LOGS.map((log) => (
                  <tr 
                    key={log.id} 
                    className={`transition-colors cursor-pointer group hover:bg-white/5 ${activeLog?.id === log.id ? "bg-emerald-900/10" : ""}`}
                    onClick={() => setActiveLog(log)}
                  >
                    <td className="px-6 py-4 text-gray-500 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" /> {log.timestamp}
                    </td>
                    <td className="px-6 py-4 text-emerald-400">{log.id}</td>
                    <td className="px-6 py-4 text-gray-300">{log.user}</td>
                    <td className="px-6 py-4 text-gray-200 font-semibold">{log.action}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-widest border ${getRiskColor(log.risk)}`}>
                        {log.risk}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{log.decision}</td>
                    <td className="px-6 py-4">
                      {log.result === "Success" ? (
                        <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs"><CheckCircle2 className="w-4 h-4" /> SUCCESS</span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-red-400 font-bold text-xs"><XCircle className="w-4 h-4" /> FAILED</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleReplay(log); }}
                        className="opacity-0 group-hover:opacity-100 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-3 py-1.5 rounded flex items-center gap-2 transition-all font-sans text-xs font-bold"
                      >
                        <Play className="w-3 h-3 fill-emerald-400" /> REPLAY
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>

        {/* SIDE PANEL: REPLAY ZONE */}
        {activeLog && (
          <div className="w-1/3 bg-black border border-gray-800 rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden animate-in slide-in-from-right-8 fade-in">
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] pointer-events-none rounded-full
              ${activeLog.result === 'Success' ? 'bg-emerald-500/10' : 'bg-red-500/10'}
            `} />

            <div className="flex justify-between items-start relative z-10">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{activeLog.id}</h3>
                <p className="text-emerald-400 font-mono text-sm">{activeLog.action}</p>
              </div>
              <button 
                onClick={() => setActiveLog(null)}
                className="p-1 px-3 bg-white/10 hover:bg-white/20 rounded text-xs uppercase tracking-widest font-bold font-mono transition-colors"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm font-mono mt-2 flex-shrink-0 relative z-10">
              <div className="bg-gray-900 rounded-lg p-3">
                <span className="text-gray-500 text-xs block mb-1">Actor</span>
                <span className="text-gray-200">{activeLog.user}</span>
              </div>
              <div className="bg-gray-900 rounded-lg p-3">
                <span className="text-gray-500 text-xs block mb-1">Target</span>
                <span className="text-blue-400 flex items-center gap-2">
                  <Server className="w-3 h-3" /> {activeLog.system}
                </span>
              </div>
              <div className="bg-gray-900 rounded-lg p-3">
                <span className="text-gray-500 text-xs block mb-1">Decision</span>
                <span className="text-gray-200">{activeLog.decision}</span>
              </div>
               <div className="bg-gray-900 rounded-lg p-3">
                <span className="text-gray-500 text-xs block mb-1">Vault Tokens</span>
                <div className="flex flex-col gap-1">
                  {activeLog.tokens.map(t => <span key={t} className="text-purple-400 text-[10px] break-all">{t}</span>)}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 border-b border-gray-800 pb-2 relative z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">Execution Replay</span>
              {replayState >= 0 && replayState < 4 && (
                <span className="text-[10px] text-emerald-400 font-mono animate-pulse">Running simulation...</span>
              )}
            </div>

            <div className="flex-1 relative z-10 overflow-hidden">
              {replayState >= 0 && (
                <div className="space-y-4">
                  <ReplayStep 
                    active={replayState === 0} 
                    completed={replayState > 0} 
                    icon={<User />} title="User Request Intercepted" 
                  />
                  <ReplayStep 
                    active={replayState === 1} 
                    completed={replayState > 1} 
                    icon={<ShieldAlert />} title="Risk Engine: Policy Checked" 
                  />
                  {activeLog.decision !== 'Rejected' && (
                    <ReplayStep 
                      active={replayState === 2} 
                      completed={replayState > 2} 
                      icon={<KeyRound />} title={`Vault Unlocked: ${activeLog.tokens.length} secrets retrieved`} 
                    />
                  )}
                  <ReplayStep 
                    active={replayState === 3} 
                    completed={replayState > 3} 
                    failed={activeLog.result === 'Failed'}
                    icon={activeLog.result === 'Failed' ? <XCircle /> : <CheckCircle2 />} 
                    title={activeLog.result === 'Failed' ? "Execution Blocked & Logged" : "Payload Delivered"} 
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ReplayStep({ active, completed, failed, icon, title }: any) {
  return (
    <div className={`flex items-start gap-4 transition-all duration-300 ${active ? "opacity-100 translate-x-2" : completed ? "opacity-60" : "opacity-0"}`}>
      <div className={`mt-0.5 p-2 rounded-lg border 
        ${active ? (failed ? "bg-red-500/20 border-red-500 text-red-500" : "bg-emerald-500/20 border-emerald-500 text-emerald-500") : ""}
        ${completed ? (failed ? "bg-red-900/20 border-red-900 text-red-800" : "bg-emerald-900/20 border-emerald-800 text-emerald-600") : "bg-gray-800 border-gray-700 text-gray-500"}
      `}>
        {React.cloneElement(icon, { className: "w-4 h-4" })}
      </div>
      <div>
        <div className={`text-sm font-semibold tracking-wide ${active ? (failed ? "text-red-400" : "text-emerald-400") : completed ? "text-gray-400" : "text-gray-600"}`}>
          {title}
        </div>
        {active && <div className="text-[10px] font-mono mt-1 text-gray-500">t+{Math.random().toFixed(3)}s</div>}
      </div>
    </div>
  );
}
