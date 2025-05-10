import { useState } from "react";
import './styles.css';
import SuccessForgotpopup from './SuccessForgotpopup';
import API_BASE_URL from "../config"; // ✅ thêm dòng này

function OTPforgotpass({ email, onClose, onBackToForgot }) {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const validateLength = (password) => password.length >= 8 && password.length <= 16;
  const validateUppercase = (password) => /[A-Z]/.test(password);
  const validateSpecialChar = (password) => /[^A-Za-z0-9]/.test(password);

  const isLengthValid = validateLength(newPassword);
  const isUppercaseValid = validateUppercase(newPassword);
  const isSpecialCharValid = validateSpecialChar(newPassword);

  const handleResetPassword = async () => {
    if (otp.length !== 6) {
      setMessage("OTP must be 6 digits");
      return;
    }
    if (!isLengthValid || !isUppercaseValid || !isSpecialCharValid) {
      setMessage("Password does not meet the security requirements");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/user/reset-password`, {
        method: "PUT",
        headers: {
          "accept": "*/*",
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, otp, newPassword })
      });

      const text = await res.text();
      const result = text ? JSON.parse(text) : {};

      if (res.ok && result.statusCode === 200) {
        setShowSuccessPopup(true);
      } else {
        setMessage(result.message || "Reset failed");
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div className="login show-login">
      {!showSuccessPopup && (
        <form className="login__form">
          <h2 className="login__title">Reset Password</h2>
          <p className="login__description">Code sent to {email}</p>

          <div className="login__group">
            <div>
              <label className="login__label">OTP Code</label>
              <input
                type="text"
                className="login__input"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              />
            </div>

            <div>
              <label className="login__label">New Password</label>
              <input
                type="password"
                className="login__input"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              {/* Check password conditions */}
              <div className="password-checks">
                <p className={isLengthValid ? "valid" : "invalid"}>
                  {isLengthValid ? "✅" : "❌"} 8-16 characters
                </p>
                <p className={isUppercaseValid ? "valid" : "invalid"}>
                  {isUppercaseValid ? "✅" : "❌"} At least 1 uppercase letter
                </p>
                <p className={isSpecialCharValid ? "valid" : "invalid"}>
                  {isSpecialCharValid ? "✅" : "❌"} At least 1 special character
                </p>
              </div>
            </div>

            <div>
              <label className="login__label">Confirm Password</label>
              <input
                type="password"
                className="login__input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {message && <p className="login__error">{message}</p>}

          <button type="button" className="login__button" onClick={handleResetPassword}>
            Reset Password
          </button>

          <p className="login__signup">
            Wrong email?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); onBackToForgot(); }}>
              Back to Forgot Password
            </a>
          </p>
        </form>
      )}

      {showSuccessPopup && (
        <SuccessForgotpopup onClose={onClose} />
      )}

      <i className="ri-close-line login__close" onClick={onClose}></i>
    </div>
  );
}

export default OTPforgotpass;
