import "./PaymentPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "../assets/Kahoot_logo.png";
import Wallet from "../assets/PaymentPay/Wallet.png";

function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const selectedPlan = state?.selectedPlan;

  const [userEmail, setUserEmail] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [showCodePopup, setShowCodePopup] = useState(false);
  const [codeApplied, setCodeApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [fullName, setFullName] = useState("");

  const price = selectedPlan?.price || 0;
  const label = selectedPlan?.packageName || "No plan selected";
  const packageId = selectedPlan?.packageId;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/whoami",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "*/*",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to get user info");
        const data = await res.json();
        if (data.email) setUserEmail(data.email);
        if (data.name) setFullName(data.name);
      } catch (err) {
        console.error("❌ Failed to load user info:", err);
      }
    };
    fetchUserInfo();
  }, []);

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    if (!token || !packageId) {
      alert("Authentication or package info missing.");
      return;
    }

    setIsPaying(true);

    try {
      const cancelUrl = `${window.location.origin}/payment-cancel`;
      const returnUrl = `${window.location.origin}/payment-success`;

      const res = await fetch(
        `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/package/payment?packageId=${packageId}&cancelUrl=${encodeURIComponent(
          cancelUrl
        )}&returnUrl=${encodeURIComponent(returnUrl)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        }
      );

      const data = await res.json();
      console.log("🔁 Payment response:", data);

      const paymentUrl = data?.data || data?.paymentUrl;
      if (res.ok && paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        alert("Payment failed to initiate.");
      }
    } catch (err) {
      alert("An error occurred during payment.");
      console.error(err);
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="page-bg">
      <div className="payment-wrapper">
        <img
          src={Logo}
          alt="Kahoot Logo"
          className="logo clickable"
          onClick={() => navigate("/")}
        />

        <div className="payment-container">
          {/* LEFT */}
          <div className="payment-left">
            <form className="payment-form">
              <input
                type="text"
                placeholder="Full name *"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email address *"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />

              <label className="section-label">
                Select your payment method
              </label>
              <div className="payment-methods">
                <button
                  type="button"
                  className={paymentMethod === "wallet" ? "active" : ""}
                  onClick={() => setPaymentMethod("wallet")}
                >
                  <img src={Wallet} alt="Wallet" className="method-icon-2" />
                </button>
              </div>

              <p className="note">
                Payment will be processed securely via our payment provider.
              </p>
            </form>
          </div>

          {/* RIGHT */}
          <div className="payment-right">
            <div className="summary-box">
              <h4>Your chosen plan</h4>
              <p>
                <strong>{label}</strong>
              </p>
              <p>Billed once</p>
              <hr />
              <div className="summary-row">
                <span>1 license</span>
                <span>
                  {price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
              <div className="summary-row">
                <span>Discount code</span>
                {codeApplied ? (
                  <div className="code-applied">
                    <span className="code-text">✓ {discountCode}</span>
                    <span
                      className="clear-code"
                      onClick={() => {
                        setDiscountCode("");
                        setCodeApplied(false);
                      }}
                    >
                      ❌
                    </span>
                  </div>
                ) : (
                  <span
                    className="enter-code"
                    onClick={() => setShowCodePopup(true)}
                  >
                    Enter code
                  </span>
                )}
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>
                  {price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>

              <p className="agree-text">
                I hereby confirm I have read and agree to Fhoot!{" "}
                <span className="link" onClick={() => navigate("/Information")}>
                  Terms and Conditions.
                </span>
              </p>

              <button
                className={`pay-button ${isPaying ? "disabled" : ""}`}
                onClick={handlePayment}
                disabled={isPaying}
              >
                {isPaying ? "Redirecting..." : "Proceed to Payment"}
              </button>
            </div>
          </div>
        </div>

        {/* DISCOUNT POPUP */}
        {showCodePopup && (
          <div className="popup-overlay">
            <div className="popup">
              <h3>Enter discount code</h3>
              <input
                type="text"
                value={discountCode}
                maxLength={10}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                  setDiscountCode(value);
                }}
              />
              <div className="popup-buttons">
                <button onClick={() => setShowCodePopup(false)}>Cancel</button>
                <button
                  onClick={() => {
                    if (discountCode.trim() !== "") {
                      setCodeApplied(true);
                    }
                    setShowCodePopup(false);
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentPage;
