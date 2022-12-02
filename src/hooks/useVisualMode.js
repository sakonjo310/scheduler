import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    setMode(newMode);
    if(replace) {
      setHistory(prev => [...prev.slice(0, -1)]);
    }
    setHistory(prev => [...prev, newMode]);
  }
  function back() {
    if (history.length > 1) {
      setHistory(prev => {
        prev.pop();
        setMode(prev[prev.length-1]);
        return [...prev];
      })
    }
  }

  return { mode, transition, back };
}