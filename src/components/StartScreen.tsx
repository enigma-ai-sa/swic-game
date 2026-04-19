"use client";

import { motion } from "framer-motion";

type Props = {
  onStart: () => void;
};

export function StartScreen({ onStart }: Props) {
  return (
    <motion.section
      key="start"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="flex min-h-[100svh] flex-col items-center px-8 py-16 text-center"
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 180 }}
          className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--swic-blue)] to-[var(--swic-blue-light)] shadow-xl"
        >
          <svg
            viewBox="0 0 100 100"
            className="h-16 w-16 text-white"
            aria-hidden="true"
          >
            <path
              d="M50 10 C 70 35, 82 55, 82 70 a32 32 0 1 1 -64 0 C 18 55, 30 35, 50 10 Z"
              fill="currentColor"
            />
          </svg>
        </motion.div>

        <div className="flex flex-col items-center gap-4">
          <h1 className="text-5xl font-extrabold leading-tight text-[var(--swic-blue)] sm:text-6xl">
            ذاكرة الابتكار
          </h1>
          <p className="max-w-xl text-xl leading-relaxed text-slate-600">
            طابق بين الشعارات لاكتشاف شركاء الابتكار في قطاع المياه.
          </p>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={onStart}
        className="w-full max-w-3xl rounded-full bg-[#7dd3fc] py-6 text-3xl font-bold text-[#0c4a6e] shadow-xl transition hover:bg-[#bae6fd]"
      >
        ابدأ
      </motion.button>
    </motion.section>
  );
}
