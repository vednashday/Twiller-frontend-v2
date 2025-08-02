// AudioRecorder.jsx
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import "./AudioRecorder.css";

const AudioRecorder = forwardRef(({ onAudioReady }, ref) => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [error, setError] = useState("");
  const [isStopping, setIsStopping] = useState(false);

  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const animationRef = useRef(null);

  useImperativeHandle(ref, () => ({
    stopRecording,
  }));
  

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current || !dataArrayRef.current) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    animationRef.current = requestAnimationFrame(drawWaveform);

    analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1DA1F2";
    ctx.beginPath();

    const sliceWidth = width / analyserRef.current.fftSize;
    let x = 0;

    for (let i = 0; i < analyserRef.current.fftSize; i++) {
      const v = dataArrayRef.current[i] / 128.0;
      const y = (v * height) / 2;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.stroke();
  };

  const stopRecording = () => {
    if (isStopping) return;
    setIsStopping(true);

    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }

      cancelAnimationFrame(animationRef.current);
      clearInterval(timerRef.current);
      setRecording(false);
    } catch (err) {
      console.error("Error while stopping recording:", err);
    } finally {
      setIsStopping(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 2048;
      dataArrayRef.current = new Uint8Array(analyserRef.current.fftSize);

      drawWaveform();

      audioChunks.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => audioChunks.current.push(e.data);

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: "audio/webm" });
        if (blob.size > 100 * 1024 * 1024) {
          setError("Audio exceeds 100MB.");
          return;
        }
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioURL(url);
        onAudioReady?.(blob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      setElapsedTime(0);

      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => {
          if (prev >= 300) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      setError("Microphone access denied or error starting recording.");
    }
  };

  useEffect(() => {
    startRecording();
    return () => stopRecording();
  }, []);

  return (
    <div className="audio-recorder">
      <canvas ref={canvasRef} width={400} height={100} />
      {recording && (
        <div className="recording-status">
          Recording... {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, "0")}
        </div>
      )}
      {recording && (
        <button type="button" onClick={stopRecording}>⏹ Stop Recording</button>
      )}
      {audioURL && (
        <>
          <audio controls src={audioURL} />
          <p>{(audioBlob?.size / 1024 / 1024).toFixed(2)} MB</p>
        </>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
});

export default AudioRecorder;