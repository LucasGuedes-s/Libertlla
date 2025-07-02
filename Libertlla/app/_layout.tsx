import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { BluetoothProvider } from "../assets/context/BluetoothContext";

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
