import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { auth } from "../../src/context/firebase";

// --- EMAIL OTP ---
export const sendEmailOTP = async (email) => {
  const actionCodeSettings = {
    url: window.location.href,
    handleCodeInApp: true,
  };
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  window.localStorage.setItem("emailForSignIn", email);
};

export const verifyEmailLink = async () => {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    const email = window.localStorage.getItem("emailForSignIn");
    if (email) {
      await signInWithEmailLink(auth, email, window.location.href);
      return true;
    }
  }
  return false;
};

// --- PHONE OTP ---
export const sendPhoneOTP = async (phoneNumber) => {
  if (!auth) throw new Error("Firebase auth not initialized");

  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      { size: "invisible" },
      auth
    );
    
    // ⚠️ THIS IS NECESSARY to complete setup
    await window.recaptchaVerifier.render();
  }

  const confirmation = await signInWithPhoneNumber(
    auth,
    phoneNumber,
    window.recaptchaVerifier
  );
  window.confirmationResult = confirmation;
};
export const verifyPhoneOTP = async (code) => {
  const result = await window.confirmationResult.confirm(code);
  return result.user ? true : false;
};
