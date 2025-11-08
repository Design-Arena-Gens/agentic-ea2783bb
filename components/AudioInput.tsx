"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { analyzeFile, analyzeMic } from "@/lib/audio/analyzer";

export type AnalysisResult = {
  bpm: number;
  duration: number;
  audioUrl: string;
};

type Props = {
  onAnalyzed(result: AnalysisResult): void;
};

export default function AudioInput({ onAnalyzed }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(() => () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
  }, []);

  const onFile = useCallback(async (file: File) => {
    setBusy(true); setError(null);
    try {
      const { bpm, duration } = await analyzeFile(file);
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const url = URL.createObjectURL(file);
      urlRef.current = url;
      onAnalyzed({ bpm, duration, audioUrl: url });
    } catch (e: any) {
      setError(e?.message || "Failed to analyze file");
    } finally { setBusy(false); }
  }, [onAnalyzed]);

  const onMic = useCallback(async () => {
    setBusy(true); setError(null);
    try {
      const { bpm, duration } = await analyzeMic(10000);
      // analyzeMic used MediaRecorder internally; we need to get the blob again for playback
      // For simplicity, ask user to re-record for playback if needed; alternatively, record separately here
      // We'll re-run a short record now for playback URL
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks: Blob[] = [];
      const rec = new MediaRecorder(stream, { mimeType: "audio/webm" });
      const done = new Promise<void>((resolve) => { rec.onstop = () => resolve(); });
      rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
      rec.start();
      await new Promise((r) => setTimeout(r, Math.min(5000, duration * 1000)));
      rec.stop();
      await done;
      stream.getTracks().forEach((t) => t.stop());
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const blob = new Blob(chunks, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      onAnalyzed({ bpm, duration, audioUrl: url });
    } catch (e: any) {
      setError(e?.message || "Failed to analyze microphone");
    } finally { setBusy(false); }
  }, [onAnalyzed]);

  return (
    <div className="card">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="text-lg font-bold">Choose your music</div>
          <div className="text-sm text-gray-400">Upload a track or capture from mic</div>
        </div>
        <div className="flex items-center gap-2">
          <label className="button cursor-pointer">
            <input type="file" accept="audio/*" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }} />
            Upload song
          </label>
          <button className="button secondary" onClick={onMic}>Use microphone</button>
        </div>
      </div>
      {busy && <div className="mt-3 text-sm text-gray-300">Analyzing? This can take a few seconds.</div>}
      {error && <div className="mt-3 text-sm text-red-400">{error}</div>}
    </div>
  );
}
