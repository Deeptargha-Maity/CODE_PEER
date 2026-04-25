// editor-umd.js — uses the CM global exposed by codemirror@6 UMD bundle
(function () {
  // The UMD bundle exposes everything on window.CM
  // Wait for it to be available
  function waitForCM(cb) {
    if (window.CM) cb(window.CM);
    else setTimeout(() => waitForCM(cb), 50);
  }

  waitForCM(function (CM) {
    const {
      EditorState, EditorView,
      basicSetup,
      python, javascript, cpp,
      oneDark
    } = CM;

    // ── Custom CodePeer theme ──
    const cpTheme = EditorView.theme({
      '&': { height: '100%', fontSize: '13px', background: '#0d0f17' },
      '.cm-content': { fontFamily: "'JetBrains Mono', 'Fira Mono', monospace", padding: '12px 0', caretColor: '#6366f1' },
      '.cm-cursor,.cm-dropCursor': { borderLeftColor: '#6366f1', borderLeftWidth: '2px' },
      '.cm-gutters': { background: '#0d0f17', color: '#374151', borderRight: '1px solid rgba(255,255,255,0.06)' },
      '.cm-lineNumbers .cm-gutterElement': { paddingRight: '16px', paddingLeft: '10px' },
      '.cm-activeLine': { background: 'rgba(99,102,241,0.07)' },
      '.cm-activeLineGutter': { background: 'rgba(99,102,241,0.12)', color: '#6366f1' },
      '&.cm-focused .cm-selectionBackground, ::selection': { background: 'rgba(99,102,241,0.25) !important' },
      '&.cm-focused': { outline: 'none' },
      '.cm-scroller': { lineHeight: '1.75', overflow: 'auto' },
      '.cm-matchingBracket': { background: 'rgba(99,102,241,0.2)', borderRadius: '2px' },
      '.mentor-line': { background: 'rgba(99,102,241,0.08)', borderLeft: '2px solid #6366f1' },
    }, { dark: true });

    let view = null;

    function getLangExt(lang) {
      if (lang === 'python' && python) return python();
      if (lang === 'javascript' && javascript) return javascript();
      if (lang === 'cpp' && cpp) return cpp();
      return python ? python() : [];
    }

    function buildState(code, lang, onChange) {
      const extensions = [
        basicSetup,
        oneDark,
        cpTheme,
        getLangExt(lang),
        EditorView.updateListener.of(u => { if (u.docChanged) onChange(u.state.doc.toString()); })
      ];
      return EditorState.create({ doc: code, extensions });
    }

    // ── Public API (mirrors editor.js ESM API) ──
    window.initCMEditor = function (containerId, code, lang, onChange) {
      const el = document.getElementById(containerId);
      if (!el) return;
      window._cmOnChange = onChange;
      view = new EditorView({ state: buildState(code, lang, onChange), parent: el });
    };

    window.setCMLanguage = function (lang, code) {
      if (!view) return;
      view.setState(buildState(code, lang, window._cmOnChange || (() => {})));
    };

    window.getCMValue = function () {
      return view ? view.state.doc.toString() : '';
    };

    window.setCMValue = function (code) {
      if (!view) return;
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: code } });
    };

    // Signal app.js that editor is ready
    window._cmReady = true;
  });
})();
