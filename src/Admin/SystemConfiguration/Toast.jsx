import styles from "./Toast.module.css";

function Toast({ type = "success", message = "", onClose }) {
  return (
    <div className={`${styles.toast} ${styles[type]}`} onClick={onClose}>
      {type === "success" ? "✅" : "❌"} {message}
    </div>
  );
}

export default Toast;