import { useEffect, useState } from "react";
import AdvHost from "../Host/AdvHost";
import "./AccountScreen.css";
import { useNavigate } from "react-router-dom";

function AccountScreen({ show, onClose, setUser: setParentUser }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [editData, setEditData] = useState({ name: "", age: "" });
  const [toast, setToast] = useState("");
  const [closing, setClosing] = useState(false);
  const [showAdvHost, setShowAdvHost] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // 🔥 New loading state

  useEffect(() => {
    if (show) {
      setEditMode(false);
      const token = localStorage.getItem("token");
      if (!token) return;

      fetch(
        "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/whoami",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        }
      )
        .then((res) => res.json())
        .then((resData) => {
          const data = resData.data || resData;
          setUser(data);
          setEditData({
            name: data.name || "",
            age: data.age || "",
          });
        })
        .catch(console.error);
    }
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
    formData.append("Gender", user.gender || "Male");
    formData.append("Location", user.location || "Viet Nam");
    if (avatarFile) formData.append("Avatar", avatarFile);

    try {
      setIsSaving(true); // 🔥 Start loading

      const res = await fetch(
        "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const result = await res.json();
      if (res.ok && result.statusCode === 200) {
        showToast("✅ Profile updated!");
        setEditMode(false);

        const updatedUser = {
          ...user,
          name: editData.name,
          age: editData.age,
          avatar: avatarFile ? URL.createObjectURL(avatarFile) : user.avatar,
        };

        setUser(updatedUser);
        setParentUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        showToast("❌ Update failed.");
      }
    } catch (err) {
      showToast("❌ Error: " + err.message);
    } finally {
      setIsSaving(false); // 🔥 End loading
    }
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 300);
  };

  if (!show) return null;
  if (!user) return <div className="account-modal">Loading...</div>;

  return (
    <>
      <div className={`account-overlay ${closing ? "hide" : ""}`}>
        <div className="account-modal">
          <div className="account-header">
            <h3>Account Information</h3>
            <i className="ri-close-line close-btn" onClick={handleClose}></i>
          </div>

          <div className="account-avatar-section">
            <div className="avatar-wrapper">
              <img
                src={
                  avatarFile
                    ? URL.createObjectURL(avatarFile)
                    : user.avatar ||
                      `https://api.dicebear.com/7.x/bottts/svg?seed=${
                        user.email || "guest"
                      }`
                }
                onError={(e) =>
                  (e.target.src = `https://api.dicebear.com/7.x/bottts/svg?seed=guest`)
                }
                alt="avatar"
                className="account-avatar"
              />

              {editMode && (
                <label className="camera-icon">
                  <i className="ri-camera-line"></i>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    hidden
                  />
                </label>
              )}
            </div>
          </div>

          {editMode ? (
            <div className="account-info">
              <div className="info-item">
                <label>Full Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="info-item">
                <label>Age:</label>
                <input
                  type="number"
                  name="age"
                  value={editData.age}
                  onChange={handleChange}
                />
              </div>
              <div className="update-buttons">
                <button
                  className={`login__button save-button ${
                    isSaving ? "loading" : ""
                  }`}
                  onClick={handleUpdate}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div className="spinner"></div>
                  ) : (
                    "💾 Save Changes"
                  )}
                </button>
                <button
                  className="login__button cancel-button"
                  onClick={() => setEditMode(false)}
                  disabled={isSaving}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="account-info">
              <div className="info-item">
                <label>Role:</label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  <p style={{ margin: 0 }}>{user?.role}</p>
                  {user?.role?.toLowerCase() === "user" && (
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "#ff9800",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => setShowAdvHost(true)}
                    >
                      🚀 Upgrade to Host
                    </span>
                  )}
                </div>
              </div>
              <div className="info-item">
                <label>Full Name:</label>
                <p>{user?.name}</p>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <p>{user?.email}</p>
              </div>
              <div className="info-item">
                <label>Age:</label>
                <p>{user?.age}</p>
              </div>
              <div
                className="update-button"
                style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
              >
                <button
                  className="login__button"
                  onClick={() => setEditMode(true)}
                >
                  ✏️ Edit Profile
                </button>

                {user?.role?.toLowerCase() === "user" && (
                  <button
                    className="login__button view-history-button"
                    onClick={() => navigate("/my-game")}
                  >
                    📜 View History
                  </button>
                )}
              </div>
            </div>
          )}

          {toast && <div className="toast">{toast}</div>}
        </div>
      </div>

      {/* Popup Upgrade to Host */}
      <AdvHost show={showAdvHost} onClose={() => setShowAdvHost(false)} />
    </>
  );
}

export default AccountScreen;
