import styles from "./AdminStyles.module.css";

function AdminHeader() {
  return (
    <header className={styles.adminHeader}>
      <div className={styles.logo}>Admin Panel</div>
      <nav className={styles.nav}>
        <a href="/HomeAdmin" className={styles.navLink}>Dashboard</a>
        <a href="/Home" className={styles.navLink}>User Site</a>
      </nav>
    </header>
  );
}

export default AdminHeader;
