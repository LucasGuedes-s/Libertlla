import { BleManager } from 'react-native-ble-plx';
import { getBluetoothDevice } from '../../storege';
import { router } from 'expo-router';

const bleManager = new BleManager();

export async function verifyOrConnectBluetooth() {
  const state = await bleManager.state();
  if (state !== 'PoweredOn') {
    console.log('[BLE] Bluetooth desligado');
    router.replace('/Bluetooth');
    return;
  }

  const savedDevice = await getBluetoothDevice();
  if (!savedDevice) {
    console.log('[BLE] Nenhum dispositivo salvo');
    router.replace('/Bluetooth');
    return;
  }

  try {
    const [device] = await bleManager.devices([savedDevice.id]);
    if (device) {
      const isConnected = await device.isConnected();
      if (isConnected) {
        console.log('[BLE] Já conectado');
        return;
      }
    }

    console.log('[BLE] Não conectado, redirecionando...');
    router.replace('/Bluetooth');
  } catch (err) {
    console.error('[BLE] Erro na verificação:', err);
    router.replace('/Bluetooth');
  }
}
