import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./EnterPinCodeScreen.module.css";

export default function EnterPinCodeScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const [gamePin, setGamePin] = useState("");

  useEffect(() => {
    if (performance.navigation.type !== 1) {
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    if (location.state?.pin) {
      setGamePin(location.state.pin);
    }
  }, [location.state]);

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      
      {/* Nút Back ở góc trên trái */}
      <button className={styles.backButton} onClick={handleBack}>
        ← Back
      </button>

      {/* Form nhập PIN */}
      <div className={`${styles.formBox} ${styles.fadeIn}`}>
        <h1 className={styles.title}>Enter Game PIN</h1>
        <input
          type="text"
          placeholder="Game PIN"
          value={gamePin}
          onChange={(e) => {
            const value = e.target.value;
            const numericValue = value.replace(/\D/g, ""); // Chỉ cho số
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
    </div>
  );
}
