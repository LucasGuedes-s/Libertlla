// BLEScanner.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';

const manager = new BleManager();

export default function BLEScanner() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    const subscription = manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        scanAndDisplay();
        subscription.remove();
      }
    }, true);

    return () => {
      subscription.remove();
      manager.destroy();
    };
  }, []);

  const scanAndDisplay = () => {
    setDevices([]);
    const discoveredDeviceIds = new Set<string>();

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Erro ao escanear:', error);
        return;
      }

      if (device && !discoveredDeviceIds.has(device.id)) {
        discoveredDeviceIds.add(device.id);
        setDevices((prevDevices) => [...prevDevices, device]);
      }
    });

    // Parar o scan após 10 segundos
    setTimeout(() => {
      manager.stopDeviceScan();
    }, 10000);
  };

  const connectToDevice = async (device: Device) => {
    try {
      console.log('Parando o scan antes de conectar...');
      manager.stopDeviceScan();

      console.log('Tentando conectar ao dispositivo:', device.id);
      const connected = await manager.connectToDevice(device.id);
      await connected.discoverAllServicesAndCharacteristics();

      setConnectedDevice(connected);
      console.log('Conectado a', connected.name);
    } catch (error) {
      console.log('Erro ao conectar:', error);
    }
  };

  const renderItem = ({ item, index }: { item: Device; index: number }) => (
    <TouchableOpacity
      key={`${item.id}_${index}`}
      onPress={() => connectToDevice(item)}
      style={{ padding: 10, borderBottomWidth: 1 }}
    >
      <Text>{item.name || 'Dispositivo desconhecido'} - {item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Dispositivos BLE encontrados:</Text>
      <FlatList
        data={devices}
        keyExtractor={(item, index) => `${item.id}_${index}`}
        renderItem={renderItem}
      />

      {connectedDevice && (
        <View style={{ marginTop: 20 }}>
          <Text>Conectado a: {connectedDevice.name || 'Sem nome'} - {connectedDevice.id}</Text>
        </View>
      )}
    </View>
  );
}
