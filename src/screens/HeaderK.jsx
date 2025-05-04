import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import bgHeader from "../assets/bg-K.png";
import styles from "./HeaderK.module.css";

const HeaderK = () => {
  const navigate = useNavigate();

  return (
    <div
      className={styles.header}
      style={{
        backgroundImage: `url(${bgHeader})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "60px",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        color: "#333",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          background: "none",
          border: "none",
          fontSize: "16px",
          cursor: "pointer",
          color: "#333",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <ArrowLeftOutlined /> Back
      </button>
    </div>
  );
};

export default HeaderK;
