import React, { useState } from "react";
import { FiLogOut } from "react-icons/fi"; // Icon logout

function LogOutButton({ onLogout }) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      if (onLogout) onLogout();
    }, 1000); // ⏳ Chờ 1 giây trước khi logout
  };

  return (
    <button
      className={`login-button logout-button ${isClicked ? "clicked" : ""}`}
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        fontSize: "16px",
        transition: "all 0.3s ease", // Smooth
        transform: isClicked ? "scale(0.95)" : "scale(1)", // Ấn vào thu nhỏ nhẹ
        opacity: isClicked ? 0.7 : 1 // Ấn vào mờ nhẹ
      }}
    >
      <FiLogOut size={20} />
      <span>Log Out</span>
    </button>
  );
}

export default LogOutButton;
