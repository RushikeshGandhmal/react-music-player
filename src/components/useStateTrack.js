import { useEffect, useState } from "react";

const useStateTrack = (songUrls) => {
  const [tracks, setTracks] = useState([]);
  const [audioContext] = useState(() => new AudioContext());

  // State to keep track of the elapsed time
  const [seconds, setSeconds] = useState(0);
  // State to control the timer start/pause
  const [isActive, setIsActive] = useState(false);

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
        songUrls.map((url) => createTrack(url))
      );
      setTracks(tracksData);
    };

    setupTracks();
  }, [songUrls, audioContext]);

  useEffect(() => {
    let interval = null;

    // If the timer is active, set up an interval to increment the seconds
    if (isActive) {
      if (seconds > 30) setIsActive(false);
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

  return { tracks, playTrack, pauseTrack };
};

export default useStateTrack;
