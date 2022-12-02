import { useState } from 'react';

// export default function useVisualMode(initial) {
//   // const [mode, setMode] = useState(initial);
//   const [history, setHistory] = useState([initial]);

//   function transition(newMode, replace = false) {
//     // setMode(newMode);
    
//     // if(replace) {
//     //   setHistory(prev => [...prev.slice(0, -1)]);
//     // }
//     setHistory(prev => {
//       const newHistory = [...prev];
//       if (replace) {
//         newHistory.pop();
//       }
//       newHistory.push(newMode)
//       return newHistory;
//     })

//     // setHistory(prev => [...prev, newMode]);
//   }

//   function back() {
//     if (history.length < 2) {
//       return;
//     }
    
//     setHistory(prev => prev.slice(0,-1))
//     // setMode(newHistory.slice(-1));
//     // return newHistory;

//   }

//   const mode = history[history.length - 1]
//   return { mode, transition, back };
// }

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    if(replace) {
      setHistory(prev => [...prev.slice(0, -1)]);
    }
    setHistory(prev => [...prev, newMode]);
  }

  function back() {
    if (history.length < 2) return;
    setHistory(prev => prev.slice(0,-1))
  }

  const mode = history[history.length - 1]
  return { mode, transition, back };
}