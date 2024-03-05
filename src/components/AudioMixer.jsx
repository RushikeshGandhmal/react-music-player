/* eslint-disable react/prop-types */
import { useEffect } from "react";
import useStateTrack from "./useStateTrack";

const AudioMixer = ({ songs, play, pause }) => {
  const tracks = useStateTrack(songs);

  const handlePlay = () => {
    tracks?.forEach((track) => {
      track.source.start();
    });
  };

  const handlePause = () => {
    tracks?.forEach((track) => {
      track.source.pause();
    });
  };

  useEffect(() => {
    if (play && !pause) {
      // Play the all audio tracks
      handlePlay();
    } else if (!play && pause) {
      // Pause all tracks
      handlePause();
    }
  }, [play, pause, tracks]);
  return <div>AudioMixer</div>;
};

export default AudioMixer;
