"use client";

import { CRICKET_TARGETS } from "@/lib/cricketLogic";
import type { CricketGameState } from "@/lib/types";

export function CricketScoreboard({ state }: { state: CricketGameState }) {
  return (
    <section className="min-h-0 overflow-hidden rounded-lg border border-line bg-panel/90">
      <div className="h-full">
        <table className="h-full w-full table-fixed border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-felt/80">
              <th className="w-24 px-3 py-1.5 text-slate-300">Cible</th>
              {state.teams.map((team, index) => (
                <th
                  className={`px-3 py-1.5 ${
                    index === state.activeTurn.teamIndex && !state.winnerTeamId
                      ? "bg-slate-400/25 text-lime"
                      : ""
                  }`}
                  key={team.id}
                >
                  <span className="block truncate">{team.name}</span>
                  {state.variant === "points" ? (
                    <span className="mt-1 inline-block rounded-md bg-felt px-2 py-0.5 text-xs text-amber">
                      {state.teamStates[team.id].points} pts
                    </span>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CRICKET_TARGETS.map((target) => (
              <tr className="border-b border-line/70" key={target}>
                <td className="px-3 py-1.5 text-lg font-bold text-slate-100">{target}</td>
                {state.teams.map((team, index) => (
                  <td
                    className={`px-3 py-1.5 ${index === state.activeTurn.teamIndex && !state.winnerTeamId ? "bg-slate-400/25" : ""}`}
                    key={team.id}
                  >
                    <Mark value={state.teamStates[team.id].marks[target]} />
                  </td>
                ))}
              </tr>
            ))}
            {state.variant === "advanced" ? (
              <>
                <tr className="border-b border-line/70 bg-felt/35">
                  <td className="px-3 py-1.5 text-lg font-bold text-slate-100">Doubles</td>
                  {state.teams.map((team, index) => (
                    <td
                      className={`px-3 py-1.5 ${index === state.activeTurn.teamIndex && !state.winnerTeamId ? "bg-slate-400/25" : ""}`}
                      key={team.id}
                    >
                      <Mark value={state.teamStates[team.id].doubles} />
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-line/70 bg-felt/35">
                  <td className="px-3 py-1.5 text-lg font-bold text-slate-100">Triples</td>
                  {state.teams.map((team, index) => (
                    <td
                      className={`px-3 py-1.5 ${index === state.activeTurn.teamIndex && !state.winnerTeamId ? "bg-slate-400/25" : ""}`}
                      key={team.id}
                    >
                      <Mark value={state.teamStates[team.id].triples} />
                    </td>
                  ))}
                </tr>
              </>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Mark({ value }: { value: number }) {
  const label = value <= 0 ? "" : value === 1 ? "/" : value === 2 ? "X" : "Ⓧ";
  return (
    <span
      aria-label={`${Math.min(value, 3)} marque(s)`}
      className={`inline-flex min-h-8 min-w-14 items-center justify-center rounded-md border px-2 py-0.5 text-xl font-black leading-none ${
        value >= 3 ? "border-lime bg-lime text-felt" : "border-line bg-felt text-slate-100"
      }`}
    >
      {label}
    </span>
  );
}
