import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BleManager, Device } from 'react-native-ble-plx';
import BluetoothService from '../assets/services/BluetoothService';
import { getBluetoothDevice } from '../storege';

const bleManager = BluetoothService.getManager();

// Tipagem com RSSI
type DeviceWithRSSI = Device & { rssi?: number };

export default function BluetoothScreen() {
  const [devices, setDevices] = useState<DeviceWithRSSI[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
    }

    return () => {
      bleManager.stopDeviceScan();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      let reconnectInterval: NodeJS.Timeout | null = null;

      const tryReconnect = async () => {
        const saved = await getBluetoothDevice();
        if (!saved) return;

        const isConnected = await bleManager.isDeviceConnected(saved.id);
        if (isConnected) {
          console.log('[Reconexão] Já está conectado ao dispositivo salvo.');

          // ✅ Cancela o intervalo se já estiver conectado
          if (reconnectInterval) {
            clearInterval(reconnectInterval);
            reconnectInterval = null;
          }

          return;
        }

        console.log('[Reconexão] Buscando dispositivo salvo...');
        bleManager.startDeviceScan(null, null, async (error, scannedDevice) => {
          if (error) return;

          if (scannedDevice?.id === saved.id) {
            console.log('[Reconexão] Dispositivo encontrado!');
            bleManager.stopDeviceScan();
            try {
              const reconnected = await BluetoothService.connectToDevice(saved.id);
              if (isActive && reconnected) {
                setConnectedDevice(reconnected);
                ToastAndroid.show('Reconectado automaticamente!', ToastAndroid.SHORT);

                reconnected.onDisconnected(() => {
                  console.log('[Reconexão] Dispositivo desconectado');
                  setConnectedDevice(null);
                });

                // ✅ Cancela o intervalo após reconectar
                if (reconnectInterval) {
                  clearInterval(reconnectInterval);
                  reconnectInterval = null;
                }
              }
            } catch (err) {
              console.log('[Reconexão] Falha ao reconectar:', err);
            }
          }
        });
      };

      reconnectInterval = setInterval(() => {
        tryReconnect();
      }, 5000);

      return () => {
        isActive = false;
        if (reconnectInterval) clearInterval(reconnectInterval);
        bleManager.stopDeviceScan();
      };
    }, [connectedDevice])
  );

  const startScan = () => {
    setDevices([]);
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Erro ao escanear:', error);
        return;
      }

      if (device && device.name) {
        setDevices((prev) => {
          const alreadyExists = prev.some((d) => d.id === device.id);
          if (alreadyExists) return prev;
          return [...prev, { ...device, rssi: device.rssi }];
        });
        console.log(`[SCAN] ${device.name} - RSSI: ${device.rssi}`);
      }
    });

    setTimeout(() => {
      bleManager.stopDeviceScan();
      ToastAndroid.show('Scan finalizado', ToastAndroid.SHORT);
    }, 10000);
  };

  const connectToDevice = async (device: Device) => {
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

  const disconnect = () => {
    BluetoothService.disconnect();
    setConnectedDevice(null);
    ToastAndroid.show('Desconectado', ToastAndroid.SHORT);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dispositivo Bluetooth</Text>

      <Button title="Buscar dispositivos" onPress={startScan} />

      {connectedDevice ? (
        <>
          <Text style={styles.connectedText}>
            Conectado a: {connectedDevice.name || connectedDevice.id}
          </Text>
          <Button title="Desconectar" onPress={disconnect} />
        </>
      ) : (
        <Text style={styles.subtitle}>Nenhum dispositivo conectado</Text>
      )}

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.deviceItem} onPress={() => connectToDevice(item)}>
            <Text style={styles.deviceName}>{item.name || 'Sem nome'}</Text>
            <Text style={styles.deviceId}>{item.id}</Text>
            <Text style={styles.rssiText}>RSSI: {item.rssi ?? 'N/A'} dBm</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.noDevices}>Nenhum dispositivo encontrado</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
  },
  connectedText: {
    fontSize: 16,
    marginVertical: 10,
    color: 'green',
  },
  deviceItem: {
    padding: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
  },
  deviceId: {
    fontSize: 12,
    color: '#666',
  },
  rssiText: {
    fontSize: 12,
    color: '#555',
  },
  noDevices: {
    marginTop: 20,
    textAlign: 'center',
    color: '#999',
  },
});
