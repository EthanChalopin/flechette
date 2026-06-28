import { Suspense } from "react";
import Link from "next/link";
import { GameSetupForm } from "@/components/GameSetupForm";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function SetupPage() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-lime">Configuration</p>
          <h1 className="mt-2 text-4xl font-black">Nouvelle partie</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link className="focus-ring rounded-md border border-line px-4 py-3 text-slate-200 hover:border-lime" href="/">
            Accueil
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <Suspense fallback={<p className="text-slate-300">Chargement...</p>}>
        <GameSetupForm />
      </Suspense>
    </main>
  );
}
