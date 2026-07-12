export interface Category {
  id: string;
  name: string;
  createdAt: number;
}

export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "phrase"
  | "idiom"
  | "other";

export const PARTS_OF_SPEECH: PartOfSpeech[] = [
  "noun",
  "verb",
  "adjective",
  "adverb",
  "phrase",
  "idiom",
  "other",
];

export interface Word {
  id: string;
  english: string;
  definition: string;
  thai: string;
  example: string;
  categoryId: string;
  createdAt: number;
  /** Optional — may be absent on words created before this field existed. */
  partOfSpeech?: PartOfSpeech | "";
  /** Optional free-text notes about usage. */
  usageNotes?: string;
}
