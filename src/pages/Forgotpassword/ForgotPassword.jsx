import React, { useState } from "react";
import axios from "axios";
import "./ForgotPassword.css";
import { toast } from "react-toastify";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const { t } = useTranslation(); 
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState("email");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        "https://twiller-v2.onrender.com/forgot-password",
        { identifier: email, method }
      );

      if (method === "generate") {
        setGeneratedPassword(data.message);
      } else {
        toast.success(data.message);
        setGeneratedPassword("");
      }

      setEmail("");
    } catch (err) {
      setGeneratedPassword("");
      if (err.response?.status === 429) {
        toast.warning(t("forgotPassword.dailyLimitWarning"));
      } else {
        toast.error(err.response?.data?.message || "An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <TwitterIcon style={{ color: "skyblue", fontSize: 40 }} />
        <h2 className="forgot-heading">{t("forgotPassword.title")}</h2>
        <p className="forgot-subheading">{t("forgotPassword.subtitle")}</p>

        <form onSubmit={handleSubmit} className="form-box">
          <input
            type="email"
            className="forgot-input"
            placeholder={t("forgotPassword.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />

          <select
            className="forgot-method"
            value={method}
            onChange={(e) => {
              setMethod(e.target.value);
              setGeneratedPassword("");
            }}
            disabled={isLoading}
          >
            <option value="email">{t("forgotPassword.selectMethodEmail")}</option>
            <option value="generate">{t("forgotPassword.selectMethodGenerate")}</option>
          </select>

          <p className="daily-limit-warning">{t("forgotPassword.dailyLimitWarning")}</p>

          <button type="submit" className="forgot-button" disabled={isLoading}>
            {isLoading ? t("forgotPassword.processing") : t("forgotPassword.resetButton")}
          </button>

          {generatedPassword && (
            <div
              style={{
                background: "#e8f5fe",
                border: "1px solid #1da1f2",
                padding: "10px",
                borderRadius: "8px",
                marginTop: "15px",
                color: "#0f1419",
                fontWeight: "bold",
                textAlign: "center",
                wordBreak: "break-word",
              }}
            >
              {generatedPassword}
            </div>
          )}

          <p className="back-to-login">
            {t("forgotPassword.remembered")}
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: "var(--twitter-color)",
                fontWeight: 600,
                marginLeft: 5,
              }}
            >
              {t("forgotPassword.login")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
