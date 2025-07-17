import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import { useBluetooth } from '../assets/context/BluetoothContext';
import BluetoothService from '../assets/services/BluetoothService';
import { getBluetoothDevice } from '../storege';
import { Device } from 'react-native-ble-plx';

export default function BluetoothScreen() {
  const { isConnected, deviceId, connect, disconnect } = useBluetooth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [savedDevice, setSavedDevice] = useState<Device | null>(null);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const loadSavedDevice = async () => {
      const saved = await getBluetoothDevice();
      if (saved) {
        // Convert BluetoothDeviceData to Device if possible, or just store the id and name
        setSavedDevice({
          id: saved.id,
          name: saved.name,
        } as Device);
      }
    };
    loadSavedDevice();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
    }
  }, []);

  const startScan = () => {
    setDevices([]);
    setScanning(true);

    BluetoothService.getManager().startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Erro no scan:', error);
        setScanning(false);
        return;
      }

      if (device && device.name && !devices.some((d) => d.id === device.id)) {
        setDevices((prevDevices) => [...prevDevices, device]);
      }
    });

    setTimeout(() => {
      BluetoothService.getManager().stopDeviceScan();
      setScanning(false);
    }, 5000);
  };

  const connectToDevice = async (device: Device) => {
    if (!savedDevice || device.id !== savedDevice.id) {
      ToastAndroid.show('Apenas o dispositivo salvo pode ser conectado', ToastAndroid.SHORT);
      return;
    }

    try {
      const connected = await BluetoothService.connectToDevice(device.id);
      setConnectedDevice(connected);

      connected.onDisconnected(() => {
        console.log('[Conexão] Dispositivo desconectado');
        setConnectedDevice(null);
      });

      ToastAndroid.show(`Conectado a ${device.name}`, ToastAndroid.SHORT);
    } catch (error) {
      console.log('Erro ao conectar:', error);
      ToastAndroid.show('Erro ao conectar', ToastAndroid.SHORT);
    }
  };

  const renderItem = ({ item }: { item: Device }) => (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => connectToDevice(item)}
    >
      <Text style={styles.deviceName}>{item.name || 'Sem nome'}</Text>
      <Text style={styles.deviceId}>{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dispositivos Bluetooth</Text>

      <TouchableOpacity style={styles.scanButton} onPress={startScan}>
        <Text style={styles.scanButtonText}>
          {scanning ? 'Escaneando...' : 'Buscar dispositivos'}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.noDevices}>
            {scanning ? 'Buscando dispositivos...' : 'Nenhum dispositivo encontrado'}
          </Text>
        }
      />

      {connectedDevice && (
        <Text style={styles.connectedText}>
          Conectado a: {connectedDevice.name || 'Sem nome'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  scanButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  deviceItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
  },
  deviceId: {
    fontSize: 12,
    color: '#666',
  },
  noDevices: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  connectedText: {
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'green',
  },
});