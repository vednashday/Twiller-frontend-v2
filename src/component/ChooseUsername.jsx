import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TwitterIcon from "@mui/icons-material/Twitter";
import { useTranslation } from "react-i18next";
import { useUserAuth } from "../context/UserAuthContext";

const ChooseUsername = () => {
  const { user } = useUserAuth(); // This is the correct way to get the Firebase user object
  
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  
  const [phoneError, setPhoneError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !user?.email) return;

    const phoneRegex = /^\+\d{1,15}$/;
    if (phone.trim() !== "" && !phoneRegex.test(phone)) {
      setPhoneError(t("invalid_phone"));
      setIsSubmitting(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://twiller-v2.onrender.com/userupdate/" + user.email, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, phone }),
      });

      if (res.ok) {
        navigate("/");
        console.log("User data updated successfully!");
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
    <div className="page-box">
      <div className="choose-username-container">
        <div className="choose-username-box">
          <TwitterIcon className="twitter-icon" />
          <h2>Let’s set up your details</h2>
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
            <input
              className="display-name"
              type="tel"
              placeholder={t("phone_placeholder")}
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              pattern="^\+\d{1,15}$"
            />
            <button type="submit" disabled={loading || !username}>
              {loading ? "Saving..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChooseUsername;
