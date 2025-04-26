import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import "remixicon/fonts/remixicon.css";

function Login({ show, onClose, onSwitchToForgot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (show) setErrorMessage("");
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(
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

      const data = await response.json();

      if (response.ok && data.statusCode === 200) {
        const token = data.data.accessToken || data.data.token;
        if (!token) throw new Error("No token returned from API");

        localStorage.setItem("token", token);

        const userRes = await fetch(
          "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/whoami",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "*/*",
            },
          }
        );
        const userData = await userRes.json();
        const user = userData.data || userData;
        localStorage.setItem("user", JSON.stringify(user));

        window.location.href = "/Home";
      } else {
        setErrorMessage("Invalid Email or Password");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 Hàm Login bằng Google
  const handleGoogleLogin = async () => {
    setErrorMessage("");
    setIsGoogleLoading(true);

    try {
      // Giả lập idToken (thực tế cần dùng Google SDK lấy idToken)
      const idToken = prompt("Enter your Google idToken:");

      if (!idToken) {
        setErrorMessage("No idToken provided.");
        setIsGoogleLoading(false);
        return;
      }

      const response = await fetch(
        "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/login-with-google",
        {
          method: "POST",
          headers: {
            "Authorization": "Bearer dummy-token-for-now", // Nếu API cần Authorization thì đưa token chuẩn
          },
          body: JSON.stringify({
            idToken: idToken,
            fcmToken: "web-client-placeholder",
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.statusCode === 200) {
        const token = data.data.accessToken || data.data.token;
        if (!token) throw new Error("No token returned from Google login");

        localStorage.setItem("token", token);

        const userRes = await fetch(
          "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/whoami",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "*/*",
            },
          }
        );
        const userData = await userRes.json();
        const user = userData.data || userData;
        localStorage.setItem("user", JSON.stringify(user));

        window.location.href = "/Home";
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
            <label htmlFor="email" className="login__label">Email</label>
            <input
              type="email"
              id="email"
              className="login__input"
              placeholder="Write your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="login__label">Password</label>
            <input
              type="password"
              id="password"
              className="login__input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {errorMessage && (
          <p style={{ color: "red", marginTop: "10px", marginBottom: "-10px" }}>
            {errorMessage}
          </p>
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

        <div className="login__google">
          <button
            className="login__google-button"
            type="button"
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
