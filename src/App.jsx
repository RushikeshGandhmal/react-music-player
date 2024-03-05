import { useRef, useState } from "react";
import "./styles/app.scss";
//Import Components
import Library from "./components/Library";
import Nav from "./components/Nav";
import Player from "./components/Player";
import Song from "./components/Song";
//Import data
import chillhop from "./data";
//Util
import { playAudio } from "./util";
import AudioMixer from "./components/AudioMixer";

function App() {
  //Ref
  const audioRef = useRef(null);

  const [songs, setSongs] = useState(chillhop());
  const [currentSong, setCurrentSong] = useState([songs[0]]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
    volume: 0,
  });
  const [libraryStatus, setLibraryStatus] = useState(false);

  const columnStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${currentSong.length}, 1fr)`,
    gap: "20px", // Adjust space between columns
  };

  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;

    const roundedCurrent = Math.round(current);
    const roundedDuration = Math.round(duration);
    const percentage = Math.round((roundedCurrent / roundedDuration) * 100);
    setSongInfo({
      ...songInfo,
      currentTime: current,
      duration: duration,
      animationPercentage: percentage,
      volume: e.target.volume,
    });
  };

  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong[0].id);
    await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
    playAudio(isPlaying, audioRef);
    return;
  };

  const songSelectHandler = (id) => {
    const selectedSong = songs.filter((state) => state.id === id);
    setCurrentSong([{ ...selectedSong[0] }, ...currentSong]);

    console.log("currentSong", currentSong);
    //Set Active in library
    const newSongs = songs.map((song) => {
      if (song.id === id) {
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

    //Play audio
    setIsPlaying(true);
    playAudio(true, audioRef);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");

    songSelectHandler(data);
    console.log(data);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  return (
    <AudioMixer
      songs={[
        "https://cambdemo.vercel.app/resources/guitar.wav",
        "https://cambdemo.vercel.app/resources/trumpet.wav",
      ]}
      play={true}
      pause={false}
    />
  );

  // return (
  //   <div>
  //     <div className={`App ${libraryStatus ? "library-active" : ""}`}>
  //       <Nav
  //         libraryStatus={libraryStatus}
  //         setLibraryStatus={setLibraryStatus}
  //       />
  //       <div
  //         id="dropzone"
  //         onDrop={handleDrop}
  //         onDragOver={handleDragOver}
  //         style={columnStyle}
  //       >
  //         {currentSong.map((song) => {
  //           return (
  //             <>
  //               <Song isPlaying={isPlaying} currentSong={song} />
  //             </>
  //           );
  //         })}
  //       </div>
  //       <div id="dropzone" onDrop={handleDrop} onDragOver={handleDragOver}>
  //         <Player
  //           audioRef={audioRef}
  //           setIsPlaying={setIsPlaying}
  //           currentSong={currentSong[0]}
  //           isPlaying={isPlaying}
  //           songInfo={songInfo}
  //           setSongInfo={setSongInfo}
  //         />
  //       </div>
  //       <Library
  //         songs={songs}
  //         libraryStatus={libraryStatus}
  //         songSelectHandler={songSelectHandler}
  //       />
  //       {currentSong.map((song) => {
  //         return (
  //           <audio
  //             key={song.id}
  //             onLoadedMetadata={timeUpdateHandler}
  //             onTimeUpdate={timeUpdateHandler}
  //             ref={audioRef}
  //             src={song.audio}
  //             onEnded={songEndHandler}
  //           ></audio>
  //         );
  //       })}
  //     </div>
  //   </div>
  // );
}

export default App;
