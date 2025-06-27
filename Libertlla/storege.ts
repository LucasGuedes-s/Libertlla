// services/StorageService.ts
import * as FileSystem from 'expo-file-system';

const DEVICE_FILE = FileSystem.documentDirectory + 'bluetoothDevice.json';

export async function saveBluetoothDevice(device: { id: string; name?: string }) {
  try {
    const json = JSON.stringify(device);
    await FileSystem.writeAsStringAsync(DEVICE_FILE, json);
    console.log('[saveBluetoothDevice] Dispositivo salvo com sucesso.');
  } catch (error) {
    console.error('[saveBluetoothDevice] Erro ao salvar dispositivo:', error);
  }
}

export async function getBluetoothDevice(): Promise<{ id: string; name?: string } | null> {
  try {
    const exists = await FileSystem.getInfoAsync(DEVICE_FILE);
    if (!exists.exists) {
      console.log('[getBluetoothDevice] Nenhum arquivo encontrado.');
      return null;
    }

    const json = await FileSystem.readAsStringAsync(DEVICE_FILE);
    const parsed = JSON.parse(json);

    if (parsed && typeof parsed === 'object' && parsed.id) {
      console.log('[getBluetoothDevice] Dispositivo carregado:', parsed);
      return parsed;
    } else {
      console.warn('[getBluetoothDevice] Objeto inválido:', parsed);
      return null;
    }
  } catch (error) {
    console.error('[getBluetoothDevice] Erro ao carregar dispositivo:', error);
    return null;
  }
}