"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

  function goBack() {
    if (!state) {
      return;
    }
    if (darts.length > 0) {
      setDarts(darts.slice(0, -1));
      setMessage("");
      return;
    }
    setState(undoX01Turn(state));
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
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-8">
      <Header title={`X01 - ${state.options.startScore}`} />
      <div className="grid gap-6">
        <X01Scoreboard state={displayedState ?? state} />
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <section className="rounded-lg border border-line bg-panel/90 p-5">
            <div className="grid gap-4 xl:grid-cols-[1fr_260px]">
              <DartboardGrid disabled={Boolean(state.winnerTeamId) || darts.length >= 3} onPick={addDart} />
              <div className="rounded-lg border border-line bg-felt/70 p-4">
                <p className="text-sm text-slate-400">Tour en saisie</p>
                <p className="mt-2 min-h-9 text-lg font-semibold">
                  {darts.length ? darts.map((dart) => dart.label).join(", ") : "-"}
                </p>
                <p className="mt-2 text-4xl font-black text-lime">{dartTotal}</p>
                <div className="mt-4 grid gap-3">
                  <button
                    className="focus-ring rounded-md border border-line px-5 py-3 hover:border-lime disabled:opacity-50"
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
          <TurnHistory items={state.history} />
        </div>
      </div>
      {state.winnerTeamId ? (
        <WinnerModal
          winnerName={state.teams.find((team) => team.id === state.winnerTeamId)?.name ?? "Equipe gagnante"}
          newGameHref="/setup?mode=x01"
          onReplay={replaySameGame}
        />
      ) : null}
    </main>
  );
}

function DartboardGrid({
  disabled,
  onPick
}: {
  disabled: boolean;
  onPick: (dart: X01Dart) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <div className="grid grid-cols-[64px_repeat(3,minmax(0,1fr))] bg-felt/80 text-sm font-semibold text-slate-300">
        <div className="px-3 py-3">Cible</div>
        <div className="px-3 py-3 text-center">Simple</div>
        <div className="px-3 py-3 text-center">Double</div>
        <div className="px-3 py-3 text-center">Triple</div>
      </div>
      <button
        className="focus-ring grid w-full grid-cols-[64px_1fr] border-t border-line bg-panel px-3 py-3 text-left font-bold hover:bg-felt disabled:opacity-50"
        disabled={disabled}
        type="button"
        onClick={() => onPick({ label: "0", value: 0 })}
      >
        <span>0</span>
        <span className="text-center text-slate-300">Fleche manquee</span>
      </button>
      {X01_TARGETS.map((target) => (
        <div className="grid grid-cols-[64px_repeat(3,minmax(0,1fr))] border-t border-line" key={target}>
          <div className="bg-felt/70 px-3 py-2 text-lg font-bold">{target}</div>
          {[1, 2, 3].map((multiplier) => (
            <button
              className="focus-ring border-l border-line px-3 py-2 font-semibold hover:bg-felt disabled:opacity-50"
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
      ))}
      <div className="grid grid-cols-[64px_repeat(2,minmax(0,1fr))] border-t border-line">
        <div className="bg-felt/70 px-3 py-2 text-lg font-bold">Bull</div>
        <button
          className="focus-ring border-l border-line px-3 py-2 font-semibold hover:bg-felt disabled:opacity-50"
          disabled={disabled}
          type="button"
          onClick={() => onPick({ label: "SBull", value: 25 })}
        >
          25
        </button>
        <button
          className="focus-ring border-l border-line px-3 py-2 font-semibold hover:bg-felt disabled:opacity-50"
          disabled={disabled}
          type="button"
          onClick={() => onPick({ label: "DBull", value: 50 })}
        >
          50
        </button>
      </div>
    </div>
  );
}

function Header({ title }: { title: string }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-lime">Partie en cours</p>
        <h1 className="mt-2 text-4xl font-black">{title}</h1>
      </div>
      <div className="flex gap-3">
        <Link className="focus-ring rounded-md border border-line px-4 py-3 hover:border-lime" href="/setup?mode=x01">
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
      <h1 className="text-4xl font-black">Aucune partie X01 chargee</h1>
      <Link className="focus-ring mt-6 w-fit rounded-md bg-lime px-5 py-3 font-bold text-felt" href="/setup?mode=x01">
        Configurer une partie
      </Link>
    </main>
  );
}
