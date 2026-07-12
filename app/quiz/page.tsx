"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { useData } from "@/lib/storage";
import { ClockIcon, TrophyIcon, ShuffleIcon } from "@/components/Icons";
import type { Word } from "@/lib/types";

const MAX_PAIRS = 6;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function meaningOf(w: Word): string {
  return w.definition;
}

function formatTime(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type Side = "word" | "meaning";

function QuizInner() {
  const params = useSearchParams();
  const categoryId = params.get("category");
  const { ready, words, categories } = useData();

  const category = categoryId
    ? categories.find((c) => c.id === categoryId)
    : null;

  // Only words that have a usable meaning can be matched.
  const playable = useMemo(
    () =>
      (categoryId ? words.filter((w) => w.categoryId === categoryId) : words)
        .filter((w) => meaningOf(w).length > 0),
    [words, categoryId]
  );

  const [round, setRound] = useState<Word[]>([]);
  const [wordTiles, setWordTiles] = useState<Word[]>([]);
  const [meaningTiles, setMeaningTiles] = useState<Word[]>([]);
  const [selected, setSelected] = useState<{ side: Side; id: string } | null>(
    null
  );
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const lockRef = useRef(false);

  const startRound = useCallback(() => {
    const picked = shuffle(playable).slice(0, MAX_PAIRS);
    setRound(picked);
    setWordTiles(shuffle(picked));
    setMeaningTiles(shuffle(picked));
    setSelected(null);
    setMatched(new Set());
    setWrong(new Set());
    setMistakes(0);
    setFinished(false);
    setStartedAt(Date.now());
    setElapsed(0);
    lockRef.current = false;
  }, [playable]);

  // Start a round when data is ready / pool changes.
  useEffect(() => {
    if (ready && playable.length >= 2) startRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, playable.length, categoryId]);

  // Timer.
  useEffect(() => {
    if (finished || !startedAt) return;
    const t = setInterval(() => setElapsed(Date.now() - startedAt), 250);
    return () => clearInterval(t);
  }, [finished, startedAt]);

  // Win check.
  useEffect(() => {
    if (round.length > 0 && matched.size === round.length) {
      setFinished(true);
      setElapsed(Date.now() - startedAt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched, round.length]);

  function handleTap(side: Side, id: string) {
    if (lockRef.current) return;
    if (matched.has(id)) return;

    // First pick, or re-picking within the same column.
    if (!selected || selected.side === side) {
      setSelected({ side, id });
      return;
    }

    // We now have one from each side.
    const wordId = side === "word" ? id : selected.id;
    const meaningId = side === "meaning" ? id : selected.id;

    if (wordId === meaningId) {
      // Correct match.
      setMatched((prev) => new Set(prev).add(wordId));
      setSelected(null);
    } else {
      // Wrong — shake both, then reset.
      lockRef.current = true;
      setMistakes((m) => m + 1);
      setWrong(new Set([`word:${wordId}`, `meaning:${meaningId}`]));
      setSelected({ side, id }); // show the second pick briefly
      setTimeout(() => {
        setWrong(new Set());
        setSelected(null);
        lockRef.current = false;
      }, 550);
    }
  }

  const title = category ? category.name : "All words";

  if (ready && playable.length < 2) {
    return (
      <div className="flex flex-1 flex-col">
        <Header title="Matching" subtitle={title} back="/" />
        <div className="px-5 py-10 text-center text-cocoa-light">
          <p className="mb-2 font-semibold text-cocoa">
            Not enough words to play yet.
          </p>
          <p className="mb-5">
            You need at least 2 words that have an English definition.
          </p>
          <Link
            href={categoryId ? `/word/new?category=${categoryId}` : "/word/new"}
            className="inline-block rounded-xl bg-coral px-5 py-2.5 font-bold text-cream"
          >
            Add a word
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header
        title="Matching"
        subtitle={title}
        back="/"
        action={
          <button
            onClick={startRound}
            aria-label="New round"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-cocoa transition active:scale-95 hover:bg-sand"
          >
            <ShuffleIcon width={20} height={20} />
          </button>
        }
      />

      {!ready ? (
        <p className="px-5 py-8 text-cocoa-light">Loading…</p>
      ) : (
        <div className="flex flex-1 flex-col px-5 py-4">
          {/* Scoreboard */}
          <div className="mb-4 flex gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-card">
              <TrophyIcon width={20} height={20} className="text-leaf" />
              <div>
                <p className="text-xs font-semibold text-cocoa-light">Matched</p>
                <p className="font-extrabold text-cocoa">
                  {matched.size}/{round.length}
                </p>
              </div>
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-card">
              <ClockIcon width={20} height={20} className="text-coral" />
              <div>
                <p className="text-xs font-semibold text-cocoa-light">Time</p>
                <p className="font-extrabold tabular-nums text-cocoa">
                  {formatTime(elapsed)}
                </p>
              </div>
            </div>
          </div>

          {finished ? (
            <Finished
              time={elapsed}
              mistakes={mistakes}
              pairs={round.length}
              onReplay={startRound}
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {/* Words column */}
              <div className="flex flex-col gap-3">
                <p className="text-center text-xs font-bold uppercase tracking-wider text-cocoa-light">
                  Words
                </p>
                {wordTiles.map((w) => (
                  <Tile
                    key={`word-${w.id}`}
                    label={w.english}
                    matched={matched.has(w.id)}
                    selected={
                      selected?.side === "word" && selected.id === w.id
                    }
                    wrong={wrong.has(`word:${w.id}`)}
                    onTap={() => handleTap("word", w.id)}
                  />
                ))}
              </div>
              {/* Definitions column */}
              <div className="flex flex-col gap-3">
                <p className="text-center text-xs font-bold uppercase tracking-wider text-cocoa-light">
                  Definitions
                </p>
                {meaningTiles.map((w) => (
                  <Tile
                    key={`meaning-${w.id}`}
                    label={meaningOf(w)}
                    matched={matched.has(w.id)}
                    selected={
                      selected?.side === "meaning" && selected.id === w.id
                    }
                    wrong={wrong.has(`meaning:${w.id}`)}
                    onTap={() => handleTap("meaning", w.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Tile({
  label,
  matched,
  selected,
  wrong,
  onTap,
}: {
  label: string;
  matched: boolean;
  selected: boolean;
  wrong: boolean;
  onTap: () => void;
}) {
  const state = matched
    ? "border-leaf bg-leaf/15 text-leaf"
    : wrong
    ? "border-coral-dark bg-coral/15 text-coral-dark animate-shake"
    : selected
    ? "border-coral bg-coral text-cream shadow-soft"
    : "border-clay bg-white text-cocoa";

  return (
    <button
      onClick={onTap}
      disabled={matched}
      className={`flex min-h-[4.5rem] items-center justify-center rounded-2xl border-2 px-3 py-3 text-center text-sm font-bold leading-tight transition active:scale-[0.97] ${state}`}
    >
      {label}
    </button>
  );
}

function Finished({
  time,
  mistakes,
  pairs,
  onReplay,
}: {
  time: number;
  mistakes: number;
  pairs: number;
  onReplay: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
      <div className="animate-pop rounded-3xl bg-white p-8 shadow-soft">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-leaf/15 text-leaf">
          <TrophyIcon width={34} height={34} />
        </div>
        <h2 className="text-2xl font-extrabold text-cocoa">Well done, Ploy!</h2>
        <p className="mt-1 text-cocoa-light">
          You matched all {pairs} pairs.
        </p>
        <div className="mt-6 flex justify-center gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-cocoa-light">
              Time
            </p>
            <p className="text-xl font-extrabold text-coral">
              {formatTime(time)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-cocoa-light">
              Mistakes
            </p>
            <p className="text-xl font-extrabold text-cocoa">{mistakes}</p>
          </div>
        </div>
      </div>
      <button
        onClick={onReplay}
        className="mt-6 w-full rounded-2xl bg-coral py-4 text-lg font-bold text-cream shadow-soft transition active:scale-[0.98]"
      >
        Play again
      </button>
      <Link
        href="/"
        className="mt-3 w-full rounded-2xl border border-clay bg-white py-3 font-bold text-cocoa transition active:scale-[0.98]"
      >
        Back home
      </Link>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={null}>
      <QuizInner />
    </Suspense>
  );
}
