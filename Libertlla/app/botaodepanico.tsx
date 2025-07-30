import React, { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, Pressable, TouchableOpacity, Image, Alert } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import * as Location from 'expo-location';
import BluetoothService from '../assets/services/BluetoothService';
import { getUserData, getToken } from '../storege';
import socket from '../assets/services/socket';
import MenuInferior from '../assets/components/menu_inferior'


export default function Tela() {
  const router = useRouter();
  const [isPressing, setIsPressing] = useState(false);
  const [counter, setCounter] = useState(5);
  const [vitimaId] = useState<number | null>(null);
  const [ultimaNotificacaoId, setUltimaNotificacaoId] = useState<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!vitimaId) return;

    const polling = setInterval(async () => {
      try {
        const res = await axios.get('https://libertlla.onrender.com/notificacoes', {
          params: { vitimaId }
        });

        const notificacoes = res.data;

        if (notificacoes.length > 0) {
          const nova = notificacoes[0];
          if (nova.id !== ultimaNotificacaoId) {
            setUltimaNotificacaoId(nova.id);
            Alert.alert('🔔 Nova notificação', `Endereço: ${nova.endereco}`);
          }
        }
      } catch (err) {
        console.error('Erro no polling:', err);
      }
    }, 10000);

    return () => clearInterval(polling);
  }, [vitimaId, ultimaNotificacaoId]);

  const formatarEndereco = (endereco: Partial<Location.LocationGeocodedAddress>) => {
    const partes = [
      endereco.name,
      endereco.street,
      endereco.district,
      endereco.city,
      endereco.region,
      endereco.postalCode,
      endereco.country,
    ].filter(Boolean);
    return partes.join(', ');
  };

  const enviarNotificacao = async () => {
    console.log("enviarNotificacao: Início");
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Permissão para acessar localização foi negada.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = location.coords;
      const [endereco] = await Location.reverseGeocodeAsync({ latitude, longitude });
      const enderecoFormatado = formatarEndereco(endereco);

      const usuario = await getUserData();
      const token = await getToken();
      console.log(token)
      if (!usuario?.id) {
        Alert.alert("Erro", "Usuário não encontrado.");
        return;
      }

      if (!token) {
        Alert.alert("Erro", "Token de notificação não encontrado.");
        return;
      }
      console.log("aqui")
      if (!socket.connected) {
        console.log("iniciando promise do socket")
        new Promise<void>(resolve => socket.on('connect', () => resolve()));
      }
      socket.emit('entrarNaSalaVitima', usuario.id);
      console.log(`[Socket] Entrou na sala da vítima ${usuario.id}`);

      console.log('Prestes a enviar noticação')
      await axios.post(
        'https://libertlla.onrender.com/notificacao',
        {
          endereco: enderecoFormatado,
          data: new Date().toISOString(),
          vitimaId: usuario.id,
          token: token,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Noticação enviada')
      Alert.alert(
        "✅ Alerta enviado com sucesso!",
        `Endereço: ${enderecoFormatado}\nToken: enviado corretamente\nData: ${new Date().toLocaleString()}\nVitimaId: ${usuario.id}`
      );

    } catch (error) {
      console.error("Erro ao enviar notificação:", error);
      Alert.alert("❌ Erro ao enviar alerta");
    }
  };

  // BLE
  useFocusEffect(
    useCallback(() => {
      let subscription: { remove: () => void } | null = null;

      async function setupNotification() {
        try {
          if (!BluetoothService.connectedDevice) {
            await BluetoothService.reconnectToSavedDevice();
          }

          if (BluetoothService.connectedDevice) {
            const { serviceUUID, characteristicUUID } =
              await BluetoothService.getNotifiableCharacteristicUUIDs();

            subscription = await BluetoothService.startNotification(
              serviceUUID,
              characteristicUUID,
              async (data: string) => {
                console.log("BLE recebeu:", data);
                if (data === "ALERTA") {
                  await enviarNotificacao();
                }
                Alert.alert('Alerta via BLE', `Notificação recebida: ${data}`);
              }
            );
          } else {
            Alert.alert('Bluetooth', 'Nenhum dispositivo BLE conectado');
          }
        } catch (e) {
          console.warn('Erro ao configurar BLE:', e);
        }
      }

      setupNotification();

      return () => {
        if (subscription) {
          subscription.remove();
          subscription = null;
        }
      };
    }, [vitimaId])
  );

  const startCounter = () => {
    setIsPressing(true);
    setCounter(5);

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCounter(prev => {
        if (prev === 1) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
          }
          setIsPressing(false);
          enviarNotificacao();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopCounter = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    setIsPressing(false);
    setCounter(5);
  };

  return (
    <View style={styles.container}>
      <View style={styles.box1}>
        <Text style={styles.linha1}>
          <Text style={styles.textoPressione}>Pressione </Text>
          <Text style={styles.textoBotao}>o botão por</Text>
        </Text>
        <Text style={styles.textoSegundos}>5 segundos</Text>
        <Text style={styles.textoAjuda}>para pedir ajuda</Text>
      </View>

      <View style={styles.box}>
        <View style={styles.circuloMaior}>
          <Pressable
            style={styles.circuloMenor}
            onPressIn={startCounter}
            onPressOut={stopCounter}
          >
            <MaterialCommunityIcons name="alarm-light" size={70} color="#5C164E" />
          </Pressable>
        </View>
      </View>

      <View style={styles.box}>
        {isPressing ? (
          <Text style={styles.contadorTexto}>{counter}</Text>
        ) : (
          <Image
            source={{ uri: 'https://www.sjpmg.org.br/wp-content/uploads/2024/03/protestos-mulheres-tania-rego-agencia-brasil.jpg' }}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />
        )}
      </View>
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
  box1: {
    width: '90%',
    height: 160,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  box: {
    width: '90%',
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    overflow: 'hidden',
  },
  linha1: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 20,
  },
  textoPressione: {
    fontFamily: 'Montserrat-Bold',
    color: '#9B287B',
  },
  textoBotao: {
    fontFamily: 'Montserrat-Regular',
    color: '#9B287B',
  },
  textoSegundos: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: 33,
    marginVertical: 2,
    lineHeight: 40,
    textAlign: 'center',
    color: '#9B287B',
  },
  textoAjuda: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 25,
    textAlign: 'center',
    color: '#9B287B',
    marginVertical: 2,
  },
  circuloMaior: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#F2F2F2',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circuloMenor: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#9B287B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  menu_container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '70%',
    paddingVertical: 12,
    backgroundColor: '#9B287B',
    borderRadius: 30,
    marginTop: 40,
  },
  imagem: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  contadorTexto: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#9B287B',
  },
});
