import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GlobalStyles from "../constants/GlobalStyles";
import Constants from "expo-constants";
import { useEffect, useRef, useState } from "react";
import Carousel from "react-native-snap-carousel";
import { SongBox } from "../components/SongBox";

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

    // Set the list of recommended songs
    setSongList(songs);

    // Set the first song in the recommendation list to active
    setActiveSongDetails(songs[0]);
  }, []);

  useEffect(() => {
    return sound ? () => unloadSound(sound) : undefined;
  }, [sound]);

  async function unloadSound(sound) {
    if (sound) {
      console.log("Unloading Sound");
      sound
        .unloadAsync()
        .catch(() => console.log("sound not loaded, hence cannot unload"));
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
      <Text
        style={[
          GlobalStyles.text.h1,
          {
            color: GlobalStyles.colors.white,
            width: GlobalStyles.windowW,
            paddingLeft: 25,
          },
        ]}
      >
        Top Picks for You
      </Text>
      <Carousel
        ref={carouselRef}
        data={songList}
        renderItem={_renderSongPlayer}
        containerCustomStyle={{ flexGrow: 0, marginTop: 10 }}
        sliderWidth={500}
        itemWidth={250}
        layout={"default"}
        inactiveSlideOpacity={0.2}
        inactiveSlideScale={0.75}
        inactiveSlideShift={50}
        onSnapToItem={async (slideIndex) => {
          await unloadSound(sound);
          setActiveSongDetails(songList[slideIndex]);
        }}
      />
      <View
        style={{
          width: GlobalStyles.windowW,
          alignItems: "center",
          paddingLeft: 25,
          paddingRight: 25,
        }}
      >
        <Text style={[GlobalStyles.text.h2, styles.songTitle]}>
          {activeSongDetails?.title}
        </Text>
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <Text style={[GlobalStyles.text.h3, styles.songInfo]}>
            Author Name 1, Author Name 2
          </Text>
          <Text style={[GlobalStyles.text.h3, styles.songInfo]}>
            Release Year
          </Text>
          <Text style={[GlobalStyles.text.h3, styles.songInfo]}>
            Classical, Country
          </Text>
        </View>

        {/* add-to-playlist, like, menu buttons */}
        <View style={{ flexDirection: "row", marginTop: 30 }}>
          <TouchableOpacity>
            <Image
              style={[GlobalStyles.icons.sm, styles.recoscreenButton]}
              source={require("../assets/icons/add-icon.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              style={[GlobalStyles.icons.sm, styles.recoscreenButton]}
              source={require("../assets/icons/like-icon-fill.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              style={[GlobalStyles.icons.sm, styles.recoscreenButton]}
              source={require("../assets/icons/menu-icon.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.black,
    alignItems: "center",
    paddingTop: Constants.statusBarHeight,
  },
  songTitle: {
    textAlign: "center",
    color: GlobalStyles.colors.purple_200,
  },
  songInfo: {
    color: GlobalStyles.colors.white,
    paddingTop: 2,
    paddingBottom: 2,
  },
  recoscreenButton: {
    width: 20,
    marginLeft: 20,
    marginRight: 20,
  },
});
