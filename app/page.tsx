"use client";

import Link from "next/link";
import { useState } from "react";
import { useData } from "@/lib/storage";
import {
  PlusIcon,
  CardsIcon,
  GameIcon,
  FolderIcon,
  TrashIcon,
} from "@/components/Icons";

export default function HomePage() {
  const {
    ready,
    categories,
    words,
    addCategory,
    deleteCategory,
    wordsInCategory,
  } = useData();
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");

  function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    const created = addCategory(newCategory);
    if (!created) {
      setError(
        newCategory.trim()
          ? "That category already exists."
          : "Enter a category name."
      );
      return;
    }
    setNewCategory("");
    setError("");
  }

  function handleDeleteCategory(id: string, name: string) {
    const count = wordsInCategory(id).length;
    const message =
      count > 0
        ? `Delete "${name}" and its ${count} word${count === 1 ? "" : "s"}?`
        : `Delete "${name}"?`;
    if (window.confirm(message)) deleteCategory(id);
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <header className="px-5 pb-4 pt-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-coral">
          Vocabulary
        </p>
        <h1 className="mt-1 text-3xl font-extrabold text-cocoa">
          Ploy&apos;s Flashcards
        </h1>
        <p className="mt-1 text-cocoa-light">
          {words.length === 0
            ? "Add your first word to get started."
            : `${words.length} word${words.length === 1 ? "" : "s"} across ${
                categories.length
              } categor${categories.length === 1 ? "y" : "ies"}.`}
        </p>
      </header>

      {/* Primary actions */}
      <div className="grid grid-cols-2 gap-3 px-5">
        <Link
          href="/review"
          className="flex flex-col gap-2 rounded-3xl bg-coral p-4 text-cream shadow-soft transition active:scale-[0.98]"
        >
          <CardsIcon width={28} height={28} />
          <span className="text-base font-bold">Review</span>
          <span className="text-xs text-cream/80">Flip through cards</span>
        </Link>
        <Link
          href="/quiz"
          className="flex flex-col gap-2 rounded-3xl bg-cocoa p-4 text-cream shadow-soft transition active:scale-[0.98]"
        >
          <GameIcon width={28} height={28} />
          <span className="text-base font-bold">Match</span>
          <span className="text-xs text-cream/80">Play the quiz</span>
        </Link>
      </div>

      {/* Add word */}
      <div className="px-5 pt-3">
        <Link
          href="/word/new"
          className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-coral/50 bg-sand/50 py-3 font-bold text-coral-dark transition active:scale-[0.99]"
        >
          <PlusIcon width={20} height={20} />
          Add a word
        </Link>
      </div>

      {/* Categories */}
      <section className="flex flex-1 flex-col px-5 pt-6">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-cocoa-light">
          Categories
        </h2>

        <form onSubmit={handleAddCategory} className="mb-4">
          <div className="flex gap-2">
            <input
              value={newCategory}
              onChange={(e) => {
                setNewCategory(e.target.value);
                setError("");
              }}
              placeholder="New category…"
              className="min-w-0 flex-1 rounded-xl border border-clay bg-white px-4 py-3 text-cocoa outline-none placeholder:text-cocoa-light/60 focus:border-coral"
            />
            <button
              type="submit"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-coral text-cream transition active:scale-95"
              aria-label="Add category"
            >
              <PlusIcon />
            </button>
          </div>
          {error ? (
            <p className="mt-2 text-sm text-coral-dark">{error}</p>
          ) : null}
        </form>

        {!ready ? (
          <p className="text-cocoa-light">Loading…</p>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl bg-sand/60 p-6 text-center text-cocoa-light">
            <FolderIcon
              width={32}
              height={32}
              className="mx-auto mb-2 text-clay"
            />
            No categories yet. Create one above to start grouping words.
          </div>
        ) : (
          <ul className="flex flex-col gap-2 pb-8">
            {categories.map((cat) => {
              const count = wordsInCategory(cat.id).length;
              return (
                <li
                  key={cat.id}
                  className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-card"
                >
                  <Link
                    href={`/category/${cat.id}`}
                    className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2 py-2 transition active:bg-sand/60"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sand text-coral">
                      <FolderIcon width={22} height={22} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold text-cocoa">
                        {cat.name}
                      </span>
                      <span className="block text-sm text-cocoa-light">
                        {count} word{count === 1 ? "" : "s"}
                      </span>
                    </span>
                  </Link>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    aria-label={`Delete ${cat.name}`}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-cocoa-light transition active:scale-95 hover:bg-sand hover:text-coral-dark"
                  >
                    <TrashIcon width={18} height={18} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <footer className="px-5 pb-6 pt-2 text-center text-xs text-cocoa-light/70">
        Saved on this device · Ploy&apos;s Flashcards
      </footer>
    </div>
  );
}
