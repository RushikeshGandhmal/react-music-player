import { useEffect, useState } from "react";

const useStateTrack = (songUrls) => {
  const [tracks, setTracks] = useState([]);
  const [audioContext] = useState(() => new AudioContext());

  // State to keep track of the elapsed time
  const [seconds, setSeconds] = useState(0);
  // State to control the timer start/pause
  const [isActive, setIsActive] = useState(false);
  const [songVolume, setSongVolume] = useState(1);

  // Function to load audio file
  async function loadAudioFile(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return audioContext.decodeAudioData(arrayBuffer);
  }

  // Function to create source and gainNode for each track
  async function createTrack(url) {
    const audioBuffer = await loadAudioFile(url);
    return {
      audioBuffer,
      source: null,
      gainNode: null,
      playing: false,
      startTime: 0,
      pauseTime: 0,
    };
  }

  console.log("seconds", seconds);
  console.log("isActive", isActive);

  // Setup tracks
  useEffect(() => {
    const setupTracks = async () => {
      const tracksData = await Promise.all(
        songUrls.map((url) => createTrack(url.audio))
      );
      setTracks(tracksData);
    };

    setupTracks();
  }, [songUrls, audioContext]);

  useEffect(() => {
    let interval = null;

    // If the timer is active, set up an interval to increment the seconds
    if (isActive) {
      if (seconds > 29) {
        setIsActive(false);
        setSeconds(0);
      }
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      // If the timer is paused, clear the interval
      clearInterval(interval);
    }
    // Cleanup the interval on component unmount or when pausing
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  // Play a track
  function playTrack(index) {
    setIsActive(true);
    const track = tracks[index];
    if (track.playing) return;
    if (seconds > track.audioBuffer.duration) return;

    console.log("whyyyyyyy", seconds, track.audioBuffer.duration);
    const source = audioContext.createBufferSource();
    source.buffer = track.audioBuffer;

    const gainNode = audioContext.createGain();
    source.connect(gainNode).connect(audioContext.destination);
    gainNode.gain.value = 1; // Or any other volume setting

    let offset = track.pauseTime;
    source.start(0, offset % track.audioBuffer.duration);
    track.source = source;
    track.gainNode = gainNode;
    track.playing = true;
    track.startTime = audioContext.currentTime - offset;
    track.pauseTime = 0; // Reset pause time

    setTracks([...tracks.slice(0, index), track, ...tracks.slice(index + 1)]);
  }

  // Pause a track
  function pauseTrack(index) {
    setIsActive(false);
    const track = tracks[index];
    if (!track.playing) return;

    track.source.stop(); // Stop playback
    track.pauseTime =
      (audioContext.currentTime - track.startTime) % track.audioBuffer.duration;
    track.playing = false;
    track.source = null; // Discard the source node

    setTracks([...tracks.slice(0, index), track, ...tracks.slice(index + 1)]);
  }

  const setVolume = (volume) => {
    // Ensure the volume is within the valid range [0, 1]
    setSongVolume(volume);
    const clampedVolume = Math.min(Math.max(volume, 0), 1);
    tracks.forEach((track) => {
      track.gainNode.gain.value = clampedVolume;
    });
  };

  function playSeekTrack(index, position = 0) {
    setIsActive(true);
    const track = tracks[index];
    if (track.playing) {
      track.source.stop(); // Stop current if playing to handle re-play from new position
      track.playing = false; // Ensure correct state before re-initiating
    }

    const source = audioContext.createBufferSource();
    source.buffer = track.audioBuffer;
    source.connect(track.gainNode).connect(audioContext.destination);
    track.gainNode.gain.value = songVolume;

    source.start(0, position);
    track.source = source;
    track.playing = true;
    track.startTime = audioContext.currentTime - position;
    track.pauseTime = position; // Set or reset pauseTime to the new position

    setTracks([...tracks.slice(0, index), track, ...tracks.slice(index + 1)]);
  }

  const seekToPosition = (position) => {
    tracks.forEach((track, index) => {
      if (track.audioBuffer.duration > position) {
        playSeekTrack(index, position);
      }
    });
  };

  return {
    isActive,
    tracks,
    playTrack,
    pauseTrack,
    seconds,
    setVolume,
    songVolume,
    seekToPosition,
  };
};

export default useStateTrack;
