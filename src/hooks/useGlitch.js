import { useState, useEffect, useRef } from 'react';

function randomTears() {
  return [
    10 + Math.random() * 80,
    10 + Math.random() * 80,
    10 + Math.random() * 80,
  ];
}

export function useGlitch() {
  const [active, setActive] = useState(false);
  const [tearPositions, setTearPositions] = useState([30, 55, 70]);
  const timeoutRef = useRef(null);

  useEffect(() => {
    function fire() {
      setTearPositions(randomTears());
      setActive(true);
      setTimeout(() => setActive(false), 250);
      timeoutRef.current = setTimeout(fire, 12000 + Math.random() * 22000);
    }

    // initial delay matches original: 12s + random 0-10s
    timeoutRef.current = setTimeout(fire, 12000 + Math.random() * 10000);

    return () => clearTimeout(timeoutRef.current);
  }, []);

  return { active, tearPositions };
}
