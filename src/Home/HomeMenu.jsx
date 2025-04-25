import { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import ForgotPass from '../components/ForgotPass';
import './HomeStyles.css';
import 'remixicon/fonts/remixicon.css';

function HomeMenu() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPass, setShowForgotPass] = useState(false);

  return (
    <div className="home-menu-wrapper">
      <div className="home-menu">
        {/* Top Section: Join Code + Avatar Box */}
        <div className="home-menu__top">
          <div className="home-menu__join-box">
            <input type="text" placeholder="Enter join code" className="join-input" />
            <button className="join-button">Join</button>
          </div>

          <div className="home-menu__qbit-box">
            <button
              className="sign-up-button"
              onClick={() => setShowLogin(true)}
            >
              Log In
            </button>
            <button
              className="login-button"
              onClick={() => setShowRegister(true)}
            >
              Sign Up for FREE!
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="home-menu__features">
          <h2 className="features-title">Why kids love Kahoot!</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎮</div>
              <h3>Game-based Learning</h3>
              <p>Learning feels like playtime with quizzes and competitions!</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Colorful & Fun</h3>
              <p>Bright colors and animations that keep kids engaged.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍🏫</div>
              <h3>For Class & Home</h3>
              <p>Perfect for classrooms, homework, or fun with friends.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Learn & Improve</h3>
              <p>Track progress while having fun. Education made exciting!..............................................................................................................................................................................................................................................................................................................................</p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <Login
        show={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
        onSwitchToForgot={() => {
          setShowLogin(false);
          setShowForgotPass(true);
        }}
      />

      {/* Register Modal */}
      <Register
        show={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />

      {/* Forgot Password Modal */}
      <ForgotPass
        show={showForgotPass}
        onClose={() => setShowForgotPass(false)}
        onSwitchToLogin={() => {
          setShowForgotPass(false);
          setShowLogin(true);
        }}
      />
    </div>
  );
}

export default HomeMenu;
