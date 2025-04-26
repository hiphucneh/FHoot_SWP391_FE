import { useState } from "react";
import styles from "./ControlAdminStyles.module.css";

function PaymentManagement() {
  const [payments, setPayments] = useState([
    { id: 1, email: "host1@gmail.com", orderId: "ORD-101", plan: "3 Months", paymentDate: "2024-04-20", status: "Paid" },
    { id: 2, email: "host2@gmail.com", orderId: "ORD-102", plan: "1 Month", paymentDate: "2024-04-18", status: "Paid" },
    { id: 3, email: "host3@gmail.com", orderId: "ORD-103", plan: "9 Months", paymentDate: "2024-04-10", status: "Paid" },
    { id: 4, email: "host4@gmail.com", orderId: "ORD-104", plan: "1 Month", paymentDate: "2024-04-08", status: "Paid" },
  ]);

  const handleReload = () => {
    localStorage.setItem("adminPage", "payments"); // 👈 set lại trước khi reload
    window.location.reload();
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.paymentHeader}>
        <h1 className={styles.pageTitle}>💳 Host Payments</h1>
        <button onClick={handleReload} className={styles.reloadButton}>🔄 Reload</button>
      </div>

      <div className={styles.invoiceGrid}>
        {payments.map((payment) => (
          <div key={payment.id} className={styles.invoiceCard}>
            <p><strong>Order ID:</strong> {payment.orderId}</p>
            <p><strong>Email:</strong> {payment.email}</p>
            <p><strong>Plan:</strong> {payment.plan}</p>
            <p><strong>Payment Date:</strong> {payment.paymentDate}</p>
            <p><strong>Status:</strong> <span className={styles.paidStatus}>{payment.status}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaymentManagement;
