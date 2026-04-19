"use client";

import { AnimatePresence } from "framer-motion";
import { GameBoard } from "@/components/GameBoard";
import { StartScreen } from "@/components/StartScreen";
import { useGame } from "@/hooks/useGame";

export default function Home() {
  const game = useGame();

  return (
    <main className="relative flex flex-1 flex-col bg-[var(--swic-bg)]">
      <AnimatePresence mode="wait">
        {game.phase === "start" ? (
          <StartScreen key="start" onStart={game.start} />
        ) : (
          <GameBoard key="board" game={game} />
        )}
      </AnimatePresence>
    </main>
  );
}
