// context/BluetoothContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import BluetoothService from '../services/BluetoothService';
import { storage } from '../../storege.Js'; // ajuste o caminho conforme necessário

type BluetoothContextType = {
  isConnected: boolean;
  deviceId: string | null;
  connect: (id: string) => Promise<void>;
  disconnect: () => Promise<void>;
};

const BluetoothContext = createContext<BluetoothContextType | undefined>(undefined);

export const BluetoothProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const tryReconnect = async () => {
      const savedId = storage.getString('device_id');
      if (savedId) {
        try {
          await BluetoothService.connectToDevice(savedId);
          setDeviceId(savedId);
          setIsConnected(true);
        } catch (e) {
          console.warn('Falha ao reconectar Bluetooth:', e);
        }
      }
    };
    tryReconnect();
  }, []);

  const connect = async (id: string) => {
    await BluetoothService.connectToDevice(id);
    storage.set('device_id', id);
    setDeviceId(id);
    setIsConnected(true);
  };

  const disconnect = async () => {
    await BluetoothService.disconnect();
    storage.delete('device_id');
    setDeviceId(null);
    setIsConnected(false);
  };

  return (
    <BluetoothContext.Provider value={{ isConnected, deviceId, connect, disconnect }}>
      {children}
    </BluetoothContext.Provider>
  );
};

export const useBluetooth = () => {
  const context = useContext(BluetoothContext);
  if (!context) throw new Error('useBluetooth deve ser usado dentro de BluetoothProvider');
  return context;
};
