import React from "react";
import "./widget.css";
import { TwitterTimelineEmbed, TwitterTweetEmbed } from "react-twitter-embed";
import { Search } from "@mui/icons-material";

const Widgets = () => {
  return (
    <div className="widgets__widgetContainer">
      <h2>What's Happening</h2>

      <TwitterTweetEmbed tweetId="1942193579729785125" />
      <TwitterTweetEmbed tweetId="1940622754144801245" />

      <TwitterTimelineEmbed
        sourceType="url"
        url="https://twitter.com/hashtag/cats"
        options={{ height: 300 }}
      />

      <TwitterTimelineEmbed
        sourceType="profile"
        screenName="cats"
        options={{ height: 300 }}
      />
    </div>
  );
};

export default Widgets;
