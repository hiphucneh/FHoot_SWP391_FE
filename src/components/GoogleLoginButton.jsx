import { useGoogleLogin } from "@react-oauth/google";
import "./styles.css"; // Nếu bạn có CSS riêng
import { useNavigate } from "react-router-dom";

function GoogleLoginButton() {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const idToken = tokenResponse.id_token;
        console.log("Google idToken:", idToken);

        if (!idToken) throw new Error("No idToken received from Google");

        const response = await fetch(
          `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/login-with-google?idToken=${idToken}&fcmToken=web-client-placeholder`,
          {
            method: "POST",
            headers: {
              accept: "*/*",
              Authorization: "Bearer dummy-token", // Dummy token BE yêu cầu
            },
          }
        );

        const data = await response.json();
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
            window.location.href = "/HomeAdmin";
          } else {
            window.location.href = "/Home";
          }
        } else {
          alert(data.message || "Google login failed!");
        }
      } catch (err) {
        console.error(err);
        alert("Google login failed. Try again!");
      }
    },
    onError: () => {
      alert("Google login error!");
    },
    flow: "implicit", // Nhận trực tiếp id_token
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
