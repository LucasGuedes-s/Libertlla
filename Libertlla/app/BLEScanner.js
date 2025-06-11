import React, { useEffect, useState } from 'react';
import { View, Text, Button, PermissionsAndroid, Platform, Alert, FlatList } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager();

const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    const permissions = [];

    if (Platform.Version >= 31) {
      permissions.push(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
    } else {
      permissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    }

    const granted = await PermissionsAndroid.requestMultiple(permissions);

    const allGranted = Object.values(granted).every(value => value === PermissionsAndroid.RESULTS.GRANTED);
    return allGranted;
  }
  return true;
};

export default function BLEScanner() {
  const [devices, setDevices] = useState([]);

  const enableBluetooth = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permissões necessárias para usar o Bluetooth.');
      return;
    }

    try {
      await manager.enable(); // Solicita ativar o Bluetooth
      Alert.alert('Bluetooth foi ativado');
    } catch (error) {
      Alert.alert('Erro ao ativar o Bluetooth', error?.message || '');
    }
  };

  const scanForDevices = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permissões não concedidas.');
      return;
    }

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.warn(error);
        Alert.alert('Erro ao escanear dispositivos', error.message);
        return;
      }

      if (device && device.name) {
        setDevices((prev) => {
          if (!prev.find((d) => d.id === device.id)) {
            return [...prev, device];
          }
          return prev;
        });
      }
    });

    // Para de escanear após 10 segundos
    setTimeout(() => {
      manager.stopDeviceScan();
      Alert.alert('Escaneamento finalizado');
    }, 10000);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Verificar Bluetooth" onPress={enableBluetooth} />
      <View style={{ height: 10 }} />
      <Button title="Escanear dispositivos BLE" onPress={scanForDevices} />
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={{ marginTop: 10 }}>{item.name} ({item.id})</Text>
        )}
      />
    </View>
  );
}
