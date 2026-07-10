"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useData } from "@/lib/storage";
import type { Word } from "@/lib/types";

interface Props {
  /** Existing word when editing. */
  word?: Word;
  /** Preselected category id for new words. */
  defaultCategoryId?: string;
}

const fieldClass =
  "w-full rounded-xl border border-clay bg-white px-4 py-3 text-cocoa outline-none placeholder:text-cocoa-light/50 focus:border-coral";
const labelClass = "mb-1.5 block text-sm font-bold text-cocoa";

export default function WordForm({ word, defaultCategoryId }: Props) {
  const router = useRouter();
  const { categories, addWord, updateWord, addCategory } = useData();

  const [english, setEnglish] = useState(word?.english ?? "");
  const [definition, setDefinition] = useState(word?.definition ?? "");
  const [thai, setThai] = useState(word?.thai ?? "");
  const [example, setExample] = useState(word?.example ?? "");
  const [categoryId, setCategoryId] = useState(
    word?.categoryId ?? defaultCategoryId ?? categories[0]?.id ?? ""
  );
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");

  const usingNewCategory = categoryId === "__new__";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!english.trim()) {
      setError("Please enter the English word.");
      return;
    }

    let finalCategoryId = categoryId;
    if (usingNewCategory) {
      const created = addCategory(newCategory);
      if (!created) {
        setError(
          newCategory.trim()
            ? "That category already exists — pick it from the list."
            : "Enter a name for the new category."
        );
        return;
      }
      finalCategoryId = created.id;
    }

    if (!finalCategoryId) {
      setError("Please choose or create a category.");
      return;
    }

    const payload = {
      english: english.trim(),
      definition: definition.trim(),
      thai: thai.trim(),
      example: example.trim(),
      categoryId: finalCategoryId,
    };

    if (word) {
      updateWord(word.id, payload);
    } else {
      addWord(payload);
    }
    router.push(`/category/${finalCategoryId}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-5">
      <div>
        <label className={labelClass} htmlFor="english">
          English word <span className="text-coral">*</span>
        </label>
        <input
          id="english"
          value={english}
          onChange={(e) => setEnglish(e.target.value)}
          placeholder="e.g. Resilient"
          className={fieldClass}
          autoFocus={!word}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="definition">
          English definition
        </label>
        <textarea
          id="definition"
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          placeholder="Able to recover quickly from difficulties."
          rows={2}
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="thai">
          Thai meaning
        </label>
        <input
          id="thai"
          value={thai}
          onChange={(e) => setThai(e.target.value)}
          placeholder="ยืดหยุ่น, ฟื้นตัวเร็ว"
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="example">
          Example sentence
        </label>
        <textarea
          id="example"
          value={example}
          onChange={(e) => setExample(e.target.value)}
          placeholder="She stayed resilient through every setback."
          rows={2}
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="category">
          Category
        </label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={fieldClass}
        >
          {categories.length === 0 ? null : (
            <optgroup label="Your categories">
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </optgroup>
          )}
          <option value="__new__">+ New category…</option>
        </select>
      </div>

      {usingNewCategory ? (
        <div>
          <label className={labelClass} htmlFor="newCategory">
            New category name
          </label>
          <input
            id="newCategory"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="e.g. Business"
            className={fieldClass}
          />
        </div>
      ) : null}

      {error ? (
        <p className="rounded-xl bg-coral/10 px-4 py-2 text-sm font-semibold text-coral-dark">
          {error}
        </p>
      ) : null}

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 rounded-xl border border-clay bg-white py-3 font-bold text-cocoa transition active:scale-[0.98]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 rounded-xl bg-coral py-3 font-bold text-cream shadow-soft transition active:scale-[0.98]"
        >
          {word ? "Save changes" : "Add word"}
        </button>
      </div>
    </form>
  );
}
