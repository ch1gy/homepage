import { useState, useCallback } from 'react';

const STORAGE_KEY = 'y2k_cfg';

const DEFAULTS = {
  name: 'chigy',
  l1: 'YouTube',  u1: 'https://youtube.com',
  l2: 'GitHub',   u2: 'https://github.com',
  l3: 'Mail',     u3: 'https://mail.google.com',
  l4: 'Work',     u4: 'https://www.chigy.dev',
};

function loadConfig() {
  try {
    return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'));
  } catch {
    return { ...DEFAULTS };
  }
}

export function useConfig() {
  const [config, setConfigState] = useState(loadConfig);

  const setConfig = useCallback((partial) => {
    setConfigState(prev => {
      const next = { ...prev, ...partial };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { config, setConfig };
}
