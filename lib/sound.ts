// Tiny Web Audio sound engine — synthesises cues, no asset files needed.

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = "sine", gain = 0.06) {
  const ac = audio();
  if (!ac) return;
  const t0 = ac.currentTime + start;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

type Cue = "complete" | "coin" | "levelup" | "claim" | "tickDone";

export function playSfx(cue: Cue, enabled: boolean) {
  if (!enabled) return;
  const ac = audio();
  if (ac && ac.state === "suspended") ac.resume().catch(() => {});
  switch (cue) {
    case "complete": // cheerful up-arpeggio
      tone(523.25, 0, 0.12, "triangle");
      tone(659.25, 0.08, 0.14, "triangle");
      break;
    case "coin":
      tone(987.77, 0, 0.08, "square", 0.04);
      tone(1318.51, 0.06, 0.1, "square", 0.04);
      break;
    case "claim":
      tone(659.25, 0, 0.1, "triangle");
      tone(880, 0.09, 0.14, "triangle");
      break;
    case "levelup": // triumphant fanfare
      tone(523.25, 0, 0.14, "sawtooth", 0.05);
      tone(659.25, 0.12, 0.14, "sawtooth", 0.05);
      tone(783.99, 0.24, 0.16, "sawtooth", 0.05);
      tone(1046.5, 0.38, 0.28, "sawtooth", 0.06);
      break;
    case "tickDone":
      tone(880, 0, 0.18, "sine", 0.07);
      tone(1174.66, 0.14, 0.24, "sine", 0.07);
      break;
  }
}
