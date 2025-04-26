import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import ForgotPass from "./ForgotPass";
import AdvHost from "../Host/AdvHost"; // ✅ THÊM
import "./styles.css";
import logo from "../assets/Kahoot_logo.png";

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [showAdvHost, setShowAdvHost] = useState(false); // ✅ THÊM
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserRole(user.role || null);
      } catch {
        setUserRole(null);
      }
    }

    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-dropdown")) {
        // ...
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleCreateKahoot = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setShowLogin(true);
    } else {
      if (userRole?.toLowerCase() === "teacher") {
        navigate("/createK");
      } else if (userRole?.toLowerCase() === "user") {
        setShowAdvHost(true); // ✅ show popup cho User
      } else {
        alert("Your role does not have permission to create a Kahoot.");
      }
    }
  };

  return (
    <>
      <header className="header" id="header">
        <nav className="nav container">
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

          <div className="nav__actions">
            <a
              href="#"
              className="link"
              id="sign-up"
              onClick={handleCreateKahoot}
            >
              <i className="fa-regular fa-envelope"></i> Create a Kahoot!
            </a>
          </div>
        </nav>
      </header>

      {/* POPUPS */}
      <Login
        show={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => navigate("/Register")}
        onSwitchToForgot={() => {
          setShowLogin(false);
          setShowForgotPass(true);
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

      <AdvHost
        show={showAdvHost}
        onClose={() => setShowAdvHost(false)}
      />
    </>
  );
}

export default Header;