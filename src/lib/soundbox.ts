// Soundbox audio synthesizer using Web Audio API and SpeechSynthesis

class SoundboxEngine {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('bahikhaata_soundbox_muted');
      this.isMuted = savedMute === 'true';
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('bahikhaata_soundbox_muted', String(muted));
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Plays signature 2-tone pleasant merchant alert chime (like Paytm/PhonePe soundbox)
  public async playChime(): Promise<void> {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // First tone (high E)
      osc.frequency.setValueAtTime(659.25, now);
      // Second tone (higher G#)
      osc.frequency.setValueAtTime(830.61, now + 0.12);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.3, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }

  // Announces transaction confirmation through speech synthesis
  public async speak(text: string, lang: 'hi-IN' | 'en-IN' = 'hi-IN'): Promise<void> {
    if (this.isMuted) return;

    // Play chime first
    await this.playChime();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Small delay to allow chime to ring
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 1.0;
      utterance.pitch = 1.1; // Slightly friendly high pitch

      // Try finding Hindi or Indian English voice
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(
        (v) => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi') || v.lang.includes('IN')
      );
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }

      window.speechSynthesis.speak(utterance);
    }, 280);
  }
}

export const soundbox = new SoundboxEngine();
