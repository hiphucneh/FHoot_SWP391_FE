import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import ForgotPass from "./ForgotPass";
import AdvHost from "../Host/AdvHost";
import "./styles.css";
import logo from "../assets/Kahoot_logo.png";

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [showAdvHost, setShowAdvHost] = useState(false);
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
        // Đóng dropdown nếu click bên ngoài
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
        setShowAdvHost(true);
      } else {
        alert("Your role does not have permission to create a Kahoot.");
      }
    }
  };

  const handleJoinGame = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setShowLogin(true);
    } else {
      navigate("/enter-pin");
    }
  };

  const handleGoAdmin = (e) => {
    e.preventDefault();
    navigate("/HomeAdmin");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/Home";
  };

  return (
    <>
      <header className="header" id="header">
        <nav className="nav container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          
          {/* Logo ở trái */}
          <div 
            className="nav__logo" 
            onClick={() => { window.location.href = "/HomeAdmin"; }} 
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <img src={logo} alt="Kahoot Logo" className="logo-image" />          </div>

          {/* Menu ở giữa */}
          <div className="nav__menu" id="nav-menu" style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <a className="nav__link" onClick={handleJoinGame} style={{ cursor: "pointer" }}>Join a game</a>
            <a
              href="#"
              className="link"
              id="sign-up"
              onClick={handleCreateKahoot}
              style={{ backgroundColor: "#ebc0c0", borderRadius: "5px", padding: "0.5rem 1rem" }}
            >
              <i className="fa-regular fa-envelope"></i> Create a Kahoot!
            </a>
          </div>

          {/* Góc phải - Admin Options */}
          <div className="nav__actions" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {isLoggedIn && userRole?.toLowerCase() === "admin" && (
              <>
                <button
                  onClick={handleGoAdmin}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#0277bd",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  Management
                </button>
              </>
            )}
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
