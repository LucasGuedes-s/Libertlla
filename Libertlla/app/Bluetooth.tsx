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
import { getBluetoothDevice, saveBluetoothDevice, BluetoothDeviceData } from '../storege';
import MenuInferior from '../assets/components/menu_inferior';

const bleManager = BluetoothService.getManager();
type DeviceWithRSSI = Device & { rssi: number };

export default function BluetoothScreen() {
  const [devices, setDevices] = useState<DeviceWithRSSI[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [savedDevice, setSavedDevice] = useState<BluetoothDeviceData | null>(null);
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const manuallyDisconnected = useRef(false);

  useEffect(() => {
  const requestPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
      }
    } catch (err) {
      console.error('Erro ao solicitar permissões:', err);
    }
  };

  requestPermissions();

  return () => {
    try {
      bleManager.stopDeviceScan();
    } catch (err) {
      console.error('Erro ao parar scan:', err);
    }
  };
}, []);

useEffect(() => {
  const loadSavedDevice = async () => {
    try {
      const saved = await getBluetoothDevice();
      if (saved) setSavedDevice(saved);
    } catch (err) {
      console.error('Erro ao carregar dispositivo salvo:', err);
    }
  };
  loadSavedDevice();
}, []);

useFocusEffect(
  useCallback(() => {
    let isActive = true;
    let reconnectInterval: number | null = null;

    const syncConnectedDevice = async () => {
      try {
        if (BluetoothService.connectedDevice) {
          const isStillConnected = await BluetoothService.connectedDevice.isConnected();
          if (isStillConnected) {
            setConnectedDevice(BluetoothService.connectedDevice);
            return true;
          }
        }
      } catch (err) {
        console.error('Erro ao sincronizar conexão:', err);
      }
      return false;
    };

    const tryReconnect = async () => {
      try {
        if (!isActive || connectedDevice || manuallyDisconnected.current || !savedDevice) return;

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

                // ✅ iniciar monitoramento com segurança
                await BluetoothService.initializeNotifications((data) => {
                  console.log('Dado recebido (auto reconexão):', data);
                });

                reconnected.onDisconnected(() => {
                  setConnectedDevice(null);
                });

                if (reconnectInterval) clearInterval(reconnectInterval);

                reconnected.onDisconnected(() => {
                  setConnectedDevice(null);
                });

                if (reconnectInterval) clearInterval(reconnectInterval);
              }
            } catch (err) {
              console.error('Falha ao reconectar:', err);
            }
          }
        });
      } catch (err) {
        console.error('Erro no processo de reconexão:', err);
      }
    };

    const initialize = async () => {
      try {
        const synced = await syncConnectedDevice();
        if (!synced) tryReconnect();
        reconnectInterval = setInterval(tryReconnect, 5000);
      } catch (err) {
        console.error('Erro na inicialização:', err);
      }
    };

    initialize();

    return () => {
      isActive = false;
      if (reconnectInterval) clearInterval(reconnectInterval);
      bleManager.stopDeviceScan();
    };
  }, [connectedDevice, savedDevice])
);

useEffect(() => {
  const subscription = AppState.addEventListener('change', async (nextAppState) => {
    try {
      if (appState === 'active' && nextAppState.match(/inactive|background/)) {
        await BluetoothService.disconnect();
        setConnectedDevice(null);
      }
      setAppState(nextAppState);
    } catch (err) {
      console.error('Erro ao lidar com mudança de estado do app:', err);
    }
  });

  return () => {
    subscription.remove();
  };
}, [appState]);

const startScan = async () => {
  try {
    manuallyDisconnected.current = false;
    setDevices([]);

    const btState = await bleManager.state();
    if (btState !== State.PoweredOn) {
      ToastAndroid.show('Bluetooth está desligado!', ToastAndroid.SHORT);
      return;
    }

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error || !device?.name) return;
      if (connectedDevice && device.id === connectedDevice.id) return;

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
  } catch (err) {
    console.error('Erro ao iniciar scan:', err);
  }
};

const connectToDevice = async (device: Device) => {
  try {
    if (connectedDevice?.id === device.id) {
      ToastAndroid.show('Dispositivo já conectado', ToastAndroid.SHORT);
      return;
    }

    const connected = await BluetoothService.connectToDevice(device.id);
    manuallyDisconnected.current = false;
    await BluetoothService.initializeNotifications((data) => {
      console.log('Dado recebido (manual):', data);
    });

    await saveBluetoothDevice({ id: connected.id, name: connected.name ?? undefined });
    setSavedDevice({ id: connected.id, name: connected.name ?? undefined });

    connected.onDisconnected(() => {
      setConnectedDevice(null);
    });

    ToastAndroid.show(`Conectado a ${device.name}`, ToastAndroid.SHORT);
  } catch (err) {
    console.error('Erro ao conectar ao dispositivo:', err);
    ToastAndroid.show('Erro ao conectar', ToastAndroid.SHORT);
  }
};

const disconnect = async () => {
  try {
    manuallyDisconnected.current = true;
    await BluetoothService.disconnect();
    setConnectedDevice(null);
    ToastAndroid.show('Desconectado', ToastAndroid.SHORT);
  } catch (err) {
    console.error('Erro ao desconectar:', err);
  }
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
          // ** FILTRO EXTRA no momento da renderização, só por garantia **
          data={devices.filter(d => connectedDevice ? d.id !== connectedDevice.id : true)}
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
    backgroundColor: '#FFFFFF' 
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
});
