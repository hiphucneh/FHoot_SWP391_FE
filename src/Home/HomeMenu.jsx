import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';
import ForgotPass from '../components/ForgotPass';
import AccountScreen from '../AccountSetting/AccountScreen';
import HomeForUser from '../Home/HomeForUser.jsx';
import './HomeStyles.css';
import 'remixicon/fonts/remixicon.css';

function HomeMenu() {
  const navigate = useNavigate();

  const [joinCode, setJoinCode] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, [showAccount, showLogin]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();
  };

  const handleJoin = () => {
    if (joinCode.trim() !== "") {
      navigate("/enter-pin", { state: { pin: joinCode.trim() } });
    } else {
      alert("Please enter a Game PIN first!");
    }
  };

  return (
    <div className="home-menu-wrapper">
      <div className="home-menu">

        {/* Top Section */}
        <div className="home-menu__top">
          <div className="home-menu__join-box">
            <input
              type="text"
              placeholder="Enter join code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="join-input"
            />
            <button className="join-button" onClick={handleJoin}>
              Join
            </button>
          </div>

          <div className="home-menu__qbit-box">
            {!isLoggedIn ? (
              <>
                <button className="sign-up-button" onClick={() => setShowLogin(true)}>
                  Log In
                </button>
                <button className="login-button" onClick={() => navigate("/Register")}>
                  Sign Up for FREE!
                </button>
              </>
            ) : (
              <div className="qbit-loggedin">
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.email || 'guest'}`}
                  alt="avatar"
                  className="qbit-avatar"
                  onClick={() => setShowAccount(true)}
                />
                <div className="qbit-welcome">
                  <div>Welcome,</div>
                  <strong>{user?.name || 'User'}</strong>
                </div>
                <button className="login-button logout-button" onClick={handleLogout}>
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="home-menu__features">
          <HomeForUser setShowLogin={setShowLogin} setRedirectAfterLogin={setRedirectAfterLogin} />
          
          <h2 className="features-title">Why kids love Kahoot!</h2>
          <div className="features-grid">
            {/* Feature cards */}
            <div className="feature-card"><div className="feature-icon">🎮</div><h3>Game-based Learning</h3><p>Learning feels like playtime with quizzes and competitions!</p></div>
            <div className="feature-card"><div className="feature-icon">🎨</div><h3>Colorful & Fun</h3><p>Bright colors and animations that keep kids engaged.</p></div>
            <div className="feature-card"><div className="feature-icon">👨‍🏫</div><h3>For Class & Home</h3><p>Perfect for classrooms, homework, or fun with friends.</p></div>
            <div className="feature-card"><div className="feature-icon">📈</div><h3>Learn & Improve</h3><p>Track progress while having fun. Education made exciting!..............................................................................................................................................................................................................................................................................................................................</p></div>
          </div>
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
        redirectPath={redirectAfterLogin || "/Home"} // <== new
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
    </div>
  );
}

export default HomeMenu;
