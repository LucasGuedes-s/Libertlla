import React, { createContext, useContext, useEffect, useState } from 'react';
import BluetoothService from '../services/BluetoothService';
import * as storage from '../../storege'; // Aqui importamos as funções corretas

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
      const savedDevice = await storage.getBluetoothDevice(); // Usando a função getBluetoothDevice
      if (savedDevice) {
        try {
          await BluetoothService.connectToDevice(savedDevice.id); // Conectando com o dispositivo salvo
          setDeviceId(savedDevice.id);
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
    await storage.saveBluetoothDevice({ id }); // Salvando o dispositivo no armazenamento
    setDeviceId(id);
    setIsConnected(true);
  };

  const disconnect = async () => {
    await BluetoothService.disconnect();
    await storage.removeBluetoothDevice(); // Removendo o dispositivo do armazenamento
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
