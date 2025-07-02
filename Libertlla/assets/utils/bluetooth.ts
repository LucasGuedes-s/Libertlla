import BluetoothService from '../services/BluetoothService';
import { router } from 'expo-router';

export async function verifyOrConnectBluetooth() {
  const manager = BluetoothService.getManager();

  try {
    const state = await manager.state();
    console.log('[BLE] Estado do Bluetooth:', state);

    if (state !== 'PoweredOn') {
      router.replace('/Bluetooth');
      return;
    }

    const device = await BluetoothService.reconnectToSavedDevice();

    if (device && await device.isConnected()) {
      console.log('[BLE] Reconectado com sucesso:', device.name);
      return;
    }

    console.log('[BLE] Não foi possível reconectar');
    router.replace('/Bluetooth');
  } catch (err) {
    console.log('[BLE] Erro:', err);
    //router.replace('/Bluetooth');
  }
}
