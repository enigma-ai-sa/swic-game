"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Partner } from "@/data/partners";

type Props = {
  partner: Partner | undefined;
  isFlipped: boolean;
  isMatched: boolean;
  disabled: boolean;
  onTap: () => void;
};

export function Card({
  partner,
  isFlipped,
  isMatched,
  disabled,
  onTap,
}: Props) {
  const showFace = isFlipped || isMatched;

  return (
    <button
      type="button"
      onClick={onTap}
      disabled={disabled}
      aria-label={showFace && partner ? partner.name : "بطاقة مقلوبة"}
      className="group relative aspect-square w-full [perspective:1200px] select-none outline-none"
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: showFace ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Back face */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-3xl bg-gradient-to-br from-[#c3e8f3] to-[#1e6ab4] shadow-lg ring-1 ring-white/40 flex items-center justify-center overflow-hidden">
          <div className="absolute -inset-4 opacity-20 bg-[radial-gradient(circle_at_30%_20%,#ffffff_0%,transparent_45%)]" />
          <img
            src="/waterDroplet.png"
            alt=""
            aria-hidden="true"
            className="h-[55%] w-[55%] object-contain"
          />
        </div>

        {/* Front face */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl bg-white shadow-lg ring-1 ring-[var(--swic-blue)]/10 flex items-center justify-center p-3 sm:p-4">
          {partner && (
            <div className="relative h-full w-full">
              <Image
                src={partner.logo}
                alt={partner.name}
                fill
                sizes="(max-width: 768px) 22vw, 180px"
                className="object-contain"
                priority={false}
              />
            </div>
          )}
          {isMatched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pointer-events-none absolute inset-0 rounded-3xl ring-4 ring-[var(--swic-blue-light)]/80"
            />
          )}
        </div>
      </motion.div>
    </button>
  );
}
