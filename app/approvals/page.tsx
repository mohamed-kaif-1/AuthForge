"use client";

import React, { useState } from "react";
import { 
  AlertTriangle, ShieldAlert, KeyRound, Database, Network, 
  CheckCircle2, XCircle, Search, Filter, Server, ChevronRight, User, Terminal
} from "lucide-react";

type RiskLevel = "critical" | "high" | "medium" | "low";

type ApprovalRequest = {
  id: string;
  requester: string;
  action: string;
  system: string;
  risk: RiskLevel;
  confidence: number;
  reason: string;
  impactContext: string[];
  tokensAssigned: string[];
};

const MOCK_QUEUE: ApprovalRequest[] = [
  {
    id: "REQ-9942",
    requester: "Merlin - SecOps",
    action: "Purge All Inactive Users",
    system: "Production PostgreSQL",
    risk: "critical",
    confidence: 94.2,
    reason: "Routine compliance purge, but targets a Tier-1 asset.",
    impactContext: ["Could affect up to 2,400 rows.", "Requires strict snapshotting.", "No rollback available."],
    tokensAssigned: ["db_admin_write_token", "vault_secret_pg_master"]
  },
  {
    id: "REQ-9831",
    requester: "Alice - DevOps",
    action: "Restart K8s Cluster",
    system: "AWS EKS (EU-West)",
    risk: "high",
    confidence: 98.9,
    reason: "Memory leak detected in node pool alpha.",
    impactContext: ["5 minute projected downtime.", "Traffic redirecting to US-East."],
    tokensAssigned: ["aws_eks_admin_role", "vault_assume_role"]
  },
  {
    id: "REQ-9720",
    requester: "Automated System",
    action: "Sync Slack Users",
    system: "Slack Enterprise",
    risk: "low",
    confidence: 99.9,
    reason: "Nightly cron sync.",
    impactContext: ["Read-only operation.", "Zero downtime."],
    tokensAssigned: ["slack_read_bot"]
  }
];

export default function DecisionEngine() {
  const [selectedReq, setSelectedReq] = useState<ApprovalRequest>(MOCK_QUEUE[0]);
  const [simState, setSimState] = useState<"idle" | "vault" | "execute" | "result">("idle");

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case "critical": return "text-red-500 bg-red-500/10 border-red-500/30";
      case "high": return "text-amber-500 bg-amber-500/10 border-amber-500/30";
      case "medium": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30";
      case "low": return "text-green-500 bg-green-500/10 border-green-500/30";
    }
  };

  const handleApprove = () => {
    setSimState("vault");
    setTimeout(() => {
      setSimState("execute");
      setTimeout(() => {
        setSimState("result");
      }, 1500);
    }, 1500);
  };

  return (
    <div className="h-full bg-[#050505] p-6 text-gray-200 font-sans flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-widest text-indigo-100 uppercase">Decision Engine</h1>
            <p className="text-sm font-mono text-gray-500 tracking-wide">Pending execution constraints</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-sm bg-white/5 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
            <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="font-mono text-gray-300"><span className="text-white font-bold">1</span> Critical Pending</span>
          </div>
        </div>
      </div>

      {/* Split Layout */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* LEFT: QUEUE */}
        <div className="w-[380px] flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
          {MOCK_QUEUE.map((req) => (
            <div 
              key={req.id}
              onClick={() => { setSelectedReq(req); setSimState("idle"); }}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 relative overflow-hidden backdrop-blur-sm
                ${selectedReq.id === req.id 
                  ? "bg-indigo-900/20 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)]" 
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
            >
              {req.risk === "critical" && <div className="absolute top-0 left-0 w-1 h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />}
              {req.risk === "high" && <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />}

              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-mono text-indigo-300">{req.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${getRiskColor(req.risk)}`}>
                  {req.risk}
                </span>
              </div>
              <h3 className="font-semibold text-gray-100 mb-1">{req.action}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-mono mb-2">
                <Server className="w-3.5 h-3.5" /> {req.system}
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <User className="w-3.5 h-3.5" /> {req.requester}
                </div>
                {selectedReq.id === req.id && <ChevronRight className="w-4 h-4 text-indigo-400" />}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: DETAILED ANALYSIS */}
        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col overflow-y-auto backdrop-blur-md relative">
          
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{selectedReq.action}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-400 font-mono mb-6">
                <span>Requested by {selectedReq.requester}</span>
                <span>•</span>
                <span className="text-indigo-400">{selectedReq.id}</span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">AI Risk Explanation</h4>
                  <p className="text-sm bg-black/40 border border-gray-800 p-3 rounded-lg text-gray-300 leading-relaxed border-l-2 border-l-indigo-500">
                    {selectedReq.reason}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Predicted Impact Vectors</h4>
                  <ul className="space-y-2">
                    {selectedReq.impactContext.map((impact, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <Terminal className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /> {impact}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
               {/* Metrics */}
               <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-xs uppercase font-bold text-gray-500">AI Confidence</span>
                  <span className="text-3xl font-mono mt-2 text-emerald-400">{selectedReq.confidence}%</span>
                </div>
                <div className="bg-black/40 border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-xs uppercase font-bold text-gray-500">Target Environment</span>
                  <span className="text-sm font-semibold mt-2 text-blue-400 flex items-center gap-2">
                    <Server className="w-4 h-4" /> {selectedReq.system}
                  </span>
                </div>
              </div>

              {/* Tokens required */}
              <div className="bg-black/40 border border-gray-800 rounded-xl p-4">
                <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-bold flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-indigo-400" /> Staged Vault Tokens
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedReq.tokensAssigned.map(t => (
                    <span key={t} className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono rounded-md">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SIMULATION PIPELINE */}
          <div className="mt-auto bg-black/50 border border-white/5 rounded-xl p-6">
            <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-6 font-bold text-center">Execution Simulation Matrix</h4>
            
            <div className="flex items-center justify-between max-w-2xl mx-auto relative relative z-10">
              {/* Lines */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-gray-800 -z-10 rounded-full overflow-hidden">
                {simState !== 'idle' && (
                  <div className={`h-full bg-indigo-500 transition-all duration-[3000ms] 
                    ${simState === 'vault' ? 'w-1/3' : simState === 'execute' ? 'w-2/3' : simState === 'result' ? 'w-full' : 'w-0'}
                  `}/>
                )}
              </div>

              {/* Nodes */}
              <SimNode active={true} icon={<User />} label="Approval" color="blue" />
              <SimNode 
                active={simState !== 'idle'} 
                pulsing={simState === 'vault'}
                icon={<Database />} label="Token Vault" color="purple" 
              />
              <SimNode 
                active={simState === 'execute' || simState === 'result'} 
                pulsing={simState === 'execute'}
                icon={<Network />} label="API Gateway" color="cyan" 
              />
              <SimNode 
                active={simState === 'result'} 
                icon={<CheckCircle2 />} label="Result" color="emerald" 
              />
            </div>

            <div className="mt-8 flex justify-center gap-4">
              {simState === 'idle' ? (
                <>
                  <button onClick={handleApprove} className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold tracking-wide shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all">
                    CONFIRM EXECUTION
                  </button>
                  <button className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 px-8 py-3 rounded-xl font-bold tracking-wide transition-all">
                    BLOCK
                  </button>
                </>
              ) : (
                <div className="text-indigo-400 font-mono text-sm animate-pulse flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> 
                  {simState === 'vault' ? "Fetching scoped keys from Vault..." : 
                   simState === 'execute' ? "Injecting tokens & executing payload..." : 
                   "Execution finalized and verified. Logs updated."}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function SimNode({ icon, label, active, pulsing, color }: any) {
  const getColors = () => {
    if (!active) return "bg-gray-900 border-gray-800 text-gray-600";
    switch(color) {
      case 'blue': return "bg-blue-500/10 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]";
      case 'purple': return "bg-purple-500/10 border-purple-500 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]";
      case 'cyan': return "bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]";
      case 'emerald': return "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]";
      default: return "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 relative">
      <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-500 bg-[#050505] z-10 ${getColors()} ${pulsing ? 'scale-110' : ''}`}>
        {React.cloneElement(icon, { className: "w-6 h-6" })}
        {pulsing && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-50 bg-current" />
        )}
      </div>
      <span className={`text-[10px] uppercase font-bold tracking-widest ${active ? "text-gray-300" : "text-gray-600"}`}>
        {label}
      </span>
    </div>
  )
}
