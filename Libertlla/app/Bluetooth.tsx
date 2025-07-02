import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { saveBluetoothDevice, getBluetoothDevice } from '../storege';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function BluetoothScreen() {
  const bleManager = useRef(new BleManager()).current;
  const [savedDevice, setSavedDevice] = useState<{ id: string; name?: string } | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scanTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const storedDevice = await getBluetoothDevice();
      setSavedDevice(storedDevice);
    })();

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      ToastAndroid.show('Você não pode voltar agora', ToastAndroid.SHORT);
      return true;
    });

    const subscription = bleManager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        Alert.alert('Bluetooth ligado', 'O Bluetooth foi ativado. Iniciando escaneamento...');
        startScan();
      }
      if (state === 'PoweredOff') {
        if (connectedDevice) {
          setConnectedDevice(null);
        }

        Alert.alert(
          'Bluetooth desligado',
          connectedDevice
            ? 'O dispositivo foi desconectado porque o Bluetooth foi desativado.'
            : 'O Bluetooth do aparelho foi desligado.'
        );
      }
    }, true);

    return () => {
      if (scanTimeout.current) clearTimeout(scanTimeout.current);
      bleManager.stopDeviceScan();
      bleManager.destroy();
      backHandler.remove();
    };
  }, []);
  
  const startScan = () => {
    setIsScanning(true);
    setDevices([]);
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Erro ao escanear:', error);
        setIsScanning(false);
        return;
      }

      if (device && (device.name || device.localName)) {
        setDevices((prev) => {
          const exists = prev.some((d) => d.id === device.id);
          return exists ? prev : [...prev, device];
        });
      }
    });

    scanTimeout.current = setTimeout(() => {
      bleManager.stopDeviceScan();
      setIsScanning(false);
    }, 10000);
  };

  const connectAndSaveDevice = async (device: Device) => {
    try {
      const connected = await bleManager.connectToDevice(device.id, { timeout: 5000 });
      await connected.discoverAllServicesAndCharacteristics();
      setConnectedDevice(connected);

      const deviceToSave = { id: connected.id, name: connected.name ?? undefined };
      await saveBluetoothDevice(deviceToSave);
      setSavedDevice(deviceToSave);

      Alert.alert('Dispositivo salvo', `Conectado a ${deviceToSave.name || deviceToSave.id}`);
    } catch (err) {
      Alert.alert('Erro ao conectar', err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  const disconnectDevice = async () => {
    if (connectedDevice) {
      try {
        await bleManager.cancelDeviceConnection(connectedDevice.id);
        setConnectedDevice(null);
      } catch (error) {
        Alert.alert('Erro ao desconectar', 'Tente novamente.');
      }
    }
  };

  const renderDeviceItem = ({ item }: { item: Device }) => {
    const isConnected = connectedDevice?.id === item.id;
    return (
      <TouchableOpacity
        onPress={() => (isConnected ? disconnectDevice() : connectAndSaveDevice(item))}
        style={[styles.deviceItem, isConnected && styles.deviceItemConnected]}
      >
        <Text style={styles.deviceText}>
          {item.name || item.localName || 'Dispositivo sem nome'} - {item.id}
        </Text>
        {isConnected && <Text style={styles.connectedText}>✅ Conectado</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.label}>Dispositivo salvo:</Text>
        <Text style={styles.deviceName}>
          {savedDevice ? savedDevice.name || savedDevice.id : 'Nenhum'}
        </Text>
      </View>

      <View style={styles.box}>
        <TouchableOpacity
          style={[styles.button, isScanning && styles.buttonDisabled]}
          onPress={startScan}
          disabled={isScanning}
        >
          <Text style={styles.buttonText}>
            {isScanning ? 'Escaneando...' : 'Escanear dispositivos'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.box}>
        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          renderItem={renderDeviceItem}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      {connectedDevice && (
        <View style={styles.box}>
          <Text style={styles.connectedInfo}>
            Conectado a: {connectedDevice.name || connectedDevice.id}
          </Text>
          <TouchableOpacity onPress={disconnectDevice} style={styles.disconnectButton}>
            <Text style={styles.disconnectText}>Desconectar</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.menu_container}>
        <TouchableOpacity onPress={() => router.push('/botaodepanico')}>
          <MaterialCommunityIcons name="alarm-light" size={30} color="#E9ECEF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/Bluetooth')}>
          <MaterialCommunityIcons name="bluetooth" size={30} color="#E9ECEF" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="account-circle" size={30} color="#E9ECEF" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="exit-to-app" size={30} color="#E9ECEF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', padding: 16 },
  box: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: '#9B287B',
    marginBottom: 8,
  },
  deviceName: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#5C164E',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#9B287B',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: '#D98AB7',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
  },
  deviceItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    backgroundColor: '#F9F9F9',
    borderRadius: 6,
    marginBottom: 8,
    width: '100%',
  },
  deviceItemConnected: {
    backgroundColor: '#d4edda',
  },
  deviceText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#333',
  },
  connectedText: {
    fontSize: 13,
    fontFamily: 'Montserrat-Bold',
    color: 'green',
    marginTop: 4,
  },
  connectedInfo: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  disconnectButton: {
    backgroundColor: '#f8d7da',
    padding: 10,
    borderRadius: 5,
  },
  disconnectText: {
    fontFamily: 'Montserrat-Bold',
    color: '#721c24',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 16,
    width: '100%',
  },
  menu_container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '70%',
    paddingVertical: 12,
    backgroundColor: '#9B287B',
    borderRadius: 30,
    marginTop: 20,
  },
});
