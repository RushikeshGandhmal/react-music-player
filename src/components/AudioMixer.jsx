/* eslint-disable react/prop-types */
import Player from "./Player";
import Song from "./Song";
import useStateTrack from "./useStateTrack";

const AudioMixer = ({ songs, songSelectHandler }) => {
  const {
    isActive,
    tracks,
    playTrack,
    pauseTrack,
    seconds,
    setVolume,
    songVolume,
    seekToPosition,
  } = useStateTrack(songs);
  console.log("tracks", tracks);

  const columnStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${tracks.length}, 1fr)`,
    gap: "20px", // Adjust space between columns
  };

  const handlePlay = () => {
    tracks?.forEach((track, index) => {
      playTrack(index);
    });
  };

  const handlePause = () => {
    tracks?.forEach((track, index) => {
      pauseTrack(index);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");

    songSelectHandler(data);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  return (
    <>
      <div
        id="dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={columnStyle}
      >
        {songs.map((song) => {
          return <Song currentSong={song} key={song.id} />;
        })}
      </div>
      <div id="dropzone">
        <Player
          isActive={isActive}
          currentTime={seconds}
          handlePlay={handlePlay}
          handlePause={handlePause}
          setVolume={setVolume}
          songVolume={songVolume}
          seekToPosition={seekToPosition}
        />
      </div>
    </>
  );
};

export default AudioMixer;
