"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/Header";
import WordForm from "@/components/WordForm";

function NewWordInner() {
  const params = useSearchParams();
  const categoryId = params.get("category") ?? undefined;
  return <WordForm defaultCategoryId={categoryId} />;
}

export default function NewWordPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header title="Add a word" back={true} />
      <Suspense fallback={null}>
        <NewWordInner />
      </Suspense>
    </div>
  );
}
