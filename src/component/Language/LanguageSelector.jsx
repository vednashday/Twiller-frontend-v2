import React, { useState } from "react";
import axios from "axios";
import { useUserAuth } from "../../context/UserAuthContext"; // Import your custom hook

const LanguageSelector = () => {
  // Use the custom hook to get the user and token from the context
  const { user, loading } = useUserAuth();

  // You will need to get the ID token from the user object
  const [idToken, setIdToken] = useState(null);

  useState(() => {
    const getToken = async () => {
      if (user) {
        const token = await user.getIdToken();
        setIdToken(token);
      }
    }
    getToken();
  }, [user]);

  const [language, setLanguage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const sendOtp = async () => {
    if (!user || !idToken) {
      setMessage("You must be logged in to change your language.");
      return;
    }
    if (!language) {
      setMessage("Please select a language.");
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
      setMessage(`OTP sent to your ${language === 'fr' ? 'email' : 'mobile number'}.`);
      setOtpSent(true);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async () => {
    if (!user || !idToken) {
      setMessage("You must be logged in to change your language.");
      return;
    }
    if (!otp) {
      setMessage("Please enter the OTP.");
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
      // Optional: Update your local app state with the new language
      // For example, in your context, you might refetch the mongoUser
      // or update its `preferredLang` property.
      
      // Reset states on success
      setOtpSent(false);
      setOtp("");
      setLanguage("");
    } catch (err) {
      setMessage(err.response?.data?.message || "OTP verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // The actual language values to send to the backend
  const langOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "hi", label: "Hindi" },
    { value: "pt", label: "Portuguese" },
    { value: "zh", label: "Chinese" },
    { value: "fr", label: "French" },
  ];

  if (loading) {
      return <div>Loading user data...</div>;
  }
  
  return (
    <div className="p-6 bg-white max-w-md mx-auto rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Change Language</h2>
      {user ? (
        <>
          <p className="text-sm text-gray-500">Logged in as: {user.email}</p>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            disabled={otpSent || isSubmitting}
          >
            <option value="">Select Language</option>
            {langOptions.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          {!otpSent ? (
            <button
              onClick={sendOtp}
              className={`w-full text-white py-2 rounded ${
                language && !isSubmitting ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={!language || isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send OTP"}
            </button>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                An OTP has been sent. Please check your {language === 'fr' ? 'email' : 'mobile number'}.
              </p>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border rounded"
                disabled={isSubmitting}
              />
              <button
                onClick={verifyOtp}
                className={`w-full text-white py-2 rounded ${
                  otp && !isSubmitting ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={!otp || isSubmitting}
              >
                {isSubmitting ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}

          {message && (
            <div className={`text-center text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>{message}</div>
          )}
        </>
      ) : (
        <p className="text-center text-red-500">Please log in to change your language.</p>
      )}
    </div>
  );
};

export default LanguageSelector;