import { useState, useEffect, useCallback } from 'react';
import { WORDS } from '../../../constants/words.js';
import s from './shared.module.css';
import styles from './PasswordGenerator.module.css';

const CU = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const CL = 'abcdefghijklmnopqrstuvwxyz';
const CN = '0123456789';
const CS = '!@#$%^&*()-_=+[]{}|;:,.<>?';

const rInt  = (n) => Math.floor(Math.random() * n);
const rPick = (s) => s[rInt(s.length)];

function genRandom(len, tog) {
  let pool = '';
  if (tog.upper) pool += CU;
  if (tog.lower) pool += CL;
  if (tog.num)   pool += CN;
  if (tog.sym)   pool += CS;
  if (!pool) pool = CL;

  const must = [];
  if (tog.upper) must.push(rPick(CU));
  if (tog.lower) must.push(rPick(CL));
  if (tog.num)   must.push(rPick(CN));
  if (tog.sym)   must.push(rPick(CS));

  const chars = [...must];
  for (let i = 0; i < len - must.length; i++) chars.push(rPick(pool));
  for (let i = chars.length - 1; i > 0; i--) {
    const j = rInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

function genPassphrase(wc, sep, tog) {
  let words = Array.from({ length: wc }, () => rPick(WORDS));
  if (tog.cap) words = words.map((w) => w[0].toUpperCase() + w.slice(1));
  let out = words.join(sep);
  if (tog.num2) out += sep + rInt(1000);
  return out;
}

function calcStrength(pwd) {
  let s = 0;
  if (pwd.length >= 8)           s++;
  if (pwd.length >= 14)          s++;
  if (pwd.length >= 20)          s++;
  if (/[A-Z]/.test(pwd))         s++;
  if (/[a-z]/.test(pwd))         s++;
  if (/[0-9]/.test(pwd))         s++;
  if (/[^A-Za-z0-9]/.test(pwd))  s++;
  return s;
}

const LEVELS = [
  { color: '#ff2d78', text: 'WEAK' },
  { color: '#ff2d78', text: 'WEAK' },
  { color: '#ff8c42', text: 'FAIR' },
  { color: '#ff8c42', text: 'FAIR' },
  { color: '#ffd700', text: 'MODERATE' },
  { color: '#00ffc8', text: 'STRONG' },
  { color: '#00ffc8', text: 'STRONG' },
  { color: '#00ffc8', text: 'VERY_STRONG' },
];

export default function PasswordGenerator() {
  const [mode,   setMode]   = useState('random');
  const [length, setLength] = useState(16);
  const [wc,     setWc]     = useState(4);
  const [sep,    setSep]    = useState('-');
  const [tog, setTog] = useState({ upper: true, lower: true, num: true, sym: false, cap: false, num2: false });
  const [password, setPassword] = useState('');
  const [copied,   setCopied]   = useState(false);

  const generate = useCallback(() => {
    const pwd = mode === 'random'
      ? genRandom(length, tog)
      : genPassphrase(wc, sep, tog);
    setPassword(pwd);
  }, [mode, length, wc, sep, tog]);

  useEffect(() => { generate(); }, [generate]);

  function toggleChar(key) {
    setTog((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function copyPwd() {
    if (!password) return;
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }

  const sc = calcStrength(password);
  const level = LEVELS[Math.min(sc, 7)];

  return (
    <div className={styles.wrap}>
      {/* Mode tabs */}
      <div className={styles.modes}>
        {['random', 'phrase'].map((m) => (
          <button
            key={m}
            className={`${styles.modeTab} ${mode === m ? styles.modeTabActive : ''}`}
            onClick={() => setMode(m)}
          >
            {m === 'random' ? 'RANDOM' : 'PASSPHRASE'}
          </button>
        ))}
      </div>

      {/* Output */}
      <div className={styles.outputWrap}>
        <div className={styles.output}>{password}</div>
        <button className={`${s.btn}`} onClick={copyPwd}>
          {copied ? 'COPIED' : 'COPY'}
        </button>
      </div>

      {/* Strength */}
      <div className={styles.strengthBar}>
        <div
          className={styles.strengthFill}
          style={{ width: `${Math.min(100, sc * 15)}%`, background: level.color }}
        />
      </div>
      <div className={styles.strengthLabel} style={{ color: level.color }}>
        STRENGTH::{level.text}
      </div>

      <hr className={s.sep} style={{ margin: '10px 0' }} />

      {/* Random options */}
      {mode === 'random' && (
        <div className={styles.opts}>
          <div className={styles.sliderRow}>
            <label>LENGTH</label>
            <input
              type="range" min="8" max="64"
              value={length}
              onChange={(e) => setLength(+e.target.value)}
            />
            <span className={styles.sliderVal}>{length}</span>
          </div>
          <div className={styles.toggles}>
            {[
              { key: 'upper', label: 'A-Z' },
              { key: 'lower', label: 'a-z' },
              { key: 'num',   label: '0-9' },
              { key: 'sym',   label: '!@#' },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`${styles.toggle} ${tog[key] ? styles.toggleOn : ''}`}
                onClick={() => toggleChar(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Passphrase options */}
      {mode === 'phrase' && (
        <div className={styles.opts}>
          <div className={styles.sliderRow}>
            <label>WORDS</label>
            <input
              type="range" min="3" max="8"
              value={wc}
              onChange={(e) => setWc(+e.target.value)}
            />
            <span className={styles.sliderVal}>{wc}</span>
          </div>
          <div className={styles.sliderRow}>
            <label>SEPARATOR</label>
            <select className={s.select} value={sep} onChange={(e) => setSep(e.target.value)}>
              <option value="-">hyphen ( - )</option>
              <option value="_">underscore ( _ )</option>
              <option value=".">dot ( . )</option>
              <option value=" ">space (   )</option>
            </select>
          </div>
          <div className={styles.toggles}>
            {[
              { key: 'cap',  label: 'CAPITALIZE' },
              { key: 'num2', label: '+NUMBER' },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`${styles.toggle} ${tog[key] ? styles.toggleOn : ''}`}
                onClick={() => toggleChar(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <button className={`${s.btn} ${s.btnPink}`} onClick={generate}>
          ↺ REGENERATE
        </button>
      </div>
    </div>
  );
}
