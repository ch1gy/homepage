import { useRef, useEffect } from 'react';
import styles from './BootTag.module.css';
import { useBootMessages } from '../hooks/useBootMessages.js';

export default function BootTag() {
  const { text, glitching } = useBootMessages();
  const tagRef = useRef(null);

  useEffect(() => {
    if (!tagRef.current) return;
    if (glitching) {
      tagRef.current.style.animation = 'bootGlitch 0.12s step-end';
      const t = setTimeout(() => {
        if (tagRef.current) tagRef.current.style.animation = '';
      }, 130);
      return () => clearTimeout(t);
    }
  }, [glitching]);

  return (
    <div ref={tagRef} className={styles.bootTag}>
      <span>{text}</span>
      <span className={styles.cursor} />
    </div>
  );
}
