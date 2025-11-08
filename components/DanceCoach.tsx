"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import AnimatedDancer from "@/components/AnimatedDancer";
import type { AnalysisResult } from "@/components/AudioInput";
import { Choreography, MOVES, createChoreography } from "@/lib/dance/engine";

function useAudioClock(url: string | null) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!url) return;
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => { setIsPlaying(false); setCurrentTime(0); };
    const handler = () => setCurrentTime(audio.currentTime);
    const iv = setInterval(handler, 50);
    audio.play().catch(() => {/* autoplay might be blocked */});
    return () => { clearInterval(iv); audio.pause(); audioRef.current = null; };
  }, [url]);

  return { currentTime, isPlaying };
}

export default function DanceCoach({ result }: { result: AnalysisResult }) {
  const choreo: Choreography = useMemo(() => {
    const minEight = Math.max(4, Math.floor(result.duration / (60 / result.bpm) / 8));
    return createChoreography({ bpm: result.bpm, eightCounts: minEight });
  }, [result]);

  const { currentTime } = useAudioClock(result.audioUrl);
  const [stepIdx, setStepIdx] = useState(0);
  const [voiceOn, setVoiceOn] = useState(true);

  useEffect(() => {
    // find current step by time
    const idx = choreo.steps.findIndex((s, i) => {
      const nextStart = choreo.steps[i + 1]?.startTime ?? Number.POSITIVE_INFINITY;
      return currentTime >= s.startTime && currentTime < nextStart;
    });
    if (idx >= 0) setStepIdx(idx);
  }, [currentTime, choreo]);

  const step = choreo.steps[stepIdx];
  const beatDuration = choreo.beatDuration;

  // Beat counter 1..8 based on current time
  const countInEight = ((Math.floor(currentTime / beatDuration) % 8) + 1) as 1|2|3|4|5|6|7|8;
  const counts = [1,2,3,4,5,6,7,8] as const;

  // Voice coach: announce move on change and count on 1 & 5
  useEffect(() => {
    if (!voiceOn) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const name = MOVES[step?.move ?? 'step-touch'].name;
    const u = new SpeechSynthesisUtterance(name);
    u.rate = 1.05;
    u.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }, [stepIdx, step, voiceOn]);

  useEffect(() => {
    if (!voiceOn) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (countInEight === 1 || countInEight === 5) {
      const u = new SpeechSynthesisUtterance(countInEight === 1 ? 'Five, six, seven, eight' : 'And one');
      u.rate = 1.1;
      u.pitch = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  }, [countInEight, voiceOn]);

  return (
    <div className="card mt-4">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1">
          <AnimatedDancer move={step?.move ?? "step-touch"} beatDuration={beatDuration} />
        </div>
        <div className="flex-1 space-y-3">
          <div className="text-sm text-gray-400">Tempo</div>
          <div className="text-2xl font-extrabold">{Math.round(choreo.bpm)} BPM</div>
          <div className="text-sm text-gray-400 mt-2">Current Move</div>
          <div className="text-xl font-bold">{MOVES[step?.move ?? "step-touch"].name}</div>
          <button className={`button ${voiceOn ? '' : 'secondary'}`} onClick={() => setVoiceOn((v) => !v)}>
            {voiceOn ? 'Mute Voice Coach' : 'Enable Voice Coach'}
          </button>
          <div className="mt-2 flex items-center gap-2">
            {counts.map((c) => (
              <div key={c} className={`w-8 h-8 rounded-full flex items-center justify-center border ${c===countInEight? 'bg-accent/80 text-white border-transparent animate-beat' : 'border-border text-gray-300'}`} style={{ ["--beat-duration" as any]: `${beatDuration*1000}ms` }}>{c}</div>
            ))}
          </div>
          <div className="text-sm text-gray-400 mt-3">Cues</div>
          <ul className="list-disc pl-5 text-gray-200">
            {step?.cues.map((q, i) => <li key={i}>{q}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
