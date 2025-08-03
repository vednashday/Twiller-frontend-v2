import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserAuth } from "../../context/UserAuthContext";
import "./LanguageSelector.css";
import { useTranslation } from "react-i18next";

const LanguageSelector = ({ onLanguageChange }) => {
  const { t } = useTranslation();
  const { user, loading } = useUserAuth();
  const [idToken, setIdToken] = useState(null);
  const [language, setLanguage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      if (user) {
        try {
          const token = await user.getIdToken();
          setIdToken(token);
        } catch (error) {
          console.error("Error getting ID token:", error);
        }
      }
    };
    getToken();
  }, [user]);

  const sendOtp = async () => {
    if (!user || !idToken) {
      setMessage(t("auth_error"));
      return;
    }
    if (!language) {
      setMessage(t("select_language"));
      return;
    }
    setIsSubmitting(true);
    setMessage("");

    try {
      await axios.post(
        "https://twiller-v2.onrender.com/send-lang-otp",
        {
          language: language,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      setMessage(
        t(language === "fr" ? "otp_sent_email" : "otp_sent_phone")
      );
      setOtpSent(true);
    } catch (err) {
      setMessage(err.response?.data?.message || t("Error sending OTP"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async () => {
    if (!user || !idToken) {
      setMessage(t("auth_error"));
      return;
    }
    if (!otp) {
      setMessage(t("enter_otp"));
      return;
    }
    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await axios.post(
        "https://twiller-v2.onrender.com/verify-lang-otp",
        {
          otp: otp,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      setMessage(res.data.message);
      if (onLanguageChange) {
        onLanguageChange(language);
      }
      setOtpSent(false);
      setOtp("");
      setLanguage("");
    } catch (err) {
      setMessage(err.response?.data?.message || t("OTP verification failed"));
    } finally {
      setIsSubmitting(false);
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

  if (loading) {
    return (
      <div className="language-selector-container">
        <p>{t("loading_user_data")}</p>
      </div>
    );
  }

  return (
    <div className="language-selector-container">
      <h2 className="selector-title">{t("change_language_title")}</h2>
      {user ? (
        <>
          <p className="user-email-info">{t("logged_in_as")}: {user.email}</p>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="language-input"
            disabled={otpSent || isSubmitting}
          >
            <option value="">{t("select_language_option")}</option>
            {langOptions.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          {!otpSent ? (
            <button
              onClick={sendOtp}
              className={`twiller-button primary ${!language || isSubmitting ? "disabled" : ""}`}
              disabled={!language || isSubmitting}
            >
              {isSubmitting ? t("sending_otp") : t("send_otp")}
            </button>
          ) : (
            <>
              <p className="user-email-info">
                {t(language === "fr" ? "otp_sent_email" : "otp_sent_phone")}
              </p>
              <input
                type="text"
                placeholder={t("enter_otp_placeholder")}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="language-input"
                disabled={isSubmitting}
              />
              <button
                onClick={verifyOtp}
                className={`twiller-button primary ${!otp || isSubmitting ? "disabled" : ""}`}
                disabled={!otp || isSubmitting}
              >
                {isSubmitting ? t("verifying_otp") : t("verify_otp")}
              </button>
            </>
          )}

          {message && (
            <div className={`message ${message.includes("success") ? "success" : "error"}`}>
              {message}
            </div>
          )}
        </>
      ) : (
        <p className="user-email-info">
          {t("not_logged_in_message")}
        </p>
      )}
    </div>
  );
};

export default LanguageSelector;
