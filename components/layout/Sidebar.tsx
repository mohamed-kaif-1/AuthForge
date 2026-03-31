"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, ShieldBan, Bot, Network, Cpu, Lock, Terminal
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Live Pipeline", href: "/", icon: Network, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/30" },
    { name: "Intelligence Hub", href: "/requests", icon: Bot, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
    { name: "Decision Engine", href: "/approvals", icon: ShieldCheck, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
    { name: "Forensic Analyzer", href: "/audit", icon: Cpu, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  ];

  return (
    <div className="w-64 bg-[#050505] border-r border-white/10 flex flex-col h-full relative overflow-hidden z-50">
      
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-full h-32 bg-indigo-500/5 blur-[50px] pointer-events-none" />

      {/* Brand Header */}
      <div className="p-6 pb-8 pt-8 flex items-center gap-3 relative z-10">
        <div className="relative flex items-center justify-center p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-white/20">
          <ShieldBan className="w-6 h-6 text-white" />
        </div>
        <div>
           <span className="text-xl font-bold tracking-widest uppercase text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">AuthForge</span>
           <span className="text-[10px] text-indigo-400 font-mono tracking-[0.2em] block">Core.System</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 relative z-10">
        <div className="text-[10px] uppercase font-bold text-gray-600 mb-4 tracking-widest ml-2">Control Modules</div>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden group border ${
                isActive 
                  ? `${link.bg} ${link.color} ${link.border} shadow-[0_0_20px_rgba(0,0,0,0.5)]` 
                  : "border-transparent text-gray-500 hover:text-gray-200 hover:bg-white/5 hover:border-white/10"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-current rounded-r-md opacity-70" />
              )}
              <Icon className={`w-5 h-5 transition-transform duration-500 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
              <span className={`font-semibold tracking-wide text-sm ${isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100"}`}>
                {link.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Node Metrics Footer */}
      <div className="p-4 border-t border-white/10 mt-auto bg-black/40 backdrop-blur-sm relative z-10">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-gray-500 flex items-center gap-1"><Lock className="w-3 h-3 text-emerald-500"/> Auth Node</span>
            <span className="text-emerald-400">Stable</span>
          </div>
          <div className="flex justify-between items-center text-xs font-mono">
             <span className="text-gray-500 flex items-center gap-1"><Terminal className="w-3 h-3 text-purple-500"/> Vault Latency</span>
             <span className="text-purple-400">12ms</span>
          </div>
        </div>
      </div>
      
    </div>
  );
}