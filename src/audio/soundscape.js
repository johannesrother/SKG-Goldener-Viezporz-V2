export class Soundscape {
  constructor(volume = 0.45) {
    this.volume = volume;
    this.context = null;
    this.master = null;
    this.marketStarted = false;
    this.marketTimer = null;
    this.zone = 'hauptmarkt';
    this.hum = null;
    this.humFilter = null;
    this.humGain = null;
    this.humPanner = null;
    this.ambienceFilter = null;
    this.ambienceGain = null;
    this.ambiencePanner = null;
  }

  activate() {
    if (this.context) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.context = new AudioContext();
    this.master = this.context.createGain();
    this.master.gain.value = this.volume * 0.12;
    this.master.connect(this.context.destination);
  }

  startMarket() {
    if (!this.context || !this.master || this.marketStarted) return;
    this.marketStarted = true;
    const hum = this.context.createOscillator();
    const humGain = this.context.createGain();
    const filter = this.context.createBiquadFilter();
    hum.type = 'sine';
    hum.frequency.value = 98;
    humGain.gain.value = 0.018;
    filter.type = 'lowpass';
    filter.frequency.value = 420;
    const humPanner = this.context.createStereoPanner?.();
    hum.connect(filter);
    if (humPanner) {
      filter.connect(humPanner);
      humPanner.connect(humGain);
    } else filter.connect(humGain);
    humGain.connect(this.master);
    hum.start();
    this.hum = hum;
    this.humFilter = filter;
    this.humGain = humGain;
    this.humPanner = humPanner;
    const noiseBuffer = this.context.createBuffer(1, this.context.sampleRate * 2, this.context.sampleRate);
    const noise = noiseBuffer.getChannelData(0);
    for (let index = 0; index < noise.length; index += 1) noise[index] = (Math.random() * 2 - 1) * .22;
    const ambience = this.context.createBufferSource();
    const ambienceFilter = this.context.createBiquadFilter();
    const ambienceGain = this.context.createGain();
    ambience.buffer = noiseBuffer;
    ambience.loop = true;
    ambienceFilter.type = 'bandpass';
    ambienceFilter.frequency.value = 720;
    ambienceFilter.Q.value = .45;
    ambienceGain.gain.value = .035;
    const ambiencePanner = this.context.createStereoPanner?.();
    ambience.connect(ambienceFilter);
    if (ambiencePanner) {
      ambienceFilter.connect(ambiencePanner);
      ambiencePanner.connect(ambienceGain);
    } else ambienceFilter.connect(ambienceGain);
    ambienceGain.connect(this.master);
    ambience.start();
    this.ambienceFilter = ambienceFilter;
    this.ambienceGain = ambienceGain;
    this.ambiencePanner = ambiencePanner;
    const pluck = () => {
      if (!this.context || !this.master) return;
      const start = this.context.currentTime;
      const notes = this.zone === 'domfreihof'
        ? [261.63, 329.63, 392]
        : this.zone === 'porta'
          ? [196, 293.66, 369.99]
          : this.zone === 'kornmarkt'
            ? [293.66, 349.23, 440]
            : [293.66, 369.99, 440, 587.33];
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.value = notes[Math.floor(Math.random() * notes.length)];
      gain.gain.setValueAtTime(.0001, start);
      gain.gain.exponentialRampToValueAtTime(.15, start + .02);
      gain.gain.exponentialRampToValueAtTime(.0001, start + .82);
      oscillator.connect(gain);
      gain.connect(this.master);
      oscillator.start(start);
      oscillator.stop(start + .85);
    };
    const loop = () => {
      pluck();
      this.marketTimer = window.setTimeout(loop, 2300 + Math.random() * 2600);
    };
    window.setTimeout(loop, 420);
  }

  // Browser-safe procedural placeholders: zones are silent until the first
  // start click, then fade rather than requiring external audio downloads.
  setZone(zone) {
    if (!this.context || !this.master || !zone || zone === this.zone) return;
    this.zone = zone;
    const now = this.context.currentTime;
    const target = this.volume * (zone === 'domfreihof' || zone === 'kornmarkt' ? .085 : zone === 'porta' ? .115 : zone === 'simeonstrasse' || zone === 'christophstrasse' || zone === 'margaretengaesschen' || zone === 'sternstrasse' || zone === 'brotstrasse' || zone === 'fleischstrasse' ? .105 : .12);
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(target, now + .65);
    const profile = {
      hauptmarkt: { hum: 98, humFilter: 440, humGain: .018, ambienceFilter: 760, ambienceGain: .037, pan: -.06 },
      simeonstrasse: { hum: 94, humFilter: 520, humGain: .015, ambienceFilter: 650, ambienceGain: .03, pan: .13 },
      christophstrasse: { hum: 87, humFilter: 440, humGain: .011, ambienceFilter: 500, ambienceGain: .022, pan: -.18 },
      margaretengaesschen: { hum: 91, humFilter: 500, humGain: .014, ambienceFilter: 600, ambienceGain: .027, pan: .18 },
      sternstrasse: { hum: 88, humFilter: 430, humGain: .012, ambienceFilter: 530, ambienceGain: .024, pan: .18 },
      domfreihof: { hum: 78, humFilter: 350, humGain: .009, ambienceFilter: 390, ambienceGain: .016, pan: -.22 },
      brotstrasse: { hum: 92, humFilter: 500, humGain: .014, ambienceFilter: 600, ambienceGain: .028, pan: -.13 },
      fleischstrasse: { hum: 95, humFilter: 510, humGain: .015, ambienceFilter: 625, ambienceGain: .029, pan: .12 },
      kornmarkt: { hum: 84, humFilter: 385, humGain: .011, ambienceFilter: 455, ambienceGain: .021, pan: .04 },
      porta: { hum: 82, humFilter: 390, humGain: .013, ambienceFilter: 500, ambienceGain: .025, pan: -.08 },
    }[zone] || { hum: 98, humFilter: 440, humGain: .018, ambienceFilter: 760, ambienceGain: .037, pan: -.06 };
    this.hum?.frequency.setTargetAtTime(profile.hum, now, .42);
    this.humFilter?.frequency.setTargetAtTime(profile.humFilter, now, .42);
    this.humGain?.gain.setTargetAtTime(profile.humGain, now, .42);
    this.ambienceFilter?.frequency.setTargetAtTime(profile.ambienceFilter, now, .45);
    this.ambienceGain?.gain.setTargetAtTime(profile.ambienceGain, now, .45);
    this.humPanner?.pan.setTargetAtTime(profile.pan * .45, now, .5);
    this.ambiencePanner?.pan.setTargetAtTime(profile.pan, now, .5);
    if (zone === 'domfreihof') this.chime([392, 523.25, 659.25]);
    if (zone === 'porta') this.chime([196, 293.66]);
    if (zone === 'sternstrasse') this.chime([329.63, 392]);
    if (zone === 'brotstrasse' || zone === 'fleischstrasse') this.chime([293.66, 369.99]);
    if (zone === 'kornmarkt') this.chime([261.63, 329.63, 392]);
  }

  chime(tones = [523.25, 659.25]) {
    if (!this.context || !this.master) return;
    const start = this.context.currentTime;
    tones.forEach((frequency, index) => {
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = index === 0 ? 'sine' : 'triangle';
      oscillator.frequency.setValueAtTime(frequency, start + index * 0.045);
      gain.gain.setValueAtTime(0.0001, start + index * 0.045);
      gain.gain.exponentialRampToValueAtTime(0.5, start + index * 0.045 + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + index * 0.045 + 1.1);
      oscillator.connect(gain);
      gain.connect(this.master);
      oscillator.start(start + index * 0.045);
      oscillator.stop(start + index * 0.045 + 1.15);
    });
  }

  hover() {
    if (!this.context || !this.master) return;
    const start = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(660, start);
    oscillator.frequency.exponentialRampToValueAtTime(740, start + .09);
    gain.gain.setValueAtTime(.0001, start);
    gain.gain.exponentialRampToValueAtTime(.028, start + .015);
    gain.gain.exponentialRampToValueAtTime(.0001, start + .13);
    oscillator.connect(gain);
    gain.connect(this.master);
    oscillator.start(start);
    oscillator.stop(start + .15);
  }

  progress(finale = false) {
    this.chime(finale ? [392, 523.25, 783.99] : [523.25, 659.25]);
  }
}
export class Soundscape {
  constructor(volume = 0.45) {
    this.volume = volume;
    this.context = null;
    this.master = null;
    this.marketStarted = false;
    this.marketTimer = null;
    this.zone = 'hauptmarkt';
    this.hum = null;
    this.humFilter = null;
    this.humGain = null;
    this.humPanner = null;
    this.ambienceFilter = null;
    this.ambienceGain = null;
    this.ambiencePanner = null;
  }

  activate() {
    if (this.context) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.context = new AudioContext();
    this.master = this.context.createGain();
    this.master.gain.value = this.volume * 0.12;
    this.master.connect(this.context.destination);
  }

  startMarket() {
    if (!this.context || !this.master || this.marketStarted) return;
    this.marketStarted = true;
    const hum = this.context.createOscillator();
    const humGain = this.context.createGain();
    const filter = this.context.createBiquadFilter();
    hum.type = 'sine';
    hum.frequency.value = 98;
    humGain.gain.value = 0.018;
    filter.type = 'lowpass';
    filter.frequency.value = 420;
    const humPanner = this.context.createStereoPanner?.();
    hum.connect(filter);
    if (humPanner) {
      filter.connect(humPanner);
      humPanner.connect(humGain);
    } else filter.connect(humGain);
    humGain.connect(this.master);
    hum.start();
    this.hum = hum;
    this.humFilter = filter;
    this.humGain = humGain;
    this.humPanner = humPanner;
    const noiseBuffer = this.context.createBuffer(1, this.context.sampleRate * 2, this.context.sampleRate);
    const noise = noiseBuffer.getChannelData(0);
    for (let index = 0; index < noise.length; index += 1) noise[index] = (Math.random() * 2 - 1) * .22;
    const ambience = this.context.createBufferSource();
    const ambienceFilter = this.context.createBiquadFilter();
    const ambienceGain = this.context.createGain();
    ambience.buffer = noiseBuffer;
    ambience.loop = true;
    ambienceFilter.type = 'bandpass';
    ambienceFilter.frequency.value = 720;
    ambienceFilter.Q.value = .45;
    ambienceGain.gain.value = .035;
    const ambiencePanner = this.context.createStereoPanner?.();
    ambience.connect(ambienceFilter);
    if (ambiencePanner) {
      ambienceFilter.connect(ambiencePanner);
      ambiencePanner.connect(ambienceGain);
    } else ambienceFilter.connect(ambienceGain);
    ambienceGain.connect(this.master);
    ambience.start();
    this.ambienceFilter = ambienceFilter;
    this.ambienceGain = ambienceGain;
    this.ambiencePanner = ambiencePanner;
    const pluck = () => {
      if (!this.context || !this.master) return;
      const start = this.context.currentTime;
      const notes = this.zone === 'domfreihof'
        ? [261.63, 329.63, 392]
        : this.zone === 'porta'
          ? [196, 293.66, 369.99]
          : this.zone === 'kornmarkt'
            ? [293.66, 349.23, 440]
            : [293.66, 369.99, 440, 587.33];
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.value = notes[Math.floor(Math.random() * notes.length)];
      gain.gain.setValueAtTime(.0001, start);
      gain.gain.exponentialRampToValueAtTime(.15, start + .02);
      gain.gain.exponentialRampToValueAtTime(.0001, start + .82);
      oscillator.connect(gain);
      gain.connect(this.master);
      oscillator.start(start);
      oscillator.stop(start + .85);
    };
    const loop = () => {
      pluck();
      this.marketTimer = window.setTimeout(loop, 2300 + Math.random() * 2600);
    };
    window.setTimeout(loop, 420);
  }

  // Browser-safe procedural placeholders: zones are silent until the first
  // start click, then fade rather than requiring external audio downloads.
  setZone(zone) {
    if (!this.context || !this.master || !zone || zone === this.zone) return;
    this.zone = zone;
    const now = this.context.currentTime;
    const target = this.volume * (zone === 'domfreihof' || zone === 'kornmarkt' ? .085 : zone === 'porta' ? .115 : zone === 'simeonstrasse' || zone === 'christophstrasse' || zone === 'margaretengaesschen' || zone === 'sternstrasse' || zone === 'brotstrasse' || zone === 'fleischstrasse' ? .105 : .12);
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(target, now + .65);
    const profile = {
      hauptmarkt: { hum: 98, humFilter: 440, humGain: .018, ambienceFilter: 760, ambienceGain: .037, pan: -.06 },
      simeonstrasse: { hum: 94, humFilter: 520, humGain: .015, ambienceFilter: 650, ambienceGain: .03, pan: .13 },
      christophstrasse: { hum: 91, humFilter: 500, humGain: .014, ambienceFilter: 600, ambienceGain: .027, pan: .18 },
      margaretengaesschen: { hum: 87, humFilter: 440, humGain: .011, ambienceFilter: 500, ambienceGain: .022, pan: -.18 },
      sternstrasse: { hum: 88, humFilter: 430, humGain: .012, ambienceFilter: 530, ambienceGain: .024, pan: .18 },
      domfreihof: { hum: 78, humFilter: 350, humGain: .009, ambienceFilter: 390, ambienceGain: .016, pan: -.22 },
      brotstrasse: { hum: 92, humFilter: 500, humGain: .014, ambienceFilter: 600, ambienceGain: .028, pan: -.13 },
      fleischstrasse: { hum: 95, humFilter: 510, humGain: .015, ambienceFilter: 625, ambienceGain: .029, pan: .12 },
      kornmarkt: { hum: 84, humFilter: 385, humGain: .011, ambienceFilter: 455, ambienceGain: .021, pan: .04 },
      porta: { hum: 82, humFilter: 390, humGain: .013, ambienceFilter: 500, ambienceGain: .025, pan: -.08 },
    }[zone] || { hum: 98, humFilter: 440, humGain: .018, ambienceFilter: 760, ambienceGain: .037, pan: -.06 };
    this.hum?.frequency.setTargetAtTime(profile.hum, now, .42);
    this.humFilter?.frequency.setTargetAtTime(profile.humFilter, now, .42);
    this.humGain?.gain.setTargetAtTime(profile.humGain, now, .42);
    this.ambienceFilter?.frequency.setTargetAtTime(profile.ambienceFilter, now, .45);
    this.ambienceGain?.gain.setTargetAtTime(profile.ambienceGain, now, .45);
    this.humPanner?.pan.setTargetAtTime(profile.pan * .45, now, .5);
    this.ambiencePanner?.pan.setTargetAtTime(profile.pan, now, .5);
    if (zone === 'domfreihof') this.chime([392, 523.25, 659.25]);
    if (zone === 'porta') this.chime([196, 293.66]);
    if (zone === 'sternstrasse') this.chime([329.63, 392]);
    if (zone === 'brotstrasse' || zone === 'fleischstrasse') this.chime([293.66, 369.99]);
    if (zone === 'kornmarkt') this.chime([261.63, 329.63, 392]);
  }

  chime(tones = [523.25, 659.25]) {
    if (!this.context || !this.master) return;
    const start = this.context.currentTime;
    tones.forEach((frequency, index) => {
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = index === 0 ? 'sine' : 'triangle';
      oscillator.frequency.setValueAtTime(frequency, start + index * 0.045);
      gain.gain.setValueAtTime(0.0001, start + index * 0.045);
      gain.gain.exponentialRampToValueAtTime(0.5, start + index * 0.045 + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + index * 0.045 + 1.1);
      oscillator.connect(gain);
      gain.connect(this.master);
      oscillator.start(start + index * 0.045);
      oscillator.stop(start + index * 0.045 + 1.15);
    });
  }

  hover() {
    if (!this.context || !this.master) return;
    const start = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(660, start);
    oscillator.frequency.exponentialRampToValueAtTime(740, start + .09);
    gain.gain.setValueAtTime(.0001, start);
    gain.gain.exponentialRampToValueAtTime(.028, start + .015);
    gain.gain.exponentialRampToValueAtTime(.0001, start + .13);
    oscillator.connect(gain);
    gain.connect(this.master);
    oscillator.start(start);
    oscillator.stop(start + .15);
  }

  progress(finale = false) {
    this.chime(finale ? [392, 523.25, 783.99] : [523.25, 659.25]);
  }
}
