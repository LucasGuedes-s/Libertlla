import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  AppState,
  AppStateStatus,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { BleManager, Device, State } from 'react-native-ble-plx';
import BluetoothService from '../assets/services/BluetoothService';
import { getBluetoothDevice, BluetoothDeviceData } from '../storege';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import MenuInferior from '../assets/components/menu_inferior'

const bleManager = BluetoothService.getManager();

type DeviceWithRSSI = Device & { rssi: number };

export default function BluetoothScreen() {
  const [devices, setDevices] = useState<DeviceWithRSSI[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [savedDevice, setSavedDevice] = useState<BluetoothDeviceData | null>(null);
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const manuallyDisconnected = useRef(false);
  const router = useRouter();

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

  useEffect(() => {
    const loadSavedDevice = async () => {
      const saved = await getBluetoothDevice();
      if (saved) setSavedDevice(saved);
    };
    loadSavedDevice();
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      let reconnectInterval: number | null = null;

      const tryReconnect = async () => {
        if (!isActive || connectedDevice || manuallyDisconnected.current) return;

        if (!savedDevice) return;

        const btState = await bleManager.state();
        if (btState !== State.PoweredOn) return;

        const isConnected = await bleManager.isDeviceConnected(savedDevice.id);
        if (isConnected) {
          const devicesFound = await bleManager.devices([savedDevice.id]);
          setConnectedDevice(devicesFound[0] || null);
          return;
        }

        bleManager.startDeviceScan(null, null, async (error, scannedDevice) => {
          if (error || !scannedDevice || !isActive) return;

          if (scannedDevice.id === savedDevice.id) {
            bleManager.stopDeviceScan();
            try {
              const reconnected = await BluetoothService.connectToDevice(savedDevice.id);
              if (isActive && reconnected) {
                setConnectedDevice(reconnected);
                ToastAndroid.show('Reconectado automaticamente!', ToastAndroid.SHORT);

                reconnected.onDisconnected(() => {
                  setConnectedDevice(null);
                });

                if (reconnectInterval) clearInterval(reconnectInterval);
              }
            } catch (err) {
              console.log('Falha ao reconectar:', err);
            }
          }
        });
      };

      if (!connectedDevice) {
        tryReconnect();
        reconnectInterval = setInterval(tryReconnect, 5000);
      }

      return () => {
        isActive = false;
        if (reconnectInterval) clearInterval(reconnectInterval);
        bleManager.stopDeviceScan();
      };
    }, [connectedDevice, savedDevice])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (appState === 'active' && nextAppState.match(/inactive|background/)) {
        await BluetoothService.disconnect();
        setConnectedDevice(null);
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  const startScan = async () => {
    manuallyDisconnected.current = false;
    setDevices([]);

    const btState = await bleManager.state();
    if (btState !== State.PoweredOn) {
      ToastAndroid.show('Bluetooth está desligado!', ToastAndroid.SHORT);
      return;
    }

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error || !device?.name) return;

      const rssi = device.rssi ?? -100;
      setDevices((prev) => {
        const index = prev.findIndex((d) => d.id === device.id);
        if (index === -1) {
          return [...prev, Object.assign(device, { rssi })];
        } else {
          const updated = [...prev];
          updated[index].rssi = rssi;
          return updated;
        }
      });
    });

    setTimeout(() => {
      bleManager.stopDeviceScan();
      ToastAndroid.show('Scan finalizado', ToastAndroid.SHORT);
    }, 10000);
  };

  const connectToDevice = async (device: Device) => {
    if (!savedDevice || device.id !== savedDevice.id) {
      ToastAndroid.show('Apenas o dispositivo salvo pode ser conectado', ToastAndroid.SHORT);
      return;
    }

    if (connectedDevice?.id === device.id) {
      ToastAndroid.show('Dispositivo já conectado', ToastAndroid.SHORT);
      return;
    }

    try {
      const connected = await BluetoothService.connectToDevice(device.id);
      manuallyDisconnected.current = false;
      setConnectedDevice(connected);

      connected.onDisconnected(() => {
        setConnectedDevice(null);
      });

      ToastAndroid.show(`Conectado a ${device.name}`, ToastAndroid.SHORT);
    } catch {
      ToastAndroid.show('Erro ao conectar', ToastAndroid.SHORT);
    }
  };

  const disconnect = async () => {
    manuallyDisconnected.current = true;
    await BluetoothService.disconnect();
    setConnectedDevice(null);
    ToastAndroid.show('Desconectado', ToastAndroid.SHORT);
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Dispositivo Bluetooth</Text>
      </View>

      <View style={styles.box}>
        <TouchableOpacity style={styles.scanButton} onPress={startScan}>
          <Text style={styles.scanButtonText}>Buscar dispositivos</Text>
        </TouchableOpacity>

        {connectedDevice ? (
          <>
            <Text style={styles.connectedText}>
              Conectado a: {connectedDevice.name || connectedDevice.id}
            </Text>
            <TouchableOpacity style={styles.disconnectButton} onPress={disconnect}>
              <Text style={styles.disconnectText}>Desconectar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.noConnectedText}>Nenhum dispositivo conectado</Text>
        )}
      </View>

      <View style={styles.box}>
        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.deviceItem} onPress={() => connectToDevice(item)}>
              <Text style={styles.deviceName}>{item.name || 'Sem nome'}</Text>
              <Text style={styles.deviceId}>{item.id}</Text>
              <Text style={styles.rssiText}>RSSI: {item.rssi} dBm</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.noDevices}>Nenhum dispositivo encontrado</Text>}
        />
      </View>
      <MenuInferior />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  box: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    color: '#9B287B',
  },
  scanButton: {
    backgroundColor: '#9B287B',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
  },
  connectedText: {
    fontFamily: 'Montserrat-Regular',
    color: '#5C164E',
    fontSize: 14,
    marginVertical: 8,
  },
  disconnectButton: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
  },
  disconnectText: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#7E7E7E',
  },
  noConnectedText: {
    fontFamily: 'Montserrat-Regular',
    color: '#999',
    textAlign: 'center',
  },
  deviceItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    paddingVertical: 10,
  },
  deviceName: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#9B287B',
  },
  deviceId: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: '#666',
  },
  rssiText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: '#5C164E',
  },
  noDevices: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  menu_container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '70%',
    paddingVertical: 12,
    backgroundColor: '#9B287B',
    borderRadius: 30,
    marginTop: 10,
  },
});
