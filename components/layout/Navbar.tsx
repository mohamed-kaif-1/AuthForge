import { Bell, Search, Activity, ShieldCheck, Database, CheckCircle2, ChevronDown } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 border-b border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
      
      {/* Search / Command Bar */}
      <div className="flex items-center gap-3 text-gray-400 w-full max-w-md bg-white/5 px-4 py-2 rounded-xl border border-white/5 focus-within:border-indigo-500/50 focus-within:bg-indigo-500/5 transition-all">
        <Search className="w-4 h-4 text-indigo-400" />
        <input 
          type="text" 
          placeholder="Execute override command..." 
          className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-600 text-gray-100 font-mono"
        />
        <div className="flex gap-1">
           <kbd className="px-2 py-0.5 bg-black rounded text-[10px] font-bold text-gray-500 border border-gray-800">⌘</kbd>
           <kbd className="px-2 py-0.5 bg-black rounded text-[10px] font-bold text-gray-500 border border-gray-800">K</kbd>
        </div>
      </div>
      
      {/* Global System Status */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-6">
        <div className="flex items-center gap-2">
           <div className="relative flex w-3 h-3">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
           </div>
           <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-emerald-500">AI Core Active</span>
        </div>
        <div className="h-4 w-[1px] bg-white/10" />
        <div className="flex items-center gap-2">
           <Database className="w-4 h-4 text-purple-400" />
           <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-gray-400">Vault Secure</span>
        </div>
        <div className="h-4 w-[1px] bg-white/10" />
        <div className="flex items-center gap-2">
           <ShieldCheck className="w-4 h-4 text-blue-400" />
           <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-gray-400">Trust Score: <span className="text-white">A+</span></span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Live Activity Feed Snippet */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-gray-400">
          <Activity className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-gray-300">2 actions routed</span>
        </div>

        <button className="relative p-2 text-gray-400 hover:text-indigo-400 transition-colors rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#050505] animate-pulse"></span>
        </button>

        <div className="flex items-center gap-2 pl-4 border-l border-white/10 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.5)]">
            <span className="text-xs font-bold text-white">AD</span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
        </div>
      </div>
    </header>
  );
}