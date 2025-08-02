import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import "./WaveformTweet.css";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';


export default function WaveformTweet({ audioUrl }) {
  const containerRef = useRef(null);
  const waveSurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!audioUrl || !containerRef.current) return;

    const wave = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#ccc",
      progressColor: "#1DA1F2",
      cursorColor: "#1DA1F2",
      height: 60,
      barWidth: 3,
      barRadius: 10,
      cursorWidth: 3,
      responsive: true,
      normalize: true,
    });

    waveSurferRef.current = wave;

    // Catch AbortError in .load
    wave.load(audioUrl).catch((e) => {
      if (e.name !== "AbortError") {
        console.warn("WaveSurfer load failed:", e);
      }
    });

    wave.on("finish", () => setIsPlaying(false));

    return () => {
      if (waveSurferRef.current) {
        try {
          waveSurferRef.current.destroy();
        } catch (e) {
          if (e.name !== "AbortError") console.warn("WaveSurfer destroy failed:", e);
        }
        waveSurferRef.current = null;
      }
    };
  }, [audioUrl]);

  const togglePlayback = () => {
    const wave = waveSurferRef.current;
    if (!wave) return;
    if (wave.isPlaying()) {
      wave.pause();
      setIsPlaying(false);
    } else {
      wave.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="waveform-container">
      <button className="waveform-button" onClick={togglePlayback}>
        {isPlaying ?  (<PauseIcon/>): (<PlayArrowIcon/>)}
      </button>
      <div className="waveform-wave" ref={containerRef} />
      
    </div>
  );
}
