  import { Stack } from "expo-router";
  import { useFonts } from "expo-font";
  import { BluetoothProvider } from "../assets/context/BluetoothContext";
  import { useEffect } from "react";
  import { Alert } from "react-native";
  import socket from "../assets/services/socket";
  import { getUserData } from "../storege";

  export default function RootLayout() {
    const [fontsLoaded] = useFonts({
      "Montserrat-Thin": require("../assets/fonts/Montserrat-Thin.ttf"),
      "Montserrat-ExtraLight": require("../assets/fonts/Montserrat-ExtraLight.ttf"),
      "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
      "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
      "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
      "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
      "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
      "Montserrat-ExtraBold": require("../assets/fonts/Montserrat-ExtraBold.ttf"),
      "Montserrat-Black": require("../assets/fonts/Montserrat-Black.ttf"),
    });

    useEffect(() => {
      const conectarSocket = async () => {
        try {
          const user = await getUserData();
          const vitimaId = user?.id;

          if (!vitimaId) return;

          if (!socket.connected) {
            socket.connect();
            console.log(socket.connected)
          }

          socket.emit("registrarVitima", vitimaId);
          console.log(`[Socket] Vítima Registrada ${vitimaId}`);

          socket.on('notificacao', ({ titulo, mensagem }) => {
            console.log("[Socket] Notificação recebida:", titulo, mensagem);
            Alert.alert(`${titulo}\n${mensagem}`);
          });

        } catch (error) {
          console.error("Erro ao conectar socket:", error);
        }
      };

      conectarSocket();

      return () => {
        socket.off("notificacao");
      };
    }, []);

    if (!fontsLoaded) return null;

    return (
      <BluetoothProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </BluetoothProvider>
    );
  }
