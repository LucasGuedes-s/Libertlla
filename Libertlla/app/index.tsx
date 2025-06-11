import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
// import BLEScanner from "../app/BLEScanner";

export default function Index() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: "https://i.scdn.co/image/ab6761610000e5eb9e528993a2820267b97f6aae" }}
        style={styles.imageSection}
        imageStyle={{ resizeMode: "cover", opacity: 0.6 }}
      />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.loginSection}>
        <Text style={styles.title}>
          <Text style={styles.brand}>Libertlla</Text>
        </Text>

        <View style={styles.loginForm}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o seu e-mail"
            placeholderTextColor="#ffffff"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite a sua senha"
            placeholderTextColor="#ffffff"
            secureTextEntry
          />

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {/* <BLEScanner /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column", // antes era "row"
  },
  imageSection: {
    flex: 1,
    backgroundColor: "#54123F",
  },
  loginSection: {
    flex: 1,
    backgroundColor: "#54123F",
    justifyContent: "flex-start", // <-- aqui
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ffffff",
    fontFamily: "Montserrat",
    marginTop: 0,
    marginBottom: 20,
  },
  brand: {
    fontWeight: "bold",
  },
  loginForm: {
    width: "80%",
  },
  label: {
    fontSize: 16,
    marginTop: 16,
    color: "#ffffff",
    fontFamily: "Montserrat",
  },
  input: {
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#9B287B",
    borderRadius: 4,
    marginBottom: 10,
    backgroundColor: "#54123F",
    color: "#ffffff",
  },
  button: {
    padding: 12,
    backgroundColor: "#9B287B",
    borderRadius: 4,
    marginTop: 24,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    fontFamily: "Montserrat",
  },
});
