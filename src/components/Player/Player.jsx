/* eslint-disable react/prop-types */

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faVolumeDown,
} from "@fortawesome/free-solid-svg-icons";

const Player = ({
  isActive,
  currentTime,
  handlePlay,
  handlePause,
  setVolume,
  songVolume,
  seekToPosition,
}) => {
  const [activeVolume, setActiveVolume] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const trackAnim = {
    transform: `translateX(${currentTime * 3.4}%)`,
  };

  const dragHandler = (e) => {
    console.log("currentTime", currentTime, e.target.value);
    seekToPosition(e.target.value);
  };

  const playSongHandler = () => {
    if (isPlaying) {
      setIsPlaying(false);
      handlePause();
    } else {
      setIsPlaying(true);
      handlePlay();
    }
  };

  const changeVolume = (e) => {
    setVolume(e.target.value);
  };

  return (
    <div className="player">
      <div className="time-control">
        <p>{currentTime}</p>
        <div
          style={{
            background: `linear-gradient(to right, #2ab3bf, black)`,
          }}
          className="track"
        >
          <input
            value={currentTime}
            type="range"
            max={30}
            min={0}
            onChange={dragHandler}
          />
          <div style={trackAnim} className="animate-track"></div>
        </div>
        <p>{"30:00"}</p>
      </div>
      <div className="play-control">
        <FontAwesomeIcon
          onClick={playSongHandler}
          className="play"
          size="2x"
          icon={isActive ? faPause : faPlay}
        />
        <FontAwesomeIcon
          onClick={() => setActiveVolume(!activeVolume)}
          icon={faVolumeDown}
        />
        {activeVolume && (
          <input
            onChange={changeVolume}
            value={songVolume}
            max="1"
            min="0"
            step="0.01"
            type="range"
          />
        )}
      </div>
    </div>
  );
};

export default Player;
