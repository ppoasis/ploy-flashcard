"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BackIcon } from "./Icons";
import type { ReactNode } from "react";

export default function Header({
  title,
  subtitle,
  back,
  action,
}: {
  title: string;
  subtitle?: string;
  /** URL to link back to, or true to use browser back. */
  back?: string | boolean;
  action?: ReactNode;
}) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-clay/60 bg-cream/90 px-4 py-3 backdrop-blur">
      {back ? (
        typeof back === "string" ? (
          <Link
            href={back}
            aria-label="Back"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-cocoa transition active:scale-95 hover:bg-sand"
          >
            <BackIcon width={22} height={22} />
          </Link>
        ) : (
          <button
            onClick={() => router.back()}
            aria-label="Back"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-cocoa transition active:scale-95 hover:bg-sand"
          >
            <BackIcon width={22} height={22} />
          </button>
        )
      ) : null}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-extrabold leading-tight text-cocoa">
          {title}
        </h1>
        {subtitle ? (
          <p className="truncate text-sm text-cocoa-light">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </header>
  );
}
