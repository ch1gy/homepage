import { useEffect, useRef } from 'react';
import styles from './Background.module.css';

export default function Background({ glitching, tearPositions, decoSeconds }) {
  const flashRef = useRef(null);

  // Apply rgb-split class to document body during glitch
  useEffect(() => {
    if (glitching) {
      document.body.classList.add('rgb-split');
      const t = setTimeout(() => document.body.classList.remove('rgb-split'), 250);
      return () => clearTimeout(t);
    }
  }, [glitching]);

  // Force animation restart on CRT flash element
  useEffect(() => {
    if (glitching && flashRef.current) {
      flashRef.current.classList.remove(styles.fire);
      void flashRef.current.offsetWidth; // reflow
      flashRef.current.classList.add(styles.fire);
    } else if (!glitching && flashRef.current) {
      flashRef.current.classList.remove(styles.fire);
    }
  }, [glitching]);

  return (
    <>
      <div className={styles.gridBg} />
      <div className={styles.scanlines} />

      <div className={`${styles.corner} ${styles.cornerTl}`} />
      <div className={`${styles.corner} ${styles.cornerTr}`} />
      <div className={`${styles.corner} ${styles.cornerBl}`} />
      <div className={`${styles.corner} ${styles.cornerBr}`} />

      <div className={`${styles.decoText} ${styles.decoTl}`}>SYS::INIT_OK</div>
      <div className={`${styles.decoText} ${styles.decoTr}`}>VER 2.0.0</div>
      <div className={`${styles.decoText} ${styles.decoBl}`}>MEM::NOMINAL</div>
      <div className={`${styles.decoText} ${styles.decoBr}`}>{decoSeconds}</div>

      <div ref={flashRef} className={styles.crtFlash} />

      <div className={styles.tearLines}>
        {tearPositions.map((pos, i) => (
          <div
            key={i}
            className={`${styles.tear}${glitching ? ' ' + styles.active : ''}`}
            style={{ top: `${pos}vh` }}
          />
        ))}
      </div>
    </>
  );
}
