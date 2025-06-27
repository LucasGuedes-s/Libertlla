// Bluetooth.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import BluetoothService from '../assets/services/BluetoothService'; // Ajuste o caminho conforme necessário
import { Device } from 'react-native-ble-plx';

export default function BluetoothScreen() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    // Scan de dispositivos
    const subscription = BluetoothService.getManager().onStateChange(state => {
      if (state === 'PoweredOn') {
        BluetoothService.getManager().startDeviceScan(null, null, (error, device) => {
          if (error) {
            console.log('Erro scan:', error);
            return;
          }
          if (device && device.name) {
            setDevices(prev => {
              if (!prev.find(d => d.id === device.id)) return [...prev, device];
              return prev;
            });
          }
        });
      }
    }, true);

    // Tenta reconectar ao dispositivo salvo no storage
    (async () => {
      const device = await BluetoothService.reconnectToSavedDevice();
      setConnectedDevice(device);
    })();

    return () => {
      BluetoothService.getManager().stopDeviceScan();
      subscription.remove();
    };
  }, []);

  async function connect(device: Device) {
    try {
      const connected = await BluetoothService.connectToDevice(device);
      setConnectedDevice(connected);
    } catch (e) {
      console.log('Erro ao conectar:', e);
    }
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Dispositivos encontrados:</Text>
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => connect(item)} style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>{item.name} ({item.id})</Text>
          </TouchableOpacity>
        )}
      />
      <View style={{ marginTop: 20 }}>
        <Text>Dispositivo conectado:</Text>
        <Text>{connectedDevice ? `${connectedDevice.name} (${connectedDevice.id})` : 'Nenhum conectado'}</Text>
      </View>
    </View>
  );
}
