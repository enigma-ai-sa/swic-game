"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Stage = "idle" | "pour" | "hold" | "retreat";

type Props = {
  active: boolean;
  onCovered: () => void;
  onDone: () => void;
};

const POUR_DURATION = 0.7;
const RETREAT_DURATION = 0.7;
const HOLD_MS = 300;
const LAYER_STAGGER = 0.08;

const LAYERS = [
  {
    fill: "var(--swic-blue)",
    opacity: 1,
    path: "M0,80 C180,20 360,140 720,70 C1080,10 1260,130 1440,60 L1440,1200 L0,1200 Z",
    sway: [0, 20, -14, 0],
  },
  {
    fill: "var(--swic-blue-light)",
    opacity: 0.85,
    path: "M0,60 C220,130 420,20 720,90 C1020,150 1240,30 1440,100 L1440,1200 L0,1200 Z",
    sway: [0, -18, 22, 0],
  },
  {
    fill: "#ffffff",
    opacity: 0.18,
    path: "M0,100 C160,40 380,120 720,60 C1060,10 1280,110 1440,50 L1440,1200 L0,1200 Z",
    sway: [0, 14, -10, 0],
  },
] as const;

export function WaterWaveTransition({ active, onCovered, onDone }: Props) {
  const [stage, setStage] = useState<Stage>("idle");
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (active && stage === "idle") {
      setStage("pour");
    }
  }, [active, stage]);

  useEffect(() => {
    return () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
    };
  }, []);

  if (stage === "idle") return null;

  const frontIndex = LAYERS.length - 1;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {LAYERS.map((layer, i) => {
        const isFront = i === frontIndex;
        const pourDelay = i * LAYER_STAGGER;
        const retreatDelay = (frontIndex - i) * LAYER_STAGGER;

        const targetY =
          stage === "pour" || stage === "hold" ? "0%" : "110%";

        const transition =
          stage === "retreat"
            ? { duration: RETREAT_DURATION, ease: [0.65, 0, 0.35, 1] as const, delay: retreatDelay }
            : { duration: POUR_DURATION, ease: [0.65, 0, 0.35, 1] as const, delay: pourDelay };

        return (
          <motion.div
            key={i}
            className="absolute inset-x-0 top-0 h-[120%] will-change-transform"
            initial={{ y: "-110%" }}
            animate={{ y: targetY }}
            transition={transition}
            onAnimationComplete={() => {
              if (!isFront) return;
              if (stage === "pour") {
                onCovered();
                setStage("hold");
                holdTimer.current = setTimeout(() => {
                  setStage("retreat");
                }, HOLD_MS);
              } else if (stage === "retreat") {
                setStage("idle");
                onDone();
              }
            }}
          >
            <motion.div
              className="absolute inset-0"
              animate={
                stage === "pour" || stage === "hold"
                  ? { x: [...layer.sway] }
                  : { x: 0 }
              }
              transition={
                stage === "pour" || stage === "hold"
                  ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.3 }
              }
            >
              <svg
                viewBox="0 0 1440 1200"
                preserveAspectRatio="none"
                className="h-full w-full"
              >
                <path d={layer.path} fill={layer.fill} opacity={layer.opacity} />
              </svg>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
