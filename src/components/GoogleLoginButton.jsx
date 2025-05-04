import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import "./styles.css";

function GoogleLoginButton() {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google tokenResponse:", tokenResponse);
      const idToken = tokenResponse.id_token;

      if (!idToken) {
        alert("Không lấy được idToken từ Google. Vui lòng thử lại.");
        return;
      }

      try {
        // Gửi token đến API backend
        const response = await fetch(
          "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/login-with-google",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "*/*"
            },
            body: JSON.stringify({
              idToken,
              fcmToken: "web-client-placeholder"
            }),
          }
        );

        const data = await response.json();
        console.log("Login API response:", data);

        if (response.ok && data.statusCode === 200) {
          const token = data.data.accessToken || data.data.token;
          if (!token) throw new Error("No token received");

          localStorage.setItem("token", token);

          // Lấy thông tin user
          const userRes = await fetch(
            "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/whoami",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*"
              }
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
        } else {
          alert(data.message || "Đăng nhập Google thất bại.");
        }
      } catch (err) {
        console.error("Google login error:", err);
        alert("Đăng nhập Google thất bại. Vui lòng thử lại!");
      }
    },
    onError: (error) => {
      console.error("Google login failed:", error);
      alert("Google login error.");
    },
    flow: "token", // ✅ Đúng để nhận được id_token trên frontend
    scope: "openid email profile"
  });

  return (
    <button
      type="button"
      className="login__google-button"
      onClick={() => login()}
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google logo"
        className="google-icon"
      />
      Continue with Google
    </button>
  );
}

export default GoogleLoginButton;
