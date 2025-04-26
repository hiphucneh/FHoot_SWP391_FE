import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminStyles.module.css";

import AdminHeader from "./AdminHeader";

import AdminDashboard from "./AdminDashboard";
import UserManagement from "./UserManagement";
import RequestManagement from "./RequestManagement";
import PaymentManagement from "./PaymentManagement";

function HomeAdmin() {
  const navigate = useNavigate();
  
  const [selectedPage, setSelectedPage] = useState(() => {
    return localStorage.getItem("adminPage") || "dashboard"; // đọc từ localStorage
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "Admin") {
      navigate("/Home");
    }
  }, [navigate]);

  const handleSelectPage = (pageId) => {
    setSelectedPage(pageId);
    localStorage.setItem("adminPage", pageId); // lưu vào localStorage
  };

  const renderContent = () => {
    switch (selectedPage) {
      case "dashboard":
        return <AdminDashboard setSelectedPage={handleSelectPage} />; // 👈 truyền setSelectedPage
      case "users":
        return <UserManagement />;
      case "requests":
        return <RequestManagement />;
      case "payments":
        return <PaymentManagement />;
      default:
        return <AdminDashboard setSelectedPage={handleSelectPage} />; // 👈 default cũng cần
    }
  };

  return (
    <div className={styles.adminContainer}>
      <AdminHeader />

      <div className={styles.panelWrapper}>
        <div className={styles.adminPanel}>
          <h2 className={styles.panelTitle}>Admin Panel</h2>

          {/* Tabs */}
          <div className={styles.tabs}>
            {[
              { id: "dashboard", label: "Dashboard" },
              { id: "users", label: "User Management" },
              { id: "requests", label: "Request Management" },
              { id: "payments", label: "Payment Management" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleSelectPage(tab.id)}
                className={`${styles.tabButton} ${selectedPage === tab.id ? styles.activeTab : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Nội dung */}
          <div className={styles.panelContent}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeAdmin;
