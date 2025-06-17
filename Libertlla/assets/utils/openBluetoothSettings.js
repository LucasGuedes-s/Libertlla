import * as IntentLauncher from 'expo-intent-launcher';
import { Platform, Linking, Alert } from 'react-native';

export const openBluetoothSettings = () => {
  if (Platform.OS === 'android') {
    IntentLauncher.startActivityAsync(
      IntentLauncher.ActivityAction.BLUETOOTH_SETTINGS
    );
  } else {
    Alert.alert('Aviso', 'Abrir as configurações de Bluetooth não é suportado no iOS.');
  }
};
