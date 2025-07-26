import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import BluetoothService from '../assets/services/BluetoothService';
import { Buffer } from 'buffer';
import MenuInferior from '../assets/components/menu_inferior'


global.Buffer = global.Buffer || Buffer;

export default function TelaConfiguracaoHoras() {
  const router = useRouter();

  const [horaAtual, setHoraAtual] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const intervalo = setInterval(() => {
      setHoraAtual(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  function formatarHora(date: Date) {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  async function enviarHoraBluetooth() {
    try {
      if (!BluetoothService.connectedDevice) {
        Alert.alert('Bluetooth não conectado', 'Conecte o dispositivo antes de enviar a hora.');
        return;
      }

      const agora = new Date();
      const horaFormatada = formatarHora(agora);
      const mensagem = horaFormatada;

      const { serviceUUID, characteristicUUID } = await BluetoothService.getNotifiableCharacteristicUUIDs();

      const mensagemBase64 = Buffer.from(mensagem).toString('base64');

      await BluetoothService.connectedDevice.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        mensagemBase64
      );

      Alert.alert('Hora enviada', `Hora ${horaFormatada} enviada para a placa.`);
    } catch (error: unknown) {
      Alert.alert(
        'Erro',
        `Não foi possível enviar a hora: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.boxTitulo}>
        <Text style={styles.titulo}>Configurar Hora</Text>
        <Text style={styles.subtitulo}>Sincronize com a hora atual</Text>
      </View>

      <View style={styles.boxHora}>
        <Text style={styles.horaTexto}>{horaAtual}</Text>
        <Text style={styles.horaLegenda}>Hora atual do dispositivo</Text>
      </View>

      <TouchableOpacity style={styles.botaoConectar} onPress={enviarHoraBluetooth}>
        <Text style={styles.textoBotao}>Enviar para a Placa</Text>
      </TouchableOpacity>

      <MenuInferior />  

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  boxTitulo: {
    marginBottom: 30,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 28,
    fontFamily: 'Montserrat-Bold',
    color: '#9B287B',
  },
  subtitulo: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#9B287B',
    marginTop: 6,
  },
  boxHora: {
    width: '90%',
    height: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  horaTexto: {
    fontSize: 50,
    fontFamily: 'Montserrat-Bold',
    color: '#5C164E',
  },
  horaLegenda: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#9B287B',
    marginTop: 6,
  },
  botaoConectar: {
    backgroundColor: '#9B287B',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 2,
    marginBottom: 40,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },
});
