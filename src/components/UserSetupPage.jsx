import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import defaultAvatar from "../assets/default-avatar.png";
import API_BASE_URL from "../config";

function UserSetupPage() {
  const [fullName, setFullName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [age, setAge] = useState("");
  const [showAgeInput, setShowAgeInput] = useState(false);
  const [gender, setGender] = useState("Male");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("FullName", fullName);
    formData.append("Age", age);
    formData.append("Gender", gender);
    formData.append("Location", "Viet Nam");
    if (avatar) formData.append("Avatar", avatar);

    try {
      const res = await fetch(`${API_BASE_URL}/api/user`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();
      if (res.ok && result.statusCode === 200) {
        navigate("/RegisterSuccess", { replace: true });
      } else {
        setError(result.message || "Update failed.");
      }
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <form className="register-box profile-box" onSubmit={handleSubmit}>
        <div className="avatar-wrapper">
          <img
            src={avatar ? URL.createObjectURL(avatar) : defaultAvatar}
            alt="Avatar"
            className="avatar-img"
          />
          <label className="camera-btn">
            <i className="ri-camera-line"></i>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              hidden
            />
          </label>
        </div>

        <div className="interactive-inputs">
          <button type="button" className="toggle-btn" onClick={() => setShowNameInput(!showNameInput)}>
            ✏️ Add Name
          </button>
          {showNameInput && (
            <input
              type="text"
              placeholder="Your Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}

          <button type="button" className="toggle-btn" onClick={() => setShowAgeInput(!showAgeInput)}>
            🎂 Add Age
          </button>
          {showAgeInput && (
            <input
              type="number"
              placeholder="Your Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          )}
        </div>

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="gender-select"
        >
          <option value="Male">🚹 Male</option>
          <option value="Female">🚺 Female</option>
          <option value="Other">⚧️ Other</option>
        </select>

        {error && <p className="register-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "🎉 Save Profile"}
        </button>
      </form>
    </div>
  );
}

export default UserSetupPage;
