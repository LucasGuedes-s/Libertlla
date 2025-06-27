import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { saveBluetoothDevice, getBluetoothDevice } from '../storege';

const bleManager = new BleManager();

export default function BluetoothScreen() {
  const [device, setDevice] = useState<{ id: string; name?: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    (async () => {
      const savedDevice = await getBluetoothDevice();
      setDevice(savedDevice);
    })();

    // Cleanup BLE manager on unmount
    return () => {
      bleManager.destroy();
    };
  }, []);

  async function scanAndConnect() {
    setIsScanning(true);

    return new Promise<Device | null>((resolve) => {
      const devicesFound: Device[] = [];

      const subscription = bleManager.onStateChange((state) => {
        if (state === 'PoweredOn') {
          bleManager.startDeviceScan(null, null, (error, scannedDevice) => {
            if (error) {
              Alert.alert('Erro no scan', error.message);
              setIsScanning(false);
              resolve(null);
              return;
            }

            if (scannedDevice && scannedDevice.name && scannedDevice.name.startsWith('PicoBLE')) {
              // Para o scan, conecta e retorna o dispositivo
              bleManager.stopDeviceScan();

              scannedDevice
                .connect()
                .then((connectedDevice) => {
                  return connectedDevice.discoverAllServicesAndCharacteristics();
                })
                .then((connectedDevice) => {
                  setIsScanning(false);
                  resolve(connectedDevice);
                })
                .catch((err) => {
                  Alert.alert('Erro ao conectar', err.message);
                  setIsScanning(false);
                  resolve(null);
                });
            }
          });
          subscription.remove();
        }
      }, true);
    });
  }

  const handleSaveDevice = async () => {
    try {
      const connectedDevice = await scanAndConnect();
      if (!connectedDevice) {
        Alert.alert('Nenhum dispositivo conectado');
        return;
      }

      const deviceToSave = { id: connectedDevice.id, name: connectedDevice.name ?? undefined };
      await saveBluetoothDevice(deviceToSave);
      setDevice(deviceToSave);
      Alert.alert('Dispositivo salvo', `Conectado a ${deviceToSave.name || deviceToSave.id}`);
    } catch (err) {
      const errorMessage =
        typeof err === 'object' && err !== null && 'message' in err
          ? (err as { message?: string }).message
          : undefined;
      Alert.alert('Erro', errorMessage || 'Erro desconhecido');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ marginBottom: 10 }}>
        Dispositivo salvo: {device ? device.name : 'Nenhum'}
      </Text>
      <Button
        title={isScanning ? 'Escaneando...' : 'Escanear e conectar dispositivo'}
        onPress={handleSaveDevice}
        disabled={isScanning}
      />
    </View>
  );
}
