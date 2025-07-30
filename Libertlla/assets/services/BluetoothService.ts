import { BleManager, Device, Characteristic } from 'react-native-ble-plx';
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

  async connectToDevice(deviceId: string) {
    try {
      const device = await this.manager.connectToDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();
      this.connectedDevice = device;

      await saveBluetoothDevice({ id: device.id, name: device.name ?? undefined });

      return device;
    } catch (error) {
      throw error;
    }
  }

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
          console.log("Erro ao monitorar characteristic:", error);
          return;
        }

        if (characteristic?.value) {
          const decoded = Buffer.from(characteristic.value, 'base64').toString('utf-8');
          console.log("Notificação recebida:", decoded);
          onData(decoded);
        }
      }
    );

    return subscription;
  }

  // Buscar automaticamente a primeira characteristic UUID
  async getNotifiableCharacteristicUUIDs(): Promise<{
    serviceUUID: string;
    characteristicUUID: string;
  }> {
    if (!this.connectedDevice) {
      throw new Error("Nenhum dispositivo conectado");
    }

    const services = await this.connectedDevice.services();
    for (const service of services) {
      const characteristics = await this.connectedDevice.characteristicsForService(service.uuid);

      for (const char of characteristics) {
        if (char.isNotifiable) {
          console.log("UUIDs encontrados:", {
            serviceUUID: service.uuid,
            characteristicUUID: char.uuid,
          });
          return {
            serviceUUID: service.uuid,
            characteristicUUID: char.uuid,
          };
        }
      }
    }

    throw new Error("Nenhuma characteristic com suporte a notificações encontrada.");
  }
}

export default BluetoothService.getInstance();
