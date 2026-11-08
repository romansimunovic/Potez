(() => {
  'use strict';
  const PREFERENCE_KEY = 'potez-ui-prefs-v1';
  let soundEnabled = true;
  let audioContext = null;
  let celebrationTimer = null;

  try {
    const saved = JSON.parse(window.localStorage.getItem(PREFERENCE_KEY) || '{}');
    if (typeof saved.sound === 'boolean') soundEnabled = saved.sound;
  } catch {}

  function syncToggle() {
    const button = document.getElementById('soundToggle');
    if (!button) return;
    button.setAttribute('aria-pressed', String(soundEnabled));
    button.textContent = soundEnabled ? '♪ Zvuk: uključen' : '♪ Zvuk: isključen';
    button.title = soundEnabled ? 'Isključi kratki zvuk nagrade' : 'Uključi kratki zvuk nagrade';
  }

  function savePreference() {
    try {
      window.localStorage.setItem(PREFERENCE_KEY, JSON.stringify({ sound: soundEnabled }));
    } catch {}
    syncToggle();
  }

  function playTick() {
    if (!soundEnabled) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    try {
      if (!audioContext || audioContext.state === 'closed') audioContext = new AudioContextClass();
      const context = audioContext;
      if (context.state === 'suspended') context.resume().catch(() => {});
      const start = context.currentTime;
      const notes = [
        { frequency: 740, delay: 0, length: 0.12, volume: 0.045 },
        { frequency: 988, delay: 0.075, length: 0.16, volume: 0.035 }
      ];
      notes.forEach((note) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const noteStart = start + note.delay;
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(note.frequency, noteStart);
        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.exponentialRampToValueAtTime(note.volume, noteStart + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + note.length);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(noteStart);
        oscillator.stop(noteStart + note.length + 0.015);
      });
    } catch {
      // Sound is optional. The app remains fully usable without Web Audio.
    }
  }

  function success() {
    playTick();
    document.body.classList.remove('reward-celebration');
    window.requestAnimationFrame(() => {
      document.body.classList.add('reward-celebration');
      window.clearTimeout(celebrationTimer);
      celebrationTimer = window.setTimeout(() => {
        document.body.classList.remove('reward-celebration');
      }, 720);
    });
  }

  const toggle = document.getElementById('soundToggle');
  if (toggle) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      toggle.disabled = true;
      toggle.textContent = 'Zvuk nije podržan';
      toggle.title = 'Ovaj preglednik ne podržava Web Audio.';
    } else {
      toggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        savePreference();
      });
    }
  }

  syncToggle();
  window.POTEZ_FEEDBACK = { success, isSoundEnabled: () => soundEnabled };
})();
