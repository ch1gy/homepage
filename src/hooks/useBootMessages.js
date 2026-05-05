import { useState, useEffect, useRef } from 'react';
import { BOOT_MSGS } from '../constants/bootMessages.js';

export function useBootMessages() {
  const [text, setText] = useState('');
  const [glitching, setGlitching] = useState(false);

  const state = useRef({ idx: 0, pos: 0, phase: 'typing' });

  useEffect(() => {
    let timeoutId;

    function tick() {
      const { idx, pos, phase } = state.current;
      const msg = BOOT_MSGS[idx];

      if (phase === 'typing') {
        if (pos < msg.length) {
          state.current.pos = pos + 1;
          setText(msg.slice(0, pos + 1));
          timeoutId = setTimeout(tick, 45);
        } else {
          state.current.phase = 'holding';
          timeoutId = setTimeout(tick, 2800);
        }
      } else if (phase === 'holding') {
        // glitch flash
        setGlitching(true);
        setTimeout(() => setGlitching(false), 130);
        state.current.phase = 'deleting';
        timeoutId = setTimeout(tick, 200);
      } else {
        // deleting
        if (pos > 0) {
          state.current.pos = pos - 1;
          setText(msg.slice(0, pos - 1));
          timeoutId = setTimeout(tick, 25);
        } else {
          state.current.idx = (idx + 1) % BOOT_MSGS.length;
          state.current.phase = 'typing';
          timeoutId = setTimeout(tick, 100);
        }
      }
    }

    timeoutId = setTimeout(tick, 50);
    return () => clearTimeout(timeoutId);
  }, []);

  return { text, glitching };
}
