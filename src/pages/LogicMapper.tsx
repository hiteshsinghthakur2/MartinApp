import React, { useState } from 'react';
import { useDevices, RemoteMap } from '../store/DeviceContext';
import { Settings2, Link as LinkIcon, ChevronDown, Check, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function LogicMapper() {
  const { remotes, boos, updateRemoteMap, simulateRemotePress } = useDevices();
  const [selectedRemoteId, setSelectedRemoteId] = useState<string>(remotes[0]?.id || '');
  
  const selectedRemote = remotes.find(r => r.id === selectedRemoteId);

  // Helper to get current mapped boo for a button
  const getMappedBoo = (buttonId: string) => {
    const map = selectedRemote?.maps.find(m => m.buttonId === buttonId);
    if (!map) return null;
    return boos.find(b => b.id === map.targetBooId);
  };

  const handleMapChange = (buttonId: string, booId: string) => {
    if (!selectedRemoteId) return;
    updateRemoteMap(selectedRemoteId, {
      buttonId,
      action: 'toggle',
      targetBooId: booId
    });
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Logic Mapper</h1>
        <p className="text-sm text-zinc-500 mt-1">Map physical remote buttons to your Boo devices.</p>
      </div>

      {remotes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-zinc-800 rounded-3xl">
          <Settings2 className="w-12 h-12 text-zinc-600 mb-4" />
          <h2 className="text-lg font-medium text-zinc-300 mb-2">No Remotes Found</h2>
          <p className="text-sm text-zinc-500">Pair a Martin Remote first to configure button logic.</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-6">
          {/* Remote Selector */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 block">Select Remote</label>
            <div className="relative">
              <select 
                value={selectedRemoteId}
                onChange={(e) => setSelectedRemoteId(e.target.value)}
                className="w-full bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                {remotes.map(remote => (
                  <option key={remote.id} value={remote.id}>{remote.alias} ({remote.id})</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          {/* Button Mapping List */}
          {selectedRemote && (
            <div className="flex-1 flex flex-col gap-4">
              <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Button Assignments</h2>
              
              {['btn_1', 'btn_2', 'btn_3', 'btn_4'].map((btnId, index) => {
                const mappedBoo = getMappedBoo(btnId);
                
                return (
                  <div key={btnId} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-mono text-sm font-bold text-zinc-300 border border-zinc-700">
                          {index + 1}
                        </div>
                        <span className="font-medium text-zinc-200">Button {index + 1}</span>
                      </div>
                      
                      {/* Test Button */}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => simulateRemotePress(selectedRemoteId, btnId)}
                        disabled={!mappedBoo}
                        className={cn(
                          "p-2 rounded-full transition-colors",
                          mappedBoo 
                            ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30" 
                            : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                        )}
                        title="Simulate Press"
                      >
                        <Zap className="w-4 h-4" />
                      </motion.button>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <LinkIcon className="w-4 h-4 text-zinc-500 shrink-0" />
                      <div className="relative flex-1">
                        <select
                          value={mappedBoo?.id || ''}
                          onChange={(e) => handleMapChange(btnId, e.target.value)}
                          className="w-full bg-zinc-950 text-zinc-300 border border-zinc-800 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:border-emerald-500/50"
                        >
                          <option value="" disabled>Unassigned</option>
                          {boos.map(boo => (
                            <option key={boo.id} value={boo.id}>{boo.alias}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
