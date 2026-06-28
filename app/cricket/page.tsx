"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ActiveTurnCard } from "@/components/ActiveTurnCard";
import { CricketScoreboard } from "@/components/CricketScoreboard";
import { HitSplash, type HitSplashConfig } from "@/components/HitSplash";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WinnerModal } from "@/components/WinnerModal";
import { CRICKET_TARGETS } from "@/lib/cricketLogic";
import { applyCricketTurn, createCricketGame, previewCricketTurn, undoCricketTurn } from "@/lib/cricketLogic";
import { loadGame, saveGame } from "@/lib/storage";
import type { CricketAction, CricketGameState, CricketHitTarget, Multiplier } from "@/lib/types";

export default function CricketPage() {
  const [state, setState] = useState<CricketGameState | null>(null);
  const [actions, setActions] = useState<CricketAction[]>([]);
  const [hitSplash, setHitSplash] = useState<HitSplashConfig | null>(null);
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
    setHitSplash(getCricketSplash(target, multiplier));
    const nextActions = [...actions, { target, multiplier }];
    if (nextActions.length < 3) {
      setActions(nextActions);
      return;
    }
    setState(applyCricketTurn(state, nextActions));
    setActions([]);
  }

  function finishTurn() {
    if (!state || state.winnerTeamId) {
      return;
    }

    const nextActions: CricketAction[] = [...actions];
    while (nextActions.length < 3) {
      nextActions.push({ target: "0", multiplier: 1 });
    }
    if (nextActions.every((nextAction) => nextAction.target === "0")) {
      setHitSplash(BLANK_TURN_SPLASH);
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

    const lastTurn = state.history[0];
    if (!lastTurn) {
      return;
    }

    setState(undoCricketTurn(state));
    setActions(lastTurn.actions.slice(0, -1));
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
    <main className="mx-auto flex min-h-dvh max-w-7xl flex-col overflow-y-auto px-2 py-2 sm:px-4 lg:h-dvh lg:overflow-hidden lg:px-3 lg:py-3">
      <Header variant={state.variant === "points" ? "Avec points" : "Avance sans points"} />
      <div className="grid min-h-0 flex-1 gap-1.5 lg:gap-2 lg:grid-rows-[auto_minmax(0,1fr)]">
        <ActiveTurnCard teams={state.teams} turn={state.activeTurn} winnerTeamId={state.winnerTeamId} />
        <div className="grid min-h-0 gap-2 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)] xl:gap-3">
          <CricketScoreboard state={displayedState ?? state} />
          <section className="flex min-h-0 flex-col rounded-lg border border-line bg-panel/90 p-2 lg:overflow-hidden lg:p-2.5">
            <div className="grid min-h-0 flex-1 content-start gap-1">
              <button
                className="focus-ring rounded-md bg-lime px-3 py-1.5 text-sm font-bold text-felt disabled:opacity-50"
                disabled={Boolean(state.winnerTeamId)}
                type="button"
                onClick={finishTurn}
              >
                Terminer le tour
              </button>
              {CRICKET_TARGETS.map((target) => (
                <div className="grid grid-cols-[52px_1fr] items-center gap-1" key={target}>
                  <strong className="text-base leading-none">{target}</strong>
                  <div className="grid grid-cols-3 gap-1">
                    {[1, 2, 3].map((multiplier) => (
                      <button
                        className="focus-ring rounded-md border border-line bg-felt px-2 py-1 text-sm font-bold hover:border-lime disabled:opacity-50"
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
                  <div className="grid grid-cols-[52px_1fr] items-center gap-1">
                    <strong className="text-base leading-none">Double</strong>
                    <button
                      className="focus-ring rounded-md border border-line bg-felt px-2 py-1 text-sm font-bold hover:border-lime disabled:opacity-50"
                      disabled={Boolean(state.winnerTeamId) || actions.length >= 3}
                      type="button"
                      onClick={() => addAction("Double", 1)}
                    >
                      x1
                    </button>
                  </div>
                  <div className="grid grid-cols-[52px_1fr] items-center gap-1">
                    <strong className="text-base leading-none">Triple</strong>
                    <button
                      className="focus-ring rounded-md border border-line bg-felt px-2 py-1 text-sm font-bold hover:border-lime disabled:opacity-50"
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

            <div className="mt-1.5 shrink-0 rounded-md border border-line bg-felt/70 px-2 py-1.5">
              <p className="text-[11px] leading-tight text-slate-400">Tour en saisie</p>
              <p className="truncate text-sm font-semibold leading-tight">
                {actions.length ? actions.map((action) => `${action.target} x${action.multiplier}`).join(", ") : "-"}
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <button
                  className="focus-ring rounded-md border border-line px-3 py-1 text-sm hover:border-lime disabled:opacity-50"
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
      </div>
      {state.winnerTeamId ? (
        <WinnerModal
          winnerName={state.teams.find((team) => team.id === state.winnerTeamId)?.name ?? "Equipe gagnante"}
          newGameHref="/setup?mode=cricket"
          onReplay={replaySameGame}
        />
      ) : null}
      <HitSplash splash={hitSplash} onDismiss={() => setHitSplash(null)} />
    </main>
  );
}

const TRIPLE_TWENTY_SPLASH: HitSplashConfig = {
  src: "/img/Triple.png",
  alt: "Triple 20",
  animation: "triple"
};

const BULL_SPLASH: HitSplashConfig = {
  src: "/img/BULL.png",
  alt: "Bull",
  animation: "bull"
};

const DOUBLE_BULL_SPLASH: HitSplashConfig = {
  src: "/img/Double%20bull%202.png",
  alt: "Double bull",
  animation: "double-bull"
};

const BLANK_TURN_SPLASH: HitSplashConfig = {
  src: "/img/Tour%20a%20blanc_.png",
  alt: "Tour a blanc",
  animation: "blank-turn"
};

function getCricketSplash(target: CricketHitTarget, multiplier: Multiplier) {
  if (target === "20" && multiplier === 3) {
    return TRIPLE_TWENTY_SPLASH;
  }
  if (target === "Bull" && multiplier === 2) {
    return DOUBLE_BULL_SPLASH;
  }
  if (target === "Bull") {
    return BULL_SPLASH;
  }
  return null;
}

function Header({ variant }: { variant: string }) {
  return (
    <header className="mb-2 flex flex-wrap items-end justify-between gap-2 lg:mb-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-lime">Partie en cours</p>
        <h1 className="text-xl font-black sm:text-2xl">Cricket - {variant}</h1>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Link className="focus-ring rounded-md border border-line px-2.5 py-1.5 text-sm hover:border-lime sm:px-3 sm:py-2 sm:text-base" href="/setup?mode=cricket">
          Nouvelle partie
        </Link>
        <Link className="focus-ring rounded-md border border-line px-2.5 py-1.5 text-sm hover:border-lime sm:px-3 sm:py-2 sm:text-base" href="/">
          Accueil
        </Link>
        <ThemeToggle />
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
