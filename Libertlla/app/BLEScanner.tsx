import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';

export default function BLEScanner() {
  const manager = useRef(new BleManager()).current;
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const scanTimeout = useRef<ReturnType<typeof setTimeout> | null>(null); 

  useEffect(() => {
    const subscription = manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        startScan();
        subscription.remove();
      }
    }, true);

    return () => {
      if (scanTimeout.current) {
        clearTimeout(scanTimeout.current);
      }
      manager.stopDeviceScan();
      manager.destroy();
    };
  }, []);

  const startScan = () => {
    // Iniciar o scan
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Erro ao escanear:', error);
        return;
      }
      if (device) {
        setDevices((prev) => {
          if (!prev.find((d) => d.id === device.id)) {
            return [...prev, device];
          }
          return prev;
        });
      }
    });

    // Definir o tempo de expiração do scan para 10 segundos
    scanTimeout.current = setTimeout(() => {
      console.log('Tempo de scan esgotado. Parando...');
      manager.stopDeviceScan();  // Parar o scan após 10 segundos
    }, 10000);
  };

  const connectToDevice = async (device: Device) => {
    try {
      console.log('Tentando conectar:', device.id);
      const connected = await manager.connectToDevice(device.id, { timeout: 5000 });
      await connected.discoverAllServicesAndCharacteristics();
      setConnectedDevice(connected);
      console.log('Conectado a:', connected.name || connected.id);
    } catch (error) {
      console.log('Erro ao conectar:', error);
    }
  };

  const disconnectDevice = async () => {
    if (connectedDevice) {
      try {
        await manager.cancelDeviceConnection(connectedDevice.id);
        setConnectedDevice(null);
        console.log('Desconectado');
      } catch (error) {
        console.log('Erro ao desconectar:', error);
      }
    }
  };

  const renderDeviceItem = ({ item }: { item: Device }) => {
    const isConnected = connectedDevice?.id === item.id;
    return (
      <TouchableOpacity
        onPress={() => {
          if (isConnected) {
            disconnectDevice();
          } else {
            connectToDevice(item);
          }
        }}
        style={{
          padding: 10,
          borderBottomWidth: 1,
          backgroundColor: isConnected ? '#d4edda' : 'white',
        }}
      >
        <Text>{item.name || 'Dispositivo desconhecido'} - {item.id}</Text>
        {isConnected && <Text style={{ color: 'green' }}>✅ Conectado</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Dispositivos BLE encontrados:</Text>

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={renderDeviceItem}
      />

      {connectedDevice && (
        <View style={{ marginTop: 20 }}>
          <Text>Dispositivo conectado: {connectedDevice.name || connectedDevice.id}</Text>
          <TouchableOpacity
            onPress={disconnectDevice}
            style={{ marginTop: 10, padding: 10, backgroundColor: '#f8d7da', borderRadius: 5 }}
          >
            <Text style={{ color: '#721c24', textAlign: 'center' }}>Desconectar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
