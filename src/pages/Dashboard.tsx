import React from 'react';
import { useDevices } from '../store/DeviceContext';
import { Power, Wifi, Cloud, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { hubOnline, connectionMode, boos, toggleBoo } = useDevices();

  return (
    <div className="p-6">
      {/* Header & Status Ring */}
      <div className="flex flex-col items-center justify-center py-8 mb-8">
        <div className="relative">
          <motion.div 
            animate={{ 
              boxShadow: hubOnline 
                ? ['0px 0px 0px 0px rgba(52, 211, 153, 0)', '0px 0px 20px 10px rgba(52, 211, 153, 0.2)', '0px 0px 0px 0px rgba(52, 211, 153, 0)']
                : 'none'
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className={cn(
              "w-32 h-32 rounded-full flex flex-col items-center justify-center border-4",
              hubOnline ? "border-emerald-500 bg-emerald-500/10" : "border-red-500 bg-red-500/10"
            )}
          >
            <Power className={cn("w-10 h-10 mb-2", hubOnline ? "text-emerald-400" : "text-red-400")} />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              {hubOnline ? 'Online' : 'Offline'}
            </span>
          </motion.div>
          
          {/* Connection Mode Indicator */}
          <div className="absolute -bottom-3 -right-3 bg-zinc-800 p-2 rounded-full border border-zinc-700 shadow-lg">
            {connectionMode === 'HTTP' ? (
              <Wifi className="w-5 h-5 text-blue-400" />
            ) : connectionMode === 'MQTT' ? (
              <Cloud className="w-5 h-5 text-purple-400" />
            ) : (
              <Zap className="w-5 h-5 text-zinc-500" />
            )}
          </div>
        </div>
        
        <h1 className="text-2xl font-semibold mt-6 tracking-tight">Martin Hub</h1>
        <p className="text-sm text-zinc-500 mt-1 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
          Connected via {connectionMode}
        </p>
      </div>

      {/* Device Grid */}
      <div className="mb-4 flex justify-between items-end">
        <h2 className="text-lg font-medium text-zinc-300">My Boos</h2>
        <span className="text-xs text-zinc-500">{boos.length} Devices</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {boos.map((boo) => (
          <motion.button
            whileTap={{ scale: 0.95 }}
            key={boo.id}
            onClick={() => toggleBoo(boo.id)}
            className={cn(
              "relative overflow-hidden flex flex-col items-start p-5 rounded-3xl border text-left transition-all duration-300",
              boo.status 
                ? "bg-zinc-800 border-emerald-500/50 shadow-[0_0_15px_rgba(52,211,153,0.15)]" 
                : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
            )}
          >
            <div className="flex justify-between w-full mb-4">
              <div className={cn(
                "p-2 rounded-full",
                boo.status ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-500"
              )}>
                <Power className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-zinc-600 uppercase">{boo.id}</span>
            </div>
            
            <h3 className={cn(
              "font-medium leading-tight mb-1",
              boo.status ? "text-zinc-100" : "text-zinc-400"
            )}>
              {boo.alias}
            </h3>
            <p className="text-xs text-zinc-500">{boo.type}</p>

            {/* Status Indicator */}
            <div className="absolute top-0 left-0 w-full h-1 bg-zinc-800">
              <div 
                className={cn("h-full transition-all duration-500", boo.status ? "w-full bg-emerald-500" : "w-0 bg-transparent")}
              />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
