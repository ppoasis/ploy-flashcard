"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { useData } from "@/lib/storage";
import {
  PlusIcon,
  CardsIcon,
  GameIcon,
  EditIcon,
  TrashIcon,
} from "@/components/Icons";

export default function CategoryPage() {
  const params = useParams();
  const id = String(params.id);
  const { ready, categories, wordsInCategory, deleteWord } = useData();
  const category = categories.find((c) => c.id === id);
  const words = wordsInCategory(id);

  if (ready && !category) {
    return (
      <div className="flex flex-1 flex-col">
        <Header title="Category" back="/" />
        <div className="px-5 py-10 text-center text-cocoa-light">
          <p className="mb-4">This category no longer exists.</p>
          <Link
            href="/"
            className="inline-block rounded-xl bg-coral px-5 py-2.5 font-bold text-cream"
          >
            Back home
          </Link>
        </div>
      </div>
    );
  }

  function handleDelete(wordId: string, english: string) {
    if (window.confirm(`Delete "${english}"?`)) deleteWord(wordId);
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header
        title={category?.name ?? "Category"}
        subtitle={`${words.length} word${words.length === 1 ? "" : "s"}`}
        back="/"
        action={
          <Link
            href={`/word/new?category=${id}`}
            aria-label="Add word"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-coral text-cream transition active:scale-95"
          >
            <PlusIcon width={22} height={22} />
          </Link>
        }
      />

      {words.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 px-5 pt-4">
          <Link
            href={`/review?category=${id}`}
            className="flex items-center justify-center gap-2 rounded-2xl bg-coral py-3 font-bold text-cream shadow-card transition active:scale-[0.98]"
          >
            <CardsIcon width={20} height={20} /> Review
          </Link>
          <Link
            href={`/quiz?category=${id}`}
            className="flex items-center justify-center gap-2 rounded-2xl bg-cocoa py-3 font-bold text-cream shadow-card transition active:scale-[0.98]"
          >
            <GameIcon width={20} height={20} /> Match
          </Link>
        </div>
      ) : null}

      <section className="flex flex-1 flex-col px-5 py-4">
        {!ready ? (
          <p className="text-cocoa-light">Loading…</p>
        ) : words.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-sand/60 p-8 text-center text-cocoa-light">
            <p className="mb-4">No words here yet.</p>
            <Link
              href={`/word/new?category=${id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-coral px-5 py-2.5 font-bold text-cream"
            >
              <PlusIcon width={18} height={18} /> Add the first word
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-3 pb-8">
            {words.map((w) => (
              <li
                key={w.id}
                className="rounded-2xl bg-white p-4 shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-lg font-extrabold text-cocoa">
                      {w.english}
                      {w.partOfSpeech ? (
                        <span className="ml-2 align-middle text-sm font-semibold italic text-cocoa-light">
                          {w.partOfSpeech}
                        </span>
                      ) : null}
                    </p>
                    {w.thai ? (
                      <p className="text-coral-dark">{w.thai}</p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Link
                      href={`/word/${w.id}/edit`}
                      aria-label={`Edit ${w.english}`}
                      className="grid h-9 w-9 place-items-center rounded-lg text-cocoa-light transition active:scale-95 hover:bg-sand"
                    >
                      <EditIcon width={17} height={17} />
                    </Link>
                    <button
                      onClick={() => handleDelete(w.id, w.english)}
                      aria-label={`Delete ${w.english}`}
                      className="grid h-9 w-9 place-items-center rounded-lg text-cocoa-light transition active:scale-95 hover:bg-sand hover:text-coral-dark"
                    >
                      <TrashIcon width={17} height={17} />
                    </button>
                  </div>
                </div>
                {w.definition ? (
                  <p className="mt-2 text-sm text-cocoa-light">
                    {w.definition}
                  </p>
                ) : null}
                {w.example ? (
                  <p className="mt-2 border-l-2 border-clay pl-3 text-sm italic text-cocoa-light">
                    “{w.example}”
                  </p>
                ) : null}
                {w.usageNotes ? (
                  <p className="mt-2 rounded-lg bg-sand/60 px-3 py-2 text-sm text-cocoa-light">
                    💡 {w.usageNotes}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
