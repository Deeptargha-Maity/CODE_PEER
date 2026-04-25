// ── STATE ──
const state = {
  lang: 'python', problemId: 'twoSum', xp: 0, streak: 3,
  debounceTimer: null, lintTimer: null, hintLevel: null,
  recording: false, recognition: null,
  vizVisible: false, refactorShown: false, solved: false,
  errors: [],
  // Session tracking for skill dashboard
  session: {
    startTime: Date.now(),
    problemsSolved: 0,
    hintsUsed: 0,
    duckUsed: 0,
    clueUnlockedByDuck: false,
    refactorAccepted: 0,
    testsRun: 0,
    testsPassed: 0,
    level2Solved: false
  },
  // Duck gate: must speak before Clue unlocked
  duckClueUnlocked: false,
  refactorLevel: 1,   // 1 = original, 2 = time-travel challenge
  skills: JSON.parse(JSON.stringify(SKILLS))
};

// ── INIT ──
window.addEventListener('DOMContentLoaded', () => {
  mermaid.initialize({ startOnLoad: false, theme: 'dark', themeVariables: {
    background: '#12151f', primaryColor: '#6366f1',
    edgeLabelBackground: '#181c2a', tertiaryColor: '#1e2235'
  }});
  loadProblem(state.problemId);
  buildProblemDropdown();
  renderSkillTree(); renderAchievements();
  setupLangButtons();
  document.getElementById('btn-duck').addEventListener('click', openDuckModal);
  document.getElementById('btn-skill').addEventListener('click', openSkillModal);
  updateXP(0);
  // Editor is initialized from editor.js (module) after DOM is ready
  initEditor();
});

// ── PROBLEM LOADER ──
function loadProblem(id) {
  const p = PROBLEMS[id]; if (!p) return;
  state.problemId = id;
  document.getElementById('problem-title').textContent = p.title;
  const diffEl = document.getElementById('difficulty-tag');
  diffEl.textContent = p.difficulty;
  diffEl.className = 'difficulty-tag diff-' + p.difficulty.toLowerCase();
  const body = document.getElementById('problem-body');
  let html = `<h2>${p.title}</h2><p>${p.description}</p>`;
  p.examples.forEach((ex, i) => {
    html += `<div class="example-block"><strong>Example ${i+1}:</strong><br>Input: ${ex.input}<br>Output: ${ex.output}${ex.note ? '<br><em>// '+ex.note+'</em>' : ''}</div>`;
  });
  html += `<div class="tag-row">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>`;
  body.innerHTML = html;
}

// ── EDITOR INIT (CodeMirror) ──
function initEditor() {
  // editor.js module may still be loading — poll until ready
  const tryInit = () => {
    if (typeof window.initCMEditor === 'function') {
      window._cmOnChange = onCodeChange;
      window.initCMEditor('monaco-editor', PROBLEMS[state.problemId].starterCode[state.lang], state.lang, onCodeChange);
    } else {
      setTimeout(tryInit, 100);
    }
  };
  tryInit();
}

function onCodeChange(code) {
  clearTimeout(state.debounceTimer);
  clearTimeout(state.lintTimer);
  // Fast lint (300ms) for error marking
  state.lintTimer = setTimeout(() => lintCode(code), 300);
  // Slower Socratic analysis (800ms)
  setStatus('analyzing');
  state.debounceTimer = setTimeout(() => analyzeCode(code), 800);
}

function getEditorValue() {
  return typeof window.getCMValue === 'function' ? window.getCMValue() : '';
}

// ── LANGUAGE SWITCH ──
function setupLangButtons() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.lang = btn.dataset.lang;
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (typeof window.setCMLanguage === 'function') {
        window.setCMLanguage(state.lang, PROBLEMS[state.problemId].starterCode[state.lang]);
      }
    });
  });
}

// ── STATUS ──
function setStatus(s) {
  const dot = document.querySelector('.status-dot');
  const txt = document.getElementById('status-text');
  dot.className = 'status-dot ' + s;
  const errCount = state.errors.length;
  if (s === 'error') {
    txt.textContent = `${errCount} error${errCount > 1 ? 's' : ''}`;
  } else {
    txt.textContent = s === 'analyzing' ? 'Analyzing…' : s === 'done' ? (errCount ? `Analyzed · ${errCount} issue${errCount>1?'s':''}` : 'Analyzed ✓') : 'Ready';
  }
}

// ── REAL-TIME ERROR DETECTION ──
function lintCode(code) {
  if (!code || code.trim().length < 5) { state.errors = []; renderErrors(); return; }
  const errors = [];
  const lines = code.split('\n');

  if (state.lang === 'javascript') {
    try { new Function(code); } catch(e) {
      let lineNum = 1;
      const m = e.message.match(/line (\d+)/i) || e.stack?.match(/Function:(\d+)/);
      if (m) lineNum = Math.max(1, parseInt(m[1]) - 1);
      errors.push({ line: lineNum, type: 'error', message: e.message.replace(/\(.*\)/, '').trim() });
    }
  }

  if (state.lang === 'python') {
    // Bracket matching
    const stack = []; const pairs = {'(':')', '[':']', '{':'}'};
    lines.forEach((ln, i) => {
      for (const ch of ln) {
        if ('([{'.includes(ch)) stack.push({ ch, line: i+1 });
        if (')]}'.includes(ch)) {
          const top = stack.pop();
          if (top && pairs[top.ch] !== ch) errors.push({ line: i+1, type: 'error', message: `Mismatched bracket: expected '${pairs[top.ch]}' but found '${ch}'` });
          if (!top) errors.push({ line: i+1, type: 'error', message: `Unexpected closing '${ch}' — no matching opener` });
        }
      }
    });
    stack.forEach(s => errors.push({ line: s.line, type: 'error', message: `Unclosed '${s.ch}' — missing '${pairs[s.ch]}'` }));

    // Missing colon
    lines.forEach((ln, i) => {
      const trimmed = ln.trimEnd();
      if (/^\s*(def|if|elif|else|for|while|class|try|except|finally|with)\b/.test(trimmed) && !trimmed.endsWith(':') && !trimmed.endsWith(':\\') && !/#/.test(trimmed)) {
        const kw = trimmed.match(/^\s*(\w+)/)[1];
        errors.push({ line: i+1, type: 'error', message: `Missing ':' after '${kw}' statement` });
      }
    });

    // Invalid indentation (tabs mixed with spaces)
    lines.forEach((ln, i) => {
      if (/^\t+ /.test(ln) || /^ +\t/.test(ln)) {
        errors.push({ line: i+1, type: 'warning', message: 'Mixed tabs and spaces in indentation' });
      }
    });

    // print without parentheses (Python 3)
    lines.forEach((ln, i) => {
      if (/\bprint\s+['"]/.test(ln) || /\bprint\s+\w/.test(ln) && !/\bprint\s*\(/.test(ln)) {
        errors.push({ line: i+1, type: 'warning', message: "'print' needs parentheses in Python 3: print(...)" });
      }
    });

    // Using = instead of == in if/while
    lines.forEach((ln, i) => {
      if (/^\s*(if|while|elif)\b.*[^=!<>]=[^=]/.test(ln) && !/==/.test(ln) && !/\w+\s*=.*:/.test(ln)) {
        // Skip assignments that look intentional
        if (/=(?!=)/.test(ln.split(':')[0]) && !/def /.test(ln)) {
          errors.push({ line: i+1, type: 'warning', message: "Possible assignment in condition — did you mean '=='?" });
        }
      }
    });
  }

  if (state.lang === 'cpp') {
    // Missing semicolons (heuristic)
    lines.forEach((ln, i) => {
      const t = ln.trim();
      if (t && !t.startsWith('//') && !t.startsWith('#') && !t.startsWith('/*') &&
          !t.endsWith('{') && !t.endsWith('}') && !t.endsWith(':') && !t.endsWith(',') &&
          !t.endsWith(';') && !t.endsWith('*/') && !t.endsWith('\\') &&
          !(/^(if|else|for|while|class|struct|switch|namespace|template)\b/.test(t)) &&
          t.length > 3 && /\w/.test(t) && !/^\s*\}/.test(t)) {
        errors.push({ line: i+1, type: 'warning', message: 'Possibly missing semicolon' });
      }
    });
    // Bracket matching
    const stack = []; const pairs = {'(':')', '[':']', '{':'}'};
    lines.forEach((ln, i) => {
      for (const ch of ln) {
        if ('([{'.includes(ch)) stack.push({ ch, line: i+1 });
        if (')]}'.includes(ch)) {
          const top = stack.pop();
          if (top && pairs[top.ch] !== ch) errors.push({ line: i+1, type: 'error', message: `Mismatched bracket: '${ch}'` });
        }
      }
    });
    stack.forEach(s => errors.push({ line: s.line, type: 'error', message: `Unclosed '${s.ch}'` }));
  }

  // Common: unmatched quotes
  lines.forEach((ln, i) => {
    const singles = (ln.match(/'/g) || []).length;
    const doubles = (ln.match(/"/g) || []).length;
    const escapedS = (ln.match(/\\'/g) || []).length;
    const escapedD = (ln.match(/\\"/g) || []).length;
    if ((singles - escapedS) % 2 !== 0) errors.push({ line: i+1, type: 'error', message: 'Unmatched single quote' });
    if ((doubles - escapedD) % 2 !== 0) errors.push({ line: i+1, type: 'error', message: 'Unmatched double quote' });
  });

  state.errors = errors;
  renderErrors();
  if (errors.some(e => e.type === 'error')) setStatus('error');
}

function renderErrors() {
  let el = document.getElementById('error-markers');
  if (!el) {
    el = document.createElement('div'); el.id = 'error-markers'; el.className = 'error-markers';
    const consoleArea = document.getElementById('console-area');
    consoleArea.parentNode.insertBefore(el, consoleArea);
  }
  if (state.errors.length === 0) { el.innerHTML = ''; el.classList.add('hidden'); return; }
  el.classList.remove('hidden');
  el.innerHTML = `<div class="error-markers-header">
    <span class="error-icon">⚠</span>
    <span>${state.errors.length} issue${state.errors.length>1?'s':''} found</span>
  </div>` + state.errors.map(e => `<div class="error-item ${e.type}">
    <span class="error-line" onclick="jumpToLine(${e.line})">Line ${e.line}</span>
    <span class="error-msg">${e.message}</span>
  </div>`).join('');
}

function jumpToLine(line) {
  // Scroll editor to line (best effort)
  const code = getEditorValue();
  const lines = code.split('\n');
  let pos = 0;
  for (let i = 0; i < Math.min(line-1, lines.length); i++) pos += lines[i].length + 1;
  // Use CM view to scroll
  if (window._cmView) {
    window._cmView.dispatch({ selection: { anchor: pos }, scrollIntoView: true });
  }
}

// ── CODE ANALYSIS ──
function analyzeCode(code) {
  if (!code) code = getEditorValue();
  if (!code || code.trim().length < 10) { setStatus('idle'); return; }
  setStatus('done');
  const p = PROBLEMS[state.problemId];
  const matched = p.socraticQuestions.filter(sq => new RegExp(sq.trigger, 'i').test(code));

  if (matched.length > 0) {
    const q = matched[Math.floor(Math.random() * matched.length)];
    addMentorMessage(q.question, detectLineForTrigger(code, q.trigger));
  } else if (code.trim().length > 40) {
    addMentorMessage("You're making progress! Think about what your function should return. What does 'correct output' look like for each example?");
  }

  if (state.vizVisible) renderFlowchart(code);
  if (/return\s+\[/.test(code) && code.length > 80 && !state.refactorShown) {
    setTimeout(showRefactorChallenge, 2500);
  }
}

function detectLineForTrigger(code, trigger) {
  const lines = code.split('\n');
  const re = new RegExp(trigger.split('\\|')[0], 'i');
  for (let i = 0; i < lines.length; i++) if (re.test(lines[i])) return i + 1;
  return null;
}

// ── MENTOR CHAT ──
function addMentorMessage(text, lineNum) {
  const chat = document.getElementById('mentor-chat');
  const welcome = chat.querySelector('.mentor-welcome');
  if (welcome) welcome.remove();
  const msg = document.createElement('div');
  msg.className = 'mentor-msg';
  msg.innerHTML = `
    <div class="mentor-msg-header">
      <div class="mentor-msg-icon">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <span class="mentor-msg-label">Socratic Mentor</span>
      ${lineNum ? `<span class="mentor-msg-line">Line ${lineNum}</span>` : ''}
    </div>
    <div class="mentor-msg-text">${text}</div>
    ${lineNum ? `<span class="annotation-chip">↳ Line ${lineNum}</span>` : ''}`;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
  gainXP(5, 'thinking');
}

// ── HINT SYSTEM ──
function requestHint(tier) {
  const p = PROBLEMS[state.problemId];
  const cost = { nudge: 0, clue: 5, answer: 20 }[tier];
  const display = document.getElementById('hint-display');
  display.innerHTML = p.hints[tier].replace(/\n/g, '<br>');
  display.classList.add('visible');
  if (cost > 0) { gainXP(-cost, 'penalty'); showToast(`-${cost} XP for using ${tier}`, 'warn'); }
  else showToast('Nudge unlocked — think carefully!');
  state.hintLevel = tier;
}

// Clue is gated behind Rubber Duck explanation
function requestHintClue() {
  if (state.duckClueUnlocked) {
    requestHint('clue');
  } else {
    // Prompt to use Duck mode
    const display = document.getElementById('hint-display');
    display.innerHTML = `<div class="hint-locked-msg">
      🔒 <strong>Clue locked!</strong><br><br>
      To unlock the Clue hint, first use <strong>🦆 Rubber Duck Mode</strong> to explain your approach out loud.
      The AI will analyze your reasoning and unlock this hint if you demonstrate correct thinking.<br><br>
      <button onclick="openDuckModal()" style="margin-top:8px;padding:6px 14px;background:#6366f1;border:none;border-radius:6px;color:#fff;cursor:pointer;font-size:12px;">
        🎙 Open Duck Mode
      </button>
    </div>`;
    display.classList.add('visible');
    showToast('🔒 Speak in Duck Mode to unlock the Clue!', 'warn');
  }
}

// Called when duck unlocks the clue — update lock icon
function onDuckClueUnlocked() {
  const lockIcon = document.getElementById('duck-lock-icon');
  if (lockIcon) { lockIcon.textContent = '🔓'; lockIcon.title = 'Unlocked by Rubber Duck!'; }
  const clueBtn = document.getElementById('btn-hint-clue');
  if (clueBtn) clueBtn.classList.add('duck-unlocked');
}

// ── RUN CODE ──
function runCode() {
  const code = getEditorValue();
  const out = document.getElementById('console-output');
  out.innerHTML = '';
  const addLine = (text, cls) => {
    const d = document.createElement('div');
    d.className = cls || ''; d.textContent = text; out.appendChild(d);
  };
  addLine('▶  Running...', 'console-info');

  setTimeout(() => {
    const p = PROBLEMS[state.problemId];

    if (state.lang === 'javascript') {
      runJavaScriptTests(code, p, addLine);
    } else if (state.lang === 'python') {
      runPythonSimulation(code, p, addLine);
    } else {
      addLine('⚠  C++ execution not available in browser. Copy your code to a local compiler to test.', 'console-warn');
    }
    gainXP(10, 'run');
  }, 400);
}

function runJavaScriptTests(code, problem, addLine) {
  // Step 1: Try to compile the code
  try { new Function(code); } catch(e) {
    addLine('✗  Syntax Error: ' + e.message, 'console-error');
    return;
  }

  // Step 2: If problem has testCases, run them
  if (problem.testCases && problem.testCases.length > 0) {
    let passed = 0, total = problem.testCases.length;
    problem.testCases.forEach((tc, i) => {
      try {
        // Build a wrapper that defines the user's code + calls the test
        const wrapper = code + '\n' + tc.call;
        const fn = new Function(wrapper);
        const result = fn();
        const expected = tc.expected;
        const ok = deepEqual(result, expected);
        if (ok) {
          passed++;
          addLine(`  ✓ Test ${i+1}: ${tc.label || tc.call.trim()} → ${JSON.stringify(result)}`, 'console-success');
        } else {
          addLine(`  ✗ Test ${i+1}: ${tc.label || tc.call.trim()}`, 'console-error');
          addLine(`    Expected: ${JSON.stringify(expected)}`, 'console-error');
          addLine(`    Got:      ${JSON.stringify(result)}`, 'console-error');
        }
      } catch(e) {
        addLine(`  ✗ Test ${i+1}: Runtime Error → ${e.message}`, 'console-error');
      }
    });

    // Track session stats
    state.session.testsRun += total;
    state.session.testsPassed += passed;

    addLine('', '');
    if (passed === total) {
      addLine(`🎉  All ${total} tests passed!`, 'console-success');
      if (state.refactorLevel === 2 && !state.session.level2Solved) {
        // Level 2 Time-Travel solved!
        onLevel2Solved();
      } else if (!state.solved) {
        state.solved = true;
        state.session.problemsSolved++;
        setTimeout(showRefactorChallenge, 1500);
      }
    } else {
      addLine(`⚠  ${passed}/${total} tests passed. Keep trying!`, 'console-warn');
    }
  } else {
    // Fallback: just run the code and capture console.log output
    try {
      const logs = [];
      const wrapper = `
        const __logs = [];
        const __origLog = console.log;
        console.log = (...args) => __logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        ${code}
        console.log = __origLog;
        return __logs;
      `;
      const fn = new Function(wrapper);
      const logs_result = fn();
      if (logs_result.length > 0) {
        logs_result.forEach(l => addLine('  ' + l, 'console-info'));
        addLine('', '');
        addLine('⚠  No test cases for this problem. Output shown above — verify manually.', 'console-warn');
      } else {
        addLine('⚠  No output produced. Make sure your function returns or prints a value.', 'console-warn');
      }
    } catch(e) {
      addLine('✗  Runtime Error: ' + e.message, 'console-error');
    }
  }
}

function runPythonSimulation(code, problem, addLine) {
  // Check for obvious unimplemented code
  const lines = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
  const hasPass = lines.some(l => l.trim() === 'pass');
  const tooShort = lines.length < 4;

  if (hasPass || tooShort) {
    addLine('⚠  Function not implemented yet — replace "pass" with your solution.', 'console-warn');
    return;
  }

  // Check for common Python errors using our linter
  lintCode(code);
  if (state.errors.some(e => e.type === 'error')) {
    addLine('✗  Errors detected in your code:', 'console-error');
    state.errors.filter(e => e.type === 'error').forEach(e => {
      addLine(`   Line ${e.line}: ${e.message}`, 'console-error');
    });
    return;
  }

  // Python can't run in browser — give honest feedback
  addLine('📝  Python code analysis:', 'console-info');

  // Check structure
  const hasDef = /def\s+\w+/.test(code);
  const hasReturn = /return\s/.test(code);
  const hasLoop = /for\s|while\s/.test(code);
  const hasCondition = /if\s/.test(code);
  const hasPrint = /print\s*\(/.test(code);

  if (hasDef) addLine('  ✓ Function defined', 'console-success');
  else addLine('  ✗ No function definition found', 'console-error');

  if (hasReturn) addLine('  ✓ Returns a value', 'console-success');
  else addLine('  ⚠ No return statement — function returns None', 'console-warn');

  if (hasLoop) addLine('  ✓ Uses iteration', 'console-info');
  if (hasCondition) addLine('  ✓ Has conditional logic', 'console-info');

  addLine('', '');
  addLine('⚠  Python cannot run in the browser. Copy your code to a local Python interpreter or use an online judge to verify results.', 'console-warn');

  if (hasDef && hasReturn && !hasPass) {
    addLine('💡  Your code structure looks reasonable. Test it locally!', 'console-info');
  }
}

// Deep comparison for test results
function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    // Try sorted comparison for unordered results
    const sortedA = [...a].sort((x,y) => JSON.stringify(x) < JSON.stringify(y) ? -1 : 1);
    const sortedB = [...b].sort((x,y) => JSON.stringify(x) < JSON.stringify(y) ? -1 : 1);
    return JSON.stringify(sortedA) === JSON.stringify(sortedB) || JSON.stringify(a) === JSON.stringify(b);
  }
  if (typeof a === 'object') return JSON.stringify(a) === JSON.stringify(b);
  return false;
}

function clearConsole() {
  document.getElementById('console-output').innerHTML = '<span class="console-placeholder">Run your code to see output...</span>';
}

// ── FLOWCHART ──
function toggleViz() {
  state.vizVisible = !state.vizVisible;
  document.getElementById('viz-panel').classList.toggle('hidden', !state.vizVisible);
  if (state.vizVisible) renderFlowchart(getEditorValue());
}

async function renderFlowchart(code) {
  const el = document.getElementById('mermaid-output');
  let chart = FLOWCHARTS.default;
  if (/def fib|function fib|int fib/i.test(code)) chart = FLOWCHARTS.python_recursive;
  else if (/for|while/i.test(code)) chart = FLOWCHARTS.python_loop;
  try {
    el.innerHTML = '';
    const { svg } = await mermaid.render('mermaid-' + Date.now(), chart);
    el.innerHTML = svg;
  } catch(e) { el.innerHTML = '<p class="viz-placeholder">Generating flowchart...</p>'; }
}

// ── TIME-TRAVEL REFACTOR ──
const REFACTOR_LEVELS = {
  twoSum:              { from: 'O(n²)', to: 'O(n)',       tip: 'Use a hash map to find the complement in one pass.' },
  fibonacci:           { from: 'O(2ⁿ)',  to: 'O(n)',       tip: 'Use memoization or iterative DP with two variables.' },
  kadanes:             { from: 'O(n²)',  to: 'O(n)',       tip: 'Kadane\'s algorithm — one pass, two variables.' },
  binarySearch:        { from: 'O(n)',   to: 'O(log n)',   tip: 'Split the search space in half each step.' },
  mergeSort:           { from: 'O(n²)',  to: 'O(n log n)', tip: 'Divide and conquer — split, sort, merge.' },
  coinChange:          { from: 'O(2ⁿ)',  to: 'O(n·k)',     tip: 'Bottom-up DP table: dp[0]=0, fill up to amount.' },
  longestSubstring:    { from: 'O(n²)',  to: 'O(n)',       tip: 'Sliding window with a set — shrink from left on repeat.' },
  longestIncreasingSubsequence: { from: 'O(n²)', to: 'O(n log n)', tip: 'Binary search on a patience-sort tails array.' },
  houseRobber:         { from: 'O(n)',   to: 'O(1)',       tip: 'Only need prev2 and prev1 — drop the full DP array.' },
  uniquePaths:         { from: 'O(m·n)', to: 'O(n)',       tip: 'Use a single row array, update in place.' },
};

function getRefactorLevel() {
  return REFACTOR_LEVELS[state.problemId] || { from: 'brute-force', to: 'optimized', tip: PROBLEMS[state.problemId]?.refactor || '' };
}

function showRefactorChallenge() {
  if (state.refactorShown) return;
  state.refactorShown = true;
  const p = PROBLEMS[state.problemId];
  const rl = getRefactorLevel();
  const panel = document.getElementById('refactor-panel');
  const textEl = document.getElementById('refactor-text');
  const titleEl = document.getElementById('refactor-title');
  const badgeEl = document.getElementById('refactor-badge');

  if (titleEl) titleEl.textContent = '⏳ Time-Travel Challenge — Level 2';
  if (badgeEl) badgeEl.innerHTML =
    `<span class="complexity-from">${rl.from}</span><span class="complexity-arrow">→</span><span class="complexity-to">${rl.to}</span>`;
  textEl.textContent = rl.tip || p.refactor;
  panel.classList.remove('hidden');
  gainXP(25, 'solved');
  addMentorMessage(`🎉 Level 1 solved! Now the Time-Travel challenge: can you go from ${rl.from} → ${rl.to}? Think about what makes your current solution slow.`);
}

function acceptRefactor() {
  document.getElementById('refactor-panel').classList.add('hidden');
  state.refactorShown = false; state.solved = false;
  state.refactorLevel = 2;
  state.session.refactorAccepted++;
  gainXP(15, 'refactor');
  showToast('⏳ Time-Travel activated! Solve it at the faster complexity.');
  addMentorMessage('Level 2 active! Rewrite your solution to hit the better complexity. Run tests again to verify it still passes.');
}

function onLevel2Solved() {
  state.session.level2Solved = true;
  gainXP(50, 'solved');
  showToast('🚀 +50 XP — Time-Travel Complete! Complexity upgraded!');
  addMentorMessage('Incredible — you beat Level 2! Your solution is now significantly faster. Open the Skill Tree to see your progress.');
  setTimeout(openSkillDashboard, 1500);
}

// ── RUBBER DUCK ──
function openDuckModal() {
  document.getElementById('duck-modal').classList.remove('hidden');
  updateDuckGateUI();
}
function closeDuckModal() {
  document.getElementById('duck-modal').classList.add('hidden');
  if (state.recording) stopRecording();
}
function toggleRecording() { state.recording ? stopRecording() : startRecording(); }

function updateDuckGateUI() {
  const gateEl = document.getElementById('duck-gate-status');
  if (!gateEl) return;
  if (state.duckClueUnlocked) {
    gateEl.innerHTML = `<span class="gate-unlocked">🔓 Clue Hint Unlocked! Go use it from the hint panel.</span>`;
  } else {
    gateEl.innerHTML = `<span class="gate-locked">🔒 Explain your approach out loud to unlock the <strong>Clue</strong> hint.</span>`;
  }
}

function startRecording() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    document.getElementById('transcript-box').innerHTML = '<p style="color:#ef4444">Speech recognition not supported. Try Chrome!</p>';
    return;
  }
  state.recognition = new SR();
  state.recognition.continuous = true; state.recognition.interimResults = true; state.recognition.lang = 'en-US';
  let fullTranscript = '';
  state.recognition.onresult = e => {
    fullTranscript = '';
    for (let i = 0; i < e.results.length; i++) fullTranscript += e.results[i][0].transcript + ' ';
    document.getElementById('transcript-box').innerHTML = `<p>${fullTranscript.trim()}</p>`;
    state._duckTranscript = fullTranscript;
  };
  state.recognition.onend = analyzeDuckTranscript;
  state.recognition.start(); state.recording = true;
  document.getElementById('btn-mic').textContent = '⏹ Stop Speaking';
  document.getElementById('mic-visual').classList.add('recording');
}

function stopRecording() {
  if (state.recognition) state.recognition.stop();
  state.recording = false;
  document.getElementById('btn-mic').textContent = '🎙 Start Speaking';
  document.getElementById('mic-visual').classList.remove('recording');
}

function analyzeDuckTranscript() {
  const raw = (state._duckTranscript || document.getElementById('transcript-box').textContent || '').toLowerCase();
  const p = PROBLEMS[state.problemId];
  const tags = (p.tags || []).map(t => t.toLowerCase());

  // Score the transcript against problem keywords
  const KEYWORDS = {
    high: ['hash','hashmap','dictionary','two pointer','binary search','dynamic programming','dp','recursion',
           'memoization','stack','queue','graph','tree','greedy','divide and conquer','sliding window',
           'complement','index','sorted','complexity','time complexity','space complexity'],
    medium: ['loop','iterate','check','compare','store','track','count','length','swap','pointer',
             'left','right','mid','parent','child','node','edge','visited','current','previous'],
    low: ['function','return','array','string','number','if','else','while','for']
  };

  let score = 0;
  let matched = [];
  KEYWORDS.high.forEach(k => { if (raw.includes(k)) { score += 3; matched.push(k); } });
  KEYWORDS.medium.forEach(k => { if (raw.includes(k)) { score += 1; matched.push(k); } });

  // Tag bonus — did they mention the relevant topic?
  tags.forEach(tag => { if (raw.includes(tag)) score += 2; });

  // Length bonus
  const words = raw.split(/\s+/).filter(Boolean).length;
  if (words > 30) score += 2;
  if (words > 60) score += 3;

  let feedback, xp, unlocked = false;

  if (score >= 6) {
    unlocked = true;
    state.duckClueUnlocked = true;
    state.session.duckUsed++;
    state.session.clueUnlockedByDuck = true;
    feedback = `🔓 <strong>Clue Unlocked!</strong> Great reasoning — you mentioned: <em>${[...new Set(matched)].slice(0,4).join(', ')}</em>. Your thinking shows real algorithmic insight. The Clue hint is now available in the hint panel!`;
    xp = 25;
    gainXP(xp, 'duck');
    // Auto-enable the clue button
    const clueBtn = document.getElementById('btn-hint-clue');
    if (clueBtn) { clueBtn.classList.add('duck-unlocked'); clueBtn.title = 'Unlocked by Rubber Duck!'; }
    showToast('🦆 +25 XP — Clue unlocked by Duck mode!');
  } else if (score >= 3) {
    feedback = `Good start! You mentioned some useful concepts. Try explaining <em>why</em> you'd use that approach and what the time complexity would be. Keep going — you're ${6 - score} points from unlocking the Clue!`;
    xp = 10;
    gainXP(xp, 'duck');
  } else if (words > 5) {
    feedback = `I heard you, but try to be more specific. Mention the data structure you'd use (e.g. hash map, stack, array), the algorithm pattern (e.g. two pointers, sliding window), or the complexity you're targeting.`;
    xp = 5;
    gainXP(xp, 'duck');
  } else {
    feedback = `Please speak more — explain your approach step by step. The more algorithmic detail you provide, the better I can evaluate your reasoning!`;
    xp = 0;
  }

  const box = document.getElementById('transcript-box');
  const existing = box.querySelector('p:first-child');
  const feedbackEl = document.createElement('div');
  feedbackEl.className = 'duck-feedback' + (unlocked ? ' unlocked' : '');
  feedbackEl.innerHTML = `<span class="duck-score">Score: ${score}/10+</span><p>${feedback}</p>`;
  box.appendChild(feedbackEl);
  updateDuckGateUI();
}

// ── SKILL TREE DASHBOARD ──
function getMasteryLabel(pct) {
  if (pct >= 90) return { label: 'Master', color: '#f59e0b', stars: '★★★★★' };
  if (pct >= 70) return { label: 'Expert', color: '#6366f1', stars: '★★★★☆' };
  if (pct >= 50) return { label: 'Adept', color: '#22c55e', stars: '★★★☆☆' };
  if (pct >= 25) return { label: 'Learner', color: '#06b6d4', stars: '★★☆☆☆' };
  return { label: 'Novice', color: '#64748b', stars: '★☆☆☆☆' };
}

function renderSkillTree() {
  document.getElementById('skill-grid').innerHTML = state.skills.map(s => {
    const pct = Math.min(100, Math.round((s.xp / s.maxXp) * 100));
    const lvl = Math.floor(s.xp / 50) + 1;
    const mastery = getMasteryLabel(pct);
    const segments = [20,40,60,80,100].map(t =>
      `<div class="skill-seg${pct >= t ? ' filled' : ''}" style="${pct >= t ? 'background:' + s.color : ''}"></div>`
    ).join('');
    return `<div class="skill-card" style="--skill-color:${s.color}">
      <div class="skill-card-top">
        <div class="skill-icon">${s.icon}</div>
        <div class="skill-mastery" style="color:${mastery.color}">${mastery.label}</div>
      </div>
      <div class="skill-name">${s.name}</div>
      <div class="skill-stars">${mastery.stars}</div>
      <div class="skill-level">Level ${lvl} · ${s.xp}/${s.maxXp} XP</div>
      <div class="skill-segs">${segments}</div>
    </div>`;
  }).join('');
}

function renderAchievements() {
  document.getElementById('achievements-list').innerHTML = ACHIEVEMENTS.map(a =>
    `<div class="achievement-badge"><span>${a.icon}</span><span>${a.label}</span></div>`
  ).join('');
}

function openSkillModal() {
  renderSkillTree();
  renderAchievements();
  document.getElementById('skill-modal').classList.remove('hidden');
}
function openSkillDashboard() { openSkillModal(); renderSessionSummary(); }
function closeSkillModal() { document.getElementById('skill-modal').classList.add('hidden'); }

function renderSessionSummary() {
  const el = document.getElementById('session-summary');
  if (!el) return;
  const mins = Math.round((Date.now() - state.session.startTime) / 60000);
  const s = state.session;
  const passRate = s.testsRun > 0 ? Math.round((s.testsPassed / s.testsRun) * 100) : 0;
  el.innerHTML = `
    <div class="session-header">📊 Session Summary</div>
    <div class="session-stats">
      <div class="stat-chip"><span class="stat-num">${mins}</span><span class="stat-label">min</span></div>
      <div class="stat-chip"><span class="stat-num">${s.problemsSolved}</span><span class="stat-label">solved</span></div>
      <div class="stat-chip"><span class="stat-num">${state.xp}</span><span class="stat-label">XP</span></div>
      <div class="stat-chip"><span class="stat-num">${passRate}%</span><span class="stat-label">pass rate</span></div>
    </div>
    <div class="session-badges">
      ${s.clueUnlockedByDuck ? '<span class="sess-badge duck">🦆 Duck Master</span>' : ''}
      ${s.refactorAccepted > 0 ? '<span class="sess-badge refactor">⏳ Time Traveler</span>' : ''}
      ${s.level2Solved ? '<span class="sess-badge level2">🚀 Complexity Crusher</span>' : ''}
      ${s.hintsUsed === 0 && s.problemsSolved > 0 ? '<span class="sess-badge nohints">🧠 No-Hint Hero</span>' : ''}
    </div>
  `;
}

// ── XP ──
function gainXP(amount, reason) {
  state.xp = Math.max(0, state.xp + amount); updateXP(amount);
  const skillMap = {
    thinking: 'problemSolving', run: 'debugging',
    solved: 'algorithms', refactor: 'optimization',
    duck: 'problemSolving', penalty: 'codeQuality'
  };
  const skillId = skillMap[reason];
  if (skillId && amount > 0) {
    const s = state.skills.find(s => s.id === skillId);
    if (s) s.xp = Math.min(s.maxXp, s.xp + Math.abs(amount));
  }
  // Track hint usage for session
  if (reason === 'penalty') state.session.hintsUsed++;
}
function updateXP(delta) {
  document.getElementById('xp-display').textContent = state.xp + ' XP';
  if (delta > 0) {
    const pill = document.querySelector('.xp-pill');
    pill.style.transform = 'scale(1.12)';
    setTimeout(() => pill.style.transform = '', 250);
  }
}

// ── TOAST ──
function showToast(text, type) {
  const t = document.getElementById('toast');
  document.getElementById('toast-text').textContent = text;
  t.className = 'toast' + (type === 'warn' ? ' warn' : '');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.add('hidden'), 3000);
}

// ── PROBLEM SWITCHER (Dynamic Dropdown) ──
function buildProblemDropdown() {
  const dropdown = document.getElementById('prob-dropdown');
  const categories = {};
  Object.values(PROBLEMS).forEach(p => {
    const cat = p.tags[0] || 'Other';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(p);
  });
  let html = '';
  for (const [cat, probs] of Object.entries(categories)) {
    html += `<div class="dropdown-category">${cat}</div>`;
    probs.forEach(p => {
      const diffClass = 'diff-' + p.difficulty.toLowerCase();
      html += `<button class="dropdown-item${p.id === state.problemId ? ' active' : ''}" data-id="${p.id}" onclick="selectProblem('${p.id}')">
        <span class="dropdown-item-title">${p.title}</span>
        <span class="dropdown-diff ${diffClass}">${p.difficulty}</span>
      </button>`;
    });
  }
  dropdown.innerHTML = html;
}

function toggleProblemDropdown() {
  const dd = document.getElementById('prob-dropdown');
  dd.classList.toggle('hidden');
  if (!dd.classList.contains('hidden')) {
    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', closeProblemDropdown, { once: true });
    }, 0);
  }
}

function closeProblemDropdown(e) {
  const dd = document.getElementById('prob-dropdown');
  const btn = document.getElementById('prob-dropdown-btn');
  if (!dd.contains(e?.target) && !btn.contains(e?.target)) {
    dd.classList.add('hidden');
  }
}

function selectProblem(id) {
  document.getElementById('prob-dropdown').classList.add('hidden');
  document.getElementById('prob-dropdown-label').textContent = PROBLEMS[id].title;
  // Update active state
  document.querySelectorAll('.dropdown-item').forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.dropdown-item[data-id="${id}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  loadProblem(id);
  state.solved = false; state.refactorShown = false; state.hintLevel = null;
  document.getElementById('hint-display').classList.remove('visible');
  document.getElementById('refactor-panel').classList.add('hidden');
  document.getElementById('mentor-chat').innerHTML = `
    <div class="mentor-welcome">
      <div class="mentor-avatar">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <p class="welcome-text">New problem! Start coding and I'll guide you. 🧠</p>
    </div>`;
  if (typeof window.setCMValue === 'function') window.setCMValue(PROBLEMS[id].starterCode[state.lang]);
}

// Keep backward compat for any remaining references
function switchProblem(id, btn) { selectProblem(id); }

