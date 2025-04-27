import { useState } from "react";
import './styles.css';
import 'remixicon/fonts/remixicon.css';
import OTPforgotpass from './OTPforgotpass';

function ForgotPass({ show, onClose, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/forgot-password?email=${encodeURIComponent(email)}`, {
        method: "POST",
        headers: {
          "accept": "*/*",
          "Authorization": `Bearer ${token}`
        }
      });
      const result = await res.json();
      if (result.statusCode === 200) {
        setTimeout(() => {
          setLoading(false);
          setShowOtpPopup(true);
        }, 800); // thêm delay nhẹ cho mượt
      } else {
        setLoading(false);
        setMessage(result.message || "Failed to send OTP");
      }
    } catch (err) {
      setLoading(false);
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div className={`login ${show ? "show-login" : ""}`} id="forgot-password">
      {!showOtpPopup && (
        <form className="login__form" onSubmit={handleSubmit}>
          <h2 className="login__title">Forgot Password</h2>

          <div className="login__group">
            <div>
              <label className="login__label">Email</label>
              <input
                type="email"
                className="login__input"
                placeholder="Enter your email"
                value={email}
                onChange={handleChange}
              />
            </div>
          </div>

          {message && <p className="login__error">{message}</p>}

          <button type="submit" className="login__button" disabled={loading}>
            {loading ? <div className="spinner"></div> : "Send OTP"}
          </button>

          <p className="login__signup">
            Remember password?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>
              Back to login
            </a>
          </p>
        </form>
      )}

      {showOtpPopup && (
        <OTPforgotpass
          email={email}
          onClose={onClose}
          onBackToForgot={() => setShowOtpPopup(false)}
        />
      )}

      <i className="ri-close-line login__close" onClick={onClose}></i>
    </div>
  );
}

export default ForgotPass;
