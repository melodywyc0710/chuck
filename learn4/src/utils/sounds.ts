const ctx = () => new (window.AudioContext || (window as any).webkitAudioContext)();

function beep(freq: number, type: OscillatorType, duration: number, gain: number) {
  try {
    const ac = ctx();
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.connect(g); g.connect(ac.destination);
    osc.type = type; osc.frequency.value = freq;
    g.gain.setValueAtTime(gain, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
    osc.start(); osc.stop(ac.currentTime + duration);
  } catch {}
}

export const sounds = {
  correct: () => { beep(523, 'sine', 0.15, 0.3); setTimeout(() => beep(659, 'sine', 0.2, 0.3), 100); },
  wrong: () => beep(220, 'sawtooth', 0.3, 0.2),
  starEarned: () => { [523,659,784,1047].forEach((f,i) => setTimeout(() => beep(f,'sine',0.15,0.25), i*80)); },
  click: () => beep(800, 'sine', 0.05, 0.1),
  unlock: () => { [392,494,587,784].forEach((f,i) => setTimeout(() => beep(f,'triangle',0.2,0.2), i*60)); },
};
