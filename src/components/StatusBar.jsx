import styles from './StatusBar.module.css';

export default function StatusBar() {
  return (
    <div className={styles.statusBar}>
      <span className={styles.statusItem}>
        <span className={styles.statusDot} />
        ONLINE
      </span>
      <span className={styles.statusItem}>TABS::SECURE</span>
      <span className={styles.statusItem}>FF::GECKO ENGINE</span>
    </div>
  );
}
