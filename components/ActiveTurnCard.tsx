"use client";

import type { Team, TurnPointer } from "@/lib/types";
import { getActivePlayer, getActiveTeam } from "@/lib/turnLogic";

type Props = {
  teams: Team[];
  turn: TurnPointer;
  winnerTeamId?: string;
};

export function ActiveTurnCard({ teams, turn, winnerTeamId }: Props) {
  const activeTeam = getActiveTeam(teams, turn);
  const activePlayer = getActivePlayer(teams, turn);
  const winner = teams.find((team) => team.id === winnerTeamId);

  return (
    <section className="text-center">
      <p className="text-xs uppercase tracking-wide text-slate-400">{winner ? "Partie terminee" : "Tour actif"}</p>
      <h2 className="text-xl font-bold text-lime">{winner?.name ?? activeTeam?.name ?? "Equipe"}</h2>
      <p className="text-sm text-slate-200">{winner ? "Equipe gagnante" : activePlayer?.name ?? "Joueur"}</p>
    </section>
  );
}
