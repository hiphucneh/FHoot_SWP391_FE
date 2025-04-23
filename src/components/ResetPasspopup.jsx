import { useState } from "react";
import './styles.css';
import 'remixicon/fonts/remixicon.css';

function ResetPasspopup({ email, onClose, onBackToForgot }) {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 5);
    setOtp(value);
    setMessage("");
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    setMessage("");
  };

  const handleReset = async () => {
    if (otp.length !== 5 || newPassword.length < 6) {
      setMessage("Enter a valid 5-digit OTP and a new password (min 6 characters)");
      return;
    }

    try {
      const res = await fetch("https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword })
      });

      const result = await res.json();
      if (result.statusCode === 200) {
        alert("Password reset successful!");
        onClose();
      } else {
        setMessage(result.message || "Failed to reset password");
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div className="login show-login" id="reset-popup">
      <form className="login__form">
        <h2 className="login__title">Reset Password</h2>
        <p className="login__description">We’ve sent a 5-digit code to {email}</p>

        <div className="login__group">
          <div>
            <label htmlFor="otp" className="login__label">OTP Code</label>
            <input
              type="text"
              id="otp"
              className="login__input"
              placeholder="_____"
              value={otp}
              onChange={handleOtpChange}
              maxLength="5"
            />
          </div>
          <div>
            <label htmlFor="new-password" className="login__label">New Password</label>
            <input
              type="password"
              id="new-password"
              className="login__input"
              placeholder="Enter new password"
              value={newPassword}
              onChange={handlePasswordChange}
            />
          </div>
        </div>

        {message && <p className="login__error">{message}</p>}

        <button type="button" className="login__button" onClick={handleReset}>
          Reset Password
        </button>

        <p className="login__signup">
          Wrong email?{" "}
          <a href="#" onClick={(e) => { e.preventDefault(); onBackToForgot(); }}>
            Back to Forgot Password
          </a>
        </p>
      </form>

      <i className="ri-close-line login__close" id="reset-close" onClick={onClose}></i>
    </div>
  );
}

export default ResetPasspopup;
