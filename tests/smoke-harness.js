// Injected into a temporary copy of index.html by tests/smoke.sh.
// Drives the real UI and writes one PASS/FAIL line per check into a pre element with id SMOKE.
(async () => {
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
