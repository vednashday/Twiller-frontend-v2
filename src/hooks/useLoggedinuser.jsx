import { useEffect, useState } from "react";
import { useUserAuth } from "../context/UserAuthContext";

const useLoggedinuser = () => {
  const { user, loading } = useUserAuth();
  const email = user?.email;
  const [loggedinuser, setloggedinuser] = useState(null);

  const fetchLoggedInUser = async () => {
    if (loading || !email) return;
    try {
      const res = await fetch(`https://twiller-v2.onrender.com/loggedinuser?email=${email}`);
      const data = await res.json();
      setloggedinuser(data);
    } catch (err) {
      console.error("Fetch user error:", err);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      if (loading || !email) return;
      try {
        const res = await fetch(`https://twiller-v2.onrender.com/loggedinuser?email=${email}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setloggedinuser(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Fetch error:", err);
        }
      }
    };

    fetchData();
    return () => controller.abort();
  }, [email, loading]);

  return [loggedinuser, setloggedinuser, fetchLoggedInUser];
};

export default useLoggedinuser;
