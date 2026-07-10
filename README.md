# Ploy's Flashcards 🍊

A personal English vocabulary flashcard web app. Built with **Next.js (App Router)** and **Tailwind CSS**, with all data stored in the browser's **localStorage** — no backend or database required.

## Features

- **Categories** — create custom topics (e.g. _Business_, _Personality Traits_). Each word belongs to one category.
- **Words** — add, edit, and delete words. Each word has an English word, English definition, Thai meaning, example sentence, and category.
- **Flashcard Review** — flip cards between the word and its meaning; browse all words or a single category. Shuffle any time.
- **Matching Quiz** — tap a word, then tap its matching meaning. Correct pairs lock in green; wrong pairs shake and reset. Tracks time and mistakes.
- **Offline & private** — everything is saved on your device via `localStorage` and persists across sessions.
- **Mobile-first** — warm palette, rounded cards, designed for a phone browser.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command         | Description                     |
| --------------- | ------------------------------- |
| `npm run dev`   | Start the development server    |
| `npm run build` | Build for production            |
| `npm run start` | Run the production build        |
| `npm run lint`  | Lint the project                |

## Data & privacy

All categories and words live in your browser under the keys
`ploy-flashcards:categories` and `ploy-flashcards:words`. Clearing your
browser data (or using a different device/browser) will start you with a
fresh, empty list.

## Deploying to Vercel

See the walkthrough in the project chat, or:

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Accept the detected Next.js defaults and click **Deploy**.
