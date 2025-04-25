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
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch {}
    }

    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-dropdown")) {
        setShowDropdown(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
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

            {/* User Dropdown */}
            {isLoggedIn && (
              <div className="user-dropdown">
                <img
                  src={
                    user?.avatar ||
                    `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.email || "guest"}`
                  }
                  className="user-icon-img"
                  onClick={() => setShowDropdown(!showDropdown)}
                  alt="user avatar"
                />
                {showDropdown && (
                  <div className="dropdown-menu">
                    <div className="dropdown-item" onClick={() => setShowAccount(true)}>
                      👤 Account
                    </div>
                    <div className="dropdown-item">⚙️ Setting</div>
                    <div className="dropdown-item logout" onClick={handleLogout}>
                      🚪 Log Out
                    </div>
                  </div>
                )}
              </div>
            )}
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

      {/* Account Popup */}
      <AccountScreen
        show={showAccount}
        onClose={() => setShowAccount(false)}
        setUser={setUser} // ✅ Đồng bộ avatar sau khi cập nhật
      />
    </>
  );
}

export default Header;