import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ConnectionMode = 'HTTP' | 'MQTT' | 'DISCONNECTED';

export interface BooDevice {
  id: string;
  alias: string;
  type: 'Regulator' | 'Switch';
  status: boolean;
  speed?: number; // 0-5 for regulator
}

export interface RemoteMap {
  buttonId: string;
  action: 'toggle' | 'on' | 'off';
  targetBooId: string;
}

export interface MartinRemote {
  id: string;
  alias: string;
  maps: RemoteMap[];
}

interface DeviceContextType {
  hubOnline: boolean;
  connectionMode: ConnectionMode;
  boos: BooDevice[];
  remotes: MartinRemote[];
  toggleBoo: (id: string) => void;
  setBooSpeed: (id: string, speed: number) => void;
  addBoo: (boo: BooDevice) => void;
  addRemote: (remote: MartinRemote) => void;
  updateRemoteMap: (remoteId: string, map: RemoteMap) => void;
  simulateRemotePress: (remoteId: string, buttonId: string) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [hubOnline, setHubOnline] = useState(true);
  const [connectionMode, setConnectionMode] = useState<ConnectionMode>('HTTP');
  
  const [boos, setBoos] = useState<BooDevice[]>([
    { id: 'B_001', alias: 'Master Bedroom Fan', type: 'Regulator', status: false, speed: 3 },
    { id: 'B_002', alias: 'Kitchen Light', type: 'Switch', status: true },
    { id: 'B_003', alias: 'Living Room Lamp', type: 'Switch', status: false },
  ]);

  const [remotes, setRemotes] = useState<MartinRemote[]>([
    {
      id: 'R_001',
      alias: 'Living Room Remote',
      maps: [
        { buttonId: 'btn_1', action: 'toggle', targetBooId: 'B_003' },
        { buttonId: 'btn_2', action: 'toggle', targetBooId: 'B_002' },
      ]
    }
  ]);

  // Simulate connection mode switching
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly switch between HTTP (local) and MQTT (remote) for demonstration
      setConnectionMode(prev => prev === 'HTTP' ? 'MQTT' : 'HTTP');
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleBoo = (id: string) => {
    setBoos(prev => prev.map(boo => 
      boo.id === id ? { ...boo, status: !boo.status } : boo
    ));
  };

  const setBooSpeed = (id: string, speed: number) => {
    setBoos(prev => prev.map(boo => 
      boo.id === id ? { ...boo, speed } : boo
    ));
  };

  const addBoo = (boo: BooDevice) => {
    setBoos(prev => [...prev, boo]);
  };

  const addRemote = (remote: MartinRemote) => {
    setRemotes(prev => [...prev, remote]);
  };

  const updateRemoteMap = (remoteId: string, map: RemoteMap) => {
    setRemotes(prev => prev.map(remote => {
      if (remote.id === remoteId) {
        const existingMapIndex = remote.maps.findIndex(m => m.buttonId === map.buttonId);
        const newMaps = [...remote.maps];
        if (existingMapIndex >= 0) {
          newMaps[existingMapIndex] = map;
        } else {
          newMaps.push(map);
        }
        return { ...remote, maps: newMaps };
      }
      return remote;
    }));
  };

  const simulateRemotePress = (remoteId: string, buttonId: string) => {
    const remote = remotes.find(r => r.id === remoteId);
    if (!remote) return;
    
    const map = remote.maps.find(m => m.buttonId === buttonId);
    if (!map) return;

    if (map.action === 'toggle') {
      toggleBoo(map.targetBooId);
    } else if (map.action === 'on') {
      setBoos(prev => prev.map(boo => boo.id === map.targetBooId ? { ...boo, status: true } : boo));
    } else if (map.action === 'off') {
      setBoos(prev => prev.map(boo => boo.id === map.targetBooId ? { ...boo, status: false } : boo));
    }
  };

  return (
    <DeviceContext.Provider value={{
      hubOnline,
      connectionMode,
      boos,
      remotes,
      toggleBoo,
      setBooSpeed,
      addBoo,
      addRemote,
      updateRemoteMap,
      simulateRemotePress
    }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevices() {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevices must be used within a DeviceProvider');
  }
  return context;
}
