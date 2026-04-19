let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  return ctx;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

// Synthesised water-droplet: a sine that sweeps sharply down in pitch,
// wrapped in a fast envelope. Randomising the start/end frequencies and
// sweep time gives a natural "plink / plonk / ploop" variation per match.
export function playMatchChime() {
  const audio = getCtx();
  if (!audio) return;
  if (audio.state === "suspended") audio.resume().catch(() => {});

  const now = audio.currentTime;

  const startFreq = rand(1600, 2600);
  const endFreq = rand(280, 520);
  const sweepTime = rand(0.06, 0.12);
  const tailTime = rand(0.18, 0.32);
  const peakGain = rand(0.18, 0.26);

  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "sine";

  osc.frequency.setValueAtTime(startFreq, now);
  osc.frequency.exponentialRampToValueAtTime(endFreq, now + sweepTime);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(peakGain, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + sweepTime + tailTime);

  osc.connect(gain).connect(audio.destination);
  osc.start(now);
  osc.stop(now + sweepTime + tailTime + 0.05);

  // Subtle high-frequency "tick" at the impact for splash texture
  const tick = audio.createOscillator();
  const tickGain = audio.createGain();
  tick.type = "triangle";
  tick.frequency.setValueAtTime(rand(3200, 4200), now);
  tickGain.gain.setValueAtTime(0, now);
  tickGain.gain.linearRampToValueAtTime(0.05, now + 0.004);
  tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
  tick.connect(tickGain).connect(audio.destination);
  tick.start(now);
  tick.stop(now + 0.08);
}
