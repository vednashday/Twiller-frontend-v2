import React, { useState } from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleButton from "react-google-button";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./Login.css";
import { useUserAuth } from "../../context/UserAuthContext";

const Login = () => {
  const { t } = useTranslation();
  const [email, seteamil] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");
  const navigate = useNavigate();
  const { googleSignIn, logIn } = useUserAuth();

  const handlesubmit = async (e) => {
    e.preventDefault();
    seterror("");
    try {
      await logIn(email, password);
      navigate("/");
    } catch (error) {
      seterror(error.message);
      window.alert(error.message);
    }
  };

  const handlegooglesignin = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <div className="form-box">
          <TwitterIcon style={{ color: "skyblue", fontSize: "40px" }} />
          <h2 className="heading">{t("happening_now")}</h2>
          {error && <p className="errorMessage">{error}</p>}

          <form onSubmit={handlesubmit}>
            <input
              type="email"
              className="email"
              placeholder={t("email_placeholder")}
              onChange={(e) => seteamil(e.target.value)}
            />
            <input
              type="password"
              className="password"
              placeholder={t("password_placeholder")}
              onChange={(e) => setpassword(e.target.value)}
            />
            <div className="btn-login">
              <button type="submit" className="btn">
                {t("login")}
              </button>
            </div>
          </form>

          <hr />

          <GoogleButton className="g-btn" type="light" onClick={handlegooglesignin} />

          <div>
            {t("no_account")}
            <Link
              to="/signup"
              style={{
                textDecoration: "none",
                color: "var(--twitter-color)",
                fontWeight: "600",
                marginLeft: "5px",
              }}
            >
              {t("signup")}
            </Link>
          </div>

          <div>
            <Link
              to="/forgot-password"
              style={{
                textDecoration: "none",
                color: "var(--twitter-color)",
                fontWeight: "600",
                marginLeft: "5px",
              }}
            >
              {t("forgot_password")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
