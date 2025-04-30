import { useEffect, useState } from "react";
import styles from "./SystemConfiguration.module.css";
import AdminHeader from "../AdminHeader";
import EditConfigModal from "./EditConfig"; 
import Toast from "./Toast"; // Import Toast

function SystemConfiguration() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedConfigId, setSelectedConfigId] = useState(null);
  const [toast, setToast] = useState(null); // Thêm toast

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/system-configuration?pageIndex=1&pageSize=20`, {
        headers: {
          "accept": "*/*",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      setConfigs(data.data);
    } catch (error) {
      console.error("Failed to fetch configs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (configId) => {
    setSelectedConfigId(configId);
  };

  const handleCloseModal = () => {
    setSelectedConfigId(null);
    fetchConfigs();
  };

  const handleShowToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className={styles.pageContainer}>
      <AdminHeader />
      <div className={styles.contentWrapper}>
        <h2 className={styles.pageTitle}>System Configuration</h2>

        {loading ? (
          <p className={styles.loadingText}>Loading configurations...</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.configTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Min</th>
                  <th>Max</th>
                  <th>Unit</th>
                  <th>Active</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {configs.map((config) => (
                  <tr key={config.configId}>
                    <td>{config.name}</td>
                    <td>{config.minValue}</td>
                    <td>{config.maxValue}</td>
                    <td>{config.unit}</td>
                    <td>{config.isActive ? "Yes" : "No"}</td>
                    <td>{config.description}</td>
                    <td>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEditClick(config.configId)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Popup edit */}
      {selectedConfigId && (
        <EditConfigModal
          configId={selectedConfigId}
          onClose={handleCloseModal}
          showToast={handleShowToast} // 👈 Truyền hàm showToast
        />
      )}

      {/* Toast bên ngoài modal */}
      {toast && (
        <Toast type={toast.type} message={toast.message} />
      )}
    </div>
  );
}

export default SystemConfiguration;
