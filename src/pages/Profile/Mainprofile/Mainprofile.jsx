import React, { useState, useEffect } from "react";
import Post from "../Posts/posts";
import { useNavigate } from "react-router-dom";
import "./Mainprofile.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak";
import LockResetIcon from "@mui/icons-material/LockReset";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import AddLinkIcon from "@mui/icons-material/AddLink";
import Editprofile from "../Editprofile/Editprofile";
import axios from "axios";
import useLoggedinuser from "../../../hooks/useLoggedinuser";
import profImg from "../../../image/default-profile.jpg";
import banImg from "../../../image/default-banner.png";
import { useTranslation } from "react-i18next";


const Mainprofile = ({ user }) => {
  const navigate = useNavigate();
  const [isloading, setisloading] = useState(false); // for image upload
  const [loading, setLoading] = useState(true); // for full profile page load
  const [post, setpost] = useState([]);
  const [loggedinuser, setLoggedinuser, fetchLoggedInUser] = useLoggedinuser();
  const [userVersion, setUserVersion] = useState(0);
  const { t } = useTranslation();

  const username = loggedinuser?.username;

  const triggerUserRefresh = async () => {
    await fetchLoggedInUser();
    setUserVersion((prev) => prev + 1);
  };

  const handleImageUpload = (e, field) => {
    setisloading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set("image", image);

    axios
      .post(
        "https://api.imgbb.com/1/upload?key=b0ea2f6cc0f276633b2a8a86d2c43335",
        formData
      )
      .then((res) => {
        const url = res.data.data.display_url;
        const updateData = {
          email: user?.email,
          [field]: url,
        };
        fetch(`https://twiller-v2.onrender.com/userupdate/${user?.email}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(updateData),
        })
          .then((res) => res.json())
          .then(() => {
            setisloading(false);
            triggerUserRefresh();
          });
      })
      .catch((e) => {
        console.error(e);
        setisloading(false);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) return;

      setLoading(true);
      try {
        const postRes = await fetch(
          `https://twiller-v2.onrender.com/userpost?email=${user.email}`
        );
        const postData = await postRes.json();
        setpost(postData);

        await fetchLoggedInUser();
      } catch (err) {
        console.error("Error loading profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.email, userVersion]);

  

  return (
    <div className="mainprofcont">
      <div className="arrow_user">
        <ArrowBackIcon className="arrow-icon" onClick={() => navigate("/")} />
        <h4 className="heading-4">{username || t("Profile")}</h4>
      </div>

      {loading || !loggedinuser ? (
        <div className="loader-inside-main">
          <p>{t("loading_profile")}</p>
          <div className="spinner" />
        </div>
      ) : (
        <div className="mainprofile">
          <div className="profile-bio">
            <div>
              {/* Cover Image Section */}
              <div className="coverImageContainer">
                <img
                  src={loggedinuser?.coverimage || banImg}
                  alt="Cover"
                  className="coverImage"
                />
                <div className="hoverCoverImage">
                  <div className="imageIcon_tweetButton">
                    <label htmlFor="coverImage" className="imageIcon">
                      {isloading ? (
                        <LockResetIcon className="photoIcon photoIconDisabled" />
                      ) : (
                        <CenterFocusWeakIcon className="photoIcon" />
                      )}
                    </label>
                    <input
                      type="file"
                      hidden
                      id="coverImage"
                      className="imageInput"
                      onChange={(e) => handleImageUpload(e, "coverimage")}
                    />
                  </div>
                </div>
              </div>

              {/* Profile Image and Info */}
              <div className="avatar-img">
                <div className="avatarContainer">
                  <img
                    src={loggedinuser?.profileImage || profImg}
                    alt="Avatar"
                    className="avatar"
                  />
                  <div className="hoverAvatarImage">
                    <div className="imageIcon_tweetButton">
                      <label htmlFor="profileImage" className="imageIcon">
                        {isloading ? (
                          <LockResetIcon className="photoIcon photoIconDisabled" />
                        ) : (
                          <CenterFocusWeakIcon className="photoIcon" />
                        )}
                      </label>
                      <input
                        type="file"
                        hidden
                        id="profileImage"
                        className="imageInput"
                        onChange={(e) => handleImageUpload(e, "profileImage")}
                      />
                    </div>
                  </div>
                </div>

                {/* Username & Edit Profile */}
                <div className="userInfo">
                  <div className="name_cont">
                    <h3 className="heading-3">
                      {loggedinuser?.name ??
                        user?.displayName ??
                        t("unnamed_user")}
                    </h3>
                    <p className="usernameSection">@{loggedinuser?.username}</p>
                    {loggedinuser?.subscription && (
                      <p
                        className={`subscription-status ${loggedinuser.subscription}`}
                      >
                         {t("plan")}: {loggedinuser.subscription.toUpperCase()}
                      </p>
                    )}
                  </div>
                  <div className="edit_btn">
                    <Editprofile
                      user={user}
                      loggedinuser={loggedinuser}
                      refetchUser={triggerUserRefresh}
                    />
                  </div>
                </div>

                {/* Bio, Location, Website */}
                <div className="infoContainer">
                  {loggedinuser?.bio ? (
                    <p>{loggedinuser.bio}</p>
                  ) : (
                    <p style={{ color: "#999" }}>{t("no_bio")}</p>
                  )}
                  <div className="locationAndLink">
                    {loggedinuser?.location ? (
                      <p className="subInfo">
                        <MyLocationIcon /> {loggedinuser.location}
                      </p>
                    ) : (
                      <p style={{ color: "#999" }}>{t("no_location")}</p>
                    )}
                    {loggedinuser?.website ? (
                      <p className="subInfo link">
                        <AddLinkIcon /> {loggedinuser.website}
                      </p>
                    ) : (
                      <p style={{ color: "#999" }}>{t("no_website")}</p>
                    )}
                  </div>

                  
                </div>

                {/* Tweets */}
                <h4 className="tweetsText">{t("tweets")}</h4>
                <hr />
              </div>

              {/* Posts */}
              {post.map((p) => (
                <Post key={p._id} p={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mainprofile;

