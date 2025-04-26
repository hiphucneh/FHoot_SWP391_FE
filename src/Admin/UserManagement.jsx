import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import Toast from "./Toast";
import styles from "./ControlAdminStyles.module.css"; // Import CSS module

function UserManagement() {
  const [users, setUsers] = useState([
    { id: 1, email: "user1@gmail.com", role: "User", status: "Active" },
    { id: 2, email: "teacher1@gmail.com", role: "Teacher", status: "Pending" },
    { id: 3, email: "admin@gmail.com", role: "Admin", status: "Active" }
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
  };

  const confirmRoleChange = () => {
    setLoading(true);
    setTimeout(() => {
      setUsers(prev =>
        prev.map(u =>
          u.id === selectedUser.id
            ? { ...u, role: newRole }
            : u
        )
      );
      setLoading(false);
      setSelectedUser(null);
      setToastMessage(`Role changed to ${newRole}!`);
      setTimeout(() => setToastMessage(""), 3000);
    }, 1000);
  };

  const cancelRoleChange = () => {
    setSelectedUser(null);
  };

  return (
    <div className={styles.userManagementContainer}>
      <h1 className={styles.managementTitle}>👥 User Management</h1>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <>
              <tr key={user.id} className={styles.tableRow}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td>
                  <button
                    onClick={() => openRoleModal(user)}
                    className={styles.actionButton}
                  >
                    Change Role
                  </button>
                </td>
              </tr>
              {/* Dải gạch nhỏ ngăn cách */}
              {idx !== users.length - 1 && (
                <tr>
                  <td colSpan="4">
                    <div className={styles.separator}></div>
                  </td>
                </tr>
              )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Change Role */}
      {selectedUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Change Role</h2>
            <p>{selectedUser.email}</p>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className={styles.selectBox}
            >
              <option>User</option>
              <option>Teacher</option>
              <option>Admin</option>
            </select>

            <div className={styles.modalButtons}>
              <button
                onClick={confirmRoleChange}
                className={styles.confirmButton}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={cancelRoleChange}
                className={styles.cancelButton}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}

export default UserManagement;
