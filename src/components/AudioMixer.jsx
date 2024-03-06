/* eslint-disable react/prop-types */
import useStateTrack from "./useStateTrack";

const AudioMixer = ({ songs }) => {
  const { tracks, playTrack, pauseTrack } = useStateTrack(songs);
  //   console.log("ccc", tracks, playTrack, pauseTrack);

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
