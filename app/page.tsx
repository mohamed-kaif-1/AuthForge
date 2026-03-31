"use client";

import React, { useState } from 'react';
import { LayoutDashboard, Send, ShieldCheck, ClipboardList, Database, Activity, Fingerprint, Layers, Cpu, Server, Lock, ShieldAlert } from 'lucide-react';
import DashboardView from '@/components/views/DashboardView';
import RequestView from '@/components/views/RequestView';
import ApprovalView from '@/components/views/ApprovalView';
import AuditView from '@/components/views/AuditView';

export default function AuthForgeOS() {
  const [activeView, setActiveView] = useState<'dashboard' | 'requests' | 'approvals' | 'audit'>('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'SYS_DASHBOARD', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'requests', label: 'AI_REQUESTS', icon: <Send className="w-4 h-4" /> },
    { id: 'approvals', label: 'AUTH_GATEWAY', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'audit', label: 'FORENSICS', icon: <ClipboardList className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="w-full h-screen bg-[#050510] text-[#E0E7FF] font-sans overflow-hidden flex flex-col relative selection:bg-blue-500/30">
      
      {/* GLOBAL BACKGROUND EFFECTS */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#111827_0%,#050510_100%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTIwIDIwaDIwdjIwSDIweiIgZmlsbD0iIzRmNDZlNSIgZmlsbC1vcGFjaXR5PSIwLjAyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')] opacity-30 z-0 pointer-events-none mix-blend-screen" />

      {/* TOP SYSTEM BAR */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 shrink-0 relative z-20 bg-black/60 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Layers className="w-4 h-4 text-blue-400" />
            <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping translate-x-1 -translate-y-1" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-sm font-bold tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400">AUTHFORGE.OS</span>
            <span className="text-[9px] font-mono text-gray-500 tracking-widest">{">"} AI GOVERNANCE KERNEL v5.0</span>
          </div>
        </div>
        
        {/* Central Top HUD Data */}
        <div className="hidden lg:flex items-center gap-8 font-mono text-[10px] tracking-widest text-gray-500">
          <div className="flex items-center gap-2">
            SYS_STAT: <span className="text-emerald-500 flex items-center gap-1.5"><Activity className="w-3 h-3" /> ACTIVE</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            TRUST_INDEX: <span className="text-blue-400">99.8%</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2 border border-purple-500/30 bg-purple-500/10 px-2 py-1 rounded shadow-[0_0_10px_rgba(168,85,247,0.2)]">
            VAULT: <span className="text-purple-400 flex items-center gap-1.5"><Lock className="w-3 h-3" /> SEALED</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-mono text-gray-500 tracking-widest">NETWORK LINK</span>
            <span className="text-xs font-mono font-bold text-emerald-400">STABLE 12ms</span>
          </div>
          <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center relative hover:bg-white/10 transition-colors cursor-pointer">
            <ShieldAlert className="w-5 h-5 text-gray-400" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border border-black shadow-[0_0_10px_rgba(244,63,94,0.8)] animate-pulse" />
          </div>
        </div>
      </header>

      {/* MAIN SCREEN FLEX LAYOUT */}
      <div className="flex-1 flex overflow-hidden relative z-10 w-full h-full">
         
         {/* LEFT CONTROL SIDEBAR */}
         <div className="w-64 border-r border-white/10 bg-black/40 backdrop-blur-md flex flex-col z-20 shrink-0 shadow-[4px_0_30px_rgba(0,0,0,0.5)]">
            
            <div className="p-4 border-b border-white/5 shadow-inner">
               <div className="text-[10px] font-mono text-gray-500 tracking-widest mb-4 flex items-center gap-2">
                 <Cpu className="w-3 h-3" /> COMMAND VIEWS
               </div>
               <nav className="flex flex-col gap-2">
                  {tabs.map(tab => {
                    const isActive = activeView === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveView(tab.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-bold tracking-wider transition-all relative overflow-hidden group
                          ${isActive ? 'bg-blue-600/20 text-blue-300 border border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}
                        `}
                      >
                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]" />}
                        <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                          {tab.icon}
                        </div>
                        {tab.label}
                      </button>
                    )
                  })}
               </nav>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4">
               <div className="text-[10px] font-mono text-gray-500 tracking-widest flex items-center gap-2 border-b border-white/5 pb-2">
                 <Server className="w-3 h-3" /> ACTIVE NODES
               </div>
               
               {/* Mini Health Statuses */}
               {[
                 { label: "AI PARSER UNIT", c: "bg-emerald-500" },
                 { label: "RISK ENGINE", c: "bg-emerald-500" },
                 { label: "POLICY GATEWAY", c: "bg-amber-500" },
                 { label: "KMS VAULT", c: "bg-purple-500" }
               ].map((n, i) => (
                 <div key={i} className="flex justify-between items-center text-[10px] font-mono group">
                   <span className="text-gray-400 group-hover:text-white transition-colors">{n.label}</span>
                   <div className="flex items-center gap-1.5">
                     <span className="text-gray-600">UP</span>
                     <div className={`w-2 h-2 rounded-full ${n.c} shadow-[0_0_8px_currentColor]`} />
                   </div>
                 </div>
               ))}
               
               <div className="mt-8 border border-white/5 bg-black/40 rounded-lg p-3 text-[10px] font-mono text-gray-500 text-center">
                 <Fingerprint className="w-8 h-8 mx-auto mb-2 text-blue-500/30" />
                 ALL ACTIONS CRYPTOGRAPHICALLY SIGNED
               </div>
            </div>

         </div>

         {/* DYNAMIC MAIN PANEL */}
         <div className="flex-1 bg-black/40 relative shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Dynamic View Injection */}
            <div className="absolute inset-0 p-8 overflow-y-auto custom-scrollbar">
              {activeView === 'dashboard' && <DashboardView />}
              {activeView === 'requests' && <RequestView />}
              {activeView === 'approvals' && <ApprovalView />}
              {activeView === 'audit' && <AuditView />}
            </div>
         </div>

      </div>
    </div>
  );
}