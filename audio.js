// Procedural Romantic Lofi / Rhodes Audio Engine using Web Audio API
class RomanticAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.volume = 0.6;
    this.timer = null;
    this.step = 0;
    
    // Chord progression in Hz (Romantic Neo-Soul / Lofi progression)
    // Cmaj9 -> Am9 -> Fmaj7(#11) -> G7sus4 -> Em7 -> Am7 -> Dm9 -> G13
    this.chords = [
      // Cmaj9: C3, G3, B3, D4, E4
      [130.81, 196.00, 246.94, 293.66, 329.63],
      // Am9: A2, E3, G3, B3, C4
      [110.00, 164.81, 196.00, 246.94, 261.63],
      // Fmaj7: F2, C3, E3, A3, C4
      [87.31, 130.81, 164.81, 220.00, 261.63],
      // G7sus4: G2, D3, F3, C4, D4
      [98.00, 146.83, 174.61, 261.63, 293.66],
      // Em7: E2, B2, D3, G3, B3
      [82.41, 123.47, 146.83, 196.00, 246.94],
      // Am7: A2, E3, G3, C4, E4
      [110.00, 164.81, 196.00, 261.63, 329.63],
      // Dm9: D3, A3, C4, E4, F4
      [146.83, 220.00, 261.63, 329.63, 349.23],
      // G13: G2, F3, B3, E4, G4
      [98.00, 174.61, 246.94, 329.63, 392.00]
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      
      // Gentle stereo panner and low-pass filter for vintage warmth
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

      // Simple analog-style subtle delay
      this.delay = this.ctx.createDelay();
      this.delay.delayTime.setValueAtTime(0.35, this.ctx.currentTime);
      this.delayGain = this.ctx.createGain();
      this.delayGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

      this.delay.connect(this.delayGain);
      this.delayGain.connect(this.delay);
      this.delayGain.connect(this.filter);

      this.filter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playNote(freq, time, duration = 2.2, type = 'sine') {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Warm Rhodes bell-like harmonic layer
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, time);

    const now = time;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    gain2.gain.setValueAtTime(0.001, now);
    gain2.gain.exponentialRampToValueAtTime(0.04, now + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + (duration * 0.6));

    osc.connect(gain);
    osc2.connect(gain2);

    gain.connect(this.filter);
    gain.connect(this.delay);
    gain2.connect(this.filter);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + duration);
    osc2.stop(now + duration);
  }

  playSparkle(freq, time) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.06, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.2);

    osc.connect(gain);
    gain.connect(this.delay);
    gain.connect(this.filter);

    osc.start(time);
    osc.stop(time + 1.3);
  }

  playPopSound() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  playEnvelopeUnsealSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Chime harp cascade
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      this.playSparkle(freq, now + idx * 0.08);
    });
  }

  scheduleNextBar() {
    if (!this.isPlaying || !this.ctx) return;

    const chord = this.chords[this.step % this.chords.length];
    const now = this.ctx.currentTime;
    
    // Play warm chord notes with slight humanized arpeggio strum
    chord.forEach((freq, i) => {
      const strumDelay = i * 0.05 + (Math.random() * 0.02);
      this.playNote(freq, now + strumDelay, 3.4);
    });

    // Add gentle top melodic sparkle on some beats
    if (this.step % 2 === 0) {
      const highNotes = [587.33, 659.25, 783.99, 880.00, 1046.50];
      const randomHigh = highNotes[Math.floor(Math.random() * highNotes.length)];
      this.playSparkle(randomHigh, now + 1.0);
    }
    if (this.step % 3 === 0) {
      const highNotes = [659.25, 783.99, 987.77, 1174.66];
      const randomHigh = highNotes[Math.floor(Math.random() * highNotes.length)];
      this.playSparkle(randomHigh, now + 2.2);
    }

    this.step++;
    this.timer = setTimeout(() => {
      this.scheduleNextBar();
    }, 2800);
  }

  toggle() {
    this.init();
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  play() {
    this.init();
    this.isPlaying = true;
    this.scheduleNextBar();
  }

  pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  setVolume(val) {
    this.volume = val;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }
}

window.romanticAudio = new RomanticAudioEngine();
