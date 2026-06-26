import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-10">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-lime">Scoreboard local</p>
        <h1 className="mt-3 text-6xl font-black leading-tight text-white">Flechettes</h1>
        <p className="mt-5 text-xl text-slate-300">
          Configure les equipes, lance une partie X01 ou Cricket, puis garde les scores et les tours en local.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Link
          className="focus-ring rounded-lg border border-line bg-panel/90 p-6 transition hover:border-lime"
          href="/setup?mode=x01"
        >
          <span className="text-sm uppercase tracking-wide text-slate-400">Mode</span>
          <strong className="mt-2 block text-4xl text-lime">X01</strong>
          <span className="mt-3 block text-slate-300">301, 501, 701, 901 ou score personnalise par centaines.</span>
        </Link>
        <Link
          className="focus-ring rounded-lg border border-line bg-panel/90 p-6 transition hover:border-lime"
          href="/setup?mode=cricket"
        >
          <span className="text-sm uppercase tracking-wide text-slate-400">Mode</span>
          <strong className="mt-2 block text-4xl text-amber">Cricket</strong>
          <span className="mt-3 block text-slate-300">Avec points ou variante avancee sans points.</span>
        </Link>
      </div>
    </main>
  );
}
