import {
  Animated,
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import GlobalStyles from "../src/constants/GlobalStyles";
import { useEffect, useRef, useState } from "react";
import { Screens } from "../src/constants/Screens";

const containerHeight = 75;
const followHeight = 85;
const followLeftError = 3;

export const Navbar = ({ handleNavigation }) => {
  const [navbuttonPosition1, setNavbuttonPosition1] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [navbuttonPosition2, setNavbuttonPosition2] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [navbuttonPosition3, setNavbuttonPosition3] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [navbuttonPosition4, setNavbuttonPosition4] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const navbuttonTargetTop1 = useRef(new Animated.Value(-35)).current;
  const navbuttonTargetTop2 = useRef(new Animated.Value(0)).current;
  const navbuttonTargetTop3 = useRef(new Animated.Value(0)).current;
  const navbuttonTargetTop4 = useRef(new Animated.Value(0)).current;

  const currFollowLeftPosition = useRef(new Animated.Value(0)).current;
  const currFollowTopPosition = useRef(new Animated.Value(-40)).current;

  useEffect(() => {
    currFollowLeftPosition.setValue(navbuttonPosition1.x - followLeftError);
  }, [navbuttonPosition1.x]);

  const resetButtonPositions = () => {
    Animated.timing(navbuttonTargetTop1, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
    Animated.timing(navbuttonTargetTop2, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
    Animated.timing(navbuttonTargetTop3, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
    Animated.timing(navbuttonTargetTop4, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const onPressHandler = (
    navbuttonPosition,
    navbuttonTargetTop,
    screenToNavigate
  ) => {
    resetButtonPositions();

    Animated.timing(navbuttonTargetTop, {
      toValue: -35,
      duration: 250,
      useNativeDriver: false,
    }).start();

    Animated.timing(currFollowLeftPosition, {
      toValue: navbuttonPosition.x - followLeftError,
      duration: 250,
      useNativeDriver: false,
    }).start();

    // Animated.timing(currFollowTopPosition, {
    //   toValue:
    //     containerHeight -
    //     followHeight / 2 -
    //     navbuttonPosition.height / 2 +
    //     Math.abs(navbuttonPosition.y),
    //   duration: 250,
    //   useNativeDriver: false,
    // }).start();
    handleNavigation(screenToNavigate);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        onLayout={(event) => setNavbuttonPosition1(event.nativeEvent.layout)}
        style={{ top: navbuttonTargetTop1 }}
      >
        <TouchableOpacity
          onPress={(event) =>
            onPressHandler(navbuttonPosition1, navbuttonTargetTop1, Screens.DashboardScreen)
          }
        >
          <Image
            style={GlobalStyles.icons.md}
            source={require("../assets/icons/dashboard-icon.png")}
          />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        onLayout={(event) => setNavbuttonPosition2(event.nativeEvent.layout)}
        style={{ top: navbuttonTargetTop2 }}
      >
        <TouchableOpacity
          onPress={(event) =>
            onPressHandler(navbuttonPosition2, navbuttonTargetTop2, Screens.DashboardScreen)
          }
        >
          <Image
            style={GlobalStyles.icons.md}
            source={require("../assets/icons/favorite-icon.png")}
          />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        onLayout={(event) => setNavbuttonPosition3(event.nativeEvent.layout)}
        style={{
          top: navbuttonTargetTop3,
          width: navbuttonPosition1.width, // make button same width as other buttons
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={(event) =>
            onPressHandler(navbuttonPosition3, navbuttonTargetTop3, Screens.RecoScreen)
          }
        >
          <Image
            style={{ height: 30, resizeMode: "contain" }}
            source={require("../assets/icons/note-icon.png")}
          />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        onLayout={(event) => setNavbuttonPosition4(event.nativeEvent.layout)}
        style={{ top: navbuttonTargetTop4 }}
      >
        <TouchableOpacity
          onPress={(event) =>
            onPressHandler(navbuttonPosition4, navbuttonTargetTop4, Screens.DashboardScreen)
          }
        >
          <Image
            style={GlobalStyles.icons.md}
            source={require("../assets/icons/settings-icon.png")}
          />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[
          styles.follow,
          { left: currFollowLeftPosition, top: currFollowTopPosition },
        ]}
      >
        {/* <View style={[styles.followChild, styles.followBefore]} />
          <View style={[styles.followChild, styles.followAfter]} /> */}
      </Animated.View>

      {/* <Button title="press me" onPress={onClickHandler} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginBottom: 200,
    backgroundColor: GlobalStyles.colors.grey_200,
    width: "100%",
    height: containerHeight,
    position: "relative",

    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    // overflow: "hidden",
    // box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    // transition: background-color 0.4s;
  },
  navbutton: {
    position: "relative",
    // top: -35,
  },
  follow: {
    zIndex: -1,
    position: "absolute",
    borderRadius: 100,
    width: 85,
    height: 85,

    borderWidth: 10,
    borderStyle: "solid",
    borderColor: GlobalStyles.colors.black,

    backgroundColor: GlobalStyles.colors.pink_300,
    // top: -40,
  },
  // followChild: {
  //   position: "absolute",
  //   top: 29.5,
  //   borderTopWidth: 11,
  //   borderStyle: "solid",
  //   borderTopColor: GlobalStyles.colors.grey_200,
  //   backgroundColor: GlobalStyles.colors.grey_200,
  //   width: 20,
  //   height: 20,
  // },
  // followBefore: {
  //   left: -26,
  //   borderTopRightRadius: 100,
  // },
  // followAfter: {
  //   right: -26,
  //   borderTopLeftRadius: 100,
  // },
});
