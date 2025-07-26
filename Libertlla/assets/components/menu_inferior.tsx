import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const MenuInferior = () => {
  const router = useRouter();

  return (
    <View style={styles.menu_container}>
      <TouchableOpacity onPress={() => router.push('/botaodepanico')}>
        <MaterialCommunityIcons name="alarm-light" size={30} color="#E9ECEF" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/Bluetooth')}>
        <MaterialCommunityIcons name="bluetooth" size={30} color="#E9ECEF" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/processo')}>
        <Ionicons name="document-text-outline" size={30} color="#E9ECEF" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/Usuario')}>
        <MaterialIcons name="account-circle" size={30} color="#E9ECEF" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/horario')}>
        <MaterialCommunityIcons name="clock-time-four-outline" size={30} color="#E9ECEF" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/')}>
        <MaterialIcons name="exit-to-app" size={30} color="#E9ECEF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menu_container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '80%',
    paddingVertical: 12,
    backgroundColor: '#9B287B',
    borderRadius: 30,
    marginTop: 40,
    alignSelf: 'center',
  },
});

export default MenuInferior;
