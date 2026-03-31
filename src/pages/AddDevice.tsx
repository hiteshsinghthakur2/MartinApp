import React, { useState } from 'react';
import { useDevices, BooDevice, MartinRemote } from '../store/DeviceContext';
import { ScanLine, Bluetooth, CheckCircle2, Loader2, Smartphone, Keyboard, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function AddDevice() {
  const { addBoo, addRemote } = useDevices();
  const [step, setStep] = useState<'scan' | 'pairing' | 'success'>('scan');
  const [inputMode, setInputMode] = useState<'scan' | 'manual'>('scan');
  const [manualCode, setManualCode] = useState('');
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [deviceType, setDeviceType] = useState<'Boo' | 'Remote' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startPairing = (code: string) => {
    setStep('pairing');
    setError(null);
    
    const isBoo = code.startsWith('B_');
    const isRemote = code.startsWith('R_');
    
    if (!isBoo && !isRemote) {
      setStep('scan');
      setError('Invalid code format. Must start with B_ or R_');
      return;
    }

    setScannedId(code);
    setDeviceType(isBoo ? 'Boo' : 'Remote');

    // Simulate pairing delay
    setTimeout(() => {
      setStep('success');
      if (isBoo) {
        addBoo({
          id: code,
          alias: `New Switch ${code.split('_')[1] || '001'}`,
          type: 'Switch',
          status: false
        });
      } else {
        addRemote({
          id: code,
          alias: `New Remote ${code.split('_')[1] || '001'}`,
          maps: []
        });
      }
    }, 3000);
  };

  const simulateScan = () => {
    // Simulate a random device scan
    const isBoo = Math.random() > 0.3;
    const newId = isBoo ? `B_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}` : `R_${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`;
    startPairing(newId);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    startPairing(manualCode.trim().toUpperCase());
  };

  const reset = () => {
    setStep('scan');
    setScannedId(null);
    setDeviceType(null);
    setManualCode('');
    setError(null);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Pair Device</h1>
        <p className="text-sm text-zinc-500 mt-1">Scan QR code to add a new Martin, Boo, or Remote.</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {step === 'scan' && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center w-full max-w-sm"
            >
              {/* Input Mode Toggle */}
              <div className="flex bg-zinc-900 p-1 rounded-xl mb-8 w-full">
                <button
                  onClick={() => setInputMode('scan')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors",
                    inputMode === 'scan' ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  <QrCode className="w-4 h-4" />
                  Scan QR
                </button>
                <button
                  onClick={() => setInputMode('manual')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors",
                    inputMode === 'manual' ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  <Keyboard className="w-4 h-4" />
                  Manual Entry
                </button>
              </div>

              {inputMode === 'scan' ? (
                <>
                  <div className="relative w-64 h-64 border-2 border-dashed border-zinc-700 rounded-3xl flex items-center justify-center bg-zinc-900 overflow-hidden mb-8">
                    <ScanLine className="w-16 h-16 text-zinc-600" />
                    {/* Simulated scanning animation */}
                    <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 w-full h-1 bg-emerald-500/50 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                    />
                  </div>
                  
                  <button
                    onClick={simulateScan}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-full font-medium flex items-center gap-3 transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    <Smartphone className="w-5 h-5" />
                    Simulate QR Scan
                  </button>
                </>
              ) : (
                <form onSubmit={handleManualSubmit} className="w-full flex flex-col gap-4">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center text-center">
                    <Keyboard className="w-12 h-12 text-zinc-600 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Enter Unique Code</h3>
                    <p className="text-xs text-zinc-500 mb-6">
                      Type the code found on the hardware label (e.g., B_123 or R_456).
                    </p>
                    
                    <input
                      type="text"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      placeholder="e.g. B_001"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-center font-mono text-lg text-emerald-400 focus:outline-none focus:border-emerald-500/50 uppercase"
                      autoFocus
                    />
                    
                    {error && (
                      <p className="text-rose-400 text-xs mt-3">{error}</p>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!manualCode.trim()}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white py-4 rounded-xl font-medium transition-colors"
                  >
                    Pair Device
                  </button>
                </form>
              )}
            </motion.div>
          )}

          {step === 'pairing' && (
            <motion.div
              key="pairing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 relative">
                <Bluetooth className="w-10 h-10 text-blue-400 animate-pulse" />
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 border-2 border-blue-400 rounded-full"
                />
              </div>
              
              <h2 className="text-xl font-medium mb-2">Connecting via BLE...</h2>
              <p className="text-zinc-400 text-sm mb-6 max-w-xs">
                Sending Wi-Fi credentials to {scannedId}. Please keep your phone nearby.
              </p>
              
              <div className="flex items-center gap-2 text-blue-400 text-sm font-mono bg-blue-500/10 px-4 py-2 rounded-full">
                <Loader2 className="w-4 h-4 animate-spin" />
                Handshake in progress
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              </div>
              
              <h2 className="text-2xl font-medium mb-2">Device Paired!</h2>
              <p className="text-zinc-400 text-sm mb-8">
                Successfully added <strong className="text-zinc-200">{deviceType} ({scannedId})</strong> to your network.
              </p>
              
              <button
                onClick={reset}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-4 rounded-full font-medium transition-colors"
              >
                Pair Another Device
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
