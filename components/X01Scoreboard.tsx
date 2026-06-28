"use client";

import type { X01GameState } from "@/lib/types";

export function X01Scoreboard({ state }: { state: X01GameState }) {
  return (
    <section className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
      {state.teams.map((team, index) => {
        const active = index === state.activeTurn.teamIndex && !state.winnerTeamId;
        const winner = state.winnerTeamId === team.id;
        return (
          <article
            className={`rounded-lg border p-3 shadow-lg ${
              winner
                ? "border-lime bg-lime text-felt"
                : active
                  ? "border-lime bg-slate-400/25"
                  : "border-line bg-panel/80"
            }`}
            key={team.id}
          >
            <p className="text-sm font-semibold uppercase tracking-wide opacity-75">{team.name}</p>
            <p className="text-4xl font-black">{state.scores[team.id]}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {team.players.map((player, playerIndex) => (
                <span
                  className={`rounded-md border px-2 py-0.5 text-xs ${
                    active && playerIndex === state.activeTurn.playerIndex
                      ? "border-lime bg-lime text-felt"
                      : "border-line bg-felt/70"
                  }`}
                  key={player.id}
                >
                  {player.name}
                </span>
              ))}
            </div>
          </article>
        );
      })}
    </section>
  );
}
