"use client";

import { CRICKET_TARGETS } from "@/lib/cricketLogic";
import type { CricketGameState } from "@/lib/types";

export function CricketScoreboard({ state }: { state: CricketGameState }) {
  return (
    <section className="overflow-hidden rounded-lg border border-line bg-panel/90">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-felt/80">
              <th className="px-4 py-3 text-slate-300">Cible</th>
              {state.teams.map((team, index) => (
                <th
                  className={`px-4 py-3 ${index === state.activeTurn.teamIndex && !state.winnerTeamId ? "text-lime" : ""}`}
                  key={team.id}
                >
                  {team.name}
                  {state.variant === "points" ? (
                    <span className="ml-2 rounded-md bg-felt px-2 py-1 text-sm text-amber">
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
                <td className="px-4 py-4 text-xl font-bold text-slate-100">{target}</td>
                {state.teams.map((team) => (
                  <td className="px-4 py-4" key={team.id}>
                    <Mark value={state.teamStates[team.id].marks[target]} />
                  </td>
                ))}
              </tr>
            ))}
            {state.variant === "advanced" ? (
              <>
                <tr className="border-b border-line/70 bg-felt/35">
                  <td className="px-4 py-4 text-xl font-bold text-slate-100">Doubles</td>
                  {state.teams.map((team) => (
                    <td className="px-4 py-4" key={team.id}>
                      <Mark value={state.teamStates[team.id].doubles} />
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-line/70 bg-felt/35">
                  <td className="px-4 py-4 text-xl font-bold text-slate-100">Triples</td>
                  {state.teams.map((team) => (
                    <td className="px-4 py-4" key={team.id}>
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
      className={`inline-flex min-h-12 min-w-20 items-center justify-center rounded-md border px-3 py-2 text-3xl font-black leading-none ${
        value >= 3 ? "border-lime bg-lime text-felt" : "border-line bg-felt text-slate-100"
      }`}
    >
      {label}
    </span>
  );
}
