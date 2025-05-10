import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import "remixicon/fonts/remixicon.css";
import GoogleLoginButton from "./GoogleLoginButton";
import API_BASE_URL from "../config"; // đường dẫn này tùy thuộc vị trí file

function Login({ show, onClose, onSwitchToForgot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (show) setErrorMessage("");
  }, [show]);

  const fetchUserInfoAndRedirect = async (token) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/whoami`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      });

      const userData = await res.json();
      localStorage.setItem("user", JSON.stringify(userData.data || userData));
      const role = (userData.data || userData).role;

      if (role === "Admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/Home";
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to fetch user info.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/user/login`, {
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
      });

      const data = await res.json();
      if (res.ok && data.statusCode === 200) {
        const token = data.data.accessToken || data.data.token;
        if (!token) throw new Error("No token received");

        localStorage.setItem("token", token);
        await fetchUserInfoAndRedirect(token);
      } else {
        setErrorMessage(data.message || "Invalid Email or Password");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`login ${show ? "show-login" : ""}`} id="login">
      <form className="login__form" onSubmit={handleSubmit}>
        <h2 className="login__title">Log In</h2>

        <div className="login__group">
          <div>
            <label className="login__label">Email</label>
            <input
              type="email"
              className="login__input"
              placeholder="Write your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="login__label">Password</label>
            <div className="login__password-container">
              <input
                type={isPasswordVisible ? "text" : "password"}
                className="login__input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>
        </div>

        {errorMessage && <p className="login__error">{errorMessage}</p>}

        <div style={{ marginTop: "20px" }}>
          <button
            type="submit"
            className={`login__button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </div>

        <p className="login__signup">
          Don't have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/Register");
            }}
          >
            Sign up
          </a>
        </p>

        <a
          href="#"
          className="login__forgot"
          onClick={(e) => {
            e.preventDefault();
            onSwitchToForgot();
          }}
        >
          Forgot your password?
        </a>

        <div className="login__google" style={{ marginTop: "1rem" }}>
          <GoogleLoginButton
            onLoginSuccess={(token) => {
              console.log("🎉 Google login success with token:", token);
              window.location.href = "/Home";
            }}
          />
        </div>
      </form>

      <i className="ri-close-line login__close" onClick={onClose}></i>
    </div>
  );
}

export default Login;
