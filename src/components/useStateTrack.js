import { useEffect, useState } from "react";

const useStateTrack = (songUrls) => {
  const [tracks, setTracks] = useState(null);
  // const [songsBuffer, setSongsBuffer] = useState([]);

  async function loadAudioFile(audioContext, url) {
    console.log("loadurl", url);
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
  }

  console.log("tracks", tracks);

  async function createSource(url) {
    console.log("funUrl", url);
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
    async function processSongUrls() {
      const createSourcePromise = songUrls.map(async (url) => {
        return createSource(url);
      });
      const promise = await Promise.all(createSourcePromise);
      console.log("promise", promise);
      setTracks(promise);
    }

    processSongUrls();
  }, [songUrls, setTracks]);

  return tracks;
};

export default useStateTrack;
