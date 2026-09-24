/*
 * My Tool: the example logic. Replace the middle section with your own tool;
 * keep the STOIT parts (the banner, `ctx`, and `Stoit.complete`).
 */
(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const KEY = 'my-tool-v1';

  // ---- storage: everything stays in this browser
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || { history: [] }; } catch (_) { return { history: [] }; } };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) { /* private mode */ } };
  const state = load();

  // ---- the manifest fills in the name, icon and tagline, so they're written once
  fetch('stoit.json').then((r) => r.json()).then((m) => {
    $('#name').textContent = m.name;
    $('#logo').textContent = m.icon;
    $('#tagline').textContent = m.tagline;
    if (!ctx) document.title = m.name;
  }).catch(() => {});

  // ---- STOIT: what task opened us (null when used on its own)
  const ctx = window.Stoit ? Stoit.context() : null;
  const started = Date.now();
  if (ctx) {
    $('#stoit-bar').hidden = false;
    $('#stoit-from').textContent = ctx.from;
    $('#stoit-task').textContent = ctx.task.title;
    const when = [ctx.event && ctx.event.title ? `before ${ctx.event.title}${ctx.event.start ? ' · ' + time(ctx.event.start) : ''}` : '', ctx.task.start ? time(ctx.task.start) : ''].filter(Boolean).join(' · ');
    $('#stoit-when').textContent = when;
    if (ctx.task.minutes) { $('#stoit-clock').hidden = false; tick(); setInterval(tick, 1000); }
    document.title = `${ctx.task.title} · ${document.title}`;
    $('#done').textContent = '✓ Done: send to STOIT';
  }
  function tick() {
    const left = ctx.task.minutes * 60 - Math.floor((Date.now() - started) / 1000);
    const a = Math.abs(left);
    $('#stoit-clock').textContent = `${left < 0 ? '+' : ''}${Math.floor(a / 60)}:${String(a % 60).padStart(2, '0')}`;
    $('#stoit-clock').classList.toggle('over', left < 0);
  }
  function time(iso) {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  // ─── Example tool: a task, its steps and a result ─────────────────────────
  const steps = (ctx ? ctx.task.steps : []).map((text) => ({ text, done: false }));
  $('#task').value = ctx ? ctx.task.title : '';
  function renderSteps() {
    $('#steps').innerHTML = '';
    steps.forEach((s, i) => {
      const li = document.createElement('li');
      const label = document.createElement('label');
      const cb = document.createElement('input');
      cb.type = 'checkbox'; cb.checked = s.done;
      cb.addEventListener('change', () => { s.done = cb.checked; });
      const span = document.createElement('span');
      span.textContent = s.text;
      label.append(cb, span);
      li.append(label);
      $('#steps').append(li);
      if (i === steps.length - 1) li.classList.add('new');
    });
  }
  $('#add-step').addEventListener('submit', (e) => {
    e.preventDefault();
    const t = $('#step').value.trim();
    if (!t) return;
    steps.push({ text: t, done: false });
    $('#step').value = '';
    renderSteps();
  });
  renderSteps();
  // ─────────────────────────────────────────────────────────────────────────

  $('#done').addEventListener('click', () => {
    const task = $('#task').value.trim() || 'Untitled';
    const summary = $('#result').value.trim() || `${steps.filter((s) => s.done).length}/${steps.length} steps done`;
    state.history.unshift({ task, summary, at: Date.now() });
    state.history.length = Math.min(state.history.length, 20);
    save();
    renderHistory();
    // Tell STOIT (if it opened us). On its own, this just saves locally.
    const how = window.Stoit ? Stoit.complete({ summary, data: { steps }, minutes: Math.round((Date.now() - started) / 60000) }) : 'none';
    toast(how === 'message' ? '✓ Sent to STOIT. You can close this tab.' : how === 'redirect' ? '✓ Taking you back to STOIT…' : '✓ Saved');
    if (how === 'message') setTimeout(() => { try { window.close(); } catch (_) { /* not ours to close */ } }, 900);
  });

  function renderHistory() {
    $('#history-card').hidden = !state.history.length;
    $('#history').innerHTML = '';
    for (const h of state.history) {
      const li = document.createElement('li');
      const b = document.createElement('b');
      b.textContent = h.task;
      const s = document.createElement('span');
      s.textContent = ` · ${h.summary}`;
      const t = document.createElement('small');
      t.textContent = new Date(h.at).toLocaleString();
      li.append(b, s, t);
      $('#history').append(li);
    }
  }
  renderHistory();

  let toastTimer = 0;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 2800);
  }
})();
