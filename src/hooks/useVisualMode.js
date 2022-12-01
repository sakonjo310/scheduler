import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    setMode(newMode);
    if(replace) {
      // history.pop();
      setHistory(prev => [...prev.slice(0, -1)]);
    }
    // history.push(newMode);
    setHistory(prev => [...prev, newMode]);
  }
  function back() {
    if (history.length > 1) {
    history.pop();
    setMode(history[history.length - 1]);
    }
  }

  return { mode, transition, back };
}