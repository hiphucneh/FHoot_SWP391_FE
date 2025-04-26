import { useState } from "react";
import Toast from "./Toast";
import styles from "./ControlAdminStyles.module.css";

function RequestManagement() {
  const [requests, setRequests] = useState([
    { id: 1, email: "user2@gmail.com", orderId: "ORD-001", requestDate: "2024-04-25", package: "1 Month" },
    { id: 2, email: "teacher3@gmail.com", orderId: "ORD-002", requestDate: "2024-04-24", package: "3 Months" },
    { id: 3, email: "teacher4@gmail.com", orderId: "ORD-003", requestDate: "2024-04-20", package: "9 Months" },
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const handleManage = (req) => {
    setSelectedRequest(req);
  };

  const handleApprove = () => {
    setToastMessage(`Approved ${selectedRequest.email}`);
    setRequests(prev => prev.filter(r => r.id !== selectedRequest.id));
    setSelectedRequest(null);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleReject = () => {
    setToastMessage(`Rejected ${selectedRequest.email}`);
    setRequests(prev => prev.filter(r => r.id !== selectedRequest.id));
    setSelectedRequest(null);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleCancel = () => {
    setSelectedRequest(null);
  };

  const handleReload = () => {
    localStorage.setItem("adminPage", "requests"); // 👉 giữ tab "Request Management"
    window.location.reload();
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header + Reload */}
      <div className={styles.paymentHeader}>
        <h1 className={styles.pageTitle}>📝 Teacher Requests</h1>
        <button onClick={handleReload} className={styles.reloadButton}>🔄 Reload</button>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th>Email</th>
              <th>Order ID</th>
              <th>Request Date</th>
              <th>Package</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, index) => (
              <>
                <tr key={req.id} className={styles.tableRow}>
                  <td>{req.email}</td>
                  <td>{req.orderId}</td>
                  <td>{req.requestDate}</td>
                  <td>{req.package}</td>
                  <td>
                    <button 
                      onClick={() => handleManage(req)}
                      className={styles.manageButtonSmall}
                    >
                      Manage
                    </button>
                  </td>
                </tr>

                {/* separator */}
                {index !== requests.length - 1 && (
                  <tr>
                    <td colSpan="5">
                      <hr className={styles.separator} />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup quản lý */}
      {selectedRequest && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h2>Manage Request</h2>
            <p className="mt-2">{selectedRequest.email}</p>
            <div className={styles.popupButtonGroup}>
              <button onClick={handleApprove} className={styles.approveButton}>Approve</button>
              <button onClick={handleReject} className={styles.rejectButton}>Reject</button>
              <button onClick={handleCancel} className={styles.cancelButton}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}

export default RequestManagement;
