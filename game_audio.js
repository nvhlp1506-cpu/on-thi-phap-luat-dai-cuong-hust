// ==========================================================================
// ĐẤU TRƯỜNG TRI THỨC - WEB AUDIO SOUND & MUSIC SYNTHESIZER
// 100% Native Web Audio API - Runs anywhere offline, no external audio files needed!
// ==========================================================================

class GameSoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.volume = 0.7;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.initContext();
  }

  initContext() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  resume() {
    this.initContext();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBGM();
    } else {
      this.resume();
      this.startBGM();
    }
    return this.isMuted;
  }

  // --- SOUND EFFECTS (SFX) ---

  // Button Click / Hover
  playSelect() {
    if (this.isMuted) return;
    this.resume();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  // Bell Buzzer (Giành quyền trả lời!)
  playBuzz() {
    if (this.isMuted) return;
    this.resume();
    try {
      // High bell ring with harmonics
      [1200, 1800, 2400].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = idx === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const decay = 0.6 + idx * 0.1;
        gain.gain.setValueAtTime((0.3 / (idx + 1)) * this.volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + decay);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + decay);
      });
    } catch (e) {}
  }

  // Attack Hit
  playHit() {
    if (this.isMuted) return;
    this.resume();
    try {
      // Low punch osc + noise snap
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.4 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {}
  }

  // Critical Hit (Chí Mạng Sấm Sét)
  playCrit() {
    if (this.isMuted) return;
    this.resume();
    try {
      const now = this.ctx.currentTime;
      // Thunder crack
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

      gain.gain.setValueAtTime(0.5 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.35);

      // Electric spark overlay
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = "square";
      osc2.frequency.setValueAtTime(900, now);
      osc2.frequency.exponentialRampToValueAtTime(150, now + 0.25);
      gain2.gain.setValueAtTime(0.2 * this.volume, now);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start();
      osc2.stop(now + 0.25);
    } catch (e) {}
  }

  // Ultimate Skill Activation (Tuyệt Kỹ Cực Đại!)
  playUltimate() {
    if (this.isMuted) return;
    this.resume();
    try {
      const now = this.ctx.currentTime;
      // Rising energy siren
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.6);

      gain.gain.setValueAtTime(0.3 * this.volume, now);
      gain.gain.linearRampToValueAtTime(0.5 * this.volume, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.7);

      // Deep bass drop explosion
      setTimeout(() => {
        if (this.isMuted || !this.ctx) return;
        const boomTime = this.ctx.currentTime;
        const boomOsc = this.ctx.createOscillator();
        const boomGain = this.ctx.createGain();
        boomOsc.type = "sine";
        boomOsc.frequency.setValueAtTime(120, boomTime);
        boomOsc.frequency.exponentialRampToValueAtTime(25, boomTime + 0.8);

        boomGain.gain.setValueAtTime(0.6 * this.volume, boomTime);
        boomGain.gain.exponentialRampToValueAtTime(0.001, boomTime + 0.8);

        boomOsc.connect(boomGain);
        boomGain.connect(this.ctx.destination);
        boomOsc.start();
        boomOsc.stop(boomTime + 0.8);
      }, 550);
    } catch (e) {}
  }

  // Correct Answer (Chính xác!)
  playCorrect() {
    if (this.isMuted) return;
    this.resume();
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const time = this.ctx.currentTime + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.25 * this.volume, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + 0.25);
      });
    } catch (e) {}
  }

  // Wrong Answer (Sai / Bị ăn hành!)
  playWrong() {
    if (this.isMuted) return;
    this.resume();
    try {
      const notes = [220, 196]; // A3, G3 (low harsh buzz)
      notes.forEach((freq, idx) => {
        const time = this.ctx.currentTime + idx * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.25 * this.volume, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + 0.2);
      });
    } catch (e) {}
  }

  // Countdown Ticking
  playTick(isUrgent = false) {
    if (this.isMuted) return;
    this.resume();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(isUrgent ? 880 : 440, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.12 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  // Shuffle / Reroll Question Sound
  playShuffle() {
    if (this.isMuted) return;
    this.resume();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.12);

      gain.gain.setValueAtTime(0.2 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  // Victory Fanfare
  playVictory() {
    if (this.isMuted) return;
    this.resume();
    try {
      const chords = [
        { freq: 523.25, time: 0 },
        { freq: 659.25, time: 0.12 },
        { freq: 783.99, time: 0.24 },
        { freq: 1046.5, time: 0.4 },
        { freq: 1318.5, time: 0.7 }
      ];
      chords.forEach(n => {
        const t = this.ctx.currentTime + n.time;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(n.freq, t);

        gain.gain.setValueAtTime(0.35 * this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.6);
      });
    } catch (e) {}
  }

  // Knockout K.O. Gong
  playKO() {
    if (this.isMuted) return;
    this.resume();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(20, now + 1.2);

      gain.gain.setValueAtTime(0.6 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 1.2);
    } catch (e) {}
  }

  // Boss Roar / Encounter
  playBossRoar() {
    if (this.isMuted) return;
    this.resume();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.linearRampToValueAtTime(130, now + 0.3);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.9);

      gain.gain.setValueAtTime(0.4 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.9);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.9);
    } catch (e) {}
  }

  // Stage Clear Fanfare
  playStageClear() {
    if (this.isMuted) return;
    this.resume();
    try {
      const now = this.ctx.currentTime;
      const notes = [
        { f: 587.33, t: 0 },    // D5
        { f: 739.99, t: 0.1 },  // F#5
        { f: 880.00, t: 0.2 },  // A5
        { f: 1174.66, t: 0.32 } // D6
      ];
      notes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.25 * this.volume, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.005, now + n.t + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + 0.45);
      });
    } catch (e) {}
  }

  // Campaign Game Over
  playGameOver() {
    if (this.isMuted) return;
    this.resume();
    try {
      const now = this.ctx.currentTime;
      const notes = [
        { f: 392.00, t: 0 },   // G4
        { f: 349.23, t: 0.25 }, // F4
        { f: 329.63, t: 0.5 },  // E4
        { f: 261.63, t: 0.8 }   // C4
      ];
      notes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.2 * this.volume, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.005, now + n.t + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + 0.5);
      });
    } catch (e) {}
  }

  // Item / Potion Heal Sound
  playHeal() {
    if (this.isMuted) return;
    this.resume();
    try {
      const now = this.ctx.currentTime;
      const notes = [
        { f: 523.25, t: 0 },    // C5
        { f: 659.25, t: 0.08 }, // E5
        { f: 783.99, t: 0.16 }, // G5
        { f: 1046.50, t: 0.24 } // C6
      ];
      notes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.22 * this.volume, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.005, now + n.t + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + 0.35);
      });
    } catch (e) {}
  }

  // Divine Shield Activate / Block Sound
  playShield() {
    if (this.isMuted) return;
    this.resume();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);
      gain.gain.setValueAtTime(0.25 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }

  // Break Stun Sound (Phá Chiêu Ma Thú!)
  playBreak() {
    if (this.isMuted) return;
    this.resume();
    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = "square";
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.exponentialRampToValueAtTime(110, now + 0.4);
      gain1.gain.setValueAtTime(0.35 * this.volume, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.45);

      // Low sub rumble
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = "sawtooth";
      osc2.frequency.setValueAtTime(150, now);
      osc2.frequency.exponentialRampToValueAtTime(40, now + 0.5);
      gain2.gain.setValueAtTime(0.4 * this.volume, now);
      gain2.gain.exponentialRampToValueAtTime(0.005, now + 0.5);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.5);
    } catch (e) {}
  }

  // Treasure Chest Open Fanfare
  playChestOpen() {
    if (this.isMuted) return;
    this.resume();
    try {
      const now = this.ctx.currentTime;
      const notes = [
        { f: 523.25, t: 0 },    // C5
        { f: 659.25, t: 0.08 }, // E5
        { f: 783.99, t: 0.16 }, // G5
        { f: 987.77, t: 0.24 }, // B5
        { f: 1318.51, t: 0.32 } // E6
      ];
      notes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.25 * this.volume, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.005, now + n.t + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + 0.4);
      });
    } catch (e) {}
  }

  // Combo Streak Announcer (Double Kill, Triple Kill, Godlike!)
  playComboStreak(streak = 2) {
    if (this.isMuted) return;
    this.resume();
    try {
      const now = this.ctx.currentTime;
      const baseFreq = streak >= 5 ? 659.25 : streak >= 4 ? 587.33 : streak >= 3 ? 523.25 : 440;
      const notes = [
        { f: baseFreq, t: 0 },
        { f: baseFreq * 1.25, t: 0.08 },
        { f: baseFreq * 1.5, t: 0.16 },
        { f: baseFreq * 2.0, t: 0.26 }
      ];
      notes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.28 * this.volume, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.005, now + n.t + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + 0.35);
      });
    } catch (e) {}
  }

  // Low HP Near-Death Heartbeat Sound (Pulsing Thump)
  playHeartbeat() {
    if (this.isMuted) return;
    this.resume();
    try {
      const now = this.ctx.currentTime;
      [0, 0.15].forEach(delay => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(70, now + delay);
        osc.frequency.exponentialRampToValueAtTime(32, now + delay + 0.14);
        gain.gain.setValueAtTime(0.45 * this.volume, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.14);
      });
    } catch (e) {}
  }

  // Clutch Comeback Strike (Nghịch Cảnh Sinh Anh Hùng)
  playClutchComeback() {
    if (this.isMuted) return;
    this.resume();
    try {
      const now = this.ctx.currentTime;
      const chords = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
      chords.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, now + idx * 0.04);
        gain.gain.setValueAtTime(0.25 * this.volume, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.04 + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.5);
      });
    } catch (e) {}
  }

  // Boss Ego Taunt Laugh
  playTaunt() {
    if (this.isMuted) return;
    this.resume();
    try {
      const now = this.ctx.currentTime;
      [220, 196, 174, 130].forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(f, now + idx * 0.1);
        gain.gain.setValueAtTime(0.2 * this.volume, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.18);
      });
    } catch (e) {}
  }

  // --- BACKGROUND FIGHT MUSIC (BGM) LOOP ---
  startBGM() {
    if (this.bgmPlaying || this.isMuted) return;
    this.resume();
    this.bgmPlaying = true;
    this.bgmStep = 0;

    const tempo = 128; // BPM
    const beatInterval = (60 / tempo) * 1000 / 2; // eighth notes

    // Bassline and drum pattern
    const bassline = [110, 110, 130.8, 110, 146.8, 110, 164.8, 130.8]; // A2 riff

    this.bgmTimer = setInterval(() => {
      if (!this.bgmPlaying || this.isMuted || !this.ctx) return;
      try {
        const step = this.bgmStep % 8;
        const now = this.ctx.currentTime;

        // Kick Drum on beat 0 and 4
        if (step === 0 || step === 4) {
          const kickOsc = this.ctx.createOscillator();
          const kickGain = this.ctx.createGain();
          kickOsc.type = "sine";
          kickOsc.frequency.setValueAtTime(130, now);
          kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.12);
          kickGain.gain.setValueAtTime(0.25 * this.volume, now);
          kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          kickOsc.connect(kickGain);
          kickGain.connect(this.ctx.destination);
          kickOsc.start(now);
          kickOsc.stop(now + 0.12);
        }

        // Hi-hat on offbeats
        if (step % 2 === 1) {
          const hatOsc = this.ctx.createOscillator();
          const hatGain = this.ctx.createGain();
          hatOsc.type = "sawtooth";
          hatOsc.frequency.setValueAtTime(3000, now);
          hatGain.gain.setValueAtTime(0.04 * this.volume, now);
          hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          hatOsc.connect(hatGain);
          hatGain.connect(this.ctx.destination);
          hatOsc.start(now);
          hatOsc.stop(now + 0.04);
        }

        // Bass Synth
        const bassFreq = bassline[step];
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = "sawtooth";
        bassOsc.frequency.setValueAtTime(bassFreq, now);
        bassGain.gain.setValueAtTime(0.08 * this.volume, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        // Lowpass filter for warm synthwave bass
        const filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(450, now);

        bassOsc.connect(filter);
        filter.connect(bassGain);
        bassGain.connect(this.ctx.destination);
        bassOsc.start(now);
        bassOsc.stop(now + 0.2);

        this.bgmStep++;
      } catch (e) {}
    }, beatInterval);
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

// Global instance
if (typeof window !== "undefined") {
  window.gameAudio = new GameSoundEngine();
}
