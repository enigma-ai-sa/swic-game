"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/Card";
import { EndScreen } from "@/components/EndScreen";
import { HUD } from "@/components/HUD";
import { MatchPopup } from "@/components/MatchPopup";
import { PoweredBy } from "@/components/PoweredBy";
import type { UseGameReturn } from "@/hooks/useGame";

type Props = {
  game: UseGameReturn;
};

export function GameBoard({ game }: Props) {
  if (game.phase === "won") {
    return (
      <EndScreen
        attempts={game.attempts}
        elapsedMs={game.elapsedMs}
        onReplay={game.replay}
      />
    );
  }

  return (
    <motion.section
      key="board"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
      className="flex min-h-[100svh] flex-col gap-6 px-5 py-6 sm:px-8 sm:py-8"
    >
      <header className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-extrabold text-[var(--swic-blue)] sm:text-4xl">
          ذاكرة الابتكار
        </h1>
        <HUD
          attempts={game.attempts}
          elapsedMs={game.elapsedMs}
          matchedCount={game.matchedCount}
          totalPairs={game.totalPairs}
        />
      </header>

      <div className="mx-auto grid w-full max-w-3xl flex-1 grid-cols-4 content-center gap-3 sm:gap-5">
        {game.deck.map((card, index) => {
          const partner = game.getPartner(card.partnerId);
          const isFlipped = game.flippedIndices.includes(index);
          const isMatched = game.matchedInstanceIds.has(card.instanceId);
          return (
            <Card
              key={card.instanceId}
              partner={partner}
              isFlipped={isFlipped}
              isMatched={isMatched}
              disabled={game.locked || !!game.activePopup || isMatched}
              onTap={() => game.flipCard(index)}
            />
          );
        })}
      </div>

      <PoweredBy />

      <MatchPopup partner={game.activePopup} onDismiss={game.dismissPopup} />
    </motion.section>
  );
}
