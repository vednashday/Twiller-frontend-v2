import { getAuth, sendPasswordResetEmail } from "firebase/auth";

// Get the Firebase Auth instance (assumes Firebase app is already initialized)
const auth = getAuth();

/**
 * Sends a password reset email to the specified email address.
 * @param {string} email - The email address of the user who forgot their password.
 * @returns {Promise<void>} A promise that resolves if the email is sent, or rejects with an error.
 */
export async function sendPasswordResetEmailWrapped(email) {
  try {
    if (!email || email.trim() === '') {
      throw new Error("Email address cannot be empty.");
    }

    await sendPasswordResetEmail(auth, email);
    console.log(`Password reset email request sent for ${email}`);
    
  } catch (error) {
    console.error("Error sending password reset email:", error.code, error.message);
    throw error; // Re-throw so it can be handled by the calling component
  }
}
