import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import congratsImage from "../assets/payment-success.png";
import "./PaymentSuccess.css";

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
    <div className="payment-success-container">
      <img
        src={congratsImage}
        alt="Payment Success"
        className="payment-success-image"
      />
      <h1 className="payment-success-title">✅ Payment Success</h1>
      <p className="payment-success-message">{message}</p>

      {!loading && (
        <button
          className="payment-success-button"
          onClick={() => navigate("/")}
        >
          🏠 Go to Home
        </button>
      )}
    </div>
  );
}

export default PaymentSuccess;
