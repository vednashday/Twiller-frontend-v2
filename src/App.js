import './App.css';
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from './pages/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Login/Signup';
import Feed from './pages/Feed/Feed';
import Explore from './pages/Explore/Explore';
import Notification from './pages/Notification/Notification';
import Messages from './pages/Messages/Messages';
import Profile from './pages/Profile/Profile';
import More from './pages/More/More';
import Lists from './pages/Lists/Lists';
import Bookmark from './pages/Bookmark/Bookmark';
import { UserAuthContextProvider } from './context/UserAuthContext';
import ProtectedRoute from './pages/ProtectedRoute';
import ForgotPassword from './pages/Forgotpassword/ForgotPassword';
import Chatbot from './component/Chatbot';
import ChooseUsername from './component/ChooseUsername';
import SubscriptionPlans from './pages/Subscription/SubsriptionPlans';




function App() {
  const location = useLocation();

  // Define routes where you don't want margin
  const noMarginRoutes = ["/login", "/signup", "/forgot-password"];
  const isAuthPage = noMarginRoutes.includes(location.pathname);
  

  return (
    <div  id="recaptcha-container" className={isAuthPage ? "" : "app"}>
      <UserAuthContextProvider>
        <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {!isAuthPage }
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          >
            <Route index element={<Feed />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/choose-username"
            element={
            <ProtectedRoute>
              <ChooseUsername />
            </ProtectedRoute>
            }
          />

          <Route path="/home" element=
          {
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }>
            <Route path="feed" element={<Feed />} />
            <Route path="explore" element={<Explore />} />
            <Route path="notification" element={<Notification />} />
            <Route path="messages" element={<Messages />} />
            <Route path="lists" element={<Lists />} />
            <Route path="bookmarks" element={<Bookmark />} />
            <Route path="profile" element={<Profile />} />
            <Route path="more" element={<More />} />
            <Route path="subscription" element={<SubscriptionPlans />}/>
          </Route>

          
        </Routes>
      </UserAuthContextProvider>
    </div>
  );
}

export default App;
