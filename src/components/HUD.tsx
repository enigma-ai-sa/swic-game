"use client";

import { useEffect, useState } from "react";

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

type Props = {
  attempts: number;
  elapsedMs: number;
  matchedCount: number;
  totalPairs: number;
};

export function HUD({ attempts, elapsedMs, matchedCount, totalPairs }: Props) {
  // Display current elapsed live even when parent samples at 250ms.
  const [now, setNow] = useState(elapsedMs);
  useEffect(() => {
    setNow(elapsedMs);
  }, [elapsedMs]);

  return (
    <div className="flex w-full items-center justify-between gap-4 rounded-3xl bg-white/80 px-6 py-4 shadow-md ring-1 ring-[var(--swic-blue)]/10 backdrop-blur">
      <Stat label="المحاولات" value={attempts.toString()} />
      <Stat label="المطابقات" value={`${matchedCount} / ${totalPairs}`} />
      <Stat label="الوقت" value={formatTime(now)} mono />
    </div>
  );
}

function Stat({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="text-sm font-medium text-[var(--swic-blue)]/70">
        {label}
      </span>
      <span
        className={`text-2xl font-bold text-[var(--swic-blue)] ${mono ? "tabular-nums" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
