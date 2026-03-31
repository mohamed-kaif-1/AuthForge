"use client";

import React, { useState } from 'react';
import { Send, Bot, Shield, CheckCircle2, ArrowRight, Database, UserCheck, TerminalSquare } from 'lucide-react';

export default function RequestView() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<"IDLE" | "ANALYZING" | "EXTRACTED">("IDLE");

  const handleSubmit = () => {
    if (!prompt) return;
    setStatus("ANALYZING");
    setTimeout(() => {
      setStatus("EXTRACTED");
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      <h2 className="shrink-0 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">AI Request Engine</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0 pb-6">
        
        {/* Left Col: Prompt & Analysis */}
        <div className="flex flex-col gap-6 h-full min-h-0">
           <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-5 shadow-[0_4px_30px_rgba(0,0,0,0.2)] flex flex-col shrink-0 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
             <div className="flex items-center gap-2 mb-4 text-sm font-bold text-cyan-400">
               <TerminalSquare className="w-4 h-4" /> NATURAL LANGUAGE VECTOR
             </div>
             <textarea 
               value={prompt}
               onChange={e => setPrompt(e.target.value)}
               placeholder="> Input directive mapping (e.g. Delete all inactive users from production database and revoke their AWS tokens...)"
               className="w-full bg-black/50 border border-white/10 rounded-lg p-5 text-sm font-mono text-cyan-200 placeholder:text-cyan-900/60 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 resize-none h-40 shadow-inner"
             />
             <div className="flex justify-end mt-4 relative z-10">
               <button 
                 onClick={handleSubmit} disabled={status === "ANALYZING" || !prompt}
                 className="bg-cyan-600 hover:bg-cyan-500 text-black px-6 py-2.5 rounded-lg text-sm font-mono font-bold flex items-center gap-3 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
               >
                 {status === "ANALYZING" ? <span className="animate-pulse">Processing...</span> : "Generate Execution Node"} <Send className="w-4 h-4" />
               </button>
             </div>
           </div>

           {status !== "IDLE" && (
             <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-5 shadow-[0_4px_30px_rgba(0,0,0,0.2)] flex-1 flex flex-col animate-in slide-in-from-bottom-4 duration-500 overflow-y-auto">
               <div className="flex items-center gap-2 mb-6 text-sm font-bold text-emerald-400 shrink-0">
                 <Bot className="w-4 h-4" /> NLP BREAKDOWN MATRICES
               </div>
               
               {status === "ANALYZING" ? (
                 <div className="flex-1 flex flex-col items-center justify-center text-cyan-500 font-mono text-sm space-y-6">
                    <div className="w-12 h-12 relative flex items-center justify-center">
                       <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
                       <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 animate-spin" />
                       <Bot className="w-5 h-5 animate-pulse text-cyan-300" />
                    </div>
                    <div className="animate-pulse tracking-widest text-xs">EXTRACTING ENTITIES...</div>
                 </div>
               ) : (
                 <div className="space-y-4 font-mono text-sm text-gray-300 flex-1 min-h-0">
                   <div className="bg-black/40 p-4 rounded-lg border border-white/5 relative overflow-hidden group">
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
                     <div className="text-[10px] text-gray-500 mb-2 tracking-widest">IDENTIFIED INTENT PAYLOAD</div>
                     <div className="text-purple-300 font-bold bg-purple-500/10 px-3 py-1.5 rounded w-max">DESTRUCTIVE_BATCH_DELETE</div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                     <div className="bg-black/40 p-4 rounded-lg border border-white/5 relative overflow-hidden">
                       <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500" />
                       <div className="text-[10px] text-gray-500 mb-2 tracking-widest">TARGET SERVICE</div>
                       <div className="text-cyan-300 font-bold max-w-full overflow-hidden text-ellipsis whitespace-nowrap">Prod-PostgreSQL</div>
                     </div>
                     <div className="bg-black/40 p-4 rounded-lg border border-white/5 relative overflow-hidden">
                       <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
                       <div className="text-[10px] text-gray-500 mb-2 tracking-widest">CREDENTIAL REQ</div>
                       <div className="text-amber-300 font-bold max-w-full overflow-hidden text-ellipsis whitespace-nowrap">AWS_ROOT_KMS</div>
                     </div>
                   </div>
                   
                   <div className="bg-black/40 p-4 rounded-lg border border-white/5 flex justify-between items-center relative overflow-hidden">
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                     <div>
                       <div className="text-[10px] text-gray-500 mb-2 tracking-widest">NEURAL CONFIDENCE SCORE</div>
                       <div className="text-emerald-400 font-bold text-lg">99.4% Match</div>
                     </div>
                     <div className="w-12 h-12 rounded-full border border-emerald-500/30 flex items-center justify-center bg-emerald-500/10">
                       <Shield className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                     </div>
                   </div>
                 </div>
               )}
             </div>
           )}
        </div>

        {/* Right Col: Extracted Actions & Pipeline */}
        {status === "EXTRACTED" ? (
          <div className="flex flex-col gap-6 h-full min-h-0 animate-in slide-in-from-right-8 duration-700">
            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-5 shadow-[0_4px_30px_rgba(0,0,0,0.2)] flex-1 flex flex-col min-h-0 overflow-y-auto">
               <div className="flex justify-between items-center mb-6 shrink-0">
                 <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2"><ArrowRight className="w-4 h-4"/> ACTIONABLE PLAN EXTRACTED</h3>
                 <span className="px-3 py-1 bg-rose-500/20 border border-rose-500/50 text-rose-400 text-[10px] font-bold rounded-full animate-pulse tracking-widest shadow-[0_0_10px_rgba(244,63,94,0.3)]">CRITICAL RISK</span>
               </div>

               <div className="space-y-4 flex-1">
                 {[
                   { t: "Revoke API Tokens", d: "AWS IAM Policy Deletion for specific user group.", r: "95", rs: "bg-rose-500", st: "PENDING_APPROVAL", col: "text-amber-400 bg-amber-500/20" },
                   { t: "Drop User Rows", d: "DELETE FROM Users WHERE last_active < '2025-01-01'", r: "88", rs: "bg-rose-500", st: "PENDING_APPROVAL", col: "text-amber-400 bg-amber-500/20" },
                   { t: "Notify Security Channel", d: "Send Slack webhook with execution manifest", r: "10", rs: "bg-emerald-500", st: "AUTO_APPROVED", col: "text-emerald-400 bg-emerald-500/20" }
                 ].map((act, i) => (
                   <div key={i} className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col gap-3 hover:bg-black/60 hover:border-white/10 transition-all cursor-pointer group hover:shadow-lg relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                     <div className="flex justify-between items-start relative z-10">
                       <span className="text-sm font-bold text-gray-200 group-hover:text-emerald-300 transition-colors">{act.t}</span>
                       <span className={`text-[10px] px-2 py-0.5 rounded-sm font-mono tracking-widest ${act.col}`}>{act.st}</span>
                     </div>
                     <span className="text-xs text-gray-400 font-mono bg-black/50 p-2 rounded relative z-10 border border-white/5">{act.d}</span>
                     
                     <div className="mt-1 flex items-center gap-3 relative z-10">
                       <span className="text-[10px] text-gray-500 font-mono tracking-widest shrink-0">RISK VECTOR</span>
                       <div className="flex-1 h-1.5 bg-black rounded-full overflow-hidden border border-white/5">
                         <div className={`h-full ${act.rs} shadow-[0_0_10px_currentColor]`} style={{ width: `${act.r}%` }} />
                       </div>
                       <span className={`text-[10px] font-mono shrink-0 font-bold ${act.rs.includes('rose') ? 'text-rose-400' : 'text-emerald-400'}`}>{act.r}%</span>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-5 shadow-[0_4px_30px_rgba(0,0,0,0.2)] shrink-0 relative overflow-hidden h-40 flex flex-col justify-center">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.1)_0%,transparent_100%)] pointer-events-none" />
               <h3 className="text-xs font-mono tracking-widest text-emerald-400/50 mb-6 absolute top-4 left-4">LIVE EXECUTION PIPELINE</h3>
               
               <div className="flex justify-between items-center w-full px-6 relative font-mono text-[10px] text-center mt-4">
                 <div className="absolute top-1/2 left-10 right-10 h-px bg-white/10 -translate-y-1/2 -z-10" />
                 
                 {[
                   { l: "NLP", i: <Bot className="w-5 h-5 text-purple-400" />, act: true },
                   { l: "RISK", i: <Shield className="w-5 h-5 text-amber-400" />, act: true },
                   { l: "AUTH", i: <Database className="w-5 h-5 text-emerald-400" />, act: true },
                   { l: "VAULT", i: <CheckCircle2 className="w-5 h-5 text-cyan-400" />, act: false },
                   { l: "EXEC", i: <UserCheck className="w-5 h-5 text-gray-600" />, act: false }
                 ].map((s, i) => (
                   <div key={i} className={`flex flex-col items-center gap-3 relative group transition-transform ${s.act && i === 2 ? 'scale-125' : s.act ? 'scale-110' : ''}`}>
                     <div className={`w-12 h-12 rounded-full border-[3px] bg-black flex items-center justify-center transition-all shadow-xl
                       ${s.act && i === 2 ? 'border-emerald-500 shadow-[0_0_20px_rgba(52,211,153,0.5)] animate-pulse' : s.act ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-white/10 opacity-50'}
                     `}>
                       {s.i}
                     </div>
                     <span className={`${s.act && i === 2 ? 'text-emerald-400 font-bold' : s.act ? 'text-indigo-300' : 'text-gray-600'} tracking-widest`}>{s.l}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 rounded-xl border border-white/10 bg-black/40 shadow-inner relative overflow-hidden flex flex-col items-center justify-center p-8 min-h-[400px]">
            {/* Deep Dynamic Radar Background */}
            <div className={`absolute inset-0 flex items-center justify-center opacity-30 transition-opacity duration-1000 ${status === 'ANALYZING' ? 'opacity-70' : ''}`}>
              <div className="w-[800px] h-[800px] absolute border border-cyan-500/10 rounded-full animate-[spin_60s_linear_infinite]" />
              <div className="w-[600px] h-[600px] absolute border border-cyan-500/20 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
              <div className="w-[400px] h-[400px] absolute rounded-full overflow-hidden animate-[spin_10s_linear_infinite]">
                <div className="w-full h-1/2 origin-bottom bg-gradient-to-t from-cyan-500/20 to-transparent absolute bottom-1/2" />
                <div className="absolute inset-0 border border-cyan-500/30 rounded-full" />
              </div>
              <div className="w-[200px] h-[200px] absolute border border-cyan-500/50 rounded-full shadow-[0_0_50px_rgba(6,182,212,0.2)]" />
            </div>

            {/* Pulsing Grid Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_80%)] pointer-events-none z-10" />

            {/* Central Holographic Core */}
            <div className="relative z-20 flex flex-col items-center group">
              <div className={`w-32 h-32 rounded-full border border-black bg-cyan-950/40 backdrop-blur-md flex items-center justify-center relative transition-all duration-700 shadow-[inset_0_0_30px_rgba(6,182,212,0.5),0_0_50px_rgba(6,182,212,0.2)] ${status === 'ANALYZING' ? 'scale-110 shadow-[inset_0_0_50px_rgba(52,211,153,0.8),0_0_80px_rgba(52,211,153,0.6)]' : 'hover:scale-105 hover:shadow-[0_0_60px_rgba(6,182,212,0.4)]'}`}>
                
                {/* Orbital rings */}
                <div className={`absolute inset-0 rounded-full border border-cyan-400/50 ${status === 'ANALYZING' ? 'animate-ping opacity-30 border-emerald-400' : ''}`} style={{ animationDuration: '2s' }} />
                <div className={`absolute -inset-4 rounded-full border border-cyan-500/30 border-dashed ${status === 'ANALYZING' ? 'animate-[spin_4s_linear_infinite] border-emerald-500/50' : 'animate-[spin_20s_linear_infinite]'}`} />
                <div className={`absolute -inset-8 rounded-full border border-transparent border-t-emerald-500/60 border-l-cyan-500/40 ${status === 'ANALYZING' ? 'animate-[spin_2s_linear_infinite_reverse]' : 'animate-[spin_15s_linear_infinite_reverse]'}`} />
                
                <Bot className={`w-12 h-12 transition-colors duration-500 ${status === 'ANALYZING' ? 'text-emerald-300 drop-shadow-[0_0_15px_rgba(52,211,153,1)] animate-bounce' : 'text-cyan-500 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]'}`} />
              </div>

              {/* Status Badge */}
              <div className={`mt-10 bg-black/60 border ${status === 'ANALYZING' ? 'border-emerald-500/50 shadow-[0_10px_30px_rgba(52,211,153,0.3)]' : 'border-cyan-500/30 shadow-[0_10px_30px_rgba(6,182,212,0.2)]'} backdrop-blur-md px-8 py-4 rounded-xl text-center transform transition-all duration-500`}>
                <h3 className={`text-lg font-bold font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r mb-2 ${status === 'ANALYZING' ? 'from-emerald-400 to-cyan-400' : 'from-cyan-400 to-blue-500'}`}>
                  {status === "ANALYZING" ? "SYNTHESIZING VECTORS" : "NEURAL CORE ONDEMAND"}
                </h3>
                <div className="flex items-center justify-center gap-2">
                   {status === "ANALYZING" && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                   <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                     {status === "ANALYZING" 
                       ? "Mapping natural intent to executor nodes"
                       : "Awaiting natural language input stream"}
                   </p>
                </div>
              </div>
            </div>

            {/* Edge technical overlays */}
            <div className="absolute top-6 left-6 flex flex-col gap-1 text-[8px] font-mono text-cyan-500/40 tracking-[0.3em] z-10">
               <div>SYS.CORE.v9.2.1</div>
               <div className="flex items-center gap-1"><div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" /> LINK_STABLE</div>
            </div>
            <div className="absolute bottom-6 right-6 text-[8px] font-mono text-cyan-500/40 tracking-[0.3em] text-right z-10">
               <div>AUTHORIZATION_LAYER_8</div>
               <div>QUANTUM_RESISTANT_NOISE</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
