/**
 * Audio Synthesis & Sound Effects Utility
 * Generates realistic paper rustle, romantic chimes, and gentle ambient piano arpeggios
 * entirely through Web Audio API for 100% reliable zero-dependency playback.
 */

class RomanticAudioManager {
  private ctx: AudioContext | null = null;
  private isPianoPlaying = false;
  private pianoTimer: number | null = null;
  private masterGain: GainNode | null = null;
  private volume = 0.45;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Realistic Book Page Flip Sound Effect
   * Synthesizes white noise filtered through high-pass and band-pass filters to replicate paper turning.
   */
  public playPageTurnSound() {
    try {
      const ctx = this.getContext();
      const bufferSize = ctx.sampleRate * 0.28; // ~280ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate soft filtered pink/paper noise
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.2;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.14);
      filter.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.28);
      filter.Q.setValueAtTime(1.8, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain || ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.29);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Magical Romantic Chime for Surprise Button & Heart Explosion
   */
  public playSurpriseChime() {
    try {
      const ctx = this.getContext();
      // Pentatonic dream arpeggio [E5, G#5, B5, E6, G#6]
      const notes = [659.25, 830.61, 987.77, 1318.51, 1661.22];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        const startTime = ctx.currentTime + idx * 0.08;
        const duration = 0.9;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain || ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Romantic Soft Piano / Ambient Music Synthesizer
   * Plays a continuous romantic chord progression with mellow sine/triangle harmonics
   */
  public toggleRomanticPiano(start?: boolean): boolean {
    if (start === undefined) {
      start = !this.isPianoPlaying;
    }

    if (start && !this.isPianoPlaying) {
      this.isPianoPlaying = true;
      this.playPianoLoop();
      return true;
    } else if (!start && this.isPianoPlaying) {
      this.isPianoPlaying = false;
      if (this.pianoTimer) {
        window.clearTimeout(this.pianoTimer);
        this.pianoTimer = null;
      }
      return false;
    }
    return this.isPianoPlaying;
  }

  public getIsPianoPlaying(): boolean {
    return this.isPianoPlaying;
  }

  private playPianoLoop() {
    if (!this.isPianoPlaying) return;

    try {
      const ctx = this.getContext();
      // Romantic progressions: Cmaj7 -> Am9 -> Fmaj7 -> Gsus4 -> Cmaj7
      const chords = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
        [220.00, 261.63, 329.63, 392.00, 493.88], // Am9 (A3, C4, E4, G4, B4)
        [174.61, 261.63, 329.63, 392.00], // Fmaj7 (F3, C4, E4, G4)
        [196.00, 261.63, 293.66, 392.00], // Gsus4 (G3, C4, D4, G4)
        [261.63, 392.00, 493.88, 523.25], // Cmaj9 (C4, G4, B4, C5)
        [220.00, 329.63, 392.00, 523.25], // Am (A3, E4, G4, C5)
        [174.61, 220.00, 329.63, 440.00], // Fadd9 (F3, A3, E4, A4)
        [196.00, 246.94, 293.66, 392.00], // G (G3, B3, D4, G4)
      ];

      const chord = chords[Math.floor(Math.random() * chords.length)];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const subOsc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        subOsc.type = 'sine';

        const noteTime = ctx.currentTime + idx * 0.35;
        const duration = 2.4;

        osc.frequency.setValueAtTime(freq, noteTime);
        subOsc.frequency.setValueAtTime(freq / 2, noteTime);

        gain.gain.setValueAtTime(0.0001, noteTime);
        gain.gain.linearRampToValueAtTime(0.08, noteTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration);

        osc.connect(gain);
        subOsc.connect(gain);
        gain.connect(this.masterGain || ctx.destination);

        osc.start(noteTime);
        subOsc.start(noteTime);
        osc.stop(noteTime + duration);
        subOsc.stop(noteTime + duration);
      });

      this.pianoTimer = window.setTimeout(() => {
        this.playPianoLoop();
      }, 2800);
    } catch {
      // Audio autoplay policy fallback
    }
  }
}

export const romanticAudio = new RomanticAudioManager();
