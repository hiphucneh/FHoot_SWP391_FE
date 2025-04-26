import { useState } from "react";
import styles from "./AdminStyles.module.css";

function AdminDashboard({ setSelectedPage }) {
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [sampleAccounts, setSampleAccounts] = useState([]);
  const [isTeacherView, setIsTeacherView] = useState(false);

  const [blockMode, setBlockMode] = useState(false);
  const [blockUser, setBlockUser] = useState(null);
  const [blockReason, setBlockReason] = useState("");

  const usersCount = 120;
  const teachersCount = 35;
  const requestsCount = 5;
  const paymentsCount = 27;

  const handleViewAccounts = (role) => {
    setPopupTitle(`${role} Accounts`);
    setIsTeacherView(role === "Teacher");

    if (role === "User") {
      setSampleAccounts([
        { username: "user1", email: "user1@example.com" },
        { username: "user2", email: "user2@example.com" },
      ]);
    } else if (role === "Teacher") {
      setSampleAccounts([
        { username: "teacher1", email: "teacher1@example.com", remaining: "3 months" },
        { username: "teacher2", email: "teacher2@example.com", remaining: "1 month" },
      ]);
    }

    setShowPopup(true);
  };

  const handleBlockClick = (account) => {
    setBlockUser(account);
    setBlockReason("");
    setBlockMode(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSampleAccounts([]);
    setBlockMode(false);
    setBlockUser(null);
  };

  const handleBlockAndSend = () => {
    if (blockReason.trim() === "") {
      alert("Please enter a reason for blocking!");
      return;
    }
    alert(`Blocked ${blockUser.username} and sent reason: "${blockReason}"`);
    handleClosePopup();
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>
      <p className={styles.dashboardSubtitle}>Welcome back, Admin. Here's the latest overview.</p>

      <div className={styles.dashboardList}>
        {/* Users */}
        <div className={styles.dashboardItem}>
          <span className={styles.icon}>👥</span>
          <span className={styles.label}>Users</span>
          <span className={styles.count}>{usersCount}</span>
          <button className={styles.viewButton} onClick={() => handleViewAccounts("User")}>
            View
          </button>
        </div>

        {/* Teachers */}
        <div className={styles.dashboardItem}>
          <span className={styles.icon}>📚</span>
          <span className={styles.label}>Teachers</span>
          <span className={styles.count}>{teachersCount}</span>
          <button className={styles.viewButton} onClick={() => handleViewAccounts("Teacher")}>
            View
          </button>
        </div>

        {/* Requests */}
        <div className={styles.dashboardItem}>
          <span className={styles.icon}>📝</span>
          <span className={styles.label}>Requests</span>
          <span className={styles.count}>{requestsCount}</span>
          <button
            className={styles.manageButton}
            onClick={() => setSelectedPage("requests")}
          >
            Go to Requests
          </button>
        </div>

        {/* Payments */}
        <div className={styles.dashboardItem}>
          <span className={styles.icon}>💳</span>
          <span className={styles.label}>Payments</span>
          <span className={styles.count}>{paymentsCount}</span>
          <button
            className={styles.manageButton}
            onClick={() => setSelectedPage("payments")}
          >
            Go to Payments
          </button>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            {blockMode ? (
              <>
                <h2>Block {blockUser.username}</h2>
                <p>Block and send reason to {blockUser.email}</p>
                <textarea
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className={styles.reasonBox}
                  placeholder="Enter reason..."
                />
                <div className={styles.popupButtonGroup}>
                  <button className={styles.blockButton} onClick={handleBlockAndSend}>
                    Block and Send
                  </button>
                  <button className={styles.cancelButton} onClick={handleClosePopup}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2>{popupTitle}</h2>
                <div className={styles.tableWrapper}>
                  <table className={styles.accountTable}>
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Username</th>
                        <th>Email</th>
                        {isTeacherView && <th>Remaining</th>}
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleAccounts.map((acc, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{acc.username}</td>
                          <td>{acc.email}</td>
                          {isTeacherView && <td>{acc.remaining}</td>}
                          <td>
                            <button
                              className={styles.blockSmallButton}
                              onClick={() => handleBlockClick(acc)}
                            >
                              Block
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button className={styles.closeButton} onClick={handleClosePopup}>
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
