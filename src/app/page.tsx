"use client";

import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { GameBoard } from "@/components/GameBoard";
import { StartScreen } from "@/components/StartScreen";
import { WaterWaveTransition } from "@/components/WaterWaveTransition";
import { useGame } from "@/hooks/useGame";

export default function Home() {
  const game = useGame();
  const [waveActive, setWaveActive] = useState(false);

  const handleStart = useCallback(() => {
    if (waveActive) return;
    setWaveActive(true);
  }, [waveActive]);

  const handleCovered = useCallback(() => {
    game.start();
  }, [game]);

  const handleDone = useCallback(() => {
    setWaveActive(false);
  }, []);

  return (
    <main className="relative flex flex-1 flex-col bg-[var(--swic-bg)]">
      <AnimatePresence mode="wait">
        {game.phase === "start" ? (
          <StartScreen key="start" onStart={handleStart} />
        ) : (
          <GameBoard key="board" game={game} />
        )}
      </AnimatePresence>

      <WaterWaveTransition
        active={waveActive}
        onCovered={handleCovered}
        onDone={handleDone}
      />
    </main>
  );
}
