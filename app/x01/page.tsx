"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { HitSplash, type HitSplashConfig } from "@/components/HitSplash";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TurnHistory } from "@/components/TurnHistory";
import { WinnerModal } from "@/components/WinnerModal";
import { X01Scoreboard } from "@/components/X01Scoreboard";
import { loadGame, saveGame } from "@/lib/storage";
import type { X01GameState } from "@/lib/types";
import { applyX01Turn, createX01Game, undoX01Turn } from "@/lib/x01Logic";

type X01Dart = {
  label: string;
  value: number;
};

const X01_TARGETS = Array.from({ length: 20 }, (_, index) => 20 - index);

export default function X01Page() {
  const [state, setState] = useState<X01GameState | null>(null);
  const [darts, setDarts] = useState<X01Dart[]>([]);
  const [message, setMessage] = useState("");
  const [hitSplash, setHitSplash] = useState<HitSplashConfig | null>(null);
  const dartTotal = useMemo(() => darts.reduce((total, dart) => total + dart.value, 0), [darts]);
  const displayedState = useMemo(() => {
    if (!state || darts.length === 0 || state.winnerTeamId) {
      return state;
    }

    const activeTeam = state.teams[state.activeTurn.teamIndex];
    const previousScore = state.scores[activeTeam.id];
    const nextScore = previousScore - dartTotal;

    return {
      ...state,
      scores: {
        ...state.scores,
        [activeTeam.id]: nextScore >= 0 ? nextScore : previousScore
      }
    };
  }, [dartTotal, darts.length, state]);

  useEffect(() => {
    setState(loadGame<X01GameState>("x01"));
  }, []);

  useEffect(() => {
    if (state) {
      saveGame(state);
    }
  }, [state]);

  function addDart(dart: X01Dart) {
    if (!state || darts.length >= 3 || state.winnerTeamId) {
      return;
    }
    const nextDarts = [...darts, dart];
    setMessage("");
    setHitSplash(getX01Splash(dart.label));

    if (nextDarts.length < 3) {
      setDarts(nextDarts);
      return;
    }

    const total = nextDarts.reduce((sum, nextDart) => sum + nextDart.value, 0);
    const nextState = applyX01Turn(
      state,
      total,
      nextDarts.map((nextDart) => nextDart.label)
    );
    setState(nextState);
    setDarts([]);
    setMessage(nextState.history[0]?.bust ? "Bust: le score reste identique." : "");
  }

  function finishTurn() {
    if (!state || state.winnerTeamId) {
      return;
    }

    const nextDarts = [...darts];
    while (nextDarts.length < 3) {
      nextDarts.push({ label: "0", value: 0 });
    }
    if (nextDarts.every((nextDart) => nextDart.label === "0")) {
      setHitSplash(BLANK_TURN_SPLASH);
    }

    const total = nextDarts.reduce((sum, nextDart) => sum + nextDart.value, 0);
    const nextState = applyX01Turn(
      state,
      total,
      nextDarts.map((nextDart) => nextDart.label)
    );
    setState(nextState);
    setDarts([]);
    setMessage(nextState.history[0]?.bust ? "Bust: le score reste identique." : "");
  }

  function goBack() {
    if (!state) {
      return;
    }
    if (darts.length > 0) {
      setDarts(darts.slice(0, -1));
      setMessage("");
      return;
    }

    const lastTurn = state.history[0];
    if (!lastTurn) {
      return;
    }

    const previousState = undoX01Turn(state);
    const restoredDarts = lastTurn.darts.slice(0, -1).map(dartFromLabel).filter((dart): dart is X01Dart => Boolean(dart));
    setState(previousState);
    setDarts(restoredDarts);
    setMessage("");
  }

  function replaySameGame() {
    if (!state) {
      return;
    }
    setState(createX01Game(state.teams, state.options));
    setDarts([]);
    setMessage("");
  }

  if (!state) {
    return <MissingGame />;
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-7xl flex-col overflow-y-auto px-2 py-2 sm:px-4 lg:h-dvh lg:overflow-hidden lg:px-3 lg:py-3">
      <Header title={`X01 - ${state.options.startScore}`} />
      <div className="grid min-h-0 flex-1 gap-2 lg:gap-3 lg:grid-rows-[auto_minmax(0,1fr)]">
        <X01Scoreboard state={displayedState ?? state} />
        <div className="grid min-h-0 gap-2 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-3">
          <section className="flex min-h-0 flex-col rounded-lg border border-line bg-panel/90 p-2 lg:overflow-hidden lg:p-3">
            <div className="grid min-h-0 flex-1 gap-2 xl:grid-cols-[1fr_220px] xl:gap-3">
              <DartboardGrid disabled={Boolean(state.winnerTeamId) || darts.length >= 3} onPick={addDart} />
              <div className="rounded-lg border border-line bg-felt/70 p-2 lg:self-start lg:p-3">
                <p className="text-xs text-slate-400">Tour en saisie</p>
                <p className="mt-0.5 min-h-6 text-sm font-semibold sm:text-base">
                  {darts.length ? darts.map((dart) => dart.label).join(", ") : "-"}
                </p>
                <p className="text-2xl font-black text-lime sm:text-3xl">{dartTotal}</p>
                <div className="mt-2 grid gap-1.5 sm:gap-2">
                  <button
                    className="focus-ring rounded-md bg-lime px-3 py-2 text-sm font-bold text-felt disabled:opacity-50 sm:px-4 sm:py-2.5 sm:text-base"
                    disabled={Boolean(state.winnerTeamId)}
                    type="button"
                    onClick={finishTurn}
                  >
                    Terminer le tour
                  </button>
                  <button
                    className="focus-ring rounded-md border border-line px-3 py-2 text-sm hover:border-lime disabled:opacity-50 sm:px-4 sm:py-2.5 sm:text-base"
                    disabled={darts.length === 0 && state.history.length === 0}
                    type="button"
                    onClick={goBack}
                  >
                    Revenir en arriere
                  </button>
                </div>
              </div>
            </div>
            {message ? <p className="mt-3 text-amber">{message}</p> : null}
          </section>
          <div className="hidden min-h-0 lg:block">
            <TurnHistory items={state.history} />
          </div>
        </div>
      </div>
      {state.winnerTeamId ? (
        <WinnerModal
          winnerName={state.teams.find((team) => team.id === state.winnerTeamId)?.name ?? "Equipe gagnante"}
          newGameHref="/setup?mode=x01"
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

function getX01Splash(label: string) {
  if (label === "T20") {
    return TRIPLE_TWENTY_SPLASH;
  }
  if (label === "SBull") {
    return BULL_SPLASH;
  }
  if (label === "DBull") {
    return DOUBLE_BULL_SPLASH;
  }
  return null;
}

function DartboardGrid({
  disabled,
  onPick
}: {
  disabled: boolean;
  onPick: (dart: X01Dart) => void;
}) {
  return (
    <div className="grid min-h-0 grid-cols-2 gap-1 sm:grid-cols-4 sm:gap-1.5 lg:grid-cols-5 2xl:grid-cols-7">
      {X01_TARGETS.map((target) => (
        <div className="rounded-md border border-line bg-felt/70 p-1 sm:p-1.5" key={target}>
          <div className="mb-0.5 text-center text-sm font-black sm:mb-1 sm:text-base">{target}</div>
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3].map((multiplier) => (
              <button
                className="focus-ring rounded-md border border-line bg-panel px-1 py-1 text-xs font-semibold hover:border-lime disabled:opacity-50 sm:px-1.5 sm:py-1.5 sm:text-sm"
                disabled={disabled}
                key={multiplier}
                type="button"
                onClick={() =>
                  onPick({
                    label: `${multiplier === 1 ? "S" : multiplier === 2 ? "D" : "T"}${target}`,
                    value: target * multiplier
                  })
                }
              >
                {target * multiplier}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="rounded-md border border-line bg-felt/70 p-1 sm:p-1.5">
        <div className="mb-0.5 text-center text-sm font-black sm:mb-1 sm:text-base">Bull</div>
        <div className="grid grid-cols-2 gap-1">
          <button
            className="focus-ring rounded-md border border-line bg-panel px-1 py-1 text-xs font-semibold hover:border-lime disabled:opacity-50 sm:px-1.5 sm:py-1.5 sm:text-sm"
            disabled={disabled}
            type="button"
            onClick={() => onPick({ label: "SBull", value: 25 })}
          >
            25
          </button>
          <button
            className="focus-ring rounded-md border border-line bg-panel px-1 py-1 text-xs font-semibold hover:border-lime disabled:opacity-50 sm:px-1.5 sm:py-1.5 sm:text-sm"
            disabled={disabled}
            type="button"
            onClick={() => onPick({ label: "DBull", value: 50 })}
          >
            50
          </button>
        </div>
      </div>
    </div>
  );
}

function dartFromLabel(label: string): X01Dart | null {
  if (label === "0") {
    return { label, value: 0 };
  }
  if (label === "SBull") {
    return { label, value: 25 };
  }
  if (label === "DBull") {
    return { label, value: 50 };
  }

  const multiplier = label[0] === "D" ? 2 : label[0] === "T" ? 3 : 1;
  const target = Number(label.slice(1));
  if (!Number.isInteger(target)) {
    return null;
  }

  return { label, value: target * multiplier };
}

function Header({ title }: { title: string }) {
  return (
    <header className="mb-2 flex flex-wrap items-end justify-between gap-2 lg:mb-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-lime">Partie en cours</p>
        <h1 className="text-xl font-black sm:text-2xl">{title}</h1>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Link className="focus-ring rounded-md border border-line px-2.5 py-1.5 text-sm hover:border-lime sm:px-3 sm:py-2 sm:text-base" href="/setup?mode=x01">
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
      <h1 className="text-4xl font-black">Aucune partie X01 chargee</h1>
      <Link className="focus-ring mt-6 w-fit rounded-md bg-lime px-5 py-3 font-bold text-felt" href="/setup?mode=x01">
        Configurer une partie
      </Link>
    </main>
  );
}
