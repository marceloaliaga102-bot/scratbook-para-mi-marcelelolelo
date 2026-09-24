// Web Audio romantic melody player for ambient background music
class RomanticAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private intervalId: number | null = null;

  private notes = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    349.23, // F4
    392.00, // G4
    440.00, // A4
    493.88, // B4
    523.25, // C5
    587.33, // D5
    659.25, // E5
  ];

  // Romantic progression: C - Am - F - G
  private chords = [
    [261.63, 329.63, 392.00], // C
    [220.00, 261.63, 329.63], // Am
    [174.61, 220.00, 261.63], // F
    [196.00, 246.94, 293.66], // G
  ];

  private chordIndex = 0;

  public start() {
    if (this.isPlaying) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.isPlaying = true;

      // Play soft arpeggiated romantic chords
      let step = 0;
      this.intervalId = window.setInterval(() => {
        if (!this.ctx || this.ctx.state === 'suspended') {
          this.ctx?.resume();
        }
        const currentChord = this.chords[this.chordIndex];
        const noteFreq = currentChord[step % currentChord.length];
        this.playSoftNote(noteFreq, 1.8);

        step++;
        if (step % 4 === 0) {
          this.chordIndex = (this.chordIndex + 1) % this.chords.length;
        }
      }, 550);
    } catch (e) {
      console.error('Audio initialization failed', e);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }

  private playSoftNote(freq: number, duration: number) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Ignore audio glitches
    }
  }
}

export const romanticAudio = new RomanticAudioEngine();
