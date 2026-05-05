import styles from './Clock.module.css';

export default function Clock({ hours, minutes, ampm }) {
  const timeStr = `${hours}:${minutes}`;

  return (
    <div className={styles.clock}>
      <span className={styles.glitchR}>{timeStr}</span>
      <span className={styles.glitchC}>{timeStr}</span>
      <span>{hours}</span>
      <span className={styles.colon}>:</span>
      <span>{minutes}</span>
      <span className={styles.ampm}>{ampm}</span>
    </div>
  );
}
