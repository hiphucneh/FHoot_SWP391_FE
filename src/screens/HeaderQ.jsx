import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./HeaderQ.module.css";
import logo from "../assets/Kahoot_logo.png";

const HeaderQ = ({ onSave }) => {
  const navigate = useNavigate();
  const quizTitle = localStorage.getItem("quizTitle") || "Untitled Quiz";

  const handleExit = () => {
    navigate("/"); // hoặc navigate(-1);
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <img src={logo} alt="Kahoot Logo" className={styles.logo} />
        <h2 className={styles.title}>{quizTitle}</h2>
      </div>
      <div className={styles.right}>
        <Button onClick={handleExit} className={styles.button}>
          Exit
        </Button>
        <Button type="primary" onClick={onSave} className={styles.button}>
          Save
        </Button>
      </div>
    </header>
  );
};

export default HeaderQ;
