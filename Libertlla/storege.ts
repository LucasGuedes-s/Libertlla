import * as FileSystem from 'expo-file-system';

// Arquivos de armazenamento
const DEVICE_FILE = FileSystem.documentDirectory + 'bluetoothDevice.json';
const USER_FILE = FileSystem.documentDirectory + 'userData.json';
const TOKEN_FILE = FileSystem.documentDirectory + 'token.txt';

// Tipagem dos dados
export type BluetoothDeviceData = {
  id: string;
  name?: string;
};

export type UserData = {
  id: UserData | null;
  nome: string;
  email: string;
};

/* =================== BLUETOOTH =================== */

export async function saveBluetoothDevice(device: BluetoothDeviceData) {
  try {
    if (!device || !device.id) throw new Error('Dispositivo inválido');

    const json = JSON.stringify(device);
    await FileSystem.writeAsStringAsync(DEVICE_FILE, json);
    console.log('[saveBluetoothDevice] Dispositivo salvo com sucesso.');
  } catch (error) {
    console.error('[saveBluetoothDevice] Erro ao salvar dispositivo:', error);
  }
}

export async function getBluetoothDevice(): Promise<BluetoothDeviceData | null> {
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

export async function removeBluetoothDevice() {
  try {
    await FileSystem.deleteAsync(DEVICE_FILE, { idempotent: true });
    console.log('[removeBluetoothDevice] Dispositivo removido com sucesso.');
  } catch (error) {
    console.error('[removeBluetoothDevice] Erro ao remover dispositivo:', error);
  }
}

/* =================== USUÁRIO =================== */

export async function saveUserData(data: UserData) {
  try {
    console.log('[saveUserData] Salvando dados do usuário:', data);
    if (!data || typeof data !== 'object' || !data.nome || !data.email) {
      throw new Error('Dados de usuário inválidos.');
    }

    const json = JSON.stringify(data);
    await FileSystem.writeAsStringAsync(USER_FILE, json);
    console.log('[saveUserData] Dados do usuário salvos com sucesso.');
  } catch (error) {
    console.error('[saveUserData] Erro ao salvar dados do usuário:', error);
  }
}

export async function getUserData(): Promise<UserData | null> {
  try {
    const exists = await FileSystem.getInfoAsync(USER_FILE);
    if (!exists.exists) {
      console.log('[getUserData] Nenhum arquivo encontrado.');
      return null;
    }

    const json = await FileSystem.readAsStringAsync(USER_FILE);

    const parsed = JSON.parse(json);

    if (parsed && parsed.nome && parsed.email) {
      console.log('[getUserData] Dados do usuário carregados:', parsed);
      return parsed;
    } else {
      console.warn('[getUserData] Objeto inválido:', parsed);
      return null;
    }
  } catch (error) {
    console.error('[getUserData] Erro ao carregar dados do usuário:', error);
    return null;
  }
}

export async function removeUserData() {
  try {
    await FileSystem.deleteAsync(USER_FILE, { idempotent: true });
    console.log('[removeUserData] Dados do usuário removidos com sucesso.');
  } catch (error) {
    console.error('[removeUserData] Erro ao remover dados do usuário:', error);
  }
}

/* =================== TOKEN =================== */

export async function saveToken(token: string) {
  try {
    await FileSystem.writeAsStringAsync(TOKEN_FILE, token);
    console.log('[saveToken] Token salvo com sucesso.');
  } catch (error) {
    console.error('[saveToken] Erro ao salvar token:', error);
  }
}

export async function getToken(): Promise<string | null> {
  try {
    const exists = await FileSystem.getInfoAsync(TOKEN_FILE);
    if (!exists.exists) {
      console.log('[getToken] Nenhum token encontrado.');
      return null;
    }
    const token = await FileSystem.readAsStringAsync(TOKEN_FILE);
    return token;
  } catch (error) {
    console.error('[getToken] Erro ao ler token:', error);
    return null;
  }
}

export async function removeToken() {
  try {
    await FileSystem.deleteAsync(TOKEN_FILE, { idempotent: true });
    console.log('[removeToken] Token removido com sucesso.');
  } catch (error) {
    console.error('[removeToken] Erro ao remover token:', error);
  }
}