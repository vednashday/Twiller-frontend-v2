import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import TwitterIcon from "@mui/icons-material/Twitter";
import "./ChooseUsername.css";

const ChooseUsername = () => {
  const { user } = useUserAuth();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !user?.email) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://twiller-v2.onrender.com/userupdate/" + user.email, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (res.ok) {
        navigate("/");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update username");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="choose-username-container">
      <div className="choose-username-box">
        <TwitterIcon className="twitter-icon" />
        <h2>Let’s set up your @username</h2>
        <p className="subtext">This is how people will find you on Twiller.</p>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="@username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button type="submit" disabled={loading || !username}>
            {loading ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChooseUsername;
