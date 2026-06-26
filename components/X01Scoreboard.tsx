"use client";

import type { X01GameState } from "@/lib/types";

export function X01Scoreboard({ state }: { state: X01GameState }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {state.teams.map((team, index) => {
        const active = index === state.activeTurn.teamIndex && !state.winnerTeamId;
        const winner = state.winnerTeamId === team.id;
        return (
          <article
            className={`rounded-lg border p-5 shadow-lg ${
              winner
                ? "border-lime bg-lime text-felt"
                : active
                  ? "border-lime bg-panel"
                  : "border-line bg-panel/80"
            }`}
            key={team.id}
          >
            <p className="text-sm font-semibold uppercase tracking-wide opacity-75">{team.name}</p>
            <p className="mt-2 text-6xl font-black">{state.scores[team.id]}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {team.players.map((player, playerIndex) => (
                <span
                  className={`rounded-md border px-3 py-1 text-sm ${
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
