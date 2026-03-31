"use client";

import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, ShieldCheck, Database, Zap, LineChart } from 'lucide-react';

export default function DashboardView() {
  const [metrics, setMetrics] = useState({ actions: 14205, pending: 23, tokens: 892, health: 99.8 });

  useEffect(() => {
    const int = setInterval(() => {
      setMetrics(p => ({
        ...p,
        actions: p.actions + Math.floor(Math.random() * 5),
        tokens: p.tokens + Math.floor(Math.random() * 2)
      }));
    }, 4000);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      <h2 className="shrink-0 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">System Dashboard</h2>
      
      {/* Metrics Row */}
      <div className="shrink-0 grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "ACTIONS PROCESSED", val: metrics.actions.toLocaleString(), icon: <Activity className="text-blue-400" />, color: "border-blue-500/30" },
          { label: "PENDING APPROVALS", val: metrics.pending, icon: <AlertTriangle className="text-amber-400" />, color: "border-amber-500/30" },
          { label: "ACTIVE TOKENS", val: metrics.tokens, icon: <Database className="text-purple-400" />, color: "border-purple-500/30" },
          { label: "SYSTEM HEALTH", val: `${metrics.health}%`, icon: <ShieldCheck className="text-emerald-400" />, color: "border-emerald-500/30" }
        ].map((m, i) => (
          <div key={i} className={`bg-white/5 backdrop-blur-md border ${m.color} p-5 rounded-xl flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.2)] hover:bg-white/10 transition-colors group cursor-default`}>
            <div>
              <div className="text-[10px] text-gray-400 font-mono tracking-widest mb-1">{m.label}</div>
              <div className="text-2xl font-bold text-gray-100">{m.val}</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
              {m.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 pb-6">
         {/* Live Activity Feed */}
         <div className="lg:col-span-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-5 flex flex-col h-full shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
           <div className="flex justify-between items-center mb-4 shrink-0">
             <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2"><Zap className="w-4 h-4 text-blue-400"/> LIVE ACTIVITY TAPE</h3>
             <div className="flex gap-2 items-center">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
               </span>
               <span className="text-[10px] text-gray-500 font-mono tracking-widest">STREAMING</span>
             </div>
           </div>
           
           <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2 min-h-0">
             {[
               { time: "Just now", msg: "Token created for GitHub Repo Deletion", type: "warn" },
               { time: "2m ago", msg: "Admin role verified for User [U-082]", type: "info" },
               { time: "5m ago", msg: "Policy Evaluation passed (Risk: 12%)", type: "success" },
               { time: "12m ago", msg: "KMS Vault Unlocked by Auth Agent", type: "info" },
               { time: "15m ago", msg: "API Rate limit approaching on Prod-DB", type: "warn" },
               { time: "1h ago", msg: "Daily snapshot backup triggered", type: "success" },
               { time: "2h ago", msg: "Anomaly detected in IP routing table", type: "crit" },
               { time: "2h 5m ago", msg: "Slack Notification executed", type: "info" },
               { time: "3h ago", msg: "New security patch applied to edge node", type: "success" },
               { time: "4h ago", msg: "Failed login attempt from IP 192.168.1.1", type: "crit" }
             ].map((log, i) => (
               <div key={i} className="flex gap-4 p-3 rounded-lg border border-white/5 bg-black/20 hover:bg-black/40 transition-colors animate-in slide-in-from-right-4 duration-300 relative group overflow-hidden">
                 <div className={`absolute top-0 left-0 bottom-0 w-1 ${log.type === 'crit' ? 'bg-rose-500' : log.type === 'warn' ? 'bg-amber-500' : log.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'} group-hover:w-1.5 transition-all`} />
                 <div className="text-[10px] text-gray-500 font-mono w-16 shrink-0 pt-0.5 ml-1">{log.time}</div>
                 <div className="flex-1">
                   <div className={`text-sm ${
                     log.type === 'crit' ? 'text-rose-400' :
                     log.type === 'warn' ? 'text-amber-400' :
                     log.type === 'success' ? 'text-emerald-400' : 'text-blue-300'
                   }`}>{log.msg}</div>
                 </div>
               </div>
             ))}
           </div>
         </div>

         {/* Risk Distribution Heatmap Placeholder */}
         <div className="col-span-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-5 flex flex-col h-full shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
            <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2 mb-4 shrink-0"><LineChart className="w-4 h-4 text-purple-400"/> RISK DISTRIBUTION</h3>
            
            <div className="flex-1 flex flex-col justify-end gap-2 items-center min-h-0 w-full mb-8 relative">
              <div className="w-full flex items-end gap-1 h-full border-b border-white/10 pb-2">
                {[12, 34, 45, 23, 67, 89, 54, 30, 80, 20].map((v, i) => {
                  let c = "bg-blue-500/50";
                  if (v > 50) c = "bg-amber-500/50";
                  if (v > 80) c = "bg-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.5)]";
                  return (
                    <div key={i} className={`flex-1 ${c} rounded-t-[2px] hover:opacity-100 opacity-60 transition-all duration-300 hover:scale-y-105 cursor-crosshair relative group`} style={{ height: `${v}%`, transformOrigin: 'bottom' }}>
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 border border-white/20 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-mono z-10 w-max shadow-xl">
                         {v}% RISK
                       </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between w-full text-[10px] text-gray-500 font-mono mt-2 absolute -bottom-6">
                <span>LOW</span>
                <span>AVERAGE</span>
                <span>CRITICAL</span>
              </div>
            </div>

            <div className="w-full shrink-0 space-y-3 mt-4 bg-black/30 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 flex items-center gap-2 font-mono"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"/> SAFE</span>
                <span className="text-gray-100 font-mono">68%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 flex items-center gap-2 font-mono"><div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"/> ELEVATED</span>
                <span className="text-gray-100 font-mono">24%</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-white/10 pt-3 mt-3">
                <span className="text-rose-400 flex items-center gap-2 font-mono font-bold"><div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse"/> CRITICAL</span>
                <span className="text-rose-400 font-mono font-bold">8%</span>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}
