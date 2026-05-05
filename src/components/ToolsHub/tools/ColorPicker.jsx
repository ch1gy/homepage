import { useState } from 'react';
import s from './shared.module.css';
import styles from './ColorPicker.module.css';

// ── Color math ───────────────────────────────────────────
function hexToRgb(hex) {
  const m = hex.replace('#', '').match(/^([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  let h = m[0];
  if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16) };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b), l = (max+min)/2;
  if (max === min) return { h:0, s:0, l: Math.round(l*100) };
  const d = max - min;
  const sl = l > 0.5 ? d/(2-max-min) : d/(max+min);
  let h;
  switch (max) {
    case r: h = ((g-b)/d + (g<b?6:0)) / 6; break;
    case g: h = ((b-r)/d + 2) / 6; break;
    default: h = ((r-g)/d + 4) / 6;
  }
  return { h: Math.round(h*360), s: Math.round(sl*100), l: Math.round(l*100) };
}

function toHex(r, g, b) {
  return '#' + [r,g,b].map((v) => v.toString(16).padStart(2,'0')).join('');
}

function parseColor(str) {
  str = str.trim();
  if (/^#?[0-9a-f]{3,6}$/i.test(str)) return hexToRgb(str.startsWith('#') ? str : '#'+str);
  const rm = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rm) return { r:+rm[1], g:+rm[2], b:+rm[3] };
  const hm = str.match(/hsla?\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/i);
  if (hm) {
    const [hh, ss, ll] = [+hm[1], +hm[2]/100, +hm[3]/100];
    const a = ss * Math.min(ll, 1-ll);
    const f = (n) => {
      const k = (n + hh/30) % 12;
      return Math.round((ll - a * Math.max(-1, Math.min(k-3, 9-k, 1))) * 255);
    };
    return { r:f(0), g:f(8), b:f(4) };
  }
  return null;
}

// ── Component ─────────────────────────────────────────────
export default function ColorPicker() {
  const [cc,      setCc]      = useState({ r:255, g:45, b:120 });
  const [rawText, setRawText] = useState('#ff2d78');
  const [invalid, setInvalid] = useState(false);
  const [copied,  setCopied]  = useState(null);

  const hex = toHex(cc.r, cc.g, cc.b);
  const hsl = rgbToHsl(cc.r, cc.g, cc.b);
  const rgbStr = `rgb(${cc.r}, ${cc.g}, ${cc.b})`;
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  function applyColor(newCc) {
    setCc(newCc);
    setRawText(toHex(newCc.r, newCc.g, newCc.b));
    setInvalid(false);
  }

  function handleTextInput(e) {
    const val = e.target.value;
    setRawText(val);
    const parsed = parseColor(val);
    if (parsed) { setCc(parsed); setInvalid(false); }
    else setInvalid(true);
  }

  function handleNativePicker(e) {
    const parsed = hexToRgb(e.target.value);
    if (parsed) applyColor(parsed);
  }

  function copyValue(label, val) {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(null), 1200);
    });
  }

  function handleEyedrop() {
    if (!window.EyeDropper) {
      alert('EyeDropper API not supported in this browser.');
      return;
    }
    new window.EyeDropper().open().then((res) => {
      const parsed = hexToRgb(res.sRGBHex);
      if (parsed) applyColor(parsed);
    }).catch(() => {});
  }

  const formats = [
    { label: 'HEX', value: hex     },
    { label: 'RGB', value: rgbStr  },
    { label: 'HSL', value: hslStr  },
  ];

  return (
    <div className={styles.wrap}>
      <div className={styles.swatch} style={{ background: hex }} />

      <div className={styles.right}>
        <div className={styles.formats}>
          {formats.map(({ label, value }) => (
            <div key={label} className={styles.fmtRow}>
              <span className={styles.fmtLabel}>{label}</span>
              <input className={styles.fmtVal} type="text" readOnly value={value} />
              <button className={s.btn} onClick={() => copyValue(label, value)}>
                {copied === label ? 'COPIED' : 'COPY'}
              </button>
            </div>
          ))}
        </div>

        <div className={styles.inputRow}>
          <input
            type="color"
            className={styles.nativePicker}
            value={hex}
            onChange={handleNativePicker}
          />
          <input
            type="text"
            className={`${styles.textInput} ${invalid ? styles.textInputInvalid : ''}`}
            placeholder="#hex  rgb()  hsl()"
            value={rawText}
            onChange={handleTextInput}
            spellCheck={false}
          />
          <button className={s.btn} onClick={handleEyedrop}>EYEDROP</button>
        </div>
      </div>
    </div>
  );
}
