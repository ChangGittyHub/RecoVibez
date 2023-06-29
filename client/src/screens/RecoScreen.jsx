import {
  Animated,
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import GlobalStyles from "../constants/GlobalStyles";
import Constants from "expo-constants";
import { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import Svg, { G, Circle } from "react-native-svg";
import Carousel from "react-native-snap-carousel";

export default function RecoScreen() {
  // List of recommended songs
  const [songList, setSongList] = useState([]);

  // Current active song
  const [activeSongDetails, setActiveSongDetails] = useState(null);
  const [sound, setSound] = useState();

  // Carousel component showcasing list of recommended songs
  const carouselRef = useRef(null);

  useEffect(() => {
    // Retrieve the list of recommended songs from Spotify
    let songs = [
      {
        id: 1,
        title: "The Essential Itzhak Perlman",
        albumArtUri:
          "https://i.scdn.co/image/ab67616d0000b2730ca635d1def49167c9a9b210",
        audioUri:
          "https://p.scdn.co/mp3-preview/e60d4a0993565ebcc3d9476828e791d51d74db1c?cid=0b297fa8a249464ba34f5861d4140e58",
      },
      {
        id: 2,
        title:
          "Symphony No. 3 in D Minor, WAB 103 (original 1873 version, ed. L. Nowak): II. Adagio: Feierlich",
        albumArtUri:
          "https://i.scdn.co/image/ab67616d0000b273f30ea5deee5e3dea5de4fd09",
        audioUri:
          "https://p.scdn.co/mp3-preview/6caa9232fccde9f3e9fc417b18436b6af79dbfa4?cid=0b297fa8a249464ba34f5861d4140e58",
      },
      {
        id: 3,
        title: "Piano Sonata, Op. 26: IV. Fuga: Allegro con spirito",
        albumArtUri:
          "https://i.scdn.co/image/ab67616d0000b27347bd01fb5ebaa8d0c11f00db",
        audioUri:
          "https://p.scdn.co/mp3-preview/eb966b356416edcff63d1d11d08d0b14a25309a9?cid=0b297fa8a249464ba34f5861d4140e58",
      },
      {
        id: 4,
        title: "The Yellow Cake Review, Farewell to Stromness (Excerpt)",
        albumArtUri:
          "https://i.scdn.co/image/ab67616d0000b2733070b2958d8e4c20e4bdb7a5",
        audioUri:
          "https://p.scdn.co/mp3-preview/1ee94264cefcac2ffdae6ab696d2f288baaf48ad?cid=0b297fa8a249464ba34f5861d4140e58",
      },
    ];
    setSongList(songs);
    setActiveSongDetails(songs[0]);
  }, []);

  useEffect(() => {
    return sound ? () => unloadSound(sound) : undefined;
  }, [sound]);

  async function unloadSound(sound) {
    if (sound) {
      console.log("Unloading Sound");
      sound.unloadAsync();
    }
  }

  // const addToList = () => {
  //   let newItem = { title: "", text: "", number: 0 };
  //   setSongList((existingItems) => {
  //     let items = [...existingItems];
  //     // console.log(existingItems.slice(-1)[0].number);
  //     newItem.number = items.slice(-1)[0].number + 1;
  //     if (items.length > 10) {
  //       items.shift();
  //     }
  //     return [...items, newItem];
  //   });

  //   // carouselRef.current.snapToNext();
  //   // console.log(carouselRef.current.currentIndex);
  // };

  _renderSongPlayer = ({ item: songDetails, index }) => {
    return (
      <SongBox
        songDetails={songDetails}
        isActive={songDetails.id === activeSongDetails.id}
        setSoundStateAction={setSound}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* <Button title="Play Sound" onPress={(event) => playSound()} /> */}
      <Text style={{ color: GlobalStyles.colors.white }}>
        {activeSongDetails?.title}
      </Text>
      <Carousel
        ref={carouselRef}
        data={songList}
        renderItem={_renderSongPlayer}
        sliderWidth={500}
        itemWidth={250}
        layout={"default"}
        inactiveSlideOpacity={0.2}
        inactiveSlideScale={0.75}
        inactiveSlideShift={-50}
        onSnapToItem={async (slideIndex) => {
          await unloadSound(sound);
          setActiveSongDetails(songList[slideIndex]);
        }}
      />
    </View>
  );
}

const SongBox = ({ songDetails, isActive, setSoundStateAction }) => {
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const radius = 85;
  const circleCircumference = 2 * Math.PI * radius;
  const strokeDashoffset = useRef(
    new Animated.Value(circleCircumference)
  ).current;

  const [sound, setSound] = useState();
  const [playPercentage, setPlayPercentage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    async function playSong(songDetails) {
      await playSound(songDetails);
    }
    if (songDetails && isActive) {
      playSong(songDetails);
    }
    return () => {
      setPlayPercentage(0);
    };
  }, [songDetails, isActive]);

  useEffect(() => {
    Animated.timing(strokeDashoffset, {
      toValue:
        circleCircumference - (circleCircumference * playPercentage) / 100,
      duration: 50,
      useNativeDriver: false,
    }).start();
  }, [playPercentage]);

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
2
        if (playbackStatus.isPlaying) {
          // Update your UI for the playing state
          setIsPlaying(true);
        } else {
          // Update your UI for the paused state
          setIsPlaying(false);
        }

        if (playbackStatus.isBuffering) {
          // Update your UI for the buffering state
        }

        if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
          // The player has just finished playing and will stop. Maybe you want to play something else?
        }
      }
    };

    const progressUpdateIntervalMillis = 50;
    sound.setProgressUpdateIntervalAsync(progressUpdateIntervalMillis);
    sound.setOnPlaybackStatusUpdate(_onPlaybackStatusUpdate);
    setSoundStateAction(sound);
    setSound(sound);

    if (canPlay) await sound.playAsync();
  }

  async function pauseSound() {
    if (isPlaying) {
      sound.pauseAsync();
    } else {
      sound.playAsync();
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
          <Circle
            cx="50%"
            cy="50%"
            r={77}
            stroke={GlobalStyles.colors.pink_200}
            fill="transparent"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <TouchableOpacity onPress={pauseSound} style={{ position: "absolute" }}>
        <Image
          style={{
            height: 225,
            width: 225,
            borderRadius: 225 / 2,
          }}
          source={{ uri: songDetails.albumArtUri }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.black,
    alignItems: "center",
    paddingTop: Constants.statusBarHeight,
  },
  donutWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});
