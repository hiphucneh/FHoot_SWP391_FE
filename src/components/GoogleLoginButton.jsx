import { useGoogleLogin } from "@react-oauth/google";
import "./styles.css";
import { useNavigate } from "react-router-dom";

function GoogleLoginButton() {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Full tokenResponse:", tokenResponse);

      const idToken = tokenResponse.id_token;
      console.log("Google idToken:", idToken);

      if (!idToken) {
        alert("Không lấy được idToken từ Google. Vui lòng thử lại.");
        return;
      }

      try {
        // Gửi idToken và fcmToken đúng JSON format
        const response = await fetch(
          "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/login-with-google",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "*/*"
            },
            body: JSON.stringify({
              idToken: idToken,
              fcmToken: "web-client-placeholder" // 🔥 thêm đúng fcmToken
            }),
          }
        );

        const data = await response.json();
        console.log("Server response:", data);

        if (response.ok && data.statusCode === 200) {
          const token = data.data.accessToken || data.data.token;
          if (!token) throw new Error("No token received after Google login");

          localStorage.setItem("token", token);

          // Fetch user info
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
            window.location.href = "/HomeAdmin"; // 🔥 vẫn giữ window.location.href như yêu cầu
          } else {
            window.location.href = "/Home";
          }
        } else {
          alert(data.message || "Google login failed!");
        }
      } catch (err) {
        console.error(err);
        alert("Đăng nhập Google thất bại. Vui lòng thử lại!");
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      alert("Lỗi đăng nhập Google!");
    },
    flow: "implicit", // bạn yêu cầu giữ implicit (ok!)
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
