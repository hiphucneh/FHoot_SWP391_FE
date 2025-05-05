import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PayHost.css";
import PayPopup from "./PayPopup";

function PayHost() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(true);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchPackages = async () => {
      try {
        const res = await fetch(
          "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/package",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "*/*",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch packages.");

        const json = await res.json();
        setPackages(json.data?.slice(0, 3) || []);
      } catch (err) {
        console.error("❌ Error:", err);
        setError("Failed to load packages. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [navigate]);

  const handleChoosePlan = (plan) => {
    navigate("/payment", { state: { selectedPlan: plan } });
  };

  const icons = ["🌟", "🚀", "🏆"];

  return (
    <div className="payhost-page">
      {showPopup && <PayPopup onClose={() => setShowPopup(false)} />}

      <div className="payhost-header">
        <h1>🚀 Upgrade to Fhoot! Host</h1>
        <p>Unlock premium features and start hosting today!</p>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>⏳ Loading packages...</p>
      ) : error ? (
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      ) : (
        <div className="payhost-options">
          {packages.map((pkg, index) => (
            <div
              className={`payhost-card ${index === 1 ? "popular" : ""}`}
              key={pkg.packageId}
            >
              {index === 1 && (
                <div className="popular-badge">Most Popular 🔥</div>
              )}
              <h2>{icons[index] || "🎁"} {pkg.packageName}</h2>
              <p className="price">
                {pkg.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
              <ul>
                <li>Duration: {pkg.duration} days</li>
                <li>{pkg.description}</li>
              </ul>
              <button onClick={() => handleChoosePlan(pkg)}>Choose Plan</button>
            </div>
          ))}
        </div>
      )}

      <div className="payhost-back">
        <button onClick={() => navigate("/")}>⬅ Back to Home</button>
      </div>
    </div>
  );
}

export default PayHost;
