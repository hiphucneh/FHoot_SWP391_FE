import { useState } from "react";
import Login from "./Login";
import Register from "./Register"; // Import thêm

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false); // Thêm state mới

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
            <a
              href="#"
              className="link"
              id="sign-up"
              onClick={() => setShowLogin(true)}
            >
              <i className="fa-regular fa-envelope"></i> Create a Kahoot!
            </a>
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
    </>
  );
}

export default Header;
