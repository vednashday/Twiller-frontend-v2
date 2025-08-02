import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  updateProfile,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "./firebase";

const userAuthContext = createContext();

export function UserAuthContextProvider(props) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mongoUser, setMongoUser] = useState(null);

  function logIn(email, password) {
    return setPersistence(auth, browserLocalPersistence).then(() =>
      signInWithEmailAndPassword(auth, email, password)
    );
  }

  function signUp(email, password, username) {
    return createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        return updateProfile(userCredential.user, {
          displayName: username,
        }).then(() => userCredential);
      }
    );
  }

  function logOut() {
    return signOut(auth);
  }

  function googleSignIn() {
    const provider = new GoogleAuthProvider();
    return setPersistence(auth, browserLocalPersistence).then(() =>
      signInWithPopup(auth, provider)
    );
  }

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setUser(currentUser);
    setLoading(false);

    if (currentUser) {
      try {
        const idToken = await currentUser.getIdToken();
        const res = await fetch(`https://twiller-v2.onrender.com/loggedinuser?email=${currentUser.email}`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        const data = await res.json();
        setMongoUser(data);
      } catch (err) {
        console.error("Failed to fetch mongo user:", err);
        setMongoUser(null);
      }
    } else {
      setMongoUser(null);
    }
  });

  return () => unsubscribe();
}, []);
  return (
    <userAuthContext.Provider
      value={{
        user,
        setUser,
        mongoUser,
        setMongoUser,
        loading,
        logIn,
        signUp,
        logOut,
        googleSignIn,
      }}
    >
      {!loading && props.children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
