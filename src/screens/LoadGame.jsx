import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./LoadGame.module.css";

import startSound from "../assets/sound/start.mp3";

const LoadGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionCode, totalQuestion } = location.state || {};

  const [count, setCount] = useState(3);
  const finalRef = useRef(new Audio(startSound));

  useEffect(() => {
    const timer = setInterval(() => {
      if (count > 1) {
        setCount((prev) => prev - 1);
      } else {
        clearInterval(timer);
        finalRef.current.play().catch(() => {});
        setTimeout(() => {
          navigate("/answer-screen", {
            state: { sessionCode, totalQuestion },
          });
        }, 800);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [count, navigate, sessionCode, totalQuestion]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.glowCircle}>
        <div className={styles.count}>{count}</div>
      </div>
    </div>
  );
};

export default LoadGame;
