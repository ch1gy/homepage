import { useEffect, useState } from 'react';
import styles from './TweaksPanel.module.css';

export default function TweaksPanel({ config, setConfig }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleMessage(e) {
      if (e.data?.type === '__activate_edit_mode')   setVisible(true);
      if (e.data?.type === '__deactivate_edit_mode') setVisible(false);
    }
    window.addEventListener('message', handleMessage);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!visible) return null;

  const rows = [
    { label: 'name',         key: 'name' },
    null,
    { label: 'link_1 label', key: 'l1' },
    { label: 'link_1 url',   key: 'u1' },
    null,
    { label: 'link_2 label', key: 'l2' },
    { label: 'link_2 url',   key: 'u2' },
    null,
    { label: 'link_3 label', key: 'l3' },
    { label: 'link_3 url',   key: 'u3' },
    null,
    { label: 'link_4 label', key: 'l4' },
    { label: 'link_4 url',   key: 'u4' },
  ];

  return (
    <div className={styles.panel}>
      <h3>// tweaks</h3>
      {rows.map((row, i) =>
        row === null
          ? <hr key={i} className={styles.sep} />
          : (
            <div key={row.key} className={styles.row}>
              <label>{row.label}</label>
              <input
                className={styles.input}
                value={config[row.key]}
                onChange={(e) => setConfig({ [row.key]: e.target.value })}
              />
            </div>
          )
      )}
    </div>
  );
}
