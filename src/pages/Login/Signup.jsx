import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleButton from "react-google-button";
import { useUserAuth } from "../../context/UserAuthContext";
import { useTranslation } from "react-i18next";
import "./Login.css";

const Signup = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredLang, setPreferredLang] = useState("en");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const { signUp, googleSignIn } = useUserAuth();
  const navigate = useNavigate();

  const handlesubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const phoneRegex = /^\+\d{1,15}$/;
    if (phone.trim() !== "" && !phoneRegex.test(phone)) {
      setPhoneError(t("invalid_phone"));
      setIsSubmitting(false);
      return;
    }

    try {
      const userCredential = await signUp(email, password, name);
      const firebaseUser = userCredential.user;

      const user = {
        username,
        name,
        email,
        phone,
        preferredLang,
      };

      const response = await fetch("https://twiller-v2.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        navigate("/");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register user in database.");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error during signup:", error.code, error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlegooglesignin = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/");
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };

  const langOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "hi", label: "Hindi" },
    { value: "pt", label: "Portuguese" },
    { value: "zh", label: "Chinese" },
    { value: "fr", label: "French" },
  ];

  return (
    <div className="login-container signup-bg">
      <div className="form-container">
        <div className="form-box">
          <TwitterIcon className="Twittericon" style={{ color: "skyblue", fontSize: "40px" }} />
          <h2 className="heading">{t("happening_now")}</h2>
          <h3 className="heading1">{t("join_twiller")}</h3>
          {error && <p className="errorMessage">{error}</p>}
          <form className="form-input-cont" onSubmit={handlesubmit}>
            <input
              className="display-name"
              type="text"
              placeholder={t("username_placeholder")}
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <input
              className="display-name"
              type="text"
              placeholder={t("full_name_placeholder")}
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <input
              className="email"
              type="email"
              placeholder={t("email_placeholder")}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input
              className="display-name"
              type="tel"
              placeholder={t("phone_placeholder")}
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              pattern="^\+\d{1,15}$"
            />
            <input
              className="password"
              type="password"
              placeholder={t("password_placeholder")}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <select
              className="language-selector"
              value={preferredLang}
              onChange={(e) => setPreferredLang(e.target.value)}
            >
              {langOptions.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            <div className="btn-login">
              <button type="submit" className="btn" disabled={isSubmitting}>
                {isSubmitting ? t("signing_up") : t("sign_up")}
              </button>
            </div>
          </form>
          <hr />
          <div className="google-button">
            <GoogleButton className="g-btn" type="light" onClick={handlegooglesignin} />
          </div>
          <div>
            {t("already_have_account")}
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: "var(--twitter-color)",
                fontWeight: "600",
                marginLeft: "5px",
              }}
            >
              {t("login")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
