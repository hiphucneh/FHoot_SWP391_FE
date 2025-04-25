import { useEffect, useState } from "react";
import './AccountScreen.css';

function AccountScreen({ show, onClose }) {
  const [user, setUser] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    bio: "",
    gender: "",
    age: "",
    location: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!show) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/whoami", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setEditData({
          name: data.name || "",
          bio: data.bio || "",
          gender: data.gender || "",
          age: data.age || "",
          location: data.location || "",
        });
      })
      .catch(console.error);
  }, [show]);

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("FullName", editData.name);
    formData.append("Age", editData.age);
    formData.append("Gender", editData.gender);
    formData.append("Location", editData.location);
    if (avatarFile) formData.append("Avatar", avatarFile);

    setIsUpdating(true);
    try {
      const res = await fetch("https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await res.json();
      if (res.ok && result.statusCode === 200) {
        showToast("✅ Profile updated!");
        // Cập nhật avatar Header
        const newAvatar = avatarFile ? URL.createObjectURL(avatarFile) : user.avatar;
        localStorage.setItem("user", JSON.stringify({ ...user, avatar: newAvatar }));
      } else {
        showToast("❌ Update failed.");
      }
    } catch (err) {
      showToast("❌ Error: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!show) return null;

  return (
    <div className="account-overlay">
      <div className="account-modal">
        <div className="account-header">
          <h3>Account Information</h3>
          <i className="ri-close-line close-btn" onClick={onClose}></i>
        </div>

        <div className="account-avatar-section">
          <div className="avatar-wrapper">
          <img
  src={
    avatarFile
      ? URL.createObjectURL(avatarFile)
      : (user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.email || "guest"}`)
  }
  alt="avatar"
  className="account-avatar"
/>

            <label className="camera-icon">
              <i className="ri-camera-line"></i>
              <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
            </label>
          </div>
        </div>

        <div className="account-info">
          <div className="info-item">
            <label>Name:</label>
            <input type="text" name="name" value={editData.name} onChange={handleChange} />
          </div>
          <div className="info-item">
            <label>Bio:</label>
            <textarea name="bio" value={editData.bio} onChange={handleChange} />
          </div>
          <div className="info-item">
            <label>Gender:</label>
            <select name="gender" value={editData.gender} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="info-item">
            <label>Age:</label>
            <input type="number" name="age" value={editData.age} onChange={handleChange} />
          </div>
          <div className="info-item">
            <label>Location:</label>
            <input type="text" name="location" value={editData.location} onChange={handleChange} />
          </div>
          <div className="info-item">
            <label>Email:</label>
            <input type="email" value={user?.email || ""} disabled />
          </div>
        </div>

        <div className="update-button">
          <button className="login__button" onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? "Saving..." : "💾 Save Changes"}
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default AccountScreen;
