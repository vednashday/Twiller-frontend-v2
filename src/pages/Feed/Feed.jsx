import React, { useEffect, useState } from "react";
import "./Feed.css";
import Posts from "./Posts/Posts";
import Tweetbox from "./Tweetbox/Tweetbox";
import { useTranslation } from "react-i18next";

const Feed = () => {
  const [post, setpost] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
    
  useEffect(() => {
    setLoading(true);
    try {
      fetch("https://twiller-v2.onrender.com/post")
        .then((res) => res.json())
        .then((data) => {
          setpost(data);
        });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [post]);

  return (
    <div className="feed">
      {loading ? (
        <div className="loader-inside-main">
          <p>{t("loading_profile")}</p>
          <div className="spinner" />
        </div>
      ) : (
      <><div className="feed__header">
            <h2>{t("Home")}</h2>
          </div><Tweetbox />
      {post.map((p) => (<Posts key={p._id} p={p} />))}
      </>
    )
  }</div>
  );
};

export default Feed;
