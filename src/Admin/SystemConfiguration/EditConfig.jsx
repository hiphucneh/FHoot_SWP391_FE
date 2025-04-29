import { useState, useEffect, useRef } from "react";
import styles from "./EditConfig.module.css";

function EditConfigModal({ configId, onClose, showToast }) { // 👈 nhận showToast
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false); // 👈 loading khi Save
  const modalRef = useRef(null);

  useEffect(() => {
    fetchConfig();
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/system-configuration/${configId}`, {
        headers: {
          "accept": "*/*",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      setConfig(data.data);
    } catch (error) {
      console.error("Failed to fetch config:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true); // 👈 bắt đầu loading nút Save

      const token = localStorage.getItem("token");
      const updateData = {
        name: config.name,
        minValue: config.minValue,
        maxValue: config.maxValue,
        unit: config.unit,
        isActive: config.isActive,
        description: config.description,
      };

      const response = await fetch(`https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/system-configuration/${configId}`, {
        method: "PUT",
        headers: {
          "accept": "*/*",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      onClose(); // 👈 Đóng Popup trước

      if (response.ok) {
        showToast("success", "Configuration updated successfully!");
      } else {
        showToast("error", "Failed to update configuration.");
      }
      
    } catch (error) {
      console.error("Failed to save config:", error);
      showToast("error", "Failed to update configuration.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !config) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal} ref={modalRef}>
          <p>Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        <h2>Edit Configuration</h2>

        <div className={styles.formGroup}>
          <label>Name:</label>
          <input type="text" value={config.name} disabled />
        </div>

        <div className={styles.formGroup}>
          <label>Min Value:</label>
          <input
            type="number"
            value={config.minValue}
            onChange={(e) => setConfig({ ...config, minValue: parseInt(e.target.value) })}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Max Value:</label>
          <input
            type="number"
            value={config.maxValue}
            onChange={(e) => setConfig({ ...config, maxValue: parseInt(e.target.value) })}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Active:</label>
          <input
            type="checkbox"
            checked={config.isActive}
            onChange={(e) => setConfig({ ...config, isActive: e.target.checked })}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Description:</label>
          <textarea
            value={config.description}
            onChange={(e) => setConfig({ ...config, description: e.target.value })}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={saving} // 👈 khi saving thì disable
          >
            {saving ? "Saving..." : "Save"} {/* 👈 show spinner text */}
          </button>
          <button
            className={styles.cancelButton}
            onClick={onClose}
            disabled={saving} // Không cho Cancel khi đang Save
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditConfigModal;
