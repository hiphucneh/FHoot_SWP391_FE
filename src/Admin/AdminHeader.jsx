import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminStyles.module.css";
import logo from "../assets/Kahoot_logo.png";
import userIcon from "../assets/user-icon.png"; // icon user

function AdminHeader() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleBackHome = () => {
    navigate("/Home");
  };

  const handleReloadAdmin = () => {
    window.location.href = "/HomeAdmin";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/Home";
  };

  // 🛡️ Bắt sự kiện click ra ngoài để tự đóng dropdown
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
        <button className={styles.backButton} onClick={handleBackHome}>
          ← Back to Home
        </button>
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
