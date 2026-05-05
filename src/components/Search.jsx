import { useState, useRef } from 'react';
import styles from './Search.module.css';

export default function Search() {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && value.trim()) {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(value.trim())}`;
    }
  }

  return (
    <div className={styles.searchWrap}>
      <input
        ref={inputRef}
        className={styles.search}
        type="search"
        placeholder="query_google //"
        autoComplete="off"
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {!value && <span className={styles.cursor}>█</span>}
    </div>
  );
}
