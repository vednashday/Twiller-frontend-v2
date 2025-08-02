import React, { useEffect, useState } from "react";
import "./Tweetbox.css";
import { Avatar, CircularProgress } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import MicIcon from "@mui/icons-material/Mic";
import axios from "axios";
import { useUserAuth } from "../../../context/UserAuthContext";
import AudioModal from "../../../component/AudioModal";
import WaveformTweet from "../../../component/WaveformTweet";
import { toast } from "react-toastify";
import profImg from "../../../image/default-profile.jpg";

export default function Tweetbox() {
  const [post, setPost] = useState("");
  const [imageurl, setImageUrl] = useState("");
  const [isLoadingImage, setLoadingImage] = useState(false);
  const [isAudioModalOpen, setAudioModalOpen] = useState(false);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
  const [recordedAudioURL, setRecordedAudioURL] = useState(null);
  const [tweetsLeft, setTweetsLeft] = useState(null);

  const { mongoUser, user } = useUserAuth();

  const email = mongoUser?.email || user?.email;
  const username = mongoUser?.username || email?.split("@")[0] || "anonymous";
  const name = mongoUser?.name || "";
  const userprofilepic = mongoUser?.profileImage || profImg;

  useEffect(() => {
    const fetchTweetLimit = async () => {
      if (!user) return;
      try {
        const idToken = await user.getIdToken();
        const res = await axios.get("https://twiller-v2.onrender.com/tweet-limit", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        setTweetsLeft(res.data.tweetsLeft);
      } catch (err) {
        console.error("Failed to fetch tweet limit:", err);
      }
    };

    fetchTweetLimit();
  }, [user]);

  const uploadImage = (e) => {
    setLoadingImage(true);
    const file = e.target.files[0];
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "voice_uploads");

    axios
      .post("https://api.cloudinary.com/v1_1/drsqx7pfr/image/upload", fd)
      .then((res) => setImageUrl(res.data.secure_url))
      .finally(() => setLoadingImage(false));
  };

  const isWithinUploadTime = () => {
    const now = new Date();
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    let istHours = utcHours + 5;
    let istMinutes = utcMinutes + 30;

    if (istMinutes >= 60) {
      istMinutes -= 60;
      istHours += 1;
    }
    if (istHours >= 24) {
      istHours -= 24;
    }

    return istHours >= 14 && istHours < 19;
  };

  const handleTweet = async (e) => {
    e.preventDefault();

    if (!user || !mongoUser) {
      toast.error("User not authenticated or data not loaded.");
      return;
    }

    let audioUrl = "";

    if (recordedAudioBlob) {
      const fd = new FormData();
      fd.append("file", recordedAudioBlob);
      fd.append("upload_preset", "voice_uploads");
      fd.append("resource_type", "video");

      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/drsqx7pfr/video/upload",
          fd
        );
        audioUrl = res.data.secure_url;
      } catch (err) {
        toast.error("Failed to upload audio.");
        return;
      }
    }

    const userpost = {
      profilephoto: userprofilepic,
      post,
      photo: imageurl,
      audio: audioUrl,
      username,
      name,
      email,
    };

    try {
      const idToken = await user.getIdToken();
      await axios.post("https://twiller-v2.onrender.com/post", userpost, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      toast.success("Tweet posted!");
      setPost("");
      setImageUrl("");
      setRecordedAudioBlob(null);
      setRecordedAudioURL(null);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Tweet limit reached for your current plan.");
      } else {
        toast.error("Tweet post failed. Try again later.");
      }
      console.error("Tweet post failed:", err);
    }
  };

  return (
    <div className="tweetbox-container">
      <form onSubmit={handleTweet} className="tweetbox-form">
        <div className="tweetbox-left">
          <Avatar src={userprofilepic} />
        </div>

        <div className="tweetbox-right">
          <textarea
            value={post}
            onChange={(e) => setPost(e.target.value)}
            placeholder="What is happening?!"
            className="tweetbox-input"
            rows={3}
            required
          />

          {imageurl && (
            <img src={imageurl} alt="Preview" className="tweetbox-preview" />
          )}

          {recordedAudioURL && <WaveformTweet audioUrl={recordedAudioURL} />}

          <div className="tweetbox_lastline">
            <div className="tweetbox-actions">
              <label htmlFor="image-upload" className="icon-button">
                {isLoadingImage ? (
                  <CircularProgress size={20} />
                ) : (
                  <AddPhotoAlternateOutlinedIcon />
                )}
              </label>
              <input
                id="image-upload"
                type="file"
                onChange={uploadImage}
                style={{ display: "none" }}
              />

              <button
                type="button"
                className="icon-button"
                onClick={() => {
                  if (isWithinUploadTime()) {
                    setAudioModalOpen(true);
                  } else {
                    toast.error("Audio uploads are allowed only from 2 PM to 7 PM IST");
                  }
                }}
              >
                <MicIcon />
              </button>
            </div>

            <div className="tweetbox-submit">
              {tweetsLeft !== null && tweetsLeft !== Infinity && (
                <p className="tweet-limit-info">Tweets left: {tweetsLeft}</p>
              )}
              {tweetsLeft === Infinity && (
                <p className="tweet-limit-info">Unlimited tweets</p>
              )}
              <button type="submit" className="tweetbox-button">
                Tweet
              </button>
            </div>
          </div>
        </div>
      </form>

      
      <AudioModal
        open={isAudioModalOpen}
        onClose={() => setAudioModalOpen(false)}
        onAudioFinalized={(blob) => {
          const url = URL.createObjectURL(blob);
          setRecordedAudioBlob(blob);
          setRecordedAudioURL(url);
        }}
        email={email}
        user={mongoUser}
      />
    </div>
  );
}
