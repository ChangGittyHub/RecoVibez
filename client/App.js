import { Image, StyleSheet, Text, View } from "react-native";
import GlobalStyles from "./src/constants/GlobalStyles";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import { Navbar } from "./components/Navbar";
import { useState } from "react";
import { Screens } from "./src/constants/Screens";

// Placeholder screen
function DashboardScreen() {
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
    </View>
  );
}

// Placeholder screen
function RecoScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Reco Screen</Text>
    </View>
  );
}

export default function App() {
  // set the current active screen
  const [activeScreen, setActiveScreen] = useState(Screens.DashboardScreen);

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

  const handleNavigation = (screen) => {
    setActiveScreen(screen);
  };

  return (
    <View style={styles.container}>
      {activeScreen === Screens.DashboardScreen ? (
        <DashboardScreen />
      ) : activeScreen === Screens.RecoScreen ? (
        <RecoScreen />
      ) : null}

      <Navbar handleNavigation={handleNavigation} />
      <StatusBar style="light" />
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
