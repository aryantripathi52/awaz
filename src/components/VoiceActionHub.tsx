'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Square, Loader2, Sparkles, Volume2 } from 'lucide-react';
import { soundbox } from '@/lib/soundbox';
import { VoiceProcessResult } from '@/types/ledger';

interface VoiceActionHubProps {
  onVoiceProcessed: (result: VoiceProcessResult) => void;
  language: 'hinglish' | 'hindi' | 'english';
  sunlightMode: boolean;
}

export function VoiceActionHub({
  onVoiceProcessed,
  language,
  sunlightMode,
}: VoiceActionHubProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [lastAnnouncement, setLastAnnouncement] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const speechRecognitionRef = useRef<any>(null);

  // Suggested quick test prompts
  const sampleVoicePrompts = [
    '2 chai bechi 20 rupaye ki, aur 4th street wale Ramesh ka 40 rupaye udhaar likh lo',
    'Sharma ji ko 150 ka udhaar diya',
    'Pappu ne 80 rupaye jama kar diye',
    'Subah ki 70 rupaye ki samosa aur bidi cash bika',
  ];

  // Visualizer drawing loop
  const drawVisualizer = useCallback(() => {
    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;

    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = 4;
    const gap = 3;
    const totalBars = Math.floor(canvas.width / (barWidth + gap));
    const step = Math.floor(dataArray.length / totalBars);

    for (let i = 0; i < totalBars; i++) {
      const value = dataArray[i * step] || 0;
      const percent = value / 255;
      const barHeight = Math.max(4, percent * canvas.height * 0.9);
      const x = i * (barWidth + gap);
      const y = (canvas.height - barHeight) / 2;

      // Vivid neon cyan to emerald gradient
      const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
      grad.addColorStop(0, '#06B6D4');
      grad.addColorStop(1, '#10B981');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 2);
      ctx.fill();
    }

    animationFrameRef.current = requestAnimationFrame(drawVisualizer);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Send audio/text to processing engine
  const processInput = async (audioBlob?: Blob, fallbackText?: string) => {
    setIsProcessing(true);
    setLiveTranscript(fallbackText ? `"${fallbackText}"` : 'ऑडियो प्रोसेस हो रहा है...');

    try {
      let result: VoiceProcessResult;

      if (audioBlob && audioBlob.size > 0) {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'voice.webm');
        if (fallbackText) {
          formData.append('transcript', fallbackText);
        }

        const res = await fetch('/api/voice-process', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          throw new Error('Server returned an error');
        }
        result = await res.json();
      } else {
        // Send transcript JSON directly
        const res = await fetch('/api/voice-process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript: fallbackText }),
        });
        result = await res.json();
      }

      if (result.success && result.actions.length > 0) {
        setLastAnnouncement(result.soundboxMessage);
        onVoiceProcessed(result);
        // Play Soundbox Chime & Voice Confirmation
        soundbox.speak(result.soundboxMessage, 'hi-IN');
      } else {
        soundbox.speak('समझ नहीं आया, कृपया फिर से बोलें।', 'hi-IN');
      }
    } catch (err) {
      console.error('Failed to process voice:', err);
      // Client-side fallback if network failed
      if (fallbackText) {
        const { parseVoiceIntentLocally } = await import('@/lib/parser');
        const fallbackResult = parseVoiceIntentLocally(fallbackText);
        onVoiceProcessed(fallbackResult);
        soundbox.speak(fallbackResult.soundboxMessage, 'hi-IN');
      }
    } finally {
      setIsProcessing(false);
      setLiveTranscript('');
      setRecordDuration(0);
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      // Setup Web Audio Analyser
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

      // Start Visualizer
      drawVisualizer();

      // Start MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : '';

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeType || 'audio/webm',
        });
        stream.getTracks().forEach((track) => track.stop());
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

        // Process audio
        await processInput(audioBlob, liveTranscript);
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setLiveTranscript('सुन रहा हूँ... बोलिए (Listening...)');

      // Start duration timer
      setRecordDuration(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);

      // Setup Web Speech API live listener if available (for zero-latency preview)
      const SpeechRecognition =
        (window as unknown as { SpeechRecognition: unknown }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition: unknown }).webkitSpeechRecognition;

      if (SpeechRecognition) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const recognition = new (SpeechRecognition as any)();
        recognition.lang = 'hi-IN';
        recognition.continuous = true;
        recognition.interimResults = true;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          let interimText = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            interimText += event.results[i][0].transcript;
          }
          if (interimText) {
            setLiveTranscript(interimText);
          }
        };

        recognition.onerror = () => {};
        recognition.start();
        speechRecognitionRef.current = recognition;
      }
    } catch (err) {
      console.error('Microphone access denied or unsupported:', err);
      alert('Microphone permission required. Or click any sample voice chip below to test instantly!');
      setIsRecording(false);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleMicClick = () => {
    if (isProcessing) return;
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatSeconds = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pt-6 pb-4 px-3 sm:px-4 pointer-events-none">
      <div className="max-w-2xl mx-auto flex flex-col items-center pointer-events-auto">
        {/* Sample Voice Quick Chips */}
        {!isRecording && !isProcessing && (
          <div className="w-full mb-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              बोल कर देखें:
            </span>
            {sampleVoicePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => processInput(undefined, prompt)}
                className="flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 border border-slate-700/80 hover:border-emerald-500/50 transition-all shadow-sm active:scale-95 text-left"
              >
                &ldquo;{prompt.length > 36 ? prompt.slice(0, 36) + '...' : prompt}&rdquo;
              </button>
            ))}
          </div>
        )}

        {/* Live Audio Transcript or Announcement Banner */}
        {(liveTranscript || lastAnnouncement) && (
          <div className="mb-2 max-w-md w-full text-center px-4 py-1.5 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-lg text-xs font-medium text-emerald-300 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            {isRecording ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                {liveTranscript}
              </span>
            ) : isProcessing ? (
              <span className="flex items-center gap-2 text-cyan-300">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                AI हिसाब का विश्लेषण कर रहा है...
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-slate-300">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                {lastAnnouncement}
              </span>
            )}
          </div>
        )}

        {/* Giant Microphone Hub */}
        <div className="relative flex flex-col items-center">
          {/* Visualizer Canvas when recording */}
          {isRecording && (
            <div className="absolute -top-12 w-48 h-8 flex items-center justify-center">
              <canvas ref={canvasRef} width={180} height={32} className="w-full h-full" />
            </div>
          )}

          {/* Glowing pulse rings when active */}
          {isRecording && (
            <>
              <div className="absolute inset-0 rounded-full bg-rose-500/30 animate-ping duration-1000"></div>
              <div className="absolute -inset-2 rounded-full bg-rose-500/20 blur-md"></div>
            </>
          )}

          {isProcessing && (
            <div className="absolute -inset-2 rounded-full bg-cyan-500/30 animate-pulse blur-md"></div>
          )}

          {/* The Giant Button */}
          <button
            onClick={handleMicClick}
            disabled={isProcessing}
            aria-label="Voice Record Trigger"
            className={`relative z-10 w-18 h-18 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 active:scale-90 ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/50 scale-105'
                : isProcessing
                ? 'bg-cyan-600 text-white shadow-cyan-600/50 cursor-wait'
                : sunlightMode
                ? 'bg-emerald-400 hover:bg-emerald-300 text-black shadow-emerald-400/50'
                : 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 shadow-emerald-500/40'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : isRecording ? (
              <>
                <Square className="w-7 h-7 fill-white" />
                <span className="text-[10px] font-black tracking-widest uppercase mt-0.5">
                  {formatSeconds(recordDuration)}
                </span>
              </>
            ) : (
              <>
                <Mic className="w-8 h-8 text-slate-950 stroke-[2.5]" />
                <span className="text-[9px] font-black tracking-wider uppercase mt-0.5 text-slate-950">
                  {language === 'hindi' ? 'बोलिए' : 'Speak'}
                </span>
              </>
            )}
          </button>

          {/* Subtext instruction */}
          <p className="text-[11px] font-semibold text-slate-400 mt-1.5 tracking-wide">
            {isRecording
              ? 'पूरा होने पर दबाएं (Tap to Stop)'
              : isProcessing
              ? 'हिसाब तैयार हो रहा है...'
              : language === 'hindi'
              ? 'बटन दबाकर बोलें • जैसे: "2 चाय 20 नकद, रमेश 40 उधार"'
              : 'Tap & Speak • e.g. "2 chai 20 cash, Ramesh 40 udhaar"'}
          </p>
        </div>
      </div>
    </div>
  );
}
