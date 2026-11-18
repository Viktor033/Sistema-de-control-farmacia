/* ====================================================================
   2. AUDIO FEEDBACK (WEB AUDIO API)
   ==================================================================== */

let audioCtx = null;

function playBeep(type = 'scan') {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'scan') {
      // Sharp POS scanner beep (1760 Hz)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1760, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'success') {
      // Double success chime (880 Hz -> 1320 Hz)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1320, now + 0.08);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'error') {
      // Low warning boop (220 Hz)
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {
    console.warn("Web Audio not supported or blocked", e);
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const icon = document.getElementById('icon-sound');
  const btn = document.getElementById('btn-sound-toggle');
  if (soundEnabled) {
    icon.setAttribute('data-lucide', 'volume-2');
    btn.classList.remove('text-slate-600');
    btn.classList.add('text-teal-400');
    showToast('info', 'Sonido del lector activado');
    playBeep('scan');
  } else {
    icon.setAttribute('data-lucide', 'volume-x');
    btn.classList.remove('text-teal-400');
    btn.classList.add('text-slate-600');
    showToast('info', 'Sonido del lector silenciado');
  }
  lucide.createIcons();
}
