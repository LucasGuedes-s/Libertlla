import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
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

    scanTimeout.current = setTimeout(() => {
      console.log('Tempo de scan esgotado. Parando...');
      manager.stopDeviceScan();
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
        onPress={() => isConnected ? disconnectDevice() : connectToDevice(item)}
        style={[
          styles.deviceItem,
          isConnected && styles.deviceItemConnected,
        ]}
      >
        <Text style={styles.deviceText}>
          {item.name || 'Dispositivo desconhecido'} - {item.id}
        </Text>
        {isConnected && <Text style={styles.connectedText}>✅ Conectado</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Dispositivos BLE encontrados</Text>
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
            Dispositivo conectado: {connectedDevice.name || connectedDevice.id}
          </Text>
          <TouchableOpacity
            onPress={disconnectDevice}
            style={styles.disconnectButton}
          >
            <Text style={styles.disconnectText}>Desconectar</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    padding: 16,
  },
  box: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    color: '#9B287B',
  },
  deviceItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    backgroundColor: '#F9F9F9',
    borderRadius: 6,
    marginBottom: 8,
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
  },
});
