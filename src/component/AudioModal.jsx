import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AudioRecorder from "./AudioRecorder";
import { toast } from "react-toastify";

import "./AudioModal.css";

export default function AudioModal({ open, onClose, onAudioFinalized, email, user }) {
  const [audioBlob, setAudioBlob] = useState(null);
  const [otpInput, setOtpInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleAudioReady = async (blob) => {
    setAudioBlob(blob);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("https://twiller-v2.onrender.com/send-audio-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, idToken }),
      });
      const data = await res.json();
      if (data.success) setOtpSent(true);
      toast.success("OTP sent to your email!");
    } catch (err) {
      toast.error("Failed to send OTP");;
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await fetch("https://twiller-v2.onrender.com/verify-audio-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpInput }),
      });
      const data = await res.json();
      if (data.verified) {
        setOtpVerified(true);
        toast.success("OTP verified successfully!");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (err) {
      toast.error("Verification Error");
    }
  };

  const handleDone = () => {
    onAudioFinalized(audioBlob);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      className="audio-modal-wrapper"
    >
      <Fade in={open}>
        <Box className="audio-modal-box">
          <IconButton className="audio-modal-close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <h3>Record Your Voice</h3>
          <AudioRecorder onAudioReady={handleAudioReady} />

          {otpSent && !otpVerified && (
            <div className="otp-section">
              <input
                placeholder="Enter OTP"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
              />
              <Button onClick={verifyOtp}>Verify</Button>
            </div>
          )}

          {otpVerified && (
            <Button variant="contained" onClick={handleDone}>
              Done
            </Button>
          )}
        </Box>
      </Fade>
    </Modal>
  );
}
