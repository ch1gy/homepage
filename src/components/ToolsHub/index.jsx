import { useState, useEffect } from 'react';
import PasswordGenerator from './tools/PasswordGenerator.jsx';
import QrGenerator from './tools/QrGenerator.jsx';
import ColorPicker from './tools/ColorPicker.jsx';
import styles from './ToolsHub.module.css';

const TABS = [
  { id: 'qr',    label: 'QR_CODE'  },
  { id: 'pwd',   label: 'PASSWORD' },
  { id: 'color', label: 'COLOR'    },
];

export default function ToolsHub({ open, onClose }) {
  const [activeTab, setActiveTab] = useState('qr');

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && open) onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className={styles.overlay} onClick={handleBackdrop}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={styles.title}>// tools</span>
          <div className={styles.tabs}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button className={styles.close} onClick={onClose}>[×]</button>
        </div>

        <div className={styles.body}>
          {activeTab === 'pwd'   && <PasswordGenerator />}
          {activeTab === 'qr'    && <QrGenerator />}
          {activeTab === 'color' && <ColorPicker />}
        </div>
      </div>
    </div>
  );
}
