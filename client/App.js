import { Image, StyleSheet, Text, View } from "react-native";
import GlobalStyles from "./src/constants/GlobalStyles";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";

export default function App() {
  // load custom fonts
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image
        style={{ height: 90, resizeMode: "contain" }}
        source={require("./assets/images/recovibez-logo.png")}
      />
      <Image
        style={GlobalStyles.icons.lg}
        source={require("./assets/icons/disk-icon.png")}
      />
      <Text
        style={[GlobalStyles.text.h3, { color: GlobalStyles.colors.white }]}
      >
        Open up App.js to start working on your app!
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.black,
    alignItems: "center",
    paddingTop: Constants.statusBarHeight,
    // justifyContent: "center",
  },
});
