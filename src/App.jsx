import { useState } from 'react';
import { useConfig } from './hooks/useConfig.js';
import { useClock } from './hooks/useClock.js';
import { useGlitch } from './hooks/useGlitch.js';

import Background from './components/Background.jsx';
import BootTag from './components/BootTag.jsx';
import Clock from './components/Clock.jsx';
import Search from './components/Search.jsx';
import Shortcuts from './components/Shortcuts.jsx';
import StatusBar from './components/StatusBar.jsx';
import TweaksPanel from './components/TweaksPanel.jsx';
import ToolsHub from './components/ToolsHub/index.jsx';

import styles from './App.module.css';

export default function App() {
  const { config, setConfig } = useConfig();
  const clock = useClock(config.name);
  const { active: glitching, tearPositions } = useGlitch();
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <div className={styles.root}>
      <Background
        glitching={glitching}
        tearPositions={tearPositions}
        decoSeconds={clock.decoSeconds}
      />

      <button className={styles.toolsBtn} onClick={() => setToolsOpen(true)}>
        [TOOLS]
      </button>

      <main className={styles.app}>
        <BootTag />
        <Clock hours={clock.hours} minutes={clock.minutes} ampm={clock.ampm} />
        <div className={styles.date}>{clock.dateStr}</div>
        <div className={`${styles.greeting} ${glitching ? styles.jitter : ''}`}>
          {clock.greeting}
        </div>
        <Search />
        <Shortcuts config={config} />
      </main>

      <StatusBar />
      <TweaksPanel config={config} setConfig={setConfig} />
      <ToolsHub open={toolsOpen} onClose={() => setToolsOpen(false)} />
    </div>
  );
}
