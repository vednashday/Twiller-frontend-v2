import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleButton from "react-google-button";
import { useUserAuth } from "../../context/UserAuthContext";
import "./Login.css"; 

const Signup = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredLang, setPreferredLang] = useState("en"); // New state for language, with English as default
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signUp, googleSignIn } = useUserAuth();
  const navigate = useNavigate();

  const handlesubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // 1. Create user in Firebase Auth.
      const userCredential = await signUp(email, password, name);

      // 2. Extract Firebase user details
      const firebaseUser = userCredential.user;

      // 3. Register user to MongoDB with all details, including the selected language
      const user = {
        username,
        name,
        email,
        phone,
        preferredLang: preferredLang, // Use the new state here
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

  // Language options to populate the dropdown
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
          <h2 className="heading">Happening now</h2>
          <h3 className="heading1">Join Twiller today</h3>
          {error && <p className="errorMessage">{error}</p>}
          <form onSubmit={handlesubmit}>
            <input
              className="display-name"
              type="text"
              placeholder="@username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <input
              className="display-name"
              type="text"
              placeholder="Enter Full Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <input
              className="email"
              type="email"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input
              className="phone"
              type="tel"
              placeholder="Phone Number (e.g., +11234567890)"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
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
            <input
              className="password"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <div className="btn-login">
              <button type="submit" className="btn" disabled={isSubmitting}>
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </button>
            </div>
          </form>
          <hr />
          <div className="google-button">
            <GoogleButton className="g-btn" type="light" onClick={handlegooglesignin} />
          </div>
          <div>
            Already have an account?
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: "var(--twitter-color)",
                fontWeight: "600",
                marginLeft: "5px",
              }}
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;