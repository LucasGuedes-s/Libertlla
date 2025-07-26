import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MenuInferior from '../assets/components/menu_inferior';

export default function Processo() {
  const [imagem, setImagem] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const idVitima = 1;

  async function enviarImagem(imagemSelecionada) {
    setIsSending(true);

    const formData = new FormData();
    formData.append('idVitima', idVitima.toString());
    formData.append('processoImagem', {
      uri: imagemSelecionada.uri,
      name: 'processo.jpg',
      type: 'image/jpeg',
    });

    try {
      const res = await fetch('https://libertlla.onrender.com/enviar-processo', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setIsSending(false);

      if (res.ok) {
        Alert.alert('Sucesso', 'Imagem enviada com sucesso!');
        setImagem(null);
      } else {
        Alert.alert('Erro', 'Erro ao enviar a imagem.');
      }
    } catch (err) {
      console.error(err);
      setIsSending(false);
      Alert.alert('Erro', 'Falha de conexão.');
    }
  }

  async function selecionarImagem() {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'Permita acesso à galeria.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });

    if (!pickerResult.canceled) {
      setImagem(pickerResult.assets[0]);
      await enviarImagem(pickerResult.assets[0]);
    }
  }

  async function tirarFoto() {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'Permita acesso à câmera.');
      return;
    }

    const cameraResult = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: true,
    });

    if (!cameraResult.canceled) {
      setImagem(cameraResult.assets[0]);
      await enviarImagem(cameraResult.assets[0]);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enviar Processo Judicial</Text>

      {imagem && (
        <Image
          source={{ uri: imagem.uri }}
          style={styles.preview}
          resizeMode="contain"
        />
      )}

      <View style={styles.botaoContainer}>
        <Button title="Selecionar Imagem" onPress={selecionarImagem} disabled={isSending} />
        <View style={{ height: 10 }} />
        <Button title="Tirar Foto" onPress={tirarFoto} disabled={isSending} />
      </View>

      {isSending && <ActivityIndicator size="large" color="#9B287B" />}

      <MenuInferior />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 80,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Montserrat',
    color: '#9B287B',
    fontWeight: '900',
    marginBottom: 20,
    textAlign: 'center',
  },
  preview: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 8,
  },
  botaoContainer: {
    marginBottom: 10,
  },
});
