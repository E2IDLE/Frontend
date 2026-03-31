import { useState } from "react";

let _tid = 0, _set = null;

export function useToasts() {
  const [ts, set] = useState([]);
  _set = set;
  return ts;
}

export function toast(msg, type = "ok") {
  if (!_set) return;
  const id = ++_tid;
  _set(p => [...p, { id, msg, type }]);
  setTimeout(() => {
    _set(p => p.map(t => t.id === id ? { ...t, out: true } : t));
    setTimeout(() => _set(p => p.filter(t => t.id !== id)), 220);
  }, 2800);
}
