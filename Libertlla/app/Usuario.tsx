import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Tela() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Suas Informações</Text>
        <Text>
          <Text style={styles.label}>Nome: </Text>
          <Text style={styles.value}>Maria da Silva</Text>
        </Text>
        <Text>
          <Text style={styles.label}>Email: </Text>
          <Text style={styles.value}>mariadasilva@gmail.com</Text>
        </Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.title}>Contatos de Emergência</Text>

        <TextInput
          placeholder="Nome do contato"
          placeholderTextColor="#999"
          style={styles.input}
        />

        <TextInput
          placeholder="Telefone"
          placeholderTextColor="#999"
          style={styles.input}
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Adicionar Contato</Text>
        </TouchableOpacity>

            <View style={[styles.contatoItem, styles.contatoItemRow]}>
              <Text style={styles.nomeLabel}>Nome: </Text>
              <Text style={styles.nomeValue} numberOfLines={1} ellipsizeMode="tail"> Lucas</Text>
              <Text style={styles.telefoneValue}> 84 99999999</Text>
            </View>
      </View>

      <View style={styles.menu_container}>
        <TouchableOpacity onPress={() => router.push('/botaodepanico')}>
          <MaterialCommunityIcons name="alarm-light" size={30} color="#E9ECEF" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/Bluetooth')}>
          <MaterialCommunityIcons name="bluetooth" size={30} color="#E9ECEF" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/Usuario')}>
          <MaterialIcons name="account-circle" size={30} color="#E9ECEF" />
        </TouchableOpacity>

        <TouchableOpacity>
          <MaterialIcons name="exit-to-app" size={30} color="#E9ECEF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
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
});
