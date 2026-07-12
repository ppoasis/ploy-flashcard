"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { useData } from "@/lib/storage";
import { BackIcon, ShuffleIcon } from "@/components/Icons";
import type { Word } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ReviewInner() {
  const params = useSearchParams();
  const categoryId = params.get("category");
  const { ready, words, categories } = useData();

  const category = categoryId
    ? categories.find((c) => c.id === categoryId)
    : null;

  const pool = useMemo<Word[]>(() => {
    if (categoryId) return words.filter((w) => w.categoryId === categoryId);
    return words;
  }, [words, categoryId]);

  const [order, setOrder] = useState<Word[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Build initial order once the pool is known / changes size.
  useEffect(() => {
    setOrder(pool);
    setIndex(0);
    setFlipped(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.length, categoryId]);

  const current = order[index];

  function go(delta: number) {
    setFlipped(false);
    setIndex((i) => {
      const next = i + delta;
      if (next < 0) return order.length - 1;
      if (next >= order.length) return 0;
      return next;
    });
  }

  function reshuffle() {
    setOrder((o) => shuffle(o));
    setIndex(0);
    setFlipped(false);
  }

  const title = category ? category.name : "All words";

  if (ready && pool.length === 0) {
    return (
      <div className="flex flex-1 flex-col">
        <Header title="Review" subtitle={title} back="/" />
        <EmptyState categoryId={categoryId} />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header
        title="Review"
        subtitle={title}
        back="/"
        action={
          <button
            onClick={reshuffle}
            aria-label="Shuffle"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-cocoa transition active:scale-95 hover:bg-sand"
          >
            <ShuffleIcon width={20} height={20} />
          </button>
        }
      />

      {!ready || !current ? (
        <p className="px-5 py-8 text-cocoa-light">Loading…</p>
      ) : (
        <div className="flex flex-1 flex-col px-5 py-4">
          {/* Progress */}
          <div className="mb-4">
            <div className="mb-1.5 flex justify-between text-sm font-semibold text-cocoa-light">
              <span>
                Card {index + 1} of {order.length}
              </span>
              <span>Tap card to flip</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-sand">
              <div
                className="h-full rounded-full bg-coral transition-all"
                style={{
                  width: `${((index + 1) / order.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Card */}
          <div className="perspective relative min-h-[22rem] flex-1">
            <button
              onClick={() => setFlipped((f) => !f)}
              className="absolute inset-0 text-left"
              aria-label="Flip card"
            >
              <div
                className={`flip-inner relative h-full w-full ${
                  flipped ? "is-flipped" : ""
                }`}
              >
                {/* Front — English word (+ part of speech) */}
                <div className="flip-face absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-white p-6 text-center shadow-soft">
                  <span className="mb-3 rounded-full bg-sand px-3 py-1 text-xs font-bold uppercase tracking-wider text-coral-dark">
                    Word
                  </span>
                  <p className="text-4xl font-extrabold text-cocoa">
                    {current.english}
                  </p>
                  {current.partOfSpeech ? (
                    <span className="mt-4 rounded-full border border-clay px-3 py-1 text-sm font-semibold italic text-cocoa-light">
                      {current.partOfSpeech}
                    </span>
                  ) : null}
                </div>

                {/* Back — reveal: meaning, example, usage notes */}
                <div className="flip-face flip-back absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-y-auto rounded-3xl bg-coral p-6 text-center text-cream shadow-soft">
                  <span className="rounded-full bg-cream/20 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    Meaning
                  </span>
                  {current.thai ? (
                    <p className="text-3xl font-extrabold">{current.thai}</p>
                  ) : null}
                  {current.definition ? (
                    <p className="max-w-xs text-cream/90">
                      {current.definition}
                    </p>
                  ) : null}
                  {current.example ? (
                    <p className="max-w-xs border-t border-cream/25 pt-3 text-sm italic text-cream/90">
                      “{current.example}”
                    </p>
                  ) : null}
                  {current.usageNotes ? (
                    <p className="max-w-xs rounded-xl bg-cream/15 px-3 py-2 text-sm text-cream/90">
                      💡 {current.usageNotes}
                    </p>
                  ) : null}
                  {!current.thai &&
                  !current.definition &&
                  !current.example &&
                  !current.usageNotes ? (
                    <p className="text-cream/80">No meaning added yet.</p>
                  ) : null}
                </div>
              </div>
            </button>
          </div>

          {/* Nav */}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => go(-1)}
              className="grid h-14 w-14 place-items-center rounded-2xl border border-clay bg-white text-cocoa shadow-card transition active:scale-95"
              aria-label="Previous"
            >
              <BackIcon />
            </button>
            <button
              onClick={() => go(1)}
              className="flex-1 rounded-2xl bg-coral py-4 text-lg font-bold text-cream shadow-soft transition active:scale-[0.98]"
            >
              Next
            </button>
            <button
              onClick={() => go(1)}
              className="grid h-14 w-14 place-items-center rounded-2xl border border-clay bg-white text-cocoa shadow-card transition active:scale-95"
              aria-label="Next"
            >
              <BackIcon className="rotate-180" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ categoryId }: { categoryId: string | null }) {
  return (
    <div className="px-5 py-10 text-center text-cocoa-light">
      <p className="mb-4">No words to review yet.</p>
      <Link
        href={categoryId ? `/word/new?category=${categoryId}` : "/word/new"}
        className="inline-block rounded-xl bg-coral px-5 py-2.5 font-bold text-cream"
      >
        Add a word
      </Link>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={null}>
      <ReviewInner />
    </Suspense>
  );
}
