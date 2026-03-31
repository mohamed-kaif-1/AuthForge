"use client";

import React, { useState, useEffect } from "react";
import { 
  Bot, BrainCircuit, Scan, ShieldAlert, Cpu, 
  Terminal, ArrowRight, Zap, Target, Binary
} from "lucide-react";

export default function AIIntelligenceHub() {
  const [extracting, setExtracting] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "I need to revoke all external collaborator access from the core-api repository immediately, and alert the security channel on Slack.";

  // Typewriter effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(prev => prev + fullText.charAt(i));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setExtracting(true), 600);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full bg-[#050505] p-6 text-gray-200 font-sans flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-700">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/10 relative">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-widest text-blue-100 uppercase">AI Intelligence Hub</h1>
            <p className="text-sm font-mono text-gray-500 tracking-wide">NLP Semantic Extraction & Dependency Graph</p>
          </div>
        </div>
        <div className={`flex gap-3 items-center px-4 py-2 rounded-xl border transition-all ${extracting ? "bg-blue-500/10 border-blue-500/50" : "bg-gray-900 border-gray-800"}`}>
          <Binary className={`w-4 h-4 ${extracting ? "text-blue-400 animate-spin" : "text-gray-600"}`} />
          <span className="text-sm font-mono text-gray-300">
            Engine State: <span className={extracting ? "text-blue-400 font-bold" : "text-gray-500"}>{extracting ? "ACTIVE" : "IDLE"}</span>
          </span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6 overflow-hidden">
        
        {/* LEFT COLUMN: NLP & INPUT */}
        <div className="flex flex-col gap-6 h-full overflow-hidden">
          
          {/* Input Feed */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-blue-500/20 transition-all" />
            <h3 className="text-sm text-gray-400 font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
               <Terminal className="w-4 h-4 text-blue-500" /> Incoming Raw Payload
            </h3>
            <div className="font-mono text-lg text-blue-100 leading-relaxed min-h-[80px]">
              &gt; {typedText}
              {!extracting && <span className="animate-pulse text-blue-500">_</span>}
            </div>
            {extracting && (
              <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-2 text-xs font-mono text-gray-500 animate-in slide-in-from-top-2">
                <Scan className="w-3.5 h-3.5 text-blue-500 animate-pulse" /> 
                Parsing semantics... Extracted 2 distinct operations.
              </div>
            )}
          </div>

          {/* NLP Breakdown */}
          <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 backdrop-blur-md">
            <h3 className="text-sm text-gray-400 font-bold tracking-widest uppercase flex items-center gap-2">
               <Bot className="w-4 h-4 text-emerald-500" /> NLP Semantic Breakdown
            </h3>

            {extracting ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="bg-black/30 border border-gray-800 rounded-xl p-4 flex flex-col gap-2">
                  <span className="text-[10px] text-gray-500 font-mono uppercase font-bold tracking-widest">Primary Intent</span>
                  <span className="text-lg text-white font-semibold flex items-center gap-2">
                    Access Revocation <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400">99.2% Conf</span>
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <EntityCard label="Target Resource" value="core-api repo" type="Asset" />
                  <EntityCard label="Subject Group" value="External Collaborators" type="Identity" />
                  <EntityCard label="Secondary Intent" value="Security Alert" type="Notification" />
                  <EntityCard label="Target Channel" value="Slack: #security" type="Destination" />
                </div>
              </div>
            ) : (
               <div className="flex-1 flex items-center justify-center text-gray-600 font-mono text-sm border-2 border-dashed border-gray-800 rounded-xl">
                 Awaiting payload completion...
               </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: GRAPH & RISK */}
        <div className="flex flex-col gap-6 h-full overflow-hidden">
          
          {/* Dependency Graph */}
          <div className="flex-[3] bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_60%)] pointer-events-none" />
            <h3 className="text-sm text-gray-400 font-bold tracking-widest uppercase flex items-center gap-2 mb-6">
               <Cpu className="w-4 h-4 text-purple-500" /> Action Dependency Graph
            </h3>

            {extracting ? (
              <div className="flex-1 relative flex items-center justify-center min-h-[300px]">
                
                 {/* Graph Container */}
                 <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                    
                    {/* Lines */}
                    <div className="absolute top-1/4 left-1/2 w-0.5 h-1/4 bg-blue-500/30 -z-10" />
                    <div className="absolute top-1/2 left-1/2 w-1/4 h-1/4 bg-emerald-500/30 origin-top-left -rotate-45 -z-10 animate-pulse" />
                    <div className="absolute top-1/2 left-1/4 w-1/4 h-1/4 bg-purple-500/30 origin-top-right rotate-45 -z-10 animate-pulse" />

                    {/* Root Node */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-blue-900/40 border-2 border-blue-500 text-blue-100 px-6 py-3 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.3)] z-10 text-center animate-in zoom-in">
                      <div className="text-[10px] text-blue-300 font-mono uppercase mb-1 tracking-widest">Root Trigger</div>
                      <div className="font-bold whitespace-nowrap">Receive Request</div>
                    </div>

                    {/* Action 1 */}
                    <div className="absolute bottom-1/4 left-0 bg-emerald-900/40 border-2 border-emerald-500 text-emerald-100 px-4 py-3 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] z-10 text-center animate-in zoom-in delay-200">
                      <div className="text-[10px] text-emerald-300 font-mono uppercase mb-1 tracking-widest">Node 1 (Priority)</div>
                      <div className="font-bold whitespace-nowrap">Revoke GitHub Access</div>
                    </div>

                    {/* Action 2 */}
                    <div className="absolute bottom-1/4 right-0 bg-purple-900/40 border-2 border-purple-500 text-purple-100 px-4 py-3 rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.3)] z-10 text-center animate-in zoom-in delay-500">
                      <div className="text-[10px] text-purple-300 font-mono uppercase mb-1 tracking-widest">Node 2 (Async)</div>
                      <div className="font-bold whitespace-nowrap">Post Slack Alert</div>
                    </div>

                 </div>

              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-sm font-mono text-gray-600">
                Graph inactive...
              </div>
            )}
          </div>

          {/* Risk Evaluation Visualization */}
          <div className="flex-[2] bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col">
            <h3 className="text-sm text-gray-400 font-bold tracking-widest uppercase flex items-center gap-2 mb-4">
               <ShieldAlert className="w-4 h-4 text-rose-500" /> Synthesized Risk Profile
            </h3>

            {extracting ? (
              <div className="flex-1 flex flex-col justify-center animate-in slide-in-from-bottom-8">
                <div className="flex justify-between items-end mb-2">
                  <div className="text-3xl font-mono text-rose-400 font-bold">88<span className="text-sm text-rose-500/50">/100</span></div>
                  <div className="text-rose-400 uppercase tracking-widest text-xs font-bold px-2 py-1 bg-rose-500/10 rounded border border-rose-500/30">High Risk Threshold</div>
                </div>
                
                {/* Visual Bar */}
                <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden mb-4 border border-gray-800">
                  <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 w-[88%] shadow-[0_0_10px_rgba(244,63,94,0.5)] relative">
                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono text-center">
                  <div className="bg-emerald-900/20 text-emerald-500 p-2 rounded">0-30 Low</div>
                  <div className="bg-amber-900/20 text-amber-500 p-2 rounded">30-70 Med</div>
                  <div className="bg-rose-900/20 text-rose-500 border border-rose-500/30 p-2 rounded">70-100 High</div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-sm font-mono text-gray-600">
                Awaiting entity resolution...
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

function EntityCard({ label, value, type }: any) {
  return (
    <div className="bg-black/30 border border-gray-800 rounded-xl p-3 flex flex-col hover:border-blue-500/50 transition-colors">
      <span className="text-[10px] text-gray-500 font-mono uppercase font-bold tracking-widest">{label}</span>
      <span className="text-blue-100 font-medium mt-1">{value}</span>
      <span className="text-[10px] text-blue-500 mt-2 font-mono flex items-center gap-1">
        <Target className="w-3 h-3" /> Type: {type}
      </span>
    </div>
  );
}
