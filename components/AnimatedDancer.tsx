"use client";

import React from "react";
import type { DanceMoveId } from "@/lib/dance/engine";

type Props = {
  move: DanceMoveId;
  beatDuration: number; // seconds per beat
};

export default function AnimatedDancer({ move, beatDuration }: Props) {
  const ms = `${Math.round(beatDuration * 1000)}ms`;
  const cls = moveClass(move);

  return (
    <div className="w-full flex items-center justify-center">
      <div className="relative" style={{ ["--beat" as any]: ms }}>
        <svg width="220" height="260" viewBox="0 0 220 260" className={`drop-shadow-lg ${cls}`}>
          {/* Head */}
          <circle cx="110" cy="40" r="20" fill="#f9e2b3" />
          {/* Body */}
          <line x1="110" y1="60" x2="110" y2="140" stroke="#e5e7eb" strokeWidth="10" strokeLinecap="round" />
          {/* Arms */}
          <line x1="110" y1="80" x2="60" y2="110" stroke="#e5e7eb" strokeWidth="10" strokeLinecap="round" className="arm-left" />
          <line x1="110" y1="80" x2="160" y2="110" stroke="#e5e7eb" strokeWidth="10" strokeLinecap="round" className="arm-right" />
          {/* Legs */}
          <line x1="110" y1="140" x2="80" y2="210" stroke="#e5e7eb" strokeWidth="10" strokeLinecap="round" className="leg-left" />
          <line x1="110" y1="140" x2="140" y2="210" stroke="#e5e7eb" strokeWidth="10" strokeLinecap="round" className="leg-right" />
        </svg>
        <div className="text-center mt-2 text-sm text-gray-300">{label(move)}</div>
      </div>
      <style jsx>{`
        svg { transition: transform 120ms ease; }
        /* shared tempo variable */
        :root { --beat: ${ms}; }

        /* basic groove sway */
        .move-step-touch { animation: sway var(--beat) ease-in-out infinite; }
        @keyframes sway { 0%, 100% { transform: translateX(-8px) } 50% { transform: translateX(8px) } }

        /* grapevine lateral travel over 8 counts */
        .move-grapevine { animation: grape var(calc(var(--beat) * 8)) steps(4, end) infinite; }
        @keyframes grape { 0% { transform: translateX(0) } 25% { transform: translateX(20px) } 50% { transform: translateX(0) } 75% { transform: translateX(-20px) } 100% { transform: translateX(0) } }

        /* body roll: vertical wave on torso */
        .move-body-roll { animation: bodyroll var(calc(var(--beat) * 4)) ease-in-out infinite; }
        @keyframes bodyroll { 0% { transform: translateY(0) } 25% { transform: translateY(4px) } 50% { transform: translateY(0) } 75% { transform: translateY(-4px) } 100% { transform: translateY(0) } }

        /* arm wave */
        .arm-left, .arm-right { transform-origin: 110px 80px; }
        .move-wave .arm-left { animation: waveLeft var(calc(var(--beat) * 2)) ease-in-out infinite; }
        .move-wave .arm-right { animation: waveRight var(calc(var(--beat) * 2)) ease-in-out infinite; }
        @keyframes waveLeft { 0%, 100% { transform: rotate(0deg) } 50% { transform: rotate(-20deg) } }
        @keyframes waveRight { 0%, 100% { transform: rotate(0deg) } 50% { transform: rotate(20deg) } }

        /* spin */
        .move-spin { animation: spin var(calc(var(--beat) * 4)) linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }

        /* kick ball change: quick leg kicks */
        .leg-left, .leg-right { transform-origin: 110px 140px; }
        .move-kick-ball-change .leg-left { animation: kickL var(calc(var(--beat) * 2)) steps(2, end) infinite; }
        .move-kick-ball-change .leg-right { animation: kickR var(calc(var(--beat) * 2)) steps(2, end) infinite; }
        @keyframes kickL { 0% { transform: rotate(0) } 50% { transform: rotate(-18deg) } 100% { transform: rotate(0) } }
        @keyframes kickR { 0% { transform: rotate(0) } 50% { transform: rotate(18deg) } 100% { transform: rotate(0) } }

        /* slide */
        .move-slide { animation: slide var(calc(var(--beat) * 4)) ease-in-out infinite; }
        @keyframes slide { 0%, 100% { transform: translateX(-10px) } 50% { transform: translateX(10px) } }

        /* heel toe: feet twist */
        .move-heel-toe .leg-left { animation: twistL var(calc(var(--beat) * 2)) steps(2,end) infinite; }
        .move-heel-toe .leg-right { animation: twistR var(calc(var(--beat) * 2)) steps(2,end) infinite; }
        @keyframes twistL { 0% { transform: rotate(0) } 50% { transform: rotate(-12deg) } 100% { transform: rotate(0) } }
        @keyframes twistR { 0% { transform: rotate(0) } 50% { transform: rotate(12deg) } 100% { transform: rotate(0) } }

        /* box step: subtle square path */
        .move-box-step { animation: box var(calc(var(--beat) * 8)) steps(4,end) infinite; }
        @keyframes box { 0% { transform: translate(0, 0) } 25% { transform: translate(6px, 4px) } 50% { transform: translate(0, 8px) } 75% { transform: translate(-6px, 4px) } 100% { transform: translate(0, 0) } }
      `}</style>
    </div>
  );
}

function moveClass(move: DanceMoveId): string {
  switch (move) {
    case "step-touch":
      return "move-step-touch";
    case "grapevine":
      return "move-grapevine";
    case "body-roll":
      return "move-body-roll";
    case "wave":
      return "move-wave";
    case "spin":
      return "move-spin";
    case "kick-ball-change":
      return "move-kick-ball-change";
    case "slide":
      return "move-slide";
    case "heel-toe":
      return "move-heel-toe";
    case "box-step":
      return "move-box-step";
  }
}

function label(move: DanceMoveId): string {
  return move
    .replace(/-/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}
