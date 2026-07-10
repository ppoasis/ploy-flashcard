"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import WordForm from "@/components/WordForm";
import { useData } from "@/lib/storage";

export default function EditWordPage() {
  const params = useParams();
  const id = String(params.id);
  const { ready, words } = useData();
  const word = words.find((w) => w.id === id);

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Edit word" back={true} />
      {!ready ? (
        <p className="px-5 py-8 text-cocoa-light">Loading…</p>
      ) : !word ? (
        <div className="px-5 py-10 text-center text-cocoa-light">
          <p className="mb-4">That word could not be found.</p>
          <Link
            href="/"
            className="inline-block rounded-xl bg-coral px-5 py-2.5 font-bold text-cream"
          >
            Back home
          </Link>
        </div>
      ) : (
        <WordForm word={word} />
      )}
    </div>
  );
}
