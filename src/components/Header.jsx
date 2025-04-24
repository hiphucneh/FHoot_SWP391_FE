import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import ForgotPass from "./ForgotPass";
import './styles.css';

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPass, setShowForgotPass] = useState(false); // ✅ thêm state bị thiếu
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Kiểm tra token trong localStorage
  }, []);

  const handleLogout = () => {
    window.location.reload();
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <>
      <header className="header" id="header">
        <nav className="nav container">
          <a href="#" className="nav__logo">
            Logo
          </a>

          <div
            className={`nav__menu ${showMenu ? "show-menu" : ""}`}
            id="nav-menu"
          >
            <ul className="nav__list">
              <li className="nav__item">
                <a href="#" className="nav__link">
                  Join a game
                </a>
              </li>
            </ul>

            <div
              className="nav__close"
              id="nav-close"
              onClick={() => setShowMenu(false)}
            >
              <i className="ri-close-line"></i>
            </div>
          </div>

          <div className="nav__actions">
            {!isLoggedIn ? (
              <a
                href="#"
                className="link"
                id="sign-up"
                onClick={(e) => {
                  e.preventDefault();
                  setShowLogin(true); // Hiển thị login modal
                }}
              >
                <i className="fa-regular fa-envelope"></i> Create a Kahoot!
              </a>
            ) : (
              <>
                <a
                  href="#"
                  className="link"
                  id="sign-up"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/createK'); // Chuyển sang /createK nếu đã đăng nhập
                  }}
                >
                  <i className="fa-regular fa-envelope"></i> Create a Kahoot!
                </a>

                <button
                  className="logout-button"
                  onClick={handleLogout} // Logout
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Login Overlay */}
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

      {/* Register Overlay */}
      <Register
        show={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />

      {/* Forgot Password Overlay */}
      <ForgotPass
        show={showForgotPass}
        onClose={() => setShowForgotPass(false)}
        onSwitchToLogin={() => {
          setShowForgotPass(false);
          setShowLogin(true);
        }}
      />
    </>
  );
}

export default Header;
