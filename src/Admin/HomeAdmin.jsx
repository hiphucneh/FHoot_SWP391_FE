import styles from "./AdminStyles.module.css";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomeAdmin() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "Admin") {
      navigate("/Home");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/Home";
  };

  return (
    <div className={styles.adminContainer}>
      <AdminHeader />
      <div className={styles.adminContent}>
        <h1 className={styles.adminHeaderTitle}>Admin Dashboard</h1>
        <p>Welcome, Admin! Manage your application here.</p>

        <button 
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          Logout
        </button>
      </div>
      <AdminFooter />
    </div>
  );
}

export default HomeAdmin;
