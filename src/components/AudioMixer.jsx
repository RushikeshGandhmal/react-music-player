/* eslint-disable react/prop-types */
import { useEffect } from "react";
import useStateTrack from "./useStateTrack";

const AudioMixer = ({ songs, play, pause }) => {
  const { tracks, playTrack, pauseTrack } = useStateTrack(songs);

  //   console.log("ccc", tracks, playTrack, pauseTrack);

  const handlePlay = () => {
    tracks?.forEach((track, index) => {
      //   track.source.start();
      playTrack(index);
    });
  };

  const handlePause = () => {
    tracks?.forEach((track, index) => {
      //   track.source.stop();
      pauseTrack(index);
    });
  };

  useEffect(() => {
    if (play && !pause) {
      // Play the all audio tracks
      //   handlePlay();
    } else if (!play && pause) {
      // Pause all tracks
      //   handlePause();
    }
  }, [play, pause, tracks]);
  return (
    <>
      <button
        onClick={() => {
          handlePlay();
        }}
      >
        Play
      </button>{" "}
      <button
        onClick={() => {
          handlePause();
        }}
      >
        Pause
      </button>{" "}
    </>
  );
};

export default AudioMixer;
