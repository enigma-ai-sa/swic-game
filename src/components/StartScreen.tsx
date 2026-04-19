"use client";

import { motion } from "framer-motion";
import { PoweredBy } from "@/components/PoweredBy";

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
        <motion.img
          src="/waterDroplet.png"
          alt=""
          aria-hidden="true"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 180 }}
          className="h-32 w-32 object-contain"
        />

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
        className="w-full max-w-3xl rounded-full bg-[#7dd3fc] pt-5 pb-4 text-2xl font-bold text-[#0c4a6e] shadow-xl transition hover:bg-[#bae6fd]"
      >
        ابدأ
      </motion.button>

      <div className="mt-10">
        <PoweredBy />
      </div>
    </motion.section>
  );
}
