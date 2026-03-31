"use client";

import React, { useState } from 'react';
import { Search, Filter, PlayCircle, History, Database, UserCheck, Key, RefreshCcw } from 'lucide-react';

export default function AuditView() {
  const [replayEvent, setReplayEvent] = useState<string | null>(null);

  const logs = [
    { time: "2026-04-01 14:02:11", user: "dev_lead_pete", action: "Prod DB Bulk Drop", token: "AWS_KMS_ROOT", res: "APPROVED", status: "SUCCESS" },
    { time: "2026-04-01 13:45:00", user: "j.doe_ops", action: "S3 Bucket Public Grant", token: "AWS_S3_ADMIN", res: "REJECTED", status: "BLOCKED" },
    { time: "2026-04-01 11:15:21", user: "sec_bot_auto", action: "Rotation Keys", token: "INTERNAL_KMS", res: "AUTO_OK", status: "SUCCESS" },
    { time: "2026-04-01 09:30:10", user: "mike_r", action: "Delete Users Table", token: "DB_ADMIN", res: "REJECTED", status: "BLOCKED" },
    { time: "2026-03-31 18:20:05", user: "system_ops", action: "Scale Postgres Nodes", token: "AWS_EC2_MGMT", res: "APPROVED", status: "SUCCESS" }
  ];

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      <h2 className="shrink-0 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500 flex items-center gap-3">
         <History className="w-6 h-6 text-gray-400" /> Forensic Audit System
      </h2>

      <div className="flex flex-col gap-4 flex-1 min-h-0 pb-6">
        
        {/* Top Tools */}
        <div className="shrink-0 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              placeholder="Search fingerprints, tokens, users..." 
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm font-mono text-gray-300 focus:outline-none focus:border-gray-500/50"
            />
          </div>
          <button className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Table + Replay Split */}
        <div className="flex gap-6 flex-1 min-h-0">
          
          <div className="flex-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden flex flex-col shadow-lg">
             <div className="bg-black/50 border-b border-white/10 px-4 py-3 grid grid-cols-6 text-[10px] font-mono tracking-widest text-gray-500 shrink-0">
               <div className="col-span-1">TIMESTAMP</div>
               <div className="col-span-1">USER</div>
               <div className="col-span-1">ACTION</div>
               <div className="col-span-1">TOKEN</div>
               <div className="col-span-1">DECISION</div>
               <div className="col-span-1 text-right">EXEC RESULT</div>
             </div>
             
             <div className="flex-1 overflow-y-auto custom-scrollbar">
                {logs.map((L, i) => (
                  <div key={i} onClick={() => setReplayEvent(L.action)} className="px-4 py-4 border-b border-white/5 grid grid-cols-6 text-xs text-gray-300 hover:bg-white/5 cursor-pointer transition-colors group">
                    <div className="col-span-1 font-mono text-gray-500">{L.time}</div>
                    <div className="col-span-1 font-bold text-cyan-300 flex items-center gap-2"><UserCheck className="w-3 h-3 text-cyan-500/50"/> {L.user}</div>
                    <div className="col-span-1 text-gray-200">{L.action}</div>
                    <div className="col-span-1 font-mono text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded w-max">{L.token}</div>
                    <div className="col-span-1 text-[10px] tracking-widest font-mono font-bold">
                       <span className={L.res === 'APPROVED' ? 'text-emerald-400' : L.res === 'REJECTED' ? 'text-rose-400' : 'text-amber-400'}>{L.res}</span>
                    </div>
                    <div className="col-span-1 flex justify-end items-center gap-3">
                       <span className={`text-[10px] tracking-widest font-mono font-bold px-2 py-0.5 rounded-sm ${L.status === 'SUCCESS' ? 'text-black bg-emerald-500' : 'text-black bg-rose-500'}`}>{L.status}</span>
                       <PlayCircle className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Replay Details Panel */}
          {replayEvent && (
            <div className="w-80 bg-black/80 backdrop-blur-md rounded-xl border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.15)] p-5 flex flex-col shrink-0 animate-in slide-in-from-right-4 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full pointer-events-none" />
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2"><RefreshCcw className="w-4 h-4"/> EXEC REPLAY</h3>
                 <button onClick={() => setReplayEvent(null)} className="text-gray-500 hover:text-white">✕</button>
               </div>

               <div className="text-sm text-gray-200 mb-6 font-bold">{replayEvent}</div>

               <div className="flex-1 relative flex flex-col gap-6">
                  <div className="absolute left-4 top-4 bottom-4 w-px bg-white/10" />

                  {[
                    { l: "Intent Parsed", c: "text-purple-400", d: "0ms" },
                    { l: "Risk Engine: Critical", c: "text-amber-400", d: "+120ms" },
                    { l: "Human Auth Pending", c: "text-amber-400", d: "+210ms" },
                    { l: "Admin Override", c: "text-blue-400", d: "+5021ms" },
                    { l: "Token Vault Opened", c: "text-cyan-400", d: "+5100ms" },
                    { l: "Payload Executed", c: "text-emerald-400", d: "+5400ms" }
                  ].map((s, i) => (
                    <div key={i} className="flex gap-4 items-center relative animate-in slide-in-from-right-2" style={{ animationDelay: `${i*100}ms`}}>
                       <div className={`w-8 h-8 rounded-full bg-black border-2 border-current shadow-[0_0_10px_currentColor] z-10 flex items-center justify-center ${s.c}`}>
                         <div className="w-2 h-2 rounded-full bg-current" />
                       </div>
                       <div>
                         <div className={`text-xs font-bold ${s.c}`}>{s.l}</div>
                         <div className="text-[10px] font-mono text-gray-500 tracking-widest">{s.d}</div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
