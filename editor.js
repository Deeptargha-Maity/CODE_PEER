import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection, dropCursor, rectangularSelection, crosshairCursor } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldGutter } from '@codemirror/language';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';

// Custom CodePeer dark theme
const codepeerTheme = EditorView.theme({
  '&': { background: '#0d0f17', color: '#e2e8f0', height: '100%', fontSize: '13px' },
  '.cm-content': { fontFamily: "'JetBrains Mono', monospace", padding: '12px 0', caretColor: '#6366f1' },
  '.cm-cursor': { borderLeftColor: '#6366f1', borderLeftWidth: '2px' },
  '.cm-gutters': { background: '#0d0f17', borderRight: '1px solid rgba(255,255,255,0.05)', color: '#374151' },
  '.cm-lineNumbers .cm-gutterElement': { paddingRight: '12px', paddingLeft: '8px' },
  '.cm-activeLine': { background: 'rgba(99,102,241,0.06)' },
  '.cm-activeLineGutter': { background: 'rgba(99,102,241,0.1)', color: '#6366f1' },
  '.cm-selectionBackground, ::selection': { background: 'rgba(99,102,241,0.25) !important' },
  '.cm-focused': { outline: 'none' },
  '.cm-scroller': { overflow: 'auto', lineHeight: '1.75' },
  '.cm-matchingBracket': { background: 'rgba(99,102,241,0.2)', borderRadius: '2px' },
  // Mentor decoration
  '.mentor-line': { background: 'rgba(99,102,241,0.08)', borderLeft: '2px solid #6366f1' },
}, { dark: true });

const langMap = { python, javascript, cpp };

let view = null;

function getLangExt(lang) {
  if (lang === 'python') return python();
  if (lang === 'javascript') return javascript();
  if (lang === 'cpp') return cpp();
  return python();
}

function buildExtensions(lang, onChange) {
  return [
    history(),
    lineNumbers(),
    highlightActiveLine(),
    highlightActiveLineGutter(),
    drawSelection(),
    dropCursor(),
    rectangularSelection(),
    crosshairCursor(),
    bracketMatching(),
    foldGutter(),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
    oneDark,
    codepeerTheme,
    getLangExt(lang),
    EditorView.updateListener.of(update => {
      if (update.docChanged) onChange(update.state.doc.toString());
    })
  ];
}

// Initialize when app is ready
window.initCMEditor = function(containerId, initialCode, lang, onChange) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const state = EditorState.create({
    doc: initialCode,
    extensions: buildExtensions(lang, onChange)
  });

  view = new EditorView({ state, parent: container });
  container.style.height = '100%';
  return view;
};

window.setCMLanguage = function(lang, code) {
  if (!view) return;
  const newState = EditorState.create({
    doc: code,
    extensions: buildExtensions(lang, window._cmOnChange)
  });
  view.setState(newState);
};

window.getCMValue = function() {
  return view ? view.state.doc.toString() : '';
};

window.setCMValue = function(code) {
  if (!view) return;
  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: code }
  });
};
