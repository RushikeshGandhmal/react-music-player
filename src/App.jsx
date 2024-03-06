import { useState } from "react";
import "./styles/app.scss";
//Import Components
import Library from "./components/Library/Library";
import Nav from "./components/Nav";
//Import data
import chillhop from "./data";
//Util
import AudioMixer from "./components/Player/AudioMixer";

function App() {
  const [songs, setSongs] = useState(chillhop());
  console.log("songs", songs);
  const [currentSongs, setCurrentSongs] = useState([songs[0]]);
  const [libraryStatus, setLibraryStatus] = useState(false);

  const songSelectHandler = (id) => {
    console.log("newsong", id);
    const selectedSong = songs.filter((state) => state.id === id);
    setCurrentSongs([...currentSongs, { ...selectedSong[0] }]);

    //Set Active in library
    const newSongs = songs.map((song) => {
      if (song.id === id || song.active) {
        return {
          ...song,
          active: true,
        };
      } else {
        return {
          ...song,
          active: false,
        };
      }
    });
    setSongs(newSongs);
  };

  return (
    <>
      <div className={`App ${libraryStatus ? "library-active" : ""}`}>
        <Nav
          libraryStatus={libraryStatus}
          setLibraryStatus={setLibraryStatus}
        />
        <AudioMixer
          songs={currentSongs}
          songSelectHandler={songSelectHandler}
        />
        <Library
          songs={songs}
          libraryStatus={libraryStatus}
          songSelectHandler={songSelectHandler}
        />
      </div>
    </>
  );
}

export default App;
