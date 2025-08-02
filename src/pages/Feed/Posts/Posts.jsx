import React from "react";
import "./Posts.css";
import { Avatar } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PublishIcon from "@mui/icons-material/Publish";
import WaveformTweet from "../../../component/WaveformTweet";

const Posts = ({ p }) => {
  const {
    name = "Unknown",
    username,
    photo,
    post,
    profilephoto,
    audio,
    createdAt,
  } = p;

  const handle = username ? `@${username}` : "@user";
  const avatar = profilephoto || "/default-profile.jpg";

  return (
    <div className="post">
      <div className="post__avatar">
        <Avatar src={avatar} />
      </div>

      <div className="post__body">
        <div className="post__header">
          <div className="post__headerText">
            <h3>
              {name}
              <span className="post__headerSpecial">
                <VerifiedUserIcon className="post__badge" /> {handle}
              </span>
              {createdAt && (
                <span className="post__timestamp">
                  · {new Date(createdAt).toLocaleString()}
                </span>
              )}
            </h3>
          </div>

          <div className="post__headerDescription">
            {post && <p>{post}</p>}
          </div>
        </div>

        {audio && <WaveformTweet audioUrl={audio} />}

        {photo && (
          <img
            src={photo}
            alt={`posted by ${handle}`}
            className="post__image"
            loading="lazy"
          />
        )}

        <div className="post__footer">
          <button className="icon-button">
            <ChatBubbleOutlineIcon fontSize="small" />
          </button>
          <button className="icon-button">
            <RepeatIcon fontSize="small" />
          </button>
          <button className="icon-button">
            <FavoriteBorderIcon fontSize="small" />
          </button>
          <button className="icon-button">
            <PublishIcon fontSize="small" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Posts;
