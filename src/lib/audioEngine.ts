'use client';

type SoundType = 'ocean' | 'whitenoise' | 'brownnoise' | 'rain';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private sources: AudioBufferSourceNode[] = [];
  private gain: GainNode | null = null;
  private activeSound: SoundType | null = null;
  private isPlaying = false;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      this.gain = this.ctx.createGain();
      this.gain.gain.value = 0.5;
      this.gain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  start(type: SoundType): void {
    this.stop();
    const ctx = this.getCtx();
    this.activeSound = type;

    if (type === 'ocean') {
      const count = 6;
      for (let i = 0; i < count; i++) {
        const dur = 1.5 + Math.random() * 2;
        const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let s = 0; s < data.length; s++) {
          const t = s / ctx.sampleRate;
          const env = Math.sin((t / dur) * Math.PI) * 0.3;
          data[s] = (Math.random() * 2 - 1) * env * (0.3 + 0.7 * Math.sin(t * 2.5));
        }
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const g = ctx.createGain();
        g.gain.value = 0.15 + Math.random() * 0.1;
        src.connect(g);
        g.connect(this.gain!);
        src.start(ctx.currentTime + i * (0.5 + Math.random() * 0.8));
        this.sources.push(src);
      }
    } else if (type === 'whitenoise') {
      const bufSize = ctx.sampleRate * 4;
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      src.connect(this.gain!);
      src.start();
      this.sources.push(src);
    } else if (type === 'brownnoise') {
      const bufSize = ctx.sampleRate * 4;
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 300;
      src.connect(filter);
      filter.connect(this.gain!);
      src.start();
      this.sources.push(src);
    } else if (type === 'rain') {
      for (let i = 0; i < 4; i++) {
        const dur = 2;
        const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let s = 0; s < data.length; s++) {
          data[s] = (Math.random() * 2 - 1) * Math.max(0, Math.random() - 0.6) * 2 * 0.3;
        }
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 2000;
        src.connect(filter);
        filter.connect(this.gain!);
        src.start(ctx.currentTime + i * 0.5);
        this.sources.push(src);
      }
    }

    this.isPlaying = true;
  }

  stop(): void {
    this.sources.forEach((s) => {
      try { s.stop(); s.disconnect(); } catch { /* ignore */ }
    });
    this.sources = [];
    this.isPlaying = false;
    this.activeSound = null;
  }

  setVolume(v: number): void {
    if (this.gain) this.gain.gain.value = v;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  getActiveSound(): SoundType | null {
    return this.activeSound;
  }

  playChime(): void {
    const ctx = this.getCtx();
    [523, 659, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.frequency.value = freq;
      osc.type = 'sine';
      g.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.15);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.4);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.4);
    });
  }
}

export const audioEngine = new AudioEngine();
