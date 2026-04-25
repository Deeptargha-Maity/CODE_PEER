// editor-entry.js — bundled into editor-bundle.js by esbuild
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';

const cpTheme = EditorView.theme({
  '&': { height: '100%', fontSize: '13px', background: '#0d0f17' },
  '.cm-content': { fontFamily: "'JetBrains Mono', monospace", padding: '12px 0', caretColor: '#6366f1' },
  '.cm-cursor,.cm-dropCursor': { borderLeftColor: '#6366f1', borderLeftWidth: '2px' },
  '.cm-gutters': { background: '#0d0f17', color: '#374151', borderRight: '1px solid rgba(255,255,255,0.06)' },
  '.cm-lineNumbers .cm-gutterElement': { paddingRight: '16px', paddingLeft: '10px' },
  '.cm-activeLine': { background: 'rgba(99,102,241,0.07)' },
  '.cm-activeLineGutter': { background: 'rgba(99,102,241,0.12)', color: '#6366f1' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': { background: 'rgba(99,102,241,0.25) !important' },
  '&.cm-focused': { outline: 'none' },
  '.cm-scroller': { lineHeight: '1.75', overflow: 'auto' },
}, { dark: true });

function getLang(lang) {
  if (lang === 'python') return python();
  if (lang === 'javascript') return javascript();
  if (lang === 'cpp') return cpp();
  return python();
}

function mkState(code, lang, onChange) {
  return EditorState.create({
    doc: code,
    extensions: [
      basicSetup, oneDark, cpTheme, getLang(lang),
      EditorView.updateListener.of(u => { if (u.docChanged) onChange(u.state.doc.toString()); })
    ]
  });
}

let view = null;

window.initCMEditor = (containerId, code, lang, onChange) => {
  const el = document.getElementById(containerId);
  if (!el) return;
  window._cmOnChange = onChange;
  view = new EditorView({ state: mkState(code, lang, onChange), parent: el });
};

window.setCMLanguage = (lang, code) => {
  if (!view) return;
  view.setState(mkState(code, lang, window._cmOnChange || (() => {})));
};

window.getCMValue = () => view ? view.state.doc.toString() : '';

window.setCMValue = code => {
  if (!view) return;
  view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: code } });
};
