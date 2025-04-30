import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./AdminStyles.module.css";
import logo from "../assets/Kahoot_logo.png";
import userIcon from "../assets/user-icon.png";

function AdminHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleBack = () => {
    if (location.pathname === "/system-configuration") {
      navigate("/HomeAdmin");
    } else {
      navigate("/Home");
    }
  };

  const handleGoToSystemConfig = () => {
    navigate("/system-configuration");
  };

  const handleReloadAdmin = () => {
    window.location.href = "/HomeAdmin";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/Home";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={styles.adminHeader}>
      <div className={styles.leftSection}>
        <button className={styles.backButton} onClick={handleBack}>
          {location.pathname === "/system-configuration"
            ? "← Back"
            : "← Back to Home"}
        </button>

        {/* Hiện nút System Configuration nếu KHÔNG ở trang đó */}
        {location.pathname !== "/system-configuration" && (
          <button
            className={styles.configButton}
            onClick={handleGoToSystemConfig}
          >
            ⚙ System Configuration
          </button>
        )}
      </div>

      <div className={styles.centerSection} onClick={handleReloadAdmin}>
        <img src={logo} alt="Kahoot Logo" className={styles.adminLogo} />
        <span className={styles.logoText}>Administer</span>
      </div>

      <div className={styles.rightSection} ref={dropdownRef}>
        <div
          className={styles.userIconWrapper}
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          <img src={userIcon} alt="User Icon" className={styles.userIcon} />
        </div>

        {dropdownOpen && (
          <div className={styles.dropdownMenu}>
            <button className={styles.dropdownItem} onClick={handleLogout}>
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default AdminHeader;
