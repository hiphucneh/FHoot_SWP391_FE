import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "./RegisterPage.css";
import { useNavigate } from "react-router-dom";
import OTPpopup from "./OTPpopup";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [captcha, setCaptcha] = useState(null);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!captcha) return setError("⚠️ Please verify you are human.");
    if (password !== confirm) return setError("⚠️ Passwords do not match!");

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok && data.statusCode === 200) {
        setShowOTP(true);
      } else {
        setError(data.message || "❌ Registration failed.");
      }
    } catch (err) {
      setError("❌ An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check validation rules
  const isLengthValid = password.length >= 8 && password.length <= 16;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    <div className="register-page">
      <form className="register-box" onSubmit={handleSubmit}>
        <h2>🦄 Create your Adventure!</h2>

        <input
          type="email"
          placeholder="📧 Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="🔑 Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <i
            className={showPassword ? "ri-eye-off-line" : "ri-eye-line"}
            onClick={() => setShowPassword((prev) => !prev)}
          ></i>
        </div>

        {/* ✅ Validation hints */}
        <div className="password-checks">
          <p className={isLengthValid ? "valid" : "invalid"}>
            {isLengthValid ? "✔" : "✖"} 8–16 characters
          </p>
          <p className={hasUppercase ? "valid" : "invalid"}>
            {hasUppercase ? "✔" : "✖"} At least 1 uppercase letter
          </p>
          <p className={hasSpecialChar ? "valid" : "invalid"}>
            {hasSpecialChar ? "✔" : "✖"} At least 1 special character
          </p>
        </div>

        <div className="password-input">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="🔐 Confirm your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <i
            className={showConfirm ? "ri-eye-off-line" : "ri-eye-line"}
            onClick={() => setShowConfirm((prev) => !prev)}
          ></i>
        </div>

        <div className="recaptcha-wrapper">
          <ReCAPTCHA
            sitekey="6LcYViUrAAAAAJWSuKjIWdWcNW8kp8_3FPMfHdZ6"
            onChange={(token) => {
              setCaptcha(token);
              setError("");
            }}
          />
        </div>

        {error && <p className="register-error">{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "🚀 Let's Go!"}
        </button>

        <p className="login-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/Home")}>Log In</span>
        </p>
      </form>

      {showOTP && (
        <OTPpopup
          email={email}
          password={password}
          onClose={() => setShowOTP(false)}
          onBackToRegister={() => {
            setShowOTP(false);
            navigate("/Home", { state: { showLogin: true }, replace: true });
          }}
        />
      )}
    </div>
  );
}

export default RegisterPage;
