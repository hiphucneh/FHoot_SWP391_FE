import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; 
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import "./styles.css";
import "remixicon/fonts/remixicon.css";

function Login({ show, onClose, onSwitchToForgot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Trạng thái để hiện mật khẩu
  const navigate = useNavigate();

  useEffect(() => {
    if (show) setErrorMessage("");
  }, [show]);

  const fetchUserInfoAndRedirect = async (token) => {
    try {
      const userRes = await fetch(
        "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/whoami",
        {
          headers: { Authorization: `Bearer ${token}`, Accept: "*/*" }
        }
      );
      const userData = await userRes.json();
      localStorage.setItem("user", JSON.stringify(userData.data || userData));

      const role = (userData.data || userData).role;
      if (role === "Admin") {
        window.location.href = "/HomeAdmin";
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
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await fetch(
        "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "*/*" },
          body: JSON.stringify({ email, password, fcmToken: "web-client-placeholder" }),
        }
      );

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

  const handleGoogleLogin = async () => {
    setErrorMessage("");
    setIsGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      console.log("Google login result:", result);

      const idToken = await result.user.getIdToken();
      console.log("Google idToken:", idToken);

      if (!idToken) {
        setErrorMessage("Không lấy được idToken từ Google");
        return;
      }

      const res = await fetch(
        "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/login-with-google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify({
            idToken: idToken,
            fcmToken: "web-client-placeholder"
          }),
        }
      );

      const data = await res.json();
      if (res.ok && data.statusCode === 200) {
        const token = data.data.accessToken || data.data.token;
        if (!token) throw new Error("No token returned");

        localStorage.setItem("token", token);
        await fetchUserInfoAndRedirect(token);
      } else {
        setErrorMessage(data.message || "Google login failed.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Google login error. Please try again.");
    } finally {
      setIsGoogleLoading(false);
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

        {errorMessage && (
          <p className="login__error">{errorMessage}</p>
        )}

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
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/Register"); }}>
            Sign up
          </a>
        </p>

        <a
          href="#"
          className="login__forgot"
          onClick={(e) => { e.preventDefault(); onSwitchToForgot(); }}
        >
          Forgot your password?
        </a>

        <div className="login__google">
          <button
            type="button"
            className="login__google-button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              className="google-icon"
            />
            {isGoogleLoading ? "Connecting..." : "Continue with Google"}
          </button>
        </div>
      </form>

      <i className="ri-close-line login__close" onClick={onClose}></i>
    </div>
  );
}

export default Login;
