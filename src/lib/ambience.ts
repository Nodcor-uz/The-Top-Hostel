export type Mood = "off" | "garden" | "lantern" | "rain";

type Engine = { stop: () => void };

let ctx: AudioContext | null = null;
let engine: Engine | null = null;
let mood: Mood = "off";

function audio(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function loopNoise(c: AudioContext, color: "brown" | "white"): AudioBufferSourceNode {
  const length = c.sampleRate * 2;
  const buffer = c.createBuffer(1, length, c.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    if (color === "white") data[i] = white;
    else {
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.2;
    }
  }
  const src = c.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  return src;
}

function chirp(c: AudioContext, dest: AudioNode) {
  const osc = c.createOscillator();
  const gain = c.createGain();
  const freq = 1600 + Math.random() * 2400;
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(Math.max(80, freq * (1.15 + Math.random() * 0.35)), c.currentTime + 0.09);
  gain.gain.setValueAtTime(0.0001, c.currentTime);
  gain.gain.linearRampToValueAtTime(0.028, c.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.16);
  osc.connect(gain).connect(dest);
  osc.start();
  osc.stop(c.currentTime + 0.18);
}

function startGarden(c: AudioContext): Engine {
  const master = c.createGain();
  master.gain.value = 0.9;
  master.connect(c.destination);
  const noise = loopNoise(c, "brown");
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 700;
  const gain = c.createGain();
  gain.gain.value = 0.045;
  noise.connect(filter).connect(gain).connect(master);
  noise.start();
  let timer = 0;
  const schedule = () => {
    chirp(c, master);
    timer = window.setTimeout(schedule, 700 + Math.random() * 1600);
  };
  timer = window.setTimeout(schedule, 400);
  return {
    stop: () => {
      window.clearTimeout(timer);
      noise.stop();
      master.disconnect();
    },
  };
}

function startLantern(c: AudioContext): Engine {
  const master = c.createGain();
  master.gain.value = 0.03;
  master.connect(c.destination);
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.frequency.value = 0.07;
  lfoGain.gain.value = 0.012;
  lfo.connect(lfoGain).connect(master.gain);
  lfo.start();
  const nodes: OscillatorNode[] = [];
  for (const freq of [196, 246.9, 392]) {
    const osc = c.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const gain = c.createGain();
    gain.gain.value = freq > 300 ? 0.25 : 0.55;
    osc.connect(gain).connect(master);
    osc.start();
    nodes.push(osc);
  }
  return {
    stop: () => {
      lfo.stop();
      for (const osc of nodes) osc.stop();
      master.disconnect();
    },
  };
}

function startRain(c: AudioContext): Engine {
  const master = c.createGain();
  master.gain.value = 0.22;
  master.connect(c.destination);
  const noise = loopNoise(c, "white");
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1400;
  filter.Q.value = 0.55;
  noise.connect(filter).connect(master);
  noise.start();
  const rumble = loopNoise(c, "brown");
  const low = c.createBiquadFilter();
  low.type = "lowpass";
  low.frequency.value = 240;
  const lowGain = c.createGain();
  lowGain.gain.value = 0.35;
  rumble.connect(low).connect(lowGain).connect(master);
  rumble.start();
  return {
    stop: () => {
      noise.stop();
      rumble.stop();
      master.disconnect();
    },
  };
}

export async function setMood(next: Mood) {
  const c = audio();
  if (c.state === "suspended") await c.resume();
  engine?.stop();
  engine = null;
  mood = next;
  if (next === "garden") engine = startGarden(c);
  if (next === "lantern") engine = startLantern(c);
  if (next === "rain") engine = startRain(c);
}

export function currentMood(): Mood {
  return mood;
}

export function tick() {
  const c = audio();
  if (c.state === "suspended") void c.resume();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.value = 680;
  gain.gain.setValueAtTime(0.035, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.06);
  osc.connect(gain).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + 0.07);
}

export function chime() {
  const c = audio();
  if (c.state === "suspended") void c.resume();
  [523.25, 659.25, 783.99].forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    const t = c.currentTime + i * 0.09;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.04, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    osc.connect(gain).connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.36);
  });
}
