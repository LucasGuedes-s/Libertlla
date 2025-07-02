// BluetoothService.ts
import { BleManager, Device } from 'react-native-ble-plx';
import { saveBluetoothDevice, getBluetoothDevice } from '../../storege'; 
import { Buffer } from 'buffer';

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

  // Conectar a um dispositivo pelo deviceId e salvar no storage
  async connectToDevice(deviceId: string) {
    try {
      const device = await this.manager.connectToDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();
      this.connectedDevice = device;

      // Salvar dispositivo no banco
      await saveBluetoothDevice({ id: device.id, name: device.name ?? undefined });

      return device;
    } catch (error) {
      throw error;
    }
  }

  // Tentar reconectar ao dispositivo salvo
  async reconnectToSavedDevice() {
    console.log("Cheguei aqui");
    const savedDevice = await getBluetoothDevice();
    console.log("Dispositivo salvo:", savedDevice);

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

  // Escutar notificações BLE (monitorar characteristic)
  async startNotification(
    serviceUUID: string,
    characteristicUUID: string,
    onData: (data: string) => void
  ) {
    if (!this.connectedDevice) {
      throw new Error("Nenhum dispositivo conectado");
    }

    const subscription = this.connectedDevice.monitorCharacteristicForService(
      serviceUUID,
      characteristicUUID,
      (error, characteristic) => {
        if (error) {
          console.error("Erro ao monitorar characteristic:", error);
          return;
        }

        if (characteristic?.value) {
          // characteristic.value vem em base64
          const decoded = Buffer.from(characteristic.value, 'base64').toString('utf-8');
          console.log("Notificação recebida:", decoded);
          onData(decoded);
        }
      }
    );

    return subscription;
  }
}

export default BluetoothService.getInstance();
