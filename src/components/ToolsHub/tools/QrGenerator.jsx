import { useState, useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import s from './shared.module.css';
import styles from './QrGenerator.module.css';

export default function QrGenerator() {
  const [text,        setText]        = useState('');
  const [dotStyle,    setDotStyle]    = useState('square');
  const [cornerStyle, setCornerStyle] = useState('square');
  const [dotColor,    setDotColor]    = useState('#00ffc8');
  const [bgColor,     setBgColor]     = useState('#0a0a12');
  const [cornerColor, setCornerColor] = useState('#ff2d78');
  const [logo,        setLogo]        = useState(null);

  const previewRef = useRef(null);
  const qrRef      = useRef(null);

  function qrOpts() {
    return {
      width: 280,
      height: 280,
      type: 'canvas',
      data: text.trim() || 'https://chigy.dev',
      image: logo || undefined,
      dotsOptions:          { color: dotColor,    type: dotStyle    },
      backgroundOptions:    { color: bgColor                        },
      cornersSquareOptions: { type: cornerStyle,  color: cornerColor },
      cornersDotOptions:    { color: cornerColor                    },
      imageOptions:         { crossOrigin: 'anonymous', margin: 5  },
    };
  }

  useEffect(() => {
    if (!text.trim()) {
      if (previewRef.current) previewRef.current.innerHTML = '';
      qrRef.current = null;
      return;
    }
    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(qrOpts());
      if (previewRef.current) {
        previewRef.current.innerHTML = '';
        qrRef.current.append(previewRef.current);
      }
    } else {
      qrRef.current.update(qrOpts());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, dotStyle, cornerStyle, dotColor, bgColor, cornerColor, logo]);

  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target.result);
    reader.readAsDataURL(file);
  }

  function clearLogo() {
    setLogo(null);
    document.getElementById('qr-logo-file').value = '';
  }

  function download() {
    if (qrRef.current) qrRef.current.download({ name: 'qr_code', extension: 'png' });
  }

  const hasText = !!text.trim();

  return (
    <div className={styles.wrap}>
      <div className={styles.controls}>
        <div className={s.field}>
          <span className={s.fieldLabel}>text / url</span>
          <input
            className={s.input}
            type="text"
            placeholder="https://"
            autoComplete="off"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <hr className={s.sep} />

        <div className={s.field}>
          <span className={s.fieldLabel}>dot_style</span>
          <select className={s.select} value={dotStyle} onChange={(e) => setDotStyle(e.target.value)}>
            <option value="square">square</option>
            <option value="dots">dots</option>
            <option value="rounded">rounded</option>
            <option value="classy">classy</option>
            <option value="classy-rounded">classy-rounded</option>
            <option value="extra-rounded">extra-rounded</option>
          </select>
        </div>

        <div className={s.field}>
          <span className={s.fieldLabel}>corner_style</span>
          <select className={s.select} value={cornerStyle} onChange={(e) => setCornerStyle(e.target.value)}>
            <option value="square">square</option>
            <option value="dot">dot</option>
            <option value="extra-rounded">extra-rounded</option>
          </select>
        </div>

        <hr className={s.sep} />

        <div className={styles.colors}>
          {[
            { label: 'dots',    value: dotColor,    set: setDotColor    },
            { label: 'bg',      value: bgColor,     set: setBgColor     },
            { label: 'corners', value: cornerColor, set: setCornerColor },
          ].map(({ label, value, set }) => (
            <div key={label} className={styles.colorItem}>
              <span className={styles.colorLabel}>{label}</span>
              <input type="color" value={value} onChange={(e) => set(e.target.value)} />
            </div>
          ))}
        </div>

        <hr className={s.sep} />

        <div className={s.field}>
          <span className={s.fieldLabel}>logo_image</span>
          <input
            id="qr-logo-file"
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={handleLogoUpload}
          />
          <button className={`${s.btn} ${s.btnPink}`} style={{ marginTop: 4 }} onClick={clearLogo}>
            CLEAR_LOGO
          </button>
        </div>

        <button
          className={`${s.btn} ${s.btnAccent}`}
          disabled={!hasText}
          onClick={download}
        >
          ▼ DOWNLOAD_PNG
        </button>
      </div>

      <div className={styles.preview} ref={previewRef}>
        {!hasText && (
          <span className={styles.placeholder}>ENTER_URL_TO_GENERATE</span>
        )}
      </div>
    </div>
  );
}
