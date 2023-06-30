import {
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
import GlobalStyles from "../constants/GlobalStyles";
import { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import Svg, { G, Circle } from "react-native-svg";

export const SongBox = ({ songDetails, isActive, setSoundStateAction }) => {
  // Ui
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  const blackFilterOpacity = 0.5;
  const radius = 85;
  const circleCircumference = 2 * Math.PI * radius;
  const strokeDashoffset = useRef(
    new Animated.Value(circleCircumference)
  ).current;

  const isInnerRingShown = useRef(new Animated.Value(0)).current;
  const isBlackFilterShown = useRef(new Animated.Value(0)).current;
  const isPauseButtonShown = useRef(new Animated.Value(0)).current;
  const [fadeBlackFilterTimeoutId, setFadeBlackFilterTimeoutId] = useState();

  // Sound
  const [sound, setSound] = useState();
  const [soundStatus, setSoundStatus] = useState();
  const [playPercentage, setPlayPercentage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isResuming, setIsResuming] = useState(false);

  // Configure Ui animations
  useEffect(() => {
    Animated.timing(strokeDashoffset, {
      toValue:
        circleCircumference - (circleCircumference * playPercentage) / 100,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [playPercentage]);

  useEffect(() => {
    Animated.timing(isInnerRingShown, {
      toValue: isActive ? 1 : 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [isActive]);

  useEffect(() => {
    if (isResuming) {
      isBlackFilterShown.setValue(blackFilterOpacity);
      isPauseButtonShown.setValue(1);
      const timeout = setTimeout(() => {
        setIsResuming(false);
        Animated.timing(isBlackFilterShown, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }).start();
        Animated.timing(isPauseButtonShown, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }).start();
      }, 2500);
      setFadeBlackFilterTimeoutId(timeout);
    }
  }, [isResuming]);

  useEffect(() => {
    async function playSong(songDetails) {
      await playSound(songDetails);
    }
    if (songDetails && isActive) {
      playSong(songDetails);
    }
    return () => {
      setPlayPercentage(0);
      setIsPlaying(false);
      setIsResuming(false);
      isBlackFilterShown.setValue(0);
      isPauseButtonShown.setValue(0);
    };
  }, [songDetails, isActive]);

  async function playSound(songDetails) {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

    let canPlay = false; // this should be stored as some kind of state

    const { sound, status } = await Audio.Sound.createAsync(
      {
        uri: songDetails.audioUri,
      },
      { shouldPlay: true }
    );

    _onPlaybackStatusUpdate = (playbackStatus) => {
      setSoundStatus(playbackStatus);

      if (!playbackStatus.isLoaded) {
        // Update your UI for the unloaded state
        if (playbackStatus.error) {
          console.log(
            `Encountered a fatal error during playback: ${playbackStatus.error}`
          );
          // Send Expo team the error on Slack or the forums so we can help you debug!
        }
      } else {
        // Update your UI for the loaded state
        canPlay = true;
        setPlayPercentage(
          (playbackStatus.positionMillis / playbackStatus.durationMillis) * 100
        );
        2;
        if (playbackStatus.isPlaying) {
          // Update your UI for the playing state
          setIsPlaying(true);
        } else {
          // Update your UI for the paused state
          setIsPlaying(false);
        }

        if (playbackStatus.isBuffering) {
          // Update your UI for the buffering state
          console.log("buffering");
        }

        if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
          // The player has just finished playing and will stop. Maybe you want to play something else?
        }
      }
    };

    if (sound && status.isLoaded) {
      const progressUpdateIntervalMillis = 200;
      sound.setProgressUpdateIntervalAsync(progressUpdateIntervalMillis);
      sound.setOnPlaybackStatusUpdate(_onPlaybackStatusUpdate);
      setSoundStateAction(sound);
      setSound(sound);
    }

    if (canPlay) await sound.playAsync();
  }

  async function togglePlayPauseSound() {
    if (soundStatus?.isLoaded) {
      if (isPlaying) {
        setIsResuming(false);

        // Stop previous existing animations
        if (fadeBlackFilterTimeoutId) {
          clearTimeout(fadeBlackFilterTimeoutId);
        }

        Animated.timing(isBlackFilterShown, {
          toValue: blackFilterOpacity,
          duration: 250,
          useNativeDriver: false,
        }).start();

        // isBlackFilterShown.setValue(blackFilterOpacity);
        isPauseButtonShown.setValue(0);
        sound.pauseAsync();
      } else {
        setIsResuming(true);
        sound.playAsync();
      }
    }
  }

  return (
    <View style={styles.donutWrapper}>
      <Svg
        height="300"
        width="300"
        viewBox="0 0 200 200"
        style={{ backgroundColor: "transparent" }}
      >
        <G rotation={-90} originX="100" originY="100">
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="transparent"
            fill="transparent"
            strokeWidth="20"
          />
          {isActive && (
            <AnimatedCircle
              cx="50%"
              cy="50%"
              r={radius}
              stroke={GlobalStyles.colors.pink_100}
              fill="transparent"
              strokeWidth="4"
              strokeDasharray={circleCircumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          )}
          <AnimatedCircle
            cx="50%"
            cy="50%"
            r={77}
            stroke={GlobalStyles.colors.pink_200}
            fill="transparent"
            strokeWidth="4"
            strokeLinecap="round"
            opacity={isInnerRingShown}
          />
        </G>
      </Svg>
      <TouchableOpacity
        onPress={togglePlayPauseSound}
        activeOpacity={1}
        style={{ position: "absolute" }}
      >
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          {/* Black filter */}
          <Animated.View
            style={styles.blackFilter}
            opacity={isBlackFilterShown}
          />

          {/* Album Art */}
          <Image
            style={styles.albumArt}
            source={{ uri: songDetails.albumArtUri }}
          />

          {/* Pause Icon */}
          <Animated.Image
            style={[GlobalStyles.icons.default, styles.songboxIcon]}
            opacity={isPauseButtonShown}
            source={require("../assets/icons/pause-icon.png")}
          />

          {/* Play Icon */}
          {soundStatus?.isLoaded && !isPlaying && (
            <Animated.Image
              style={[GlobalStyles.icons.default, styles.songboxIcon]}
              source={require("../assets/icons/play-icon.png")}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  donutWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  albumArt: {
    height: 225,
    width: 225,
    borderRadius: 225 / 2,
  },
  blackFilter: {
    height: 225,
    width: 225,
    borderRadius: 225 / 2,
    backgroundColor: "black",
    position: "absolute",
    zIndex: 1,
  },
  songboxIcon: {
    position: "absolute",
    height: 35,
    zIndex: 2,
  },
});
