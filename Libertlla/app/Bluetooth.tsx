import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { saveBluetoothDevice, getBluetoothDevice } from '../storege';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons'; // Adicionado
import { useRouter } from 'expo-router'; // Adicionado

const bleManager = new BleManager();

export default function BluetoothScreen() {
  const [device, setDevice] = useState<{ id: string; name?: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const router = useRouter(); // Adicionado

  useEffect(() => {
    (async () => {
      const savedDevice = await getBluetoothDevice();
      setDevice(savedDevice);
    })();

    return () => {
      bleManager.destroy();
    };
  }, []);

  async function scanAndConnect() {
    setIsScanning(true);

    return new Promise<Device | null>((resolve) => {
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
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.label}>Dispositivo salvo:</Text>
        <Text style={styles.deviceName}>{device ? device.name || device.id : 'Nenhum'}</Text>
      </View>

      <View style={styles.box}>
        <TouchableOpacity
          style={[styles.button, isScanning && styles.buttonDisabled]}
          onPress={handleSaveDevice}
          disabled={isScanning}
        >
          <Text style={styles.buttonText}>
            {isScanning ? 'Escaneando...' : 'Escanear e conectar'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Menu aqui */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  box: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    marginVertical: 10,
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
    flexDirection: 'row',
    backgroundColor: '#9B287B',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    gap: 10,
  },
  buttonDisabled: {
    backgroundColor: '#D98AB7',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
  },
  menu_container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '70%',
    paddingVertical: 12,
    backgroundColor: '#9B287B',
    borderRadius: 30,
    marginTop: 40,
  },
});
