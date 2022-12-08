import { useState } from 'react';

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);

/// Transition from one state to another ///
  function transition(newMode, replace = false) {
    setHistory(prev => replace ? [...prev.slice(0,-1), newMode] : [...prev, newMode]);
  }

/// Function to go back to the previous state ///
  function back() {
    if (history.length <= 1) return;
    setHistory(prev => prev.slice(0,-1))
  }

/// Set mode to the last state ///
  const mode = history[history.length - 1]
  
  return { mode, transition, back };
}
