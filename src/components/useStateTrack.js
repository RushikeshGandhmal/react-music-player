import { useEffect, useState } from "react";

const useStateTrack = (songUrls) => {
  const [tracks, setTracks] = useState(null);

  async function loadAudioFile(audioContext, url) {
    console.log("url", url);
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    console.log("arrayBuffer", arrayBuffer);
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
  }

  async function createSource(url) {
    const audioContext = new AudioContext();
    const audioBuffer = await loadAudioFile(audioContext, url);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = 1; // Start with full volume. Adjust as needed.

    source.connect(gainNode).connect(audioContext.destination);
    return { source, gainNode };
  }

  useEffect(() => {
    async function processArray() {
      const promises = songUrls.map(async (url) => {
        return createSource(url);
      });
      const promise = await Promise.all(promises);
      console.log("promise", promise);
      setTracks(promise);
    }

    processArray();
  }, [songUrls, setTracks]);

  return tracks;
};

export default useStateTrack;
