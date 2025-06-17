import React from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Tela() {
  const router = useRouter(); // Adicionado aqui

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.linha1}>
          <Text style={styles.textoPressione}>Pressione </Text>
          <Text style={styles.textoBotao}>o botão por</Text>
        </Text>
        <Text style={styles.textoSegundos}>5 segundos</Text>
        <Text style={styles.textoAjuda}>para pedir ajuda</Text>
      </View>

      <View style={styles.box}>
        <View style={styles.circuloMaior}>
          <Pressable style={styles.circuloMenor} onPress={() => console.log('Botão pressionado')}>
            <MaterialCommunityIcons name="alarm-light" size={70} color="#5C164E" />
          </Pressable>
        </View>
      </View>

      <View style={styles.box} />

      <View style={styles.menu_container}>
        <TouchableOpacity onPress={() => console.log('Sirene de emergência')}>
          <MaterialCommunityIcons name="alarm-light" size={30} color="#E9ECEF" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/BLEScanner')}>
          <MaterialCommunityIcons name="bluetooth" size={30} color="#E9ECEF" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log('Perfil')}>
          <MaterialIcons name="account-circle" size={30} color="#E9ECEF" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log('Sair')}>
          <MaterialIcons name="exit-to-app" size={30} color="#E9ECEF" />
        </TouchableOpacity>
      </View>
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
  },
  linha1: {
    fontSize: 18,
    textAlign: 'center',
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
    marginVertical: 4,
    textAlign: 'center',
    color: '#9B287B',
  },
  textoAjuda: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 25,
    textAlign: 'center',
    color: '#9B287B',
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
    width: 125,
    height: 125,
    borderRadius: 62,
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
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "70%",
    paddingVertical: 12,
    backgroundColor: "#9B287B",
    borderRadius: 30,
    marginTop: 40,
  },
});
