import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";
import TwitterIcon from "@mui/icons-material/Twitter";
import { useTranslation } from "react-i18next";

function Chatbot() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const chatRef = useRef();

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMessage = { type: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("https://twiller-v2.onrender.com/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (data.tweets && data.tweets.length > 0) {
        const botMessage = {
          type: "bot",
          tweets: data.tweets,
          showAll: false,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: data.message || t("no_tweets_found") },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: t("something_went_wrong") },
      ]);
    }

    setQuery("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleSeeMore = (index) => {
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === index && msg.type === "bot" && msg.tweets
          ? { ...msg, showAll: true }
          : msg
      )
    );
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          type: "bot",
          text: t("chatbot_intro_message"),
          isIntro: true,
        },
      ]);
    }
  }, [open]);

  return (
    <>
      <div className="chatbot-icon" onClick={() => setOpen(!open)}>
        <TwitterIcon className="sidebar__icon" />
      </div>

      {open && (
        <div className="chatbot-container">
          <div className="chat-window" ref={chatRef}>
            {messages.map((msg, i) => {
              if (msg.type === "user") {
                return (
                  <div key={i} className="chat-message user-msg">
                    {msg.text}
                  </div>
                );
              } else if (msg.type === "bot" && msg.tweets) {
                const visibleTweets = msg.showAll
                  ? msg.tweets
                  : msg.tweets.slice(0, 2);
                return (
                  <div key={i}>
                    {visibleTweets.map((tweet, j) => (
                      <div key={j} className="chat-message tweet-card">
                        <div className="tweet-header">
                          <img src={tweet.profilephoto} alt="avatar" />
                          <div>
                            <strong>{tweet.name}</strong>
                            <span>@{tweet.username}</span>
                          </div>
                        </div>
                        <div className="tweet-content">{tweet.post}</div>
                        {tweet.photo && (
                          <img
                            className="tweet-image"
                            src={tweet.photo}
                            alt="tweet"
                          />
                        )}

                        {tweet.audio && (
                          <audio controls className="tweet-audio">
                            <source src={tweet.audio} type="audio/mpeg" />
                            {t('unsupported_audio')}
                          </audio>
                        )}
                      </div>
                    ))}
                    {!msg.showAll && msg.tweets.length > 2 && (
                      <div className="chat-message bot-msg see-more">
                        <button onClick={() => handleSeeMore(i)}>
                          {t('see_more')}
                        </button>
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div
                    key={i}
                    className={`chat-message bot-msg ${
                      msg.isIntro ? "intro" : ""
                    }`}
                  >
                    {msg.text}
                  </div>
                );
              }
            })}
          </div>

          <div className="chat-input">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t('input_placeholder')}
            />
            <button onClick={handleSend}>{t('send_button')}</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
