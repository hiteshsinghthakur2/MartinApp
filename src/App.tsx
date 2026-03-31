/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Home, PlusCircle, Settings, ShieldAlert } from 'lucide-react';
import { DeviceProvider } from './store/DeviceContext';
import Dashboard from './pages/Dashboard';
import AddDevice from './pages/AddDevice';
import LogicMapper from './pages/LogicMapper';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <DeviceProvider>
      <Router>
        <div className="flex flex-col h-screen bg-zinc-950 text-zinc-50 font-sans">
          <main className="flex-1 overflow-y-auto pb-20">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<AddDevice />} />
              <Route path="/settings" element={<LogicMapper />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>

          {/* Bottom Navigation */}
          <nav className="fixed bottom-0 w-full bg-zinc-900 border-t border-zinc-800 px-6 py-3 flex justify-between items-center z-50">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`
              }
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Home</span>
            </NavLink>
            
            <NavLink 
              to="/add" 
              className={({ isActive }) => 
                `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`
              }
            >
              <PlusCircle className="w-6 h-6" />
              <span className="text-xs font-medium">Pair</span>
            </NavLink>

            <NavLink 
              to="/settings" 
              className={({ isActive }) => 
                `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`
              }
            >
              <Settings className="w-6 h-6" />
              <span className="text-xs font-medium">Remote</span>
            </NavLink>

            <NavLink 
              to="/admin" 
              className={({ isActive }) => 
                `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-rose-400' : 'text-zinc-500 hover:text-zinc-300'}`
              }
            >
              <ShieldAlert className="w-6 h-6" />
              <span className="text-xs font-medium">Admin</span>
            </NavLink>
          </nav>
        </div>
      </Router>
    </DeviceProvider>
  );
}
