import React from "react";
import "../../Feed/Posts/Posts.css";
import { Avatar } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PublishIcon from "@mui/icons-material/Publish";
import WaveformTweet from "../../../component/WaveformTweet";
import useLoggedinuser from "../../../hooks/useLoggedinuser";



const Posts = ({ p }) => {
  const [loggedinuser] = useLoggedinuser(); 
  const {  photo, post, profilephoto, audio } = p;

  return (
    <div className="post">
      <div className="post__avatar">
        <Avatar src={profilephoto} />
      </div>

      <div className="post__body">
        <div className="post__header">
          <div className="post__headerText">
            <h3>
              {loggedinuser?.name}{" "}
              <span className="post__headerSpecial">
                <VerifiedUserIcon className="post__badge" /> @{loggedinuser?.username}
              </span>
            </h3>
          </div>

          <div className="post__headerDescription">
            {post && <p>{post}</p>}
          </div>
        </div>
        {audio && (
          <WaveformTweet audioUrl={audio} />
        )}

        {photo && (
          <img src={photo} alt="tweet visual" className="post__image" />
        )}

        

        <div className="post__footer">
          <ChatBubbleOutlineIcon className="post__footer__icon" fontSize="small" />
          <RepeatIcon className="post__footer__icon" fontSize="small" />
          <FavoriteBorderIcon className="post__footer__icon" fontSize="small" />
          <PublishIcon className="post__footer__icon" fontSize="small" />
        </div>
      </div>
    </div>
  );
};

export default Posts;
