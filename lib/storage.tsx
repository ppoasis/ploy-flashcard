"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Category, Word } from "./types";

const CATEGORIES_KEY = "ploy-flashcards:categories";
const WORDS_KEY = "ploy-flashcards:words";

function makeId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

interface DataContextValue {
  ready: boolean;
  categories: Category[];
  words: Word[];
  addCategory: (name: string) => Category | null;
  renameCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  addWord: (input: Omit<Word, "id" | "createdAt">) => void;
  updateWord: (id: string, input: Omit<Word, "id" | "createdAt">) => void;
  deleteWord: (id: string) => void;
  wordsInCategory: (categoryId: string) => Word[];
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [ready, setReady] = useState(false);

  // Load once on mount (client only).
  useEffect(() => {
    setCategories(readJSON<Category[]>(CATEGORIES_KEY, []));
    setWords(readJSON<Word[]>(WORDS_KEY, []));
    setReady(true);
  }, []);

  // Persist whenever data changes (after initial load).
  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }, [categories, ready]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(WORDS_KEY, JSON.stringify(words));
  }, [words, ready]);

  const value = useMemo<DataContextValue>(() => {
    return {
      ready,
      categories,
      words,
      addCategory(name) {
        const trimmed = name.trim();
        if (!trimmed) return null;
        const exists = categories.some(
          (c) => c.name.toLowerCase() === trimmed.toLowerCase()
        );
        if (exists) return null;
        const category: Category = {
          id: makeId(),
          name: trimmed,
          createdAt: Date.now(),
        };
        setCategories((prev) => [...prev, category]);
        return category;
      },
      renameCategory(id, name) {
        const trimmed = name.trim();
        if (!trimmed) return;
        setCategories((prev) =>
          prev.map((c) => (c.id === id ? { ...c, name: trimmed } : c))
        );
      },
      deleteCategory(id) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        setWords((prev) => prev.filter((w) => w.categoryId !== id));
      },
      addWord(input) {
        const word: Word = { ...input, id: makeId(), createdAt: Date.now() };
        setWords((prev) => [...prev, word]);
      },
      updateWord(id, input) {
        setWords((prev) =>
          prev.map((w) => (w.id === id ? { ...w, ...input } : w))
        );
      },
      deleteWord(id) {
        setWords((prev) => prev.filter((w) => w.id !== id));
      },
      wordsInCategory(categoryId) {
        return words.filter((w) => w.categoryId === categoryId);
      },
    };
  }, [categories, words, ready]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
}
