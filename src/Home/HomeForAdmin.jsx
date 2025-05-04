import { useState, useEffect } from "react";
import "./HomeForAdmin.css";

function HomeForAdmin({ role }) {
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Khi component mount -> Load từ localStorage
    const storedFeatures = localStorage.getItem("features");
    if (storedFeatures) {
      setFeatures(JSON.parse(storedFeatures));
    } else {
      // Nếu chưa có thì set default
      setFeatures([
        "🎉 New Quiz Templates Available",
        "📈 Improved Game Reports Dashboard",
        "🧑‍💻 Better User Profile Customization",
        "🚀 Faster Game Load Times",
      ]);
    }
  }, []);

  const saveFeaturesToLocal = (updatedFeatures) => {
    localStorage.setItem("features", JSON.stringify(updatedFeatures));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      const updatedFeatures = [...features, newFeature.trim()];
      setFeatures(updatedFeatures);
      saveFeaturesToLocal(updatedFeatures);
      setNewFeature("");
      triggerToast();
    }
  };

  const handleDeleteFeature = (index) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    setFeatures(updatedFeatures);
    saveFeaturesToLocal(updatedFeatures);
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="home-for-admin">
      <h2 className="admin-title">🆕 Latest Fhoot! Updates</h2>

      <ul className="admin-feature-list">
        {features.map((feature, index) => (
          <li key={index} className="admin-feature-item">
            {feature}
            {role === "Admin" && (
              <button
                className="delete-button"
                onClick={() => handleDeleteFeature(index)}
              >
                ❌
              </button>
            )}
          </li>
        ))}
      </ul>

      {role === "Admin" && (
        <div className="admin-edit-section">
          <input
            type="text"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Add new feature"
            className="admin-input"
          />
          <button className="admin-add-button" onClick={handleAddFeature}>
            Add Feature
          </button>
        </div>
      )}

      {showToast && (
        <div className="admin-toast">✅ Feature added successfully!</div>
      )}
    </div>
  );
}

export default HomeForAdmin;
