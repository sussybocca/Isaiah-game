/** Small, original Web Audio sound design. Not a clone of the user's actual voice. */
export class SoundEngine {
  private ctx: AudioContext | null = null;
  private humOsc: OscillatorNode | null = null;
  private humGain: GainNode | null = null;
  private lastFootstep = 0;
  private enabled = true;
  start() {
    if (!this.ctx) this.ctx = new AudioContext();
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    if (this.humOsc) return;
    const osc = this.ctx.createOscillator(); const g = this.ctx.createGain();
    osc.type = 'sine'; osc.frequency.value = 49; g.gain.value = .018;
    osc.connect(g).connect(this.ctx.destination); osc.start(); this.humOsc = osc; this.humGain = g;
  }
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (this.humGain && this.ctx) this.humGain.gain.setTargetAtTime(enabled ? .018 : 0, this.ctx.currentTime, .09);
  }
  private tone(freq: number, endFreq: number, seconds: number, volume: number, type: OscillatorType = 'sine') {
    if (!this.ctx || !this.enabled) return;
    const t = this.ctx.currentTime, o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), t + seconds);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+.015);
    g.gain.exponentialRampToValueAtTime(.0001,t+seconds);
    o.connect(g).connect(this.ctx.destination);o.start(t);o.stop(t+seconds+.02);
  }
  pickup() { this.tone(460,860,.31,.075,'triangle'); this.tone(690,1040,.38,.026); }
  click() { this.tone(140,78,.13,.07,'triangle'); }
  horror() { this.tone(160,42,.95,.14,'sawtooth');this.tone(72,35,1.1,.12); }
  win() { [420,530,640,840].forEach((f,i)=>setTimeout(()=>this.tone(f,f*1.03,.48,.07,'sine'),i*140)); }
  step(running=false) {
    const now=performance.now();if(now-this.lastFootstep<(running?250:410))return;this.lastFootstep=now;
    this.tone(running?92:75,34,.11,running?.058:.04,'triangle');
  }
  /** A gentle breath/grunt-like timbre made from resonant oscillators. No biometric voice imitation. */
  grunt() {
    if (!this.ctx || !this.enabled) return;
    const ctx=this.ctx,t=ctx.currentTime;
    const fundamental=145, output=ctx.createGain(),low=ctx.createBiquadFilter();
    low.type='lowpass';low.frequency.value=690;low.Q.value=.8;
    output.gain.setValueAtTime(.0001,t);output.gain.linearRampToValueAtTime(.08,t+.055);
    output.gain.exponentialRampToValueAtTime(.0001,t+.32);low.connect(output).connect(ctx.destination);
    for(let h=1;h<=5;h++){
      const osc=ctx.createOscillator();const gain=ctx.createGain();osc.type='sawtooth';
      osc.frequency.setValueAtTime(fundamental*h,t);osc.frequency.exponentialRampToValueAtTime((fundamental-32)*h,t+.28);
      gain.gain.value=1/(h*h*1.6);osc.connect(gain).connect(low);osc.start(t);osc.stop(t+.34);
    }
  }
  dispose(){this.humOsc?.stop();this.humOsc?.disconnect();this.humGain?.disconnect();this.humOsc=null;this.humGain=null;void this.ctx?.close();this.ctx=null;}
}
