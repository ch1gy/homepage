import { useState, useEffect } from 'react';

const pad = (n) => String(n).padStart(2, '0');
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function computeClockState(name) {
  const d = new Date();
  let h = d.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;

  const hours   = pad(h);
  const minutes = pad(d.getMinutes());
  const dateStr = `${DAYS[d.getDay()].toUpperCase()} ${MONTHS[d.getMonth()].toUpperCase()} ${d.getDate()} ${d.getFullYear()}`;
  const decoSeconds = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

  const safeName = name || 'friend';
  const day  = d.getDay();
  const hour = d.getHours();
  let greeting;
  if (day === 5 && hour >= 16)  greeting = `happy_friday(${safeName})`;
  else if (hour < 5)            greeting = `late_night_session(${safeName})`;
  else if (hour < 12)           greeting = `good_morning(${safeName})`;
  else if (hour < 18)           greeting = `good_afternoon(${safeName})`;
  else                          greeting = `good_evening(${safeName})`;

  return { hours, minutes, ampm, dateStr, greeting, decoSeconds };
}

export function useClock(name) {
  const [state, setState] = useState(() => computeClockState(name));

  useEffect(() => {
    setState(computeClockState(name));
    const id = setInterval(() => setState(computeClockState(name)), 1000);
    return () => clearInterval(id);
  }, [name]);

  return state;
}
