import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global safety patch to guarantee JSON.stringify never throws on cyclic or DOM structures
const originalStringify = JSON.stringify;
JSON.stringify = function (value: any, replacer?: any, space?: any): string {
  const seen = new WeakSet();
  const safeReplacer = (key: string, val: any) => {
    if (typeof val === 'object' && val !== null) {
      if (seen.has(val)) {
        return undefined; // Drop circular reference cleanly
      }
      seen.add(val);
    }
    if (typeof replacer === 'function') {
      return replacer(key, val);
    }
    return val;
  };

  try {
    if (Array.isArray(replacer)) {
      return originalStringify(
        value,
        (k: string, v: any) => {
          if (typeof v === 'object' && v !== null) {
            if (seen.has(v)) return undefined;
            seen.add(v);
          }
          if (k === '' || replacer.includes(k)) return v;
          return undefined;
        },
        space
      );
    }
    return originalStringify(value, safeReplacer, space);
  } catch {
    try {
      return originalStringify(value, undefined, space);
    } catch {
      return typeof value === 'object' && Array.isArray(value) ? '[]' : '{}';
    }
  }
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

