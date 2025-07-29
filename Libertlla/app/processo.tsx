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
import { salvarImagemLocal, IMAGEM_PROCESSO_PATH, getUserData } from '../storege'

export default function Processo() {
  const [imagem, setImagem] = useState<ImagePicker.ImagePickerAsset | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [vitimaId, setVitimaId] = useState<number | null>(null)

  useEffect(() => {
    async function carregarTudo() {
      try {
        const usuario = await getUserData()
        if (!usuario?.id) {
          Alert.alert('Erro', 'Usuário não encontrado.')
          return
        }
        setVitimaId(Number(usuario.id))

        const info = await FileSystem.getInfoAsync(IMAGEM_PROCESSO_PATH)
        if (info.exists) {
          setImagem({ uri: IMAGEM_PROCESSO_PATH + '?t=' + Date.now() } as ImagePicker.ImagePickerAsset)
        }
      } catch (error) {
        console.error('[carregarTudo] Erro:', error)
      }
    }
    carregarTudo()
  }, [])

  async function atualizarVitimaComProcesso(vitimaId: number, urlImagem: string) {
    try {
      const response = await fetch(`https://libertlla.onrender.com/vitimas/${vitimaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ processosJudiciais: urlImagem }),
      })

      if (!response.ok) {
        throw new Error('Falha ao atualizar vítima')
      }
    } catch (error) {
      console.error('Erro ao atualizar vítima com processo:', error)
    }
  }

  async function uploadImagemCloudflare(uri: string): Promise<string> {
    const filename = uri.split('/').pop() || 'image.jpg'
    const fileType = filename.split('.').pop() || 'jpg'

    const formData = new FormData()
    formData.append('file', {
      uri,
      name: filename,
      type: `image/${fileType}`,
    } as any)

    const response = await fetch('https://libertlla.onrender.com/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (!response.ok) {
      throw new Error('Upload falhou')
    }

    const data = await response.json()

    return data.fileUrl
  }

  async function selecionarImagem() {
    if (!vitimaId) {
      Alert.alert('Erro', 'ID da vítima não definido.')
      return
    }

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
        const caminhoSalvoLocal = await salvarImagemLocal(imagemSelecionada.uri)
        const urlCloudflare = await uploadImagemCloudflare(imagemSelecionada.uri)

        setImagem({ ...imagemSelecionada, uri: caminhoSalvoLocal + '?t=' + Date.now() })

        await atualizarVitimaComProcesso(vitimaId, urlCloudflare)

        console.log('URL Cloudflare:', urlCloudflare)
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível salvar a imagem localmente e/ou enviar para a nuvem.')
        console.error(error)
      } finally {
        setIsSending(false)
      }
    }
  }

  async function tirarFoto() {
    if (!vitimaId) {
      Alert.alert('Erro', 'ID da vítima não definido.')
      return
    }

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
        const caminhoSalvoLocal = await salvarImagemLocal(imagemTirada.uri)
        const urlCloudflare = await uploadImagemCloudflare(imagemTirada.uri)

        setImagem({ ...imagemTirada, uri: caminhoSalvoLocal + '?t=' + Date.now() })

        await atualizarVitimaComProcesso(vitimaId, urlCloudflare)

        console.log('URL Cloudflare:', urlCloudflare)
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível salvar a imagem localmente e/ou enviar para a nuvem.')
        console.error(error)
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
          <Text style={styles.subtitulo}>
            Envie uma imagem do processo para deixá-la em fácil exibição
          </Text>
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
