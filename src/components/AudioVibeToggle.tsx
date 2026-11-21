import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export function AudioVibeToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);

  const stopAudio = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (gainNodeRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      gainNodeRef.current.gain.cancelScheduledValues(now);
      gainNodeRef.current.gain.linearRampToValueAtTime(0.001, now + 0.4);
      setTimeout(() => {
        try {
          audioCtxRef.current?.close();
        } catch {
          // Ignore
        }
        audioCtxRef.current = null;
        gainNodeRef.current = null;
      }, 450);
    }
    setIsPlaying(false);
  };

  const startAudio = async () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Master gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 1.2);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Warm low-pass filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(540, ctx.currentTime);
      filter.connect(masterGain);

      // Chords (frequencies for Dm9 / Fmaj9 vibe)
      const chordNotes = [146.83, 174.61, 220.0, 261.63, 329.63]; // D3, F3, A3, C4, E4

      chordNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Gentle chorus detune
        osc.detune.setValueAtTime((idx - 2) * 5, ctx.currentTime);

        oscGain.gain.setValueAtTime(0.18 / chordNotes.length, ctx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(filter);

        osc.start();
      });

      // Subtle heartbeat pulse every 1.5s
      const pulseKick = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        const now = ctx.currentTime;
        const kickOsc = ctx.createOscillator();
        const kickGain = ctx.createGain();

        kickOsc.frequency.setValueAtTime(80, now);
        kickOsc.frequency.exponentialRampToValueAtTime(32, now + 0.15);

        kickGain.gain.setValueAtTime(0.25, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        kickOsc.connect(kickGain);
        kickGain.connect(masterGain);

        kickOsc.start(now);
        kickOsc.stop(now + 0.22);
      };

      pulseKick();
      timerRef.current = window.setInterval(pulseKick, 1400);

      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <button
      type="button"
      onClick={toggleSound}
      title={isPlaying ? 'Mute ambient fest audio vibe' : 'Play ambient fest audio vibe'}
      aria-label={isPlaying ? 'Mute ambient fest audio vibe' : 'Play ambient fest audio vibe'}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
        isPlaying
          ? 'bg-[#F5A623]/20 border-[#F5A623]/60 text-[#F5A623] shadow-[0_0_15px_rgba(245,166,35,0.25)]'
          : 'bg-white/[0.04] border-white/10 text-zinc-400 hover:text-white hover:border-white/25'
      }`}
    >
      {/* Animated Sound Equalizer Bars */}
      <span className="flex items-end gap-0.5 h-3.5 w-3.5" aria-hidden="true">
        <span
          className={`w-0.5 bg-current rounded-full transition-all ${
            isPlaying ? 'animate-[bounce_0.8s_ease-in-out_infinite] h-3' : 'h-1'
          }`}
        />
        <span
          className={`w-0.5 bg-current rounded-full transition-all ${
            isPlaying
              ? 'animate-[bounce_0.6s_ease-in-out_infinite_0.2s] h-3.5'
              : 'h-2'
          }`}
        />
        <span
          className={`w-0.5 bg-current rounded-full transition-all ${
            isPlaying
              ? 'animate-[bounce_0.75s_ease-in-out_infinite_0.4s] h-2.5'
              : 'h-1.5'
          }`}
        />
      </span>

      <span className="hidden sm:inline font-mono">
        {isPlaying ? 'Party Vibe ON' : 'Party Vibe'}
      </span>

      {isPlaying ? (
        <Volume2 className="w-3.5 h-3.5 text-[#F5A623]" aria-hidden="true" />
      ) : (
        <VolumeX className="w-3.5 h-3.5 text-zinc-500" aria-hidden="true" />
      )}
    </button>
  );
}
