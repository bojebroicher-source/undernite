// Undernite - tiny synthesised sound set (WebAudio, no asset files).
export class Sfx {
  constructor() { this.ctx = null; }
  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = this.ctx = new AC();
    this.master = ctx.createGain(); this.master.gain.value = 0.5; this.master.connect(ctx.destination);
    // noise buffer shared by all noise based sounds
    const len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.noiseBuf = buf;
    // ambient rumble
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 170;
    const g = ctx.createGain(); g.gain.value = 0.5;
    src.connect(lp).connect(g).connect(this.master); src.start();
  }
  noise(dur, freq, q, vol, type = 'bandpass', slide = 0) {
    const ctx = this.ctx; if (!ctx || vol <= 0.003) return;
    const t = ctx.currentTime, src = ctx.createBufferSource(); src.buffer = this.noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(freq, t); f.Q.value = q;
    if (slide) f.frequency.exponentialRampToValueAtTime(Math.max(30, slide), t + dur);
    const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f).connect(g).connect(this.master); src.start(t, Math.random()); src.stop(t + dur + 0.02);
  }
  tone(f0, f1, dur, vol, type = 'sine') {
    const ctx = this.ctx; if (!ctx || vol <= 0.003) return;
    const t = ctx.currentTime, o = ctx.createOscillator(); o.type = type;
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(this.master); o.start(t); o.stop(t + dur + 0.02);
  }
  shot(w, vol) {
    if (w === 1) { this.noise(0.07, 2600, 2, 0.35 * vol, 'bandpass', 900); this.tone(900, 300, 0.06, 0.12 * vol, 'square'); }
    else if (w === 2) { this.noise(0.22, 900, 0.8, 0.6 * vol, 'lowpass', 200); }
    else if (w === 3) { this.tone(500, 90, 0.25, 0.4 * vol, 'sawtooth'); this.noise(0.18, 1800, 3, 0.3 * vol); }
    else if (w === 6) { this.tone(1400, 400, 0.12, 0.25 * vol, 'sawtooth'); this.noise(0.08, 3000, 2, 0.2 * vol, 'bandpass', 1500); }
    else if (w === 7) { this.tone(90, 40, 0.6, 0.6 * vol, 'sine'); this.tone(300, 60, 0.3, 0.3 * vol, 'square'); }
    else if (w >= 4) { this.tone(160, 60, 0.45, 0.5 * vol, 'sine'); this.noise(0.4, 500, 1, 0.3 * vol, 'lowpass', 120); }
    else { this.noise(0.1, 1500, 1.5, 0.45 * vol, 'bandpass', 500); this.tone(420, 150, 0.09, 0.2 * vol, 'triangle'); }
  }
  hit(vol) { this.noise(0.08, 700, 2, 0.4 * vol, 'bandpass', 250); }
  hitmark(kill) { this.tone(kill ? 1300 : 950, kill ? 1900 : 950, kill ? 0.22 : 0.05, 0.22, 'triangle'); }
  boom(vol) { this.noise(0.9, 400, 0.7, 0.9 * vol, 'lowpass', 50); this.tone(110, 30, 0.7, 0.7 * vol); }
  hurt() { this.tone(180, 70, 0.18, 0.45, 'sawtooth'); }
  bite(vol) { this.noise(0.16, 300, 1, 0.8 * vol, 'lowpass', 90); this.tone(240, 60, 0.2, 0.4 * vol, 'square'); }
  pickup() { this.tone(660, 990, 0.09, 0.2, 'triangle'); setTimeout(() => this.tone(990, 1320, 0.1, 0.18, 'triangle'), 70); }
  ping() { this.tone(1250, 1180, 1.1, 0.22, 'sine'); }
  shock() { this.noise(0.25, 3200, 6, 0.4, 'bandpass', 1200); }
  // ----- underwater robot (Goliath): one continuous voice per robot nearby -----
  // motor hum (two detuned saws through a lowpass), thruster wash (filtered noise) and a servo whine when turning
  mechVoice() {
    const ctx = this.ctx; if (!ctx) return null;
    const out = ctx.createGain(); out.gain.value = 0; out.connect(this.master);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 260; lp.connect(out);
    const o1 = ctx.createOscillator(), o2 = ctx.createOscillator(); o1.type = o2.type = 'sawtooth'; o1.frequency.value = 46; o2.frequency.value = 69.5;
    const og = ctx.createGain(); og.gain.value = 0.35; o1.connect(og); o2.connect(og); og.connect(lp);
    const n = ctx.createBufferSource(); n.buffer = this.noiseBuf; n.loop = true;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 500; bp.Q.value = 0.9;
    const ng = ctx.createGain(); ng.gain.value = 0; n.connect(bp).connect(ng).connect(out);
    const sv = ctx.createOscillator(); sv.type = 'triangle'; sv.frequency.value = 900;
    const sg = ctx.createGain(); sg.gain.value = 0; sv.connect(sg).connect(out);
    for (const o of [o1, o2, n, sv]) o.start();
    const t = () => ctx.currentTime;
    return {
      // vol 0..1 (distance), speed m/s, turn rad/s
      set(vol, speed, turn) {
        const k = Math.min(1, speed / 7), tc = 0.12;
        out.gain.setTargetAtTime(vol * 0.55, t(), tc);
        o1.frequency.setTargetAtTime(46 + k * 30, t(), 0.25); o2.frequency.setTargetAtTime(69.5 + k * 44, t(), 0.25);
        lp.frequency.setTargetAtTime(220 + k * 380, t(), 0.2);
        ng.gain.setTargetAtTime(0.15 + k * 0.85, t(), 0.15); bp.frequency.setTargetAtTime(380 + k * 900, t(), 0.2);
        const tr = Math.min(1, Math.abs(turn) / 2.5);
        sg.gain.setTargetAtTime(tr * 0.09, t(), 0.06); sv.frequency.setTargetAtTime(800 + tr * 900, t(), 0.08);
      },
      stop() { out.gain.setTargetAtTime(0, t(), 0.1); setTimeout(() => { for (const o of [o1, o2, n, sv]) try { o.stop(); } catch {} out.disconnect(); }, 600); },
    };
  }
  // short hydraulic clunk + servo whine when a robot starts to move
  mechStart(vol) { this.noise(0.18, 260, 1.5, 0.5 * vol, 'lowpass', 70); this.tone(700, 1500, 0.25, 0.12 * vol, 'triangle'); }
  crate() { this.noise(0.3, 500, 1, 0.4, 'lowpass', 1500); this.tone(330, 660, 0.25, 0.2, 'triangle'); }
}
