import { useEffect, useState } from "react";
import './styles.css';
import 'remixicon/fonts/remixicon.css';

function OTPpopup({ onClose, onBackToRegister, email }) {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(10);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    setMessage("");
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setMessage("Please enter a 6-digit OTP");
      return;
    }

    try {
      const res = await fetch("https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/verify-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });

      const result = await res.json();
      if (result.statusCode === 200) {
        alert("Account verified successfully!");
        onClose(); // or redirect to login
      } else {
        setMessage(result.message || "OTP verification failed");
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  const handleResend = async () => {
    if (resendDisabled) return;

    try {
      const res = await fetch("https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const result = await res.json();
      if (result.statusCode === 200) {
        setMessage("OTP resent successfully!");
        setResendDisabled(true);
        setTimer(10);
      } else {
        setMessage("Failed to resend OTP");
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  useEffect(() => {
    let interval;
    if (resendDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendDisabled]);

  return (
    <div className="login show-login" id="otp-popup">
      <form className="login__form">
        <h2 className="login__title">Enter OTP</h2>
        <p className="login__description">We’ve sent a 6-digit code to {email}</p>

        <div className="login__group">
          <div>
            <label htmlFor="otp" className="login__label">OTP Code</label>
            <input
              type="text"
              id="otp"
              className="login__input"
              placeholder="_____"
              value={otp}
              onChange={handleChange}
              maxLength="6"
            />
          </div>
        </div>

        {message && <p className="login__error">{message}</p>}

        <button type="button" className="login__button" onClick={handleVerify}>
          Verify
        </button>

        <div className="login__resend">
          <button
            type="button"
            className={`login__button resend ${resendDisabled ? "disabled" : ""}`}
            onClick={handleResend}
            disabled={resendDisabled}
          >
            Resend OTP {resendDisabled && `(${timer}s)`}
          </button>
        </div>

        <p className="login__signup">
          Wrong email?{" "}
          <a href="#" onClick={(e) => {
            e.preventDefault();
            onBackToRegister();
          }}>
            Back to Sign Up
          </a>
        </p>
      </form>

      <i className="ri-close-line login__close" id="otp-close" onClick={onClose}></i>
    </div>
  );
}

export default OTPpopup;
