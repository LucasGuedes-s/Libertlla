import BluetoothService from '../services/BluetoothService';
import { router } from 'expo-router';

export async function verifyOrConnectBluetooth() {
  const bleManager = BluetoothService.getManager();
  const state = await bleManager.state();
  console.log('[BLE] Estado atual do Bluetooth:', state);

  if (state !== 'PoweredOn') {
    console.log('[BLE] Bluetooth desligado');
    router.replace('/Bluetooth');
    return;
  }

  try {
    const device = await BluetoothService.reconnectToSavedDevice();
    console.log(device)
    if (device) {
      const isConnected = await device.isConnected();
      if (isConnected) {
        console.log('[BLE] Reconectado com sucesso ao dispositivo salvo:', device.name);
        return;
      }
    }

    console.log('[BLE] Não foi possível reconectar ao dispositivo salvo.');
    router.replace('/Bluetooth');
  } catch (error) {
    console.error('[BLE] Erro ao tentar reconectar:', error);
    router.replace('/Bluetooth');
  }
}
