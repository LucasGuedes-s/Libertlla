import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { saveUserData, saveToken } from "../storege";

export default function Index() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    console.log("Botão de login pressionado");

    try {
      const response = await axios.post("https://libertlla.onrender.com/login/vitima", {
        usuario: {
          email,
          senha,
        },
      });
      console.log('[LOGIN] Resposta completa:', response.data);

      const { usuario, token } = response.data;
      console.log('[LOGIN] Usuário:', usuario);
      console.log('[LOGIN] Token recebido:', token);

      await saveUserData(usuario);
      await saveToken(token);

      router.push("/botaodepanico");
    } catch (error: any) {
      if (error.response?.status === 401) {
        Alert.alert("Erro", "E-mail ou senha inválidos.");
      } else {
        console.error(error);
        Alert.alert("Erro", "Não foi possível fazer login.");
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Fechar o teclado ao tocar fora */}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ImageBackground
          source={require("../assets/images/walppaper_libertlla.png")}
          style={styles.imageSection}
          imageStyle={{ resizeMode: "cover" }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.loginSection}
          >
            <Text style={styles.title}>
              <Text style={styles.brand}>Libertlla</Text>
            </Text>

            <View style={styles.loginForm}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o seu e-mail"
                placeholderTextColor="#ffffff"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite a sua senha"
                placeholderTextColor="#ffffff"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
              />

              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageSection: {
    flex: 1,
    justifyContent: "center", 
    alignItems: "center", 
  },
  loginSection: {
    width: "80%", 
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center", 
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ffffff",
    fontFamily: "Montserrat",
    marginTop: 0,
    textAlign: "center",
  },
  brand: {
    fontWeight: "bold",
  },
  loginForm: {
    width: "100%",
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
