/* Runs learner code in Pyodide off the main thread so an infinite loop cannot freeze the page. */
import { loadPyodide } from '../vendor/pyodide/pyodide.mjs';
let py, loading, busy = false;
self.onmessage = async ({ data }) => {
  const id = data.id;
  if (busy) { self.postMessage({ id, type: 'done', ok: false, out: 'Python is already running.' }); return; }
  busy = true;
  try {
    if (!py) {
      self.postMessage({ id, type: 'status', phase: 'loading', text: 'Loading Python (first run takes a few seconds)...' });
      loading ||= loadPyodide({ indexURL: new URL('../vendor/pyodide/', self.location.href).href });
      try { py = await loading; } catch (e) { loading = null; throw e; }
    }
    self.postMessage({ id, type: 'status', phase: 'running', text: 'Running...' });
    const out = [];
    let size = 0;
    const push = (s) => { if (size < 60000) { const line = String(s).slice(0, 60000 - size); out.push(line); size += line.length + 1; } };
    py.setStdout({ batched: push });
    py.setStderr({ batched: push });
    const dict = py.globals.get('dict');
    const scope = dict();
    dict.destroy();
    try {
      await py.runPythonAsync(data.code, { globals: scope });
      if (data.tests) {
        await py.runPythonAsync(data.tests, { globals: scope });
        push('All tests passed.');
      }
      self.postMessage({ id, type: 'done', ok: true, out: out.join('\n') || '(no output)' });
    } finally { scope.destroy(); }
  } catch (err) {
    const msg = String(err && err.message || err);
    const lines = msg.split('\n').filter((l) => !/^\s+File "\/lib\/python|_pyodide|pyodide\.ffi|^\s+\^+$/.test(l));
    self.postMessage({ id, type: 'done', ok: false, out: lines.slice(-14).join('\n') });
  } finally { busy = false; }
};
