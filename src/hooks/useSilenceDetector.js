import { useState, useRef, useCallback, useEffect } from "react";

const SILENCE_VOLUME_THRESHOLD = 10;
const CHECK_INTERVAL_MS = 100;

const useSilenceDetector = () => {
  const [isListening, setIsListening] = useState(false);

  const [volume, setVolume] = useState(0);

  const [silentForMs, setSilentForMs] = useState(0);

  const [isSilent, setIsSilent] = useState(false);

  const [isSupported] = useState(
    () => typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia
  );

  const audioContextRef = useRef(null);

  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const intervalRef = useRef(null);

  const silentStartRef = useRef(null);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    silentStartRef.current = null;


  }, []);

  const start = useCallback(async () => {
    if (!isSupported) return;
    try{
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      mediaStreamRef.current = stream;

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);

      source.connect(analyser)
      const dataArray = new Uint8Array(analyser.fftSize);

      setIsListening(true);
      setSilentForMs(0);
      silentStartRef.current = null;

      intervalRef.current = setInterval(() => {
        analyser.getByteTimeDomainData(dataArray);

        let maxVolume = 0;
        for(let i = 0; i < dataArray.length; i++) {
          const amplitude = Math.abs(dataArray[i] - 128);

          if(amplitude > maxVolume) maxVolume = amplitude;
        }

        setVolume(maxVolume);

        const currentlySilent = maxVolume < SILENCE_VOLUME_THRESHOLD;
        setIsSilent(currentlySilent);

        if(currentlySilent) {
          if(!silentStartRef.current) {
            silentStartRef.current = Date.now();
          }
          setSilentForMs(Date.now() - silentStartRef.current);
        } else {
          silentStartRef.current = null;
          setSilentForMs(0);
        }
      }, CHECK_INTERVAL_MS);
    } catch(err) {
      console.error("Microphone access denied or failed:", err);
      setIsListening(false);
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    cleanup();

    setIsListening(false);
    setVolume(0);
    setSilentForMs(0);
    setIsSilent(false);
  }, [cleanup]);
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    isListening,
    volume,
    silentForMs,
    isSilent,
    isSupported,
    start,
    stop,
  };
};

export default useSilenceDetector;
