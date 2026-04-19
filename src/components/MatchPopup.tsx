"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import type { Partner } from "@/data/partners";

type Props = {
  partner: Partner | null;
  onDismiss: () => void;
};

export function MatchPopup({ partner, onDismiss }: Props) {
  return (
    <AnimatePresence>
      {partner && (
        <motion.div
          key="popup-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--swic-blue)]/30 backdrop-blur-sm p-8"
          onClick={onDismiss}
        >
          <motion.div
            key="popup-card"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            role="dialog"
            aria-live="polite"
            className="relative w-full max-w-2xl rounded-3xl bg-white p-10 shadow-2xl ring-1 ring-[var(--swic-blue)]/15"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onDismiss}
              aria-label="إغلاق"
              className="absolute top-4 start-4 grid h-10 w-10 place-items-center rounded-full bg-[var(--swic-bg)] text-[var(--swic-blue)] transition hover:bg-[var(--swic-blue)] hover:text-white"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <div className="flex flex-col items-center gap-6 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                مطابقة موفقة
              </div>

              <div className="relative h-40 w-full">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  sizes="400px"
                  className="object-contain"
                />
              </div>

              <h2 className="text-3xl font-bold text-[var(--swic-blue)]">
                {partner.name}
              </h2>
              <p className="text-lg leading-relaxed text-slate-700">
                {partner.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
