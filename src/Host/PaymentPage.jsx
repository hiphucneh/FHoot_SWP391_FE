import "./PaymentPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "../assets/Kahoot_logo.png";
import GPay1 from "../assets/PaymentPay/GPay1.png";
import GPay2 from "../assets/PaymentPay/GPay2.png";
import PayPal from "../assets/PaymentPay/PayPal.png";
import Wallet from "../assets/PaymentPay/Wallet.png";

function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const selectedPlan = state?.selectedPlan || "No plan selected";

  const planDetails = {
    "1 Month": { price: 5.99, label: "Kahoot - 1 Month" },
    "3 Months": { price: 15.99, label: "Kahoot- 3 Months" },
    "9 Months": { price: 39.99, label: "Kahoot- 9 Months" },
  };

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showCodePopup, setShowCodePopup] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [codeApplied, setCodeApplied] = useState(false);

  const { price, label } = planDetails[selectedPlan] || {
    price: 0,
    label: "Unknown Plan",
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
              <div className="input-row">
                <input type="text" placeholder="First name *" required />
                <input type="text" placeholder="Last name *" required />
              </div>
              <input type="email" placeholder="Email address *" required />

              <label className="section-label">
                Select your payment method
              </label>
              <div className="payment-methods">
                <button
                  type="button"
                  className={paymentMethod === "card" ? "active" : ""}
                  onClick={() => setPaymentMethod("card")}
                >
                  <img src={Wallet} alt="Card" className="method-icon-2" />
                </button>

                <button
                  type="button"
                  className={paymentMethod === "paypal" ? "active" : ""}
                  onClick={() => setPaymentMethod("paypal")}
                >
                  <img src={PayPal} alt="PayPal" className="method-icon" />
                </button>
                <button
                  type="button"
                  className={paymentMethod === "gpay" ? "active" : ""}
                  onClick={() => setPaymentMethod("gpay")}
                >
                  <img src={GPay1} alt="GPay" className="method-icon-1" />
                </button>
              </div>

              {paymentMethod === "card" && (
                <>
                  <input type="text" placeholder="Card number *" />
                  <div className="input-row">
                    <input type="text" placeholder="MM / YY" />
                    <input type="text" placeholder="CVV/CVC *" />
                  </div>
                  <input type="text" placeholder="Billing address" />
                  <div className="input-row">
                    <select>
                      <option>Vietnam</option>
                      <option>USA</option>
                      <option>UK</option>
                    </select>
                    <input type="text" placeholder="Postal code *" />
                  </div>
                  <p className="note">
                    Accepted cards: 💳 MasterCard, Visa, Amex
                  </p>
                </>
              )}

              {paymentMethod === "paypal" && (
                <p className="note">
                  You have selected PayPal.{" "}
                  <strong>Subscribe with PayPal.</strong>
                </p>
              )}
              {paymentMethod === "gpay" && (
                <p className="note">
                  You have selected Google Pay.{" "}
                  <strong>Continue to checkout.</strong>
                </p>
              )}
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
                <span>${price.toFixed(2)}</span>
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
                <span>USD ${price.toFixed(2)}</span>
              </div>
              <p className="agree-text">
                I hereby confirm I have read and agree to Kahoot!{" "}
                <span className="link" onClick={() => navigate("/Information")}>
                  Terms and Conditions.
                </span>
              </p>

              {paymentMethod === "card" && (
                <button className="pay-button">Confirm and pay</button>
              )}
              {paymentMethod === "paypal" && (
                <button className="paypal-button">Subscribe with PayPal</button>
              )}
              {paymentMethod === "gpay" && (
                <button className="gpay-button">
                  <span className="buy-text">Buy with</span>
                  <img src={GPay2} alt="GPay" className="gpay-btn-img" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* POPUP ENTER CODE */}
        {showCodePopup && (
          <div className="popup-overlay">
            <div className="popup">
              <h3>Enter discount code</h3>
              <input
                type="text"
                value={discountCode}
                maxLength={10}
                onChange={(e) => {
                  const value = e.target.value;
                  const clean = value.replace(/[^a-zA-Z0-9]/g, "");
                  setDiscountCode(clean);
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
