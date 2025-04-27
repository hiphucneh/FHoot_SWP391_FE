import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./EnterPinCodeScreen.module.css";

export default function EnterPinCodeScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const [gamePin, setGamePin] = useState("");

  useEffect(() => {
    if (location.state?.pin) {
      setGamePin(location.state.pin);
    }
  }, [location.state]);

  const handleBack = () => {
    navigate("/"); // ➤ Quay về Home
  };

  return (
    <div className={styles.container}>
      
      {/* Nút Back ở góc trên trái */}
      <button className={styles.backButton} onClick={handleBack}>
        ← Back
      </button>

      <div className={styles.formBox}>
        <h1 className={styles.title}>Enter Game PIN</h1>
        <input
          type="text"
          placeholder="Game PIN"
          value={gamePin}
          onChange={(e) => {
            const value = e.target.value;
            const numericValue = value.replace(/\D/g, ""); // 🔥 Chỉ số
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

      <div className={styles.footer}>
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
