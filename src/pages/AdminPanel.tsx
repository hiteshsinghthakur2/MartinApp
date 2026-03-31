import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldAlert, RefreshCw, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminPanel() {
  const [deviceType, setDeviceType] = useState<'Switch' | 'Regulator' | 'Remote'>('Switch');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const generateCode = () => {
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    let prefix = 'B_';
    if (deviceType === 'Remote') prefix = 'R_';
    
    // We can encode the type in the QR code if we want, but for simplicity, 
    // let's just use the ID and assume B_ is Boo and R_ is Remote.
    // If we want to be specific about Switch vs Regulator, we can append it.
    const suffix = deviceType === 'Regulator' ? '_REG' : deviceType === 'Switch' ? '_SW' : '';
    
    setGeneratedCode(`${prefix}${randomNum}${suffix}`);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-8 flex items-center gap-3">
        <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin Panel</h1>
          <p className="text-sm text-zinc-500 mt-1">Generate unique QR codes for new hardware.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        {/* Device Type Selector */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 block">
            Hardware Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Switch', 'Regulator', 'Remote'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setDeviceType(type)}
                className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                  deviceType === type 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          
          <button
            onClick={generateCode}
            className="w-full mt-4 bg-zinc-100 hover:bg-white text-zinc-900 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Generate Unique Code
          </button>
        </div>

        {/* QR Code Display */}
        {generatedCode && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center text-center"
          >
            <div className="bg-white p-4 rounded-2xl mb-6">
              <QRCodeSVG 
                value={generatedCode} 
                size={200}
                level="H"
                includeMargin={false}
              />
            </div>
            
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">
              Unique Hardware ID
            </h3>
            
            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-4 py-3 rounded-xl w-full">
              <code className="flex-1 text-lg font-mono text-emerald-400 tracking-wider">
                {generatedCode}
              </code>
              <button 
                onClick={copyToClipboard}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            
            <p className="text-xs text-zinc-500 mt-4">
              Print this QR code and attach it to the physical {deviceType.toLowerCase()} hardware.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
