"use client";

import { motion } from "framer-motion";
import { PoweredBy } from "@/components/PoweredBy";

type Props = {
  attempts: number;
  elapsedMs: number;
  onReplay: () => void;
};

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function EndScreen({ attempts, elapsedMs, onReplay }: Props) {
  return (
    <motion.section
      key="end"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-[100svh] flex-col items-center justify-center gap-10 px-8 py-16 text-center"
    >
      <motion.div
        initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
        className="grid h-28 w-28 place-items-center rounded-full bg-[#c3e8f3] text-[#114c85] shadow-xl"
      >
        <svg
          viewBox="0 0 24 24"
          width="48"
          height="48"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12l5 5L20 7" />
        </svg>
      </motion.div>

      <div className="flex flex-col items-center gap-4">
        <h1 className="text-5xl font-extrabold text-[var(--swic-blue)] sm:text-6xl">
          أحسنت!
        </h1>
        <p className="max-w-xl text-xl leading-relaxed text-slate-600">
          اكتشفت شركاء الابتكار في قطاع المياه.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6">
        <Stat label="المحاولات" value={attempts.toString()} />
        <Stat label="الوقت" value={formatTime(elapsedMs)} mono />
      </div>

      <motion.button
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.03 }}
        type="button"
        onClick={onReplay}
        className="rounded-full bg-[#c3e8f3] px-16 py-5 text-2xl font-bold text-[#114c85] shadow-xl transition hover:bg-white"
      >
        إعادة اللعب
      </motion.button>

      <PoweredBy />
    </motion.section>
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
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-white px-8 py-5 shadow-md ring-1 ring-[var(--swic-blue)]/10">
      <span className="text-sm font-medium text-[var(--swic-blue)]/70">
        {label}
      </span>
      <span
        className={`text-3xl font-bold text-[var(--swic-blue)] ${mono ? "tabular-nums" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
