"use client";

import { useEffect, useMemo, useState } from "react";

type TrueFocusProps = {
  sentence: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
};

export default function TrueFocus({
  sentence,
  manualMode = false,
  blurAmount = 5,
  borderColor = "#C0C0C0",
  animationDuration = 2,
  pauseBetweenAnimations = 1,
}: TrueFocusProps) {
  const letters = useMemo(() => sentence.split(""), [sentence]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (manualMode) return;
    let active = true;
    const step = () => {
      if (!active) return;
      setIdx((i) => (i + 1) % Math.max(letters.length, 1));
      const delay = (animationDuration * 1000) / Math.max(letters.length, 1);
      setTimeout(step, delay + pauseBetweenAnimations * 10);
    };
    const t = setTimeout(step, 200);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [manualMode, letters.length, animationDuration, pauseBetweenAnimations]);

  return (
    <div className="relative inline-block">
      <div className="text-5xl md:text-7xl font-extrabold tracking-tight select-none">
        {letters.map((ch, i) => (
          <span
            key={i}
            className="inline-block transition"
            style={{
              color: i === idx ? "#ffffff" : "#C0C0C0",
              filter: i === idx ? "none" : `blur(${blurAmount}px)`,
            }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-0 rounded-md"
        style={{
          boxShadow: `0 0 0 2px ${borderColor}`,
        }}
      />
    </div>
  );
}


