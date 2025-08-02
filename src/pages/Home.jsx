import React, { useEffect } from "react";
import Widgets from "./Widgets/Widgets";
import Sidebar from "./Sidebar/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import Chatbot from "../component/Chatbot";
import useLoggedinuser from "../hooks/useLoggedinuser"; // Assuming you use this hook

const Home = () => {
  const { logOut, user, loading } = useUserAuth();
  const [loggedinuser] = useLoggedinuser(); // Get user from MongoDB
  const navigate = useNavigate();

  const handlelogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  // 🔁 Redirect to /choose-username if loggedinuser has no username
  useEffect(() => {
    if (!loading && user && loggedinuser && !loggedinuser.username) {
      navigate("/choose-username");
    }
  }, [loading, user, loggedinuser, navigate]);

  return (
    <div className="app">
      <Sidebar handlelogout={handlelogout} user={user} />
      <Outlet />
      <Widgets />
      <Chatbot />
    </div>
  );
};

export default Home;
