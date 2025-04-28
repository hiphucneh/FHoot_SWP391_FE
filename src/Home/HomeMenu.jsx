import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";
import ForgotPass from "../components/ForgotPass";
import AccountScreen from "../AccountSetting/AccountScreen";
import HomeForUser from "../Home/HomeForUser.jsx";
import HomeForTeacher from "../Home/HomeForTeacher.jsx";
import HomeForAdmin from "../Home/HomeForAdmin.jsx";
import BlockJoinGame from "../Host/blockjoingame"; 
import LogOutButton from "../AccountSetting/LogOutButton"; // <-- Thêm import LogOutButton
import "./HomeStyles.css";
import "remixicon/fonts/remixicon.css";

function HomeMenu() {
  const navigate = useNavigate();

  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showBlockJoin, setShowBlockJoin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, [showAccount, showLogin]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();
  };

  const handleJoin = () => {
    const token = localStorage.getItem("token");

    if (joinCode.trim() === "") {
      setJoinError("⚠️ Please enter a Game PIN first!");
      return;
    }

    if (!token) {
      setRedirectAfterLogin("/enter-pin");
      setShowLogin(true);
      return;
    }

    if (user?.role === "Teacher") {
      setShowBlockJoin(true);
      return;
    }

    navigate("/enter-pin", { state: { pin: joinCode.trim() } });
  };

  return (
    <div className="home-menu-wrapper">
      <div className="home-menu">

        {/* Top Section */}
        <div className="home-menu__top">
          <div className="home-menu__join-box">
            <div className="join-input-wrapper">
              <input
                type="text"
                placeholder="Enter join code"
                value={joinCode}
                onChange={(e) => {
                  const value = e.target.value;
                  const numericValue = value.replace(/\D/g, "");
                  if (numericValue.length <= 10) {
                    setJoinCode(numericValue);
                    setJoinError("");
                  }
                }}
                className="join-input"
              />
              {joinError && <div className="join-error">{joinError}</div>}
            </div>

            <button className="join-button" onClick={handleJoin}>
              Join
            </button>
          </div>

          <div className="home-menu__qbit-box">
            {!isLoggedIn ? (
              <>
                <button
                  className="sign-up-button"
                  onClick={() => setShowLogin(true)}
                >
                  Log In
                </button>
                <button
                  className="login-button"
                  onClick={() => navigate("/Register")}
                >
                  Sign Up for FREE!
                </button>
              </>
            ) : (
              <div className="qbit-loggedin">
                <img
                  src={
                    user?.avatar ||
                    `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.email || "guest"}`
                  }
                  alt="avatar"
                  className="qbit-avatar"
                  onClick={() => setShowAccount(true)}
                />
                <div className="qbit-welcome">
                  <div>Welcome,</div>
                  <strong>{user?.name || "User"}</strong>
                </div>
                {/* 👉 THAY nút logout cũ bằng LogOutButton mới */}
                <LogOutButton onLogout={handleLogout} />
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="home-menu__features">
          {user?.role === "Teacher" && <HomeForTeacher />}
          <HomeForUser
            setShowLogin={setShowLogin}
            setRedirectAfterLogin={setRedirectAfterLogin}
          />
          <HomeForAdmin role={user?.role} />
          ...............................................................................................................................................................................................................................................................................................................................................................................................................
        </div>
      </div>

      {/* Modals */}
      <Login
        show={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => navigate("/Register")}
        onSwitchToForgot={() => {
          setShowLogin(false);
          setShowForgotPass(true);
        }}
        redirectPath={redirectAfterLogin || "/Home"}
      />

      <ForgotPass
        show={showForgotPass}
        onClose={() => setShowForgotPass(false)}
        onSwitchToLogin={() => {
          setShowForgotPass(false);
          setShowLogin(true);
        }}
      />

      <AccountScreen
        show={showAccount}
        onClose={() => setShowAccount(false)}
        setUser={setUser}
      />

      <BlockJoinGame
        show={showBlockJoin}
        onClose={() => setShowBlockJoin(false)}
        title="Access Restricted"
        message="❌ Only students can join live games. Teachers can host or create instead."
        buttonText="Got it!"
      />
    </div>
  );
}

export default HomeMenu;
