import styles from "./ControlAdminStyles.module.css";

function Toast({ message }) {
  return (
    <div className={styles.toastContainer}>
      <div className={styles.toastMessage}>
        {message}
      </div>
    </div>
  );
}

export default Toast;
