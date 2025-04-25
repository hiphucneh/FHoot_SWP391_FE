import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import ForgotPass from "./ForgotPass";
import AccountScreen from "../AccountSetting/AccountScreen.jsx";
import "./styles.css";
import logo from "../assets/Kahoot_logo.png";

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-dropdown")) {
        // Nếu muốn reset dropdown gì đó, nhưng giờ đã bỏ dropdown
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <>
      <header className="header" id="header">
        <nav className="nav container">
          {/* Logo */}
          <div
            className="nav__logo"
            onClick={() => {
              navigate("/");
              window.location.href = "/Home";
            }}
            style={{ cursor: "pointer" }}
          >
            <img src={logo} alt="Kahoot Logo" className="logo-image" />
          </div>

          {/* Mobile menu */}
          <div className={`nav__menu ${showMenu ? "show-menu" : ""}`} id="nav-menu">
            <ul className="nav__list">
              <li className="nav__item">
                <a href="#" className="nav__link">Join a game</a>
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

          {/* Actions */}
          <div className="nav__actions">
            {/* Create a Kahoot button */}
            <a
              href="#"
              className="link"
              id="sign-up"
              onClick={(e) => {
                e.preventDefault();
                if (isLoggedIn) {
                  navigate("/createK");
                } else {
                  setShowLogin(true);
                }
              }}
            >
              <i className="fa-regular fa-envelope"></i> Create a Kahoot!
            </a>
          </div>
        </nav>
      </header>

      {/* Popups */}
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

      <Register
        show={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />

      <ForgotPass
        show={showForgotPass}
        onClose={() => setShowForgotPass(false)}
        onSwitchToLogin={() => {
          setShowForgotPass(false);
          setShowLogin(true);
        }}
      />

      {/* Account Popup - bạn có thể giữ nếu sau này cần */}
      <AccountScreen
        show={false}
        onClose={() => {}}
        setUser={() => {}}
      />
    </>
  );
}

export default Header;
