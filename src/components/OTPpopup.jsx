import { useEffect, useState } from "react";
import "./RegisterPage.css";
import { useNavigate } from "react-router-dom";

function OTPpopup({ email, password, onClose, onBackToRegister }) {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(10);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [message, setMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    setMessage("");
  };

  const handleVerify = async () => {
    if (otp.length !== 6) return setMessage("Please enter a 6-digit OTP");
    setIsVerifying(true);

    try {
      const verifyRes = await fetch(
        "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/verify-account",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );

      const verifyData = await verifyRes.json();
      if (verifyRes.ok && verifyData.statusCode === 200) {
        // ✅ Xác thực OTP thành công, tiến hành đăng nhập
        const loginRes = await fetch(
          "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "*/*",
            },
            body: JSON.stringify({
              email,
              password,
              fcmToken: "web-client-placeholder",
            }),
          }
        );

        const loginData = await loginRes.json();
        if (loginRes.ok && loginData.statusCode === 200) {
          const token = loginData.data.accessToken;
          localStorage.setItem("token", token);
          localStorage.setItem("refreshToken", loginData.data.refreshToken);

          // ✅ Navigate sang UserSetupPage
          navigate("/UserSetupPage");
        } else {
          setMessage("Auto-login failed. Please login manually.");
          console.error(loginData);
        }
      } else {
        setMessage(verifyData.message || "OTP verification failed");
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendDisabled || isResending) return;

    setIsResending(true);
    setMessage("");

    try {
      const res = await fetch(
        "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/resend-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

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
    } finally {
      setIsResending(false);
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
    <div className="otp-overlay">
      <div className="register-box otp-box">
        <h2>📩 Enter Your OTP</h2>
        <p className="otp-subtext">We've sent a 6-digit code to <strong>{email}</strong></p>

        <input
          type="text"
          placeholder="🔢 Enter OTP"
          value={otp}
          onChange={handleChange}
          maxLength={6}
          required
        />

        {message && <p className="register-error">{message}</p>}

        <button
          className={`otp-btn ${isVerifying ? "loading" : ""}`}
          onClick={handleVerify}
          disabled={isVerifying}
        >
          {isVerifying ? "Verifying..." : "Verify"}
        </button>

        <button
          className="otp-resend"
          onClick={handleResend}
          disabled={resendDisabled || isResending}
        >
          {isResending ? "Resending..." : `Resend OTP ${resendDisabled ? `(${timer}s)` : ""}`}
        </button>

        <p className="login-link">
          Wrong email? <span onClick={onBackToRegister}>Go Back</span>
        </p>

        <i className="ri-close-line login__close" onClick={onClose}></i>
      </div>
    </div>
  );
}

export default OTPpopup;
