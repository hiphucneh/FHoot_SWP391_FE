import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterSuccess.css";
import successImage from "../assets/register-success.png";
import API_BASE_URL from "../config"; // ✅ thêm dòng này

function RegisterSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE_URL}/api/user/whoami`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        });

        const data = await response.json();
        if (response.ok && data.statusCode === 200) {
          localStorage.setItem("user", JSON.stringify(data.data));
        }
      } catch (error) {
        console.error("Failed to refresh user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="register-page success-page">
      <div className="success-content">
        <img
          src={successImage}
          alt="Registration Success"
          className="success-image"
        />
        <button className="success-button" onClick={() => navigate("/Home")}>
          🏠 Go to Home
        </button>
      </div>
    </div>
  );
}

export default RegisterSuccess;
