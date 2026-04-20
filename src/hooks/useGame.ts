"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PAIRS_PER_GAME, type Partner, partners } from "@/data/partners";
import { playMatchChime } from "@/lib/matchSound";
import { shuffle } from "@/lib/shuffle";

export type DeckCard = {
  instanceId: string;
  partnerId: string;
};

export type GamePhase = "start" | "playing" | "won";

type BuildDeckOptions = {
  pairs?: number;
};

function buildDeck({ pairs = PAIRS_PER_GAME }: BuildDeckOptions = {}): {
  deck: DeckCard[];
  activePartners: Partner[];
} {
  const activePartners = partners.slice(0, pairs);
  const doubled: DeckCard[] = activePartners.flatMap((p, idx) => [
    { instanceId: `${p.id}-a-${idx}`, partnerId: p.id },
    { instanceId: `${p.id}-b-${idx}`, partnerId: p.id },
  ]);
  return { deck: shuffle(doubled), activePartners };
}

export type UseGameReturn = {
  phase: GamePhase;
  deck: DeckCard[];
  flippedIndices: number[];
  matchedInstanceIds: Set<string>;
  attempts: number;
  elapsedMs: number;
  locked: boolean;
  activePopup: Partner | null;
  totalPairs: number;
  matchedCount: number;
  start: () => void;
  replay: () => void;
  flipCard: (index: number) => void;
  dismissPopup: () => void;
  getPartner: (partnerId: string) => Partner | undefined;
};

const POPUP_AUTO_DISMISS_MS = 3500;
const MATCH_REVEAL_DELAY_MS = 500;
const NO_MATCH_FLIP_BACK_MS = 900;

export function useGame(): UseGameReturn {
  const [phase, setPhase] = useState<GamePhase>("start");
  const [{ deck, activePartners }, setBuilt] = useState(() => buildDeck());
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedInstanceIds, setMatchedInstanceIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [attempts, setAttempts] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [locked, setLocked] = useState(false);
  const [activePopup, setActivePopup] = useState<Partner | null>(null);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearPendingTimers = useCallback(() => {
    for (const t of timersRef.current) clearTimeout(t);
    timersRef.current = [];
  }, []);
  const schedule = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(() => {
      timersRef.current = timersRef.current.filter((x) => x !== t);
      fn();
    }, ms);
    timersRef.current.push(t);
  }, []);

  useEffect(() => () => clearPendingTimers(), [clearPendingTimers]);

  // Elapsed timer
  useEffect(() => {
    if (phase !== "playing" || startedAt == null) return;
    const id = setInterval(() => {
      setElapsedMs(Date.now() - startedAt);
    }, 250);
    return () => clearInterval(id);
  }, [phase, startedAt]);

  const partnerIndex = useMemo(() => {
    const map = new Map<string, Partner>();
    for (const p of activePartners) map.set(p.id, p);
    return map;
  }, [activePartners]);

  const getPartner = useCallback(
    (id: string) => partnerIndex.get(id),
    [partnerIndex],
  );

  const reset = useCallback(() => {
    clearPendingTimers();
    const fresh = buildDeck();
    setBuilt(fresh);
    setFlippedIndices([]);
    setMatchedInstanceIds(new Set());
    setAttempts(0);
    setElapsedMs(0);
    setLocked(false);
    setActivePopup(null);
  }, [clearPendingTimers]);

  const start = useCallback(() => {
    reset();
    setPhase("playing");
    setStartedAt(Date.now());
  }, [reset]);

  const replay = useCallback(() => {
    reset();
    setPhase("start");
    setStartedAt(null);
  }, [reset]);

  const dismissPopup = useCallback(() => {
    setActivePopup(null);
  }, []);

  const totalPairs = deck.length / 2;
  const matchedCount = matchedInstanceIds.size / 2;

  // Watch matched count — transition to won after last popup dismisses
  useEffect(() => {
    if (
      phase === "playing" &&
      matchedInstanceIds.size === deck.length &&
      activePopup == null
    ) {
      schedule(() => {
        setPhase("won");
        setElapsedMs(startedAt == null ? 0 : Date.now() - startedAt);
      }, 400);
    }
  }, [
    phase,
    matchedInstanceIds,
    deck.length,
    activePopup,
    schedule,
    startedAt,
  ]);

  const flipCard = useCallback(
    (index: number) => {
      if (phase !== "playing") return;
      if (locked) return;
      if (activePopup) return;
      const card = deck[index];
      if (!card) return;
      if (matchedInstanceIds.has(card.instanceId)) return;
      if (flippedIndices.includes(index)) return;

      const next = [...flippedIndices, index];
      setFlippedIndices(next);

      if (next.length < 2) return;

      setLocked(true);
      setAttempts((a) => a + 1);
      const [i1, i2] = next;
      const c1 = deck[i1];
      const c2 = deck[i2];
      if (c1.partnerId === c2.partnerId) {
        playMatchChime();
        schedule(() => {
          setMatchedInstanceIds((prev) => {
            const n = new Set(prev);
            n.add(c1.instanceId);
            n.add(c2.instanceId);
            return n;
          });
          setFlippedIndices([]);
          const partner = partnerIndex.get(c1.partnerId);
          if (partner) setActivePopup(partner);
          setLocked(false);
        }, MATCH_REVEAL_DELAY_MS);
      } else {
        schedule(() => {
          setFlippedIndices([]);
          setLocked(false);
        }, NO_MATCH_FLIP_BACK_MS);
      }
    },
    [
      phase,
      locked,
      activePopup,
      deck,
      matchedInstanceIds,
      flippedIndices,
      partnerIndex,
      schedule,
    ],
  );

  // Popup auto-dismiss
  useEffect(() => {
    if (!activePopup) return;
    const id = setTimeout(() => {
      setActivePopup((curr) => (curr?.id === activePopup.id ? null : curr));
    }, POPUP_AUTO_DISMISS_MS);
    return () => clearTimeout(id);
  }, [activePopup]);

  return {
    phase,
    deck,
    flippedIndices,
    matchedInstanceIds,
    attempts,
    elapsedMs,
    locked,
    activePopup,
    totalPairs,
    matchedCount,
    start,
    replay,
    flipCard,
    dismissPopup,
    getPartner,
  };
}
