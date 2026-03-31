"use client";

import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, ArrowRight, UserCheck, AlertTriangle, Key } from 'lucide-react';

export default function ApprovalView() {
  const [selected, setSelected] = useState<number>(0);
  const [isAnimating, setAnimating] = useState(false);
  const [result, setResult] = useState<"APPROVED" | "REJECTED" | null>(null);

  const reqs = [
    { id: "REQ-99X2", user: "dev_lead_pete", risk: 95, desc: "Production DB Bulk Drop", time: "2 mins ago" },
    { id: "REQ-34M1", user: "sec_bot_auto", risk: 72, desc: "AWS Root Policy Mutation", time: "15 mins ago" },
    { id: "REQ-11F8", user: "j.doe_ops", risk: 45, desc: "S3 Bucket Public Access Grant", time: "1 hr ago" }
  ];

  const handleAction = (type: "APPROVED" | "REJECTED") => {
    setAnimating(true);
    setResult(null);
    setTimeout(() => {
      setResult(type);
      setAnimating(false);
    }, 2000);
  };

  const current = reqs[selected];

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      <h2 className="shrink-0 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">Approval Queue Engine</h2>

      <div className="flex gap-6 flex-1 min-h-0 pb-6">
        
        {/* Left Side: Queue */}
        <div className="w-1/3 flex flex-col gap-4 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
          {reqs.map((req, i) => (
            <div 
              key={i} 
              onClick={() => { setSelected(i); setResult(null); }}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col gap-3 group
                ${selected === i ? 'bg-amber-950/40 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)] scale-[1.02]' : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'}
              `}
            >
              {selected === i && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />}
              
              <div className="flex justify-between items-center z-10">
                <span className={`text-xs font-mono font-bold ${selected === i ? 'text-amber-400' : 'text-gray-400'}`}>{req.id}</span>
                <span className="text-[10px] text-gray-500 font-mono tracking-widest">{req.time}</span>
              </div>
              
              <div className="z-10 group-hover:text-amber-300 transition-colors text-gray-200 font-bold">{req.desc}</div>
              
              <div className="flex items-center gap-2 z-10">
                <span className="text-[10px] font-mono tracking-widest text-gray-500">RISK</span>
                <div className="flex-1 h-1 bg-black rounded overflow-hidden">
                  <div className={`h-full ${req.risk > 80 ? 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.8)]' : 'bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.8)]'}`} style={{ width: `${req.risk}%` }}/>
                </div>
                <span className={`text-[10px] font-mono font-bold ${req.risk > 80 ? 'text-rose-400' : 'text-amber-400'}`}>{req.risk}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Details & Decision */}
        <div className="flex-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 shadow-lg flex flex-col overflow-y-auto custom-scrollbar relative">
           
           <div className="flex justify-between items-start mb-6 pb-6 border-b border-white/10 shrink-0">
             <div>
               <div className="flex items-center gap-2 mb-2">
                 <ShieldAlert className="w-5 h-5 text-amber-500 animate-pulse" />
                 <h3 className="text-xl font-bold text-gray-100">{current.desc}</h3>
               </div>
               <div className="text-sm font-mono text-gray-400">REQUEST ID: <span className="text-amber-200">{current.id}</span></div>
             </div>
             <div className="text-right">
               <div className="text-[10px] font-mono text-gray-500 tracking-widest mb-1">REQUESTER OVERRIDE</div>
               <div className="flex items-center gap-2 justify-end text-sm">
                 <UserCheck className="w-4 h-4 text-cyan-400" />
                 <span className="text-cyan-200 font-bold">@{current.user}</span>
               </div>
             </div>
           </div>

           <div className="flex-1 min-h-0 space-y-6">
             <div className="grid grid-cols-2 gap-6">
               <div className="bg-black/30 border border-rose-500/30 rounded-lg p-4 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-bl-full -z-10" />
                 <div className="text-[10px] font-mono text-rose-400 tracking-widest flex items-center gap-2 mb-2"><AlertTriangle className="w-3 h-3"/> AI RISK EXPLANATION</div>
                 <p className="text-sm text-gray-300">
                   The requested action is highly destructive and targets the primary production cluster. There is no automated rollback vector identified in the request context.
                 </p>
               </div>
               
               <div className="bg-black/30 border border-purple-500/30 rounded-lg p-4 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-bl-full -z-10" />
                 <div className="text-[10px] font-mono text-purple-400 tracking-widest flex items-center gap-2 mb-2"><Key className="w-3 h-3"/> TOKEN USAGE PREVIEW</div>
                 <div className="space-y-2 mt-3">
                   <div className="flex justify-between items-center border-b border-white/5 pb-1">
                     <span className="text-xs font-mono text-gray-400">AWS_KMS_ROOT</span>
                     <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">WRITE_POLICY</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-xs font-mono text-gray-400">DB_PROD_ADMIN</span>
                     <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">DROP_TABLE</span>
                   </div>
                 </div>
               </div>
             </div>

             {/* Simulation Flow */}
             <div className="bg-black/40 border border-white/10 rounded-lg p-5 flex flex-col items-center justify-center relative overflow-hidden min-h-[160px]">
                <div className="absolute top-4 left-4 text-[10px] font-mono text-gray-500 tracking-widest">DECISION SIMULATOR</div>
                
                {(!isAnimating && !result) && (
                  <div className="flex gap-4 w-full max-w-sm mt-4">
                    <button onClick={() => handleAction("REJECTED")} className="flex-1 py-3 bg-rose-950/50 border border-rose-500/50 text-rose-400 rounded-lg font-mono font-bold hover:bg-rose-500 hover:text-white transition-all shadow-[0_0_15px_rgba(244,63,94,0.1)] hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]">
                      DENY
                    </button>
                    <button onClick={() => handleAction("APPROVED")} className="flex-1 py-3 bg-emerald-950/50 border border-emerald-500/50 text-emerald-400 rounded-lg font-mono font-bold hover:bg-emerald-500 hover:text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                      AUTHORIZE
                    </button>
                  </div>
                )}

                {isAnimating && (
                   <div className="flex items-center gap-6 mt-4">
                     <div className="w-10 h-10 rounded-full border border-amber-500/50 flex items-center justify-center bg-amber-500/10 text-amber-500 animate-pulse">
                        <UserCheck className="w-5 h-5"/>
                     </div>
                     <ArrowRight className="w-4 h-4 text-gray-500 animate-ping" />
                     <div className="w-10 h-10 rounded-full border border-purple-500/50 flex items-center justify-center bg-purple-500/10 text-purple-500 animate-pulse delay-75">
                        <Key className="w-5 h-5"/>
                     </div>
                     <ArrowRight className="w-4 h-4 text-gray-500 animate-ping delay-75" />
                     <div className="w-10 h-10 rounded-full border border-cyan-500/50 flex items-center justify-center bg-cyan-500/10 text-cyan-500 animate-pulse delay-150">
                        <CheckCircle2 className="w-5 h-5"/>
                     </div>
                   </div>
                )}

                {result && (
                  <div className={`mt-4 text-center animate-in zoom-in p-4 rounded-lg w-full max-w-sm border ${result === "APPROVED" ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "bg-rose-500/10 border-rose-500/50 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]"}`}>
                    <div className="flex items-center justify-center gap-2 text-xl font-bold font-mono">
                      {result === "APPROVED" ? <CheckCircle2 /> : <XCircle />}
                      {result}
                    </div>
                  </div>
                )}
             </div>

           </div>
        </div>

      </div>
    </div>
  )
}
