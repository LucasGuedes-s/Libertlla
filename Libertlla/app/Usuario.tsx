import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
// import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { getUserData } from '../storege';
import MenuInferior from '../assets/components/menu_inferior'

export default function Tela() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  const [nomeContato, setNomeContato] = useState('');
  const [telefoneContato, setTelefoneContato] = useState('');
  const [contatos, setContatos] = useState<string[]>([]);

  useEffect(() => {
    getUserData().then((data) => {
      if (data) {
        console.log('Dados do usuário carregados:', data);
        setNome(data.nome);
        setEmail(data.email); 
      }
    });
  }, []);

  // Busca contatos depois que o email for definido
  useEffect(() => {
    if (!email) return;

    axios
      .get(`https://libertlla.onrender.com/vitima/${email}`)
      .then((res) => {
        if (res.data.contatosdeEmergencia) {
          setContatos(res.data.contatosdeEmergencia);
        }
      })
      .catch((err) => {
        console.error('Erro ao buscar contatos:', err);
      });
  }, [email]);

  const adicionarContato = async () => {
    if (!nomeContato.trim() || !telefoneContato.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha o nome e o telefone do contato.');
      return;
    }

    const novoContato = `${nomeContato.trim()} - ${telefoneContato.trim()}`;

    try {
      const response = await axios.put(
        `https://libertlla.onrender.com/vitima/${email}/contato`,
        {
          contato: novoContato,
        }
      );

      setContatos(response.data.contatosdeEmergencia);
      setNomeContato('');
      setTelefoneContato('');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível adicionar contato');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Suas Informações</Text>
        <Text>
          <Text style={styles.label}>Nome: </Text>
          <Text style={styles.value}>{nome}</Text>
        </Text>
        <Text>
          <Text style={styles.label}>Email: </Text>
          <Text style={styles.value}>{email}</Text>
        </Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.title}>Contatos de Emergência</Text>

        <TextInput
          placeholder="Nome do contato"
          placeholderTextColor="#999"
          style={styles.input}
          value={nomeContato}
          onChangeText={setNomeContato}
        />

        <TextInput
          placeholder="Telefone"
          placeholderTextColor="#999"
          style={styles.input}
          keyboardType="phone-pad"
          value={telefoneContato}
          onChangeText={setTelefoneContato}
        />

        <TouchableOpacity style={styles.btn} onPress={adicionarContato}>
          <Text style={styles.btnText}>Adicionar Contato</Text>
        </TouchableOpacity>

        {contatos.map((contato, index) => {
          const [nome, telefone] = contato.split(' - ');

          return (
            <View
              key={index}
              style={[styles.contatoItem, styles.contatoItemRow]}
            >
              <Text style={styles.nomeLabel}>Nome: </Text>
              <Text
                style={styles.nomeValue}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {nome}
              </Text>
              <Text style={styles.telefoneValue}>{telefone}</Text>
            </View>
          );
        })}
      </View>   
      <MenuInferior />  
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  box: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    color: '#9B287B',
    fontSize: 16,
    marginBottom: 10,
  },
  text: {
    color: '#333',
    marginBottom: 5,
  },
  input: {
    fontFamily: 'Montserrat-Regular',
    height: 50,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontFamily: 'Montserrat-Bold',
    color: '#999',
  },
  value: {
    color: '#999',
    fontFamily: 'Montserrat-Regular',
  },
  btn: {
    backgroundColor: '#9B287B',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  btnText: {
    color: '#FFF',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
  },
  contatoItem: {
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEE',
  },
  contatoItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nomeLabel: {
    fontFamily: 'Montserrat-Bold',
    color: '#999',
  },
  nomeValue: {
    fontFamily: 'Montserrat-Regular',
    color: '#999',
    flex: 1,
  },
  telefoneValue: {
    fontFamily: 'Montserrat-Regular',
    color: '#999',
    width: 100,
    textAlign: 'right',
  },
});
