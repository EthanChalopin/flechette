"use client";

import { CRICKET_TARGETS } from "@/lib/cricketLogic";
import type { CricketGameState } from "@/lib/types";

export function CricketScoreboard({ state }: { state: CricketGameState }) {
  return (
    <section className="min-h-0 overflow-hidden rounded-lg border border-line bg-panel/90">
      <div className="h-full overflow-x-auto">
        <table className="h-full min-w-[420px] table-fixed border-collapse text-left sm:w-full sm:min-w-0">
          <thead>
            <tr className="border-b border-line bg-felt/80">
              <th className="w-16 px-2 py-1 text-sm text-slate-300 sm:w-24 sm:px-3 sm:py-1.5 sm:text-base">Cible</th>
              {state.teams.map((team, index) => (
                <th
                  className={`px-2 py-1 text-sm sm:px-3 sm:py-1.5 sm:text-base ${
                    index === state.activeTurn.teamIndex && !state.winnerTeamId
                      ? "bg-slate-400/25 text-lime"
                      : ""
                  }`}
                  key={team.id}
                >
                  <span className="block truncate">{team.name}</span>
                  {state.variant === "points" ? (
                    <span className="mt-0.5 inline-block rounded-md bg-felt px-1.5 py-0.5 text-[11px] text-amber sm:mt-1 sm:px-2 sm:text-xs">
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
                <td className="px-2 py-1 text-base font-bold text-slate-100 sm:px-3 sm:py-1.5 sm:text-lg">{target}</td>
                {state.teams.map((team, index) => (
                  <td
                    className={`px-2 py-1 sm:px-3 sm:py-1.5 ${index === state.activeTurn.teamIndex && !state.winnerTeamId ? "bg-slate-400/25" : ""}`}
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
                  <td className="px-2 py-1 text-base font-bold text-slate-100 sm:px-3 sm:py-1.5 sm:text-lg">Doubles</td>
                  {state.teams.map((team, index) => (
                    <td
                      className={`px-2 py-1 sm:px-3 sm:py-1.5 ${index === state.activeTurn.teamIndex && !state.winnerTeamId ? "bg-slate-400/25" : ""}`}
                      key={team.id}
                    >
                      <Mark value={state.teamStates[team.id].doubles} />
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-line/70 bg-felt/35">
                  <td className="px-2 py-1 text-base font-bold text-slate-100 sm:px-3 sm:py-1.5 sm:text-lg">Triples</td>
                  {state.teams.map((team, index) => (
                    <td
                      className={`px-2 py-1 sm:px-3 sm:py-1.5 ${index === state.activeTurn.teamIndex && !state.winnerTeamId ? "bg-slate-400/25" : ""}`}
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
      className={`inline-flex min-h-7 min-w-10 items-center justify-center rounded-md border px-1.5 py-0.5 text-lg font-black leading-none sm:min-h-8 sm:min-w-14 sm:px-2 sm:text-xl ${
        value >= 3 ? "border-lime bg-lime text-felt" : "border-line bg-felt text-slate-100"
      }`}
    >
      {label}
    </span>
  );
}
