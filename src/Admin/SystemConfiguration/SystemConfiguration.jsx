import { useEffect, useState } from "react";
import styles from "./SystemConfiguration.module.css";
import Sidebar from "../../components/Sidebar";
import AdminHeader from "../AdminHeader";
import EditConfigModal from "./EditConfig";
import Toast from "./Toast"; // Import Toast
import Layout from "antd/es/layout/layout";
function SystemConfiguration() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedConfigId, setSelectedConfigId] = useState(null);
  const [toast, setToast] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/system-configuration?pageIndex=1&pageSize=20`,
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          }
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
  <Layout style={{ minHeight: "100vh" }}>
    <Sidebar />
    <Layout>
      <div className={styles.pageContainer} style={{
        margin: "24px 16px",
        padding: "24px",
        background: "linear-gradient(135deg, rgb(186, 230, 253), rgb(243, 212, 229), rgb(254, 243, 199))",
        borderRadius: "8px",
        minHeight: "100vh",
        overflow: "auto",
        fontFamily: "Roboto, sans-serif"
      }}

      >

        <div className={styles.contentWrapper} style={{ margin: "60px 0 0 220px" }}>
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
    </Layout>
    <style>
      {`
          .table-row-hover:hover {
            background-color: #f9fafb !important;
            transition: background-color 0.2s ease;
          }
          .ant-table-thead > tr > th {
            background: #f3d4e5 !important;
            color: #333 !important;
            font-weight: 600 !important;
          }
          .ant-table-tbody > tr > td {
            color: #333 !important;
          }
        `}
    </style>
  </Layout >
);
}

export default SystemConfiguration;
