import "./styles.css";
import "remixicon/fonts/remixicon.css";
import { useEffect, useState } from "react";

function Login({ show, onClose, onSwitchToRegister, onSwitchToForgot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) setErrorMessage("");
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      // Gửi login request
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

        // Sau khi login thành công, fetch thông tin user
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

        // Dùng window.location để reload router Home luôn
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
              onSwitchToRegister();
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
          <button className="login__google-button" type="button" disabled={isLoading}>
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              className="google-icon"
            />
            Continue with Google
          </button>
        </div>
      </form>

      <i className="ri-close-line login__close" onClick={onClose}></i>
    </div>
  );
}

export default Login;
