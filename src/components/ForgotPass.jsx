import { useState } from "react";
import './styles.css';
import 'remixicon/fonts/remixicon.css';
import ResetPasspopup from './ResetPasspopup';

function ForgotPass({ show, onClose, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const result = await res.json();
      if (result.statusCode === 200) {
        setShowResetPopup(true);
      } else {
        setMessage(result.message || "Failed to send OTP");
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div className={`login ${show ? "show-login" : ""}`} id="forgot-password">
      {!showResetPopup && (
        <form className="login__form" onSubmit={handleSubmit}>
          <h2 className="login__title">Forgot Password</h2>

          <div className="login__group">
            <div>
              <label htmlFor="forgot-email" className="login__label">Email</label>
              <input
                type="email"
                id="forgot-email"
                className="login__input"
                placeholder="Enter your email to reset password"
                value={email}
                onChange={handleChange}
              />
            </div>
          </div>

          {message && <p className="login__error">{message}</p>}

          <div>
            <button type="submit" className="login__button">Enter</button>
            <p className="login__signup">
              Remember your password?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>
                Back to login
              </a>
            </p>
          </div>
        </form>
      )}

      {showResetPopup && (
        <ResetPasspopup
          email={email}
          onClose={() => {
            setShowResetPopup(false);
            onClose();
          }}
          onBackToForgot={() => setShowResetPopup(false)}
        />
      )}

      <i className="ri-close-line login__close" id="forgot-close" onClick={onClose}></i>
    </div>
  );
}

export default ForgotPass;
