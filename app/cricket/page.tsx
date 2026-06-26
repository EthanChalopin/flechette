"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ActiveTurnCard } from "@/components/ActiveTurnCard";
import { CricketScoreboard } from "@/components/CricketScoreboard";
import { TurnHistory } from "@/components/TurnHistory";
import { WinnerModal } from "@/components/WinnerModal";
import { CRICKET_TARGETS } from "@/lib/cricketLogic";
import { applyCricketTurn, createCricketGame, previewCricketTurn, undoCricketTurn } from "@/lib/cricketLogic";
import { loadGame, saveGame } from "@/lib/storage";
import type { CricketAction, CricketGameState, CricketHitTarget, Multiplier } from "@/lib/types";

export default function CricketPage() {
  const [state, setState] = useState<CricketGameState | null>(null);
  const [actions, setActions] = useState<CricketAction[]>([]);
  const displayedState = state ? previewCricketTurn(state, actions) : null;

  useEffect(() => {
    setState(loadGame<CricketGameState>("cricket"));
  }, []);

  useEffect(() => {
    if (state) {
      saveGame(state);
    }
  }, [state]);

  function addAction(target: CricketHitTarget, multiplier: Multiplier) {
    if (!state || actions.length >= 3 || state.winnerTeamId) {
      return;
    }
    const nextActions = [...actions, { target, multiplier }];
    if (nextActions.length < 3) {
      setActions(nextActions);
      return;
    }
    setState(applyCricketTurn(state, nextActions));
    setActions([]);
  }

  function goBack() {
    if (!state) {
      return;
    }
    if (actions.length > 0) {
      setActions(actions.slice(0, -1));
      return;
    }
    setState(undoCricketTurn(state));
  }

  function replaySameGame() {
    if (!state) {
      return;
    }
    setState(createCricketGame(state.teams, state.variant));
    setActions([]);
  }

  if (!state) {
    return <MissingGame />;
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-8">
      <Header variant={state.variant === "points" ? "Avec points" : "Avance sans points"} />
      <div className="grid gap-6">
        <ActiveTurnCard teams={state.teams} turn={state.activeTurn} winnerTeamId={state.winnerTeamId} />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
          <CricketScoreboard state={displayedState ?? state} />
          <section className="rounded-lg border border-line bg-panel/90 p-5">
            <div className="grid gap-3">
              <button
                className="focus-ring rounded-md border border-line bg-felt px-4 py-4 text-lg font-bold hover:border-lime disabled:opacity-50"
                disabled={Boolean(state.winnerTeamId) || actions.length >= 3}
                type="button"
                onClick={() => addAction("0", 1)}
              >
                0 - fleche manquee
              </button>
              {CRICKET_TARGETS.map((target) => (
                <div className="grid grid-cols-[72px_1fr] items-center gap-3" key={target}>
                  <strong className="text-xl">{target}</strong>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((multiplier) => (
                      <button
                        className="focus-ring rounded-md border border-line bg-felt px-4 py-3 font-bold hover:border-lime disabled:opacity-50"
                        disabled={Boolean(state.winnerTeamId) || actions.length >= 3}
                        key={multiplier}
                        type="button"
                        onClick={() => addAction(target, multiplier as Multiplier)}
                      >
                        x{multiplier}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {state.variant === "advanced" ? (
                <>
                  <div className="grid grid-cols-[72px_1fr] items-center gap-3">
                    <strong className="text-xl">Double</strong>
                    <button
                      className="focus-ring rounded-md border border-line bg-felt px-4 py-3 font-bold hover:border-lime disabled:opacity-50"
                      disabled={Boolean(state.winnerTeamId) || actions.length >= 3}
                      type="button"
                      onClick={() => addAction("Double", 1)}
                    >
                      x1
                    </button>
                  </div>
                  <div className="grid grid-cols-[72px_1fr] items-center gap-3">
                    <strong className="text-xl">Triple</strong>
                    <button
                      className="focus-ring rounded-md border border-line bg-felt px-4 py-3 font-bold hover:border-lime disabled:opacity-50"
                      disabled={Boolean(state.winnerTeamId) || actions.length >= 3}
                      type="button"
                      onClick={() => addAction("Triple", 1)}
                    >
                      x1
                    </button>
                  </div>
                </>
              ) : null}
            </div>

            <div className="mt-5 rounded-lg border border-line bg-felt/70 p-4">
              <p className="text-sm text-slate-400">Tour en saisie</p>
              <p className="mt-2 min-h-7 text-lg font-semibold">
                {actions.length ? actions.map((action) => `${action.target} x${action.multiplier}`).join(", ") : "-"}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  className="focus-ring rounded-md border border-line px-5 py-3 hover:border-lime disabled:opacity-50"
                  disabled={actions.length === 0 && state.history.length === 0}
                  type="button"
                  onClick={goBack}
                >
                  Revenir en arriere
                </button>
              </div>
            </div>
          </section>
        </div>
        <TurnHistory items={state.history} />
      </div>
      {state.winnerTeamId ? (
        <WinnerModal
          winnerName={state.teams.find((team) => team.id === state.winnerTeamId)?.name ?? "Equipe gagnante"}
          newGameHref="/setup?mode=cricket"
          onReplay={replaySameGame}
        />
      ) : null}
    </main>
  );
}

function Header({ variant }: { variant: string }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-lime">Partie en cours</p>
        <h1 className="mt-2 text-4xl font-black">Cricket - {variant}</h1>
      </div>
      <div className="flex gap-3">
        <Link className="focus-ring rounded-md border border-line px-4 py-3 hover:border-lime" href="/setup?mode=cricket">
          Nouvelle partie
        </Link>
        <Link className="focus-ring rounded-md border border-line px-4 py-3 hover:border-lime" href="/">
          Accueil
        </Link>
      </div>
    </header>
  );
}

function MissingGame() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6">
      <h1 className="text-4xl font-black">Aucune partie Cricket chargee</h1>
      <Link className="focus-ring mt-6 w-fit rounded-md bg-lime px-5 py-3 font-bold text-felt" href="/setup?mode=cricket">
        Configurer une partie
      </Link>
    </main>
  );
}
