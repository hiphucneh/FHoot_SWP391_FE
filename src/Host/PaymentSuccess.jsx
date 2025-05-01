import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import congratsImage from "../assets/payment-success.png"; // 🎉 Thay ảnh thật ở đây
import "./PaymentSuccess.module.css"; // (tùy bạn muốn style thêm)

function PaymentSuccess() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Confirming your payment...");

  useEffect(() => {
    const confirmPayment = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("❌ You are not logged in.");
        setLoading(false);
        return;
      }

      try {
        // Step 1: Gọi callback xác nhận thanh toán
        const callbackRes = await fetch(
          "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/package/payos-callback?status=PAID",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "*/*",
            },
          }
        );

        if (!callbackRes.ok) {
          const errData = await callbackRes.json();
          console.error("❌ Callback failed:", errData);
          setMessage("⚠️ Payment success, but failed to upgrade account.");
          return;
        }

        // Step 2: Gọi lại API user info để cập nhật role
        const whoamiRes = await fetch(
          "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/whoami",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "*/*",
            },
          }
        );

        const user = await whoamiRes.json();
        if (whoamiRes.ok && user?.role) {
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("role", user.role);
          setMessage("🎉 Your account has been upgraded to Teacher!");
        } else {
          setMessage("⚠️ Could not refresh your account info.");
        }
      } catch (err) {
        console.error("❌ Error confirming payment:", err);
        setMessage("An error occurred while confirming payment.");
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <img
        src={congratsImage}
        alt="Payment Success"
        style={{ maxWidth: "300px", marginBottom: "1.5rem" }}
      />
      <h1 style={{ color: "#4caf50" }}>✅ Payment Success</h1>
      <p style={{ fontSize: "1.2rem", marginTop: "1rem" }}>{message}</p>

      {!loading && (
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "2rem",
            padding: "0.7rem 2rem",
            fontSize: "1rem",
            borderRadius: "10px",
            border: "none",
            background: "#7e57c2",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          🏠 Go to Home
        </button>
      )}
    </div>
  );
}

export default PaymentSuccess;
