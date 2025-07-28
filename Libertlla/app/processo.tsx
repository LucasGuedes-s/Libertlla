import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import MenuInferior from '../assets/components/menu_inferior'
import { salvarImagemLocal, IMAGEM_PROCESSO_PATH } from '../storege'

export default function Processo() {
  const [imagem, setImagem] = useState<ImagePicker.ImagePickerAsset | null>(null)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    async function carregarImagemSalva() {
      try {
        const info = await FileSystem.getInfoAsync(IMAGEM_PROCESSO_PATH)
        if (info.exists) {
          setImagem({ uri: IMAGEM_PROCESSO_PATH + '?t=' + Date.now() } as ImagePicker.ImagePickerAsset)
        }
      } catch (error) {
        console.error('[carregarImagemSalva] Erro:', error)
      }
    }
    carregarImagemSalva()
  }, [])

  async function selecionarImagem() {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'Permita acesso à galeria.')
      return
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'] as const,
      quality: 0.7,
      allowsEditing: false,
    })

    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      const imagemSelecionada = pickerResult.assets[0]

      setIsSending(true)
      try {
        const caminhoSalvo = await salvarImagemLocal(imagemSelecionada.uri)
        setImagem({ ...imagemSelecionada, uri: caminhoSalvo + '?t=' + Date.now() })
      } catch {
        Alert.alert('Erro', 'Não foi possível salvar a imagem localmente.')
      } finally {
        setIsSending(false)
      }
    }
  }

  async function tirarFoto() {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'Permita acesso à câmera.')
      return
    }

    const cameraResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'] as const,
      quality: 0.7,
      allowsEditing: false,
    })

    if (!cameraResult.canceled && cameraResult.assets.length > 0) {
      const imagemTirada = cameraResult.assets[0]

      setIsSending(true)
      try {
        const caminhoSalvo = await salvarImagemLocal(imagemTirada.uri)
        setImagem({ ...imagemTirada, uri: caminhoSalvo + '?t=' + Date.now() })
      } catch {
        Alert.alert('Erro', 'Não foi possível salvar a imagem localmente.')
      } finally {
        setIsSending(false)
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.boxTitulo}>
          <Text style={styles.titulo}>Enviar Processo Judicial</Text>
          <Text style={styles.subtitulo}>Envie uma imagem do processo deixá-la em fácil exibição</Text>
        </View>

        <View style={styles.boxImagem}>
          {imagem?.uri ? (
            <Image source={{ uri: imagem.uri }} style={styles.preview} resizeMode="contain" />
          ) : (
            <Text style={styles.placeholderTexto}>Nenhuma imagem selecionada</Text>
          )}
        </View>

        <View style={styles.botoesContainer}>
          <TouchableOpacity
            style={[styles.botao, isSending && styles.botaoDisabled]}
            onPress={selecionarImagem}
            disabled={isSending}
          >
            <Text style={styles.textoBotao}>Selecionar Imagem</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botao, isSending && styles.botaoDisabled]}
            onPress={tirarFoto}
            disabled={isSending}
          >
            <Text style={styles.textoBotao}>Tirar Foto</Text>
          </TouchableOpacity>
        </View>

        {isSending && <ActivityIndicator size="large" color="#9B287B" style={{ marginTop: 10 }} />}
      </View>

      <MenuInferior />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  boxTitulo: {
    marginBottom: 20,
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
    textAlign: 'center',
  },
  boxImagem: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    overflow: 'hidden',
    padding: 10,
  },
  preview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  placeholderTexto: {
    color: '#9B287B',
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    gap: 15,
  },
  botao: {
    backgroundColor: '#9B287B',
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    elevation: 2,
  },
  botaoDisabled: {
    backgroundColor: '#c08aca',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },
})
