import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./EnterPinCodeScreen.module.css";
import BlockJoinGame from "../Host/blockjoingame"; // Import BlockJoinGame dùng lại

export default function EnterPinCodeScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const [gamePin, setGamePin] = useState("");
  const [showRoleWarning, setShowRoleWarning] = useState(false);

  useEffect(() => {
    // Nếu không phải reload thì reload trang
    if (performance.navigation.type !== 1) {
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    // Nếu có PIN từ trang trước truyền qua thì set vào input
    if (location.state?.pin) {
      setGamePin(location.state.pin);
    }

    // Kiểm tra role trong localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const role = user.role?.toLowerCase();
        if (role === "admin" || role === "teacher") {
          setShowRoleWarning(true); // Nếu Admin hoặc Teacher => hiện cảnh báo
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, [location.state]);

  const handleBackHome = () => {
    navigate("/Home");
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      
      {/* Nút Back */}
      <button className={styles.backButton} onClick={handleBack}>
        ← Back
      </button>

      {/* Form nhập Game PIN */}
      <div className={`${styles.formBox} ${styles.fadeIn}`}>
        <h1 className={styles.title}>Enter Game PIN</h1>
        <input
          type="text"
          placeholder="Game PIN"
          value={gamePin}
          onChange={(e) => {
            const value = e.target.value;
            const numericValue = value.replace(/\D/g, ""); // chỉ cho nhập số
            if (numericValue.length <= 10) {
              setGamePin(numericValue);
            }
          }}
          className={styles.inputField}
        />
        <button className={styles.joinButton}>
          Join
        </button>
      </div>

      {/* Footer */}
      <div className={`${styles.footer} ${styles.fadeIn}`}>
        <p>
          Create your own kahoot for FREE at{" "}
          <a href="https://kahoot.com" target="_blank" rel="noopener noreferrer">
            kahoot.com
          </a>
        </p>
        <div className={styles.footerLinks}>
          <a href="#">Terms</a> | <a href="#">Privacy</a> | <a href="#">Cookie notice</a>
        </div>
      </div>

      {/* Popup Block nếu không phải Student */}
      <BlockJoinGame
        show={showRoleWarning}
        onClose={handleBackHome}
        title="Access Restricted"
        message="🚫 This area is only for Students to join live games."
        buttonText="Back to Home"
      />
    </div>
  );
}
