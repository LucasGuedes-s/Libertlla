// BluetoothService.ts
import { BleManager, Device } from 'react-native-ble-plx';
import { saveBluetoothDevice, getBluetoothDevice } from '../../storege'; // Ajuste o caminho conforme necessário

class BluetoothService {
  private static instance: BluetoothService;
  private manager: BleManager;
  public connectedDevice: Device | null = null;

  private constructor() {
    this.manager = new BleManager();
  }

  public static getInstance(): BluetoothService {
    if (!BluetoothService.instance) {
      BluetoothService.instance = new BluetoothService();
    }
    return BluetoothService.instance;
  }

  // Conectar a um dispositivo e salvar no storage
  async connectToDevice(device: Device) {
    try {
      const connectedDevice = await device.connect();
      await connectedDevice.discoverAllServicesAndCharacteristics();
      this.connectedDevice = connectedDevice;

      // Salvar dispositivo no banco
      await saveBluetoothDevice({ id: device.id, name: device.name ?? undefined });

      return connectedDevice;
    } catch (error) {
      throw error;
    }
  }

  // Tentar reconectar ao dispositivo salvo
  async reconnectToSavedDevice() {
    const savedDevice = await getBluetoothDevice();
    if (!savedDevice) return null;

    try {
      const device = await this.manager.connectToDevice(savedDevice.id);
      await device.discoverAllServicesAndCharacteristics();
      this.connectedDevice = device;
      return device;
    } catch {
      return null;
    }
  }

  disconnect() {
    if (this.connectedDevice) {
      this.connectedDevice.cancelConnection();
      this.connectedDevice = null;
    }
  }

  getManager() {
    return this.manager;
  }
}

export default BluetoothService.getInstance();
