import { Text, View } from "react-native";
import BLEScanner from "../app/BLEScanner";

export default function Index() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Text>Edit app/index.tsx to edit this screen.</Text>
      </View>
      <BLEScanner />
    </View>
  );
}
