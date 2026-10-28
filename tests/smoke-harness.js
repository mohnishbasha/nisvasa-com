// Injected into a temporary copy of index.html by tests/smoke.sh.
// Drives the real UI and writes one PASS/FAIL line per check into a pre element with id SMOKE.
(async () => {
  // Device-size checks load this same page in iframes; only the top window runs the suite
  if (window !== window.top) return;
  const lines = [];
  const ok = (name, condition, detail = '') => lines.push(`${condition ? 'PASS' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const $ = (selector) => document.querySelector(selector);
  const isShown = (node) => node && !node.classList.contains('is-hidden') && !node.hidden;

  try {
    ok('no errors while loading', window.__smokeErrors.length === 0, window.__smokeErrors.join('; '));
    ok('8 exercise cards render', document.querySelectorAll('.card').length === 8);
    ok('no external scripts at load', document.querySelectorAll('script[src]').length === 0);
    ok('ad slot hidden by default', $('#ad-slot').hidden);
    ok('copyright year set', $('#copyright-year').textContent === String(new Date().getFullYear()));

    for (const exercise of EXERCISES) {
      $(`[data-exercise="${exercise.id}"]`).click();
      ok(`${exercise.id}: detail opens`, $('#view-detail').classList.contains('active') && location.hash === `#${exercise.id}`);
      $('#start-practice').click();
      if (!$('#safety-modal').hidden) $('#safety-confirm').click();
      await wait(1100);
      const running = $('#view-practice').classList.contains('active') && state.intervalId !== null;
      ok(`${exercise.id}: practice runs`, running && $('#phase-label').textContent.length > 0, $('#meta-time').textContent);
      $('#stop-btn').click();
      $('#back-to-list').click();
    }

    $('[data-exercise="box"]').click();
    ok('detail sets the page title', document.title.startsWith('Box Breathing'));
    $('#start-practice').click();
    await wait(300);
    $('#pause-btn').click();
    ok('pause shows the play icon', isShown($('#icon-play')) && !isShown($('#icon-pause')));
    ok('pause stops the timer', state.isPaused && state.intervalId === null);
    $('#pause-btn').click();
    ok('resume shows the pause icon', isShown($('#icon-pause')) && !isShown($('#icon-play')));
    $('#sound-btn').click();
    ok('mute shows the muted icon', isShown($('#icon-muted')) && state.isMuted);
    ok('mute suspends audio', !state.audioCtx || state.audioCtx.state !== 'running');
    $('#sound-btn').click();
    ok('unmute restores the sound icon', isShown($('#icon-sound')) && !state.isMuted);

    $('#view-practice [data-mood-toggle]').click();
    ok('mood panel opens from practice', !$('#mood-panel').hidden && document.querySelectorAll('.mood-option').length === MOODS.length);
    $('.mood-option[data-mood="midnight"]').click();
    ok('mood applies to <html>', document.documentElement.dataset.mood === 'midnight');
    ok('mood sets the browser theme colour', $('meta[name="theme-color"]').content.toUpperCase() === '#0B1024');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    ok('Escape closes the mood panel', $('#mood-panel').hidden);
    $('#stop-btn').click();

    $('[data-minutes="custom"]').click();
    $('#custom-minutes').value = '1';
    $('#start-practice').click();
    ok('custom length applies', state.duration === 60);
    state.sessionStartTime -= 61000;
    state.phaseStartTime -= 16000 * 4;
    await wait(400);
    ok('session completes', !$('#completion').hidden, $('#completion-stats').textContent);
    ok('completion message matches', $('#completion-message').textContent === state.exercise.completion);
    $('#to-library').click();
    ok('back to library clears the hash', $('#view-list').classList.contains('active') && location.hash === '');

    await checkSound(ok);
    checkCircle(ok);
    checkSeo(ok);
    await checkDevices(ok, wait);

    $('[data-legal="legal-terms"]').click();
    ok('terms dialog opens', !$('#legal-terms').hidden);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    ok('terms dialog closes', $('#legal-terms').hidden);
    ok('privacy shows the no-ads variant', !$('[data-ads="off"]').hidden && $('[data-ads="on"]').hidden);
  } catch (error) {
    lines.push(`FAIL harness exception — ${error.message}`);
  }
  ok('no errors during the run', window.__smokeErrors.length === 0, window.__smokeErrors.join('; '));

  const out = document.createElement('pre');
  out.id = 'SMOKE';
  out.textContent = lines.join('\n');
  document.body.append(out);
})();

// Every phase's sound must start at 0 and end exactly when the phase ends
async function checkSound(ok) {
  const tolerance = 0.001;
  const problems = [];
  for (const exercise of EXERCISES) {
    for (const phase of buildCycle(exercise, 0)) {
      const tones = soundPlan(phase, phase.duration).filter((item) => item.type === 'tone');
      const end = Math.max(...tones.map((item) => item.start + item.duration));
      const start = Math.min(...tones.map((item) => item.start));
      const shaped = tones.every((item) => item.attack + item.release <= item.duration + tolerance);
      if (!tones.length || Math.abs(end - phase.duration) > tolerance || start !== 0 || !shaped) {
        problems.push(`${exercise.id}/${phase.label} ${phase.duration}s → ${tones.length ? `${start}–${end}s` : 'silent'}`);
      }
    }
  }
  ok('every phase sound spans exactly its seconds', problems.length === 0, [...new Set(problems)].slice(0, 4).join('; '));
}

// The circle breathes between the same proportions everywhere (160:280)
function checkCircle(ok) {
  const stage = document.getElementById('stage').style;
  updateCircle(PHASE_VISUALS.rest, 0);
  const rest = Number(stage.getPropertyValue('--circle-size'));
  updateCircle(PHASE_VISUALS.inhale, 0);
  const full = Number(stage.getPropertyValue('--circle-size'));
  ok('circle breathes from 57% to 100% of its space', Math.abs(rest - CIRCLE_MIN_SIZE / CIRCLE_MAX_SIZE) < 0.001 && full === 1);
}

function checkSeo(ok) {
  const blocks = [...document.querySelectorAll('script[type="application/ld+json"]')];
  let types = [];
  try {
    types = JSON.parse(blocks[0].textContent)['@graph'].map((node) => node['@type']);
  } catch (error) {
    types = [];
  }
  ok('JSON-LD graph parses', ['WebApplication', 'FAQPage', 'ItemList'].every((t) => types.includes(t)), types.join(','));
  ok('FAQ is visible content', document.querySelectorAll('#faq .faq-item').length >= 5);
  ok('icons and social image linked', ['link[rel="apple-touch-icon"]', 'link[href="favicon.svg"]', 'meta[property="og:image"]'].every((q) => document.querySelector(q)));
}

// No sideways scroll, and the practice controls fit on screen, at common device sizes
async function checkDevices(ok, wait) {
  const sizes = [[320, 568], [375, 667], [414, 896], [768, 1024], [667, 375]];
  for (const [width, height] of sizes) {
    const frame = document.createElement('iframe');
    frame.width = String(width);
    frame.height = String(height);
    frame.src = `${location.pathname}?frame=${width}x${height}`;
    document.body.append(frame);
    await new Promise((resolve) => { frame.onload = resolve; });
    const win = frame.contentWindow;
    const d = win.document.documentElement;
    const homeFits = d.scrollWidth <= d.clientWidth;
    win.openDetail('physiological-sigh');
    win.startPractice();
    await wait(400);
    const bottom = Math.max(...['stop-btn', 'sound-btn', 'volume'].map((id) => win.document.getElementById(id).getBoundingClientRect().bottom));
    ok(`${width}×${height}: no sideways scroll, controls in view`, homeFits && d.scrollWidth <= d.clientWidth && bottom <= height, `controls end at ${Math.round(bottom)}px`);
    win.stopTimer();
    frame.remove();
  }
}
