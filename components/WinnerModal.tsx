"use client";

import Link from "next/link";

type Props = {
  winnerName: string;
  newGameHref: string;
  onReplay: () => void;
};

export function WinnerModal({ winnerName, newGameHref, onReplay }: Props) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-6">
      <section className="w-full max-w-lg rounded-lg border border-lime bg-panel p-6 text-center shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-lime">Victoire</p>
        <h2 className="mt-3 text-4xl font-black">{winnerName}</h2>
        <p className="mt-2 text-slate-300">remporte la partie.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <button
            className="focus-ring rounded-md bg-lime px-4 py-3 font-bold text-felt hover:bg-white"
            type="button"
            onClick={onReplay}
          >
            Rejouer
          </button>
          <Link className="focus-ring rounded-md border border-line px-4 py-3 hover:border-lime" href={newGameHref}>
            Nouvelle
          </Link>
          <Link className="focus-ring rounded-md border border-line px-4 py-3 hover:border-lime" href="/">
            Accueil
          </Link>
        </div>
      </section>
    </div>
  );
}
