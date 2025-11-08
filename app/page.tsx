"use client";

import React, { useState } from "react";
import AudioInput, { AnalysisResult } from "@/components/AudioInput";
import DanceCoach from "@/components/DanceCoach";

export default function HomePage() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  return (
    <main className="container">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold">AI Dance Coach</h1>
        <p className="text-gray-300 mt-1">I analyze your music and teach a beat-synced routine.</p>
      </header>
      <AudioInput onAnalyzed={setAnalysis} />
      {analysis && <DanceCoach result={analysis} />}
    </main>
  );
}
